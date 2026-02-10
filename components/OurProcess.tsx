import Link from "next/link";
import Image from "next/image";

export default function OurProcess() {
    return (
        <section className="bg-[#091B25] py-[90px]">
            <div className="container">
                <div className="flex">
                    <div>
                        <div className="inline-flex border border-[#D5D7DA] bg-white border-1 py-[7px] px-[15px] gap-[6px] rounded-[5px]">
                            <Image
                                src="/images/icons/_Dot.svg"
                                alt="svg"
                                width={8}
                                height={8}
                            />

                            <span className="text-sm font-medium text-[#414651]">Trading Floor In Abuja & Kano</span>
                        </div>
                        <h2 className="text-[28px] md:text-[32px] lg:text-[40px] text-white font-medium leading-tight max-w-[400px] pt-[30px]">Follow Through These Steps To Join Us Now And Start Winning The Market</h2>
                    </div>
                </div>
            </div>
        </section>
    );


}