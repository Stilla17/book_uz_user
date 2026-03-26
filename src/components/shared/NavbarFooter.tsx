import React from 'react';

import Link from 'next/link';

import { bottomNav } from '@/data/navMenu';
import { useThemeStyles } from '@/hooks/useThemeStyles';

const NavbarFooter: React.FC = () => {
    const { getBgColor, getBorderColor } = useThemeStyles();
    // theme va setTheme kerak emas, faqat ranglar kerak bo'ladi
    // text rangini Tailwind text-foreground orqali theme ga mos qilamiz
    return (
        <div className={`border-t ${getBorderColor()} ${getBgColor('card')}`}>
            <div className='no-scrollbar container mx-auto flex h-12 items-center justify-center gap-4 overflow-x-auto px-4 md:justify-start md:gap-6'>
                {bottomNav.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`group relative flex items-center gap-1.5 text-xs font-extrabold whitespace-nowrap text-[#475266] transition-all hover:opacity-80 md:text-sm dark:text-white`}
                        title={item.description}>
                        <span className='text-[#e67600]'>{item.icon}</span>
                        {item.label}

                        {/* Hover tooltip */}
                        <span className='pointer-events-none absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 transform rounded bg-[#e67600] px-2 py-1 text-[10px] whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-[#e67600]'>
                            {item.description}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default NavbarFooter;
