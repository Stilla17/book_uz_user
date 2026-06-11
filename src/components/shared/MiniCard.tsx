'use client';

import React from 'react';

export type MiniCardItem = {
    icon: React.ReactNode;
    value: React.ReactNode;
    label: React.ReactNode;
    color?: string;
};

export type MiniCardProps = {
    items: MiniCardItem[];
    initialDelay?: number;
    itemDelayStep?: number;
};

const MiniCard = ({ items }: MiniCardProps) => {
    return (
        <div className={`mb-20 grid grid-cols-[repeat(auto-fit,minmax(150px,190px))] justify-center gap-4`}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800`}>
                    <div
                        className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white ${item.color ?? 'from-[#00a0e3] to-[#ef7f1a]'}`}>
                        {item.icon}
                    </div>
                    <div className='text-2xl font-black text-gray-900 dark:text-white'>{item.value}</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>{item.label}</div>
                </div>
            ))}
        </div>
    );
};

export default MiniCard;
