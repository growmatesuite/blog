import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

async function getCategory(slug: string) {
    const categories = await fetchAPI("/categories", {
        filters: { slug: slug },
        populate: {
            articles: {
                populate: {
                    cover: true,
                    categories: true,
                    authors: {
                        fields: ["name"],
                        populate: ["avatar"],
                    },
                },
                sort: ["publishedAt:desc"],
            },
        },
    });
    return categories?.data?.[0];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const category = await getCategory(resolvedParams.slug);

    if (!category) return { title: "Categoria não encontrada" };

    return {
        title: `${category.name} | Growmate Blog`,
        description: `Artigos sobre ${category.name}`,
    };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const category = await getCategory(resolvedParams.slug);

    if (!category) {
        notFound();
    }

    const articles = category.articles || [];

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom duration-700">
                <Link href="/blog" className="text-green-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block hover:opacity-70 transition-opacity">
                    ← Voltar ao Blog
                </Link>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-green-primary/50 to-transparent mx-auto mb-6" />
                <h1 className="text-4xl font-bold font-heading tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4">
                    Explorando: <span className="text-gradient-brand">{category.name}</span>
                </h1>
                <p className="mt-4 text-gray-500 md:text-xl max-w-2xl mx-auto font-light">
                    Mergulhe profundamente em nossos melhores conteúdos sobre {category.name.toLowerCase()}.
                </p>
            </div>

            {articles.length > 0 ? (
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article: any) => (
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
                                <div className="mb-5 flex flex-wrap gap-2">
                                    {article.categories?.map((cat: any) => (
                                        <span
                                            key={cat.id}
                                            className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-primary transition-colors group-hover:border-purple-primary/50"
                                        >
                                            {cat.name}
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
            ) : (
                <div className="text-center py-32 bg-black-secondary/30 rounded-[3rem] border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-gray-500 text-2xl">?</span>
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-white mb-4">Nenhum artigo encontrado nesta categoria</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Em breve traremos novidades fresquinhas sobre {category.name}. Fique de olho!</p>
                    <Link href="/blog" className="px-8 py-3 rounded-full bg-green-primary text-black-base font-bold hover:scale-105 active:scale-95 transition-all">
                        VOLTAR AO BLOG
                    </Link>
                </div>
            )}
        </div>
    );
}
