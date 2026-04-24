'use client';

import React, { type FormEvent, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SearchDropdown } from '@/components/search/SearchDropdown';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { bottomNav, serviceMenuItems } from '@/data/navMenu';
import { usePublicCategoriesQuery } from '@/hooks/queries/usePublicCategoriesQuery';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { getLocalizedCategoryName, getLocalizedTitle, getUserFirstName, getUserInitials } from '@/lib/navbar-utils';
import { api } from '@/services/api';

import NavbarMobile from '../mobile/NavbarMobile';
import NavIcon from './NavIcon';
import NavbarFooter from './NavbarFooter';
import NavbarHeader from './NavbarHeader';
import UserDropdown from './UserDropdown';
import { BookOpen, ChevronDown, Grid3x3, Info, Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Kategoriya interfeysi
export const Navbar = () => {
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    const { user, isAuthenticated, logout, wishlistCount } = useAuth();
    const { isDark, getBgColor, getTextColor, getBorderColor } = useThemeStyles();

    const { t, i18n } = useTranslation();
    const { data: categories = [] } = usePublicCategoriesQuery();
    const myBooksHref = '/my-books';

    // Savatdagi mahsulotlar sonini olish
    useEffect(() => {
        if (isAuthenticated) {
            loadCartCount();
        } else {
            setCartCount(0);
        }
    }, [isAuthenticated]);

    const loadCartCount = async () => {
        try {
            const response = await api.get('/cart');
            if (response.data?.success && response.data.data?.items) {
                const totalItems = response.data.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
                setCartCount(totalItems);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error("Savat ma'lumotlarini olishda xatolik:", error);
            setCartCount(0);
        }
    };

    const handleLoginClick = () => {
        router.push('/auth/login');
    };

    const handleLogout = async () => {
        await logout();
        setCartCount(0);
        router.push('/');
    };

    const submitSearch = (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        const query = searchQuery.trim();
        if (!query) return;

        setShowSearchDropdown(false);
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <header className={`sticky top-0 z-50 w-full ${getBgColor('card')} border-b backdrop-blur ${getBorderColor()}`}>
            {/* Nav Header */}
            <NavbarHeader />

            {/* MAIN ROW */}
            <div
                className={`container mx-auto flex h-18 items-center justify-between gap-2 px-4 md:h-20 md:gap-4 ${getBgColor('card')}`}>
                {/* Chap qism - Logo va Katalog */}
                <div className='flex items-center gap-2 md:gap-4'>
                    {/* Mobile burger */}
                    <NavbarMobile
                        cartCount={cartCount}
                        isAuthenticated={isAuthenticated}
                        userFirstName={getUserFirstName(user)}
                    />

                    {/* LOGO */}
                    <Link href='/' className='group flex items-center gap-2 max-md:hidden'>
                        <Image src='/images/Logo.svg' alt='Logo' width={80} height={80} />
                    </Link>

                    {/* CATALOG (desktop) */}
                    <div className='hidden lg:block'>
                        <DropdownMenu open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
                            {/* Name Button */}
                            <DropdownMenuTrigger asChild>
                                <Button className='flex h-11 items-center gap-2 rounded-xl border border-transparent bg-[#f07e1a] px-5 font-extrabold text-white transition-all hover:bg-[#fc953b] hover:text-white md:h-12'>
                                    <Menu size={20} />
                                    <span>{t('catalog')}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`}
                                    />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align='start'
                                className={`mt-2 max-h-[80vh] w-225 overflow-y-auto p-6 ${getBgColor('card')} border ${getBorderColor()} rounded-2xl shadow-2xl`}>
                                {/* Kategoriyalar bo'limi */}
                                <div className='mb-6'>
                                    <div className='mb-4 flex items-center justify-between'>
                                        <h3 className={`font-black ${getTextColor()} flex items-center gap-2 text-lg`}>
                                            <Grid3x3 size={20} className='text-[#00a0e3] dark:text-blue-400' />
                                            {t('catalog')}
                                        </h3>
                                        <Link
                                            href='/catalog'
                                            onClick={() => setIsCatalogOpen(false)}
                                            className='flex items-center gap-1 text-sm font-bold text-[#00a0e3] transition-colors hover:text-[#FF8A00] dark:text-blue-400 dark:hover:text-orange-400'>
                                            {t('allView')}
                                            <ChevronDown size={14} className='rotate-270' />
                                        </Link>
                                    </div>

                                    <div className='grid grid-cols-3 gap-3'>
                                        {categories.map((category) => (
                                            <Link
                                                key={category._id}
                                                href={`/category/${category.slug}`}
                                                onClick={() => setIsCatalogOpen(false)}
                                                className={`flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all`}>
                                                <div className='flex-1'>
                                                    <p className={`font-bold ${getTextColor()}`}>
                                                        {getLocalizedCategoryName(category, i18n.language)}
                                                    </p>

                                                    {category.subgenres?.map((sub, index) => (
                                                        <p
                                                            key={index}
                                                            className={`text-[14px] text-gray-400 hover:text-[#FF8A00] dark:text-slate-500 dark:hover:text-[#FF8A00]`}>
                                                            {getLocalizedTitle(sub.title, i18n.language)}
                                                        </p>
                                                    ))}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <DropdownMenuSeparator className={`my-6 ${getBorderColor()}`} />

                                {/* Tezkor havolalar */}
                                <div className='grid grid-cols-4 gap-3'>
                                    {bottomNav.slice(0, 4).map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsCatalogOpen(false)}
                                            className={`flex items-center gap-2 rounded-xl border bg-slate-50 p-3 dark:bg-slate-900 ${getBorderColor()} transition-all hover:border-transparent hover:bg-[#005CB9] hover:text-white dark:hover:bg-blue-600`}>
                                            <span className={item.color}>{item.icon}</span>
                                            <span className='text-sm font-semibold'>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* SERVICES (desktop) */}
                    <div className='hidden lg:block'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className={`flex h-11 items-center gap-2 rounded-xl border border-transparent bg-[#f07e1a] px-5 font-extrabold text-white transition-all hover:bg-[#fc953b] hover:text-white md:h-12`}>
                                    <Info size={20} />
                                    <span>{t('services')}</span>
                                    <ChevronDown size={16} />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align='start'
                                className={`mt-2 max-h-[80vh] w-87.5 overflow-y-auto p-4 ${getBgColor('card')} border ${getBorderColor()} rounded-2xl shadow-2xl`}>
                                <div className='grid grid-cols-2 gap-2'>
                                    {serviceMenuItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            onClick={() => setIsCatalogOpen(false)}
                                            className={`group flex flex-col items-start rounded-xl p-3 transition-all hover:bg-[#005CB9]/5 dark:hover:bg-blue-500/10`}>
                                            <div className='flex w-full items-center gap-2'>
                                                <div
                                                    className={`rounded-lg bg-gray-100 p-2 text-[#00a0e3] transition-all group-hover:bg-[#005CB9] group-hover:text-white dark:bg-slate-900 dark:text-blue-400 dark:group-hover:bg-blue-600`}>
                                                    {item.icon}
                                                </div>
                                                <div className='flex-1'>
                                                    <p
                                                        className={`text-sm font-extrabold ${getTextColor()} group-hover:text-[#005CB9] dark:group-hover:text-blue-400`}>
                                                        {/* {item.label} */}
                                                        {t(item.label)}
                                                    </p>
                                                    <p className='text-[10px] text-gray-400 dark:text-slate-500'>
                                                        {t(item.description)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <DropdownMenuSeparator className={`my-4 ${getBorderColor()}`} />

                                <div
                                    className={`rounded-xl bg-gradient-to-r from-[#005CB9]/5 to-[#FF8A00]/5 p-2 dark:from-blue-500/10 dark:to-orange-500/10`}>
                                    <Link
                                        href='/services'
                                        onClick={() => setIsCatalogOpen(false)}
                                        className='flex items-center justify-between p-2 text-sm font-extrabold text-[#005CB9] transition-colors hover:text-[#FF8A00] dark:text-blue-400 dark:hover:text-orange-400'>
                                        <span>{t('servicesAll')}</span>
                                        <ChevronDown size={16} className='-rotate-90' />
                                    </Link>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* O'rta qism - SEARCH */}
                <form className='relative mx-auto max-w-2xl flex-1 max-sm:hidden' onSubmit={submitSearch}>
                    <Input
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchDropdown(e.target.value.trim().length >= 2);
                        }}
                        onFocus={() => setShowSearchDropdown(searchQuery.trim().length >= 2)}
                        className={`h-11 w-full rounded-xl pr-24 md:h-12 md:pr-28 ${getBgColor('muted')} border-2 ${getBorderColor()} focus:border-[#f07e1a] focus-visible:ring-0 dark:focus:border-[#f07e1a]`}
                    />
                    <Button
                        type='submit'
                        className='absolute top-1/2 right-1.5 flex h-9 -translate-y-1/2 cursor-pointer items-center gap-2 rounded-lg bg-[#f07e1a] px-4 font-extrabold text-white hover:bg-[#f07e1ab9] md:h-10'>
                        <Search size={18} />
                        <span className='hidden sm:inline'>{t('search')}</span>
                    </Button>

                    {/* Search Dropdown */}
                    {showSearchDropdown && (
                        <SearchDropdown
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onClose={() => setShowSearchDropdown(false)}
                        />
                    )}
                </form>

                {/* O'ng qism - ACTIONS */}
                <div className='flex items-center gap-3 max-md:hidden md:gap-5'>
                    <NavIcon
                        icon={<ShoppingCart size={22} />}
                        label={t('cart')}
                        badge={cartCount > 0 ? cartCount.toString() : undefined}
                        href='/cart'
                    />

                    <div className='relative'>
                        {wishlistCount > 0 && (
                            <span className='absolute -top-2 right-7 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#f07e1a] text-[14px]'>
                                {wishlistCount}
                            </span>
                        )}
                        <NavIcon icon={<BookOpen size={22} />} label={t('myBooks')} href={myBooksHref} />
                    </div>

                    {isAuthenticated && user ? (
                        <UserDropdown
                            user={user}
                            onLogout={handleLogout}
                            initials={getUserInitials(user)}
                            firstName={getUserFirstName(user)}
                            isDark={isDark}
                        />
                    ) : (
                        <NavIcon
                            icon={<User size={22} />}
                            label={t('profile')}
                            primary
                            href='/auth/login'
                            onClick={handleLoginClick}
                        />
                    )}
                </div>
            </div>

            {/* BOTTOM NAV - 10 ta link bilan */}
            <NavbarFooter />
        </header>
    );
};
