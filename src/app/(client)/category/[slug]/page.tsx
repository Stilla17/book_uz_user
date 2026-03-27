'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { bookService } from '@/services/book.service';
import { categoryService } from '@/services/category.service';
import type { Category } from '@/types/category.types';

import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Filter,
    Grid3x3,
    Headphones,
    Heart,
    List,
    Search,
    ShoppingCart,
    Sparkles,
    Star,
    Tag,
    TrendingUp,
    X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Product {
    _id: string;
    title: {
        uz: string;
        ru?: string;
        en?: string;
    };
    slug: string;
    price: number;
    discountPrice?: number;
    images: string[];
    author: {
        _id: string;
        name: string;
    };
    ratingAvg: number;
    ratingCount: number;
    isTop: boolean;
    isDiscount: boolean;
    format?: 'ebook' | 'audio' | 'paper';
    language?: 'uz' | 'ru' | 'en';
    stock?: number;
}

interface FilterState {
    minPrice: string;
    maxPrice: string;
    author: string;
    language: string;
    format: string;
    isTop: boolean;
    isDiscount: boolean;
    inStock: boolean;
}

export default function CategoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { user, isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 1
    });

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('-createdAt');
    const [showFilters, setShowFilters] = useState(false);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const [filters, setFilters] = useState<FilterState>({
        minPrice: '',
        maxPrice: '',
        author: '',
        language: '',
        format: '',
        isTop: false,
        isDiscount: false,
        inStock: false
    });

    // Sort options
    const sortOptions = [
        { value: '-createdAt', label: 'Eng yangilar', icon: Clock },
        { value: 'price', label: 'Narxi: arzon → qimmat', icon: TrendingUp },
        { value: '-price', label: 'Narxi: qimmat → arzon', icon: TrendingUp },
        { value: '-ratingAvg', label: "Reyting bo'yicha", icon: Star },
        { value: '-ratingCount', label: "Eng ko'p o'qilgan", icon: Eye },
        { value: '-sales', label: "Eng ko'p sotilgan", icon: ShoppingCart }
    ];

    // Format options
    const formats = [
        { value: 'ebook', label: 'Elektron kitob', icon: BookOpen },
        { value: 'audio', label: 'Audio kitob', icon: Headphones },
        { value: 'paper', label: "Qog'oz kitob", icon: BookOpen }
    ];

    // Language options
    const languages = [
        { value: 'uz', label: "O'zbekcha" },
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' }
    ];

    // Mouse move effect
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

    // Load data
    useEffect(() => {
        loadCategoryAndProducts();
    }, [slug]);

    useEffect(() => {
        if (category) {
            loadProducts();
        }
    }, [category, filters, sortBy, pagination.page]);

    useEffect(() => {
        if (isAuthenticated) {
            loadWishlist();
        }
    }, [isAuthenticated]);

    const loadCategoryAndProducts = async () => {
        try {
            setLoading(true);
            const categoryData = await categoryService.getCategoryBySlug(slug);

            if (categoryData) {
                setCategory(categoryData);
            } else {
                router.push('/404');
            }
        } catch (error) {
            console.error('Xatolik:', error);
            router.push('/404');
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            if (!category) return;

            const params: any = {
                page: pagination.page,
                limit: pagination.limit,
                sort: sortBy,
                category: category._id,
                ...(filters.minPrice && { minPrice: filters.minPrice }),
                ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
                ...(filters.author && { author: filters.author }),
                ...(filters.language && { language: filters.language }),
                ...(filters.format && { format: filters.format }),
                ...(filters.isTop && { isTop: true }),
                ...(filters.isDiscount && { isDiscount: true })
            };

            const data = await bookService.getProducts(params);
            setProducts(data.products || []);
            setPagination(
                data.pagination || {
                    page: 1,
                    limit: 12,
                    total: 0,
                    pages: 1
                }
            );
        } catch (error) {
            console.error('Mahsulotlar yuklanmadi:', error);
            toast.error('Mahsulotlar yuklanmadi');
        }
    };

    const loadWishlist = async () => {
        // Wishlist yuklash
    };

    const handleToggleWishlist = (productId: string) => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=' + window.location.pathname);
            return;
        }
        // Wishlist toggle
    };

    const handleAddToCart = (productId: string) => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=' + window.location.pathname);
            return;
        }
        toast.success("Savatga qo'shildi");
    };

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const resetFilters = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            author: '',
            language: '',
            format: '',
            isTop: false,
            isDiscount: false,
            inStock: false
        });
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.minPrice || filters.maxPrice) count++;
        if (filters.author) count++;
        if (filters.language) count++;
        if (filters.format) count++;
        if (filters.isTop) count++;
        if (filters.isDiscount) count++;
        if (filters.inStock) count++;
        return count;
    };

    const getDiscountedPrice = (product: Product) => {
        return product.discountPrice || product.price;
    };

    const getDiscountPercentage = (product: Product) => {
        if (product.discountPrice) {
            return Math.round(((product.price - product.discountPrice) / product.price) * 100);
        }
        return 0;
    };

    const getCategoryIcon = (category: Category) => {
        if (category.icon) {
            // Rasm URL'ini qaytarish
            return category.icon;
        }
        return null;
    };

    const getCategoryColor = (slug: string): string => {
        const colorMap: Record<string, string> = {
            detektiv: 'from-red-500 to-orange-500',
            fantastika: 'from-purple-500 to-blue-500',
            fentezi: 'from-indigo-500 to-purple-500',
            roman: 'from-pink-500 to-rose-500',
            psixologiya: 'from-green-500 to-emerald-500',
            tarix: 'from-amber-500 to-yellow-500',
            biznes: 'from-blue-500 to-cyan-500',
            bolalar: 'from-orange-500 to-yellow-500',
            ilmiy: 'from-teal-500 to-green-500',
            sport: 'from-blue-500 to-cyan-500',
            sheriyat: 'from-fuchsia-500 to-pink-500',
            audio: 'from-violet-500 to-purple-500',
            darsliklar: 'from-slate-500 to-gray-500'
        };
        return colorMap[slug] || 'from-[#005CB9] to-[#FF8A00]';
    };

    const gradientColors = category ? getCategoryColor(category.slug) : '';

    if (loading) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800'>
                <div className='text-center'>
                    <div className='mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#005CB9]/20 border-t-[#005CB9]' />
                    <p className='text-gray-500 dark:text-gray-400'>Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (!category) return null;

    const categoryIcon = getCategoryIcon(category);

    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white py-8 dark:from-slate-900 dark:to-slate-800'>
            {/* Animated Background */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                <motion.div
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#005CB9]/5 blur-3xl'
                />
                <motion.div
                    animate={{
                        x: mousePosition.x * -2,
                        y: mousePosition.y * -2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#FF8A00]/5 blur-3xl'
                />
            </div>
            <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                    <Link href='/' className='hover:text-[#005CB9] dark:hover:text-blue-400'>
                        Bosh sahifa
                    </Link>
                    <ChevronRight size={14} />
                    <Link href='/category' className='hover:text-[#005CB9] dark:hover:text-blue-400'>
                        Kategoriyalar
                    </Link>
                    <ChevronRight size={14} />
                    <span className='font-bold text-[#005CB9] dark:text-blue-400'>{category.name.uz}</span>
                </motion.div>

                {/* Category Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-8 rounded-2xl border border-gray-100 bg-white/80 p-8 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                    <div className='flex items-start gap-6'>
                        {/* Category Icon - Rasm yoki emoji */}
                        {categoryIcon ? (
                            <div className='relative h-24 w-24 flex-shrink-0'>
                                <Image
                                    src={categoryIcon}
                                    alt={category.name.uz}
                                    width={96}
                                    height={96}
                                    className='rounded-2xl object-cover'
                                    onError={(e) => {
                                        // Rasm yuklanmasa, gradient fon ko'rsatish
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                className={`h-24 w-24 rounded-2xl bg-gradient-to-br ${gradientColors} flex flex-shrink-0 items-center justify-center text-5xl text-white shadow-xl`}>
                                📚
                            </div>
                        )}

                        <div className='flex-1'>
                            <div className='mb-2 flex items-center gap-3'>
                                <h1 className='text-4xl font-black text-gray-900 md:text-5xl dark:text-white'>
                                    {category.name.uz}
                                </h1>
                                <span className='text-sm text-gray-400 dark:text-gray-500'>/ {category.name.ru}</span>
                            </div>

                            {category.description?.uz && (
                                <p className='mb-4 max-w-2xl text-gray-500 dark:text-gray-400'>
                                    {category.description.uz}
                                </p>
                            )}

                            <div className='flex items-center gap-6'>
                                <div className='flex items-center gap-2'>
                                    <BookOpen size={18} className='text-[#005CB9] dark:text-blue-400' />
                                    <span className='text-gray-600 dark:text-gray-400'>
                                        <span className='font-bold text-[#005CB9] dark:text-blue-400'>
                                            {category.bookCount?.toLocaleString() || 0}
                                        </span>{' '}
                                        ta kitob
                                    </span>
                                </div>

                                {category.subCategories && category.subCategories.length > 0 && (
                                    <div className='flex items-center gap-2'>
                                        <span className='h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600' />
                                        <span className='text-gray-500 dark:text-gray-400'>
                                            {category.subCategories.length} ta subkategoriya
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Subcategories */}
                    {category.subCategories && category.subCategories.length > 0 && (
                        <div className='mt-6 border-t border-gray-100 pt-6 dark:border-slate-700'>
                            <div className='flex flex-wrap gap-2'>
                                {category.subCategories.map((sub) => (
                                    <Link
                                        key={sub._id ?? sub.slug}
                                        href={`/category/${category.slug}/${sub.slug}`}
                                        className='rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-[#005CB9] hover:text-white dark:bg-slate-700 dark:text-gray-400'>
                                        {sub.name.uz}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Format filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='mb-6 flex flex-wrap gap-2'>
                    <button
                        onClick={() => handleFilterChange('format', '')}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                            filters.format === ''
                                ? `bg-gradient-to-r ${gradientColors} text-white`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-slate-600'
                        }`}>
                        Barchasi
                    </button>
                    {formats.map((format) => (
                        <button
                            key={format.value}
                            onClick={() => handleFilterChange('format', format.value)}
                            className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                                filters.format === format.value
                                    ? `bg-gradient-to-r ${gradientColors} text-white`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-slate-600'
                            }`}>
                            <format.icon size={14} />
                            {format.label}
                        </button>
                    ))}
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='mb-6 rounded-xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                    <div className='flex flex-col gap-4 md:flex-row'>
                        {/* Search */}
                        <div className='relative flex-1'>
                            <Search className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400' size={18} />
                            <input
                                type='text'
                                placeholder={`${category.name.uz} kitoblaridan qidirish...`}
                                className='w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#005CB9] focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-blue-400'
                            />
                        </div>

                        {/* Controls */}
                        <div className='flex gap-2'>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className='rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#005CB9] focus:outline-none dark:border-slate-600 dark:bg-slate-700'>
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <div className='flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-slate-700'>
                                {['grid', 'list'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode as any)}
                                        className={`rounded-lg p-2 transition-all ${
                                            viewMode === mode
                                                ? `bg-gradient-to-r ${gradientColors} text-white`
                                                : 'text-gray-400 hover:text-[#005CB9]'
                                        }`}>
                                        {mode === 'grid' ? <Grid3x3 size={18} /> : <List size={18} />}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
                                    showFilters
                                        ? `bg-gradient-to-r ${gradientColors} border-transparent text-white`
                                        : 'border-gray-200 text-gray-700 hover:border-[#005CB9] dark:border-slate-600 dark:text-gray-300'
                                }`}>
                                <Filter size={16} />
                                <span className='hidden sm:inline'>Filter</span>
                                {getActiveFilterCount() > 0 && (
                                    <span className='flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-[#005CB9]'>
                                        {getActiveFilterCount()}
                                    </span>
                                )}
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
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                                    {/* Price Range */}
                                    <div>
                                        <label className='mb-2 block text-xs font-bold text-gray-500 uppercase dark:text-gray-400'>
                                            {" Narx oralig'i "}
                                        </label>
                                        <div className='flex items-center gap-2'>
                                            <input
                                                type='number'
                                                placeholder='Min'
                                                value={filters.minPrice}
                                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                                className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700'
                                            />
                                            <span>-</span>
                                            <input
                                                type='number'
                                                placeholder='Max'
                                                value={filters.maxPrice}
                                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                                className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700'
                                            />
                                        </div>
                                    </div>

                                    {/* Language */}
                                    <div>
                                        <label className='mb-2 block text-xs font-bold text-gray-500 uppercase dark:text-gray-400'>
                                            Til
                                        </label>
                                        <select
                                            value={filters.language}
                                            onChange={(e) => handleFilterChange('language', e.target.value)}
                                            className='w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700'>
                                            <option value=''>Barchasi</option>
                                            {languages.map((lang) => (
                                                <option key={lang.value} value={lang.value}>
                                                    {lang.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Checkboxes */}
                                    <div className='space-y-2'>
                                        <label className='flex cursor-pointer items-center gap-2'>
                                            <input
                                                type='checkbox'
                                                checked={filters.isTop}
                                                onChange={(e) => handleFilterChange('isTop', e.target.checked)}
                                                className='h-4 w-4 rounded border-gray-300 text-[#005CB9] focus:ring-[#005CB9]'
                                            />
                                            <span className='text-sm'>Top kitoblar</span>
                                        </label>
                                        <label className='flex cursor-pointer items-center gap-2'>
                                            <input
                                                type='checkbox'
                                                checked={filters.isDiscount}
                                                onChange={(e) => handleFilterChange('isDiscount', e.target.checked)}
                                                className='h-4 w-4 rounded border-gray-300 text-[#005CB9] focus:ring-[#005CB9]'
                                            />
                                            <span className='text-sm'>Chegirmalar</span>
                                        </label>
                                    </div>

                                    <div className='space-y-2'>
                                        <label className='flex cursor-pointer items-center gap-2'>
                                            <input
                                                type='checkbox'
                                                checked={filters.inStock}
                                                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                                                className='h-4 w-4 rounded border-gray-300 text-[#005CB9] focus:ring-[#005CB9]'
                                            />
                                            <span className='text-sm'>Mavjud</span>
                                        </label>

                                        <button
                                            onClick={resetFilters}
                                            className='text-sm text-[#005CB9] hover:underline dark:text-blue-400'>
                                            Filtrlarni tozalash
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Products Grid/List */}
                {products.length > 0 ? (
                    <>
                        {viewMode === 'grid' ? (
                            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 + 0.3 }}
                                        whileHover={{ y: -5 }}
                                        className='group'>
                                        <div className='relative overflow-hidden rounded-xl border border-gray-100 bg-white/90 backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/90'>
                                            {/* Badges */}
                                            <div className='absolute top-2 left-2 z-10 flex flex-col gap-1'>
                                                {product.isTop && (
                                                    <span
                                                        className={`bg-gradient-to-r ${gradientColors} flex items-center gap-1 rounded-full px-2 py-1 text-xs text-white`}>
                                                        <Sparkles size={10} />
                                                        Top
                                                    </span>
                                                )}
                                                {product.isDiscount && (
                                                    <span className='flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs text-white'>
                                                        <Tag size={10} />-{getDiscountPercentage(product)}%
                                                    </span>
                                                )}
                                            </div>

                                            {/* Wishlist Button */}
                                            <button
                                                onClick={() => handleToggleWishlist(product._id)}
                                                className='absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1.5 text-gray-400 transition-colors hover:text-red-500 dark:bg-slate-800/90'>
                                                <Heart size={14} />
                                            </button>

                                            {/* Image */}
                                            <Link href={`/book/${product.slug}`}>
                                                <div className='relative h-[200px] w-full overflow-hidden'>
                                                    <Image
                                                        src={product.images?.[0] || '/images/placeholder.jpg'}
                                                        alt={product.title.uz}
                                                        fill
                                                        className='object-cover transition-transform duration-500 group-hover:scale-110'
                                                    />
                                                </div>
                                            </Link>

                                            {/* Content */}
                                            <div className='p-3'>
                                                <Link href={`/book/${product.slug}`}>
                                                    <h3 className='mb-1 line-clamp-2 text-sm font-bold hover:text-[#005CB9] dark:hover:text-blue-400'>
                                                        {product.title.uz}
                                                    </h3>
                                                </Link>

                                                <p className='mb-2 line-clamp-1 text-xs text-gray-500 dark:text-gray-400'>
                                                    {product.author?.name}
                                                </p>

                                                {/* Rating */}
                                                <div className='mb-2 flex items-center gap-1'>
                                                    <Star size={12} className='fill-yellow-500 text-yellow-500' />
                                                    <span className='text-xs font-bold'>
                                                        {product.ratingAvg?.toFixed(1) || '0.0'}
                                                    </span>
                                                    <span className='text-xs text-gray-400'>
                                                        ({product.ratingCount || 0})
                                                    </span>
                                                </div>

                                                {/* Price */}
                                                <div className='flex items-center justify-between'>
                                                    <div>
                                                        {product.discountPrice ? (
                                                            <>
                                                                <span className='block text-xs text-gray-400 line-through'>
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

                                                    <button
                                                        onClick={() => handleAddToCart(product._id)}
                                                        className='rounded-lg bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-[#005CB9] hover:text-white dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-blue-600'>
                                                        <ShoppingCart size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            // List View
                            <div className='space-y-4'>
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 + 0.3 }}
                                        className='rounded-xl border border-gray-100 bg-white/90 p-4 backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/90'>
                                        <div className='flex gap-4'>
                                            <Link href={`/book/${product.slug}`}>
                                                <div className='relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg'>
                                                    <Image
                                                        src={product.images?.[0] || '/images/placeholder.jpg'}
                                                        alt={product.title.uz}
                                                        fill
                                                        className='object-cover'
                                                    />
                                                </div>
                                            </Link>

                                            <div className='flex-1'>
                                                <div className='flex items-start justify-between'>
                                                    <div>
                                                        <Link href={`/book/${product.slug}`}>
                                                            <h3 className='font-bold hover:text-[#005CB9] dark:hover:text-blue-400'>
                                                                {product.title.uz}
                                                            </h3>
                                                        </Link>
                                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                            {product.author?.name}
                                                        </p>
                                                    </div>

                                                    <div className='flex gap-1'>
                                                        {product.isTop && (
                                                            <span
                                                                className={`bg-gradient-to-r ${gradientColors} rounded-full px-2 py-1 text-xs text-white`}>
                                                                Top
                                                            </span>
                                                        )}
                                                        {product.isDiscount && (
                                                            <span className='rounded-full bg-red-500 px-2 py-1 text-xs text-white'>
                                                                -{getDiscountPercentage(product)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className='mt-2 flex items-center gap-2'>
                                                    <div className='flex items-center gap-1'>
                                                        <Star size={14} className='fill-yellow-500 text-yellow-500' />
                                                        <span className='text-sm font-bold'>
                                                            {product.ratingAvg?.toFixed(1) || '0.0'}
                                                        </span>
                                                    </div>
                                                    <span className='text-xs text-gray-400'>
                                                        ({product.ratingCount || 0} ta baho)
                                                    </span>
                                                </div>

                                                <div className='mt-3 flex items-center justify-between'>
                                                    <div>
                                                        {product.discountPrice ? (
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

                                                    <div className='flex items-center gap-2'>
                                                        <button
                                                            onClick={() => handleToggleWishlist(product._id)}
                                                            className='rounded-lg border border-gray-200 p-2 transition-colors hover:border-red-500 hover:text-red-500 dark:border-slate-600'>
                                                            <Heart size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAddToCart(product._id)}
                                                            className={`bg-gradient-to-r px-4 py-2 ${gradientColors} rounded-lg font-bold text-white transition-all hover:shadow-lg`}>
                                                            Savatga
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className='mt-8 flex items-center justify-center gap-2'>
                                <button
                                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className='rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600'>
                                    <ChevronLeft size={16} />
                                </button>

                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
                                        className={`h-10 w-10 rounded-lg font-bold transition-all ${
                                            pagination.page === i + 1
                                                ? `bg-gradient-to-r ${gradientColors} text-white`
                                                : 'border border-gray-200 hover:border-[#005CB9] dark:border-slate-600 dark:hover:border-blue-400'
                                        }`}>
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className='rounded-lg border border-gray-200 p-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600'>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='rounded-2xl border border-gray-100 bg-white/90 p-12 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90'>
                        <div
                            className={`mx-auto h-24 w-24 bg-gradient-to-r ${gradientColors} mb-6 flex items-center justify-center rounded-full`}>
                            <BookOpen size={40} className='text-white' />
                        </div>
                        <h2 className='mb-3 text-2xl font-black text-gray-900 dark:text-white'>Kitob topilmadi</h2>
                        <p className='mb-8 text-gray-500 dark:text-gray-400'>
                            Bu kategoriyada hozircha kitoblar mavjud emas.
                        </p>
                        <Link href='/catalog'>
                            <button className='rounded-xl bg-gradient-to-r from-[#005CB9] to-[#FF8A00] px-6 py-3 font-bold text-white transition-all hover:shadow-lg'>
                                Barcha kitoblar
                            </button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
