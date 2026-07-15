import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { menuItems } from '@/data/navMenu';

import logo from '../../../../public/images/Logo.svg';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const AsideAdmin = () => {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <aside
            className={`hidden min-h-0 shrink-0 flex-col border-r border-[#eadfce] bg-[#fff8ee] px-3 py-5 transition-[width] duration-300 ease-out md:flex dark:border-slate-800 dark:bg-slate-950 ${
                isSidebarOpen ? 'w-64' : 'w-20'
            }`}>
            <div className='mb-5 flex min-h-0 flex-1 flex-col gap-7'>
                <div className={`flex items-center ${isSidebarOpen ? 'justify-between gap-3' : 'flex-col gap-6'}`}>
                    <Link href='/' aria-label='Admin home'>
                        <Image src={logo} alt='Book uz logo' priority />
                    </Link>

                    <button
                        type='button'
                        onClick={() => setIsSidebarOpen((value) => !value)}
                        className='grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-[#928675] shadow-sm ring-1 ring-[#eadfce] transition hover:text-[#ef7f1a] dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:text-white'
                        aria-label={isSidebarOpen ? 'Sidebarni yopish' : 'Sidebarni ochish'}
                        title={isSidebarOpen ? 'Yopish' : 'Ochish'}>
                        {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                    </button>
                </div>

                <nav className='no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto pr-1 pb-4'>
                    {menuItems.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            title={label}
                            aria-label={label}
                            className={`flex items-center rounded-2xl p-3 shadow-sm transition ${
                                isSidebarOpen ? 'justify-start gap-3 px-3' : 'justify-center'
                            } ${
                                pathname === href || (href !== '/admin' && pathname.startsWith(href))
                                    ? 'bg-[#ef7f1a] text-white'
                                    : 'bg-white text-[#928675] shadow-sm hover:bg-[#fff1df] hover:text-[#ef7f1a] dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                            }`}>
                            <Icon size={19} className='shrink-0' />
                            <span
                                className={`truncate text-sm font-black transition-all duration-200 ${
                                    isSidebarOpen ? 'w-auto opacity-100' : 'w-0 overflow-hidden opacity-0'
                                }`}>
                                {label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>

            <Link
                href='/admin/support'
                className={`flex items-center justify-center rounded-2xl bg-[#285c7f] text-white shadow-lg transition-all duration-300 ${
                    isSidebarOpen ? 'h-12 gap-3 px-4' : 'h-32 w-11 self-center'
                }`}>
                <span
                    className={isSidebarOpen ? 'text-xs font-bold' : '-rotate-90 text-xs font-bold whitespace-nowrap'}>
                    Support
                </span>
            </Link>
        </aside>
    );
};

export default AsideAdmin;
