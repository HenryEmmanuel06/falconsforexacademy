import Link from "next/link";
import Image from "next/image";

export default function WhoWeAre() {
    return (
        <section className="py-[100px]">
            <div className="container">
                <div className="flex justify-between">
                    <div className="">
                        <h2 className="text-[40px] text-black font-medium leading-tight max-w-[500px]">Trading is Simple, But Not Easy. We make it Clear.</h2>
                    </div>
                    <div className="">
                        <p className="text-[18px] font-normal text-black max-w-[644px]">At Falcons Forex Academy, we strip away the noise of complex indicators and focus on pure price action and market structure. Our philosophy is built on discipline and trust. We don't chase every candle.</p>
                    </div>
                </div>
                <div className="flex gap-[30px] pt-[60px] relative">
                    <div>
                        <Image
                            src="/images/inner-hero-1.png"
                            alt="svg"
                            width={392}
                            height={339}
                        />

                    </div>
                    <div>
                        <Image
                            src="/images/inner-hero-2.png"
                            alt="svg"
                            width={818}
                            height={339}
                        />

                    </div>
                    <Link
                        href="/login"
                        className="absolute left-[22.5%] rounded-[30px] bg-[#091B25] px-[28px] py-[16px] text-md font-semibold text-white hover:bg-zinc-800"
                    >
                        Enroll for training Now
                    </Link>
                </div>
            </div>
        </section>
    );

}