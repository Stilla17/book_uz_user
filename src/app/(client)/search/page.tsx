'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Pagination, PaginationNextIcon, PaginationPreviousIcon } from '@/components/shared/Pagination';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { getCatalogCategoryHref } from '@/lib/catalog-links';
import { UserService, api } from '@/services/api';
import type { SearchPagination, SearchProduct, SearchResults, SearchTab } from '@/types/search.types';

import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    ChevronDown,
    Clock,
    Eye,
    FolderOpen,
    Grid3x3,
    Headphones,
    Heart,
    List,
    Loader2,
    MessageCircle,
    Search,
    Share2,
    Shield,
    ShoppingCart,
    SlidersHorizontal,
    Sparkles,
    Star,
    Tag,
    TrendingUp,
    Truck,
    User,
    Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.book.uz/user-api/';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887';

const getImageUrl = (image?: string) => {
    if (!image) return FALLBACK_IMAGE;
    if (image.startsWith('http://') || image.startsWith('https://')) return image;

    return `${API_BASE_URL.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
};

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { user, isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<SearchResults>({
        products: [],
        categories: [],
        authors: [],
        totalCount: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalAuthors: 0
    });
    const [pagination, setPagination] = useState<SearchPagination>({
        page: 1,
        limit: 12,
        total: 0,
        pages: 1
    });
    const [activeTab, setActiveTab] = useState<SearchTab>('all');
    const [sortBy, setSortBy] = useState<string>('-createdAt');
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filterFormat, setFilterFormat] = useState<string>('');
    const [filterLanguage, setFilterLanguage] = useState<string>('');
    const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([0, 1000000]);

    const sortOptions = [
        { value: '-createdAt', label: 'Eng yangilar', icon: <Clock size={14} /> },
        { value: 'price', label: 'Narxi: arzon → qimmat', icon: <TrendingUp size={14} /> },
        { value: '-price', label: 'Narxi: qimmat → arzon', icon: <TrendingUp size={14} /> },
        { value: '-ratingAvg', label: "Reyting bo'yicha", icon: <Star size={14} /> },
        { value: '-views', label: "Eng ko'p ko'rilgan", icon: <Eye size={14} /> },
        { value: '-sales', label: "Eng ko'p sotilgan", icon: <ShoppingCart size={14} /> }
    ];

    const formatOptions = [
        { value: '', label: 'Barcha formatlar' },
        { value: 'ebook', label: 'Elektron kitob' },
        { value: 'audio', label: 'Audio kitob' },
        { value: 'paper', label: "Qog'oz kitob" }
    ];

    const languageOptions = [
        { value: '', label: 'Barcha tillar' },
        { value: 'uz', label: "O'zbekcha" },
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' }
    ];

    useEffect(() => {
        if (query) {
            loadSearchResults();
        }
        if (isAuthenticated) {
            loadWishlist();
        }
    }, [query, activeTab, sortBy, pagination.page, filterFormat, filterLanguage]);

    const loadSearchResults = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                q: query,
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                sort: sortBy,
                type: activeTab,
                ...(filterFormat && { format: filterFormat }),
                ...(filterLanguage && { language: filterLanguage }),
                ...(filterPriceRange[0] > 0 && { minPrice: filterPriceRange[0].toString() }),
                ...(filterPriceRange[1] < 1000000 && { maxPrice: filterPriceRange[1].toString() })
            });

            const response = await api.get(`/search?${params.toString()}`);

            if (response.data?.success) {
                setResults(response.data.data);
                setPagination(
                    response.data.data.pagination || {
                        page: 1,
                        limit: 12,
                        total: response.data.data.totalCount,
                        pages: Math.ceil(response.data.data.totalCount / 12)
                    }
                );
            }
        } catch (error) {
            console.error('Qidiruv xatosi:', error);
            toast.error('Qidiruvda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const loadWishlist = async () => {
        try {
            const response = await UserService.getWishlist();
            if (response?.success) {
                setWishlist(response.data.map((item: any) => item._id));
            }
        } catch (error) {
            console.error('Wishlist yuklanmadi:', error);
        }
    };

    const handleToggleWishlist = async (productId: string) => {
        if (!isAuthenticated) {
            router.push(`/auth/login?redirect=/search?q=${encodeURIComponent(query)}`);
            return;
        }

        try {
            const response = await UserService.toggleWishlist(productId);
            if (response?.success) {
                if (wishlist.includes(productId)) {
                    setWishlist(wishlist.filter((id) => id !== productId));
                    toast.success("Sevimlilardan o'chirildi");
                } else {
                    setWishlist([...wishlist, productId]);
                    toast.success("Sevimlilarga qo'shildi");
                }
            }
        } catch (error) {
            toast.error('Xatolik yuz berdi');
        }
    };

    const handleAddToCart = async (productId: string) => {
        if (!isAuthenticated) {
            router.push(`/auth/login?redirect=/search?q=${encodeURIComponent(query)}`);
            return;
        }

        try {
            setAddingToCart(productId);
            await api.post('/cart/add', { productId, quantity: 1 });
            toast.success("Savatga qo'shildi");
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setAddingToCart(null);
        }
    };

    const handleShare = (product: SearchProduct) => {
        navigator.clipboard.writeText(`${window.location.origin}/book/${product.slug}`);
        toast.success('Havola nusxalandi');
    };

    const getProductTitle = (product: SearchProduct): string => {
        return product.title.uz || product.title.ru || product.title.en || "Noma'lum";
    };

    const getDiscountedPrice = (product: SearchProduct) => {
        if (product.discountPrice && product.discountPrice > 0) {
            return product.discountPrice;
        }
        return product.price;
    };

    const getDiscountPercentage = (product: SearchProduct) => {
        if (product.discountPrice && product.discountPrice > 0) {
            return Math.round(((product.price - product.discountPrice) / product.price) * 100);
        }
        return 0;
    };

    const getFormatIcon = (format?: string) => {
        switch (format) {
            case 'audio':
                return <Headphones size={14} className='text-[#FF8A00] dark:text-orange-400' />;
            case 'ebook':
                return <BookOpen size={14} className='text-[#005CB9] dark:text-blue-400' />;
            case 'paper':
                return <BookOpen size={14} className='text-green-600 dark:text-green-400' />;
            default:
                return <BookOpen size={14} className='text-gray-400 dark:text-gray-500' />;
        }
    };

    const getFormatLabel = (format?: string) => {
        switch (format) {
            case 'audio':
                return 'Audio kitob';
            case 'ebook':
                return 'Elektron kitob';
            case 'paper':
                return "Qog'oz kitob";
            default:
                return 'Kitob';
        }
    };

    const clearFilters = () => {
        setFilterFormat('');
        setFilterLanguage('');
        setFilterPriceRange([0, 1000000]);
        setSortBy('-createdAt');
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    if (!query) {
        return (
            <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 dark:from-slate-900 dark:to-slate-800'>
                {/* Animated Background Elements */}

                <div className='brand-grid' />
                <div className='relative z-10 container mx-auto px-4 text-center'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20'>
                        <Search size={48} className='text-[#005CB9] dark:text-blue-400' />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='mb-2 text-2xl font-black text-gray-900 dark:text-white'>
                        Qidiruv
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='text-gray-500 dark:text-gray-400'>
                        {" Qidirish uchun so'z kiriting "}
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white py-8 dark:from-slate-900 dark:to-slate-800'>
            {/* Animated Background Elements */}

            {/* Grid Pattern */}
            <div className='brand-grid' />
            <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                {/* Header with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-8 flex items-center gap-3'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className='rounded-2xl bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 p-3 dark:from-blue-600/20 dark:to-orange-600/20'>
                        <Search size={28} className='text-[#005CB9] dark:text-blue-400' />
                    </motion.div>
                    <div>
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className='text-2xl font-black md:text-3xl'>
                            <span className='text-[#005CB9] dark:text-blue-400'>Qidiruv</span>
                            <span className='text-[#FF8A00] dark:text-orange-400'> natijalari</span>
                        </motion.h1>
                        <motion.p
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                            <span className='font-bold text-[#005CB9] dark:text-blue-400'>{results.totalCount}</span> ta
                            natija topildi
                        </motion.p>
                    </div>
                </motion.div>

                {/* Search Query with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className='mb-6 rounded-xl border border-gray-100 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                    <div className='flex items-center gap-3'>
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className='rounded-lg bg-[#005CB9]/10 p-2 dark:bg-blue-600/20'>
                            <Search size={16} className='text-[#005CB9] dark:text-blue-400' />
                        </motion.div>
                        <div className='flex-1'>
                            <p className='mb-1 text-xs text-gray-400 dark:text-gray-500'>Siz qidirdingiz</p>
                            <p className='text-lg font-black text-gray-900 dark:text-white'>
                                {'"'}
                                {query}
                                {'"'}
                            </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href='/catalog'
                                className='rounded-xl bg-gradient-to-r from-[#005CB9] to-[#FF8A00] px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600'>
                                {" Katalogga o'tish "}
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Tabs with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className='mb-6 flex gap-2 overflow-x-auto pb-2'>
                    {[
                        { value: 'all', label: 'Barchasi', icon: Sparkles },
                        { value: 'products', label: 'Kitoblar', icon: BookOpen },
                        { value: 'categories', label: 'Kategoriyalar', icon: FolderOpen },
                        { value: 'authors', label: 'Mualliflar', icon: Users }
                    ].map((tab, index) => {
                        const Icon = tab.icon;
                        const count =
                            tab.value === 'all'
                                ? results.totalCount
                                : tab.value === 'products'
                                  ? results.totalProducts
                                  : tab.value === 'categories'
                                    ? results.totalCategories
                                    : results.totalAuthors;

                        return (
                            <motion.button
                                key={tab.value}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.7 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.value as any)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-all ${
                                    activeTab === tab.value
                                        ? 'bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white shadow-lg dark:from-blue-600 dark:to-orange-600'
                                        : 'border border-gray-200 bg-white/80 text-gray-600 backdrop-blur-sm hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-gray-400 dark:hover:bg-slate-700'
                                }`}>
                                <Icon size={14} />
                                {tab.label}
                                <span className='rounded-full bg-white/20 px-1.5 py-0.5 text-xs'>{count}</span>
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Filters and Sort with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className='mb-6 flex flex-col gap-4 md:flex-row'>
                    <div className='flex-1'>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className='flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-2 text-sm font-bold text-gray-700 backdrop-blur-sm transition-colors hover:bg-gray-50 md:w-auto dark:border-slate-700 dark:bg-slate-800/80 dark:text-gray-300 dark:hover:bg-slate-700'>
                                <SlidersHorizontal size={16} />
                                Filtrlar
                                {(filterFormat ||
                                    filterLanguage ||
                                    filterPriceRange[0] > 0 ||
                                    filterPriceRange[1] < 1000000) && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className='h-2 w-2 rounded-full bg-[#FF8A00] dark:bg-orange-400'
                                    />
                                )}
                                <ChevronDown
                                    size={16}
                                    className={`ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`}
                                />
                            </button>
                        </motion.div>
                    </div>

                    <div className='flex gap-2'>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
                            className='rounded-xl border border-gray-200 bg-white/80 px-4 py-2 text-sm text-gray-900 backdrop-blur-sm focus:ring-2 focus:ring-[#005CB9] focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:focus:ring-blue-400'>
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <div className='hidden items-center gap-1 rounded-xl border border-gray-200 bg-white/80 p-1 backdrop-blur-sm md:flex dark:border-slate-700 dark:bg-slate-800/80'>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setViewMode('grid')}
                                className={`rounded-lg p-2 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white dark:from-blue-600 dark:to-orange-600'
                                        : 'text-gray-400 hover:text-[#005CB9] dark:text-gray-500 dark:hover:text-blue-400'
                                }`}>
                                <Grid3x3 size={18} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setViewMode('list')}
                                className={`rounded-lg p-2 transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white dark:from-blue-600 dark:to-orange-600'
                                        : 'text-gray-400 hover:text-[#005CB9] dark:text-gray-500 dark:hover:text-blue-400'
                                }`}>
                                <List size={18} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className='mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white/80 p-6 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                            <div className='mb-4 flex items-center justify-between'>
                                <h3 className='font-black text-gray-900 dark:text-white'>{"Qo'shimcha filtrlar"}</h3>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearFilters}
                                    className='text-sm text-[#005CB9] hover:underline dark:text-blue-400'>
                                    Tozalash
                                </motion.button>
                            </div>

                            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                                {/* Format Filter */}
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}>
                                    <label className='mb-2 block text-xs font-bold text-gray-400 uppercase dark:text-gray-500'>
                                        Format
                                    </label>
                                    <select
                                        value={filterFormat}
                                        onChange={(e) => setFilterFormat(e.target.value)}
                                        className='w-full rounded-lg border border-gray-200 bg-white p-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#005CB9] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-400'>
                                        {formatOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>

                                {/* Language Filter */}
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}>
                                    <label className='mb-2 block text-xs font-bold text-gray-400 uppercase dark:text-gray-500'>
                                        Til
                                    </label>
                                    <select
                                        value={filterLanguage}
                                        onChange={(e) => setFilterLanguage(e.target.value)}
                                        className='w-full rounded-lg border border-gray-200 bg-white p-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#005CB9] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-400'>
                                        {languageOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>

                                {/* Price Range */}
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}>
                                    <label className='mb-2 block text-xs font-bold text-gray-400 uppercase dark:text-gray-500'>
                                        {" Narx oralig'i "}
                                    </label>
                                    <div className='flex items-center gap-2'>
                                        <Input
                                            type='number'
                                            placeholder='Min'
                                            value={filterPriceRange[0]}
                                            onChange={(e) =>
                                                setFilterPriceRange([Number(e.target.value), filterPriceRange[1]])
                                            }
                                            className='w-full border-gray-200 bg-white dark:border-slate-600 dark:bg-slate-700'
                                        />
                                        <span className='text-gray-500 dark:text-gray-400'>-</span>
                                        <Input
                                            type='number'
                                            placeholder='Max'
                                            value={filterPriceRange[1]}
                                            onChange={(e) =>
                                                setFilterPriceRange([filterPriceRange[0], Number(e.target.value)])
                                            }
                                            className='w-full border-gray-200 bg-white dark:border-slate-600 dark:bg-slate-700'
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results */}
                {loading ? (
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className='h-[350px] animate-pulse rounded-xl bg-gray-100 dark:bg-slate-700'
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Products */}
                        {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className='mb-8'>
                                {activeTab === 'all' && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1.0 }}
                                        className='mb-4 flex items-center gap-2'>
                                        <h2 className='text-lg font-black text-gray-900 dark:text-white'>Kitoblar</h2>
                                        <span className='rounded-full bg-[#005CB9]/10 px-2 py-1 text-xs text-[#005CB9] dark:bg-blue-600/20 dark:text-blue-400'>
                                            {results.totalProducts}
                                        </span>
                                    </motion.div>
                                )}

                                {viewMode === 'grid' ? (
                                    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                                        {results.products.map((product, index) => (
                                            <motion.div
                                                key={product._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 + 1.1 }}
                                                whileHover={{ y: -5 }}
                                                className='group relative overflow-hidden rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/80 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                                {/* Badges */}
                                                <div className='absolute top-2 left-2 z-10 flex flex-col gap-1'>
                                                    {product.discountPrice && product.discountPrice > 0 && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: index * 0.1 + 1.2, type: 'spring' }}
                                                            className='flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-[10px] text-white shadow-lg dark:bg-red-600'>
                                                            <Tag size={10} />-{getDiscountPercentage(product)}%
                                                        </motion.span>
                                                    )}
                                                    {product.format && (
                                                        <span className='flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-2 py-1 text-[10px] text-gray-700 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90 dark:text-gray-300'>
                                                            {getFormatIcon(product.format)}
                                                            <span>{getFormatLabel(product.format)}</span>
                                                        </span>
                                                    )}
                                                    {product.views && product.views > 1000 && (
                                                        <span className='flex items-center gap-1 rounded-full bg-purple-500 px-2 py-1 text-[10px] text-white'>
                                                            <Eye size={10} />
                                                            Trending
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Wishlist Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleToggleWishlist(product._id)}
                                                    className={`absolute top-2 right-2 z-10 rounded-full p-1.5 transition-all ${
                                                        wishlist.includes(product._id)
                                                            ? 'bg-red-500 text-white dark:bg-red-600'
                                                            : 'bg-white/90 text-gray-400 backdrop-blur-sm hover:text-red-500 dark:bg-slate-800/90 dark:text-gray-500 dark:hover:text-red-400'
                                                    }`}>
                                                    <Heart
                                                        size={14}
                                                        fill={wishlist.includes(product._id) ? 'currentColor' : 'none'}
                                                    />
                                                </motion.button>

                                                {/* Share Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleShare(product)}
                                                    className='absolute top-10 right-2 z-10 rounded-full bg-white/90 p-1.5 text-gray-400 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:text-[#005CB9] dark:bg-slate-800/90 dark:hover:text-blue-400'>
                                                    <Share2 size={12} />
                                                </motion.button>

                                                {/* Image */}
                                                <Link href={`/book/${product.slug}`}>
                                                    <div className='relative h-[200px] w-full overflow-hidden bg-gray-100 dark:bg-slate-700'>
                                                        <Image
                                                            src={getImageUrl(product.images?.[0])}
                                                            alt={getProductTitle(product)}
                                                            fill
                                                            className='object-cover transition-transform duration-500 group-hover:scale-110'
                                                        />
                                                    </div>
                                                </Link>

                                                {/* Content */}
                                                <div className='p-3'>
                                                    <Link href={`/book/${product.slug}`}>
                                                        <h3 className='mb-1 line-clamp-2 text-sm font-bold text-gray-900 transition-colors hover:text-[#005CB9] dark:text-white dark:hover:text-blue-400'>
                                                            {getProductTitle(product)}
                                                        </h3>
                                                    </Link>

                                                    <p className='mb-2 line-clamp-1 text-xs text-gray-500 dark:text-gray-400'>
                                                        {product.author?.name}
                                                    </p>

                                                    {/* Rating */}
                                                    {product.ratingAvg ? (
                                                        <div className='mb-2 flex items-center gap-1'>
                                                            <Star
                                                                size={12}
                                                                className='fill-[#FF8A00] text-[#FF8A00] dark:fill-orange-400 dark:text-orange-400'
                                                            />
                                                            <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                                                {product.ratingAvg.toFixed(1)}
                                                            </span>
                                                            {product.ratingCount && (
                                                                <span className='text-[10px] text-gray-400 dark:text-gray-500'>
                                                                    ({product.ratingCount})
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className='mb-2 h-4' />
                                                    )}

                                                    {/* Additional Info */}
                                                    <div className='mb-2 flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500'>
                                                        {product.publishYear && <span>{product.publishYear}</span>}
                                                        {product.pages && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{product.pages} bet</span>
                                                            </>
                                                        )}
                                                        {product.duration && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{product.duration}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Price */}
                                                    <div className='flex items-center justify-between'>
                                                        <div>
                                                            {product.discountPrice && product.discountPrice > 0 ? (
                                                                <>
                                                                    <span className='block text-xs text-gray-400 line-through dark:text-gray-500'>
                                                                        {product.price.toLocaleString()}
                                                                        {" so'm "}
                                                                    </span>
                                                                    <span className='text-sm font-black text-[#FF8A00] dark:text-orange-400'>
                                                                        {product.discountPrice.toLocaleString()}
                                                                        {" so'm "}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className='text-sm font-black text-[#005CB9] dark:text-blue-400'>
                                                                    {product.price.toLocaleString()}
                                                                    {" so'm "}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleAddToCart(product._id)}
                                                            disabled={addingToCart === product._id}
                                                            className='rounded-lg bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-[#005CB9] hover:text-white disabled:opacity-50 dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-blue-600'>
                                                            {addingToCart === product._id ? (
                                                                <Loader2 size={14} className='animate-spin' />
                                                            ) : (
                                                                <ShoppingCart size={14} />
                                                            )}
                                                        </motion.button>
                                                    </div>

                                                    {/* Sales Count */}
                                                    {product.sales && product.sales > 0 && (
                                                        <div className='mt-2 flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500'>
                                                            <ShoppingCart size={8} />
                                                            <span>{product.sales} ta sotilgan</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        {results.products.map((product, index) => (
                                            <motion.div
                                                key={product._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 + 1.1 }}
                                                whileHover={{ scale: 1.01, x: 5 }}
                                                className='rounded-xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/80'>
                                                <div className='flex gap-4'>
                                                    <Link href={`/book/${product.slug}`} className='flex-shrink-0'>
                                                        <motion.div
                                                            whileHover={{ scale: 1.05 }}
                                                            className='relative h-24 w-20 overflow-hidden rounded-lg'>
                                                            <Image
                                                                src={getImageUrl(product.images?.[0])}
                                                                alt={getProductTitle(product)}
                                                                fill
                                                                className='object-cover'
                                                            />
                                                        </motion.div>
                                                    </Link>

                                                    <div className='flex-1'>
                                                        <div className='flex items-start justify-between'>
                                                            <div>
                                                                <Link href={`/book/${product.slug}`}>
                                                                    <h3 className='text-lg font-bold text-gray-900 transition-colors hover:text-[#005CB9] dark:text-white dark:hover:text-blue-400'>
                                                                        {getProductTitle(product)}
                                                                    </h3>
                                                                </Link>
                                                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                                    {product.author?.name}
                                                                </p>
                                                            </div>

                                                            <div className='flex items-center gap-2'>
                                                                {product.discountPrice && product.discountPrice > 0 && (
                                                                    <motion.span
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className='rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white'>
                                                                        -{getDiscountPercentage(product)}%
                                                                    </motion.span>
                                                                )}
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => handleToggleWishlist(product._id)}
                                                                    className={`rounded-lg p-2 transition-colors ${
                                                                        wishlist.includes(product._id)
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'bg-gray-100 text-gray-600 hover:text-red-500 dark:bg-slate-700 dark:text-gray-400'
                                                                    }`}>
                                                                    <Heart
                                                                        size={16}
                                                                        fill={
                                                                            wishlist.includes(product._id)
                                                                                ? 'currentColor'
                                                                                : 'none'
                                                                        }
                                                                    />
                                                                </motion.button>
                                                            </div>
                                                        </div>

                                                        <div className='mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                                                            {product.format && (
                                                                <div className='flex items-center gap-1'>
                                                                    {getFormatIcon(product.format)}
                                                                    <span>{getFormatLabel(product.format)}</span>
                                                                </div>
                                                            )}
                                                            {product.language && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>
                                                                        {product.language === 'uz'
                                                                            ? "O'zbekcha"
                                                                            : product.language === 'ru'
                                                                              ? 'Русский'
                                                                              : 'English'}
                                                                    </span>
                                                                </>
                                                            )}
                                                            {product.pages && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{product.pages} bet</span>
                                                                </>
                                                            )}
                                                        </div>

                                                        {product.ratingAvg && (
                                                            <div className='mt-2 flex items-center gap-2'>
                                                                <div className='flex items-center gap-1'>
                                                                    <Star
                                                                        size={14}
                                                                        className='fill-[#FF8A00] text-[#FF8A00]'
                                                                    />
                                                                    <span className='font-bold text-gray-900 dark:text-white'>
                                                                        {product.ratingAvg.toFixed(1)}
                                                                    </span>
                                                                </div>
                                                                <span className='text-xs text-gray-400'>
                                                                    ({product.ratingCount} ta baho)
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className='mt-4 flex items-center justify-between'>
                                                            <div>
                                                                {product.discountPrice && product.discountPrice > 0 ? (
                                                                    <>
                                                                        <span className='mr-2 text-sm text-gray-400 line-through'>
                                                                            {product.price.toLocaleString()}
                                                                            {" so'm "}
                                                                        </span>
                                                                        <span className='text-xl font-black text-[#FF8A00] dark:text-orange-400'>
                                                                            {product.discountPrice.toLocaleString()}
                                                                            {" so'm "}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className='text-xl font-black text-[#005CB9] dark:text-blue-400'>
                                                                        {product.price.toLocaleString()}
                                                                        {" so'm "}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}>
                                                                <button
                                                                    onClick={() => handleAddToCart(product._id)}
                                                                    disabled={addingToCart === product._id}
                                                                    className='flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#005CB9] to-[#FF8A00] px-4 py-2 font-bold text-white transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600'>
                                                                    {addingToCart === product._id ? (
                                                                        <Loader2 size={16} className='animate-spin' />
                                                                    ) : (
                                                                        <>
                                                                            <ShoppingCart size={16} />
                                                                            Savatga
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Categories */}
                        {(activeTab === 'all' || activeTab === 'categories') && results.categories.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className='mb-8'>
                                {activeTab === 'all' && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1.3 }}
                                        className='mb-4 flex items-center gap-2'>
                                        <h2 className='text-lg font-black text-gray-900 dark:text-white'>
                                            Kategoriyalar
                                        </h2>
                                        <span className='rounded-full bg-[#005CB9]/10 px-2 py-1 text-xs text-[#005CB9] dark:bg-blue-600/20 dark:text-blue-400'>
                                            {results.totalCategories}
                                        </span>
                                    </motion.div>
                                )}
                                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                                    {results.categories.map((category, index) => (
                                        <motion.div
                                            key={category._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 1.4 }}
                                            whileHover={{ y: -5 }}>
                                            <Link
                                                href={getCatalogCategoryHref(category)}
                                                className='group block rounded-xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/80 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20'>
                                                        {category.image ? (
                                                            <Image
                                                                src={getImageUrl(category.image)}
                                                                alt={category.title.uz}
                                                                width={40}
                                                                height={40}
                                                                className='rounded-lg object-cover'
                                                            />
                                                        ) : (
                                                            <FolderOpen
                                                                size={20}
                                                                className='text-[#005CB9] dark:text-blue-400'
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className='font-bold text-gray-900 transition-colors group-hover:text-[#005CB9] dark:text-white dark:group-hover:text-blue-400'>
                                                            {category.title.uz}
                                                        </p>
                                                        {category.count && (
                                                            <p className='text-xs text-gray-400 dark:text-gray-500'>
                                                                {category.count} ta kitob
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {category.description && (
                                                    <p className='mt-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400'>
                                                        {category.description}
                                                    </p>
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Authors */}
                        {(activeTab === 'all' || activeTab === 'authors') && results.authors.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.6 }}
                                className='mb-8'>
                                {activeTab === 'all' && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1.7 }}
                                        className='mb-4 flex items-center gap-2'>
                                        <h2 className='text-lg font-black text-gray-900 dark:text-white'>Mualliflar</h2>
                                        <span className='rounded-full bg-[#005CB9]/10 px-2 py-1 text-xs text-[#005CB9] dark:bg-blue-600/20 dark:text-blue-400'>
                                            {results.totalAuthors}
                                        </span>
                                    </motion.div>
                                )}
                                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                                    {results.authors.map((author, index) => (
                                        <motion.div
                                            key={author._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 1.8 }}
                                            whileHover={{ y: -5 }}>
                                            <Link
                                                href={`/author/${author.slug}`}
                                                className='group block rounded-xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/80 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20'>
                                                        {author.image ? (
                                                            <Image
                                                                src={getImageUrl(author.image)}
                                                                alt={author.name}
                                                                width={48}
                                                                height={48}
                                                                className='h-full w-full object-cover'
                                                            />
                                                        ) : (
                                                            <User
                                                                size={20}
                                                                className='text-[#005CB9] dark:text-blue-400'
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className='font-bold text-gray-900 transition-colors group-hover:text-[#005CB9] dark:text-white dark:group-hover:text-blue-400'>
                                                            {author.name}
                                                        </p>
                                                        {author.bookCount && (
                                                            <p className='text-xs text-gray-400 dark:text-gray-500'>
                                                                {author.bookCount} ta kitob
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {author.bio && (
                                                    <p className='mt-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400'>
                                                        {author.bio}
                                                    </p>
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Trending Section */}
                        {results.trending && results.trending.length > 0 && activeTab === 'all' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.0 }}
                                className='mb-8'>
                                <div className='mb-4 flex items-center gap-2'>
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                        className='rounded-lg bg-gradient-to-r from-[#FF8A00]/10 to-[#005CB9]/10 p-2 dark:from-orange-600/20 dark:to-blue-600/20'>
                                        <TrendingUp size={18} className='text-[#FF8A00] dark:text-orange-400' />
                                    </motion.div>
                                    <h2 className='text-lg font-black text-gray-900 dark:text-white'>
                                        Trenddagi kitoblar
                                    </h2>
                                </div>
                                <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                                    {results.trending.map((product, index) => (
                                        <motion.div
                                            key={product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 + 2.1 }}
                                            whileHover={{ y: -5 }}
                                            className='relative'>
                                            {/* Trending Badge */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: index * 0.1 + 2.2, type: 'spring' }}
                                                className='absolute -top-2 -left-2 z-10'>
                                                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#FF8A00] to-[#005CB9] text-xs font-bold text-white shadow-lg'>
                                                    <Sparkles size={14} />
                                                </div>
                                            </motion.div>
                                            {/* Product Card (simplified) */}
                                            <Link href={`/book/${product.slug}`}>
                                                <div className='overflow-hidden rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/80'>
                                                    <div className='relative h-[150px] w-full'>
                                                        <Image
                                                            src={getImageUrl(product.images?.[0])}
                                                            alt={getProductTitle(product)}
                                                            fill
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                    <div className='p-3'>
                                                        <h4 className='line-clamp-1 text-sm font-bold text-gray-900 dark:text-white'>
                                                            {getProductTitle(product)}
                                                        </h4>
                                                        <p className='line-clamp-1 text-xs text-gray-500 dark:text-gray-400'>
                                                            {product.author?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* No results */}
                        {results.totalCount === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.0, type: 'spring' }}
                                className='rounded-2xl border border-gray-100 bg-white/80 p-12 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 1.1, type: 'spring' }}
                                    className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20'>
                                    <Search size={48} className='text-gray-400 dark:text-gray-500' />
                                </motion.div>
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    className='mb-3 text-2xl font-black text-gray-900 dark:text-white'>
                                    Natija topilmadi
                                </motion.h2>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.3 }}
                                    className='mx-auto mb-4 max-w-md text-gray-500 dark:text-gray-400'>
                                    {' "'}
                                    {query}
                                    {'" bo\'yicha hech qanday natija topilmadi. '}
                                </motion.p>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.4 }}
                                    className='mb-8 space-y-2 text-sm text-gray-400 dark:text-gray-500'>
                                    <p>{"Boshqa so'z bilan urinib ko'ring"}</p>
                                    <p>Yoki quyidagi variantlardan birini tanlang:</p>
                                </motion.div>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.5 }}
                                    className='flex flex-col justify-center gap-4 sm:flex-row'>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            href='/catalog'
                                            className='inline-flex items-center rounded-xl bg-gradient-to-r from-[#005CB9] to-[#FF8A00] px-6 py-3 font-bold text-white transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600'>
                                            <BookOpen size={18} className='mr-2' />
                                            {" Katalogga o'tish "}
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            href='/contact'
                                            className='inline-flex items-center rounded-xl border border-gray-200 px-6 py-3 font-bold text-gray-700 transition-all hover:border-[#005CB9] dark:border-slate-700 dark:text-gray-300 dark:hover:border-blue-400'>
                                            <MessageCircle size={18} className='mr-2' />
                                            {" Yordam so'rash "}
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}

                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                            previousLabel={PaginationPreviousIcon}
                            nextLabel={PaginationNextIcon}
                            variant='square'
                            className='mt-8'
                        />
                    </>
                )}

                {/* Info Icons with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4 }}
                    className='mt-8 grid grid-cols-3 gap-2 text-center text-xs'>
                    {[
                        { icon: Truck, text: 'Bepul yetkazish' },
                        { icon: Shield, text: "Xavfsiz to'lov" },
                        { icon: Headphones, text: "24/7 qo'llab-quvvatlash" }
                    ].map((item, index) => (
                        <motion.div key={index} whileHover={{ y: -5 }} className='p-2'>
                            <item.icon size={16} className='mx-auto mb-1 text-gray-400 dark:text-gray-500' />
                            <span className='text-gray-400 dark:text-gray-500'>{item.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
