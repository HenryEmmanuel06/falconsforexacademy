"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Pricing() {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>("1 Month Plan");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [emailValidationStatus, setEmailValidationStatus] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
    const [emailValidationMessage, setEmailValidationMessage] = useState<string | null>(null);
    const [paymentOption, setPaymentOption] = useState<"Naira" | "Crypto">("Naira");
    const [cryptoCoin, setCryptoCoin] = useState<"BTC" | "BNB" | "LTC" | "USDT">("BTC");
    const [location, setLocation] = useState<"Kano" | "Abuja">("Abuja");
    const [isProceeding, setIsProceeding] = useState(false);
    const [proceedError, setProceedError] = useState<string | null>(null);

    const [cryptoCheckout, setCryptoCheckout] = useState<null | {
        paymentId: string;
        payAddress: string;
        payAmount: string;
        payCurrency: string;
        expiresAt: string;
    }>(null);
    const [cryptoSecondsLeft, setCryptoSecondsLeft] = useState<number | null>(null);
    const [cryptoPaymentStatus, setCryptoPaymentStatus] = useState<string | null>(null);
    const [isPollingCryptoStatus, setIsPollingCryptoStatus] = useState(false);
    const [cryptoServerOffsetMs, setCryptoServerOffsetMs] = useState<number>(0);

    const planLabel = useMemo(() => selectedPlan, [selectedPlan]);

    const openModal = (plan: string) => {
        setSelectedPlan(plan);
        setProceedError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCryptoCheckout(null);
        setCryptoPaymentStatus(null);
    };

    const isFormFilled = useMemo(() => {
        if (!fullName.trim()) return false;
        if (!email.trim()) return false;
        if (!selectedPlan.trim()) return false;
        if (!location.trim()) return false;
        if (!paymentOption.trim()) return false;
        return true;
    }, [email, fullName, location, paymentOption, selectedPlan]);

    const canProceed = useMemo(() => {
        return isFormFilled && emailValidationStatus === "valid" && !isProceeding;
    }, [emailValidationStatus, isFormFilled, isProceeding]);

    const handleProceed = async () => {
        setProceedError(null);

        if (!fullName.trim()) {
            setProceedError("Full name is required");
            return;
        }

        if (!email.trim()) {
            setProceedError("Email address is required");
            return;
        }

        try {
            setIsProceeding(true);

            if (paymentOption === "Crypto") {
                const res = await fetch("/api/nowpayments/create-payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        fullName,
                        plan: selectedPlan,
                        location,
                        payCurrency: cryptoCoin,
                    }),
                });

                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    setProceedError(data?.error ?? "Failed to initialize crypto payment");
                    return;
                }

                if (!data?.payAddress || !data?.payAmount || !data?.expiresAt || !data?.paymentId) {
                    setProceedError("Crypto initialization failed: missing wallet details");
                    return;
                }

                setCryptoCheckout({
                    paymentId: String(data.paymentId),
                    payAddress: String(data.payAddress),
                    payAmount: String(data.payAmount),
                    payCurrency: String(data.payCurrency ?? cryptoCoin),
                    expiresAt: String(data.expiresAt),
                });
            } else {
                const res = await fetch("/api/paystack/initialize", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        fullName,
                        plan: selectedPlan,
                        location,
                        paymentOption,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setProceedError(data?.error ?? "Failed to initialize payment");
                    return;
                }

                if (!data?.authorization_url) {
                    setProceedError("Payment initialization failed: missing authorization URL");
                    return;
                }

                window.location.href = data.authorization_url;
            }
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setProceedError(message);
        } finally {
            setIsProceeding(false);
        }
    };

    useEffect(() => {
        if (!cryptoCheckout?.expiresAt) {
            setCryptoSecondsLeft(null);
            return;
        }

        const expiresAtMs = new Date(cryptoCheckout.expiresAt).getTime();

        const update = () => {
            const now = Date.now() + cryptoServerOffsetMs;
            const seconds = Math.max(0, Math.floor((expiresAtMs - now) / 1000));
            setCryptoSecondsLeft(seconds);
        };

        update();
        const id = window.setInterval(update, 1000);
        return () => window.clearInterval(id);
    }, [cryptoCheckout?.expiresAt, cryptoServerOffsetMs]);

    useEffect(() => {
        if (!cryptoCheckout?.paymentId) {
            setCryptoPaymentStatus(null);
            return;
        }

        if (typeof cryptoSecondsLeft === "number" && cryptoSecondsLeft <= 0) {
            setCryptoPaymentStatus("expired");
            return;
        }

        let stopped = false;
        let intervalId: number | null = null;

        const poll = async () => {
            if (stopped) return;
            setIsPollingCryptoStatus(true);
            try {
                const res = await fetch(`/api/nowpayments/payment-status?paymentId=${encodeURIComponent(cryptoCheckout.paymentId)}`, {
                    method: "GET",
                    cache: "no-store",
                });
                const data = await res.json().catch(() => null);
                if (!res.ok || !data) return;

                if (data.serverNow) {
                    const serverNowMs = new Date(String(data.serverNow)).getTime();
                    if (Number.isFinite(serverNowMs)) {
                        setCryptoServerOffsetMs(serverNowMs - Date.now());
                    }
                }

                if (data.dbExpiresAt) {
                    const dbExpiresAt = String(data.dbExpiresAt);
                    if (dbExpiresAt && dbExpiresAt !== cryptoCheckout.expiresAt) {
                        setCryptoCheckout((prev) => (prev ? { ...prev, expiresAt: dbExpiresAt } : prev));
                    }
                }

                const dbStatusRaw = data.dbStatus ?? "unknown";
                const status = String(dbStatusRaw).toLowerCase();
                setCryptoPaymentStatus(String(dbStatusRaw));

                const actuallyPaidRaw = (data as any).actuallyPaid;
                const actuallyPaid =
                    typeof actuallyPaidRaw === "number"
                        ? actuallyPaidRaw
                        : typeof actuallyPaidRaw === "string"
                          ? Number(actuallyPaidRaw)
                          : 0;

                const isPaid = Number.isFinite(actuallyPaid) && actuallyPaid > 0;

                if (status === "finished" || (status === "confirmed" && isPaid)) {
                    stopped = true;
                    if (intervalId) window.clearInterval(intervalId);
                    setCryptoCheckout(null);
                    router.push(`/payment/success?paymentId=${encodeURIComponent(String(cryptoCheckout.paymentId))}&provider=nowpayments`);
                }

                const failureStatuses = new Set(["failed", "refunded", "expired", "cancelled", "canceled"]);
                if (failureStatuses.has(status)) {
                    stopped = true;
                    if (intervalId) window.clearInterval(intervalId);
                    setCryptoCheckout(null);
                    router.push(
                        `/payment/failed?paymentId=${encodeURIComponent(String(cryptoCheckout.paymentId))}&status=${encodeURIComponent(status)}&provider=nowpayments`
                    );
                }
            } catch {
                // ignore polling errors
            } finally {
                if (!stopped) setIsPollingCryptoStatus(false);
            }
        };

        poll();
        intervalId = window.setInterval(poll, 5000);

        return () => {
            stopped = true;
            if (intervalId) window.clearInterval(intervalId);
            setIsPollingCryptoStatus(false);
        };
    }, [cryptoCheckout?.paymentId, cryptoSecondsLeft, router]);

    useEffect(() => {
        if (!isModalOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isModalOpen]);

    useEffect(() => {
        if (!isModalOpen) return;

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setEmailValidationStatus("idle");
            setEmailValidationMessage(null);
            return;
        }

        setEmailValidationStatus("validating");
        setEmailValidationMessage(null);

        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            try {
                const res = await fetch(`/api/validate-email?email=${encodeURIComponent(trimmedEmail)}`, {
                    method: "GET",
                    signal: controller.signal,
                });

                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    setEmailValidationStatus("invalid");
                    setEmailValidationMessage("Email validation failed");
                    return;
                }

                if (data?.valid === true) {
                    setEmailValidationStatus("valid");
                    setEmailValidationMessage(null);
                } else {
                    setEmailValidationStatus("invalid");
                    setEmailValidationMessage("Please enter a valid email");
                }
            } catch (e) {
                if (controller.signal.aborted) return;
                setEmailValidationStatus("invalid");
                setEmailValidationMessage("Email validation failed");
            }
        }, 2000);

        return () => {
            controller.abort();
            window.clearTimeout(timeoutId);
        };
    }, [email, isModalOpen]);

    return (
        <section className="py-[50px] md:py-[70px] lg:py-[100px] bg-[#091B25]">
            <div className="container">
                <h2 className="text-[28px] md:text-[32px] lg:text-[40px] text-center text-white font-medium">Simple, Transparent Pricing</h2>
                <p className="text-[18px] md:text-[20px] text-center text-white font-normal max-w-[570px] mx-auto">Whether monthly or lifetime, at Falconsforexacademy we got a program for you.</p>
                <div className="pt-[40px] md:pt-[80px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[35px]">
                        {/* <!-- Card --> */}
                        <div className="border-[5px] flex flex-col rounded-[30px] py-[40px] px-[30px] border-[#CC5DF980] bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.22)_0%,rgba(168,85,247,0.12)_25%,rgba(168,85,247,0.05)_45%,transparent_60%),linear-gradient(180deg,#ffffff_0%,#ffffff_100%)]">

                            {/* <!-- Icon --> */}
                            <div className="w-[40px] h-[40px] flex items-center justify-center rounded-[5px] bg-[#CC5DF9] mb-[20px]">
                                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.55 16.2L11.725 10H7.725L8.45 4.325L3.825 11H7.3L6.55 16.2ZM4 20L5 13H0L9 0H11L10 8H16L6 20H4Z" fill="white" />
                                </svg>

                            </div>

                            {/* <!-- Title --> */}
                            <h2 className="text-[18px] md:text-[20px] font-bold text-[#091B25]">1 Month Plan</h2>

                            {/* <!-- Price --> */}
                            <div className="">
                                <span className="text-[30px] md:text-[36px] font-bold text-[#CC5DF9]">$150</span>
                                <span className="text-[14px] md:text-[16px] font-medium text-[#091B25]">/Monthly</span>
                            </div>

                            {/* <!-- Divider --> */}
                            <div className="w-full h-[2px] bg-[#CC5DF9] mt-[10px]"></div>

                            {/* <!-- Payments --> */}
                            <p className="text-[14px] font-bold text-[#091B25] pt-[14px] pb-[30px]">
                                Payments available on:
                                <span className="inline-flex items-center gap-2 ml-2">
                                    <span className="text-white bg-[#CC5DF9] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#CC5DF9] font-bold">₿</span>
                                    <span className="text-white bg-[#CC5DF9] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#CC5DF9] font-bold">₦</span>
                                </span>
                            </p>

                            {/* <!-- Features --> */}
                            <ul className="space-y-3 text-sm text-[#091B25]">
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Physical ClassNameroom Trainings
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Live Market Breakdown & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Price Action Trade Setups & Entry Models
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Market Structure & Candlestick Analysis
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Risk Management & Trading Psychology Basics
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Physical Q&A Session
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Market Analysis
                                </li>
                            </ul>
                            <div className="pt-[40px] md:pt-[90px] mt-auto">
                                {/* <!-- Button --> */}
                                <button
                                    onClick={() => openModal("1 Month Plan")}
                                    className="w-full mt-auto py-3 rounded-full border-2 border-[#CC5DF9] text-[#CC5DF9] font-medium hover:bg-[#CC5DF9] hover:text-white transition cursor-pointer"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>



                        {/* <!-- Card --> */}
                        <div className="mt-auto h-full border-[5px] flex flex-col rounded-[30px] py-[40px] px-[30px] border-[#091B2580]  bg-[radial-gradient(circle_at_top_right,rgba(9,27,37,0.22)_0%,rgba(9,27,37,0.12)_25%,rgba(9,27,37,0.05)_45%,transparent_60%),linear-gradient(180deg,#ffffff_0%,#ffffff_100%)]">

                            {/* <!-- Icon --> */}
                            <div className="w-[40px] h-[40px] flex items-center justify-center rounded-[5px] bg-[#091B25] mb-[20px]">
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.78704 19.25L6.31204 14.65L1.71204 12.175L3.48704 10.425L7.11204 11.05L9.66204 8.5L1.73704 5.125L3.83704 2.975L13.462 4.675L16.562 1.575C16.9454 1.19167 17.4204 1 17.987 1C18.5537 1 19.0287 1.19167 19.412 1.575C19.7954 1.95833 19.987 2.42917 19.987 2.9875C19.987 3.54583 19.7954 4.01667 19.412 4.4L16.287 7.525L17.987 17.125L15.862 19.25L12.462 11.325L9.91204 13.875L10.562 17.475L8.78704 19.25Z" stroke="white" strokeWidth="2" />
                                </svg>


                            </div>

                            {/* <!-- Title --> */}
                            <h2 className="text-[18px] md:text-[20px] font-bold text-[#091B25]">3 Months Plan</h2>

                            {/* <!-- Price --> */}
                            <div className="">
                                <span className="text-[30px] md:text-[36px] font-bold text-[#091B25]">$250</span>
                                <span className="text-[14px] md:text-[16px] font-medium text-[#091B25]">/Quarterly</span>
                            </div>

                            {/* <!-- Divider --> */}
                            <div className="w-full h-[2px] bg-[#091B25] mt-[10px]"></div>

                            {/* <!-- Payments --> */}
                            <p className="text-[14px] font-bold text-[#091B25] pt-[14px] pb-[30px]">
                                Payments available on:
                                <span className="inline-flex items-center gap-2 ml-2">
                                    <span className="text-white bg-[#091B25] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#091B25] font-bold">₿</span>
                                    <span className="text-white bg-[#091B25] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#091B25] font-bold">₦</span>
                                </span>
                            </p>

                            {/* <!-- Features --> */}
                            <ul className="space-y-3 text-sm text-[#091B25]">
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Physical ClassNameroom Trainings
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Live Market Breakdown & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Market & Advanced Top-Down Analysis
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Advanced Price Action Setups & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Market Structure, Trend & Key Level Identification
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Advanced Risk Management & Psychology
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Physical Q&A Session
                                </li>
                            </ul>
                            <div className="pt-[40px] md:pt-[90px]">
                                {/* <!-- Button --> */}
                                <button
                                    onClick={() => openModal("3 Months Plan")}
                                    className="mt-auto w-full py-3 rounded-full border-2 border-[#091B25] text-[#091B25] font-medium hover:bg-[#091B25] hover:text-white transition cursor-pointer"
                                >
                                    Get Started
                                </button>
                            </div>


                        </div>




                        {/* <!-- Card --> */}
                        <div className="border-[5px] flex flex-col rounded-[30px] py-[40px] px-[30px] border-[#FF851380] md:col-span-2 lg:col-span-1 bg-[radial-gradient(circle_at_top_right,rgba(255,133,19,0.22)_0%,rgba(255,133,19,0.12)_25%,rgba(255,133,19,0.05)_45%,transparent_60%),linear-gradient(180deg,#ffffff_0%,#ffffff_100%)]">

                            {/* <!-- Icon --> */}
                            <div className="w-[40px] h-[40px] flex items-center justify-center rounded-[5px] bg-[#FF8513] mb-[20px]">
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.78704 19.25L6.31204 14.65L1.71204 12.175L3.48704 10.425L7.11204 11.05L9.66204 8.5L1.73704 5.125L3.83704 2.975L13.462 4.675L16.562 1.575C16.9454 1.19167 17.4204 1 17.987 1C18.5537 1 19.0287 1.19167 19.412 1.575C19.7954 1.95833 19.987 2.42917 19.987 2.9875C19.987 3.54583 19.7954 4.01667 19.412 4.4L16.287 7.525L17.987 17.125L15.862 19.25L12.462 11.325L9.91204 13.875L10.562 17.475L8.78704 19.25Z" stroke="white" strokeWidth="2" />
                                </svg>


                            </div>

                            {/* <!-- Title --> */}
                            <h2 className="text-[18px] md:text-[20px] font-bold text-[#091B25]">6 Months Plan</h2>

                            {/* <!-- Price --> */}
                            <div className="">
                                <span className="text-[30px] md:text-[36px] font-bold text-[#FF8513]">$450</span>
                                <span className="text-[14px] md:text-[16px] font-medium text-[#091B25]">/Biannual</span>
                            </div>

                            {/* <!-- Divider --> */}
                            <div className="w-full h-[2px] bg-[#091B25] mt-[10px]"></div>

                            {/* <!-- Payments --> */}
                            <p className="text-[14px] font-bold text-[#091B25] pt-[14px] pb-[30px]">
                                Payments available on:
                                <span className="inline-flex items-center gap-2 ml-2">
                                    <span className="text-white bg-[#FF8513] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#FF8513] font-bold">₿</span>
                                    <span className="text-white bg-[#FF8513] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#FF8513] font-bold">₦</span>
                                </span>
                            </p>

                            {/* <!-- Features --> */}
                            <ul className="space-y-3 text-sm text-[#091B25]">
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Physical ClassNameroom Trainings
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Live Market Breakdown & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Market & Advanced Top-Down Analysis
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Advanced Price Action Setups & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Market Structure, Trend & Key Level Identification
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Advanced Risk Management & Psychology
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Physical Q&A & Trade Review Sessions
                                </li>
                            </ul>
                            <div className="pt-[40px] md:pt-[90px]">
                                {/* <!-- Button --> */}
                                <button
                                    onClick={() => openModal("6 Months Plan")}
                                    className="mt-auto w-full py-3 rounded-full border-2 border-[#FF8513] text-[#FF8513] font-medium hover:bg-[#FF8513] hover:text-white transition cursor-pointer"
                                >
                                    Get Started
                                </button>
                            </div>


                        </div>
                    </div>
                </div>

                <div className="bg-[#CED8DD] pt-[40px] md:pt-[55px] px-[30px] md:px-[38px] pb-[30px] md:pb-[60px] border-5 border-[#ffff] text-[#091B25] mt-[35px] rounded-[30px]">
                    <div className="flex gap-[0px] flex-col lg:flex-row">
                        <div>
                            <h3 className="text-[22px] md:text-[28px] text-[#AD6500] font-bold">Premium Signals</h3>
                            <p className="text-[14px] md:text-[16px]">Minimum 1:5 Risk-to-Reward ratio</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 mt-[20px] md:mt-[50px] gap-[20px]">
                                <div className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#AD6500] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    2-5 high-quality signals per week
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#AD6500] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly target: 1,000 - 3,000 pips
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#AD6500] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Instruments traded: BTC/USD & XAU/USD
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#AD6500] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Active on Asian, London & New York overlap sessions
                                </div>
                            </div>

                        </div>
                        <div className="">
                            <div className="pl-0 lg:pl-[46px] mt-[20px] lg:mt-0" style={{
                                borderBottom: "3px solid #091B25"
                            }}>
                                <h3 className="text-[28px] md:text-[36px] text-[#AD6500] font-extrabold">$100 <span className="text-[16px] text-[#091B25] font-normal">/monthly</span></h3>
                            </div>
                            {/* <!-- Payments --> */}
                            <p className="text-[14px] font-bold text-[#091B25] pt-[14px] pb-[30px]">
                                Payments available on:
                                <span className="inline-flex items-center gap-2 ml-2">
                                    <span className="text-white bg-[#AD6500] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#AD6500] font-bold">₿</span>
                                    <span className="text-white bg-[#AD6500] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#AD6500] font-bold">₦</span>
                                </span>
                            </p>
                            <div className="flex items-end justify-start lg:justify-end">
                                {/* <!-- Button --> */}
                                <button
                                    onClick={() => openModal("Premium Signals")}
                                    className="mt-auto px-[20px] py-[12px] text-sm md:px-[28px] md:py-[16px] md:text-md bg-[#AD6500] rounded-full text-[#ffff] font-medium cursor-pointer"
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[1600] flex items-center justify-center overflow-hidden">
                    <button
                        type="button"
                        aria-label="Close modal"
                        onClick={closeModal}
                        className="absolute inset-0 bg-black/60"
                    />

                    <div className="relative mx-auto w-[92%] max-w-[600px] max-h-[85vh] overflow-y-auto rounded-[30px] bg-white px-[20px] py-[24px] md:px-[40px] md:py-[36px] shadow-2xl">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <h3 className="text-[24px] md:text-[28px] font-semibold text-[#091B25]">Let&apos;s start with your details</h3>
                                <p className="text-[14px] md:text-[16px] text-[#535862] pt-[6px]">Provide essential information to proceed.</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close modal"
                                onClick={closeModal}
                                className="w-[40px] h-[40px] rounded-full border border-[#E4E7EC] flex items-center justify-center text-[#091B25]"
                            >
                                <span className="text-[20px] leading-none">×</span>
                            </button>
                        </div>

                        <div className="pt-[22px] grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                            <div className="md:col-span-2">
                                <label className="block text-[14px] font-semibold text-[#091B25] pb-[8px]">Full Name</label>
                                <input
                                    value={fullName}
                                    onChange={(e) => {
                                        setProceedError(null);
                                        setFullName(e.target.value);
                                    }}
                                    placeholder="Enter your name"
                                    className="w-full rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] text-[#091B25] outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[14px] font-semibold text-[#091B25] pb-[8px]">Email Address</label>
                                <input
                                    value={email}
                                    onChange={(e) => {
                                        setProceedError(null);
                                        setEmail(e.target.value);
                                    }}
                                    placeholder="Enter your email"
                                    type="email"
                                    className="w-full rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] text-[#091B25] outline-none"
                                />
                                {email.trim() && (
                                    <p
                                        className={`pt-[8px] text-[13px] ${
                                            emailValidationStatus === "valid" ? "text-green-600" : emailValidationStatus === "invalid" ? "text-red-600" : "text-[#535862]"
                                        }`}
                                    >
                                        {emailValidationStatus === "validating"
                                            ? "Validating email..."
                                            : emailValidationStatus === "valid"
                                              ? "Email is valid"
                                              : emailValidationStatus === "invalid"
                                                ? emailValidationMessage ?? "Please enter a valid email"
                                                : ""}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[14px] font-semibold text-[#091B25] pb-[8px]">Select Payment Option</label>
                                <select
                                    value={paymentOption}
                                    onChange={(e) => {
                                        setProceedError(null);
                                        setPaymentOption(e.target.value as "Naira" | "Crypto");
                                    }}
                                    className="w-full rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] text-[#091B25] outline-none bg-white"
                                >
                                    <option value="Naira">Naira</option>
                                    <option value="Crypto">Crypto</option>
                                </select>
                            </div>

                            {paymentOption === "Crypto" && (
                                <div>
                                    <label className="block text-[14px] font-semibold text-[#091B25] pb-[8px]">Select Coin</label>
                                    <select
                                        value={cryptoCoin}
                                        onChange={(e) => {
                                            setProceedError(null);
                                            setCryptoCoin(e.target.value as "BTC" | "BNB" | "LTC" | "USDT");
                                        }}
                                        className="w-full rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] text-[#091B25] outline-none bg-white"
                                    >
                                        <option value="BTC">BTC</option>
                                        <option value="BNB">BNB</option>
                                        <option value="LTC">LTC</option>
                                        <option value="USDT">USDT</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-[14px] font-semibold text-[#091B25] pb-[8px]">Location</label>
                                <select
                                    value={location}
                                    onChange={(e) => {
                                        setProceedError(null);
                                        setLocation(e.target.value as "Kano" | "Abuja");
                                    }}
                                    className="w-full rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[14px] text-[#091B25] outline-none bg-white"
                                >
                                    <option value="Kano">Kano</option>
                                    <option value="Abuja">Abuja</option>

                                </select>
                            </div>
                        </div>

                        <div className="pt-[18px]">
                            <div className="flex items-center justify-between gap-4 border-t border-[#EAECF0] pt-[18px]">
                                <div className="flex items-center gap-3">
                                    <span className="w-[18px] h-[18px] rounded-full border-2 border-[#091B25] flex items-center justify-center">
                                        <span className="w-[10px] h-[10px] rounded-full bg-[#091B25]" />
                                    </span>
                                    <span className="text-[14px] text-[#091B25]">{planLabel} package</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-full bg-[#EAF0F3] px-5 py-2 text-[12px] font-medium text-[#091B25]"
                                >
                                    Change plan
                                </button>
                            </div>

                            {proceedError && (
                                <div className="pt-[14px]">
                                    <p className="text-[14px] text-red-600">{proceedError}</p>
                                </div>
                            )}

                            <div className="pt-[22px]">
                                <button
                                    type="button"
                                    onClick={handleProceed}
                                    disabled={!canProceed}
                                    className={`px-[34px] py-[14px] rounded-full bg-[#091B25] text-white font-semibold ${
                                        canProceed ? "" : "opacity-50 cursor-not-allowed"
                                    }`}
                                >
                                    {isProceeding ? "Processing..." : paymentOption === "Crypto" ? "Generate Wallet" : "Proceed"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {cryptoCheckout && (
                <div className="fixed inset-0 z-[1700] flex items-center justify-center overflow-hidden">
                    <button
                        type="button"
                        aria-label="Close crypto checkout"
                        onClick={() => setCryptoCheckout(null)}
                        className="absolute inset-0 bg-black/60"
                    />

                    <div className="relative mx-auto w-[92%] max-w-[560px] rounded-[24px] bg-white px-[20px] py-[22px] md:px-[28px] md:py-[28px] shadow-2xl">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <h3 className="text-[20px] md:text-[22px] font-semibold text-[#091B25]">Crypto Payment Wallet</h3>
                                <p className="text-[14px] text-[#535862] pt-[6px]">
                                    {typeof cryptoSecondsLeft === "number" && cryptoSecondsLeft <= 0
                                        ? "Wallet expired. Please generate a new wallet to continue."
                                        : "Send exactly the amount below to complete your payment. This wallet expires in 20 minutes."}
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setCryptoCheckout(null)}
                                className="w-[40px] h-[40px] rounded-full border border-[#E4E7EC] flex items-center justify-center text-[#091B25]"
                            >
                                <span className="text-[20px] leading-none">×</span>
                            </button>
                        </div>

                        {typeof cryptoSecondsLeft === "number" && cryptoSecondsLeft <= 0 ? (
                            <div className="pt-[18px]">
                                <div className="rounded-[16px] border border-[#EAECF0] bg-[#F9FAFB] p-[16px]">
                                    <p className="text-[14px] font-semibold text-[#091B25]">Wallet expired</p>
                                    <p className="pt-[6px] text-[13px] text-[#535862]">Generate a new wallet to continue your crypto payment.</p>
                                    <div className="pt-[14px]">
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                setCryptoCheckout(null);
                                                setCryptoPaymentStatus(null);
                                                await handleProceed();
                                            }}
                                            className="rounded-full bg-[#091B25] px-6 py-2 text-[13px] font-semibold text-white"
                                        >
                                            Generate New Wallet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-[18px] grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                                <div className="rounded-[16px] border border-[#EAECF0] bg-[#F9FAFB] p-[14px]">
                                    <p className="text-[12px] font-semibold text-[#091B25]">Amount</p>
                                    <p className="pt-[6px] text-[18px] font-bold text-[#091B25]">
                                        {cryptoCheckout.payAmount} {cryptoCheckout.payCurrency}
                                    </p>
                                    <p className="pt-[10px] text-[12px] text-[#535862]">
                                        {typeof cryptoSecondsLeft === "number"
                                            ? `Expires in ${Math.floor(cryptoSecondsLeft / 60)}:${String(cryptoSecondsLeft % 60).padStart(2, "0")}`
                                            : ""}
                                    </p>
                                    {(cryptoPaymentStatus || isPollingCryptoStatus) && (
                                        <p className="pt-[10px] text-[12px] text-[#535862]">
                                            Status: {cryptoPaymentStatus ?? "checking..."}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-[16px] border border-[#EAECF0] bg-white p-[14px] flex items-center justify-center">
                                    <img
                                        alt="Wallet QR"
                                        className="h-[170px] w-[170px]"
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(
                                            `${cryptoCheckout.payCurrency}:${cryptoCheckout.payAddress}`
                                        )}`}
                                    />
                                </div>

                                <div className="md:col-span-2 rounded-[16px] border border-[#EAECF0] bg-white p-[14px]">
                                    <p className="text-[12px] font-semibold text-[#091B25]">Wallet Address</p>
                                    <p className="pt-[6px] text-[13px] text-[#091B25] break-all">{cryptoCheckout.payAddress}</p>
                                    <div className="pt-[12px] flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                await navigator.clipboard.writeText(cryptoCheckout.payAddress);
                                            }}
                                            className="rounded-full bg-[#091B25] px-5 py-2 text-[13px] font-semibold text-white"
                                        >
                                            Copy Address
                                        </button>
                                        <a
                                            href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                                                `${cryptoCheckout.payCurrency}:${cryptoCheckout.payAddress}`
                                            )}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-full border border-[#091B25] px-5 py-2 text-[13px] font-semibold text-[#091B25]"
                                        >
                                            Open QR
                                        </a>
                                    </div>
                                    <p className="pt-[10px] text-[12px] text-[#535862]">Payment ID: {cryptoCheckout.paymentId}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}