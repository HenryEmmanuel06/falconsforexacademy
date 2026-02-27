import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendRegistrationSuccessEmail } from "@/lib/mailer";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function normalizePlan(plan: string) {
    return String(plan ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function toIsoTimestamp(value: unknown) {
    if (typeof value !== "string" || !value.trim()) return null;
    const d = new Date(value);
    return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}

async function getLatestSuccessfulPaymentByEmail(email: string) {
    const normalizedEmail = email.trim();

    const nairaQuery = supabaseAdmin
        .from("naira_payments")
        .select("email, status, plan, paid_at, created_at")
        .ilike("email", normalizedEmail)
        .eq("status", "success")
        .order("paid_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    const cryptoSuccessStatuses = ["finished", "confirmed", "paid", "success"];
    const cryptoQuery = supabaseAdmin
        .from("crypto_payments")
        .select("email, status, plan, updated_at, created_at")
        .ilike("email", normalizedEmail)
        .in("status", cryptoSuccessStatuses)
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    const [{ data: naira, error: nairaError }, { data: crypto, error: cryptoError }] = await Promise.all([
        nairaQuery,
        cryptoQuery,
    ]);

    if (nairaError) throw new Error(nairaError.message);
    if (cryptoError) throw new Error(cryptoError.message);

    const nairaTime = toIsoTimestamp((naira as any)?.paid_at) ?? toIsoTimestamp((naira as any)?.created_at);
    const cryptoTime =
        toIsoTimestamp((crypto as any)?.updated_at) ?? toIsoTimestamp((crypto as any)?.created_at);

    if (!naira && !crypto) return null;

    if (naira && crypto) {
        if (nairaTime && cryptoTime) {
            return new Date(cryptoTime).getTime() >= new Date(nairaTime).getTime()
                ? { source: "crypto" as const, row: crypto }
                : { source: "naira" as const, row: naira };
        }
        return cryptoTime ? { source: "crypto" as const, row: crypto } : { source: "naira" as const, row: naira };
    }

    return naira ? { source: "naira" as const, row: naira } : { source: "crypto" as const, row: crypto };
}

function sanitizeFileName(name: string) {
    return name
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9._-]/g, "");
}

async function uploadToBucket(params: { bucket: string; prefix: string; file: File }) {
    const { bucket, prefix, file } = params;

    if (!file || typeof file.arrayBuffer !== "function") {
        throw new Error("Invalid file");
    }

    if (file.size > MAX_FILE_BYTES) {
        throw new Error("File exceeds 10MB limit");
    }

    const id = crypto.randomUUID();
    const safeName = sanitizeFileName(file.name || "upload");
    const path = `${prefix}/${id}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
    });

    if (error) {
        throw new Error(error.message);
    }

    return { bucket, path };
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const fullName = String(formData.get("fullName") ?? "").trim();
        const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
        const gender = String(formData.get("gender") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const residentialAddress = String(formData.get("residentialAddress") ?? "").trim();
        const nationality = String(formData.get("nationality") ?? "").trim();
        const trainingLocation = String(formData.get("trainingLocation") ?? "").trim();
        const tradingLevel = String(formData.get("tradingLevel") ?? "").trim();

        const govId = formData.get("govId");
        const paymentProof = formData.get("paymentProof");
        const portrait = formData.get("portrait");

        if (!fullName) {
            return NextResponse.json({ error: "Full name is required" }, { status: 400 });
        }

        if (!/^\d{11}$/.test(phoneNumber)) {
            return NextResponse.json({ error: "Phone number must be exactly 11 digits" }, { status: 400 });
        }

        if (gender !== "Male" && gender !== "Female") {
            return NextResponse.json({ error: "Gender is required" }, { status: 400 });
        }

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const successfulPayment = await getLatestSuccessfulPaymentByEmail(email);
        if (!successfulPayment) {
            return NextResponse.json(
                { error: "You must complete a successful payment before you can register." },
                { status: 400 }
            );
        }

        const paidPlanRaw = String((successfulPayment as any)?.row?.plan ?? "").trim();
        const paidPlan = normalizePlan(paidPlanRaw);
        const signalsPlan = normalizePlan("Premium Signals");

        if (paidPlan === signalsPlan) {
            return NextResponse.json(
                { error: "Premium Signals payments are not eligible for registration." },
                { status: 400 }
            );
        }

        const allowedPlans = new Set([
            normalizePlan("1 Month Plan"),
            normalizePlan("3 Months Plan"),
            normalizePlan("6 Months Plan"),
            normalizePlan("1 Year Plan"),
            normalizePlan("One Year Plan"),
            normalizePlan("12 Months Plan"),
        ]);

        if (!allowedPlans.has(paidPlan)) {
            return NextResponse.json(
                { error: "Your payment plan is not eligible for registration." },
                { status: 400 }
            );
        }

        if (trainingLocation !== "Kano" && trainingLocation !== "Abuja") {
            return NextResponse.json({ error: "Training location is required" }, { status: 400 });
        }

        if (tradingLevel !== "Beginner" && tradingLevel !== "Intermediate" && tradingLevel !== "Advanced") {
            return NextResponse.json({ error: "Trading level is required" }, { status: 400 });
        }

        if (!(paymentProof instanceof File)) {
            return NextResponse.json({ error: "Proof of payment file is required" }, { status: 400 });
        }

        if (!(portrait instanceof File)) {
            return NextResponse.json({ error: "Portrait photo is required" }, { status: 400 });
        }

        const submittedAt = new Date().toISOString();
        const prefix = submittedAt.slice(0, 10);

        const [paymentUpload, portraitUpload] = await Promise.all([
            uploadToBucket({ bucket: "registration_payment_proofs", prefix, file: paymentProof }),
            uploadToBucket({ bucket: "registration_portraits", prefix, file: portrait }),
        ]);

        const govUpload = govId instanceof File ? await uploadToBucket({ bucket: "registration_gov_ids", prefix, file: govId }) : null;

        const insertPayload = {
            full_name: fullName,
            phone_number: phoneNumber,
            gender,
            email,
            residential_address: residentialAddress || null,
            nationality: nationality || null,
            training_location: trainingLocation,
            trading_level: tradingLevel,
            gov_id_bucket: govUpload?.bucket ?? null,
            gov_id_path: govUpload?.path ?? null,
            payment_proof_bucket: paymentUpload.bucket,
            payment_proof_path: paymentUpload.path,
            portrait_bucket: portraitUpload.bucket,
            portrait_path: portraitUpload.path,
            created_at: submittedAt,
        };

        const { data, error } = await supabaseAdmin
            .from("registrations")
            .insert(insertPayload)
            .select("id")
            .maybeSingle();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        try {
            await sendRegistrationSuccessEmail({
                to: email,
                fullName,
                trainingLocation,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error("[registrations] Failed to send registration success email:", message);
        }

        return NextResponse.json({ ok: true, id: (data as any)?.id ?? null });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
