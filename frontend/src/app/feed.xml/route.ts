import { fetchAPI } from '@/lib/strapi';

export async function GET() {
    const baseUrl = 'https://www.growmate.io';
    const articles = await fetchAPI('/articles', {
        populate: ['categories'],
        sort: ['publishedAt:desc'],
        pagination: { limit: 20 },
    });

    const items = (articles?.data || []).map((article: any) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <guid>${baseUrl}/blog/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt || ''}]]></description>
      ${article.categories?.map((c: any) => `<category>${c.name}</category>`).join('')}
    </item>
  `).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Growmate Blog</title>
        <link>${baseUrl}/blog</link>
        <description>IA, Automação e Estratégias de Crescimento Inteligente</description>
        <language>pt-br</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
        ${items}
      </channel>
    </rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
        },
    });
}
