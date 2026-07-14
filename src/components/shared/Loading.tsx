'use client';

import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Loading = () => {
    const { t } = useTranslation();

    return (
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
            <div className='text-center'>
                <div className='relative'>
                    <div className='mx-auto mb-4 h-20 w-20 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500 dark:border-blue-400/20 dark:border-t-blue-400' />
                    <BookOpen
                        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-blue-500 dark:text-blue-400'
                        size={32}
                    />
                </div>
                <p className='animate-pulse text-lg text-gray-500 dark:text-gray-400'>{t('loading.message')}</p>
            </div>
        </div>
    );
};
