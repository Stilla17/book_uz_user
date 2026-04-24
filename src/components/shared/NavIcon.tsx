'use client';

import React from 'react';

import Link from 'next/link';

type NavIconProps = {
    icon: React.ReactNode;
    label: string;
    badge?: string;
    primary?: boolean;
    href?: string;
    onClick?: () => void;
};

const NavIcon = ({ icon, label, badge, primary, href = '#', onClick }: NavIconProps) => (
    <Link
        href={href}
        onClick={onClick}
        className={`group relative flex flex-col items-center gap-1 ${
            primary
                ? 'text-[#005CB9] dark:text-blue-400'
                : 'text-slate-600 hover:text-[#005CB9] dark:text-slate-300 dark:hover:text-blue-400'
        }`}>
        <div className='p-1 transition-transform group-hover:scale-110'>{icon}</div>
        <span className='text-[10px] font-extrabold tracking-tight uppercase'>{label}</span>
        {badge && (
            <span className='absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#FF8A00] text-[10px] font-black text-white dark:border-slate-950 dark:bg-orange-600'>
                {badge}
            </span>
        )}
    </Link>
);

export default NavIcon;
