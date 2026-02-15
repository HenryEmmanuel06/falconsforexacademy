"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FalconsAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Let the login page render without redirect loop.
            if (pathname === "/falconsadmin/login") {
                setCheckingAuth(false);
                return;
            }

            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.push("/falconsadmin/login");
                return;
            }
            setCheckingAuth(false);
        };

        checkAuth();
    }, [pathname, router]);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.push("/falconsadmin/login");
        } catch {
            // ignore
        }
    };

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#091B25]"></div>
            </div>
        );
    }

    // Login page should not show sidebar chrome
    if (pathname === "/falconsadmin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-[260px] bg-[#091B25] text-white hidden md:flex flex-col">
                <div className="px-6 py-6 border-b border-white/10">
                    <p className="text-lg font-semibold">Falcons Admin</p>
                    <p className="text-sm text-white/70">Dashboard</p>
                </div>

                <nav className="px-4 py-4 flex-1">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/falconsadmin/dashboard"
                                className={`block rounded-lg px-4 py-3 text-sm font-medium hover:bg-white/10 ${
                                    isActive("/falconsadmin/dashboard") ? "bg-white/10" : ""
                                }`}
                            >
                                Blogs
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/falconsadmin/payments"
                                className={`block rounded-lg px-4 py-3 text-sm font-medium hover:bg-white/10 ${
                                    isActive("/falconsadmin/payments") ? "bg-white/10" : ""
                                }`}
                            >
                                Payments
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="px-4 py-4 border-t border-white/10">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg px-4 py-3 text-sm font-medium hover:bg-white/10"
                    >
                        View site
                    </a>
                    <button
                        onClick={handleLogout}
                        className="mt-2 w-full rounded-lg px-4 py-3 text-sm font-medium bg-red-600 hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 min-w-0">
                <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#091B25]">Falcons Admin</p>
                        <button
                            onClick={handleLogout}
                            className="rounded-md px-3 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                    <div className="mt-3 flex gap-3">
                        <Link
                            href="/falconsadmin/dashboard"
                            className={`text-sm font-medium ${isActive("/falconsadmin/dashboard") ? "underline" : ""}`}
                        >
                            Blogs
                        </Link>
                        <Link
                            href="/falconsadmin/payments"
                            className={`text-sm font-medium ${isActive("/falconsadmin/payments") ? "underline" : ""}`}
                        >
                            Payments
                        </Link>
                    </div>
                </header>

                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
