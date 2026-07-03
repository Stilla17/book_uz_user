'use client';

import React from 'react';

import Link from 'next/link';

type MobileActionProps = {
    href: string;
    icon: React.ReactNode;
    label: string;
    badge?: string;
    primary?: boolean;
    onClick?: () => void;
};

const MobileAction = ({ href, icon, label, badge, primary, onClick }: MobileActionProps) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`relative flex min-w-0 items-center gap-3 rounded-2xl border p-3 transition-all sm:p-4 ${
                primary
                    ? 'border-transparent bg-[#2572c0] text-white dark:bg-blue-200'
                    : 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
            }`}>
            <div
                className={`grid h-10 w-10 place-items-center rounded-2xl ${
                    primary ? 'bg-white/15' : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                {icon}
            </div>
            <div className='min-w-0 truncate text-sm font-extrabold sm:text-base'>{label}</div>
            {badge && (
                <span className='absolute top-2 right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF8A00] text-[10px] font-black text-white dark:bg-orange-600'>
                    {badge}
                </span>
            )}
        </Link>
    );
};

export default MobileAction;
