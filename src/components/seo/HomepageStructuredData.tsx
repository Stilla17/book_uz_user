import { getLocalizedPath } from '@/lib/i18n-routing';
import { absoluteUrl, siteUrl } from '@/lib/seo';

const createStructuredData = (locale: string) => ({
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'BookStore',
            '@id': `${siteUrl}/#store`,
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
            telephone: '+998712300050',
            email: 'support@book.uz',
            potentialAction: {
                '@type': 'SearchAction',
                target: `${absoluteUrl(getLocalizedPath(locale, '/catalog'))}?keyword={search_term_string}`,
                'query-input': 'required name=search_term_string'
            },
            sameAs: [
                'https://www.facebook.com/bookuzbekistan',
                'https://www.instagram.com/bookuzbekistan/',
                'https://t.me/bookuzbekistan',
                'https://www.youtube.com/@bookuzbekistan'
            ]
        },
        {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Book.uz',
            alternateName: "O'zbekistondagi eng katta onlayn kitob do'koni",
            url: siteUrl,
            logo: `${siteUrl}/images/Logo.png`,
            description: "O'zbekistondagi eng katta onlayn kitob do'koni",
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+998712300050',
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
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            name: 'Book.uz',
            alternateName: "O'zbekistondagi eng katta onlayn kitob do'koni",
            url: siteUrl,
            description:
                "O'zbekistondagi eng katta onlayn kitob do'koni. Keng tanlov, arzon narxlar, tez yetkazib berish.",
            inLanguage: 'uz',
            potentialAction: {
                '@type': 'SearchAction',
                target: `${absoluteUrl(getLocalizedPath(locale, '/catalog'))}?keyword={search_term_string}`,
                'query-input': 'required name=search_term_string'
            },
            publisher: { '@id': `${siteUrl}/#organization` }
        }
    ]
});

export default function HomepageStructuredData({ locale = 'uz' }: { locale?: string }) {
    const serializedStructuredData = JSON.stringify(createStructuredData(locale)).replace(/</g, '\\u003c');

    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
                __html: serializedStructuredData
            }}
        />
    );
}
