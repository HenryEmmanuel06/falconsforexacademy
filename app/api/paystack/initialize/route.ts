import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type InitializeRequestBody = {
    email?: string;
    fullName?: string;
    plan?: string;
    location?: string;
    paymentOption?: "USD" | "Naira" | "Crypto";
};

const PLAN_AMOUNTS_USD: Record<string, number> = {
    "1 Month Plan": 150,
    "3 Months Plan": 250,
    "6 Months Plan": 450,
    "Premium Signals": 100,
};

const adminRate = 1480;

export async function POST(req: Request) {
    try {
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        const callbackUrl = process.env.PAYSTACK_CALLBACK_URL;

        if (!secretKey) {
            return NextResponse.json({ error: "PAYSTACK_SECRET_KEY is not set" }, { status: 500 });
        }

        if (!callbackUrl) {
            return NextResponse.json({ error: "PAYSTACK_CALLBACK_URL is not set" }, { status: 500 });
        }

        const body = (await req.json()) as InitializeRequestBody;
        const email = body.email?.trim();
        const plan = body.plan?.trim();
        const paymentOption = body.paymentOption ?? "USD";
        const fullName = body.fullName?.trim() ?? "";
        const location = body.location?.trim() ?? "";

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

        if (paymentOption === "Crypto") {
            return NextResponse.json({ error: "Crypto payment is not available yet" }, { status: 400 });
        }

        const currency = paymentOption === "Naira" ? "NGN" : "USD";
        const amount =
            paymentOption === "Naira"
                ? Math.round(amountUsd * adminRate * 100)
                : Math.round(amountUsd * 100);

        const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                amount,
                currency,
                callback_url: callbackUrl,
                metadata: {
                    fullName: body.fullName ?? "",
                    plan,
                    location: body.location ?? "",
                    paymentOption,
                },
            }),
        });

        const paystackJson = await paystackRes.json();

        if (!paystackRes.ok || !paystackJson?.status) {
            return NextResponse.json(
                {
                    error: paystackJson?.message ?? "Paystack initialization failed",
                    details: paystackJson,
                },
                { status: 400 }
            );
        }

        const reference: string | undefined = paystackJson?.data?.reference;
        const authorizationUrl: string | undefined = paystackJson?.data?.authorization_url;
        const accessCode: string | undefined = paystackJson?.data?.access_code;

        if (!reference || !authorizationUrl) {
            return NextResponse.json(
                { error: "Paystack initialization returned incomplete data", details: paystackJson },
                { status: 400 }
            );
        }

        if (paymentOption === "Naira") {
            const amountNgn = amountUsd * adminRate;
            const { error: insertError } = await supabaseAdmin.from("naira_payments").insert({
                full_name: fullName,
                email,
                location,
                payment_type: "Naira",
                plan,
                amount_usd: amountUsd,
                admin_rate: adminRate,
                amount_ngn: amountNgn,
                paystack_reference: reference,
                paystack_access_code: accessCode ?? null,
                authorization_url: authorizationUrl,
                currency,
                amount_minor: amount,
                status: "initialized",
                raw_initialize_response: paystackJson,
            });

            if (insertError) {
                return NextResponse.json(
                    { error: "Failed to create payment record", details: insertError.message },
                    { status: 500 }
                );
            }
        } else {
            const { error: insertError } = await supabaseAdmin.from("dollar_payments").insert({
                full_name: fullName,
                email,
                location,
                payment_type: "USD",
                plan,
                amount_usd: amountUsd,
                paystack_reference: reference,
                paystack_access_code: accessCode ?? null,
                authorization_url: authorizationUrl,
                currency,
                amount_minor: amount,
                status: "initialized",
                raw_initialize_response: paystackJson,
            });

            if (insertError) {
                return NextResponse.json(
                    { error: "Failed to create payment record", details: insertError.message },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ authorization_url: authorizationUrl, reference });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
