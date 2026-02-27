import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Props = {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
    const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : undefined;

    const telegramInnerGroupUrl =
        process.env.TELEGRAM_INNER_GROUP_URL ??
        process.env.NEXT_PUBLIC_TELEGRAM_INNER_GROUP_URL ??
        "https://t.me/falconsforexacademy";

     const rawPaymentId = resolvedSearchParams?.paymentId;
     const paymentId =
         typeof rawPaymentId === "string"
             ? rawPaymentId
             : Array.isArray(rawPaymentId)
               ? rawPaymentId[0]
               : undefined;

    const rawReference = resolvedSearchParams?.reference;
    const rawTrxref = resolvedSearchParams?.trxref;
    const reference =
        typeof rawReference === "string"
            ? rawReference
            : Array.isArray(rawReference)
              ? rawReference[0]
              : typeof rawTrxref === "string"
                ? rawTrxref
                : Array.isArray(rawTrxref)
                  ? rawTrxref[0]
                  : undefined;

    if (!reference && !paymentId) {
        return (
            <div className="bg-white">
                <div className="container mx-auto px-6 py-16">
                    <h1 className="text-[28px] md:text-[36px] font-bold text-[#091B25]">Payment Successful</h1>
                    <p className="pt-3 text-[16px] text-[#535862]">Verifying your payment...</p>
                    <div className="pt-8 flex flex-wrap gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-full bg-[#091B25] px-8 py-3 text-white font-semibold"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

     if (paymentId) {
         const { data: cryptoPayment } = await supabaseAdmin
             .from("crypto_payments")
             .select("status, plan")
             .eq("nowpayments_payment_id", paymentId)
             .maybeSingle();

         const status = (cryptoPayment?.status ?? null) as string | null;
         const normalized = status ? status.toLowerCase() : null;
         const plan = (cryptoPayment as any)?.plan as string | null | undefined;
         const isSignals = String(plan ?? "").trim().toLowerCase() === "premium signals";
         const successStatuses = new Set(["finished", "confirmed", "paid", "success"]);
         const failureStatuses = new Set(["failed", "refunded", "expired", "cancelled", "canceled"]);

         if (normalized && failureStatuses.has(normalized)) {
             redirect(`/payment/failed?paymentId=${encodeURIComponent(paymentId)}&status=${encodeURIComponent(normalized)}&provider=nowpayments`);
         }

         return (
            <div className="bg-white">
                <div className="container mx-auto px-6 py-16">
                    <h1 className="text-[28px] md:text-[36px] font-bold text-[#091B25]">Payment Successful</h1>
                    <p className="pt-3 text-[16px] text-[#535862]">
                        {normalized && successStatuses.has(normalized)
                            ? "Thank you. Your payment was received successfully."
                            : "Verifying your payment..."}
                    </p>

                    {normalized && successStatuses.has(normalized) && (
                        <div className="mt-6 rounded-[14px] border border-[#EAECF0] bg-[#F9FAFB] px-5 py-4">
                            <p className="text-[14px] text-[#091B25]">
                              {isSignals
                                  ? "Your Premium Signals payment was successful. Use the button below to join the Telegram inner circle group."
                                  : "Please complete your registration to gain full access."}
                            </p>
                        </div>
                    )}

                     <div className="mt-6 rounded-[14px] border border-[#EAECF0] bg-[#F9FAFB] px-5 py-4">
                         <p className="text-[14px] text-[#091B25]">
                             <span className="font-semibold">Payment ID:</span> {paymentId}
                         </p>
                     </div>

                     <div className="pt-8 flex flex-wrap gap-3">
                         {isSignals ? (
                             <Link
                                 href={telegramInnerGroupUrl}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center justify-center rounded-full bg-[#AD6500] px-8 py-3 text-white font-semibold"
                             >
                                 Join Telegram Inner Group
                             </Link>
                         ) : (
                             <Link
                                 href="/register"
                                 className="inline-flex items-center justify-center rounded-full bg-[#091B25] px-8 py-3 text-white font-semibold"
                             >
                                 Complete Registration
                             </Link>
                         )}
                         <Link
                             href="/"
                             className={`inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold ${
                                 normalized && successStatuses.has(normalized)
                                     ? "border border-[#091B25] text-[#091B25]"
                                     : "bg-[#091B25] text-white"
                             }`}
                         >
                             Back to Home
                         </Link>
                     </div>
                 </div>
             </div>
         );
     }

     if (!reference) {
         return (
             <div className="bg-white">
                 <div className="container mx-auto px-6 py-16">
                     <h1 className="text-[28px] md:text-[36px] font-bold text-[#091B25]">Payment Successful</h1>
                     <p className="pt-3 text-[16px] text-[#535862]">Verifying your payment...</p>
                     <div className="pt-8">
                         <Link
                             href="/"
                             className="inline-flex items-center justify-center rounded-full bg-[#091B25] px-8 py-3 text-white font-semibold"
                         >
                             Back to Home
                         </Link>
                     </div>
                 </div>
             </div>
         );
     }

     const { data: ngnPayment } = await supabaseAdmin
         .from("naira_payments")
         .select("status, plan")
         .eq("paystack_reference", reference)
         .maybeSingle();

    const status = (ngnPayment?.status ?? null) as string | null;
    const normalizedStatus = status ? status.toLowerCase() : null;
    const plan = (ngnPayment as any)?.plan as string | null | undefined;
    const isSignals = String(plan ?? "").trim().toLowerCase() === "premium signals";
    const failureStatuses = new Set(["failed", "abandoned", "cancelled"]);

    if (normalizedStatus && normalizedStatus !== "success" && failureStatuses.has(normalizedStatus)) {
        redirect(`/payment/failed?reference=${encodeURIComponent(reference)}&status=${encodeURIComponent(normalizedStatus)}`);
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-16">
                <h1 className="text-[28px] md:text-[36px] font-bold text-[#091B25]">Payment Successful</h1>
                <p className="pt-3 text-[16px] text-[#535862]">
                    {normalizedStatus === "success"
                        ? "Thank you. Your payment was received successfully."
                        : "Verifying your payment..."}
                </p>

                {normalizedStatus === "success" && (
                    <div className="mt-6 rounded-[14px] border border-[#EAECF0] bg-[#F9FAFB] px-5 py-4">
                        <p className="text-[14px] text-[#091B25]">
                            {isSignals
                                ? "Your Premium Signals payment was successful. Use the button below to join the Telegram inner circle group."
                                : "Your payment was successful. Please complete your registration to gain full access."}
                        </p>
                    </div>
                )}

                {reference && (
                    <div className="mt-6 rounded-[14px] border border-[#EAECF0] bg-[#F9FAFB] px-5 py-4">
                        <p className="text-[14px] text-[#091B25]">
                            <span className="font-semibold">Reference:</span> {reference}
                        </p>
                    </div>
                )}

                <div className="pt-8 flex flex-wrap gap-3">
                    {isSignals ? (
                        <Link
                            href={telegramInnerGroupUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-[#AD6500] px-8 py-3 text-white font-semibold"
                        >
                            Join Telegram Inner Group
                        </Link>
                    ) : (
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center rounded-full bg-[#091B25] px-8 py-3 text-white font-semibold"
                        >
                            Complete Registration
                        </Link>
                    )}
                    <Link
                        href="/"
                        className={`inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold ${
                            normalizedStatus === "success"
                                ? "border border-[#091B25] text-[#091B25]"
                                : "bg-[#091B25] text-white"
                        }`}
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
