import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { PostReadabilityEnhancements } from "@/components/blog/PostReadabilityEnhancements";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { extractText, slugify, formatDate } from "@/lib/utils";

async function getArticle(slug: string) {
    const articles = await fetchAPI("/articles", {
        filters: { slug: slug },
        populate: {
            cover: true,
            categories: true,
            authors: {
                fields: ["name", "bio"],
                populate: ["avatar"],
            },
        },
    }, { cache: 'no-store' });
    return articles?.data?.length > 0 ? articles.data[0] : null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const resolvedParams = await Promise.resolve(params);
    const article = await getArticle(resolvedParams.slug);

    if (!article) {
        return {
            title: "Artigo não encontrado",
        };
    }

    const shareImage = article.cover ? getStrapiMedia(article.cover.url) : null;

    return {
        title: `${article.title} | Growmate Blog`,
        description: article.excerpt || "Descubra as últimas tendências em IA e automação.",
        openGraph: {
            title: article.title,
            description: article.excerpt || "Descubra as últimas tendências em IA e automação.",
            images: shareImage ? [shareImage as string] : [],
        },
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const article = await getArticle(resolvedParams.slug);

    if (!article) {
        notFound();
    }

    // Extract headers for ToC
    const headers: { id: string; text: string; level: number }[] = [];
    if (article.content && Array.isArray(article.content)) {
        article.content.forEach((block: any) => {
            if (block.type === 'heading') {
                const text = extractText(block.children);
                const id = slugify(text);
                if (text.trim()) {
                    headers.push({ id, text, level: block.level });
                }
            }
        });
    }

    // Extract Key Takeaways from CMS field
    let keyTakeaways: string[] = [];
    if (article.key_takeaways) {
        keyTakeaways = article.key_takeaways.split('\n').filter((item: string) => item.trim() !== "");
    }

    // Dynamic Reading Time Calculation
    const readingTime = Math.ceil(article.content.reduce((acc: number, block: any) => {
        if (['paragraph', 'heading', 'list-item'].includes(block.type)) {
            const blockText = extractText(block.children);
            const words = blockText.trim().split(/\s+/).filter(Boolean).length;
            return acc + words;
        }
        return acc;
    }, 0) / 225) || 1;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "image": article.cover ? getStrapiMedia(article.cover.url) : "",
        "datePublished": article.publishedAt,
        "dateModified": article.updatedAt || article.publishedAt,
        "author": article.authors?.map((a: any) => ({
            "@type": "Person",
            "name": a.name,
        })),
        "description": article.excerpt || "",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.growmate.io/blog/${article.slug}`
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PostReadabilityEnhancements headers={headers} />

            <article className="container mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
                {/* Breadcrumbs */}
                <nav className="mx-auto max-w-4xl mb-8 md:mb-12 flex items-center gap-2 text-[10px] md:text-sm text-gray-500 font-medium tracking-wide">
                    <Link href="/blog" className="hover:text-green-primary transition-colors shrink-0">BLOG</Link>
                    <span className="text-gray-700">/</span>
                    <span className="text-gray-400 truncate uppercase tracking-widest">{article.title}</span>
                </nav>

                <div className="mx-auto max-w-4xl space-y-12">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {article.categories?.map((category: any) => (
                                <Link
                                    key={category.id}
                                    href={`/blog/category/${category.slug}`}
                                    className="inline-flex items-center rounded-full border border-green-primary/30 bg-green-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-primary hover:bg-green-primary/20 transition-colors"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        <h1 className="text-3xl font-bold font-heading leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            {article.title}
                        </h1>

                        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pt-4 border-b border-white/5 pb-6 md:pb-8">
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                                {article.authors?.map((author: any) => (
                                    <div key={author.id} className="flex items-center gap-3">
                                        {author.avatar && (
                                            <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-full border border-white/10 ring-2 ring-green-primary/20 shadow-xl">
                                                <Image
                                                    src={getStrapiMedia(author.avatar.url) || ""}
                                                    alt={author.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                    suppressHydrationWarning
                                                />
                                            </div>
                                        )}
                                        <div className="text-left">
                                            <p className="text-sm md:text-base font-bold text-white tracking-wide">{author.name}</p>
                                            <p className="text-[10px] md:text-xs text-gray-500 font-medium">
                                                {formatDate(article.publishedAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-600">
                                <span className="flex items-center gap-1.5 border-r border-white/10 pr-3 md:pr-4">
                                    <svg className="w-3 h-3 md:w-4 md:h-4 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" suppressHydrationWarning>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{readingTime} MIN <span className="hidden sm:inline">DE LEITURA</span></span>
                                </span>
                                <ShareButtons
                                    title={article.title}
                                    url={`https://www.growmate.io/blog/${article.slug}`}
                                />
                            </div>
                        </div>
                    </div>

                    {article.cover ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl ring-1 ring-white/5">
                            <Image
                                src={getStrapiMedia(article.cover.formats?.large?.url || article.cover.url) || ""}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                                suppressHydrationWarning
                            />
                        </div>
                    ) : (
                        <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-green-primary/10 via-black-secondary to-purple-primary/10 flex items-center justify-center">
                            <span className="text-white/5 font-heading font-bold text-6xl md:text-9xl tracking-tighter select-none">GROWMATE</span>
                        </div>
                    )}

                    {keyTakeaways.length > 0 && (
                        <div className="bg-gradient-to-br from-green-primary/10 via-white/5 to-transparent border border-green-primary/20 rounded-2xl md:rounded-3xl p-6 md:p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-primary/10 blur-[80px] rounded-full group-hover:bg-green-primary/20 transition-all duration-1000" />
                            <h3 className="text-green-primary font-bold font-heading text-base md:text-lg mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-green-primary animate-pulse" />
                                <span className="uppercase tracking-wider">O que você vai aprender</span>
                            </h3>
                            <ul className="grid md:grid-cols-1 gap-4">
                                {keyTakeaways.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 md:gap-4 text-gray-300">
                                        <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-primary/20 flex items-center justify-center text-green-primary text-[10px] font-bold mt-1">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm md:text-base font-medium leading-relaxed">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <ArticleContent content={article.content} />

                    {/* Vision V3: Author Signature */}
                    {article.authors?.length > 0 && (
                        <div className="mt-16 md:mt-24 bg-black-secondary border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-primary/5 blur-[100px] rounded-full" />
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                {article.authors[0].avatar && (
                                    <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-green-primary to-purple-primary rounded-full blur-xl opacity-30 animate-pulse" />
                                        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/10 shadow-2xl">
                                            <Image
                                                src={getStrapiMedia(article.authors[0].avatar.url) || ""}
                                                alt={article.authors[0].name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                                suppressHydrationWarning
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1 text-center md:text-left">
                                    <span className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">SOBRE O AUTOR</span>
                                    <h3 className="text-2xl md:text-3xl font-bold font-heading text-white mb-3 md:mb-4">{article.authors[0].name}</h3>
                                    <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">
                                        {article.authors[0].bio || "Especialista em IA e Estratégias de Crescimento na Growmate. Apaixonado por transformar processos complexos em fluxos de trabalho inteligentes e escaláveis."}
                                    </p>
                                    <div className="mt-6 md:mt-8 flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                                        <Link
                                            href="/blog"
                                            className="px-5 py-2 rounded-full border border-white/10 text-white text-[10px] md:text-xs font-bold hover:bg-white/5 transition-colors"
                                        >
                                            VER TODOS OS POSTS
                                        </Link>
                                        <Link
                                            href="https://api.whatsapp.com/send/?phone=551148635675&text&type=phone_number&app_absent=0"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-2 rounded-full bg-green-primary/10 border border-green-primary/20 text-green-primary text-[10px] md:text-xs font-bold hover:bg-green-primary/20 transition-colors"
                                        >
                                            FALAR COM O ESPECIALISTA
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-20">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <h3 className="text-2xl font-bold font-heading text-white tracking-tight px-6 uppercase tracking-[0.2em] text-[12px] text-gray-500">
                                Continue Lendo
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-20">
                            <RelatedArticles currentSlug={resolvedParams.slug} />
                        </div>
                    </div>
                </div>
            </article>
            <NewsletterSection />
        </>
    );
}

async function RelatedArticles({ currentSlug }: { currentSlug: string }) {
    const articles = await fetchAPI("/articles", {
        filters: { slug: { $ne: currentSlug } },
        pagination: { limit: 3 },
        populate: {
            cover: true,
            categories: true,
            authors: {
                fields: ["name"],
                populate: ["avatar"],
            },
        },
        sort: ["publishedAt:desc"],
    });

    return articles.data.map((article: any) => (
        <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-black-tertiary transition-all duration-300 hover:-translate-y-2 hover-glow-purple"
        >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black-secondary">
                {article.cover ? (
                    <Image
                        src={getStrapiMedia(article.cover.formats?.small?.url || article.cover.url) || ""}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                        suppressHydrationWarning
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-primary/10 to-transparent flex items-center justify-center">
                        <span className="text-white/5 font-heading font-bold text-2xl rotate-12">GROWMATE</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black-tertiary via-transparent to-transparent opacity-60" />
            </div>
            <div className="flex flex-1 flex-col p-6">
                <h4 className="mb-3 text-lg font-bold font-heading text-white transition-colors group-hover:text-purple-primary line-clamp-2 leading-tight">
                    {article.title}
                </h4>
                <p className="line-clamp-2 text-sm text-gray-500 leading-relaxed">
                    {article.excerpt}
                </p>
            </div>
        </Link>
    ));
}
