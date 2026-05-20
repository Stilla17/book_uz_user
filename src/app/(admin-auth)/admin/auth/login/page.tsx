'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useLogin } from '@/components/admin/hooks/auth-login';

import logo from '../../../../../../public/images/Logo.svg';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isPending } = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutate({
            email,
            password
        });
    };

    return (
        <main className='flex min-h-screen items-center justify-center bg-[#d8ccbd] p-4 text-[#2f2a25] md:p-6 dark:bg-slate-950 dark:text-white'>
            <section className='w-full max-w-md'>
                <div className='rounded-[28px] bg-[#fffaf2] p-6 shadow-[0_24px_80px_rgba(64,45,30,0.18)] ring-1 ring-[#eadfce] md:p-8 dark:bg-slate-950 dark:ring-slate-800'>
                    <div className='mb-7 text-center'>
                        <Link href='/' className='mx-auto mb-7 flex w-fit flex-col items-center gap-3 text-center'>
                            <Image src={logo} alt='Book uz logo' priority className='h-14 w-auto object-contain' />
                        </Link>
                        <h2 className='mt-2 text-3xl font-black text-[#2f2a25] dark:text-white'>Admin login</h2>
                        <p className='mt-2 text-sm leading-6 font-bold text-[#8b7e70] dark:text-slate-400'>
                            Panelga kirish uchun admin ma'lumotlaringizni kiriting.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div className='space-y-2'>
                            <label
                                htmlFor='admin-email'
                                className='ml-1 text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                Email
                            </label>
                            <div className='flex h-13 items-center gap-3 rounded-2xl bg-[#f2e7d8] px-4 ring-1 ring-transparent transition dark:bg-slate-900'>
                                <Mail size={18} className='text-[#9d907e]' />
                                <input
                                    id='admin-email'
                                    type='email'
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                            <div className='flex h-13 items-center gap-3 rounded-2xl bg-[#f2e7d8] px-4 ring-1 ring-transparent transition dark:bg-slate-900'>
                                <LockKeyhole size={18} className='text-[#9d907e]' />
                                <input
                                    id='admin-password'
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Parolingiz'
                                    className='h-full min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[#b4a592] dark:placeholder:text-slate-600'
                                />
                                <button
                                    type='button'
                                    aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                                    onClick={() => setShowPassword((value) => !value)}
                                    className='grid size-8 place-items-center rounded-xl text-[#8b7e70] transition hover:bg-white dark:text-slate-400 dark:hover:bg-slate-800'>
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={isPending}
                            className='flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] text-sm font-black text-white shadow-[0_16px_34px_rgba(239,127,26,0.28)] transition hover:bg-[#df7014] disabled:cursor-not-allowed disabled:opacity-70'>
                            <UserRound size={18} />
                            {isPending ? 'Loading...' : 'Kirish'}
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
