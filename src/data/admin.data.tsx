import { StockFilter } from '@/helpers/admin/newBook';

import { BookOpen, ShieldCheck } from 'lucide-react';

type StockCounts = {
    low: number;
    available: number;
    out: number;
};

export const getStockFilterButtons = (stockCounts: StockCounts) => [
    {
        value: 'low' as StockFilter,
        label: 'Kam',
        count: stockCounts.low,
        className:
            'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
        activeClassName: 'ring-2 ring-amber-400'
    },
    {
        value: 'available' as StockFilter,
        label: 'Mavjud',
        count: stockCounts.available,
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
        activeClassName: 'ring-2 ring-emerald-400'
    },
    {
        value: 'out' as StockFilter,
        label: 'Tugagan',
        count: stockCounts.out,
        className:
            'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300',
        activeClassName: 'ring-2 ring-red-400'
    }
];

export const getBookStats = (total: number, active: number) => [
    {
        label: 'Jami kitoblar',
        value: total,
        icon: BookOpen,
        color: 'bg-[#ef7f1a]'
    },
    {
        label: 'Faol kitoblar',
        value: active,
        icon: ShieldCheck,
        color: 'bg-green-500'
    },
    {
        label: 'Nofaol kitoblar',
        value: total - active,
        icon: ShieldCheck,
        color: 'bg-red-500'
    }
];
