import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Lato } from 'next/font/google';

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
    title: 'Book.uz - Onlayn Kutubxona',
    description: 'Sizning shaxsiy kutubxonangiz'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang='uz' suppressHydrationWarning>
            <body
                className={`${lato.className} ${lato.variable} min-h-screen bg-white font-sans text-gray-900 antialiased transition-colors duration-300 dark:bg-slate-900 dark:text-white`}>
                <ProviderRedux>
                    <NextThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
                        <QueryProvider>
                            <I18nProvider>
                                <CustomThemeProvider>
                                    <AuthProvider>
                                        <Toaster position='top-center' />
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
