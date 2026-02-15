"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type NairaPaymentRow = {
    id: string;
    full_name: string | null;
    email: string | null;
    location: string | null;
    payment_type: string | null;
    amount_ngn: number | null;
    status: string | null;
    created_at: string;
};

type CryptoPaymentRow = {
    id: string;
    full_name: string | null;
    email: string | null;
    location: string | null;
    price_amount_usd: number | null;
    pay_currency: string | null;
    pay_amount: number | null;
    status: string | null;
    created_at: string;
};

type UnifiedPaymentRow = {
    paymentType: "Naira" | "Crypto";
    id: string;
    created_at: string;
    email: string | null;
    full_name: string | null;
    location: string | null;
    status: string | null;
    amount: string;
};

export default function AdminPaymentsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nairaPayments, setNairaPayments] = useState<NairaPaymentRow[]>([]);
    const [cryptoPayments, setCryptoPayments] = useState<CryptoPaymentRow[]>([]);
    const [filter, setFilter] = useState<"all" | "crypto" | "naira">("all");

    useEffect(() => {
        const load = async () => {
            try {
                setError(null);

                const [nairaRes, cryptoRes] = await Promise.all([
                    supabase
                        .from("naira_payments")
                        .select("id, full_name, email, location, payment_type, amount_ngn, status, created_at")
                        .order("created_at", { ascending: false })
                        .limit(500),
                    supabase
                        .from("crypto_payments")
                        .select("id, full_name, email, location, price_amount_usd, pay_currency, pay_amount, status, created_at")
                        .order("created_at", { ascending: false })
                        .limit(500),
                ]);

                if (nairaRes.error) {
                    setNairaPayments([]);
                    setError((prev) => prev ?? nairaRes.error?.message ?? "Failed to load naira payments");
                } else {
                    setNairaPayments(((nairaRes.data as any) ?? []) as NairaPaymentRow[]);
                }

                if (cryptoRes.error) {
                    setCryptoPayments([]);
                    setError((prev) => prev ?? cryptoRes.error?.message ?? "Failed to load crypto payments");
                } else {
                    setCryptoPayments(((cryptoRes.data as any) ?? []) as CryptoPaymentRow[]);
                }
            } catch (e) {
                const message = e instanceof Error ? e.message : "Failed to load payments";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const unified = useMemo<UnifiedPaymentRow[]>(() => {
        const ngn: UnifiedPaymentRow[] = nairaPayments.map((p) => {
            const amount = typeof p.amount_ngn === "number" ? `₦${p.amount_ngn.toLocaleString()}` : "₦—";
            return {
                paymentType: "Naira",
                id: p.id,
                created_at: p.created_at,
                email: p.email,
                full_name: p.full_name,
                location: p.location,
                status: p.status,
                amount,
            };
        });

        const crypto: UnifiedPaymentRow[] = cryptoPayments.map((p) => {
            const amount =
                typeof p.pay_amount === "number" && p.pay_currency
                    ? `${p.pay_amount} ${p.pay_currency}`
                    : typeof p.price_amount_usd === "number"
                      ? `$${p.price_amount_usd}`
                      : "—";

            return {
                paymentType: "Crypto",
                id: p.id,
                created_at: p.created_at,
                email: p.email,
                full_name: p.full_name,
                location: p.location,
                status: p.status,
                amount,
            };
        });

        const merged = [...ngn, ...crypto].sort((a, b) => {
            const ad = new Date(a.created_at).getTime();
            const bd = new Date(b.created_at).getTime();
            return bd - ad;
        });

        if (filter === "crypto") return merged.filter((p) => p.paymentType === "Crypto");
        if (filter === "naira") return merged.filter((p) => p.paymentType === "Naira");
        return merged;
    }, [cryptoPayments, filter, nairaPayments]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                <p className="text-sm text-gray-600 mt-1">Recent Paystack and NOWPayments transactions.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-md text-sm font-medium border ${
                        filter === "all" ? "bg-[#091B25] text-white border-[#091B25]" : "bg-white text-gray-800 border-gray-200"
                    }`}
                >
                    All
                </button>
                <button
                    type="button"
                    onClick={() => setFilter("crypto")}
                    className={`px-4 py-2 rounded-md text-sm font-medium border ${
                        filter === "crypto" ? "bg-[#091B25] text-white border-[#091B25]" : "bg-white text-gray-800 border-gray-200"
                    }`}
                >
                    Crypto
                </button>
                <button
                    type="button"
                    onClick={() => setFilter("naira")}
                    className={`px-4 py-2 rounded-md text-sm font-medium border ${
                        filter === "naira" ? "bg-[#091B25] text-white border-[#091B25]" : "bg-white text-gray-800 border-gray-200"
                    }`}
                >
                    Naira
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#091B25]"></div>
                </div>
            ) : (
                <>
                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
                    ) : null}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {unified.map((p) => (
                                    <tr key={`${p.paymentType}-${p.id}`}>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            {new Date(p.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{p.full_name || "—"}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{p.email || "—"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{p.location || "—"}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{p.paymentType}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{p.amount}</td>
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                {p.status || "—"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
            )}
        </div>
    );
}
