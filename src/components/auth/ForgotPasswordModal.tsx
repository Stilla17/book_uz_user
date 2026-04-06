// components/auth/ForgotPasswordModal.tsx
'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { AuthServiceAPI } from '@/services/api';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, Key, Loader2, Lock, Mail, Send, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD';

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
    const router = useRouter();

    // State
    const [step, setStep] = useState<Step>('EMAIL');
    const [email, setEmail] = useState('');
    const [method, setMethod] = useState<'EMAIL' | 'TELEGRAM'>('EMAIL');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Timer for resend
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'OTP' && timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer, canResend]);

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    // Step 1: Send OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Email manzilingizni kiriting');
            return;
        }

        try {
            setLoading(true);
            await AuthServiceAPI.forgotPassword(email, method);
            setStep('OTP');
            setTimer(60);
            setCanResend(false);
            toast.success(`Kod ${method === 'EMAIL' ? 'email' : 'telegram'} manzilingizga yuborildi!`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        try {
            setLoading(true);
            await AuthServiceAPI.forgotPassword(email, method);
            setTimer(60);
            setCanResend(false);
            toast.success('Kod qayta yuborildi!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP and go to new password
    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error("6 xonali kodni to'liq kiriting");
            return;
        }

        setStep('NEW_PASSWORD');
    };

    // Step 3: Set new password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Parollar mos kelmadi');
            return;
        }

        try {
            setLoading(true);
            const otpString = otp.join('');
            await AuthServiceAPI.resetPassword(email, otpString, newPassword);

            setSent(true);
            toast.success('Parol muvaffaqiyatli yangilandi!');

            // Close modal after success and redirect to login
            setTimeout(() => {
                onClose();
                setSent(false);
                setStep('EMAIL');
                setEmail('');
                setOtp(['', '', '', '', '', '']);
                setNewPassword('');
                setConfirmPassword('');
                router.push('/auth/login');
            }, 2000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    // Reset modal on close
    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setStep('EMAIL');
            setEmail('');
            setOtp(['', '', '', '', '', '']);
            setNewPassword('');
            setConfirmPassword('');
            setSent(false);
        }, 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm dark:bg-black/70'
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                        <div className='relative w-full max-w-md rounded-[32px] border border-gray-100 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-800 dark:shadow-2xl dark:shadow-blue-900/20'>
                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className='absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700'>
                                <X size={20} className='text-gray-500 dark:text-gray-400' />
                            </button>

                            {/* Success State */}
                            {sent ? (
                                <div className='py-8 text-center'>
                                    <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10'>
                                        <CheckCircle size={40} className='text-green-500' />
                                    </div>
                                    <h3 className='mb-2 text-2xl font-black text-gray-900 dark:text-white'>
                                        Parol yangilandi!
                                    </h3>
                                    <p className='text-gray-500 dark:text-gray-400'>
                                        Endi yangi parolingiz bilan tizimga kirishingiz mumkin.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Step 1: Email Input */}
                                    {step === 'EMAIL' && (
                                        <>
                                            <div className='mb-6 text-center'>
                                                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 dark:bg-orange-600/20'>
                                                    <Mail className='text-orange-500 dark:text-orange-400' size={32} />
                                                </div>
                                                <h3 className='text-2xl font-black text-gray-900 dark:text-white'>
                                                    Parolni tiklash
                                                </h3>
                                                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                                                    Email manzilingizni kiriting, biz sizga 6 xonali kod yuboramiz.
                                                </p>
                                            </div>

                                            <form onSubmit={handleSendOtp} className='space-y-4'>
                                                <div>
                                                    <input
                                                        type='email'
                                                        placeholder='Email manzilingiz'
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className='w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 placeholder-gray-400 transition-all outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-orange-400'
                                                        required
                                                    />
                                                </div>

                                                <div className='flex gap-3'>
                                                    <button
                                                        type='button'
                                                        onClick={() => setMethod('EMAIL')}
                                                        className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                                                            method === 'EMAIL'
                                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-slate-600'
                                                        }`}>
                                                        Email orqali
                                                    </button>
                                                    <button
                                                        type='button'
                                                        onClick={() => setMethod('TELEGRAM')}
                                                        className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                                                            method === 'TELEGRAM'
                                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-slate-600'
                                                        }`}>
                                                        Telegram orqali
                                                    </button>
                                                </div>

                                                <button
                                                    type='submit'
                                                    disabled={loading}
                                                    className='mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-blue-500 py-4 font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-blue-600 disabled:opacity-70'>
                                                    {loading ? (
                                                        <Loader2 size={20} className='animate-spin' />
                                                    ) : (
                                                        <>
                                                            <Send size={18} />
                                                            Kod yuborish
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </>
                                    )}

                                    {/* Step 2: OTP Input */}
                                    {step === 'OTP' && (
                                        <>
                                            <div className='mb-6 text-center'>
                                                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 dark:bg-blue-600/20'>
                                                    <Key className='text-blue-500 dark:text-blue-400' size={32} />
                                                </div>
                                                <h3 className='text-2xl font-black text-gray-900 dark:text-white'>
                                                    Kodni tasdiqlang
                                                </h3>
                                                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                                                    {email} manziliga 6 xonali kod yubordik
                                                </p>
                                            </div>

                                            <form onSubmit={handleVerifyOtp} className='space-y-6'>
                                                {/* OTP Inputs */}
                                                <div className='flex justify-center gap-2'>
                                                    {otp.map((digit, index) => (
                                                        <input
                                                            key={index}
                                                            id={`otp-${index}`}
                                                            type='text'
                                                            maxLength={1}
                                                            value={digit}
                                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                            className='h-14 w-12 rounded-xl border border-gray-200 bg-gray-50 text-center text-xl font-bold text-gray-900 transition-all outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-400'
                                                        />
                                                    ))}
                                                </div>

                                                {/* Timer & Resend */}
                                                <div className='text-center'>
                                                    {canResend ? (
                                                        <button
                                                            type='button'
                                                            onClick={handleResendOtp}
                                                            disabled={loading}
                                                            className='text-sm font-semibold text-blue-500 hover:underline dark:text-blue-400'>
                                                            Kodni qayta yuborish
                                                        </button>
                                                    ) : (
                                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                            Kodni qayta yuborish: {timer} soniya
                                                        </p>
                                                    )}
                                                </div>

                                                <div className='flex gap-3'>
                                                    <button
                                                        type='button'
                                                        onClick={() => setStep('EMAIL')}
                                                        className='flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 py-4 font-bold text-gray-700 transition-all hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'>
                                                        <ArrowLeft size={18} />
                                                        Orqaga
                                                    </button>
                                                    <button
                                                        type='submit'
                                                        className='flex-1 rounded-2xl bg-gradient-to-r from-blue-500 to-orange-500 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-600 hover:to-orange-600'>
                                                        Davom etish
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    )}

                                    {/* Step 3: New Password */}
                                    {step === 'NEW_PASSWORD' && (
                                        <>
                                            <div className='mb-6 text-center'>
                                                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 dark:bg-green-600/20'>
                                                    <Lock className='text-green-500 dark:text-green-400' size={32} />
                                                </div>
                                                <h3 className='text-2xl font-black text-gray-900 dark:text-white'>
                                                    Yangi parol o'rnatish
                                                </h3>
                                                <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                                                    Yangi parolingizni kiriting
                                                </p>
                                            </div>

                                            <form onSubmit={handleResetPassword} className='space-y-4'>
                                                <div className='relative'>
                                                    <Lock
                                                        className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400'
                                                        size={18}
                                                    />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder='Yangi parol'
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className='w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-12 pl-12 text-gray-900 transition-all outline-none focus:border-green-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-green-400'
                                                        required
                                                    />
                                                    <button
                                                        type='button'
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className='absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>

                                                <div className='relative'>
                                                    <Lock
                                                        className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400'
                                                        size={18}
                                                    />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder='Parolni takrorlang'
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className='w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-12 pl-12 text-gray-900 transition-all outline-none focus:border-green-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-green-400'
                                                        required
                                                    />
                                                </div>

                                                <div className='text-xs text-gray-400 dark:text-gray-500'>
                                                    Parol kamida 6 ta belgidan iborat bo'lishi kerak
                                                </div>

                                                <div className='flex gap-3 pt-4'>
                                                    <button
                                                        type='button'
                                                        onClick={() => setStep('OTP')}
                                                        className='flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 py-4 font-bold text-gray-700 transition-all hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'>
                                                        <ArrowLeft size={18} />
                                                        Orqaga
                                                    </button>
                                                    <button
                                                        type='submit'
                                                        disabled={loading}
                                                        className='flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 py-4 font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:from-green-600 hover:to-blue-600 disabled:opacity-70'>
                                                        {loading ? (
                                                            <Loader2 size={18} className='animate-spin' />
                                                        ) : (
                                                            'Saqlash'
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
