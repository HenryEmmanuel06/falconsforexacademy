import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Props = {
    searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function PaymentFailedPage({ searchParams }: Props) {
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
    const statusParam = typeof searchParams?.status === "string" ? searchParams.status : undefined;

    if (!reference) {
        redirect("/");
    }

    const { data: usdPayment } = await supabaseAdmin
        .from("dollar_payments")
        .select("status")
        .eq("paystack_reference", reference)
        .maybeSingle();

    const { data: ngnPayment } = usdPayment
        ? { data: null }
        : await supabaseAdmin.from("naira_payments").select("status").eq("paystack_reference", reference).maybeSingle();

    const status = (usdPayment?.status ?? ngnPayment?.status ?? null) as string | null;
    const failureStatuses = new Set(["failed", "abandoned", "cancelled"]);

    if (status === "success") {
        redirect(`/payment/success?reference=${encodeURIComponent(reference)}`);
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-16">
                <h1 className="text-[28px] md:text-[36px] font-bold text-[#091B25]">Payment Failed</h1>
                <p className="pt-3 text-[16px] text-[#535862]">
                    {status && failureStatuses.has(status)
                        ? "Your payment was not completed. Please try again."
                        : "Verifying your payment..."}
                </p>

                {(reference || statusParam || status) && (
                    <div className="mt-6 rounded-[14px] border border-[#EAECF0] bg-[#F9FAFB] px-5 py-4">
                        {(status || statusParam) && (
                            <p className="text-[14px] text-[#091B25]">
                                <span className="font-semibold">Status:</span> {status ?? statusParam}
                            </p>
                        )}
                        {reference && (
                            <p className="text-[14px] text-[#091B25]">
                                <span className="font-semibold">Reference:</span> {reference}
                            </p>
                        )}
                    </div>
                )}

                <div className="pt-8 flex flex-wrap gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full bg-[#091B25] px-8 py-3 text-white font-semibold"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href="/#pricing"
                        className="inline-flex items-center justify-center rounded-full border border-[#091B25] px-8 py-3 text-[#091B25] font-semibold"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        </div>
    );
}
