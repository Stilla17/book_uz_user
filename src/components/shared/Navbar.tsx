'use client';

import React, { type FormEvent, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SearchDropdown } from '@/components/search/SearchDropdown';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { usePublicCategoriesQuery } from '@/hooks/queries/usePublicCategoriesQuery';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { getCatalogCategoryHref, getCatalogSubgenreHref } from '@/lib/catalog-links';
import { getLocalizedCategoryName, getLocalizedTitle, getUserFirstName, getUserInitials } from '@/lib/navbar-utils';
import { UserService, api } from '@/services/api';
import { setCart } from '@/store/features/cartSlice';
import { setWishlist } from '@/store/features/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getCartFromLocalStotage } from '@/utils/cartStorage';
import { getWishlistFromLocalStorage } from '@/utils/wishlistStorage';

import NavbarMobile from '../mobile/NavbarMobile';
import NavIcon from './NavIcon';
import NavbarFooter from './NavbarFooter';
import NavbarHeader from './NavbarHeader';
import UserDropdown from './UserDropdown';
import { BookOpen, ChevronDown, Grid3x3, Menu, ShoppingCart, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Kategoriya interfeysi
export const Navbar = () => {
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    const { user, isAuthenticated, logout } = useAuth();
    const { isDark, getBgColor, getTextColor, getBorderColor } = useThemeStyles();

    const { t, i18n } = useTranslation();
    const { data: categories = [] } = usePublicCategoriesQuery();
    const myBooksHref = '/my-books';
    const activeCategory = categories.find((category) => category._id === activeCategoryId) ?? categories[0];
    const activeSubgenres = activeCategory?.subgenres?.length
        ? activeCategory.subgenres
        : activeCategory?.subCategories || [];

    const countCartItems = useAppSelector(
        (state) => state.cart.items.length
        // state.cart.items.reduce((total, item) => total + item.quantity, 0)
    );
    const countWishlistItems = useAppSelector((state) => state.wishlist.items.length);
    const cartDisplayCount = countCartItems;
    const wishlistDisplayCount = countWishlistItems;

    // Savatdagi mahsulotlar sonini olish
    useEffect(() => {
        if (isAuthenticated) {
            loadCartCount();
            loadWishlistCount();
        } else {
            const guestCart = getCartFromLocalStotage();
            const totalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
            const guestWishlist = getWishlistFromLocalStorage();

            dispatch(setCart(guestCart));
            dispatch(setWishlist(guestWishlist));
            setCartCount(totalItems);
            setWishlistCount(guestWishlist.length);
        }
    }, [dispatch, isAuthenticated]);

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

    const loadWishlistCount = async () => {
        try {
            const response = await UserService.getWishlist();
            const wishlist = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];

            dispatch(setWishlist(wishlist));
            setWishlistCount(wishlist.length);
        } catch (error) {
            console.error("Wishlist ma'lumotlarini olishda xatolik:", error);
            setWishlistCount(0);
        }
    };

    const handleLoginClick = () => {
        router.push('/auth/login');
    };

    const handleLogout = async () => {
        await logout();
        setCartCount(0);
        setWishlistCount(0);
        dispatch(setCart([]));
        dispatch(setWishlist([]));
        router.push('/');
    };

    const submitSearch = (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        const query = searchQuery.trim();
        if (!query) return;

        setShowSearchDropdown(false);
        router.push(`/catalog?search=${encodeURIComponent(query)}`);
    };

    return (
        <header className={`sticky top-0 z-50 w-full ${getBgColor('card')} border-b backdrop-blur ${getBorderColor()}`}>
            {/* Nav Header */}
            <NavbarHeader />

            {/* MAIN ROW */}
            <div
                className={`container mx-auto flex h-16 items-center justify-between gap-2 px-3 sm:px-4 md:h-20 md:gap-4 ${getBgColor('card')}`}>
                {/* Chap qism - Logo va Katalog */}
                <div className='flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start md:gap-4'>
                    {/* Mobile burger */}
                    <NavbarMobile
                        cartCount={cartDisplayCount}
                        isAuthenticated={isAuthenticated}
                        userFirstName={getUserFirstName(user)}
                    />

                    {/* LOGO */}
                    <Link href='/' className='group hidden items-center gap-2 sm:flex'>
                        <Image src='/images/Logo.png' alt='Logo' width={80} height={80} />
                    </Link>

                    <Link href='/' className='group flex items-center gap-2 sm:hidden'>
                        <Image src='/images/Logo.png' alt='Logo' width={58} height={58} />
                    </Link>
                </div>

                {/* O'rta qism - SEARCH */}
                <form className='relative mx-auto max-w-2xl flex-1 max-sm:hidden' onSubmit={submitSearch}>
                    <div className='absolute top-1/2 left-1.5 z-20 hidden -translate-y-1/2 items-center lg:flex'>
                        <DropdownMenu open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    className='h-9 rounded-xl px-3 text-sm font-extrabold text-slate-700 hover:bg-slate-100 hover:text-[#f07e1a] md:h-10 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-orange-400'>
                                    <Menu size={16} />
                                    <span>{t('catalog')}</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`}
                                    />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align='start'
                                className={`mt-2 w-[min(860px,calc(100vw-48px))] overflow-hidden p-0 ${getBgColor('card')} border ${getBorderColor()} rounded-2xl shadow-2xl`}>
                                <div>
                                    <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 dark:border-slate-800'>
                                        <h3
                                            className={`font-black ${getTextColor()} flex items-center gap-2 text-base`}>
                                            <span className='flex size-8 items-center justify-center rounded-lg bg-[#00a0e3]/10 text-[#00a0e3] dark:bg-blue-400/10 dark:text-blue-400'>
                                                <Grid3x3 size={17} />
                                            </span>
                                            {t('catalog')}
                                        </h3>
                                        <Link
                                            href='/catalog'
                                            onClick={() => setIsCatalogOpen(false)}
                                            className='flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-[#00a0e3] transition-colors hover:bg-[#00a0e3]/10 hover:text-[#FF8A00] dark:text-blue-400 dark:hover:bg-blue-400/10 dark:hover:text-orange-400'>
                                            {t('allView')}
                                            <ChevronDown size={13} className='rotate-270' />
                                        </Link>
                                    </div>

                                    <div className='grid max-h-[62vh] grid-cols-[260px_minmax(0,1fr)] overflow-hidden'>
                                        <div className='max-h-[62vh] overflow-y-auto border-r border-slate-200 bg-slate-50/70 p-2 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin] dark:border-slate-800 dark:bg-slate-950/40 dark:[scrollbar-color:#334155_transparent]'>
                                            {categories.map((category) => {
                                                const isActive = activeCategory?._id === category._id;
                                                const subgenres = category.subgenres?.length
                                                    ? category.subgenres
                                                    : category.subCategories || [];

                                                return (
                                                    <Link
                                                        key={category._id}
                                                        href={getCatalogCategoryHref(category)}
                                                        onMouseEnter={() => setActiveCategoryId(category._id)}
                                                        onFocus={() => setActiveCategoryId(category._id)}
                                                        onClick={() => setIsCatalogOpen(false)}
                                                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-black transition-colors ${
                                                            isActive
                                                                ? 'bg-white text-[#f07e1a] shadow-sm ring-1 ring-orange-100 dark:bg-slate-900 dark:text-orange-400 dark:ring-slate-800'
                                                                : 'text-slate-700 hover:bg-white hover:text-[#f07e1a] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-orange-400'
                                                        }`}>
                                                        <span className='min-w-0 truncate'>
                                                            {getLocalizedCategoryName(category, i18n.language)}
                                                        </span>
                                                        {subgenres.length > 0 && (
                                                            <span className='shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400'>
                                                                {subgenres.length}
                                                            </span>
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                        <div className='min-h-[360px] overflow-y-auto p-4'>

                                            {activeCategory ? (
                                                <>
                                                    <div className='mb-4 flex items-start justify-between gap-4'>
                                                        <div className='min-w-0'>
                                                            <Link
                                                                href={getCatalogCategoryHref(activeCategory)}
                                                                onClick={() => setIsCatalogOpen(false)}
                                                                className={`block text-xl leading-tight font-black ${getTextColor()} transition-colors hover:text-[#f07e1a] dark:hover:text-orange-400`}>
                                                                {getLocalizedCategoryName(
                                                                    activeCategory,
                                                                    i18n.language
                                                                )}
                                                            </Link>
                                                            <p className='mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                                                                {activeSubgenres.length
                                                                    ? `${activeSubgenres.length} ta bo'lim`
                                                                    : "Bu janrda bo'limlar hali yo'q"}
                                                            </p>
                                                        </div>
                                                       
                                                    </div>

                                                    {activeSubgenres.length > 0 ? (
                                                        <div className='grid grid-cols-2 gap-2 xl:grid-cols-3'>
                                                            {activeSubgenres.map((sub, index) => (
                                                                <Link
                                                                    key={sub._id ?? sub.slug ?? index}
                                                                    href={getCatalogSubgenreHref(activeCategory, sub)}
                                                                    onClick={() => setIsCatalogOpen(false)}
                                                                    className='group rounded-xl border border-slate-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-[#00a0e3]/30 hover:bg-[#00a0e3]/5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-400/30 dark:hover:bg-blue-400/10'>
                                                                    <span className='block text-sm leading-snug font-black text-slate-800 group-hover:text-[#f07e1a] dark:text-slate-100 dark:group-hover:text-orange-400'>
                                                                        {getLocalizedTitle(sub.title, i18n.language) ||
                                                                            sub.name ||
                                                                            sub.slug}
                                                                    </span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className='grid min-h-40 place-items-center rounded-2xl border border-dashed border-slate-200 text-sm font-semibold text-slate-400 dark:border-slate-800 dark:text-slate-500'>
                                                            Bo'limlar mavjud emas
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className='grid min-h-[360px] place-items-center text-sm font-semibold text-slate-400 dark:text-slate-500'>
                                                    Janr tanlang
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <span className='mx-1 h-7 w-px bg-slate-300 dark:bg-slate-700' />
                    </div>
                    <Input
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchDropdown(e.target.value.trim().length >= 2);
                        }}
                        onFocus={() => setShowSearchDropdown(searchQuery.trim().length >= 2)}
                        className={`h-11 w-full rounded-2xl pr-24 pl-4 md:h-12 md:pr-28 lg:pl-48 ${getBgColor('muted')} border ${getBorderColor()} shadow-sm focus:border-[#f07e1a] focus-visible:ring-0 dark:focus:border-[#f07e1a]`}
                    />

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
                    <div className='relative'>
                        {cartDisplayCount > 0 && (
                            <span className='absolute -top-1 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#f07e1a] text-[14px] text-white'>
                                {cartDisplayCount}
                            </span>
                        )}
                        <NavIcon icon={<ShoppingCart size={22} />} label={t('cart')} href='/cart' />
                    </div>

                    <div className='relative'>
                        {wishlistDisplayCount > 0 && (
                            <span className='absolute -top-1 right-7 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#f07e1a] text-[14px] text-white'>
                                {wishlistDisplayCount}
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
            <div className='hidden md:block'>
                <NavbarFooter />
            </div>
        </header>
    );
};
