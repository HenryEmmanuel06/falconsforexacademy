import Link from "next/link";
import Image from "next/image";

export default function Telegram() {
    return (
        <div className="bg-[#CED8DD] py-[40px] md:py-[60px]">
                <div className="border border-3 border-[#ffff] bg-[#FFFFFF1A] rounded-[30px] max-w-[1080px] w-[90%] mx-auto pt-[60px] pb-[40px]" style={{
                    backdropFilter: "blur(150px)"
                }}>
                    <h2 className="text-center text-[28px] md:text-[32px] lg:text-[40px] font-bold text-black">Join Our Community Of Winning Traders</h2>
                    <div className="text-center mt-[40px]">
                        <Link href="/" className="text-[14px] md:text-[16px] px-[20px] py-[12px] font-semibold text-white bg-[#AD6500] py-[16px] px-[28px] rounded-[30px]">
                        Join Telegram Channel
                        </Link>
                    </div>
                </div>
            </div>
    );

}