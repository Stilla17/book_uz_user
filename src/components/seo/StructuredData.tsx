import { absoluteImageUrl, getLocalizedText, siteUrl } from '@/lib/seo';
import type { Book } from '@/types/book';
import type { NewsItems } from '@/types/news';
import { getBookAuthorName } from '@/utils/book-formatters';
import { getBookImageUrl } from '@/utils/image';

type NewsWithContent = NewsItems & {
    content?: NewsItems['description'];
    updatedAt?: string;
};

export function BookStructuredData({ book }: { book: Book }) {
    const title = getLocalizedText(book.title, 'Kitob');
    const description = getLocalizedText(book.description);
    const author = getBookAuthorName(book) || 'Book.uz';

    const bookUrl = `${siteUrl}/book/${encodeURIComponent(book.slug || book._id)}`;
    const ratingValue = Number(book.ratingAvg || book.rating);
    const ratingCount = Number(book.ratingCount || book.reviewsCount);
    const price = Number(book.discountPrice || book.price);
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': ['Book', 'Product'],
                '@id': `${bookUrl}#book`,
                url: bookUrl,
                name: title,
                author: {
                    '@type': 'Person',
                    name: author
                },
                description,
                image: absoluteImageUrl(getBookImageUrl(book)),
                inLanguage: book.language || 'uz',
                publisher: {
                    '@type': 'Organization',
                    name: book.publisherName || book.details?.publisherName || 'Book.uz'
                },
                isbn: book.isbn || book.barcode,
                sku: book.barcode || book._id,
                bookFormat:
                    book.cover === 'softcover' || book.cover === 'paperback' || book.cover === 'paper'
                        ? 'Paperback'
                        : 'Hardcover',
                numberOfPages: book.numberOfPage || book.pages,
                ...(ratingValue > 0 && ratingCount > 0
                    ? {
                          aggregateRating: {
                              '@type': 'AggregateRating',
                              ratingValue,
                              ratingCount
                          }
                      }
                    : {}),
                ...(price > 0
                    ? {
                          offers: {
                              '@type': 'Offer',
                              url: bookUrl,
                              price,
                              priceCurrency: 'UZS',
                              ...(book.stock === undefined
                                  ? {}
                                  : {
                                        availability:
                                            Number(book.stock) > 0
                                                ? 'https://schema.org/InStock'
                                                : 'https://schema.org/OutOfStock'
                                    }),
                              seller: {
                                  '@type': 'Organization',
                                  name: 'Book.uz'
                              }
                          }
                      }
                    : {})
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Bosh sahifa', item: siteUrl },
                    { '@type': 'ListItem', position: 2, name: 'Kitoblar', item: `${siteUrl}/catalog` },
                    { '@type': 'ListItem', position: 3, name: title, item: bookUrl }
                ]
            }
        ]
    };

    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData).replace(/</g, '\\u003c')
            }}
        />
    );
}

export function NewsStructuredData({ news }: { news: NewsWithContent }) {
    const title = getLocalizedText(news.title, 'Yangilik');
    const description = getLocalizedText(news.excerpt) || getLocalizedText(news.description);

    const newsUrl = `${siteUrl}/news/${encodeURIComponent(news.slug)}`;
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'NewsArticle',
                '@id': `${newsUrl}#article`,
                url: newsUrl,
                mainEntityOfPage: newsUrl,
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
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Bosh sahifa', item: siteUrl },
                    { '@type': 'ListItem', position: 2, name: 'Yangiliklar', item: `${siteUrl}/news` },
                    { '@type': 'ListItem', position: 3, name: title, item: newsUrl }
                ]
            }
        ]
    };

    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData).replace(/</g, '\\u003c')
            }}
        />
    );
}
