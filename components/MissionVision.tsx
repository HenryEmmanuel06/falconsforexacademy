import Link from "next/link";
import Image from "next/image";

export default function MissionVision() {
    return (
            <section className="bg-white">
                <div className="container">
                    <div className="flex flex-col md:flex-row gap-[20px] lg:gap-[30px] pb-[40px] md:pb-[97px]">
                        <div className="text-center px-[40px] lg:px-[70px] py-[40px] bg-[#EFEFEF] rounded-[30px]">
                            <Image
                            src="/images/mission.png"
                            alt="mission"
                            width={63}
                            height={63}
                            className="mx-auto"
                            />
                            <h2 className="text-[28px] md:text-[32px] lg:text-[40px] text-black font-medium pt-[20px]">Our Mission</h2>
                            <p className="text-black text-[16px] md:text-[18px] font-normal max-w-[480px] pt-[20px]">At Falcons Forex Academy, we strip away the noise of complex indicators and focus on pure price action and market structure. Our philosophy is built on discipline and trust. We don't chase every candle.</p>
                        </div>
                        <div className="text-center px-[40px] lg:px-[70px] py-[40px] bg-[#EFEFEF] rounded-[30px]">
                            <Image
                            src="/images/vision.png"
                            alt="mission"
                            width={63}
                            height={63}
                            className="mx-auto"
                            />
                            <h2 className="text-[28px] md:text-[32px] lg:text-[40px] text-black font-medium pt-[20px]">Our Vision</h2>
                            <p className="text-black text-[16px] md:text-[18px] font-normal max-w-[480px] pt-[20px]">At Falcons Forex Academy, we strip away the noise of complex indicators and focus on pure price action and market structure. Our philosophy is built on discipline and trust. We don't chase every candle.</p>
                        </div>

                    </div>
                    

                </div>
            </section>

    );
}