import type { MetadataRoute } from 'next';

const siteUrl = 'https://book.uz';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/admin/',
                    '/admin/*',
                    '/admin/auth',
                    '/admin/auth/',
                    '/admin/auth/*',
                    '/auth',
                    '/auth/',
                    '/auth/*',
                    '/cart',
                    '/cart/',
                    '/checkout',
                    '/checkout/',
                    '/profile',
                    '/profile/',
                    '/my-books',
                    '/my-books/',
                    '/payment',
                    '/payment/',
                    '/payment/*'
                ]
            }
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl
    };
}
