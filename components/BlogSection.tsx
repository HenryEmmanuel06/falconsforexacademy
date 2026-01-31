import Link from "next/link";
import Image from "next/image";

export default function BlogSection() {
    return (
        <section className="py-[60px] bg-white">
            <div className="container">
                <h2 className="text-center text-[40px] font-medium">Amazing Contents To Keep You Informed</h2>
                <p className="text-center text-[20px] max-w-[858px] mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <div className="flex pt-[55px]">
                    <div className="">
                        <Image 
                        src="/images/blog_img_1.png"
                        alt="blog_img"
                        width={384}
                        height={240}
                        />
                        <div>
                            <p className="text-[14px] font-semibold py-[20px] text-[#091B25]">Olivia Rhye • 20 Jan 2025</p>
                            <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-[20px] max-w-[270px] text-[#091B25]">Can you really trade forex with a small account?</h3>
                                 <Image 
                        src="/images/icons/arrow-right-up.svg"
                        alt="blog_img"
                        width={10}
                        height={10}
                        className="pt-[5px]"
                        />
                            </div>
                            <p className="text-[16px] max-w-[384px] text-[#535862] pt-[8px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ex</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}