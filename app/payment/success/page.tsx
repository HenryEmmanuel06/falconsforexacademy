import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Props = {
    searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
     const rawPaymentId = searchParams?.paymentId;
     const paymentId =
         typeof rawPaymentId === "string"
             ? rawPaymentId
             : Array.isArray(rawPaymentId)
               ? rawPaymentId[0]
               : undefined;

    const rawReference = searchParams?.reference;
    const rawTrxref = searchParams?.trxref;
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

     if (paymentId) {
         const { data: cryptoPayment } = await supabaseAdmin
             .from("crypto_payments")
             .select("status")
             .eq("nowpayments_payment_id", paymentId)
             .maybeSingle();

         const status = (cryptoPayment?.status ?? null) as string | null;
         const normalized = status ? status.toLowerCase() : null;
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

                     <div className="mt-6 rounded-[14px] border border-[#EAECF0] bg-[#F9FAFB] px-5 py-4">
                         <p className="text-[14px] text-[#091B25]">
                             <span className="font-semibold">Payment ID:</span> {paymentId}
                         </p>
                     </div>

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
         .select("status")
         .eq("paystack_reference", reference)
         .maybeSingle();

    const status = (ngnPayment?.status ?? null) as string | null;
    const failureStatuses = new Set(["failed", "abandoned", "cancelled"]);

    if (status && status !== "success" && failureStatuses.has(status)) {
        redirect(`/payment/failed?reference=${encodeURIComponent(reference)}&status=${encodeURIComponent(status)}`);
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-16">
                <h1 className="text-[28px] md:text-[36px] font-bold text-[#091B25]">Payment Successful</h1>
                <p className="pt-3 text-[16px] text-[#535862]">
                    {status === "success"
                        ? "Thank you. Your payment was received successfully."
                        : "Verifying your payment..."}
                </p>

                {reference && (
                    <div className="mt-6 rounded-[14px] border border-[#EAECF0] bg-[#F9FAFB] px-5 py-4">
                        <p className="text-[14px] text-[#091B25]">
                            <span className="font-semibold">Reference:</span> {reference}
                        </p>
                    </div>
                )}

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
