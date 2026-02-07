import Link from "next/link";
import Image from "next/image";

export default function AboutHeroSection() {
    return (
        <>
            <section className="bg-white">
                <div className="container">
                    <div className="flex lg:flex-row flex-col justify-between py-[40px] md:pt-[50px] md:pb-[74px] gap-[40px] lg:gap-[96px]">
                        <div className="items-center flex w-[100%] max-w-[540px]">
                            <div>
                                <div className="inline-flex border border-[#D5D7DA] border-1 py-[7px] px-[15px] gap-[6px] rounded-[5px]">
                                    <Image
                                        src="/images/icons/_Dot.svg"
                                        alt="svg"
                                        width={8}
                                        height={8}
                                    />

                                    <span className="text-sm font-medium text-[#414651]">Trading Floor In Abuja & Kano</span>
                                </div>
                                <h1 className="text-[32px] md:text-[45px] lg:text-[60px] font-semibold leading-tight lg:leading-none pt-[20px] max-w-[300px] md:max-w-none text-[#091B25]">
                                    Master Forex With Proven Strategy
                                </h1>
                                <p className="text-[#091B25] font-normal text-[16px] md:text-[18px] lg:text-[20px] pt-[20px] leading-normal">Stop gambling and start trading. We teach a disciplined, ruled based approach to the Forex market designed for consistent profit in the market.</p>

                                <div className="flex items-center gap-3 pt-[25px] md:pt-[36px]">
                                     <Link
            href="/join"
            className="rounded-[30px] bg-[#9CB0BB] px-[20px] py-[12px] text-sm md:px-[28px] md:py-[16px] md:text-md text-[#091B25] font-semibold hover:bg-zinc-300"
          >
            Join Academy
          </Link>
                                    <Link
                                        href="/login"
                                        className="rounded-[30px] bg-[#091B25] px-[20px] py-[12px] text-sm md:px-[28px] md:py-[16px] md:text-md font-semibold text-white hover:bg-zinc-800"
                                    >
                                        Enroll for training Now
                                    </Link>

                                </div>
                            </div>
                        </div>

                        <div>
                            <Image
                            className="w-[100%]"
                                src="/images/banner-img-2.png"
                                alt="banner"
                                height={597}
                                width={609}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <div className="bg-[#091B25] text-white py-[60px]">
                <div className="container">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-[20px]">
                       
                    </div>
                </div>
            </div>
        </>

    );
}