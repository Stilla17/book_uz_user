'use client';

import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Phone, ShieldCheck, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { IMaskInput } from 'react-imask';

const OTP_LENGTH = 4;

const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');

    if (digits.startsWith('998')) return `+${digits}`;
    if (digits.length === 9) return `+998${digits}`;
    if (value.trim().startsWith('+')) return `+${digits}`;

    return value.trim();
};

const isValidUzPhone = (value: string) => /^\+998\d{9}$/.test(value);

export default function LoginPage() {
    const { sendPhoneOtp, verifyPhoneOtp, isLoading } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);

    const getErrorMessage = (error: any, fallback: string) =>
        error?.response?.data?.message || error?.message || fallback;

    const requestOtp = async () => {
        if (name.trim().length < 2) {
            toast.error("Ism familya kamida 2 ta belgidan iborat bo'lishi kerak");
            return;
        }

        if (!isValidUzPhone(normalizedPhone)) {
            toast.error("Telefon raqamni to'liq kiriting");
            return;
        }

        try {
            await sendPhoneOtp({ name: name.trim(), phone: normalizedPhone });
            setOtpSent(true);
            toast.success('Tasdiqlash kodi telefon raqamga yuborildi');
        } catch (error: any) {
            toast.error(getErrorMessage(error, 'Telefon raqamga kod yuborishda xatolik yuz berdi'));
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        await requestOtp();
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.trim().length !== OTP_LENGTH) {
            toast.error(`${OTP_LENGTH} xonali tasdiqlash kodini kiriting`);
            return;
        }

        try {
            await verifyPhoneOtp({ phone: normalizedPhone, otp: otp.trim() });
            toast.success('Xush kelibsiz!');
            const redirect = new URLSearchParams(window.location.search).get('redirect');
            router.push(redirect || '/');
            router.refresh();
        } catch (error: any) {
            toast.error(getErrorMessage(error, "Tasdiqlash kodi noto'g'ri yoki muddati tugagan"));
        }
    };

    return (
        <div className='flex min-h-screen items-center justify-center px-4 py-12 dark:bg-slate-900'>
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/5' />
                <div className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl dark:bg-orange-600/5' />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='relative z-10 w-full max-w-md rounded-[32px] border border-gray-100 bg-white/85 p-8 shadow-2xl backdrop-blur-xl md:p-10 dark:border-slate-700 dark:bg-slate-800/85 dark:shadow-blue-900/20'>
                <div className='mb-6 flex justify-center'>
                    <div className='relative h-16 w-16'>
                        <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 opacity-20 blur-xl' />
                        <div className='relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 shadow-lg'>
                            <span className='text-2xl font-black text-white'>B</span>
                        </div>
                    </div>
                </div>

                <div className='mb-8 text-center'>
                    <h1 className='text-3xl font-black text-gray-900 md:text-4xl dark:text-white'>Tizimga kirish</h1>
                    <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                        {otpSent
                            ? `${normalizedPhone} raqamiga yuborilgan kodni kiriting`
                            : 'Ism familya va telefon raqam orqali kiring'}
                    </p>
                </div>

                {!otpSent ? (
                    <form onSubmit={handleSendOtp} className='space-y-5'>
                        <div className='space-y-2'>
                            <label className='ml-1 text-sm font-bold text-gray-600 dark:text-gray-400'>
                                Ism familya
                            </label>
                            <div className='group relative'>
                                <User
                                    className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400'
                                    size={18}
                                />
                                <input
                                    required
                                    type='text'
                                    placeholder='Ism familyangiz'
                                    className='w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-4 pl-12 text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='ml-1 text-sm font-bold text-gray-600 dark:text-gray-400'>
                                Telefon raqam
                            </label>
                            <div className='group relative'>
                                <Phone
                                    className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400'
                                    size={18}
                                />
                                <IMaskInput
                                    required
                                    mask='+998 00 000 00 00'
                                    inputMode='tel'
                                    placeholder='+998 90 123 45 67'
                                    className='w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-4 pl-12 text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400'
                                    value={phone}
                                    onAccept={(value) => setPhone(String(value))}
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-orange-500 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-blue-600/30'>
                            {isLoading ? (
                                <Loader2 className='animate-spin' size={22} />
                            ) : (
                                <>
                                    Kod yuborish <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className='space-y-5'>
                        <div className='space-y-2'>
                            <label className='ml-1 text-sm font-bold text-gray-600 dark:text-gray-400'>
                                Tasdiqlash kodi
                            </label>
                            <div className='group relative'>
                                <ShieldCheck
                                    className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400'
                                    size={18}
                                />
                                <input
                                    required
                                    type='text'
                                    inputMode='numeric'
                                    maxLength={OTP_LENGTH}
                                    placeholder='1234'
                                    className='w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-4 pl-12 text-center text-lg font-bold text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400'
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-orange-500 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-blue-600/30'>
                            {isLoading ? (
                                <Loader2 className='animate-spin' size={22} />
                            ) : (
                                <>
                                    Kirish <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        <div className='flex items-center justify-between gap-3 px-1 text-sm'>
                            <button
                                type='button'
                                onClick={() => {
                                    setOtpSent(false);
                                    setOtp('');
                                }}
                                className='flex items-center gap-1 font-semibold text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
                                <ArrowLeft size={16} />
                                Raqamni o'zgartirish
                            </button>
                            <button
                                type='button'
                                disabled={isLoading}
                                onClick={requestOtp}
                                className='font-semibold text-orange-500 transition-colors hover:text-orange-600 disabled:opacity-60 dark:text-orange-400 dark:hover:text-orange-300'>
                                Kodni qayta yuborish
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
