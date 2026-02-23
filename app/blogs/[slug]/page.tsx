import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

function extractBlogIdFromSlug(slug: unknown) {
    if (typeof slug !== "string") return null;

    let decoded = slug;
    try {
        decoded = decodeURIComponent(slug);
    } catch {
        decoded = slug;
    }

    const idx = decoded.lastIndexOf("-");
    if (idx === -1) return null;
    const raw = decoded.slice(idx + 1).trim();
    if (!/^[0-9]+$/.test(raw)) return null;
    return raw;
}

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function BlogInnerPage({ params }: PageProps) {
    const { slug } = await params;
    const blogId = extractBlogIdFromSlug(slug);

    if (blogId == null) {
        notFound();
    }

    const blogIdNumber = Number.parseInt(String(blogId), 10);
    if (!Number.isFinite(blogIdNumber)) {
        notFound();
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase environment variables are not set");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: blog, error } = await supabase.from("blogs").select("*").eq("blog_id", blogIdNumber).maybeSingle();

    if (error || !blog) {
        notFound();
    }

    return (
        <main className="bg-white text-black">
            <section className="py-[40px] md:py-[60px]">
                <div className="container max-w-[900px]">
                    {blog.blog_image ? (
                        <div className="relative w-full h-[240px] md:h-[420px] rounded-[18px] overflow-hidden bg-gray-100">
                            <Image src={blog.blog_image} alt={blog.blog_title} fill className="object-cover" priority />
                        </div>
                    ) : null}

                    <h1 className="pt-[22px] md:pt-[28px] text-[26px] md:text-[34px] font-semibold text-[#091B25]">{blog.blog_title}</h1>

                    <div className="pt-[14px] text-[16px] md:text-[18px] text-[#091B25] whitespace-pre-wrap leading-[1.85]">
                        {blog.blog_content}
                    </div>
                </div>
            </section>
        </main>
    );
}
