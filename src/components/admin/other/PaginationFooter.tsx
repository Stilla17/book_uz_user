import React from 'react';

import { Button } from '@/components/ui/button';

import { ArrowLeft, ArrowRight } from 'lucide-react';

type PaginationFooterProps = {
    pagination?: {
        page: number;
        pages: number;
    };
    page: number;
    updatePage: (page: number) => void;
    isFetching: boolean;
};

const PaginationFooter = ({ pagination, page, updatePage, isFetching }: PaginationFooterProps) => {
    return (
        <div className='flex flex-col gap-3 border-t border-[#eadfce] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800'>
            <p className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                Sahifa {pagination?.page} / {pagination?.pages}
            </p>
            <div className='flex gap-2'>
                <Button
                    variant='outline'
                    disabled={page <= 1 || isFetching}
                    onClick={() => updatePage(page - 1)}
                    className='h-10 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                    <ArrowLeft size={17} />
                    Oldingi
                </Button>
                <Button
                    variant='outline'
                    onClick={() => updatePage(page + 1)}
                    disabled={page >= (pagination?.pages ?? 1) || isFetching}
                    className='h-10 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                    Keyingi
                    <ArrowRight size={17} />
                </Button>
            </div>
        </div>
    );
};

export default PaginationFooter;
