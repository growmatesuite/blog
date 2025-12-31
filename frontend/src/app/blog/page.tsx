import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import { BlogSearch } from "@/components/blog/BlogSearch";

async function getArticles(searchQuery?: string) {
    const params: any = {
        populate: {
            cover: true,
            categories: true,
            authors: {
                fields: ["name"],
                populate: ["avatar"],
            },
        },
        sort: ["featured:desc", "publishedAt:desc"]
    };

    if (searchQuery) {
        params._q = searchQuery;
    }

    const articles = await fetchAPI("/articles", params);
    return articles?.data || [];
}

export default async function BlogPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q: searchQuery } = await searchParams;
    const articles = await getArticles(searchQuery);

    if (articles.length === 0 && !searchQuery) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <h1 className="text-4xl font-bold font-heading text-white mb-6">Nenhum artigo encontrado</h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Parece que ainda estamos preparando nossos conteúdos. Volte em breve para conferir as novidades sobre IA e automação!</p>
                <div className="inline-flex h-3 w-3 rounded-full bg-green-primary animate-pulse mr-2" />
                <span className="text-green-primary font-bold text-sm tracking-widest uppercase">Em breve</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom duration-700">
                <h1 className="text-5xl font-bold font-heading tracking-tight sm:text-6xl md:text-7xl text-white mb-4">
                    Inteligência que <span className="text-gradient-brand">escala</span>. <br />Resultados que orquestram.
                </h1>
                <p className="mt-4 text-gray-400 md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                    Insights sobre IA Agêntica, LLMs Enterprise e como construir uma força de trabalho infinitamente escalável.
                </p>
            </div>

            <BlogSearch />

            {searchQuery && (
                <div className="mb-12 text-center animate-in fade-in zoom-in duration-300">
                    <p className="text-gray-500">
                        Mostrando resultados para: <span className="text-green-primary font-bold">"{searchQuery}"</span>
                        <span className="ml-2 text-xs">({articles.length} {articles.length === 1 ? 'resultado' : 'resultados'})</span>
                    </p>
                </div>
            )}

            {articles.length === 0 ? (
                <div className="py-20 text-center bg-black-secondary/30 rounded-[3rem] border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-gray-500 text-2xl">?</span>
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-white mb-4">Nenhum resultado encontrado</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Não encontramos artigos que correspondam à sua pesquisa. Tente usar termos mais genéricos.</p>
                    <Link href="/blog" className="px-8 py-3 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
                        LIMPAR PESQUISA
                    </Link>
                </div>
            ) : (
                <>
                    {/* Hero Section - Featured Article (Show on main page or if it's the first result) */}
                    {(!searchQuery || articles[0].featured) && (
                        <div className="mb-24">
                            <Link href={`/blog/${articles[0].slug}`} className="group relative block w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black-secondary shadow-2xl transition-all duration-500 hover:border-green-primary/50 hover-glow-green">
                                <div className="grid md:grid-cols-5 gap-0 h-full">
                                    <div className="relative md:col-span-3 aspect-video md:aspect-auto w-full overflow-hidden min-h-[300px] md:min-h-[500px] bg-black-tertiary">
                                        {articles[0].cover ? (
                                            <Image
                                                src={getStrapiMedia(articles[0].cover.formats?.large?.url || articles[0].cover.url) || ""}
                                                alt={articles[0].title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                priority
                                                unoptimized
                                                suppressHydrationWarning
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-primary/20 via-black-tertiary to-purple-primary/20 flex items-center justify-center">
                                                <span className="text-white/10 font-heading font-bold text-8xl rotate-12 select-none">GROWMATE</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black-base via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black-base/80" />
                                    </div>
                                    <div className="flex flex-col justify-center p-8 md:p-12 md:col-span-2 relative bg-black-base/20 backdrop-blur-3xl">
                                        <div className="mb-6 flex flex-wrap gap-2">
                                            {articles[0].categories?.map((category: any) => (
                                                <span
                                                    key={category.id}
                                                    className="inline-flex items-center rounded-full border border-green-primary/30 bg-green-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-primary"
                                                >
                                                    {category.name}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="mb-6 text-3xl font-bold font-heading leading-tight text-white transition-colors group-hover:text-green-primary sm:text-4xl">
                                            {articles[0].title}
                                        </h2>
                                        <p className="mb-8 text-lg text-gray-500 line-clamp-3 leading-relaxed">
                                            {articles[0].excerpt}
                                        </p>
                                        <div className="mt-auto flex items-center gap-4 pt-6 border-t border-white/5">
                                            {articles[0].authors?.[0]?.avatar && (
                                                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
                                                    <Image
                                                        src={getStrapiMedia(articles[0].authors[0].avatar.url) || ""}
                                                        alt={articles[0].authors[0].name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                        suppressHydrationWarning
                                                    />
                                                </div>
                                            )}
                                            <div className="text-sm">
                                                <p className="font-medium text-white">{articles[0].authors?.[0]?.name}</p>
                                                <p className="text-gray-600">{formatDate(articles[0].publishedAt)}</p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-2 text-green-primary font-bold text-sm tracking-wide group-hover:translate-x-1 transition-transform">
                                                LER ARTIGO <span aria-hidden="true">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Grid Section - Other Articles */}
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {((!searchQuery || articles[0].featured) ? articles.slice(1) : articles).map((article: any) => (
                            <Link
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-black-tertiary transition-all duration-300 hover:-translate-y-2 hover-glow-purple"
                            >
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black-secondary">
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
                                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-primary/10 to-black-tertiary flex items-center justify-center">
                                            <span className="text-white/5 font-heading font-bold text-4xl rotate-12">GROWMATE</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black-tertiary via-transparent to-transparent opacity-50" />
                                </div>
                                <div className="flex flex-1 flex-col p-8">
                                    <div className="mb-5 flex gap-2">
                                        {article.categories?.map((category: any) => (
                                            <span
                                                key={category.id}
                                                className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-primary transition-colors group-hover:border-purple-primary/50"
                                            >
                                                {category.name}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="mb-4 text-2xl font-bold font-heading text-white transition-colors group-hover:text-purple-primary leading-tight">
                                        {article.title}
                                    </h2>
                                    <p className="line-clamp-3 text-sm text-gray-500 leading-relaxed mb-6">
                                        {article.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between text-xs text-gray-600 font-medium border-t border-white/5 pt-4">
                                        <span>{formatDate(article.publishedAt)}</span>
                                        <span className="group-hover:text-white transition-colors">Leia mais</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            <NewsletterSection />
        </div>
    );
}
