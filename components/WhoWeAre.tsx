import Link from "next/link";
import Image from "next/image";

export default function WhoWeAre() {
    return (
        <section className="py-[50px] md:py-[70px] lg:py-[100px] bg-white">
            <div className="container">
                <div className="flex md:flex-row flex-col justify-between gap-[20px]">
                    <div className="">
                        <h2 className="text-[28px] md:text-[32px] lg:text-[40px] text-black font-medium leading-tight max-w-[500px]">Trading is Simple, But Not Easy. We make it Clear.</h2>
                    </div>
                    <div className="">
                        <p className="text-[16px] md:text-[18px] font-normal text-black max-w-[644px]">At Falcons Forex Academy, we strip away the noise of complex indicators and focus on pure price action and market structure. Our philosophy is built on discipline and trust. We don't chase every candle.</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-[30px] pt-[60px] relative">
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
                        className="absolute left-[21.5%] xl:left-[22.5%] rounded-[30px] bg-[#091B25] px-[20px] py-[12px] lg:text-md lg:px-[28px] lg:py-[16px] font-semibold text-white hover:bg-zinc-800"
                    >
                        Enroll for training Now
                    </Link>
                </div>
            </div>
        </section>
    );

}