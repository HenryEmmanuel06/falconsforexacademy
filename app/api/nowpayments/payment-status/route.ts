import { NextResponse } from "next/server";
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

        const { data: beforeRow } = await supabaseAdmin
            .from("crypto_payments")
            .select("status, actually_paid, pay_amount, email, full_name, plan, location")
            .eq("nowpayments_payment_id", nowpaymentsPaymentId)
            .maybeSingle();

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

        const computedPayAmount =
            (updatePayload as any).pay_amount ??
            (beforeRow as any)?.pay_amount ??
            (statusJson as any).pay_amount ??
            (statusJson as any).price_amount ??
            null;

        const paymentState = computeNowpaymentsPaidStatus(
            nowpaymentsStatus,
            (updatePayload as any).actually_paid ?? (statusJson as any).actually_paid,
            computedPayAmount
        );

        if (paymentState.isUnderpaid) {
            updatePayload.status = "underpaid";
        }

        await supabaseAdmin
            .from("crypto_payments")
            .update(updatePayload)
            .eq("nowpayments_payment_id", nowpaymentsPaymentId);

        const { data: dbRow } = await supabaseAdmin
            .from("crypto_payments")
            .select("status, expires_at, actually_paid, pay_amount, email, full_name, plan, location")
            .eq("nowpayments_payment_id", nowpaymentsPaymentId)
            .maybeSingle();

        const beforePaid = computeNowpaymentsPaidStatus(
            (beforeRow as any)?.status,
            (beforeRow as any)?.actually_paid,
            (beforeRow as any)?.pay_amount
        ).isPaid;

        const afterPaid = computeNowpaymentsPaidStatus(
            (dbRow as any)?.status ?? updatePayload.status,
            (dbRow as any)?.actually_paid ?? (updatePayload as any).actually_paid ?? (statusJson as any).actually_paid,
            (dbRow as any)?.pay_amount ?? computedPayAmount
        ).isPaid;

        if (afterPaid && !beforePaid) {
            const to = String((dbRow as any)?.email ?? (beforeRow as any)?.email ?? "").trim();
            const plan = String((dbRow as any)?.plan ?? (beforeRow as any)?.plan ?? "").trim();
            const location = String((dbRow as any)?.location ?? (beforeRow as any)?.location ?? "").trim();
            const fullName = (dbRow as any)?.full_name ?? (beforeRow as any)?.full_name ?? null;

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
                    console.error("[nowpayments/payment-status] Failed to send payment success email:", message);
                }
            }
        }

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
