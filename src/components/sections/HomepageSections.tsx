'use client';

import { AboutSection } from '@/components/sections/AboutSection';
import Authors from '@/components/sections/Authors';
import { BookSection } from '@/components/sections/BookSection';
import { NewsSection } from '@/components/sections/NewsSection';
import Publishers from '@/components/sections/Publishers';
import { TopSalesSection } from '@/components/sections/TopSalesSection';

import { useTranslation } from 'react-i18next';

export function HomepageSections() {
    const { t } = useTranslation();

    return (
        <>
            <BookSection title={t('booksSection.newArrivals')} type='new' />

            <BookSection title={t('booksSection.mostViewed')} type='views' />

            <TopSalesSection period='week' title={t('booksSection.topWeekTitle')} />

            <TopSalesSection period='month' title={t('booksSection.topMonthTitle')} />

            <Authors />

            <Publishers />

            <NewsSection />

            <AboutSection />
        </>
    );
}
