"use client";

import { useEffect, useState } from "react";
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
    gov_id_bucket: string;
    gov_id_path: string;
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
                                    <tr key={r.id} className="border-t border-gray-100">
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
                                                    onClick={async () => {
                                                        await openSignedFile(r.gov_id_bucket, r.gov_id_path);
                                                    }}
                                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[12px] font-semibold text-[#091B25] hover:bg-gray-50"
                                                >
                                                    Gov ID
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        await openSignedFile(r.payment_proof_bucket, r.payment_proof_path);
                                                    }}
                                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-[12px] font-semibold text-[#091B25] hover:bg-gray-50"
                                                >
                                                    Payment Proof
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
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
        </div>
    );
}
