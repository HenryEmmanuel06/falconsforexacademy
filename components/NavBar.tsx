"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="w-full bg-white py-[17px] relative">
      <div className="container relative flex items-center justify-between gap-4 pb-3">
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
            className="hidden md:block rounded-[30px] bg-[#091B25] px-[28px] py-[16px] text-md font-semibold text-white hover:bg-zinc-800"
          >
            Join Academy
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-6 h-6 gap-1"
            aria-label="Toggle mobile menu"
          >
            <span className={`block w-6 h-0.5 bg-[#091B25] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[#091B25] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[#091B25] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              <ul className="flex flex-col space-y-4 text-md text-[#091B25] font-semibold">
                <li>
                  <Link 
                    href="/" 
                    className="hover:text-zinc-900 block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="hover:text-zinc-900 block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pricing" 
                    className="hover:text-zinc-900 block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/testimonies" 
                    className="hover:text-zinc-900 block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Testimonies
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blogs" 
                    className="hover:text-zinc-900 block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blogs
                  </Link>
                </li>
              </ul>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="block w-full rounded-[30px] bg-[#091B25] px-[28px] py-[16px] text-md font-semibold text-white hover:bg-zinc-800 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Academy
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
