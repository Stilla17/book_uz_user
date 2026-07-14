'use client';

import { AboutSection } from '@/components/sections/AboutSection';
import Authors from '@/components/sections/Authors';
import { BookSection } from '@/components/sections/BookSection';
import { Hero } from '@/components/sections/Hero';
import { NewsSection } from '@/components/sections/NewsSection';
import Publishers from '@/components/sections/Publishers';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { SupportSection } from '@/components/sections/SupportSection';
import { TopSalesSection } from '@/components/sections/TopSalesSection';
import HomepageStructuredData from '@/components/seo/HomepageStructuredData';

import { useTranslation } from 'react-i18next';

const Page = () => {
    const { t } = useTranslation();

    return (
        <div className='bg-background flex flex-col dark:bg-slate-900'>
            <HomepageStructuredData />

            {/* Hero Section */}
            <Hero />

            {/* Yangi kelgan kitoblar */}
            <BookSection title={t('booksSection.newArrivals')} type='new' />

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

            {/* Services Section */}
            <ServicesSection />

            {/* Support Section */}
            <SupportSection />
        </div>
    );
};

export default Page;
