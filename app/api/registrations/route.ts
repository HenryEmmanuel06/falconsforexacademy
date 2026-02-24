import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

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

        if (trainingLocation !== "Kano" && trainingLocation !== "Abuja") {
            return NextResponse.json({ error: "Training location is required" }, { status: 400 });
        }

        if (tradingLevel !== "Beginner" && tradingLevel !== "Intermediate" && tradingLevel !== "Advanced") {
            return NextResponse.json({ error: "Trading level is required" }, { status: 400 });
        }

        if (!(govId instanceof File)) {
            return NextResponse.json({ error: "Valid government ID file is required" }, { status: 400 });
        }

        if (!(paymentProof instanceof File)) {
            return NextResponse.json({ error: "Proof of payment file is required" }, { status: 400 });
        }

        if (!(portrait instanceof File)) {
            return NextResponse.json({ error: "Portrait photo is required" }, { status: 400 });
        }

        const submittedAt = new Date().toISOString();
        const prefix = submittedAt.slice(0, 10);

        const [govUpload, paymentUpload, portraitUpload] = await Promise.all([
            uploadToBucket({ bucket: "registration_gov_ids", prefix, file: govId }),
            uploadToBucket({ bucket: "registration_payment_proofs", prefix, file: paymentProof }),
            uploadToBucket({ bucket: "registration_portraits", prefix, file: portrait }),
        ]);

        const insertPayload = {
            full_name: fullName,
            phone_number: phoneNumber,
            gender,
            email,
            residential_address: residentialAddress || null,
            nationality: nationality || null,
            training_location: trainingLocation,
            trading_level: tradingLevel,
            gov_id_bucket: govUpload.bucket,
            gov_id_path: govUpload.path,
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

        return NextResponse.json({ ok: true, id: (data as any)?.id ?? null });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
