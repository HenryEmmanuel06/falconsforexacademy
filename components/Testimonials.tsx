import Link from "next/link";
import Image from "next/image";

export default function Testimonials() {
    return (
        <section>
            <div className="container pt-[90px] pb-[50px]">
                <div className="flex justify-between">
                    <div>
                        <div className="inline-flex border border-[#D5D7DA] border-1 py-[7px] px-[15px] gap-[6px] rounded-[5px]">
                            <Image
                                src="/images/icons/_Dot.svg"
                                alt="svg"
                                width={8}
                                height={8}
                            />

                            <span className="text-sm font-medium text-[#414651]">People&apos;s testimonies</span>
                        </div>
                        <h2 className="text-[40px] text-black font-medium leading-tight pt-[10px]">See Why We Are Tested And Trusted</h2>
                    </div>
                    <div className="items-end flex">
                        <Link
                            href="/login"
                            className="rounded-[30px] bg-[#091B25] px-[28px] py-[16px] text-md font-semibold text-white hover:bg-zinc-800"
                        >
                            Enroll for training Now
                        </Link>
                    </div>

                </div>


                <div className="flex pt-[60px] gap-[20px]">
                    <div className="w-[25%] p-[25px] pt-[170px] text-white text-[14px] font-normal rounded-[15px]" style={{
                        backgroundImage: "url(/images/testy.jpg)",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover"

                    }}>
                        <div className="flex gap-[3px]">
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={10}
                                height={10}
                            />
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={10}
                                height={10}
                            />
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={10}
                                height={10}
                            />
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={10}
                                height={10}
                            />
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={10}
                                height={10}
                            />
                        </div>
                        <p className="leading-tight pt-[5px]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua.
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <p className="font-medium pt-[10px]">
                            Sarah Harp
                        </p>
                        <p className="pt-[5px]">
                            Lifetime Plan
                        </p>
                    </div>



                    <div className="w-[50%] flex flex-col bg-[#F5F5F5] p-[25px] rounded-[15px]">
                        <div className="flex gap-[3px]">
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={15}
                                height={15}
                            />
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={15}
                                height={15}
                            />
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={15}
                                height={15}
                            />
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={15}
                                height={15}
                            />
                            <Image
                                src="/images/icons/star.svg"
                                alt="star"
                                width={15}
                                height={15}
                            />
                        </div>
                        <p className="leading-tight pt-[5px] text-[18px]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua.
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div className="mt-auto flex justify-between items-end">
                            <div className="flex items-end gap-[10px]">
                                <Image
                                    src="/images/testy_img.png"
                                    alt="profile"
                                    width={48}
                                    height={48}
                                    className="rounded-[8px]"
                                />
                                <div>
                                    <p className="font-medium text-[18px] pt-[10px]">
                                        Sarah Harp
                                    </p>
                                    <p className="pt-[5px] text-[#535862] text-[14px]">
                                        Lifetime Plan
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-[7px]">
                                 <button className="rounded-full border-1 border-[#DBE4E9] h-[40px] w-[40px] flex items-center cursor-pointer justify-center">

                                    <Image 
                                    src="/images/icons/arrow-left-inactive.svg"
                                    alt="arrow"
                                    width={17}
                                    height={11}
                                    />
                                </button>
                                <button className="rounded-full border-1 border-[#DBE4E9] h-[40px] w-[40px] flex items-center cursor-pointer justify-center">

                                    <Image 
                                    src="/images/icons/arrow-right-active.svg"
                                    alt="arrow"
                                    width={17}
                                    height={11}
                                    />
                                </button>

                            </div>

                        </div>
                    </div>

                    <div className="w-[25%] p-[25px] flex flex-col bg-[#181D27] text-white rounded-[15px]">
                        <h2 className="text-[64px] tracking-tight font-extrabold mt-auto">
                            98%
                        </h2>
                          <p className="font-normal text-[14px]">
                                        Sarah Harp
                                    </p>
                                    <p className="pt-[5px] text-[#EEF4FF] text-[14px]">
                                        Lifetime Plan
                                    </p>
                    </div>
                </div>
            </div>
        </section>

    );

}