'use client';

import { type ReactNode, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLogout } from '@/components/admin/hooks/auth-login';
import { useTheme } from '@/context/ThemeContext';

import logo from '../../../../public/images/Logo.svg';
import {
    BarChart3,
    Bell,
    BookOpen,
    Building2,
    Handshake,
    ImageIcon,
    LayoutDashboard,
    Loader2,
    LogOut,
    MessageSquareText,
    Moon,
    Newspaper,
    PanelLeftClose,
    PanelLeftOpen,
    PenLine,
    Quote,
    Settings,
    ShoppingCart,
    Sun,
    Tags,
    TicketPercent,
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
        label: 'Janrlar',
        href: '/admin/genre',
        icon: Tags
    },
    {
        label: 'Nashriyotlar',
        href: '/admin/publishers',
        icon: Building2
    },
    {
        label: 'Mualliflar',
        href: '/admin/authors',
        icon: PenLine
    },
    {
        label: 'Yangiliklar',
        href: '/admin/news',
        icon: Newspaper
    },
    {
        label: 'Banner',
        href: '/admin/banners',
        icon: ImageIcon
    },
    {
        label: 'Promo kod',
        href: '/admin/promo-codes',
        icon: TicketPercent
    },
    {
        label: 'Kommentariya',
        href: '/admin/comments',
        icon: MessageSquareText
    },
    {
        label: 'Iqtibos',
        href: '/admin/quotes',
        icon: Quote
    },
    {
        label: 'Partners',
        href: '/admin/partners',
        icon: Handshake
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
    const { theme, setTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
            onSettled: () => setIsLogoutModalOpen(false)
        });
    };

    return (
        <div className='h-screen overflow-hidden bg-[#d8ccbd] p-3 text-[#2f2a25] md:p-5 dark:bg-slate-950 dark:text-white'>
            <div className='mx-auto flex h-[calc(100vh-24px)] max-w-full overflow-hidden rounded-[28px] bg-[#f7f0e6] shadow-[0_24px_80px_rgba(64,45,30,0.18)] md:h-[calc(100vh-40px)] dark:bg-slate-900'>
                <aside
                    className={`hidden min-h-0 shrink-0 flex-col border-r border-[#eadfce] bg-[#fff8ee] px-3 py-5 transition-[width] duration-300 ease-out md:flex dark:border-slate-800 dark:bg-slate-950 ${
                        isSidebarOpen ? 'w-64' : 'w-20'
                    }`}>
                    <div className='mb-5 flex min-h-0 flex-1 flex-col gap-7'>
                        <div
                            className={`flex items-center ${isSidebarOpen ? 'justify-between gap-3' : 'flex-col gap-6'}`}>
                            <Link href='/admin' aria-label='Admin home'>
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
                            className={
                                isSidebarOpen ? 'text-xs font-bold' : '-rotate-90 text-xs font-bold whitespace-nowrap'
                            }>
                            Support
                        </span>
                    </Link>
                </aside>

                <div className='flex min-w-0 flex-1 flex-col'>
                    <header className='flex flex-wrap items-center justify-between gap-4 border-b border-[#eadfce] bg-[#fff8ee] px-4 py-4 md:px-6 dark:border-slate-800 dark:bg-slate-950'>
                        <div>
                            <p className='text-xs font-bold text-[#9d907e] uppercase dark:text-slate-500'>
                                BookUz boshqaruvi
                            </p>
                            <h1 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>Admin Panel</h1>
                        </div>

                        <div className='flex items-center gap-2'>
                            <button
                                type='button'
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                                className='grid size-11 place-items-center rounded-2xl bg-white text-[#817466] shadow-sm transition hover:text-[#ef7f1a] dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white'>
                                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                            </button>
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
                                <span className='absolute top-2 right-2 size-2 rounded-full bg-[#ef7f1a]' />
                            </button>
                            <button
                                type='button'
                                onClick={() => setIsLogoutModalOpen(true)}
                                aria-label='Admin menyu'
                                title='Chiqish'
                                className='grid size-11 place-items-center rounded-2xl bg-[#7c6dc8] text-sm font-black text-white shadow-sm transition hover:bg-[#6959bb]'>
                                A
                            </button>
                        </div>
                    </header>

                    <main className='min-w-0 flex-1 overflow-y-auto bg-[#f7f0e6] p-4 md:p-6 dark:bg-slate-900'>
                        {children}
                    </main>
                </div>
            </div>

            {isLogoutModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm'>
                    <div className='w-full max-w-sm rounded-[24px] bg-[#fffaf2] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10'>
                            <LogOut size={24} />
                        </div>

                        <div className='mt-4 text-center'>
                            <h2 className='text-xl font-black text-[#2f2a25] dark:text-white'>Tizimdan chiqasizmi?</h2>
                            <p className='mt-2 text-sm leading-6 font-semibold text-[#8b7e70] dark:text-slate-400'>
                                Admin paneldan chiqish uchun tasdiqlang.
                            </p>
                        </div>

                        <div className='mt-6 grid grid-cols-2 gap-3'>
                            <button
                                type='button'
                                disabled={isLoggingOut}
                                onClick={() => setIsLogoutModalOpen(false)}
                                className='h-11 rounded-2xl bg-white text-sm font-black text-[#6f6255] ring-1 ring-[#eadfce] transition hover:bg-[#f2e7d8] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'>
                                Bekor qilish
                            </button>
                            <button
                                type='button'
                                disabled={isLoggingOut}
                                onClick={handleLogout}
                                className='flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-500 text-sm font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70'>
                                {isLoggingOut ? <Loader2 size={17} className='animate-spin' /> : <LogOut size={17} />}
                                Chiqish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
