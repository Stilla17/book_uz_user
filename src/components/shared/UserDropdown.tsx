'use client';

import Link from 'next/link';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { User as UserType } from '@/types';
import { getImageUrl } from '@/utils/image';

import { Library, LogOut, Settings, ShoppingCart, UserCircle } from 'lucide-react';

type UserDropdownProps = {
    user: UserType;
    onLogout: () => void;
    initials: string;
    firstName: string;
    isDark: boolean;
};

const UserDropdown = ({ user, onLogout, initials, firstName, isDark }: UserDropdownProps) => {
    const avatarUrl = getImageUrl(user.avatar);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='group flex flex-col items-center gap-1 text-[#005CB9] outline-none dark:text-blue-400'>
                    <div className='p-1 transition-transform group-hover:scale-110'>
                        <div className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-sm font-bold text-white dark:from-blue-600 dark:to-orange-600'>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={firstName} className='h-full w-full object-cover' />
                            ) : (
                                initials
                            )}
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
                    <Link href='/profile?tab=settings' className='flex items-center gap-2 py-2'>
                        <UserCircle size={18} className='text-[#005CB9] dark:text-blue-400' />
                        <span>Shaxsiy kabinet</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className={`cursor-pointer rounded-xl ${isDark ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-50'}`}>
                    <Link href='/profile?tab=wishlist' className='flex items-center gap-2 py-2'>
                        <Library size={18} className='text-[#005CB9] dark:text-blue-400' />
                        <span>Mening kitoblarim</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className={`cursor-pointer rounded-xl ${isDark ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-50'}`}>
                    <Link href='/profile?tab=orders' className='flex items-center gap-2 py-2'>
                        <ShoppingCart size={18} className='text-[#005CB9] dark:text-blue-400' />
                        <span>Buyurtmalarim</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    asChild
                    className={`cursor-pointer rounded-xl ${isDark ? 'text-white hover:bg-slate-700' : 'text-gray-900 hover:bg-gray-50'}`}>
                    <Link href='/profile?tab=settings' className='flex items-center gap-2 py-2'>
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
};

export default UserDropdown;
