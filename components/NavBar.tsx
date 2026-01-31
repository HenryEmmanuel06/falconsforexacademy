import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <header className="w-full bg-white py-[17px]">
      <div className="container relative flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Falconsforexacademy logo"
            width={240}
            height={29}
            priority
          />
          
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center flex-1 pr-[40px] justify-end">
          <ul className="flex items-center justify-center  gap-8 text-md text-[#091B25] font-semibold">
            <li>
              <Link href="/" className="hover:text-zinc-900">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-zinc-900">About</Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-zinc-900">Pricing</Link>
            </li>
            <li>
              <Link href="/testimonies" className="hover:text-zinc-900">Testimonies</Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-zinc-900">Blogs</Link>
            </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-[30px] bg-[#091B25] px-[28px] py-[16px] text-md font-semibold text-white hover:bg-zinc-800"
          >
            Login
          </Link>
          <Link
            href="/join"
            className="rounded-[30px] bg-[#9CB0BB] px-[28px] py-[16px] text-md text-[#091B25] font-semibold hover:bg-zinc-300"
          >
            Join Academy
          </Link>
        </div>
      </div>
    </header>
  );
}
