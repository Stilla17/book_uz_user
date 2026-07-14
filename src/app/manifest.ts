import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Book.uz - O'zbekistondagi eng katta onlayn kitob do'koni",
        short_name: 'Book.uz',
        description:
            "O'zbekistondagi eng katta onlayn kitob do'koni. Keng tanlov, arzon narxlar, tez yetkazib berish.",
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#fffaf2',
        theme_color: '#000000',
        lang: 'uz',
        categories: ['books', 'shopping', 'education'],
        icons: [
            {
                src: '/images/Logo.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/images/Logo.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    };
}
