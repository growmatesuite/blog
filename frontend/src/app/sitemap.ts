import { MetadataRoute } from 'next';
import { fetchAPI } from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.growmate.io';

    // 1. Fetch all articles
    const articles = await fetchAPI('/articles', {
        fields: ['slug', 'updatedAt'],
    });

    const articleEntries: MetadataRoute.Sitemap = (articles?.data || []).map((article: any) => ({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: new Date(article.updatedAt || article.publishedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // 2. Fetch all categories
    const categories = await fetchAPI('/categories', {
        fields: ['slug'],
    });

    const categoryEntries: MetadataRoute.Sitemap = (categories?.data || []).map((category: any) => ({
        url: `${baseUrl}/blog/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...articleEntries,
        ...categoryEntries,
    ];
}
