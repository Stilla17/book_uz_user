'use client';

import { AboutSection } from '@/components/sections/AboutSection';
import Authors from '@/components/sections/Authors';
import { BookSection } from '@/components/sections/BookSection';
import { Hero } from '@/components/sections/Hero';
import { NewsSection } from '@/components/sections/NewsSection';
import Publishers from '@/components/sections/Publishers';
import { TopSalesSection } from '@/components/sections/TopSalesSection';
import HomepageStructuredData from '@/components/seo/HomepageStructuredData';

import { useTranslation } from 'react-i18next';

const Page = () => {
    const { t } = useTranslation();

    return (
        <div className='bg-background flex flex-col dark:bg-slate-900'>
            <HomepageStructuredData />
            <h1 className='sr-only'>Book.uz — O‘zbekistondagi onlayn kitob do‘koni</h1>

            {/* Hero Section */}
            <Hero />

            {/* Yangi kelgan kitoblar */}
            <BookSection title={t('booksSection.newArrivals')} type='new' />

            {/* Eng ko'p ko'rilgan kitoblar */}
            <BookSection title={t('booksSection.mostViewed')} type='views' />

            {/* Haftalik MoySklad top sotuvlar */}
            <TopSalesSection period='week' title={t('booksSection.topWeekTitle')} />

            {/* Oylik MoySklad top sotuvlar */}
            <TopSalesSection period='month' title={t('booksSection.topMonthTitle')} />

            <Authors />

            {/* Nashryotlar */}
            <Publishers />

            {/* News Section */}
            <NewsSection />

            {/* About Section */}
            <AboutSection />
        </div>
    );
};

export default Page;
