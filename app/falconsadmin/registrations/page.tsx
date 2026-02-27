"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type RegistrationRow = {
    id: string;
    full_name: string;
    phone_number: string;
    gender: string;
    email: string;
    residential_address: string | null;
    nationality: string | null;
    training_location: string;
    trading_level: string;
    gov_id_bucket: string | null;
    gov_id_path: string | null;
    payment_proof_bucket: string;
    payment_proof_path: string;
    portrait_bucket: string;
    portrait_path: string;
    created_at: string;
};

async function openSignedFile(bucket: string, path: string) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);
    if (error || !data?.signedUrl) {
        throw new Error(error?.message ?? "Unable to create file link");
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}

export default function AdminRegistrationsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rows, setRows] = useState<RegistrationRow[]>([]);
    const [selected, setSelected] = useState<RegistrationRow | null>(null);

    const selectedDetails = useMemo(() => {
        if (!selected) return [] as Array<{ label: string; value: string }>;
        return [
            { label: "Full Name", value: selected.full_name },
            { label: "Email", value: selected.email },
            { label: "Phone", value: selected.phone_number },
            { label: "Gender", value: selected.gender },
            { label: "Nationality", value: selected.nationality ?? "—" },
            { label: "Residential Address", value: selected.residential_address ?? "—" },
            { label: "Training Location", value: selected.training_location },
            { label: "Trading Level", value: selected.trading_level },
            { label: "Submitted", value: new Date(selected.created_at).toLocaleString() },
        ];
    }, [selected]);

    useEffect(() => {
        const load = async () => {
            try {
                setError(null);
                const res = await supabase
                    .from("registrations")
                    .select(
                        "id, full_name, phone_number, gender, email, residential_address, nationality, training_location, trading_level, gov_id_bucket, gov_id_path, payment_proof_bucket, payment_proof_path, portrait_bucket, portrait_path, created_at"
                    )
                    .order("created_at", { ascending: false })
                    .limit(500);

                if (res.error) {
                    setRows([]);
                    setError(res.error.message ?? "Failed to load registrations");
                    return;
                }

                setRows(((res.data as any) ?? []) as RegistrationRow[]);
            } catch (e) {
                const message = e instanceof Error ? e.message : "Failed to load registrations";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelected(null);
            }
        };

        if (selected) {
            window.addEventListener("keydown", onKeyDown);
            return () => window.removeEventListener("keydown", onKeyDown);
        }
    }, [selected]);

    useEffect(() => {
        if (!selected) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [selected]);

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-[22px] font-semibold text-[#091B25]">Registrations</h1>
                    <p className="text-[13px] text-gray-600 pt-1">Latest training registration submissions.</p>
                </div>
            </div>

            {loading ? (
                <div className="min-h-[260px] flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#091B25]"></div>
                </div>
            ) : error ? (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : rows.length === 0 ? (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-600">
                    No registrations found.
                </div>
            ) : (
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-[1100px] w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-gray-700">
                                    <th className="px-4 py-3 font-semibold">Submitted</th>
                                    <th className="px-4 py-3 font-semibold">Full Name</th>
                                    <th className="px-4 py-3 font-semibold">Email</th>
                                    <th className="px-4 py-3 font-semibold">Phone</th>
                                    <th className="px-4 py-3 font-semibold">Location</th>
                                    <th className="px-4 py-3 font-semibold">Level</th>
                                    <th className="px-4 py-3 font-semibold">Files</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelected(r)}
                                    >
                                        <td className="px-4 py-3 text-gray-600">
                                            {new Date(r.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-[#091B25]">{r.full_name}</div>
                                            <div className="text-[12px] text-gray-500 pt-1">
                                                {r.gender}
                                                {r.nationality ? ` • ${r.nationality}` : ""}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{r.email}</td>
                                        <td className="px-4 py-3 text-gray-700">{r.phone_number}</td>
                                        <td className="px-4 py-3 text-gray-700">{r.training_location}</td>
                                        <td className="px-4 py-3 text-gray-700">{r.trading_level}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (!r.gov_id_bucket || !r.gov_id_path) return;
                                                        await openSignedFile(r.gov_id_bucket, r.gov_id_path);
                                                    }}
                                                    disabled={!r.gov_id_bucket || !r.gov_id_path}
                                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[12px] font-semibold text-[#091B25] hover:bg-gray-50"
                                                >
                                                    Gov ID
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        await openSignedFile(r.payment_proof_bucket, r.payment_proof_path);
                                                    }}
                                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[12px] font-semibold text-[#091B25] hover:bg-gray-50"
                                                >
                                                    Payment Proof
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        await openSignedFile(r.portrait_bucket, r.portrait_path);
                                                    }}
                                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[12px] font-semibold text-[#091B25] hover:bg-gray-50"
                                                >
                                                    Portrait
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onMouseDown={() => setSelected(null)}
                >
                    <div
                        className="w-full max-w-[760px] max-h-[calc(100vh-64px)] overflow-y-auto rounded-[18px] bg-white shadow-xl border border-gray-200"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
                            <div>
                                <h2 className="text-[18px] font-semibold text-[#091B25]">Registration Details</h2>
                                <p className="text-[12px] text-gray-600 pt-1">{selected.full_name}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[12px] font-semibold text-[#091B25] hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>

                        <div className="px-5 py-5 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedDetails.map((item) => (
                                    <div key={item.label} className="rounded-[14px] border border-gray-200 bg-gray-50 px-4 py-3">
                                        <div className="text-[11px] font-semibold text-gray-600">{item.label}</div>
                                        <div className="pt-1 text-[14px] text-[#091B25] break-words">{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 rounded-[14px] border border-gray-200 bg-white px-4 py-4">
                                <div className="text-[12px] font-semibold text-gray-700">Files</div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!selected.gov_id_bucket || !selected.gov_id_path) return;
                                            await openSignedFile(selected.gov_id_bucket, selected.gov_id_path);
                                        }}
                                        disabled={!selected.gov_id_bucket || !selected.gov_id_path}
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[12px] font-semibold text-[#091B25] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Gov ID
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            await openSignedFile(selected.payment_proof_bucket, selected.payment_proof_path);
                                        }}
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[12px] font-semibold text-[#091B25] hover:bg-gray-50"
                                    >
                                        Payment Proof
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            await openSignedFile(selected.portrait_bucket, selected.portrait_path);
                                        }}
                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[12px] font-semibold text-[#091B25] hover:bg-gray-50"
                                    >
                                        Portrait
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
