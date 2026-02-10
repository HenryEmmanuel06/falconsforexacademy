import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");

    let verifiedStatus: string | null = null;

    if (reference) {
        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (secretKey) {
            try {
                const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${secretKey}`,
                        "Content-Type": "application/json",
                    },
                });

                const verifyJson = await verifyRes.json();

                if (verifyRes.ok && verifyJson?.status && verifyJson?.data) {
                    const paystackStatus = typeof verifyJson.data.status === "string" ? verifyJson.data.status : "unknown";
                    verifiedStatus = paystackStatus;
                    const gatewayResponse = typeof verifyJson.data.gateway_response === "string" ? verifyJson.data.gateway_response : null;
                    const paidAtRaw = verifyJson.data.paid_at;
                    const paidAt = typeof paidAtRaw === "string" ? paidAtRaw : null;

                    const updatePayload = {
                        status: paystackStatus,
                        gateway_response: gatewayResponse,
                        paid_at: paidAt,
                        raw_verify_response: verifyJson,
                    };

                    const { data: usdUpdated, error: usdUpdateError } = await supabaseAdmin
                        .from("dollar_payments")
                        .update(updatePayload)
                        .eq("paystack_reference", reference)
                        .select("id");

                    if (usdUpdateError || !usdUpdated || usdUpdated.length === 0) {
                        await supabaseAdmin
                            .from("naira_payments")
                            .update(updatePayload)
                            .eq("paystack_reference", reference);
                    }
                }
            } catch {
                // ignore verification errors; redirect still continues
            }
        }
    }

    const requestUrl = new URL(req.url);
    const callbackEnvUrl = process.env.PAYSTACK_CALLBACK_URL;
    const redirectOrigin = callbackEnvUrl ? new URL(callbackEnvUrl).origin : requestUrl.origin;
    const redirectPath = reference
        ? verifiedStatus
            ? verifiedStatus === "success"
                ? "/payment/success"
                : "/payment/failed"
            : "/payment/success"
        : "/payment/cancelled";
    const redirectUrl = new URL(redirectPath, redirectOrigin);

    if (reference) {
        redirectUrl.searchParams.set("reference", reference);
        if (verifiedStatus) {
            redirectUrl.searchParams.set("status", verifiedStatus);
        }
        redirectUrl.searchParams.set("payment", verifiedStatus === "success" ? "success" : verifiedStatus ? "failed" : "processing");
    } else {
        redirectUrl.searchParams.set("payment", "cancelled");
    }

    return NextResponse.redirect(redirectUrl);
}
