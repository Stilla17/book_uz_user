import { absoluteImageUrl, getLocalizedText, siteUrl } from '@/lib/seo';
import type { Book } from '@/types/book';
import type { NewsItems } from '@/types/news';

type NewsWithContent = NewsItems & {
    content?: NewsItems['description'];
    updatedAt?: string;
};

export function BookStructuredData({ book }: { book: Book }) {
    const title = getLocalizedText(book.title, 'Kitob');
    const description = getLocalizedText(book.description);
    const author =
        typeof book.authorName === 'string'
            ? book.authorName
            : book.authorName?.name ||
              (typeof book.author === 'object' ? book.author.name : undefined) ||
              (typeof book.author === 'string' ? book.author : undefined) ||
              'Book.uz';

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: title,
        author: {
            '@type': 'Person',
            name: author
        },
        description,
        image: absoluteImageUrl(book.images || book.image),
        inLanguage: book.language || 'uz',
        publisher: book.publisherName || book.publisher || 'Book.uz',
        isbn: book.isbn || book.barcode,
        bookFormat: book.cover === 'paper' ? 'Paperback' : 'Hardcover',
        numberOfPages: book.numberOfPage || book.pages,
        offers: {
            '@type': 'Offer',
            price: book.discountPrice || book.price,
            priceCurrency: 'UZS',
            availability: Number(book.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'Book.uz'
            }
        }
    };

    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData)
            }}
        />
    );
}

export function NewsStructuredData({ news }: { news: NewsWithContent }) {
    const title = getLocalizedText(news.title, 'Yangilik');
    const description = getLocalizedText(news.excerpt) || getLocalizedText(news.description);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        image: absoluteImageUrl(news.image),
        author: {
            '@type': 'Organization',
            name: 'Book.uz'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Book.uz',
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/images/Logo.png`
            }
        },
        datePublished: news.createdAt,
        dateModified: news.updatedAt || news.createdAt,
        inLanguage: 'uz'
    };

    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData)
            }}
        />
    );
}
