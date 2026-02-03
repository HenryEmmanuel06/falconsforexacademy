import Link from "next/link";
import Image from "next/image";

export default function Mentorship() {
    return (
        <section className="bg-[#9CB0BB] py-[50px] md:py-[70px] lg:py-[100px]">
            <div className="container">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="">
                        <div className="inline-flex bg-white border border-[#D5D7DA] border-1 py-[7px] px-[15px] gap-[6px] rounded-[5px]">
                            <Image
                                src="/images/icons/_Dot.svg"
                                alt="svg"
                                width={8}
                                height={8}
                                priority
                            />

                            <span className="text-sm font-medium text-[#414651]">Services We Offer</span>
                        </div>
                        <h2 className="text-[28px] md:text-[32px] lg:text-[40px] text-black font-medium leading-tight pt-[20px] md:pt-[10px] max-w-[650px]">Are you just hearing about forex or you are a struggling trader?</h2>
                    </div>
                    <div className="flex items-center">
                        <p className="text-[16px] md:text-[18px] relative top-3 font-normal text-black max-w-[500px]">Whether monthly or lifetime, at Falconsforexacademy we got a program for you. Our philosophy is built on discipline and trust. We don't chase every candle.</p>
                    </div>
                </div>


                <div>


                </div>
                {/* cards */}
                <div className="flex flex-col lg:flex-row mt-[40px] md:mt-[80px] gap-[15px] md:gap-[35px]">

                    {/* card */}
                    <div className="bg-[#091B25] text-white px-[25px] pt-[50px] pb-[25px] rounded-[30px]">
                        <div className="flex gap-2 justify-between">
                            <h3 className="text-[22px] max-w-auto lg:max-w-[310px] leading-tight font-semibold">
                                Mastery in forex trading & analysis breakdown
                            </h3>
                            <div className="mt-2">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L11 1M11 1H1M11 1V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>


                        </div>

                        <p className="text-[14px] max-w-[400px] lg:max-w-[280px] pt-[25px]">Understand how the forex market moves. We teach how to read price, spot trends, and identify good trading opportunities.</p>
              max-w-auto lg:          <Image
                            src="/images/news_img_1.png"
                            alt="svg"
                            width={335}
                            height={200}
                            className="mt-[50px] w-[100%]"
                        />
                    </div>
                    {/* card */}
                    {/* card */}
                    <div className="bg-white text-[#091B25] px-[25px] pt-[50px] pb-[25px] rounded-[30px] border-2 border-[#091B25]">
                        <div className="flex gap-2 justify-between">
                            <h3 className="text-[22px] max-w-auto lg:max-w-[310px] leading-tight font-semibold">
                                Mastering trade entry & exist principles
                            </h3>
                            <div className="mt-2">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#091B25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                            </div>


                        </div>

                        <p className="text-[14px] max-w-[400px] lg:max-w-[280px] pt-[25px]">Learn when to enter and exit trades with confidence. Simple rules to manage risk and protect your profits.</p>
                        <Image
                            src="/images/news_img_2.png"
                            alt="svg"
                            width={335}
                            height={200}
                            className="mt-[50px] w-[100%]"
                        />
                    </div>
                    {/* card */}

                    {/* card */}
                    <div className="bg-white text-[#091B25] px-[25px] pt-[50px] pb-[25px] rounded-[30px] border-2 border-[#091B25]">
                        <div className="flex gap-2 justify-between">
                            <h3 className="text-[22px] max-w-auto lg:max-w-[310px] leading-tight font-semibold">
                                Mindset development & strategy trust
                            </h3>
                            <div className="mt-2">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#091B25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                            </div>


                        </div>

                        <p className="text-[14px] max-w-[400px] lg:max-w-[280px] pt-[25px]">Develop the right trading mindset. Stay disciplined, control emotions, and trust your strategy as you grow.</p>
                        <Image
                            src="/images/news_img.png"
                            alt="svg"
                            width={335}
                            height={200}
                            className="mt-[50px] w-[100%]"
                        />
                    </div>
                    {/* card */}

                </div>
            </div>

        </section>
    );

}