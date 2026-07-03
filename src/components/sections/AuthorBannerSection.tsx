'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';

import { bookService } from '@/services/book.service';
import { UserBanner, userBannerService } from '@/services/userBanner.service';
import { Book } from '@/types';

import { BookSection } from './BookSection';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Award,
    BookOpen,
    ChevronRight,
    Cloud,
    Coffee,
    Compass,
    Crown,
    Diamond,
    Feather,
    Flower2,
    Gem,
    Heart,
    Leaf,
    Moon,
    Quote,
    Sparkles,
    Star,
    Sun,
    Zap
} from 'lucide-react';

// TO'G'RI IMPORT!

interface AuthorBannerProps {
    authorId?: string;
}

export const AuthorBannerSection = ({ authorId }: AuthorBannerProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [banner, setBanner] = useState<UserBanner | null>(null);
    const [loading, setLoading] = useState(true);
    const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
    const [booksLoading, setBooksLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const fetchAuthorBanner = async () => {
            try {
                setLoading(true);
                const banners = await userBannerService.getAuthorBanners();

                // Agar authorId berilgan bo'lsa, shu author uchun banner topish
                if (authorId && banners.length > 0) {
                    const authorBanner = banners.find((b) => b.author?.authorId === authorId);
                    if (authorBanner) {
                        setBanner(authorBanner);
                        // Banner topilganda, shu authorning kitoblarini yuklash
                        if (authorBanner.author?.authorId) {
                            fetchAuthorBooks(authorBanner.author.authorId);
                        }
                    } else {
                        setBanner(banners[0] || null);
                        if (banners[0]?.author?.authorId) {
                            fetchAuthorBooks(banners[0].author.authorId);
                        }
                    }
                } else {
                    // Agar authorId berilmagan bo'lsa, birinchi author bannerni olish
                    setBanner(banners[0] || null);
                    if (banners[0]?.author?.authorId) {
                        fetchAuthorBooks(banners[0].author.authorId);
                    }
                }
            } catch (error) {
                console.error('Error fetching author banner:', error);
                setBanner(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorBanner();
    }, [authorId]);

    // Muallifning kitoblarini yuklash
    const fetchAuthorBooks = async (authorId: string) => {
        try {
            setBooksLoading(true);
            // Backenddan shu muallifning kitoblarini olish
            const response = await bookService.getBooksByAuthor(authorId);
            setAuthorBooks(response.books || []);
        } catch (error) {
            console.error('Error fetching author books:', error);
            setAuthorBooks([]);
        } finally {
            setBooksLoading(false);
        }
    };

    if (loading) {
        return (
            <section className='py-8 md:py-12'>
                <div className='container mx-auto max-w-[1400px] px-4'>
                    <div className='relative h-[420px] w-full animate-pulse overflow-hidden rounded-3xl bg-gradient-to-r from-gray-300 to-gray-200 sm:rounded-[50px] md:h-[500px] dark:from-slate-800 dark:to-slate-800' />
                </div>
            </section>
        );
    }

    if (!banner || !banner.author) {
        return null;
    }

    const { author } = banner;

    // Fallback image
    const imageSrc = imageError
        ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2000'
        : banner.imageUrl;

    const handleBannerClick = (link?: string) => {
        userBannerService.trackClick(banner._id);
        if (link) {
            window.location.href = link;
        }
    };

    return (
        <section className='bg-background relative overflow-hidden py-8 md:py-12 dark:bg-slate-900'>
            <div className='relative z-10 container mx-auto max-w-[1400px] px-4'>
                <motion.div
                    className='group relative mb-0 h-[420px] w-full overflow-hidden rounded-3xl shadow-2xl sm:rounded-[50px] md:h-[500px] dark:shadow-2xl dark:shadow-[#00a0e3]/20'
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    style={{ y }}>
                    <motion.div
                        className='absolute inset-0'
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 8 }}>
                        <Image
                            src={imageSrc}
                            alt={author.name || ''}
                            fill
                            className='object-cover'
                            priority
                            onError={() => setImageError(true)}
                        />
                    </motion.div>

                    <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent dark:from-slate-900/95 dark:via-slate-900/80' />

                    <div className='absolute top-6 right-6 opacity-10 sm:top-10 sm:right-10'>
                        <Quote size={88} className='text-white sm:size-[120px] dark:text-slate-400' />
                    </div>

                    <div className='absolute inset-0 flex min-w-0 flex-col justify-center px-5 text-white sm:px-10 md:px-20'>
                        <motion.div
                            className='mb-4 flex flex-wrap items-center gap-2 sm:gap-3'
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}>
                            <span className='rounded-full border border-white/30 bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-md dark:border-slate-600 dark:bg-slate-800/50'>
                                Tavsiya etilgan muallif
                            </span>
                            <span className='flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] px-3 py-1 text-sm font-medium backdrop-blur-md dark:from-blue-600 dark:to-orange-600'>
                                <Award size={14} />
                                Top Author
                            </span>
                        </motion.div>

                        <motion.h2
                            className='mb-3 text-3xl font-black tracking-tight break-words text-white sm:text-5xl md:text-7xl'
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}>
                            {author.name}
                        </motion.h2>

                        {author.shortBio?.uz && (
                            <motion.p
                                className='mb-4 line-clamp-2 text-base font-light text-gray-200 sm:text-xl md:text-2xl dark:text-gray-300'
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}>
                                {author.shortBio.uz}
                            </motion.p>
                        )}

                        <motion.div
                            className='mb-6 flex flex-wrap gap-3 sm:gap-6'
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}>
                            {author.birthYear && (
                                <div className='flex items-center gap-2'>
                                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'>
                                        <span className='text-sm'>📅</span>
                                    </div>
                                    <span className='text-sm font-medium text-white/90'>
                                        {author.birthYear} - {author.deathYear || 'h.v'}
                                    </span>
                                </div>
                            )}

                            {author.country && (
                                <div className='flex items-center gap-2'>
                                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'>
                                        <span className='text-sm'>📍</span>
                                    </div>
                                    <span className='text-sm font-medium text-white/90'>{author.country}</span>
                                </div>
                            )}

                            <div className='flex items-center gap-2'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'>
                                    <BookOpen size={16} className='text-white' />
                                </div>
                                <span className='text-sm font-medium text-white/90'>
                                    {author.booksCount || 0} ta asar
                                </span>
                            </div>
                        </motion.div>

                        {banner.description?.uz && (
                            <motion.p
                                className='mb-8 line-clamp-3 max-w-2xl text-sm leading-relaxed text-gray-100 sm:text-lg md:text-xl dark:text-gray-300'
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}>
                                {banner.description.uz}
                            </motion.p>
                        )}

                        {banner.buttonText?.uz && (
                            <motion.div
                                className='flex flex-wrap gap-4'
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}>
                                <motion.button
                                    onClick={() => handleBannerClick(banner.buttonLink)}
                                    className='group flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-black shadow-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-[#00a0e3] hover:to-[#ef7f1a] hover:text-white sm:px-10 sm:py-4 sm:text-base dark:bg-slate-800 dark:text-white dark:hover:from-blue-600 dark:hover:to-orange-600'
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}>
                                    {banner.buttonText.uz}
                                    <ChevronRight
                                        size={20}
                                        className='transition-transform group-hover:translate-x-1'
                                    />
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Kitoblar bo'limi */}
                {authorBooks.length > 0 && (
                    <div className='mt-12'>
                        <BookSection
                            title={`${author.name} asarlari`}
                            subtitle='Muallifning eng mashhur kitoblari'
                            books={authorBooks}
                            type='author'
                            viewAllLink={banner.buttonLink || `/author/${author.authorId}`}
                        />
                    </div>
                )}

                {/* Agar authorBooks bo'lmasa va banner.selectedBooks to'liq obyekt bo'lsa */}
                {authorBooks.length === 0 && banner.selectedBooks && banner.selectedBooks.length > 0 && (
                    <div className='mt-12'>
                        <BookSection
                            title={`${author.name} asarlari`}
                            subtitle='Muallifning eng mashhur kitoblari'
                            books={banner.selectedBooks as any}
                            type='author'
                            viewAllLink={banner.buttonLink || `/author/${author.authorId}`}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};
