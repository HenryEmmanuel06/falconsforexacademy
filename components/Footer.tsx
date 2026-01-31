import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#091B25] pt-[80px] pb-[30px]">
            <div className="container">
                <div className="flex justify-between">
                    <div>
                        <Image
                            src="/images/footer_logo.png"
                            alt="blog_img"
                            width={286}
                            height={32}
                        />
                        <p className="text-[#919191] text-[14px] font-normal max-w-[323px] pt-[25px]">Innovative training that focuses more on providing comprehensive trading solutions.</p>
                    </div>
                    <div className="flex gap-[150px]">

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

                <div>
                    <span className="text-[16px] text-[#D2D2D2] font-normal">&copy; 2026 Falcons reserved.</span>
                </div>
            </div>
        </footer>
    );
}