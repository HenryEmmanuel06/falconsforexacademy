import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#091B25] pt-[80px] pb-[30px]">
            <div className="container">
                <div className="flex flex-col lg:flex-row justify-between gap-[40px]">
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
                                <Link href="/">Falcons@gmail.com</Link>
                                <Link href="/">Call: 0906555596</Link>
                                <Link href="/">WhatsApp: 08036593242</Link>
                            </div>
                        </div>
                        <div className="text-white">
                            <h4 className="text-[16px] font-medium">Legal</h4>
                            <div className="flex flex-col gap-[16px] pt-[20px] text-[16px] text-[#D2D2D2] font-normal">
                                <Link href="/">Policy</Link>
                                <Link href="/">Terms</Link>
                                <Link href="/">Cookies</Link>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-[20px] justify-between items-center mt-[50px] lg:mt-[100px] pt-[32px]" style={{
                        borderTop: "1px solid #FFFFFF1A"
                }}>
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
                </div>
            </div>
        </footer>
    );
}