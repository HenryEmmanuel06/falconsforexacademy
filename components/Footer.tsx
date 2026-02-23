"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MotionOnce from "./MotionOnce";

export default function Footer() {
    const pathname = usePathname();
    if (pathname.startsWith("/falconsadmin")) return null;

    return (
        <footer className="bg-[#091B25] pt-[80px] pb-[30px]">
            <div className="container">
                <MotionOnce className="fadein_bottom flex flex-col lg:flex-row justify-between gap-[40px]" duration={0.8}>
                    <div>
                        <Image
                            src="/images/footer_logo.png"
                            alt="blog_img"
                            width={286}
                            height={32}
                        />
                        <p className="text-[#919191] text-[14px] font-normal max-w-[323px] pt-[25px]">Innovative training that focuses more on providing comprehensive trading solutions.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-[40px] md:gap-[150px]">

                        <div className="text-white">
                            <h4 className="text-[16px] font-medium">Company</h4>
                            <div className="flex flex-col gap-[16px] pt-[20px] text-[16px] text-[#D2D2D2] font-normal">
                                <Link href="/">About</Link>
                                <Link href="/">Blogs</Link>
                                <Link href="/">Testimonial</Link>
                            </div>
                        </div>
                        <div className="text-white">
                            <h4 className="text-[16px] font-medium">Contact</h4>
                            <div className="flex flex-col gap-[16px] pt-[20px] text-[16px] text-[#D2D2D2] font-normal">
                                <Link href="mailto:info@falconsforexacademy.com">info@falconsforexacademy.com</Link>
                                <Link href="tel:+2348036593242">Call: +234 803 659 3242</Link>
                            </div>
                        </div>
                        <div className="text-white">
                            <h4 className="text-[16px] font-medium">Legal</h4>
                            <div className="flex flex-col gap-[16px] pt-[20px] text-[16px] text-[#D2D2D2] font-normal">
                                <Link href="/">Policy</Link>
                                <Link href="/">Terms</Link>
                            </div>
                        </div>

                    </div>
                </MotionOnce>

                <MotionOnce className="fadein_up flex flex-col lg:flex-row gap-[20px] justify-between items-center mt-[50px] lg:mt-[100px] pt-[32px] border-t-1 border-[#FFFFFF1A]" duration={0.8}>
                    <span className="text-[16px] text-[#D2D2D2] font-normal">&copy; 2026 Falcons reserved.</span>
                    <div className="flex gap-[24px]">
                        <Link href="/"><Image
                        src="/images/icons/ig.svg"
                        alt="media link"
                        width={24}
                        height={24}
                        /></Link>
                           <Link href="/"><Image
                        src="/images/icons/x.svg"
                        alt="media link"
                        width={24}
                        height={24}
                        /></Link>
                           <Link href="/"><Image
                        src="/images/icons/fb.svg"
                        alt="media link"
                        width={24}
                        height={24}
                        /></Link>
                           <Link href="/"><Image
                        src="/images/icons/wa.svg"
                        alt="media link"
                        width={24}
                        height={24}
                        /></Link>
                    </div>
                </MotionOnce>
            </div>
        </footer>
    );
}