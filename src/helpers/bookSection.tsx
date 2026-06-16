import { mapProductToBook as mapProductToFormattedBook } from '@/utils/book-formatters';

import { Award, BookOpen, Flame, Sparkles, TrendingUp } from 'lucide-react';

export const mapProductToBook = mapProductToFormattedBook;

export const getRequestParams = (type: string) => ({
    limit: 8,
    ...(type === 'popular' && { isTop: true }),
    ...(type === 'discount' && { isDiscount: true }),
});

export const getSectionConfig = (type: string) => {
    switch (type) {
        case 'new':
            return {
                icon: <Sparkles size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
        case 'popular':
            return {
                icon: <TrendingUp size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
        case 'discount':
            return {
                icon: <Flame size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
        case 'author':
            return {
                icon: <Award size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
        default:
            return {
                icon: <BookOpen size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
    }
};
