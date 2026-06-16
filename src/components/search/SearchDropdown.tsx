'use client';

import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useSearchSuggestionsQuery } from '@/hooks/queries/useSearchSuggestionsQuery';
import { useDebounce } from '@/hooks/useDebounce';
import { getCatalogCategoryHref } from '@/lib/catalog-links';
import type { SearchDropdownProps, SearchProduct } from '@/types/search.types';
import { getText } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';

import { BookOpen, ChevronRight, Grid3x3, Loader2, Search, User, X } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887';

export const SearchDropdown = ({ searchQuery, setSearchQuery, onClose }: SearchDropdownProps) => {
    const router = useRouter();
    const [showResults, setShowResults] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(searchQuery, 500);
    const { data: results, isFetching: loading } = useSearchSuggestionsQuery(debouncedQuery);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (debouncedQuery.length >= 2) {
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    }, [debouncedQuery]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
            setShowResults(false);
            if (onClose) onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleItemClick = () => {
        setShowResults(false);
        if (onClose) onClose();
    };

    const getProductTitle = (product: SearchProduct): string => getText(product.title, "Noma'lum");

    if (!showResults || debouncedQuery.length < 2) {
        return null;
    }

    return (
        <div
            ref={dropdownRef}
            className='absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl'>
            {loading ? (
                <div className='p-8 text-center'>
                    <Loader2 size={24} className='mx-auto mb-2 animate-spin text-[#005CB9]' />
                    <p className='text-sm text-gray-500'>Qidirilmoqda...</p>
                </div>
            ) : (results?.totalCount ?? 0) > 0 ? (
                <div className='max-h-[80vh] overflow-y-auto'>
                    {/* Products */}
                    {(results?.products?.length ?? 0) > 0 && (
                        <div className='border-b border-gray-100 p-4'>
                            <h3 className='mb-3 text-xs font-bold text-gray-400 uppercase'>Kitoblar</h3>
                            <div className='space-y-2'>
                                {results!.products.map((product) => (
                                    <Link
                                        key={product._id}
                                        href={`/book/${product.slug}`}
                                        onClick={handleItemClick}
                                        className='group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50'>
                                        <div className='relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg'>
                                            <Image
                                                src={getImageUrl(product.images?.[0]) || FALLBACK_IMAGE}
                                                alt={getProductTitle(product)}
                                                fill
                                                className='object-cover'
                                            />
                                        </div>
                                        <div className='min-w-0 flex-1'>
                                            <p className='truncate text-sm font-bold text-gray-900 group-hover:text-[#005CB9]'>
                                                {getProductTitle(product)}
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Categories */}
                    {(results?.categories?.length ?? 0) > 0 && (
                        <div className='border-b border-gray-100 p-4'>
                            <h3 className='mb-3 text-xs font-bold text-gray-400 uppercase'>Kategoriyalar</h3>
                            <div className='space-y-2'>
                                {results!.categories.map((category) => (
                                    <Link
                                        key={category._id}
                                        href={getCatalogCategoryHref(category)}
                                        onClick={handleItemClick}
                                        className='group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50'>
                                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#005CB9]/10 to-[#FF8A00]/10'>
                                            <Grid3x3 size={14} className='text-[#005CB9]' />
                                        </div>
                                        <div className='flex-1'>
                                            <p className='text-sm font-bold text-gray-900 group-hover:text-[#005CB9]'>
                                                {category.title.uz}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Authors */}
                    {(results?.authors?.length ?? 0) > 0 && (
                        <div className='border-b border-gray-100 p-4'>
                            <h3 className='mb-3 text-xs font-bold text-gray-400 uppercase'>Mualliflar</h3>
                            <div className='space-y-2'>
                                {results!.authors.map((author) => (
                                    <Link
                                        key={author._id}
                                        href={`/catalog?author=${encodeURIComponent(author._id)}`}
                                        onClick={handleItemClick}
                                        className='group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50'>
                                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#005CB9]/10 to-[#FF8A00]/10'>
                                            <User size={14} className='text-[#005CB9]' />
                                        </div>
                                        <div className='flex-1'>
                                            <p className='text-sm font-bold text-gray-900 group-hover:text-[#005CB9]'>
                                                {author.name}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View all results */}
                    <div className='bg-gradient-to-r from-[#005CB9]/5 to-[#FF8A00]/5 p-4'>
                        <button
                            type='button'
                            onClick={handleSearch}
                            className='flex w-full items-center justify-between text-sm font-bold text-[#005CB9] transition-colors hover:text-[#FF8A00]'>
                            <span>Barcha natijalar ({results?.totalCount ?? 0})</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className='p-8 text-center'>
                    <p className='mb-2 text-sm text-gray-500'>Hech narsa topilmadi</p>
                    <p className='text-xs text-gray-400'>"{debouncedQuery}" bo'yicha hech qanday natija yo'q</p>
                </div>
            )}
        </div>
    );
};
