'use client';

import React, { type FormEvent, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import MobileAction from '@/components/shared/MobileAction';
import NavbarControls from '@/components/shared/NavbarControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { bottomNav, serviceMenuItems } from '@/data/navMenu';
import { useThemeStyles } from '@/hooks/useThemeStyles';

import { BookOpen, Grid3x3, Menu, Phone, Search, ShoppingCart, User, UserCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type NavbarMobileProps = {
    cartCount: number;
    isAuthenticated: boolean;
    userFirstName: string;
};

const NavbarMobile = ({ cartCount, isAuthenticated, userFirstName }: NavbarMobileProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { getBgColor, getTextColor, getBorderColor } = useThemeStyles();
    const { t } = useTranslation();
    const myBooksHref = '/my-books';

    const submitSearch = (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        const query = searchQuery.trim();
        if (!query) return;

        setMobileOpen(false);
        router.push(`/catalog?search=${encodeURIComponent(query)}`);
    };
    return (
        <div>
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
                            <NavbarControls variant='mobile' onLanguageSelect={() => setMobileOpen(false)} />

                            <form className='relative' onSubmit={submitSearch}>
                                <Input
                                    placeholder={t('searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    className={`h-12 rounded-2xl pr-12 ${getBgColor('muted')} border-2 ${getBorderColor()}`}
                                />
                                <button
                                    type='submit'
                                    className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 dark:text-slate-400'
                                    aria-label={t('search')}>
                                    <Search size={18} />
                                </button>
                            </form>

                            <div className='grid grid-cols-2 gap-3'>
                                <MobileAction
                                    href='/cart'
                                    icon={<ShoppingCart size={18} />}
                                    label={t('cart')}
                                    badge={cartCount > 0 ? cartCount.toString() : undefined}
                                    onClick={() => setMobileOpen(false)}
                                />
                                <MobileAction
                                    href={myBooksHref}
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
                                {isAuthenticated ? (
                                    <MobileAction
                                        href='/profile'
                                        icon={<UserCircle size={18} />}
                                        label={userFirstName}
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
                                            <span className={item.color ?? ''}>{item.icon}</span>
                                            <span className={`text-whitefont-bold text-xs ${getTextColor()}`}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Xizmatlar bo'limi (Mobile) */}
                            <div className='space-y-2'>
                                <div className={`text-sm font-extrabold ${getTextColor()}`}>{t('services')}</div>
                                <div className='grid grid-cols-2 gap-2'>
                                    {serviceMenuItems.slice(0, 6).map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex flex-col items-center gap-1 p-2 ${getBgColor('card')} border ${getBorderColor()} rounded-lg transition-colors hover:border-[#005CB9] dark:hover:border-blue-400`}>
                                            <div className='text-[#005CB9] dark:text-blue-400'>{item.icon}</div>
                                            <span className={`text-center text-[10px] font-bold ${getTextColor()}`}>
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
                                    <div className={`text-sm font-extrabold ${getTextColor()}`}>{t('catalog')}</div>
                                    <Link
                                        href='/catalog'
                                        onClick={() => setMobileOpen(false)}
                                        className={`text-xs font-bold text-[#005CB9] hover:underline dark:text-blue-400`}>
                                        Barchasi
                                    </Link>
                                </div>
                                {/* <div className='grid grid-cols-2 gap-2'>
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
                                                        {category.subCategories?.map((sub, index) => (
                                                            <p
                                                                key={index}
                                                                className={`text-[10px] text-gray-400 dark:text-slate-500`}>
                                                                {getLocalizedTitle(sub.title)}
                                                            </p>
                                                        ))}
                                                        <p className='text-[8px] text-gray-400 dark:text-slate-500'>
                                                            {category.bookCount ?? 0} ta
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div> */}
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
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default NavbarMobile;
