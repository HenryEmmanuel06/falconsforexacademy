"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase, Blog } from "@/lib/supabase";

export default function BlogSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (error) throw error;
                setBlogs(data || []);
            } catch (error) {
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
                <div className="flex flex-col lg:flex-row gap-[30px] pt-[55px]">
                    {blogs.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">No blogs available yet. Check back soon!</p>
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog.id} className="flex-1">
                                {blog.blog_image ? (
                                    <Image 
                                        src={blog.blog_image}
                                        alt={blog.blog_title}
                                        width={384}
                                        height={240}
                                        className="w-[100%] h-48 object-cover"
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
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}