'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
    ArrowRight,
    BarChart3,
    BookOpen,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
    UserRound
} from 'lucide-react';

const previewBooks = [
    'from-[#244765] to-[#112536]',
    'from-[#ef6962] to-[#b83f3e]',
    'from-[#7c6dc8] to-[#51449b]',
    'from-[#58ad82] to-[#2d7257]'
];

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className='min-h-screen bg-[#d8ccbd] p-3 text-[#2f2a25] md:p-5 dark:bg-slate-950 dark:text-white'>
            <section className='mx-auto grid min-h-[calc(100vh-24px)] max-w-6xl overflow-hidden rounded-[28px] bg-[#f7f0e6] shadow-[0_24px_80px_rgba(64,45,30,0.18)] md:min-h-[calc(100vh-40px)] lg:grid-cols-[minmax(0,1fr)_430px] dark:bg-slate-900'>
                <div className='relative hidden overflow-hidden bg-[#fff8ee] p-8 ring-1 ring-[#eadfce] lg:block dark:bg-slate-950 dark:ring-slate-800'>
                    <div className='flex items-center justify-between'>
                        <Link href='/' className='flex items-center gap-3'>
                            <span className='grid size-12 place-items-center rounded-2xl bg-white text-xl font-black text-[#ef7f1a] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                                B
                            </span>
                            <span>
                                <span className='block text-lg font-black'>BookUz Admin</span>
                                <span className='text-xs font-bold text-[#9d907e] dark:text-slate-500'>
                                    Boshqaruv paneli
                                </span>
                            </span>
                        </Link>

                        <span className='inline-flex h-10 items-center gap-2 rounded-full bg-[#f2e7d8] px-4 text-xs font-black text-[#6f6255] dark:bg-slate-800 dark:text-slate-300'>
                            <ShieldCheck size={16} />
                            Secure
                        </span>
                    </div>

                    <div className='mt-16 max-w-xl'>
                        <p className='inline-flex h-9 items-center gap-2 rounded-full bg-[#eee3d4] px-4 text-xs font-black text-[#8b7e70] dark:bg-slate-800 dark:text-slate-300'>
                            <Sparkles size={15} />
                            Admin access
                        </p>
                        <h1 className='mt-5 text-5xl leading-tight font-black text-[#2f2a25] dark:text-white'>
                            Kutubxonani bir joydan boshqaring
                        </h1>
                        <p className='mt-5 max-w-md text-sm leading-7 font-bold text-[#8b7e70] dark:text-slate-400'>
                            Kitoblar, buyurtmalar, foydalanuvchilar va nashriyotlar bo'yicha tezkor nazorat uchun maxsus
                            admin kirish oynasi.
                        </p>
                    </div>
                </div>

                <div className='flex items-center justify-center p-5 md:p-8'>
                    <div className='w-full max-w-md'>
                        <div className='mb-8 text-center lg:hidden'>
                            <div className='mx-auto grid size-14 place-items-center rounded-2xl bg-white text-xl font-black text-[#ef7f1a] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                                B
                            </div>
                            <h1 className='mt-4 text-3xl font-black'>BookUz Admin</h1>
                        </div>

                        <div className='rounded-[28px] bg-[#fffaf2] p-6 shadow-sm ring-1 ring-[#eadfce] md:p-8 dark:bg-slate-950 dark:ring-slate-800'>
                            <div className='mb-7'>
                                <p className='text-sm font-bold text-[#9d907e] dark:text-slate-500'>Xush kelibsiz</p>
                                <h2 className='mt-2 text-3xl font-black text-[#2f2a25] dark:text-white'>Admin login</h2>
                                <p className='mt-2 text-sm leading-6 font-bold text-[#8b7e70] dark:text-slate-400'>
                                    Panelga kirish uchun admin ma'lumotlaringizni kiriting.
                                </p>
                            </div>

                            <form className='space-y-5'>
                                <div className='space-y-2'>
                                    <label
                                        htmlFor='admin-email'
                                        className='ml-1 text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Email
                                    </label>
                                    <div className='flex h-13 items-center gap-3 rounded-2xl bg-[#f2e7d8] px-4 ring-1 ring-transparent transition focus-within:ring-[#ef7f1a] dark:bg-slate-900'>
                                        <Mail size={18} className='text-[#9d907e]' />
                                        <input
                                            id='admin-email'
                                            type='email'
                                            placeholder='admin@book.uz'
                                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[#b4a592] dark:placeholder:text-slate-600'
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <label
                                        htmlFor='admin-password'
                                        className='ml-1 text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Parol
                                    </label>
                                    <div className='flex h-13 items-center gap-3 rounded-2xl bg-[#f2e7d8] px-4 ring-1 ring-transparent transition focus-within:ring-[#ef7f1a] dark:bg-slate-900'>
                                        <LockKeyhole size={18} className='text-[#9d907e]' />
                                        <input
                                            id='admin-password'
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Parolingiz'
                                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[#b4a592] dark:placeholder:text-slate-600'
                                        />
                                        <button
                                            type='button'
                                            aria-label={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                                            onClick={() => setShowPassword((value) => !value)}
                                            className='grid size-8 place-items-center rounded-xl text-[#8b7e70] transition hover:bg-white dark:text-slate-400 dark:hover:bg-slate-800'>
                                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                        </button>
                                    </div>
                                </div>

                                <div className='flex items-center justify-between gap-3 text-sm'>
                                    <label className='flex items-center gap-2 font-bold text-[#8b7e70] dark:text-slate-400'>
                                        <input
                                            type='checkbox'
                                            className='size-4 rounded border-[#d8ccbd] accent-[#ef7f1a]'
                                        />
                                        Eslab qolish
                                    </label>
                                    <button type='button' className='font-black text-[#ef7f1a]'>
                                        Parolni unutdingizmi?
                                    </button>
                                </div>

                                <button
                                    type='button'
                                    className='flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] text-sm font-black text-white shadow-[0_16px_34px_rgba(239,127,26,0.28)] transition hover:bg-[#df7014]'>
                                    <UserRound size={18} />
                                    Kirish
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>

                        <p className='mt-5 text-center text-xs font-bold text-[#9d907e] dark:text-slate-500'>
                            Faqat administratorlar uchun yopiq kirish oynasi.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
