import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

import '@/app/globals.css';
import { Footer } from '@/components/shared/Footer';
import { Navbar } from '@/components/shared/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';
import I18nProvider from '@/providers/I18nProvider';

import { Toaster } from 'react-hot-toast';

const rubik = Rubik({
    subsets: ['latin', 'cyrillic'], // O'zbek tili uchun lotin va kirill kerak bo'lishi mumkin
    display: 'swap',
    variable: '--font-rubik' // CSS o'zgaruvchisi sifatida ishlatish uchun
});

export const metadata: Metadata = {
    title: 'Book.uz - Onlayn Kutubxona',
    description: 'Sizning shaxsiy kutubxonangiz'
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang='uz' suppressHydrationWarning>
            <body
                className={`${rubik.className} ${rubik.variable} min-h-screen bg-white font-sans text-gray-900 antialiased transition-colors duration-300 dark:bg-slate-900 dark:text-white`}>
                <NextThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
                    <I18nProvider>
                        <CustomThemeProvider>
                            <AuthProvider>
                                <div className='relative flex min-h-screen flex-col'>
                                    <Toaster position='top-center' />
                                    <Navbar />
                                    <main className='flex-1'>{children}</main>
                                    <Footer />
                                </div>
                            </AuthProvider>
                        </CustomThemeProvider>
                    </I18nProvider>
                </NextThemeProvider>
            </body>
        </html>
    );
}
