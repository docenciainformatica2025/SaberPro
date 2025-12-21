import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/admin/', '/teacher/'],
        },
        sitemap: 'https://saberpro-app.vercel.app/sitemap.xml',
    };
}
