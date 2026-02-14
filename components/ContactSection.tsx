import Link from "next/link";
import Image from "next/image";

export default function ContactSection() {
    return (
            <section className="bg-[#091B25]">
                <div className="container">
                    <div className="flex lg:flex-row flex-col justify-between py-[40px] md:pt-[100px] md:pb-[74px] gap-[40px] lg:gap-[96px]">
                        <div className="items-center flex w-[100%] max-w-[540px]">
                            <div>
                                <h1 className="text-[32px] md:text-[45px] lg:text-[60px] font-semibold leading-tight lg:leading-none pt-[20px] max-w-[300px] md:max-w-none text-[#fff]">
                                    Master Forex With Proven Strategy
                                </h1>
                                <p className="text-[#fff] font-normal text-[16px] md:text-[18px] lg:text-[20px] pt-[20px] leading-normal">Stop gambling and start trading. We teach a disciplined, ruled based approach to the Forex market designed for consistent profit in the market.</p>

                                
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            

    );
}