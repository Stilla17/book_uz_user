'use client';

import React from 'react';

import NavbarControls from './NavbarControls';
import { Clock, Phone } from 'lucide-react';

const NavbarHeader = () => {
    return (
        <div className='w-full bg-slate-950 py-2 text-white dark:bg-slate-900'>
            <div className='container mx-auto flex h-10 items-center justify-end px-4 text-sm'>
                <div className='flex items-center gap-3 md:gap-5'>
                    <div className='flex gap-2 text-white/70 max-sm:hidden'>
                        <Clock size={14} />
                        <span>09:00 - 22:00</span>
                    </div>

                    <a
                        href='tel:+998901234567'
                        className='flex gap-2 text-white/85 transition-colors hover:text-[#FF8A00] max-sm:hidden dark:hover:text-orange-400'>
                        <Phone size={14} />
                        <span className='font-extrabold'>+998(90) 123-45-67</span>
                    </a>

                    <NavbarControls />
                </div>
            </div>
        </div>
    );
};

export default NavbarHeader;
