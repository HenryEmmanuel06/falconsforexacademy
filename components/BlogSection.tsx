"use client";

import Link from "next/link";
import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";
import { supabase, Blog } from "@/lib/supabase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function BlogSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setBlogs(data || []);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to fetch blogs';
                setFetchError(message);
                console.error('Failed to fetch blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <section className="py-[40px] pt-[0px] md:pt-[60px] md:py-[60px] bg-white">
                <div className="container">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#091B25]"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-[40px] pt-[0px] md:pt-[60px] md:py-[60px] bg-white">
            <div className="container">
                <h2 className="text-center text-[28px] md:text-[32px] lg:text-[40px] font-medium text-black">Amazing Contents To Keep You Informed</h2>
                <p className="text-center text-[18px] md:text-[20px] max-w-[858px] mx-auto text-black">Stay updated with the latest forex trading strategies and market insights from our expert team.</p>
                <div className="pt-[55px]">
                    {fetchError ? (
                        <div className="text-center py-12 mx-auto">
                            <p className="text-gray-500">Unable to load blogs.</p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-12 mx-auto">
                            <p className="text-gray-500">No blogs available yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div>
                            <Swiper
                                modules={[Autoplay, Pagination]}
                                spaceBetween={30}
                                pagination={{ el: ".blog-pagination", clickable: true }}
                                autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                loop={blogs.length > 4}
                                breakpoints={{
                                    0: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 },
                                    1280: { slidesPerView: 4 },
                                }}
                                style={{
                                    ["--swiper-pagination-color" as unknown as keyof CSSProperties]: "#091B25",
                                    ["--swiper-pagination-bullet-inactive-color" as unknown as keyof CSSProperties]: "#CBD5E1",
                                    ["--swiper-pagination-bullet-inactive-opacity" as unknown as keyof CSSProperties]: "1",
                                }}
                                className="pb-10"
                            >
                                {blogs.map((blog) => (
                                    <SwiperSlide key={blog.id}>
                                        <div className="h-full">
                                            {blog.blog_image ? (
                                                <Image 
                                                    src={blog.blog_image}
                                                    alt={blog.blog_title}
                                                    width={384}
                                                    height={240}
                                                    className="w-[100%] h-48 object-cover rounded-[20px]"
                                                />
                                            ) : (
                                                <div className="w-[100%] h-48 bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400">No image</span>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-[14px] font-semibold py-[20px] text-[#091B25]">
                                                    {blog.blog_author} • {formatDate(blog.created_at)}
                                                </p>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-semibold text-[20px] max-w-[270px] text-[#091B25]">
                                                        {blog.blog_title}
                                                    </h3>
                                                    <Image 
                                                        src="/images/icons/arrow-right-up.svg"
                                                        alt="arrow"
                                                        width={10}
                                                        height={10}
                                                        className="pt-[5px]"
                                                    />
                                                </div>
                                                <p className="text-[16px] max-w-[384px] text-[#535862] pt-[8px]">
                                                    {blog.blog_content.length > 150 
                                                        ? `${blog.blog_content.substring(0, 150)}...` 
                                                        : blog.blog_content
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="blog-pagination mt-9 flex justify-center" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}