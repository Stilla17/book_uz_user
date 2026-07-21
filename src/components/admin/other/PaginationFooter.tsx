import React from 'react';

import { Button } from '@/components/ui/button';

import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type PaginationFooterProps = {
    pagination?: {
        page: number;
        pages: number;
        total?: number;
    };
    page: number;
    updatePage: (page: number) => void;
    isFetching: boolean;
};

const PaginationFooter = ({ pagination, page, updatePage, isFetching }: PaginationFooterProps) => {
    const totalPages = Math.max(1, pagination?.pages ?? 1);
    const visiblePages = Array.from(
        { length: Math.min(5, totalPages) },
        (_, index) => Math.min(Math.max(page - 2, 1), Math.max(totalPages - 4, 1)) + index
    );

    return (
        <div className='flex flex-col gap-3 border-t border-base-300 p-4 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-sm font-bold text-admin-muted'>
                Sahifa {pagination?.page ?? page} / {totalPages}
                {typeof pagination?.total === 'number' && ` · Jami ${pagination.total.toLocaleString('uz-UZ')} ta`}
            </p>
            <div className='flex flex-wrap gap-2'>
                <Button
                    variant='outline'
                    disabled={page <= 1 || isFetching}
                    onClick={() => updatePage(1)}
                    aria-label='Birinchi sahifa'
                    className='size-10 rounded-xl border-base-300 bg-base-100 p-0 font-black'>
                    <ChevronsLeft size={17} />
                </Button>
                <Button
                    variant='outline'
                    disabled={page <= 1 || isFetching}
                    onClick={() => updatePage(page - 1)}
                    className='h-10 rounded-2xl border-base-300 bg-base-100 font-black'>
                    <ArrowLeft size={17} />
                    Oldingi
                </Button>
                {visiblePages.map((pageNumber) => (
                    <Button
                        key={pageNumber}
                        type='button'
                        variant={pageNumber === page ? 'default' : 'outline'}
                        disabled={isFetching}
                        onClick={() => updatePage(pageNumber)}
                        className={`size-10 rounded-xl p-0 font-black ${
                            pageNumber === page
                                ? 'bg-warning text-warning-content hover:opacity-90'
                                : 'border-base-300 bg-base-100'
                        }`}>
                        {pageNumber}
                    </Button>
                ))}
                <Button
                    variant='outline'
                    onClick={() => updatePage(page + 1)}
                    disabled={page >= totalPages || isFetching}
                    className='h-10 rounded-2xl border-base-300 bg-base-100 font-black'>
                    Keyingi
                    <ArrowRight size={17} />
                </Button>
                <Button
                    variant='outline'
                    disabled={page >= totalPages || isFetching}
                    onClick={() => updatePage(totalPages)}
                    aria-label='Oxirgi sahifa'
                    className='size-10 rounded-xl border-base-300 bg-base-100 p-0 font-black'>
                    <ChevronsRight size={17} />
                </Button>
            </div>
        </div>
    );
};

export default PaginationFooter;
