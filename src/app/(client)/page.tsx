'use client';

import { AboutSection } from '@/components/sections/AboutSection';
import { AuthorQuoteSection } from '@/components/sections/AuthorQuoteSection';
import Authors from '@/components/sections/Authors';
import { BookSection } from '@/components/sections/BookSection';
import { CategorySection } from '@/components/sections/Categories';
import { DownloadAppSection } from '@/components/sections/DownloadAppSection';
import { Hero } from '@/components/sections/Hero';
import { NewsSection } from '@/components/sections/NewsSection';
import Publishers from '@/components/sections/Publishers';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { SupportSection } from '@/components/sections/SupportSection';

import { useTranslation } from 'react-i18next';

const Page = () => {
    const { t } = useTranslation();

    return (
        <div className='bg-background flex flex-col dark:bg-slate-900'>
            {/* Hero Section */}
            <Hero />

            {/* Kategoriyalar - Hero bilan yonma-yon */}
            <CategorySection />

            {/* Yangi kelgan kitoblar */}
            <BookSection
                title={t('booksSection.newArrivals')}
                subtitle={t('booksSection.newArrivalsSubtitle')}
                type='new'
            />

            {/* Hafta xitlari */}
            <BookSection
                title={t('booksSection.bestWeek')}
                subtitle={t('booksSection.bestWeekSubtitle')}
                type='popular'
            />

            {/* Sizga yoqishi mumkin */}
            <BookSection
                title={t('booksSection.bestMonth')}
                subtitle={t('booksSection.bestMonthSubtitle')}
                type='default'
            />

            <Authors />

            {/* Nashryotlar */}
            <Publishers />

            {/* News Section */}
            <NewsSection />

            {/* Author Quote */}
            <AuthorQuoteSection />

            {/* About Section */}
            <AboutSection />

            {/* Services Section */}
            <ServicesSection />

            {/* Support Section */}
            <SupportSection />

            {/* Download App Section */}
            <DownloadAppSection />
        </div>
    );
};

export default Page;
