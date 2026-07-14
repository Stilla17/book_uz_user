import type { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';
import { Lato } from 'next/font/google';
import Script from 'next/script';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';
import I18nProvider from '@/providers/I18nProvider';
import ProviderRedux from '@/providers/ProviderRedux';
import QueryProvider from '@/providers/QueryProvider';

import { Toaster } from 'react-hot-toast';

const lato = Lato({
    subsets: ['latin', 'latin-ext'], // O'zbek tili uchun lotin va kirill kerak bo'lishi mumkin
    display: 'swap',
    weight: ['300', '400', '700', '900'],
    variable: '--font-lato' // CSS o'zgaruvchisi sifatida ishlatish uchun
});

export const metadata: Metadata = {
    metadataBase: new URL('https://book.uz'),
    title: "Book.uz - O'zbekistondagi eng katta onlayn kitob do'koni",
    description: "O'zbekistondagi eng katta onlayn kitob do'koni. Keng tanlov, arzon narxlar, tez yetkazib berish.",
    keywords: [
        'kitoblar',
        "o'zbekiston",
        "onlayn kitob do'koni",
        'book.uz',
        'mutolaa',
        'kitob sotib olish',
        "kitob do'koni",
        "o'zbek kitoblari"
    ],
    authors: [{ name: 'Book.uz', url: 'https://book.uz' }],
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1
        }
    },
    alternates: {
        canonical: '/',
        languages: {
            uz: '/',
            'uz-UZ': '/',
            ru: '/ru',
            'ru-UZ': '/ru',
            en: '/en',
            'en-US': '/en',
            'x-default': '/'
        }
    },
    openGraph: {
        title: "Book.uz - O'zbekistondagi eng katta onlayn kitob do'koni",
        description: "O'zbekistondagi eng katta onlayn kitob do'koni. Keng tanlov, arzon narxlar, tez yetkazib berish.",
        url: 'https://book.uz',
        siteName: 'Book.uz',
        type: 'website',
        locale: 'uz_UZ',
        alternateLocale: ['ru_UZ', 'en_US'],
        images: [
            {
                url: '/images/Logo.png',
                width: 1200,
                height: 630,
                alt: "Book.uz - O'zbekistondagi eng katta onlayn kitob do'koni"
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: "Book.uz - O'zbekistondagi eng katta onlayn kitob do'koni",
        description: "O'zbekistondagi eng katta onlayn kitob do'koni. Keng tanlov, arzon narxlar, tez yetkazib berish.",
        images: ['/images/Logo.png']
    },
    icons: {
        icon: [
            {
                url: '/icon.png',
                type: 'image/png',
                sizes: '512x512'
            }
        ],
        apple: [
            {
                url: '/apple-icon.png',
                type: 'image/png',
                sizes: '180x180'
            }
        ]
    },
    verification: {
        google: ['zHzH3XPkCpx2XTwm4pT6i0D3-pAkkWrZHqnpWeRwg34', '-BydBasVJ4BmriSeHDfSgK5F-gVD-X1wpJ7hKot1dEY']
    },
    other: {
        'facebook-domain-verification': 'be1efv9z1e7sdokw9wqbk3zgumqlof',
        language: 'uz',
        'content-language': 'uz',
        'geo.region': 'UZ',
        'geo.placename': 'Uzbekistan',
        'geo.country': 'UZ',
        'content-type': 'text/html; charset=utf-8',
        distribution: 'global',
        rating: 'general',
        'revisit-after': '1 days',
        google: 'notranslate',
        bingbot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    }
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#000000'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang='uz' suppressHydrationWarning>
            <body
                className={`${lato.className} ${lato.variable} bg-background min-h-screen font-sans text-gray-900 antialiased transition-colors duration-300 dark:bg-slate-900 dark:text-white`}>
                <ProviderRedux>
                    <NextThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
                        <QueryProvider>
                            <I18nProvider>
                                <CustomThemeProvider>
                                    <AuthProvider>
                                        <Toaster position='top-center' />
                                        <Script id='yandex-metrika' strategy='afterInteractive'>
                                            {`
                                                (function (m, e, t, r, i, k, a) {
                                                    m[i] = m[i] || function () {
                                                        (m[i].a = m[i].a || []).push(arguments);
                                                    };
                                                    m[i].l = 1 * new Date();
                                                    for (var j = 0; j < document.scripts.length; j++) {
                                                        if (document.scripts[j].src === r) {
                                                            return;
                                                        }
                                                    }
                                                    k = e.createElement(t);
                                                    a = e.getElementsByTagName(t)[0];
                                                    k.async = 1;
                                                    k.src = r;
                                                    a.parentNode.insertBefore(k, a);
                                                })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                                                ym(89693632, "init", {
                                                    clickmap: true,
                                                    trackLinks: true,
                                                    accurateTrackBounce: true
                                                });
                                            `}
                                        </Script>
                                        <noscript>
                                            <div>
                                                <img
                                                    src='https://mc.yandex.ru/watch/89693632'
                                                    style={{ position: 'absolute', left: '-9999px' }}
                                                    alt=''
                                                />
                                            </div>
                                        </noscript>
                                        <Script id='facebook-pixel' strategy='afterInteractive'>
                                            {`
                                                !(function (f, b, e, v, n, t, s) {
                                                    if (f.fbq) return;
                                                    n = f.fbq = function () {
                                                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                                                    };
                                                    if (!f._fbq) f._fbq = n;
                                                    n.push = n;
                                                    n.loaded = !0;
                                                    n.version = "2.0";
                                                    n.queue = [];
                                                    t = b.createElement(e);
                                                    t.async = !0;
                                                    t.src = v;
                                                    s = b.getElementsByTagName(e)[0];
                                                    s.parentNode.insertBefore(t, s);
                                                })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
                                                fbq("init", "345384311180158");
                                                fbq("track", "PageView");
                                            `}
                                        </Script>
                                        <noscript>
                                            <img
                                                height='1'
                                                width='1'
                                                style={{ display: 'none' }}
                                                src='https://www.facebook.com/tr?id=345384311180158&ev=PageView&noscript=1'
                                                alt=''
                                            />
                                        </noscript>
                                        {children}
                                    </AuthProvider>
                                </CustomThemeProvider>
                            </I18nProvider>
                        </QueryProvider>
                    </NextThemeProvider>
                </ProviderRedux>
            </body>
        </html>
    );
}
