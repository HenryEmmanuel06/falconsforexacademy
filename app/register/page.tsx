"use client";

import { useMemo, useState } from "react";

type FormState = {
    fullName: string;
    phoneNumber: string;
    gender: "Male" | "Female" | "";
    email: string;
    residentialAddress: string;
    nationality: string;
    trainingLocation: "Kano" | "Abuja" | "";
    tradingLevel: "Beginner" | "Intermediate" | "Advanced" | "";
    govIdFile: File | null;
    paymentProofFile: File | null;
    portraitFile: File | null;
};

export default function RegisterPage() {
    const [form, setForm] = useState<FormState>({
        fullName: "",
        phoneNumber: "",
        gender: "",
        email: "",
        residentialAddress: "",
        nationality: "",
        trainingLocation: "",
        tradingLevel: "",
        govIdFile: null,
        paymentProofFile: null,
        portraitFile: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const canSubmit = useMemo(() => {
        if (!form.fullName.trim()) return false;
        if (!/^\d{11}$/.test(form.phoneNumber)) return false;
        if (!form.gender) return false;
        if (!form.email.trim()) return false;
        if (!form.trainingLocation) return false;
        if (!form.tradingLevel) return false;
        if (!form.paymentProofFile) return false;
        if (!form.portraitFile) return false;
        return true;
    }, [form]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(false);

        if (!canSubmit) {
            setSubmitError("Please complete all required fields correctly.");
            return;
        }

        try {
            setIsSubmitting(true);

            const fd = new FormData();
            fd.set("fullName", form.fullName);
            fd.set("phoneNumber", form.phoneNumber);
            fd.set("gender", form.gender);
            fd.set("email", form.email);
            fd.set("residentialAddress", form.residentialAddress);
            fd.set("nationality", form.nationality);
            fd.set("trainingLocation", form.trainingLocation);
            fd.set("tradingLevel", form.tradingLevel);
            if (form.govIdFile) fd.set("govId", form.govIdFile);
            if (form.paymentProofFile) fd.set("paymentProof", form.paymentProofFile);
            if (form.portraitFile) fd.set("portrait", form.portraitFile);

            const res = await fetch("/api/registrations", {
                method: "POST",
                body: fd,
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setSubmitError(data?.error ?? "Registration submission failed");
                return;
            }

            setSubmitSuccess(true);
            setForm({
                fullName: "",
                phoneNumber: "",
                gender: "",
                email: "",
                residentialAddress: "",
                nationality: "",
                trainingLocation: "",
                tradingLevel: "",
                govIdFile: null,
                paymentProofFile: null,
                portraitFile: null,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-160px)] bg-[#F7FAFC] text-[#091B25]">
            <section className="py-[40px] md:py-[70px]">
                <div className="container">
                    <div className="mx-auto w-full max-w-[720px]">
                        <div className="rounded-[22px] border border-[#EAECF0] bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)] overflow-hidden">
                            <div className="px-[22px] py-[22px] md:px-[30px] md:py-[26px] bg-gradient-to-r from-[#091B25] to-[#123040] text-white">
                                <h1 className="text-[22px] md:text-[26px] font-semibold">Register for Training</h1>
                                <p className="pt-[6px] text-[13px] md:text-[14px] text-white/80">
                                    Fill the form below and upload the required documents. We’ll review and get back to you.
                                </p>
                            </div>

                            <form onSubmit={onSubmit} className="px-[22px] py-[22px] md:px-[30px] md:py-[28px]">
                                {submitError && (
                                    <div className="mb-[16px] rounded-[14px] border border-red-200 bg-red-50 px-[14px] py-[12px] text-[13px] text-red-700">
                                        {submitError}
                                    </div>
                                )}

                                {submitSuccess && (
                                    <div className="mb-[16px] rounded-[14px] border border-green-200 bg-green-50 px-[14px] py-[12px] text-[13px] text-green-700">
                                        Registration submitted successfully.
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                    <div className="md:col-span-2">
                                        <label className="block text-[13px] font-semibold text-[#091B25]">Full Name</label>
                                        <input
                                            value={form.fullName}
                                            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                                            className="mt-[8px] w-full rounded-[14px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#091B25]/20"
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-semibold text-[#091B25]">Phone Number / WhatsApp</label>
                                        <input
                                            value={form.phoneNumber}
                                            onChange={(e) => {
                                                const digitsOnly = e.target.value.replace(/\D/g, "");
                                                setForm((p) => ({ ...p, phoneNumber: digitsOnly.slice(0, 11) }));
                                            }}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={11}
                                            className="mt-[8px] w-full rounded-[14px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#091B25]/20"
                                            placeholder="11-digit phone number"
                                            required
                                        />
                                        <p className="mt-[6px] text-[12px] text-[#667085]">Must be exactly 11 digits.</p>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-semibold text-[#091B25]">Email Address</label>
                                        <input
                                            value={form.email}
                                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                            type="email"
                                            className="mt-[8px] w-full rounded-[14px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#091B25]/20"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-[13px] font-semibold text-[#091B25]">Gender</label>
                                        <div className="mt-[10px] flex flex-wrap gap-4">
                                            {(["Male", "Female"] as const).map((g) => (
                                                <label
                                                    key={g}
                                                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] cursor-pointer transition-colors ${
                                                        form.gender === g ? "border-[#091B25] bg-[#091B25] text-white" : "border-[#D0D5DD] bg-white text-[#091B25]"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value={g}
                                                        checked={form.gender === g}
                                                        onChange={() => setForm((p) => ({ ...p, gender: g }))}
                                                        className="hidden"
                                                    />
                                                    {g}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-[13px] font-semibold text-[#091B25]">Residential Address</label>
                                        <input
                                            value={form.residentialAddress}
                                            onChange={(e) => setForm((p) => ({ ...p, residentialAddress: e.target.value }))}
                                            className="mt-[8px] w-full rounded-[14px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#091B25]/20"
                                            placeholder="Your address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-semibold text-[#091B25]">Nationality</label>
                                        <input
                                            value={form.nationality}
                                            onChange={(e) => setForm((p) => ({ ...p, nationality: e.target.value }))}
                                            className="mt-[8px] w-full rounded-[14px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] outline-none focus:ring-2 focus:ring-[#091B25]/20"
                                            placeholder="Nationality"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-semibold text-[#091B25]">Training Location</label>
                                        <select
                                            value={form.trainingLocation}
                                            onChange={(e) => setForm((p) => ({ ...p, trainingLocation: e.target.value as FormState["trainingLocation"] }))}
                                            className="mt-[8px] w-full rounded-[14px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] outline-none bg-white focus:ring-2 focus:ring-[#091B25]/20"
                                            required
                                        >
                                            <option value="" disabled>
                                                Select location
                                            </option>
                                            <option value="Kano">Kano</option>
                                            <option value="Abuja">Abuja</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-[13px] font-semibold text-[#091B25]">Current Trading Level</label>
                                        <div className="mt-[10px] flex flex-wrap gap-3">
                                            {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                                                <label
                                                    key={lvl}
                                                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] cursor-pointer transition-colors ${
                                                        form.tradingLevel === lvl
                                                            ? "border-[#091B25] bg-[#091B25] text-white"
                                                            : "border-[#D0D5DD] bg-white text-[#091B25]"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="tradingLevel"
                                                        value={lvl}
                                                        checked={form.tradingLevel === lvl}
                                                        onChange={() => setForm((p) => ({ ...p, tradingLevel: lvl }))}
                                                        className="hidden"
                                                    />
                                                    {lvl}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-[14px]">
                                        <div className="rounded-[16px] border border-[#EAECF0] bg-[#F9FAFB] p-[14px]">
                                            <p className="text-[13px] font-semibold">Valid Government ID</p>
                                            <p className="pt-[4px] text-[12px] text-[#667085]">PDF, image or document. Max 10MB.</p>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf,.doc,.docx"
                                                onChange={(e) => setForm((p) => ({ ...p, govIdFile: e.target.files?.[0] ?? null }))}
                                                className="mt-[10px] block w-full text-[12px]"
                                            />
                                        </div>

                                        <div className="rounded-[16px] border border-[#EAECF0] bg-[#F9FAFB] p-[14px]">
                                            <p className="text-[13px] font-semibold">Proof of Payment</p>
                                            <p className="pt-[4px] text-[12px] text-[#667085]">Receipt/screenshot. Max 10MB.</p>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={(e) => setForm((p) => ({ ...p, paymentProofFile: e.target.files?.[0] ?? null }))}
                                                className="mt-[10px] block w-full text-[12px]"
                                                required
                                            />
                                        </div>

                                        <div className="rounded-[16px] border border-[#EAECF0] bg-[#F9FAFB] p-[14px]">
                                            <p className="text-[13px] font-semibold">Portrait Photo</p>
                                            <p className="pt-[4px] text-[12px] text-[#667085]">For student ID card. Max 10MB.</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setForm((p) => ({ ...p, portraitFile: e.target.files?.[0] ?? null }))}
                                                className="mt-[10px] block w-full text-[12px]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-[18px] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <p className="text-[12px] text-[#667085]">By submitting, you confirm the details are correct.</p>
                                    <button
                                        type="submit"
                                        disabled={!canSubmit || isSubmitting}
                                        className={`rounded-full px-8 py-3 text-[13px] font-semibold transition-colors ${
                                            !canSubmit || isSubmitting
                                                ? "bg-[#091B25]/50 text-white cursor-not-allowed"
                                                : "bg-[#091B25] text-white hover:bg-zinc-800"
                                        }`}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Registration"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
