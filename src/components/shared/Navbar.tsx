'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SearchDropdown } from '@/components/search/SearchDropdown';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { bottomNav, serviceMenuItems } from '@/data/navMenu';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { api } from '@/services/api';
import { categoryService } from '@/services/category.service';
import { User as UserType } from '@/types';
import { Category } from '@/types/category.types';

import NavbarControls from './NavbarControls';
import NavbarFooter from './NavbarFooter';
import NavbarHeader from './NavbarHeader';
import {
    BookOpen,
    ChevronDown,
    Grid3x3,
    Heart,
    Info,
    Library,
    LogOut,
    Menu,
    Phone,
    Search,
    Settings,
    ShoppingCart,
    User,
    UserCircle,
    X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Kategoriya interfeysi
export const Navbar = () => {
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [loadingCart, setLoadingCart] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const { isDark, getBgColor, getTextColor, getBorderColor } = useThemeStyles();

    const { t, i18n } = useTranslation();

    // Savatdagi mahsulotlar sonini olish
    useEffect(() => {
        if (isAuthenticated) {
            loadCartCount();
        } else {
            setCartCount(0);
        }
    }, [isAuthenticated]);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            // Use categoryService to get public categories and filter active ones
            const response = await categoryService.getAllCategoriesPublic();
            // console.log("Kategoriyalar yuklandi:", response);
            setCategories(response);
        } catch (error) {
            console.error('Kategoriyalar yuklanmadi:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Kategoriyalarni yuklash
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCartCount = async () => {
        try {
            setLoadingCart(true);
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
        } finally {
            setLoadingCart(false);
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

    const getUserInitials = (): string => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getUserFirstName = (): string => {
        if (!user?.name) return 'Profil';
        return user.name.split(' ')[0] || 'Profil';
    };

    const currentLanguage = i18n.language?.split('-')[0] as keyof Category['name'];

    const getLocalizedCategoryName = (category: Category) => {
        return category.name[currentLanguage] || category.name.uz;
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
                    <div className='lg:hidden'>
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant='outline'
                                    className={`h-11 w-11 rounded-xl border p-0 ${getBorderColor()} ${getBgColor('card')}`}
                                    aria-label='Open menu'>
                                    <Menu size={20} className={getTextColor()} />
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side='left'
                                showCloseButton={false}
                                className={`w-[88vw] p-0 sm:w-105 ${getBgColor('card')}`}>
                                <SheetTitle className='sr-only'>Mobil menyu</SheetTitle>
                                <SheetDescription className='sr-only'>
                                    Sayt bo‘limlari, katalog, qidiruv va sozlamalar.
                                </SheetDescription>

                                <div className={`border-b p-5 ${getBorderColor()} flex items-center justify-between`}>
                                    <Link href='/' className='group flex min-w-fit flex-col items-center gap-1 pt-2'>
                                        <div className='mt-1 flex items-center text-xl leading-none font-black tracking-tighter md:text-2xl'>
                                            <img src='/images/Logo.svg' alt='Logo' />
                                        </div>
                                    </Link>

                                    <SheetClose asChild>
                                        <Button variant='ghost' className='h-10 w-10 rounded-xl p-0'>
                                            <X size={18} className={getTextColor()} />
                                        </Button>
                                    </SheetClose>
                                </div>

                                <div className='max-h-[calc(100vh-120px)] space-y-5 overflow-y-auto p-5'>
                                    <div className='relative'>
                                        <Input
                                            placeholder={t('searchPlaceholder')}
                                            className={`h-12 rounded-2xl pr-12 ${getBgColor('muted')} border-2 ${getBorderColor()}`}
                                        />
                                        <button className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 dark:text-slate-400'>
                                            <Search size={18} />
                                        </button>
                                    </div>

                                    <div className='grid grid-cols-2 gap-3'>
                                        <MobileAction
                                            href='/cart'
                                            icon={<ShoppingCart size={18} />}
                                            label={t('cart')}
                                            badge={cartCount > 0 ? cartCount.toString() : undefined}
                                            onClick={() => setMobileOpen(false)}
                                        />
                                        <MobileAction
                                            href='/my-books'
                                            icon={<BookOpen size={18} />}
                                            label={t('myBooks')}
                                            onClick={() => setMobileOpen(false)}
                                        />
                                        <MobileAction
                                            href='/catalog'
                                            icon={<Grid3x3 size={18} />}
                                            label={t('catalog')}
                                            onClick={() => setMobileOpen(false)}
                                        />
                                        {isAuthenticated && user ? (
                                            <MobileAction
                                                href='/profile'
                                                icon={<UserCircle size={18} />}
                                                label={getUserFirstName()}
                                                primary
                                                onClick={() => setMobileOpen(false)}
                                            />
                                        ) : (
                                            <MobileAction
                                                href='/auth/login'
                                                icon={<User size={18} />}
                                                label={t('profile')}
                                                primary
                                                onClick={() => setMobileOpen(false)}
                                            />
                                        )}
                                    </div>

                                    {/* Bottom Navigation (Mobile) */}
                                    <div className='space-y-2'>
                                        <div className={`text-sm font-extrabold ${getTextColor()}`}>Bo‘limlar</div>
                                        <div className='grid grid-cols-2 gap-2'>
                                            {bottomNav.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center gap-2 rounded-xl border p-3 ${getBorderColor()} transition-all hover:border-[#005CB9] dark:hover:border-blue-400 ${
                                                        item.highlight ? 'bg-[#FF8A00]/10' : getBgColor('card')
                                                    }`}>
                                                    <span className={item.color}>{item.icon}</span>
                                                    <span className={`text-whitefont-bold text-xs ${getTextColor()}`}>
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Xizmatlar bo'limi (Mobile) */}
                                    <div className='space-y-2'>
                                        <div className={`text-sm font-extrabold ${getTextColor()}`}>
                                            {t('services')}
                                        </div>
                                        <div className='grid grid-cols-2 gap-2'>
                                            {serviceMenuItems.slice(0, 6).map((item, index) => (
                                                <Link
                                                    key={index}
                                                    href={item.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex flex-col items-center gap-1 p-2 ${getBgColor('card')} border ${getBorderColor()} rounded-lg transition-colors hover:border-[#005CB9] dark:hover:border-blue-400`}>
                                                    <div className='text-[#005CB9] dark:text-blue-400'>{item.icon}</div>
                                                    <span
                                                        className={`text-center text-[10px] font-bold ${getTextColor()}`}>
                                                        {t(item.label)}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                        <Link
                                            href='/services'
                                            onClick={() => setMobileOpen(false)}
                                            className={`mt-2 block text-center text-xs font-bold text-[#005CB9] hover:underline dark:text-blue-400`}>
                                            {t('servicesAll')} →
                                        </Link>
                                    </div>

                                    {/* Mobile kategoriyalar */}
                                    <div className='space-y-2'>
                                        <div className='flex items-center justify-between'>
                                            <div className={`text-sm font-extrabold ${getTextColor()}`}>
                                                {t('catalog')}
                                            </div>
                                            <Link
                                                href='/catalog'
                                                onClick={() => setMobileOpen(false)}
                                                className={`text-xs font-bold text-[#005CB9] hover:underline dark:text-blue-400`}>
                                                Barchasi
                                            </Link>
                                        </div>
                                        <div className='grid grid-cols-2 gap-2'>
                                            {categories.map((category) => (
                                                <Link
                                                    key={category._id}
                                                    href={`/category/${category.slug}`}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center gap-2 p-2 ${getBgColor('card')} border ${getBorderColor()} rounded-lg transition-colors hover:border-[#005CB9] dark:hover:border-blue-400`}>
                                                    <div className='flex-1'>
                                                        <p className={`text-xs font-bold`}>
                                                            {getLocalizedCategoryName(category)}
                                                        </p>
                                                        <p className='text-[8px] text-gray-400 dark:text-slate-500'>
                                                            {category.bookCount ?? 0} ta
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <a
                                        href='tel:+998901234567'
                                        className={`flex items-center justify-between rounded-2xl border ${getBorderColor()} ${getBgColor('muted')} p-4`}>
                                        <div className='text-sm'>
                                            <div className={`font-extrabold ${getTextColor()}`}>Aloqa</div>
                                            <div className={`${getTextColor('muted')}`}>+998 (90) 123-45-67</div>
                                        </div>
                                        <Phone size={18} className='text-[#005CB9] dark:text-blue-400' />
                                    </a>

                                    <NavbarControls variant='mobile' onLanguageSelect={() => setMobileOpen(false)} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

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
                                                className={`group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-[#005CB9]/20 hover:bg-[#005CB9]/5 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10`}>
                                                <div className='flex-1'>
                                                    <p
                                                        className={`text-sm font-bold ${getTextColor()} group-hover:text-[#005CB9] dark:group-hover:text-blue-400`}>
                                                        {getLocalizedCategoryName(category)}
                                                    </p>
                                                    <p className='text-xs text-gray-400 dark:text-slate-500'>
                                                        {category.bookCount ?? 0} ta kitob
                                                    </p>
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
                <div className='relative mx-auto max-w-2xl flex-1 max-sm:hidden'>
                    <Input
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchDropdown(true);
                        }}
                        onFocus={() => setShowSearchDropdown(true)}
                        className={`h-11 w-full rounded-xl pr-24 md:h-12 md:pr-28 ${getBgColor('muted')} border-2 ${getBorderColor()} focus:border-[#f07e1a] focus-visible:ring-0 dark:focus:border-[#f07e1a]`}
                    />
                    <Button
                        onClick={() => {
                            if (searchQuery.trim()) {
                                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                            }
                        }}
                        className='absolute top-1/2 right-1.5 flex h-9 -translate-y-1/2 cursor-pointer items-center gap-2 rounded-lg bg-[#f07e1a] px-4 font-extrabold text-white hover:bg-[#f07e1ab9] md:h-10'>
                        <Search size={18} />
                        <span className='hidden sm:inline'>{t('search')}</span>
                    </Button>

                    {/* Search Dropdown */}
                    <SearchDropdown
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onClose={() => setShowSearchDropdown(false)}
                    />
                </div>

                {/* O'ng qism - ACTIONS */}
                <div className='flex items-center gap-3 max-md:hidden md:gap-5'>
                    <NavIcon
                        icon={<ShoppingCart size={22} />}
                        label={t('cart')}
                        badge={cartCount > 0 ? cartCount.toString() : undefined}
                        href='/cart'
                        isDark={isDark}
                    />

                    <NavIcon icon={<BookOpen size={22} />} label={t('myBooks')} href='/my-books' isDark={isDark} />

                    {isAuthenticated && user ? (
                        <UserDropdown
                            user={user}
                            onLogout={handleLogout}
                            initials={getUserInitials()}
                            firstName={getUserFirstName()}
                            isDark={isDark}
                        />
                    ) : (
                        <NavIcon
                            icon={<User size={22} />}
                            label={t('profile')}
                            primary
                            href='/auth/login'
                            onClick={handleLoginClick}
                            isDark={isDark}
                        />
                    )}
                </div>
            </div>

            {/* BOTTOM NAV - 10 ta link bilan */}
            <NavbarFooter />
        </header>
    );
};

// Desktop NavIcon component
const NavIcon = ({
    icon,
    label,
    badge,
    primary,
    href = '#',
    onClick,
    isDark
}: {
    icon: React.ReactNode;
    label: string;
    badge?: string;
    primary?: boolean;
    href?: string;
    onClick?: () => void;
    isDark: boolean;
}) => (
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

// User Dropdown for authenticated users
const UserDropdown = ({
    user,
    onLogout,
    initials,
    firstName,
    isDark
}: {
    user: UserType;
    onLogout: () => void;
    initials: string;
    firstName: string;
    isDark: boolean;
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className='group flex flex-col items-center gap-1 text-[#005CB9] outline-none dark:text-blue-400'>
                <div className='p-1 transition-transform group-hover:scale-110'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-sm font-bold text-white dark:from-blue-600 dark:to-orange-600'>
                        {initials}
                    </div>
                </div>
                <span className='max-w-17.5 truncate text-[10px] font-extrabold text-slate-600 uppercase dark:text-slate-300'>
                    {firstName}
                </span>
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            align='end'
            className={`w-64 rounded-2xl p-2 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <DropdownMenuLabel
                className={`px-3 py-2 text-xs font-black uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <div className='flex items-center gap-2'>
                    <UserCircle size={16} className={isDark ? 'text-blue-400' : 'text-[#005CB9]'} />
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{user?.name || 'Foydalanuvchi'}</span>
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : 'bg-gray-100'} />

            <DropdownMenuItem
                asChild
                className={`cursor-pointer rounded-xl ${isDark ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-50'}`}>
                <Link href='/profile' className='flex items-center gap-2 py-2'>
                    <UserCircle size={18} className='text-[#005CB9] dark:text-blue-400' />
                    <span>Shaxsiy kabinet</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
                asChild
                className={`cursor-pointer rounded-xl ${isDark ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-50'}`}>
                <Link href='/my-books' className='flex items-center gap-2 py-2'>
                    <Library size={18} className='text-[#005CB9] dark:text-blue-400' />
                    <span>Mening kitoblarim</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
                asChild
                className={`cursor-pointer rounded-xl ${isDark ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-50'}`}>
                <Link href='/wishlist' className='flex items-center gap-2 py-2'>
                    <Heart size={18} className='text-[#FF8A00] dark:text-orange-400' />
                    <span>Sevimlilar</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
                asChild
                className={`cursor-pointer rounded-xl ${isDark ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-50'}`}>
                <Link href='/orders' className='flex items-center gap-2 py-2'>
                    <ShoppingCart size={18} className='text-[#005CB9] dark:text-blue-400' />
                    <span>Buyurtmalarim</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
                asChild
                className={`cursor-pointer rounded-xl ${isDark ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-50'}`}>
                <Link href='/settings' className='flex items-center gap-2 py-2'>
                    <Settings size={18} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <span>Sozlamalar</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : 'bg-gray-100'} />

            <DropdownMenuItem
                onClick={onLogout}
                className={`cursor-pointer rounded-xl text-red-500 focus:text-red-500 ${isDark ? 'focus:bg-red-500/10' : 'focus:bg-red-50'} py-2`}>
                <LogOut size={18} className='mr-2' />
                Chiqish
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

// Mobile quick action card
function MobileAction({
    href,
    icon,
    label,
    badge,
    primary,
    onClick
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    badge?: string;
    primary?: boolean;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`relative flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                primary
                    ? 'border-transparent bg-[#2572c0] text-white dark:bg-blue-200'
                    : 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white'
            }`}>
            <div
                className={`grid h-10 w-10 place-items-center rounded-2xl ${
                    primary ? 'bg-white/15' : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                {icon}
            </div>
            <div className='font-extrabold'>{label}</div>
            {badge && (
                <span className='absolute top-2 right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF8A00] text-[10px] font-black text-white dark:bg-orange-600'>
                    {badge}
                </span>
            )}
        </Link>
    );
}
