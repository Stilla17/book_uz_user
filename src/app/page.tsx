'use client';

import { AboutSection } from '@/components/sections/AboutSection';
import { AuthorBannerSection } from '@/components/sections/AuthorBannerSection';
import { AuthorQuoteSection } from '@/components/sections/AuthorQuoteSection';
import { BookSection } from '@/components/sections/BookSection';
import { CategorySection } from '@/components/sections/Categories';
import { DeliverySection } from '@/components/sections/DeliverySection';
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
        <div className='flex flex-col bg-white dark:bg-slate-900'>
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

            {/* Author Banner */}
            {/* <AuthorBannerSection /> */}

            {/* Nashryotlar */}
            <Publishers />

            {/* Author Quote */}
            <AuthorQuoteSection />

            {/* About Section */}
            <AboutSection />

            {/* Services Section */}
            <ServicesSection />

            {/* Delivery Section */}
            {/* <DeliverySection /> */}

            {/* Support Section */}
            <SupportSection />

            {/* Download App Section */}
            <DownloadAppSection />

            {/* News Section */}
            <NewsSection />
        </div>
    );
};

export default Page;
