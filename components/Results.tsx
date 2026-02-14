import Link from "next/link";
import Image from "next/image";

export default function Results() {
    return (
            <section className="bg-white py-[60px] lg:py-[100px]">
                <div className="container">
                    <h2 className="text-center text-[28px] md:text-[32px] lg:text-[40px] font-medium text-black">Results Don&apos;t Lie!</h2>
                    <p className="text-center text-[18px] md:text-[20px] max-w-[564px] mx-auto text-black">Whether monthly or lifetime, at Falconsforexacademy we got a program for you.</p>
                    <div className="flex flex-col justify-center items-center md:flex-row gap-[20px] lg:gap-[40px] pt-[50px] lg:pt-[109px]">
                        <div>
                            <Image
                                src="/images/results_img_1.png"
                                alt="svg"
                                width={380}
                                height={350}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <Image
                                src="/images/results_img_2.png"
                                alt="svg"
                                width={380}
                                height={350}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <Image
                                src="/images/results_img_3.png"
                                alt="svg"
                                width={380}
                                height={350}
                                className="object-contain"
                            />
                        </div>

                    </div>
                </div>
            </section>
            
    );


}