import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

    return NextResponse.json({ ok: true });
}
