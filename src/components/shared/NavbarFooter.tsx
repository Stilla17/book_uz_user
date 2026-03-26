import { bottomNav } from '@/data/navMenu';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import Link from 'next/link';
import React from 'react'

const NavbarFooter: React.FC = () => {

    const { isDark, getBgColor, getTextColor, getBorderColor } = useThemeStyles();


    return (
        <div className={`border-t ${getBorderColor()} ${getBgColor('card')}`}>
            <div className="container mx-auto px-4 h-12 flex items-center justify-center md:justify-start gap-4 md:gap-6 overflow-x-auto no-scrollbar">
                {bottomNav.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`group relative whitespace-nowrap text-xs md:text-sm font-extrabold flex items-center gap-1.5 transition-all text-white hover:opacity-80`}
                        title={item.description}
                    >
                        <span className={`${item.color}`}>{item.icon}</span>
                        {item.label}

                        {/* Hover tooltip */}
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {item.description}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default NavbarFooter