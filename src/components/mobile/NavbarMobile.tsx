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
            <div className='md:hidden'>
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
                        className={`w-[92vw] max-w-[420px] p-0 sm:w-[420px] ${getBgColor('card')}`}>
                        <SheetTitle className='sr-only'>Mobil menyu</SheetTitle>
                        <SheetDescription className='sr-only'>
                            Sayt bo‘limlari, katalog, qidiruv va sozlamalar.
                        </SheetDescription>

                        <div
                            className={`flex min-h-16 items-center justify-between border-b px-4 py-3 sm:px-5 ${getBorderColor()}`}>
                            <Link
                                href='/'
                                aria-label='Bosh sahifa'
                                onClick={() => setMobileOpen(false)}
                                className='inline-flex items-center'>
                                <img
                                    src='/images/Logo.png'
                                    alt='Book.uz'
                                    className='h-20 w-auto max-w-46 object-cover sm:h-20'
                                />
                            </Link>

                            <SheetClose asChild>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    aria-label='Menyuni yopish'
                                    className='h-10 w-10 shrink-0 rounded-xl p-0'>
                                    <X size={18} className={getTextColor()} />
                                </Button>
                            </SheetClose>
                        </div>

                        <div className='max-h-[calc(100dvh-92px)] space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-5'>
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

                            <div className='grid grid-cols-2 gap-2.5 sm:gap-3'>
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
                            </div>

                            <a
                                href='tel:+998712300050'
                                className={`flex items-center justify-between rounded-2xl border ${getBorderColor()} ${getBgColor('muted')} p-4`}>
                                <div className='text-sm'>
                                    <div className={`font-extrabold ${getTextColor()}`}>Aloqa</div>
                                    <div className={`${getTextColor('muted')}`}>+998(71) 230-00-50</div>
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
