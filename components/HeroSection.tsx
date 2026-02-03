import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
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
                                <h1 className="text-[32px] md:text-[45px] lg:text-[60px] font-semibold leading-tight lg:leading-none pt-[20px] text-[#091B25]">
                                    Master Forex With Proven Strategy
                                </h1>
                                <p className="text-[#091B25] font-normal text-[16px] md:text-[18px] lg:text-[20px] pt-[20px] leading-normal">Stop gambling and start trading. We teach a disciplined, ruled based approach to the Forex market designed for consistent profit in the market.</p>

                                <div className="flex items-center gap-3 pt-[25px] md:pt-[36px]">

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
                                src="/images/banner-img-1.png"
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
                        <div>
                            <h3 className="text-[26px] md:text-[32px] text-center lg:text-left font-semibold">Our top recognized broker</h3>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[54px]">
                            <div className="flex items-center justify-center">
                                <Image
                                    src="/images/ex-logo.png"
                                    alt="exness"
                                    width={261}
                                    height={65}
                                    className="w-[200px] md:w-auto md:h-[65px]"
                                />
                             
                            </div>
                            <div>
                                <Link
                                    href="/join"
                                    className="flex border-1 items-center justify-center border-white gap-2 rounded-[30px] bg-[#9CB0BB] px-[20px] py-[12px] text-sm md:px-[28px] md:py-[16px] md:text-md text-[#091B25] font-semibold hover:bg-zinc-300"
                                >
                                    <span>Sign up for free now</span>
                                    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.72205e-06 5.35828C5.72205e-06 5.62349 0.105363 5.87785 0.292899 6.06538C0.480436 6.25292 0.734789 6.35828 1.00001 6.35828L8.92001 6.35828L6.29334 8.98495C6.1167 9.17451 6.02053 9.42524 6.02511 9.68431C6.02968 9.94338 6.13463 10.1906 6.31784 10.3738C6.50106 10.557 6.74824 10.6619 7.00731 10.6665C7.26638 10.6711 7.51711 10.5749 7.70667 10.3983L12.04 6.06494C12.2273 5.87744 12.3325 5.62328 12.3325 5.35828C12.3325 5.09328 12.2273 4.83911 12.04 4.65161L7.70667 0.318278C7.61512 0.220028 7.50472 0.141226 7.38206 0.0865696C7.25939 0.0319136 7.12697 0.00252445 6.9927 0.000155396C6.85843 -0.00221366 6.72506 0.0224857 6.60054 0.0727804C6.47602 0.123075 6.36291 0.197935 6.26795 0.292893C6.173 0.387851 6.09814 0.500963 6.04784 0.625481C5.99755 0.749998 5.97285 0.88337 5.97522 1.01764C5.97759 1.15191 6.00697 1.28433 6.06163 1.40699C6.11629 1.52966 6.19509 1.64006 6.29334 1.73161L8.92001 4.35828L1.00001 4.35828C0.448006 4.35828 5.72205e-06 4.80628 5.72205e-06 5.35828Z" fill="#091B25" />
                                    </svg>

                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}