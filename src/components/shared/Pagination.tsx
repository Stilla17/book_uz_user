'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationVariant = 'pill' | 'square';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    siblingCount?: number;
    previousLabel?: ReactNode;
    nextLabel?: ReactNode;
    variant?: PaginationVariant;
};

const DOTS = 'dots';

const getVisiblePages = (currentPage: number, totalPages: number, siblingCount: number) => {
    if (totalPages <= 1) return [];

    const pages = new Set<number>([1, totalPages, currentPage]);

    for (let offset = 1; offset <= siblingCount; offset += 1) {
        if (currentPage - offset > 1) pages.add(currentPage - offset);
        if (currentPage + offset < totalPages) pages.add(currentPage + offset);
    }

    return Array.from(pages).sort((a, b) => a - b);
};

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className,
    siblingCount = 2,
    previousLabel = 'Oldingi',
    nextLabel = 'Keyingi',
    variant = 'pill'
}: PaginationProps) => {
    if (totalPages <= 1) return null;

    const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
    const visiblePages = getVisiblePages(safeCurrentPage, totalPages, siblingCount);
    const items = visiblePages.flatMap<(number | typeof DOTS)>((page, index) => {
        const previous = visiblePages[index - 1];
        return previous && page - previous > 1 ? [DOTS, page] : [page];
    });

    const isSquare = variant === 'square';
    const controlClassName = cn(
        'inline-flex items-center justify-center border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        isSquare
            ? 'h-10 min-w-10 rounded-lg border-gray-200 px-3 text-gray-700 hover:border-[#00a0e3] dark:border-gray-700 dark:text-gray-300'
            : 'rounded-full border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300'
    );
    const pageButtonClassName = (page: number) =>
        cn(
            'inline-flex items-center justify-center font-medium transition-all',
            isSquare ? 'h-10 min-w-10 rounded-lg px-3' : 'h-11 min-w-11 rounded-full px-4 text-sm',
            page === safeCurrentPage
                ? cn(
                      'text-white',
                      isSquare ? 'bg-gradient-to-r from-[#005CB9] to-[#FF8A00]' : 'bg-slate-950 dark:bg-[#ef7f1a]'
                  )
                : 'border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
        );

    return (
        <nav className={cn('flex flex-wrap items-center justify-center gap-2 pt-3', className)} aria-label='Pagination'>
            <button
                type='button'
                onClick={() => onPageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage <= 1}
                className={controlClassName}>
                {previousLabel}
            </button>

            {items.map((item, index) =>
                item === DOTS ? (
                    <span key={`${item}-${index}`} className='px-1 text-sm text-slate-400 dark:text-slate-500'>
                        ...
                    </span>
                ) : (
                    <button
                        key={item}
                        type='button'
                        onClick={() => onPageChange(item)}
                        aria-current={item === safeCurrentPage ? 'page' : undefined}
                        className={pageButtonClassName(item)}>
                        {item}
                    </button>
                )
            )}

            <button
                type='button'
                onClick={() => onPageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage >= totalPages}
                className={controlClassName}>
                {nextLabel}
            </button>
        </nav>
    );
};

export const PaginationPreviousIcon = <ChevronLeft size={16} />;
export const PaginationNextIcon = <ChevronRight size={16} />;
