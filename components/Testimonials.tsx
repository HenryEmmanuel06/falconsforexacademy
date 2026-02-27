"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import MotionOnce from "./MotionOnce";

export default function Testimonials() {

    const testimonials = [
        {
            text: "Thank you sir, Honestly speaking you are doing what other people/mentor are not. Taking $50 upward freely for us most are not even sniper. Thank you sir we really appreciate you BIG LOVE sir. Thank you GOD BLESS YOU. Amen.",
            name: "Emmanuel",
            plan: "from telegram",
            image: "/images/testy_img_1.png",
        },
        {
            text: "Boss, thank you so much 🙏. The Gold signal was really accurate, perfect entry and strong movement in line with the market. The risk-to-reward ratio was great too. You are truly skilled at what you do. I really appreciate the quality of your signals 💪🏼🔥",
            name: "Faisal",
            plan: "from telegram",
            image: "/images/testy_img_2.png",
        },
         {
            text: "Where are you from bro like you make the market yourself. I just got to know and follow you for a few days and this kind of confidence beats me down. You are too good bro.",
            name: "Ayomdele Andrew",
            plan: "from telegram",
            image: "/images/testy_img_2.png",
        }
    ];

    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);
    const swiperRef = useRef<any>(null);
    const [swiperReady, setSwiperReady] = useState(false);
    const [navInitialized, setNavInitialized] = useState(false);

    useEffect(() => {
        if (!swiperReady) return;
        if (navInitialized) return;

        const intervalId = window.setInterval(() => {
            if (navInitialized) return;
            if (!swiperRef.current) return;
            if (!prevRef.current || !nextRef.current) return;

            swiperRef.current.params.navigation.prevEl = prevRef.current;
            swiperRef.current.params.navigation.nextEl = nextRef.current;
            swiperRef.current.navigation.destroy();
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
            setNavInitialized(true);
            window.clearInterval(intervalId);
        }, 50);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [navInitialized, swiperReady]);

    return (
        <section className="bg-white" id="testimonials">
            <div className="container py-[50px] lg:pt-[90px] lg:pb-[50px]">
                <MotionOnce className="fadein_bottom flex flex-col lg:flex-row justify-between" duration={0.8}>
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
                        <h2 className="text-[28px] md:text-[32px] lg:text-[40px] text-black font-medium leading-tight pt-[20px] md:pt-[10px]">See Why We Are Tested And Trusted</h2>
                    </div>
                    <div className="items-end flex">
                        <Link
                            href="/login"
                            className="hidden lg:inline-flex rounded-[30px] bg-[#091B25] px-[28px] py-[16px] text-md font-semibold text-white hover:bg-zinc-800"
                        >
                            Enroll for training Now
                        </Link>
                    </div>

                </MotionOnce>


                <div className="flex flex-col lg:flex-row pt-[30px] lg:pt-[60px] gap-[20px]">
                    <MotionOnce className="fadein_left relative overflow-hidden w-[100%] lg:w-[25%] h-[292px] p-[25px] pt-[170px] text-white text-[14px] font-normal rounded-[15px]" duration={0.8}>
                        <iframe
                            src="https://player.cloudinary.com/embed/?cloud_name=dddpexcfo&public_id=IMG_1719_2_yyd3be"
                            title="Testimonial video"
                            loading="lazy"
                            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                            style={{ border: 0 }}
                        />

                    </MotionOnce>



                    <MotionOnce className="fadein_up relative w-[100%] lg:w-[50%] min-w-0 flex flex-col bg-[#F5F5F5] p-[25px] rounded-[15px] min-h-[292px] overflow-hidden" duration={0.8}>
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

                        <Swiper
                            modules={[Navigation]}
                            slidesPerView={1}
                            navigation
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                                setSwiperReady(true);
                            }}
                            className="w-full flex-1 min-w-0 overflow-hidden"
                        >
                            {testimonials.map((t, idx) => (
                                <SwiperSlide key={`${t.name}-${idx}`} className="h-full min-w-0">
                                    <div className="flex h-full min-w-0 flex-col">
                                        <p className="leading-tight pb-[30px] lg:pb-[0px] pt-[5px] text-black text-[16px] md:text-[18px] max-w-full break-words whitespace-normal">
                                            {t.text}
                                        </p>
                                        <div className="mt-auto flex justify-between items-end">
                                            <div className="flex items-end gap-[10px]">
                                                <Image
                                                    src={t.image}
                                                    alt="profile"
                                                    width={48}
                                                    height={48}
                                                    className="rounded-[8px]"
                                                />
                                                <div>
                                                    <p className="font-medium text-[16px] md:text-[18px] text-black pt-[10px]">{t.name}</p>
                                                    <p className="pt-[5px] text-[#535862] text-[14px]">{t.plan}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="absolute z-100 bottom-[30px] right-[25px] flex justify-end items-end">
                            <div className="flex items-center gap-[7px]">
                                <button
                                    type="button"
                                    ref={prevRef}
                                    className="rounded-full border-1 border-[#DBE4E9] h-[40px] w-[40px] flex items-center cursor-pointer justify-center"
                                >
                                    <Image src="/images/icons/arrow-left-inactive.svg" alt="arrow" width={17} height={11} />
                                </button>
                                <button
                                    type="button"
                                    ref={nextRef}
                                    className="rounded-full border-1 border-[#DBE4E9] h-[40px] w-[40px] flex items-center cursor-pointer justify-center"
                                >
                                    <Image src="/images/icons/arrow-right-active.svg" alt="arrow" width={17} height={11} />
                                </button>
                            </div>
                        </div>
                    </MotionOnce>

                    <MotionOnce
                        className="fadein_right relative overflow-hidden w-[100%] lg:w-[25%] h-[292px] p-[25px] pt-[170px] text-white text-[14px] font-normal rounded-[15px]"
                        duration={0.8}
                    >
                        <iframe
                            src="https://player.cloudinary.com/embed/?cloud_name=dddpexcfo&public_id=WhatsApp_Video_2026-02-22_at_17.25.01_k6x2uf"
                            title="Testimonial video"
                            loading="lazy"
                            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                            style={{ border: 0 }}
                        />
                    </MotionOnce>
                </div>
                <div className="items-center justify-center mt-[40px] flex">
                    <Link
                        href="/pricing"
                        className="inline-flex lg:hidden rounded-[30px] bg-[#091B25] px-[28px] py-[16px] text-md font-semibold text-white hover:bg-zinc-800"
                    >
                        Enroll for training Now
                    </Link>
                </div>
            </div>
        </section>

    );

}