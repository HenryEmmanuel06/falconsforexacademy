"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase, Blog } from "@/lib/supabase";
import Telegram from "@/components/Telegram";

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data, error } = await supabase
                    .from("blogs")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setBlogs(data || []);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Failed to fetch blogs";
                setFetchError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <main className="">
            <section className="bg-white py-[40px] md:py-[60px]">
                <div className="container">
                    <h2 className="text-center text-[28px] md:text-[32px] lg:text-[40px] font-medium text-black">Amazing Contents To Keep You Informed</h2>
                <p className="text-center text-[18px] md:text-[20px] max-w-[858px] mx-auto text-black">Stay updated with the latest forex trading strategies and market insights from our expert team.</p>

                    <div className="pt-[40px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#091B25]"></div>
                            </div>
                        ) : fetchError ? (
                            <div className="text-center py-12 mx-auto">
                                <p className="text-gray-500">Unable to load blogs.</p>
                            </div>
                        ) : blogs.length === 0 ? (
                            <div className="text-center py-12 mx-auto">
                                <p className="text-gray-500">No blogs available yet. Check back soon!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {blogs.map((blog) => (
                                    <article
                                        key={blog.id}
                                        className="group h-full rounded-[20px] transition-colors overflow-hidden"
                                    >
                                        <div className="relative w-full h-[240px] bg-gray-100">
                                            {blog.blog_image ? (
                                                <Image
                                                    src={blog.blog_image}
                                                    alt={blog.blog_title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : null}
                                        </div>

                                        <div className="p-5 pl-0">
                                            <p className="text-[14px] font-semibold text-[#091B25]">
                                                {blog.blog_author} • {formatDate(blog.created_at)}
                                            </p>

                                            <h2 className="mt-3 font-semibold text-[20px] max-w-[344px] text-[#091B25]">
                                                {blog.blog_title}
                                            </h2>

                                            <p className="mt-2 text-[16px] text-[#535862]">
                                                {blog.blog_content.length > 120
                                                    ? `${blog.blog_content.substring(0, 120)}...`
                                                    : blog.blog_content}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
<Telegram />
        </main>
    );
}
