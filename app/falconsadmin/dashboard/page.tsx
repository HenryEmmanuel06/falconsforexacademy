"use client";

import { useEffect, useState } from "react";
import BlogList from "@/components/admin/BlogList";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [blogCount, setBlogCount] = useState<number>(0);
  const [nairaPaymentsCount, setNairaPaymentsCount] = useState<number>(0);
  const [cryptoPaymentsCount, setCryptoPaymentsCount] = useState<number>(0);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [{ count: blogs }, { count: naira }, { count: crypto }] = await Promise.all([
          supabase.from("blogs").select("id", { count: "exact", head: true }),
          supabase.from("naira_payments").select("id", { count: "exact", head: true }),
          supabase.from("crypto_payments").select("id", { count: "exact", head: true }),
        ]);

        setBlogCount(blogs ?? 0);
        setNairaPaymentsCount(naira ?? 0);
        setCryptoPaymentsCount(crypto ?? 0);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#091B25]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Overview of your content and payments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-600">Total Blogs</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{blogCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-600">Naira Payments</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{nairaPaymentsCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-600">Crypto Payments</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{cryptoPaymentsCount}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <BlogList />
      </div>
    </div>
  );
}
