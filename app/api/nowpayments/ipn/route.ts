import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendPaymentSuccessEmail } from "@/lib/mailer";

function toNumber(value: unknown) {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
    }
    return 0;
}

function computeNowpaymentsPaidStatus(statusRaw: unknown, actuallyPaidRaw: unknown, payAmountRaw: unknown) {
    const status = String(statusRaw ?? "").toLowerCase();
    const actuallyPaid = toNumber(actuallyPaidRaw);
    const payAmount = toNumber(payAmountRaw);

    const isTerminalPaidState = status === "finished" || status === "confirmed";
    const isPaid = isTerminalPaidState && payAmount > 0 && actuallyPaid >= payAmount;
    const isUnderpaid = isTerminalPaidState && payAmount > 0 && actuallyPaid > 0 && actuallyPaid < payAmount;

    return { isPaid, isUnderpaid };
}

function safeEqualHex(a: string, b: string) {
    const aa = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (aa.length !== bb.length) return false;
    return crypto.timingSafeEqual(aa, bb);
}

export async function POST(req: Request) {
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

    if (!ipnSecret) {
        return NextResponse.json({ error: "NOWPAYMENTS_IPN_SECRET is not set" }, { status: 500 });
    }

    const signatureHeader =
        req.headers.get("x-nowpayments-sig") ??
        req.headers.get("x-nowpayments-signature") ??
        req.headers.get("nowpayments-sig");

    if (!signatureHeader) {
        return NextResponse.json({ error: "Missing NOWPayments signature header" }, { status: 401 });
    }

    const rawBody = await req.text();

    const computedSig = crypto.createHmac("sha512", ipnSecret).update(rawBody).digest("hex");

    if (!safeEqualHex(computedSig, signatureHeader)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let payload: any;
    try {
        payload = JSON.parse(rawBody);
    } catch {
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const paymentId = payload?.payment_id;
    const status = typeof payload?.payment_status === "string" ? payload.payment_status : null;

    if (!paymentId) {
        return NextResponse.json({ error: "Missing payment_id" }, { status: 400 });
    }

    const { data: beforeRow } = await supabaseAdmin
        .from("crypto_payments")
        .select("status, actually_paid, pay_amount, email, full_name, plan, location")
        .eq("nowpayments_payment_id", paymentId)
        .maybeSingle();

    const updatePayload: Record<string, any> = {
        status: status ?? "unknown",
        updated_at: new Date().toISOString(),
        raw_ipn_payload: payload,
    };

    if (typeof payload?.pay_address === "string") updatePayload.pay_address = payload.pay_address;
    if (typeof payload?.pay_amount === "number") updatePayload.pay_amount = payload.pay_amount;
    if (typeof payload?.pay_currency === "string") updatePayload.pay_currency = payload.pay_currency;
    if (typeof payload?.actually_paid === "number") updatePayload.actually_paid = payload.actually_paid;
    if (typeof payload?.outcome_amount === "number") updatePayload.outcome_amount = payload.outcome_amount;
    if (typeof payload?.outcome_currency === "string") updatePayload.outcome_currency = payload.outcome_currency;

    const computedPayAmount =
        (updatePayload as any).pay_amount ??
        (beforeRow as any)?.pay_amount ??
        payload?.pay_amount ??
        payload?.price_amount ??
        null;

    const paymentState = computeNowpaymentsPaidStatus(
        status,
        (updatePayload as any).actually_paid ?? payload?.actually_paid,
        computedPayAmount
    );

    if (paymentState.isUnderpaid) {
        updatePayload.status = "underpaid";
    }

    const { error: updateError } = await supabaseAdmin
        .from("crypto_payments")
        .update(updatePayload)
        .eq("nowpayments_payment_id", paymentId);

    if (updateError) {
        return NextResponse.json({ error: "Failed to update crypto payment", details: updateError.message }, { status: 500 });
    }

    const { data: afterRow } = await supabaseAdmin
        .from("crypto_payments")
        .select("status, actually_paid, pay_amount, email, full_name, plan, location")
        .eq("nowpayments_payment_id", paymentId)
        .maybeSingle();

    const beforePaid = computeNowpaymentsPaidStatus(
        (beforeRow as any)?.status,
        (beforeRow as any)?.actually_paid,
        (beforeRow as any)?.pay_amount
    ).isPaid;

    const afterPaid = computeNowpaymentsPaidStatus(
        (afterRow as any)?.status ?? updatePayload.status,
        (afterRow as any)?.actually_paid ?? (updatePayload as any).actually_paid ?? payload?.actually_paid,
        (afterRow as any)?.pay_amount ?? computedPayAmount
    ).isPaid;

    if (afterPaid && !beforePaid) {
        const to = String((afterRow as any)?.email ?? (beforeRow as any)?.email ?? "").trim();
        const plan = String((afterRow as any)?.plan ?? (beforeRow as any)?.plan ?? "").trim();
        const location = String((afterRow as any)?.location ?? (beforeRow as any)?.location ?? "").trim();
        const fullName = (afterRow as any)?.full_name ?? (beforeRow as any)?.full_name ?? null;

        if (to && plan && location) {
            try {
                await sendPaymentSuccessEmail({
                    to,
                    fullName,
                    plan,
                    location,
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                console.error("[nowpayments/ipn] Failed to send payment success email:", message);
            }
        }
    }

    return NextResponse.json({ ok: true });
}
