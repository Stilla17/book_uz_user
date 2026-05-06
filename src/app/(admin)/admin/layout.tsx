'use client';

// src/app/(admin)/admin/layout.tsx
import type { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import {
    BarChart3,
    Bell,
    BookOpen,
    Building2,
    LayoutDashboard,
    PanelLeftClose,
    PanelLeftOpen,
    Search,
    Settings,
    ShoppingCart,
    Users
} from 'lucide-react';

type AdminLayoutProps = {
    children: ReactNode;
};

const menuItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard
    },
    {
        label: 'Kitoblar',
        href: '/admin/book',
        icon: BookOpen
    },
    {
        label: 'Nashriyotlar',
        href: '/admin/publishers',
        icon: Building2
    },
    {
        label: 'Buyurtmalar',
        href: '/admin/orders',
        icon: ShoppingCart
    },
    {
        label: 'Foydalanuvchilar',
        href: '/admin/users',
        icon: Users
    },
    {
        label: 'Sozlamalar',
        href: '/admin/settings',
        icon: Settings
    }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className='min-h-screen bg-[#d8ccbd] p-3 text-[#2f2a25] dark:bg-slate-950 dark:text-white md:p-5'>
            <div className='mx-auto flex min-h-[calc(100vh-24px)] max-w-full overflow-hidden rounded-[28px] bg-[#f7f0e6] shadow-[0_24px_80px_rgba(64,45,30,0.18)] dark:bg-slate-900 md:min-h-[calc(100vh-40px)]'>
                <aside
                    className={`hidden shrink-0 flex-col justify-between border-r border-[#eadfce] bg-[#fff8ee] px-3 py-5 transition-[width] duration-300 ease-out dark:border-slate-800 dark:bg-slate-950 md:flex ${
                        isSidebarOpen ? 'w-64' : 'w-20'
                    }`}>
                    <div className='flex flex-col gap-7'>
                        <div className={`flex items-center ${isSidebarOpen ? 'justify-between gap-3' : 'justify-center'}`}>
                            <Link
                                href='/admin'
                                className='grid size-11 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'
                                aria-label='Admin home'>
                                <span className='text-lg font-black text-[#ef7f1a]'>B</span>
                            </Link>

                            <div
                                className={`min-w-0 transition-all duration-200 ${
                                    isSidebarOpen ? 'w-auto flex-1 opacity-100' : 'w-0 overflow-hidden opacity-0'
                                }`}>
                                <p className='truncate text-xs font-bold uppercase text-[#9d907e] dark:text-slate-500'>
                                    BookUz
                                </p>
                                <p className='truncate text-base font-black text-[#2f2a25] dark:text-white'>Admin</p>
                            </div>

                            <button
                                type='button'
                                onClick={() => setIsSidebarOpen((value) => !value)}
                                className='grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-[#928675] shadow-sm ring-1 ring-[#eadfce] transition hover:text-[#ef7f1a] dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:text-white'
                                aria-label={isSidebarOpen ? 'Sidebarni yopish' : 'Sidebarni ochish'}
                                title={isSidebarOpen ? 'Yopish' : 'Ochish'}>
                                {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                            </button>
                        </div>

                        <nav className='flex flex-col gap-3'>
                            {menuItems.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    title={label}
                                    aria-label={label}
                                    className={`flex h-11 items-center rounded-2xl transition ${
                                        isSidebarOpen ? 'justify-start gap-3 px-3' : 'justify-center'
                                    } ${
                                        pathname === href || (href !== '/admin' && pathname.startsWith(href))
                                            ? 'bg-[#ef7f1a] text-white shadow-[0_12px_24px_rgba(239,127,26,0.28)]'
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
                        <span className={isSidebarOpen ? 'text-xs font-bold' : '-rotate-90 whitespace-nowrap text-xs font-bold'}>
                            Support
                        </span>
                    </Link>
                </aside>

                <div className='flex min-w-0 flex-1 flex-col'>
                    <header className='flex flex-wrap items-center justify-between gap-4 border-b border-[#eadfce] bg-[#fff8ee] px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:px-6'>
                        <div>
                            <p className='text-xs font-bold uppercase text-[#9d907e] dark:text-slate-500'>
                                BookUz boshqaruvi
                            </p>
                            <h1 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>Admin Panel</h1>
                        </div>

                        <form className='order-3 flex h-11 min-w-0 flex-1 items-center gap-2 rounded-2xl bg-[#eee3d4] px-4 text-sm text-[#817466] md:order-none md:max-w-xl dark:bg-slate-800 dark:text-slate-300'>
                            <Search size={18} />
                            <input
                                type='search'
                                placeholder='Kitob, buyurtma yoki foydalanuvchi qidirish'
                                className='h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                            />
                        </form>

                        <div className='flex items-center gap-2'>
                            <button
                                type='button'
                                aria-label='Hisobotlar'
                                className='grid size-11 place-items-center rounded-2xl bg-white text-[#817466] shadow-sm dark:bg-slate-900 dark:text-slate-300'>
                                <BarChart3 size={19} />
                            </button>
                            <button
                                type='button'
                                aria-label='Bildirishnomalar'
                                className='relative grid size-11 place-items-center rounded-2xl bg-white text-[#817466] shadow-sm dark:bg-slate-900 dark:text-slate-300'>
                                <Bell size={19} />
                                <span className='absolute right-2 top-2 size-2 rounded-full bg-[#ef7f1a]' />
                            </button>
                            <div className='grid size-11 place-items-center rounded-2xl bg-[#7c6dc8] text-sm font-black text-white shadow-sm'>
                                A
                            </div>
                        </div>
                    </header>

                    <main className='min-w-0 flex-1 overflow-y-auto bg-[#f7f0e6] p-4 dark:bg-slate-900 md:p-6'>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
