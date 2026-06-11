import React from 'react';

import Link from 'next/link';

import { bottomNav, mainNav } from '@/data/navMenu';
import { useThemeStyles } from '@/hooks/useThemeStyles';

const NavbarFooter: React.FC = () => {
    const { getBgColor, getBorderColor } = useThemeStyles();

    return (
        <div className={`border-t ${getBorderColor()} ${getBgColor('card')}`}>
            <div className='no-scrollbar container mx-auto flex h-11 items-center gap-5 overflow-x-auto px-4 xl:justify-between'>
                <nav className='flex shrink-0 items-center gap-4 lg:gap-5'>
                    {mainNav.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className='text-xs font-semibold whitespace-nowrap text-[#475266] transition-colors hover:text-[#e67600] dark:text-white dark:hover:text-[#e67600]'>
                            {item.label}
                        </Link>
                    ))}
                </nav>
                
                <span className='h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-700' />

                <nav className='flex shrink-0 items-center gap-3 lg:gap-4'>
                    {bottomNav.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className='flex items-center gap-1 text-xs font-bold whitespace-nowrap text-[#475266] transition-colors hover:text-[#e67600] dark:text-white dark:hover:text-[#e67600]'
                            title={item.description}>
                            <span className='text-[#e67600]'>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default NavbarFooter;
