import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type CreateCryptoPaymentBody = {
    email?: string;
    fullName?: string;
    plan?: string;
    location?: string;
    payCurrency?: "BTC" | "BNB" | "LTC" | "USDT";
};

const PLAN_AMOUNTS_USD: Record<string, number> = {
    "1 Month Plan": 150,
    "3 Months Plan": 250,
    "6 Months Plan": 450,
    "Premium Signals": 100,
};

export async function POST(req: Request) {
    try {
        const apiKey = process.env.NOWPAYMENTS_API_KEY;
        const baseUrl = process.env.NOWPAYMENTS_BASE_URL;

        if (!apiKey) {
            return NextResponse.json({ error: "NOWPAYMENTS_API_KEY is not set" }, { status: 500 });
        }

        if (!baseUrl) {
            return NextResponse.json({ error: "NOWPAYMENTS_BASE_URL is not set" }, { status: 500 });
        }

        const body = (await req.json()) as CreateCryptoPaymentBody;
        const email = body.email?.trim();
        const fullName = body.fullName?.trim() ?? "";
        const plan = body.plan?.trim();
        const location = body.location?.trim() ?? "";
        const payCurrency = body.payCurrency ?? "BTC";

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        if (!plan) {
            return NextResponse.json({ error: "Plan is required" }, { status: 400 });
        }

        const amountUsd = PLAN_AMOUNTS_USD[plan];
        if (!amountUsd) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        const expiresAt = new Date(Date.now() + 20 * 60 * 1000).toISOString();
        const orderId = `ffa-${Date.now()}-${Math.random().toString(16).slice(2)}`;

        const createRes = await fetch(`${baseUrl.replace(/\/$/, "")}/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            body: JSON.stringify({
                price_amount: amountUsd,
                price_currency: "usd",
                pay_currency: payCurrency,
                order_id: orderId,
                order_description: `${plan} - FalconsForexAcademy`,
            }),
        });

        const createJson = await createRes.json().catch(() => null);

        if (!createRes.ok || !createJson) {
            return NextResponse.json(
                {
                    error: (createJson as any)?.message ?? "NOWPayments create payment failed",
                    details: createJson,
                },
                { status: 400 }
            );
        }

        const paymentId = createJson.payment_id;
        const payAddress = createJson.pay_address;
        const payAmount = createJson.pay_amount;
        const payCurrencyResp = createJson.pay_currency;

        if (!paymentId || !payAddress || !payAmount) {
            return NextResponse.json(
                { error: "NOWPayments returned incomplete wallet details", details: createJson },
                { status: 400 }
            );
        }

        const { error: insertError } = await supabaseAdmin.from("crypto_payments").insert({
            full_name: fullName,
            email,
            location,
            plan,
            price_amount_usd: amountUsd,
            pay_currency: payCurrencyResp ?? payCurrency,
            pay_amount: payAmount,
            pay_address: payAddress,
            nowpayments_payment_id: paymentId,
            status: createJson.payment_status ?? "waiting",
            expires_at: expiresAt,
            raw_create_response: createJson,
        });

        if (insertError) {
            return NextResponse.json(
                { error: "Failed to create crypto payment record", details: insertError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            paymentId,
            payAddress,
            payAmount,
            payCurrency: payCurrencyResp ?? payCurrency,
            expiresAt,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
