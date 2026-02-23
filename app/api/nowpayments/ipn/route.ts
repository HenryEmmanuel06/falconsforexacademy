import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendPaymentSuccessEmail } from "@/lib/mailer";

function isNowpaymentsPaid(statusRaw: unknown, actuallyPaidRaw: unknown) {
    const status = String(statusRaw ?? "").toLowerCase();
    const actuallyPaid =
        typeof actuallyPaidRaw === "number"
            ? actuallyPaidRaw
            : typeof actuallyPaidRaw === "string"
              ? Number(actuallyPaidRaw)
              : 0;

    if (status === "finished") return true;
    if (status === "confirmed" && Number.isFinite(actuallyPaid) && actuallyPaid > 0) return true;
    return false;
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
        .select("status, actually_paid, email, full_name, plan, location")
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

    const { error: updateError } = await supabaseAdmin
        .from("crypto_payments")
        .update(updatePayload)
        .eq("nowpayments_payment_id", paymentId);

    if (updateError) {
        return NextResponse.json({ error: "Failed to update crypto payment", details: updateError.message }, { status: 500 });
    }

    const { data: afterRow } = await supabaseAdmin
        .from("crypto_payments")
        .select("status, actually_paid, email, full_name, plan, location")
        .eq("nowpayments_payment_id", paymentId)
        .maybeSingle();

    const beforePaid = isNowpaymentsPaid((beforeRow as any)?.status, (beforeRow as any)?.actually_paid);
    const afterPaid = isNowpaymentsPaid((afterRow as any)?.status ?? status, (afterRow as any)?.actually_paid ?? payload?.actually_paid);

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
            } catch {
                // ignore email errors; IPN should still return ok
            }
        }
    }

    return NextResponse.json({ ok: true });
}
