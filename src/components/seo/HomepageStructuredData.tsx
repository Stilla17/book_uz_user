import { siteUrl } from '@/lib/seo';

const structuredData = [
    {
        '@context': 'https://schema.org',
        '@type': 'BookStore',
        name: 'Book.uz',
        alternateName: [
            "Book.uz - O'zbekistondagi eng katta onlayn kitob do'koni",
            "Kitoblar do'koni",
            'Onlayn kitob sotish'
        ],
        url: siteUrl,
        description:
            "O'zbekistondagi eng katta onlayn kitob do'koni. Keng tanlov, arzon narxlar, tez yetkazib berish.",
        inLanguage: ['uz', 'ru', 'en', 'uzc'],
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'UZ',
            addressRegion: 'Uzbekistan'
        },
        telephone: '+998',
        email: 'info@book.uz',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/catalog?keyword={search_term_string}`,
            'query-input': 'required name=search_term_string'
        },
        sameAs: ['https://www.facebook.com/book.uz', 'https://www.instagram.com/book.uz', 'https://t.me/bookuz']
    },
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Book.uz',
        alternateName: "O'zbekistondagi eng katta onlayn kitob do'koni",
        url: siteUrl,
        logo: `${siteUrl}/images/Logo.png`,
        description: "O'zbekistondagi eng katta onlayn kitob do'koni",
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'UZ',
            addressRegion: 'Uzbekistan'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+998',
            contactType: 'customer service',
            availableLanguage: ['Uzbek', 'Russian', 'English', 'Uzbek (Cyrillic)']
        },
        areaServed: {
            '@type': 'Country',
            name: 'Uzbekistan'
        },
        knowsLanguage: ['uz', 'ru', 'en', 'uzc']
    },
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Book.uz',
        alternateName: "O'zbekistondagi eng katta onlayn kitob do'koni",
        url: siteUrl,
        description:
            "O'zbekistondagi eng katta onlayn kitob do'koni. Keng tanlov, arzon narxlar, tez yetkazib berish.",
        inLanguage: 'uz',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/catalog?keyword={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    }
];

export default function HomepageStructuredData() {
    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData)
            }}
        />
    );
}
