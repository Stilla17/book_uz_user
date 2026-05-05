'use client';

import { Minus, Plus } from 'lucide-react';

type QuantityControlProps = {
    quantity: number;
    min?: number;
    max?: number;
    onDecrement: () => void;
    onIncrement: () => void;
};

const QuantityControl = ({ quantity, min = 0, max, onDecrement, onIncrement }: QuantityControlProps) => {
    const isDecrementDisabled = quantity <= min;
    const isIncrementDisabled = typeof max === 'number' && quantity >= max;

    return (
        <div className='inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-950'>
            <button
                type='button'
                aria-label='Kamaytirish'
                disabled={isDecrementDisabled}
                onClick={onDecrement}
                className='flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white hover:text-[#ef7f1a] disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800'>
                <Minus size={18} />
            </button>

            <div className='flex h-11 min-w-16 items-center justify-center rounded-xl bg-white px-4 text-lg font-black text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'>
                {quantity}
            </div>

            <button
                type='button'
                aria-label='Kopaytirish'
                disabled={isIncrementDisabled}
                onClick={onIncrement}
                className='flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-[#ef7f1a] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900'>
                <Plus size={18} />
            </button>
        </div>
    );
};

export default QuantityControl;
