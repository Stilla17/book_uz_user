// app/page.tsx
"use client";

import { Hero } from "@/components/sections/Hero";
import { CategorySection } from "@/components/sections/Categories";
import { BookSection } from "@/components/sections/BookSection";
import { AuthorBannerSection } from "@/components/sections/AuthorBannerSection";
import { AuthorBannerData } from "@/types";
import { AuthorQuoteSection } from "@/components/sections/AuthorQuoteSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DeliverySection } from "@/components/sections/DeliverySection";
import { SupportSection } from "@/components/sections/SupportSection";
import { AudioBooksSection } from "@/components/sections/AudioBooksSection";
import { DownloadAppSection } from "@/components/sections/DownloadAppSection";
import { NewsSection } from "@/components/sections/NewsSection";

const Page = () => {
    // Tasavvur qilamiz bazadan ma'lumot kelyapti (Yoki null)
    const authorFromDB: AuthorBannerData | null = null;
    const quotesFromDB = null;

    return (
        <div className="flex flex-col bg-white dark:bg-slate-900">
            {/* Hero Section */}
            <Hero />

            {/* Kategoriyalar - Hero bilan yonma-yon */}
            <CategorySection />

            {/* Yangi kelgan kitoblar */}
            <BookSection
                title="Yangi kelgan kitoblar"
                subtitle="Eng so'nggi nashrlar"
                type="new"
            />

            {/* Hafta xitlari */}
            <BookSection
                title="Hafta xitlari"
                subtitle="Eng ko'p o'qilgan kitoblar"
                type="popular"
            />

            {/* Author Banner */}
            <AuthorBannerSection data={authorFromDB} />

            {/* Sizga yoqishi mumkin */}
            <BookSection
                title="Sizga yoqishi mumkin"
                subtitle="Shaxsiy tavsiyalar"
                type="default"
            />

            {/* Author Quote */}
            <AuthorQuoteSection />

            {/* About Section */}
            <AboutSection />

            {/* Services Section */}
            <ServicesSection />

            {/* Delivery Section */}
            <DeliverySection />

            {/* Support Section */}
            <SupportSection />

            {/* Audio Books Section */}
            <AudioBooksSection />

            {/* Download App Section */}
            <DownloadAppSection />

            {/* News Section */}
            <NewsSection />
        </div>
    );
};

export default Page;