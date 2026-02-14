import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
    try {
        const apiKey = process.env.NOWPAYMENTS_API_KEY;
        const baseUrl = process.env.NOWPAYMENTS_BASE_URL;

        if (!apiKey) {
            return NextResponse.json({ error: "NOWPAYMENTS_API_KEY is not set" }, { status: 500 });
        }

        if (!baseUrl) {
            return NextResponse.json({ error: "NOWPAYMENTS_BASE_URL is not set" }, { status: 500 });
        }

        const { searchParams } = new URL(req.url);
        const paymentId = searchParams.get("paymentId")?.trim();

        if (!paymentId) {
            return NextResponse.json({ error: "paymentId is required" }, { status: 400 });
        }

        const serverNow = new Date().toISOString();

        const statusRes = await fetch(`${baseUrl.replace(/\/$/, "")}/payment/${encodeURIComponent(paymentId)}`, {
            method: "GET",
            headers: {
                "x-api-key": apiKey,
            },
            cache: "no-store",
        });

        const statusJson = await statusRes.json().catch(() => null);

        if (!statusRes.ok || !statusJson) {
            return NextResponse.json(
                { error: (statusJson as any)?.message ?? "NOWPayments status lookup failed", details: statusJson },
                { status: 400 }
            );
        }

        const nowpaymentsStatus = String((statusJson as any).payment_status ?? "unknown");
        const nowpaymentsPaymentId = String((statusJson as any).payment_id ?? paymentId);

        const updatePayload: Record<string, any> = {
            status: nowpaymentsStatus,
            updated_at: serverNow,
        };

        if ((statusJson as any).pay_address) updatePayload.pay_address = (statusJson as any).pay_address;
        if ((statusJson as any).pay_amount != null) updatePayload.pay_amount = (statusJson as any).pay_amount;
        if ((statusJson as any).pay_currency) updatePayload.pay_currency = (statusJson as any).pay_currency;
        if ((statusJson as any).actually_paid != null) updatePayload.actually_paid = (statusJson as any).actually_paid;
        if ((statusJson as any).outcome_amount != null) updatePayload.outcome_amount = (statusJson as any).outcome_amount;
        if ((statusJson as any).outcome_currency) updatePayload.outcome_currency = (statusJson as any).outcome_currency;

        await supabaseAdmin
            .from("crypto_payments")
            .update(updatePayload)
            .eq("nowpayments_payment_id", nowpaymentsPaymentId);

        const { data: dbRow } = await supabaseAdmin
            .from("crypto_payments")
            .select("status, expires_at, actually_paid")
            .eq("nowpayments_payment_id", nowpaymentsPaymentId)
            .maybeSingle();

        return NextResponse.json({
            paymentId: nowpaymentsPaymentId,
            serverNow,
            dbStatus: (dbRow as any)?.status ?? nowpaymentsStatus,
            dbExpiresAt: (dbRow as any)?.expires_at ?? null,
            actuallyPaid: (dbRow as any)?.actually_paid ?? (statusJson as any).actually_paid ?? null,
            raw: statusJson,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
