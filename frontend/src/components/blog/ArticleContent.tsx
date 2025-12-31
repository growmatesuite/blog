'use client';

import { getStrapiMedia } from "@/lib/strapi";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import { extractText, slugify } from "@/lib/utils";

interface ArticleContentProps {
    content: any;
}

export function ArticleContent({ content }: ArticleContentProps) {
    if (!content) return null;

    return (
        <div className="prose prose-invert prose-lg mx-auto 
            prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
            prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-lg
            prose-strong:text-white prose-strong:font-bold
            prose-a:text-green-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-green-primary prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-300
            prose-img:rounded-3xl prose-img:border prose-img:border-white/10
            prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-black-tertiary prose-pre:border prose-pre:border-white/5
            max-w-none">
            <BlocksRenderer
                content={content}
                blocks={{
                    heading: ({ children, level }) => {
                        const text = extractText(children);
                        const id = slugify(text);
                        const Tag = `h${level}` as any;
                        return <Tag id={id} className="scroll-mt-32 uppercase tracking-tight">{children}</Tag>;
                    },
                    image: ({ image }) => {
                        const { url, alternativeText, width, height } = image;
                        const aspectRatio = (width && height) ? width / height : 16 / 9;

                        return (
                            <div className="relative my-12 w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-green-primary/30 group bg-white/5">
                                <div style={{ aspectRatio: `${aspectRatio}` }}>
                                    <Image
                                        src={getStrapiMedia(url) || ""}
                                        alt={alternativeText || ""}
                                        fill
                                        className="object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                                        unoptimized
                                        suppressHydrationWarning
                                    />
                                </div>
                            </div>
                        );
                    },
                }}
            />
        </div>
    );
}
