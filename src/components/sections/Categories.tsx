'use client';

import Link from 'next/link';

import { usePublicCategoriesQuery } from '@/hooks/queries/usePublicCategoriesQuery';
import { getCatalogCategoryHref } from '@/lib/catalog-links';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category.types';
import type { CategorySectionProps } from '@/types/section.types';

import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ChevronRight, Star } from 'lucide-react';

export const CategorySection = ({
    onCategoryClick,
    lang = 'uz',
    limit = 8,
    showAllLink = true
}: CategorySectionProps) => {
    const reduceMotion = useReducedMotion();
    const { data: categoriesData = [], isLoading: loading } = usePublicCategoriesQuery();

    const categories = categoriesData
        .filter((cat) => cat.isActive !== false)
        .sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
            }
            return (b.bookCount || 0) - (a.bookCount || 0);
        })
        .slice(0, limit);

    const title = lang === 'uz' ? 'Kategoriyalar' : lang === 'ru' ? 'Категории' : 'Categories';
    const subtitle =
        lang === 'uz'
            ? 'O‘zingizga yoqqan yo‘nalishni tanlang'
            : lang === 'ru'
              ? 'Выберите интересующее направление'
              : 'Choose your favorite genre';

    const allText = lang === 'uz' ? 'Hammasi' : lang === 'ru' ? 'Все' : 'All';
    const viewAllText = lang === 'uz' ? "Hammasini ko'rish" : lang === 'ru' ? 'Посмотреть все' : 'View all';

    const handleCategoryClick = (cat: Category) => {
        if (onCategoryClick) {
            onCategoryClick(cat);
        } else {
            window.location.href = getCatalogCategoryHref(cat);
        }
    };

    // If no categories and not loading, don't render anything
    if (!loading && categories.length === 0) {
        return null;
    }

    return (
        <section className='relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-12 dark:from-slate-900 dark:to-slate-800'>
            {/* Animated Background Elements */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Floating Icons */}

                {/* Grid Pattern */}
                <div className='brand-grid' />
            </div>

            <div className='relative z-10 container mx-auto px-4'>
                {/* Header */}
                <div className='mb-8 flex items-end justify-between gap-4'>
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className='text-2xl font-black tracking-tight md:text-3xl'>
                            <span className='text-[#00a0e3] dark:text-blue-300'>{title.split(' ')[0]}</span>
                            <span className='text-[#ef7f1a] dark:text-orange-400'>
                                {' '}
                                {title.split(' ').slice(1).join(' ')}
                            </span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className='mt-1 text-sm text-slate-500 md:text-base dark:text-slate-400'>
                            {subtitle}
                        </motion.p>
                    </div>

                    {showAllLink && categories.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}>
                            <Link
                                href='/catalog'
                                className='group hidden cursor-pointer items-center gap-2 text-sm font-semibold text-[#00a0e3] transition-colors hover:text-[#ef7f1a] md:flex dark:text-blue-300 dark:hover:text-orange-400'>
                                {allText}{' '}
                                <ChevronRight size={18} className='transition-transform group-hover:translate-x-1' />
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Categories Grid */}
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5'>
                    {loading ? (
                        // Skeleton loading
                        Array.from({ length: limit }).map((_, i) => (
                            <div
                                key={i}
                                className='h-[140px] animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700'
                            />
                        ))
                    ) : categories.length === 0 ? (
                        // Empty state
                        <div className='col-span-full py-12 text-center'>
                            <p className='text-slate-500 dark:text-slate-400'>Kategoriyalar mavjud emas</p>
                        </div>
                    ) : (
                        categories.map((cat, index) => {
                            const title = cat.title as
                                | Partial<Record<typeof lang | 'uz' | 'ru' | 'en', string>>
                                | string
                                | undefined;
                            const label =
                                typeof title === 'string'
                                    ? title
                                    : title?.[lang] || title?.uz || title?.ru || title?.en || cat.slug || 'Kategoriya';
                            const slug = cat.slug || '';
                            const bookCount = cat.bookCount || 0;

                            return (
                                <motion.button
                                    key={cat._id || cat.slug || index}
                                    type='button'
                                    onClick={() => handleCategoryClick(cat)}
                                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                                    whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    whileHover={reduceMotion ? {} : { y: -6, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className='group relative w-full'>
                                    <div
                                        className={cn(
                                            'relative overflow-hidden rounded-2xl p-5',
                                            'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700',
                                            'border-2 border-transparent',
                                            'hover:border-[#00a0e3]/30 hover:shadow-xl dark:hover:border-[#ef7f1a]/30 dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20',
                                            'flex h-full flex-col transition-all duration-300'
                                        )}>
                                        {/* Background Gradient - Light mode */}
                                        <div
                                            className={cn(
                                                'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10',
                                                'bg-gradient-to-br',
                                                'dark:hidden'
                                            )}
                                        />

                                        {/* Background Gradient - Dark mode */}
                                        <div
                                            className={cn(
                                                'absolute inset-0 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-20 dark:block',
                                                'bg-gradient-to-br'
                                            )}
                                        />

                                        {/* Category Name */}
                                        <h3
                                            className={cn(
                                                'text-left text-sm font-extrabold md:text-base',
                                                'text-slate-900 dark:text-white',
                                                'group-hover:text-[#00a0e3] dark:group-hover:text-[#ef7f1a]',
                                                'line-clamp-2 flex-1 transition-colors'
                                            )}>
                                            {label}
                                        </h3>

                                        {/* Count Badge */}
                                        {bookCount > 0 && (
                                            <div
                                                className={cn(
                                                    'mt-2 flex items-center gap-1 text-xs',
                                                    'text-slate-400 dark:text-slate-500',
                                                    'group-hover:text-[#ef7f1a] dark:group-hover:text-orange-400',
                                                    'transition-colors'
                                                )}>
                                                <BookOpen size={12} />
                                                <span>{bookCount.toLocaleString()} ta</span>
                                            </div>
                                        )}

                                        {/* Featured Badge */}
                                        {cat.isFeatured && (
                                            <div className='absolute top-2 right-2'>
                                                <span className='flex items-center gap-0.5 rounded-full bg-yellow-500 px-1.5 py-0.5 text-[8px] text-white'>
                                                    <Star size={8} className='fill-white' />
                                                    <span>Top</span>
                                                </span>
                                            </div>
                                        )}

                                        {/* Hover Arrow */}
                                        <div className='absolute right-3 bottom-3 translate-x-2 transform opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100'>
                                            <ChevronRight size={18} className='text-[#ef7f1a] dark:text-orange-400' />
                                        </div>

                                        {/* Decorative Corner */}
                                        <div className='absolute top-0 right-0 h-12 w-12 overflow-hidden'>
                                            <div
                                                className={cn(
                                                    'absolute top-0 right-0 h-12 w-12',
                                                    'bg-gradient-to-br from-[#00a0e3]/20 to-[#ef7f1a]/20',
                                                    'dark:from-[#00a0e3]/20 dark:to-[#ef7f1a]/20',
                                                    'translate-x-6 -translate-y-6 rotate-12 transform',
                                                    'group-hover:translate-x-4 group-hover:-translate-y-4',
                                                    'transition-transform'
                                                )}
                                            />
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })
                    )}
                </div>

                {/* Mobile "All" button */}
                {showAllLink && categories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className='mt-8 flex justify-center md:hidden'>
                        <Link
                            href='/catalog'
                            className='inline-flex transform items-center gap-2 rounded-full bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:from-[#00a0e3] dark:to-[#ef7f1a]'>
                            {viewAllText}
                            <ChevronRight size={18} />
                        </Link>
                    </motion.div>
                )}

                {/* Decorative Bottom Gradient */}
                <div className='absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-[#00a0e3]/20 to-transparent' />
            </div>
        </section>
    );
};

// Feather icon component
const Feather = (props: any) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'>
        <path d='M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z' />
        <line x1='16' x2='2' y1='8' y2='22' />
        <line x1='17.5' x2='9' y1='15' y2='15' />
    </svg>
);
