'use client';

import React, { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { usePublicCategoriesQuery } from '@/hooks/queries/usePublicCategoriesQuery';
import type { Category } from '@/types/category.types';

import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Award,
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    Cloud,
    Coffee,
    Compass,
    Crown,
    Eye,
    Filter,
    Flower2,
    FolderOpen,
    Gem,
    Globe,
    Grid,
    Headphones,
    Heart,
    List,
    Loader2,
    Mic,
    Moon,
    Music,
    Package,
    Palette,
    Rocket,
    Search,
    Shield,
    ShoppingCart,
    SlidersHorizontal,
    Sparkles,
    Star,
    Sun,
    Tag,
    TrendingUp,
    Truck,
    Users,
    X,
    Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'bookCount' | 'newest'>('bookCount');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { data: categories = [], isLoading: loading, error } = usePublicCategoriesQuery();

    // Mouse position for parallax effect
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

    useEffect(() => {
        if (error) {
            console.error('Kategoriyalar yuklanmadi:', error);
            toast.error('Kategoriyalar yuklanmadi');
        }
    }, [error]);

    const filteredCategories = useMemo(() => {
        let filtered = categories.filter((cat) => cat.isActive !== false);

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (cat) =>
                    cat.title.uz.toLowerCase().includes(query) ||
                    cat.title.ru.toLowerCase().includes(query) ||
                    cat.description?.uz?.toLowerCase().includes(query)
            );
        }

        return [...filtered].sort((a, b) => {
            if (sortBy === 'name') {
                return a.title.uz.localeCompare(b.title.uz);
            } else if (sortBy === 'bookCount') {
                return (b.bookCount || 0) - (a.bookCount || 0);
            }
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
    }, [categories, searchQuery, sortBy]);

    const getCategoryIcon = (category: Category) => {
        if (category.icon) {
            return category.icon;
        }

        // Slug asosida icon
        const iconMap: Record<string, string> = {
            detektiv: '🔍',
            detektivlar: '🔍',
            fantastika: '🚀',
            fentezi: '🧙',
            roman: '💕',
            romantika: '💕',
            psixologiya: '🧠',
            psixologik: '🧠',
            tarix: '📜',
            biznes: '💼',
            bolalar: '🧸',
            ilmiy: '🔬',
            sheriyat: '📝',
            audio: '🎧',
            audiokitob: '🎧',
            darslik: '📚',
            darsliklar: '📚',
            sarguzasht: '🗺️',
            klassika: '📖',
            falsafa: '🤔',
            diniy: '🕋',
            sanat: '🎨',
            kompyuter: '💻',
            dasturlash: '👨‍💻',
            chet_tili: '🌐',
            lugat: '📘'
        };

        return iconMap[category.slug?.toLowerCase()] || '📚';
    };

    const getCategoryColor = (slug: string): string => {
        const colorMap: Record<string, string> = {
            detektiv: 'from-red-500 to-orange-500',
            detektivlar: 'from-red-500 to-orange-500',
            fantastika: 'from-purple-500 to-blue-500',
            fentezi: 'from-indigo-500 to-purple-500',
            roman: 'from-pink-500 to-rose-500',
            romantika: 'from-pink-500 to-rose-500',
            psixologiya: 'from-green-500 to-emerald-500',
            psixologik: 'from-green-500 to-emerald-500',
            tarix: 'from-amber-500 to-yellow-500',
            biznes: 'from-blue-500 to-cyan-500',
            bolalar: 'from-orange-500 to-yellow-500',
            ilmiy: 'from-teal-500 to-green-500',
            sheriyat: 'from-fuchsia-500 to-pink-500',
            audio: 'from-violet-500 to-purple-500',
            audiokitob: 'from-violet-500 to-purple-500',
            darslik: 'from-slate-500 to-gray-500',
            darsliklar: 'from-slate-500 to-gray-500'
        };

        return colorMap[slug] || 'from-[#005CB9] to-[#FF8A00]';
    };

    const getCategoryStats = () => {
        const totalBooks = categories.reduce((sum, cat) => sum + (cat.bookCount || 0), 0);
        const featuredCount = categories.filter((c) => c.isFeatured).length;
        const activeCount = categories.filter((c) => c.isActive !== false).length;

        return { totalBooks, featuredCount, activeCount };
    };

    const stats = getCategoryStats();

    // Floating icons for background
    const floatingIcons = [
        BookOpen,
        Headphones,
        Sparkles,
        Star,
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
        Mic,
        Music,
        Palette,
        Rocket,
        Globe,
        Tag,
        TrendingUp
    ];

    if (loading) {
        return (
            <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800'>
                <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                    {[...Array(20)].map((_, i) => {
                        const IconComponent = floatingIcons[i % floatingIcons.length];
                        const randomTop = Math.random() * 100;
                        const randomLeft = Math.random() * 100;
                        const randomSize = Math.random() * 30 + 15;

                        return (
                            <motion.div
                                key={i}
                                className='absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10'
                                style={{
                                    top: `${randomTop}%`,
                                    left: `${randomLeft}%`,
                                    fontSize: `${randomSize}px`
                                }}
                                animate={{
                                    y: [0, -20, 20, 0],
                                    x: [0, 15, -15, 0],
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
                </div>

                <div className='relative z-10 text-center'>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className='mx-auto mb-6 h-20 w-20 rounded-full border-4 border-[#005CB9]/20 border-t-[#005CB9] dark:border-blue-400/20 dark:border-t-blue-400'
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className='text-lg text-gray-500 dark:text-gray-400'>
                        Kategoriyalar yuklanmoqda...
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 dark:from-slate-900 dark:to-slate-800'>
            {/* Animated Background */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {[...Array(30)].map((_, i) => {
                    const IconComponent = floatingIcons[i % floatingIcons.length];
                    const randomTop = Math.random() * 100;
                    const randomLeft = Math.random() * 100;
                    const randomSize = Math.random() * 40 + 20;

                    return (
                        <motion.div
                            key={i}
                            className='absolute text-[#00a0e3]/5 dark:text-[#ef7f1a]/5'
                            style={{
                                top: `${randomTop}%`,
                                left: `${randomLeft}%`,
                                fontSize: `${randomSize}px`
                            }}
                            animate={{
                                y: [0, -30, 30, 0],
                                x: [0, 20, -20, 0],
                                rotate: [0, 180, 360, 0],
                                opacity: [0.1, 0.2, 0.15, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 20 + 10,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}>
                            <IconComponent />
                        </motion.div>
                    );
                })}

                <motion.div
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#005CB9]/5 blur-3xl dark:bg-blue-600/10'
                />
                <motion.div
                    animate={{
                        x: mousePosition.x * -2,
                        y: mousePosition.y * -2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#FF8A00]/5 blur-3xl dark:bg-orange-600/10'
                />
            </div>
            <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-12 text-center'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className='mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 px-4 py-2 dark:from-blue-600/20 dark:to-orange-600/20'>
                        <FolderOpen size={16} className='text-[#005CB9] dark:text-blue-400' />
                        <span className='text-xs font-bold text-[#FF8A00] dark:text-orange-400'>KATEGORIYALAR</span>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='mb-4 text-4xl font-black md:text-6xl'>
                        <span className='bg-gradient-to-r from-[#005CB9] to-[#FF8A00] bg-clip-text text-transparent dark:from-blue-400 dark:to-orange-400'>
                            Kitob olami
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400'>
                        {" O'zingizga yoqqan janrni tanlang va eng sara kitoblarni kashf eting "}
                    </motion.p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
                    {[
                        {
                            label: 'Kategoriyalar',
                            value: categories.length,
                            icon: FolderOpen,
                            color: 'from-blue-500 to-cyan-500'
                        },
                        {
                            label: 'Kitoblar',
                            value: stats.totalBooks.toLocaleString(),
                            icon: BookOpen,
                            color: 'from-green-500 to-emerald-500'
                        },
                        {
                            label: 'Tanlangan',
                            value: stats.featuredCount,
                            icon: Star,
                            color: 'from-yellow-500 to-orange-500'
                        },
                        {
                            label: 'Faol',
                            value: stats.activeCount,
                            icon: CheckCircle,
                            color: 'from-purple-500 to-pink-500'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className='rounded-xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/80'>
                            <div className='flex items-center gap-3'>
                                <div
                                    className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon size={20} className='text-white' />
                                </div>
                                <div>
                                    <div className='text-2xl font-black text-gray-900 dark:text-white'>
                                        {stat.value}
                                    </div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>{stat.label}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search and Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className='mb-8 rounded-xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                    <div className='flex flex-col gap-4 md:flex-row'>
                        {/* Search */}
                        <div className='relative flex-1'>
                            <Search
                                className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500'
                                size={18}
                            />
                            <input
                                type='text'
                                placeholder='Kategoriya qidirish...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full rounded-xl border border-gray-200 bg-white py-3 pr-10 pl-10 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#005CB9] focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-blue-400'
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Controls */}
                        <div className='flex gap-2'>
                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#005CB9] focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'>
                                <option value='bookCount'>{"Eng ko'p kitoblar"}</option>
                                <option value='name'>{"Nomi bo'yicha"}</option>
                                <option value='newest'>Eng yangilar</option>
                            </select>

                            {/* View Mode */}
                            <div className='flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-slate-700'>
                                {[
                                    { mode: 'grid', icon: Grid },
                                    { mode: 'list', icon: List },
                                    { mode: 'compact', icon: SlidersHorizontal }
                                ].map(({ mode, icon: Icon }) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode as any)}
                                        className={`rounded-lg p-2 transition-all ${
                                            viewMode === mode
                                                ? 'bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white dark:from-blue-600 dark:to-orange-600'
                                                : 'text-gray-400 hover:text-[#005CB9] dark:text-gray-500 dark:hover:text-blue-400'
                                        }`}>
                                        <Icon size={18} />
                                    </button>
                                ))}
                            </div>

                            {/* Filters Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all ${
                                    showFilters
                                        ? 'border-transparent bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white dark:from-blue-600 dark:to-orange-600'
                                        : 'border-gray-200 text-gray-700 hover:border-[#005CB9] dark:border-slate-600 dark:text-gray-300 dark:hover:border-blue-400'
                                }`}>
                                <Filter size={16} />
                                <span className='hidden sm:inline'>Filter</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className='mt-4 overflow-hidden border-t border-gray-200 pt-4 dark:border-slate-700'>
                                <div className='flex flex-wrap gap-4'>
                                    <label className='flex cursor-pointer items-center gap-2'>
                                        <input
                                            type='checkbox'
                                            className='h-4 w-4 rounded border-gray-300 text-[#005CB9] focus:ring-[#005CB9]'
                                        />
                                        <span className='text-sm text-gray-700 dark:text-gray-300'>
                                            Faqat tanlanganlar
                                        </span>
                                    </label>
                                    <label className='flex cursor-pointer items-center gap-2'>
                                        <input
                                            type='checkbox'
                                            className='h-4 w-4 rounded border-gray-300 text-[#005CB9] focus:ring-[#005CB9]'
                                        />
                                        <span className='text-sm text-gray-700 dark:text-gray-300'>Kitobi borlar</span>
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Categories Grid/List */}
                {filteredCategories.length > 0 ? (
                    <>
                        {viewMode === 'grid' && (
                            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                                {filteredCategories.map((category, index) => {
                                    const gradientColors = getCategoryColor(category.slug);
                                    const icon = getCategoryIcon(category);

                                    return (
                                        <motion.div
                                            key={category._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 0.7 }}
                                            whileHover={{ y: -8 }}
                                            className='group'>
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className='block overflow-hidden rounded-2xl border border-gray-100 bg-white/90 backdrop-blur-sm transition-all hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800/90 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                                {/* Image/Icon Section */}
                                                <div
                                                    className={`relative h-40 bg-gradient-to-br ${gradientColors} bg-opacity-10 flex items-center justify-center overflow-hidden`}>
                                                    {category.image ? (
                                                        <Image
                                                            src={category.image}
                                                            alt={category.title.uz}
                                                            fill
                                                            className='object-cover transition-transform duration-500 group-hover:scale-110'
                                                        />
                                                    ) : (
                                                        <motion.span
                                                            animate={{ rotate: [0, 5, -5, 0] }}
                                                            transition={{ duration: 3, repeat: Infinity }}
                                                            className='transform text-6xl transition-transform duration-500 group-hover:scale-110'>
                                                            {icon}
                                                        </motion.span>
                                                    )}

                                                    {/* Count Badge */}
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: index * 0.1 + 0.8, type: 'spring' }}
                                                        className='absolute top-3 right-3 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-xs font-bold text-[#005CB9] shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90 dark:text-blue-400'>
                                                        {category.bookCount?.toLocaleString() || 0} ta
                                                    </motion.div>

                                                    {/* Featured Badge */}
                                                    {category.isFeatured && (
                                                        <div className='absolute top-3 left-3'>
                                                            <span className='flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-xs text-white shadow-lg'>
                                                                <Star size={10} className='fill-white' />
                                                                Tanlangan
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className='p-5'>
                                                    <h3 className='mb-2 text-xl font-black text-gray-900 transition-colors group-hover:text-[#005CB9] dark:text-white dark:group-hover:text-blue-400'>
                                                        {category.title.uz}
                                                    </h3>

                                                    {category.description?.uz && (
                                                        <p className='mb-4 line-clamp-2 text-sm text-gray-500 dark:text-gray-400'>
                                                            {category.description.uz}
                                                        </p>
                                                    )}

                                                    {/* Subcategories Preview */}
                                                    {category.subCategories && category.subCategories.length > 0 && (
                                                        <div className='mb-3 flex flex-wrap gap-1'>
                                                            {category.subCategories.slice(0, 3).map((sub) => (
                                                                <span
                                                                    key={sub._id ?? sub.slug}
                                                                    className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-gray-400'>
                                                                    {sub.title.uz}
                                                                </span>
                                                            ))}
                                                            {category.subCategories.length > 3 && (
                                                                <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-gray-400'>
                                                                    +{category.subCategories.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className='flex items-center justify-between'>
                                                        <span className='text-xs text-gray-400 dark:text-gray-500'>
                                                            {category.title.ru}
                                                        </span>
                                                        <motion.div
                                                            whileHover={{ x: 5 }}
                                                            className='text-[#005CB9] dark:text-blue-400'>
                                                            <ChevronRight size={18} />
                                                        </motion.div>
                                                    </div>

                                                    {/* Popularity Indicator */}
                                                    {category.bookCount && category.bookCount > 500 && (
                                                        <div className='mt-3 flex items-center gap-1 text-[10px] text-[#FF8A00] dark:text-orange-400'>
                                                            <TrendingUp size={10} />
                                                            <span>Ommabop</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {viewMode === 'list' && (
                            <div className='space-y-4'>
                                {filteredCategories.map((category, index) => {
                                    const gradientColors = getCategoryColor(category.slug);
                                    const icon = getCategoryIcon(category);

                                    return (
                                        <motion.div
                                            key={category._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 + 0.7 }}
                                            whileHover={{ scale: 1.01, x: 5 }}>
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className='block rounded-xl border border-gray-100 bg-white/90 p-4 backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/90'>
                                                <div className='flex items-center gap-4'>
                                                    {/* Icon */}
                                                    <div
                                                        className={`h-16 w-16 rounded-xl bg-gradient-to-br ${gradientColors} flex flex-shrink-0 items-center justify-center text-3xl`}>
                                                        {icon}
                                                    </div>

                                                    {/* Content */}
                                                    <div className='flex-1'>
                                                        <div className='flex items-center justify-between'>
                                                            <h3 className='text-xl font-black text-gray-900 transition-colors group-hover:text-[#005CB9] dark:text-white dark:group-hover:text-blue-400'>
                                                                {category.title.uz}
                                                            </h3>
                                                            <ChevronRight
                                                                className='text-[#005CB9] dark:text-blue-400'
                                                                size={20}
                                                            />
                                                        </div>

                                                        <div className='mt-1 flex items-center gap-3'>
                                                            <span className='text-xs text-gray-400 dark:text-gray-500'>
                                                                {category.title.ru}
                                                            </span>
                                                            <span className='rounded-full bg-[#005CB9]/10 px-2 py-0.5 text-xs text-[#005CB9] dark:bg-blue-400/10 dark:text-blue-400'>
                                                                {category.bookCount?.toLocaleString() || 0} ta kitob
                                                            </span>
                                                            {category.isFeatured && (
                                                                <span className='flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600 dark:text-yellow-400'>
                                                                    <Star size={10} />
                                                                    Tanlangan
                                                                </span>
                                                            )}
                                                            {category.bookCount && category.bookCount > 500 && (
                                                                <span className='flex items-center gap-1 rounded-full bg-[#FF8A00]/10 px-2 py-0.5 text-xs text-[#FF8A00] dark:text-orange-400'>
                                                                    <TrendingUp size={10} />
                                                                    Ommabop
                                                                </span>
                                                            )}
                                                        </div>

                                                        {category.description?.uz && (
                                                            <p className='mt-2 line-clamp-1 text-sm text-gray-500 dark:text-gray-400'>
                                                                {category.description.uz}
                                                            </p>
                                                        )}

                                                        {/* Subcategories */}
                                                        {category.subCategories &&
                                                            category.subCategories.length > 0 && (
                                                                <div className='mt-2 flex flex-wrap gap-1'>
                                                                    {category.subCategories.slice(0, 5).map((sub) => (
                                                                        <span
                                                                            key={sub._id ?? sub.slug}
                                                                            className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-gray-400'>
                                                                            {sub.title.uz}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {viewMode === 'compact' && (
                            <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
                                {filteredCategories.map((category, index) => {
                                    const icon = getCategoryIcon(category);

                                    return (
                                        <motion.div
                                            key={category._id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 + 0.7 }}
                                            whileHover={{ scale: 1.05 }}>
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className='group block rounded-xl border border-gray-100 bg-white/90 p-3 text-center backdrop-blur-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/90'>
                                                <div className='mb-2 text-3xl transition-transform group-hover:scale-110'>
                                                    {icon}
                                                </div>
                                                <h3 className='mb-1 line-clamp-1 text-sm font-bold text-gray-900 dark:text-white'>
                                                    {category.title.uz}
                                                </h3>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {category.bookCount?.toLocaleString()} ta
                                                </p>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className='rounded-2xl border border-gray-100 bg-white/90 p-12 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: 'spring' }}
                            className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#005CB9] to-[#FF8A00]'>
                            <FolderOpen size={40} className='text-white' />
                        </motion.div>
                        <h2 className='mb-3 text-2xl font-black text-gray-900 dark:text-white'>Kategoriya topilmadi</h2>
                        <p className='mx-auto mb-8 max-w-md text-gray-500 dark:text-gray-400'>
                            {' "'}
                            {searchQuery}
                            {'" bo\'yicha hech qanday kategoriya topilmadi. '}
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className='rounded-xl bg-gradient-to-r from-[#005CB9] to-[#FF8A00] px-6 py-3 font-bold text-white transition-all hover:shadow-lg'>
                            Qidiruvni tozalash
                        </button>
                    </motion.div>
                )}

                {/* Popular Categories */}
                {filteredCategories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className='mt-12'>
                        <h3 className='mb-4 flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white'>
                            <TrendingUp className='text-[#FF8A00]' size={20} />
                            Ommabop kategoriyalar
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                            {filteredCategories
                                .filter((c) => c.bookCount && c.bookCount > 500)
                                .sort((a, b) => (b.bookCount || 0) - (a.bookCount || 0))
                                .slice(0, 10)
                                .map((category, index) => (
                                    <motion.div
                                        key={category._id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 + 1.1 }}>
                                        <Link
                                            href={`/category/${category.slug}`}
                                            className='inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 px-4 py-2 backdrop-blur-sm transition-all hover:border-[#005CB9] hover:text-[#005CB9] dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-blue-400 dark:hover:text-blue-400'>
                                            <span>{getCategoryIcon(category)}</span>
                                            <span className='text-sm font-bold'>{category.title.uz}</span>
                                            <span className='text-xs text-gray-400'>({category.bookCount})</span>
                                        </Link>
                                    </motion.div>
                                ))}
                        </div>
                    </motion.div>
                )}

                {/* Info Icons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className='mt-12 grid grid-cols-2 gap-4 text-center md:grid-cols-4'>
                    {[
                        { icon: Truck, text: 'Bepul yetkazish', sub: "50 000 so'mdan" },
                        { icon: Shield, text: "Xavfsiz to'lov", sub: 'Visa, MasterCard, Uzcard' },
                        { icon: Package, text: '14 kunlik kafolat', sub: 'Qaytarish imkoniyati' },
                        { icon: Headphones, text: "24/7 Qo'llab-quvvatlash", sub: 'Har doim aloqada' }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className='rounded-xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                            <item.icon size={24} className='mx-auto mb-2 text-[#005CB9] dark:text-blue-400' />
                            <div className='text-sm font-bold text-gray-900 dark:text-white'>{item.text}</div>
                            <div className='text-xs text-gray-400 dark:text-gray-500'>{item.sub}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
