'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { UserBanner, userBannerService } from '@/services/userBanner.service';

import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    Award,
    Bell,
    Calendar,
    ChevronRight,
    Clock,
    Cloud,
    Coffee,
    Compass,
    Crown,
    Flower2,
    Gem,
    Headphones,
    Heart,
    Megaphone,
    Moon,
    Music,
    Newspaper,
    Sparkles,
    Star,
    Sun,
    Tag,
    Zap
} from 'lucide-react';

// Yangilik banneri uchun type
type NewsBanner = UserBanner;

export const NewsSection = () => {
    const [news, setNews] = useState<NewsBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Yangiliklarni yuklash
    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            setLoading(true);
            // Bannerlardan faqat 'news' tipidagilarni olish
            const banners = await userBannerService.getNewsBanners();

            // Faol va tartiblangan yangiliklar
            const activeNews = banners.filter((banner) => banner.isActive).sort((a, b) => a.order - b.order);

            setNews(activeNews);
        } catch (error) {
            console.error('Yangiliklar yuklanmadi:', error);
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    // Yangilik bosilganda statistikani yangilash
    const handleNewsClick = (bannerId: string, link?: string) => {
        userBannerService.trackClick(bannerId);
        if (link) {
            window.location.href = link;
        }
    };

    // Floating icons array
    const floatingIcons = [
        Sparkles,
        Star,
        Heart,
        Crown,
        Zap,
        Award,
        Gem,
        Flower2,
        Sun,
        Moon,
        Cloud,
        Coffee,
        Compass,
        Headphones,
        Music,
        Newspaper,
        Megaphone
    ];

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    // Kategoriya uslubini olish
    const getCategoryStyles = (badge?: UserBanner['badge'] | string) => {
        const badgeText = typeof badge === 'string' ? badge.toLowerCase() : badge?.uz?.toLowerCase() || '';

        if (badgeText.includes('yangilanish') || badgeText.includes('update')) {
            return {
                bg: 'bg-[#00a0e3]/10 dark:bg-blue-600/20',
                text: 'text-[#00a0e3] dark:text-blue-400',
                icon: <Sparkles size={12} className='text-[#00a0e3] dark:text-blue-400' />
            };
        }
        if (badgeText.includes('kitob') || badgeText.includes('book')) {
            return {
                bg: 'bg-[#ef7f1a]/10 dark:bg-orange-600/20',
                text: 'text-[#ef7f1a] dark:text-orange-400',
                icon: <Newspaper size={12} className='text-[#ef7f1a] dark:text-orange-400' />
            };
        }
        if (badgeText.includes('aksiya') || badgeText.includes('event') || badgeText.includes('акция')) {
            return {
                bg: 'bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20',
                text: 'text-[#00a0e3] dark:text-blue-400',
                icon: <Tag size={12} className='text-[#ef7f1a] dark:text-orange-400' />
            };
        }
        if (badgeText.includes('promo') || badgeText.includes('chegirma')) {
            return {
                bg: 'bg-purple-100 dark:bg-purple-900/30',
                text: 'text-purple-600 dark:text-purple-400',
                icon: <Zap size={12} className='text-purple-600 dark:text-purple-400' />
            };
        }
        // Default
        return {
            bg: 'bg-gray-100 dark:bg-slate-700',
            text: 'text-gray-600 dark:text-gray-400',
            icon: <Sparkles size={12} />
        };
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <section className='bg-gradient-to-b from-white to-gray-50 py-16 dark:from-slate-900 dark:to-slate-800'>
                <div className='container mx-auto px-4'>
                    <div className='flex h-64 items-center justify-center'>
                        <div className='h-12 w-12 animate-spin rounded-full border-4 border-[#00a0e3]/20 border-t-[#00a0e3]' />
                    </div>
                </div>
            </section>
        );
    }

    if (news.length === 0) {
        return null; // Yangiliklar bo'lmasa, komponent ko'rsatilmaydi
    }

    return (
        <section className='relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-16 dark:from-slate-900 dark:to-slate-800'>
            {/* Animated Background Elements */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Floating Icons */}
                {[...Array(15)].map((_, i) => {
                    const IconComponent = floatingIcons[i % floatingIcons.length];
                    const randomTop = Math.random() * 100;
                    const randomLeft = Math.random() * 100;
                    const randomFontSize = Math.random() * 30 + 15;

                    return (
                        <motion.div
                            key={i}
                            className='absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10'
                            style={{
                                top: `${randomTop}%`,
                                left: `${randomLeft}%`,
                                fontSize: `${randomFontSize}px`
                            }}
                            animate={{
                                y: [0, -20, 20, 0],
                                x: [0, 20, -20, 0],
                                rotate: [0, 180, 360, 0],
                                opacity: [0.1, 0.2, 0.15, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 15 + 10,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}>
                            <IconComponent />
                        </motion.div>
                    );
                })}

                {/* Gradient Orbs with Parallax */}
                <motion.div
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#00a0e3]/5 blur-3xl'
                />
                <motion.div
                    animate={{
                        x: mousePosition.x * -2,
                        y: mousePosition.y * -2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#ef7f1a]/5 blur-3xl'
                />

                {/* Grid Pattern */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' />
            </div>

            <div className='relative z-10 container mx-auto max-w-6xl px-4'>
                {/* Section Header */}
                <div className='mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end'>
                    <div className='space-y-2'>
                        <div className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 px-3 py-1 dark:from-blue-600/20 dark:to-orange-600/20'>
                            <Megaphone size={14} className='text-[#00a0e3] dark:text-blue-400' />
                            <span className='text-xs font-bold text-[#ef7f1a] dark:text-orange-400'>
                                BLOG & YANGILIKLAR
                            </span>
                        </div>
                        <h2 className='text-2xl font-black md:text-3xl'>
                            <span className='text-[#00a0e3] dark:text-blue-400'>Platforma</span>{' '}
                            <span className='text-[#ef7f1a] dark:text-orange-400'>yangiliklari</span>
                        </h2>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Eng so'nggi yangiliklar va aksiyalardan xabardor bo'ling
                        </p>
                    </div>

                    <Link
                        href='/news'
                        className='group flex items-center gap-1 text-sm font-bold text-[#00a0e3] transition-colors hover:text-[#ef7f1a] dark:text-blue-400 dark:hover:text-orange-400'>
                        Barcha yangiliklar
                        <ChevronRight size={16} className='transition-transform group-hover:translate-x-1' />
                    </Link>
                </div>

                {/* News Grid */}
                <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
                    {news.slice(0, 3).map((item, index) => {
                        const styles = getCategoryStyles(item.badge);

                        return (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => handleNewsClick(item._id, item.buttonLink)}
                                className='group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20'>
                                {/* Floating Particles */}
                                <motion.div
                                    className='absolute inset-0'
                                    animate={{
                                        background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`
                                    }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Image */}
                                <div className='relative h-[180px] w-full overflow-hidden'>
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title.uz}
                                        fill
                                        className='object-cover transition-transform duration-500 group-hover:scale-110'
                                    />

                                    {/* Category Badge */}
                                    {item.badge?.uz && (
                                        <div className='absolute top-3 left-3 z-10'>
                                            <span
                                                className={`px-3 py-1 ${styles.bg} ${styles.text} flex items-center gap-1 rounded-full text-[10px] font-bold backdrop-blur-sm dark:backdrop-blur-md`}>
                                                {styles.icon}
                                                {item.badge.uz}
                                            </span>
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-slate-900/50' />
                                </div>

                                {/* Content */}
                                <div className='space-y-2 p-4'>
                                    <div className='flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500'>
                                        <div className='flex items-center gap-1'>
                                            <Calendar size={10} className='text-gray-400 dark:text-gray-500' />
                                            <span>{formatDate(item.createdAt)}</span>
                                        </div>
                                        <div className='h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600' />
                                        <div className='flex items-center gap-1'>
                                            <Clock size={10} className='text-gray-400 dark:text-gray-500' />
                                            <span>3 daq</span>
                                        </div>
                                    </div>

                                    <h3 className='line-clamp-2 text-base leading-snug font-bold text-gray-900 transition-colors group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'>
                                        {item.title.uz}
                                    </h3>

                                    {item.description?.uz && (
                                        <p className='line-clamp-2 text-xs text-gray-500 dark:text-gray-400'>
                                            {item.description.uz}
                                        </p>
                                    )}

                                    <div className='pt-2'>
                                        <span className='inline-flex items-center gap-1 text-xs font-bold text-[#ef7f1a] transition-all group-hover:gap-2 dark:text-orange-400'>
                                            Batafsil
                                            <ArrowUpRight size={14} />
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Border Effect */}
                                <div className='absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-[#00a0e3]/20 dark:group-hover:border-blue-600/30' />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Newsletter Signup */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className='relative mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-[#00a0e3]/5 to-[#ef7f1a]/5 p-6 dark:border-slate-700 dark:from-blue-600/10 dark:to-orange-600/10'>
                    {/* Floating Particles */}
                    <motion.div
                        className='absolute inset-0'
                        animate={{
                            background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    <div className='relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row'>
                        <div className='flex items-center gap-3'>
                            <div className='rounded-xl bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] p-2 dark:from-blue-600 dark:to-orange-600'>
                                <Bell size={18} className='text-white' />
                            </div>
                            <div>
                                <h3 className='text-sm font-black text-gray-900 dark:text-white'>
                                    Yangiliklarni o'tkazib yubormang!
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Haftalik dayjest va maxsus takliflar
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubscribe} className='flex w-full gap-2 md:w-auto'>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email manzilingiz'
                                className='flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#00a0e3] md:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400'
                                required
                            />
                            <button
                                type='submit'
                                className='rounded-xl bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600 dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20'>
                                {subscribed ? '✅' : 'Obuna'}
                            </button>
                        </form>
                    </div>

                    {subscribed && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='relative z-10 mt-2 text-center text-xs text-green-600 dark:text-green-400'>
                            Muvaffaqiyatli obuna bo'ldingiz!
                        </motion.p>
                    )}
                </motion.div>

                {/* Bottom Stats */}
                <div className='mt-8 flex justify-center gap-6 text-xs text-gray-400 dark:text-gray-500'>
                    <span>📰 {news.length}+ yangilik</span>
                    <span>📧 5K+ obunachi</span>
                    <span>🔥 Haftada 3 yangilik</span>
                </div>
            </div>
        </section>
    );
};
