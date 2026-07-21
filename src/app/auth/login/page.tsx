'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Phone, ShieldCheck } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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

type LoginType = {
    phone: string;
};

export default function LoginPage() {
    const { t } = useTranslation();
    const { sendPhoneOtp, verifyPhoneOtp, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<LoginType>({
        defaultValues: {
            phone: ''
        }
    });

    const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [otpSent, setOtpSent] = useState(false);
    const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const phone = watch('phone');
    const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);
    const otp = useMemo(() => otpValues.join(''), [otpValues]);

    useEffect(() => {
        const phoneFromRegister = searchParams.get('phone');
        if (phoneFromRegister) setValue('phone', phoneFromRegister);
    }, [searchParams, setValue]);

    const getErrorMessage = (error: any, fallback: string) =>
        error?.response?.data?.message || error?.message || fallback;

    const isUnregisteredPhone = (error: any) => {
        const status = error?.response?.status;
        const code = error?.response?.data?.code;

        return status === 404 || code === 'USER_NOT_FOUND' || code === 'PHONE_NOT_REGISTERED';
    };

    const requestOtp = async (values: LoginType) => {
        const normalizedPhone = normalizePhone(values.phone);

        try {
            await sendPhoneOtp({
                phone: normalizedPhone,
                mode: 'login'
            });
            setOtpValues(Array(OTP_LENGTH).fill(''));
            setOtpSent(true);
            toast.success(t('loginPage.codeSent'));
        } catch (error: any) {
            if (isUnregisteredPhone(error)) {
                router.push(`/auth/register?phone=${encodeURIComponent(normalizedPhone)}`);
                return;
            }

            toast.error(getErrorMessage(error, t('loginPage.sendCodeError')));
        }
    };

    const handleSendOtp = handleSubmit(requestOtp);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.trim().length !== OTP_LENGTH) {
            toast.error(t('loginPage.enterOtpLength', { count: OTP_LENGTH }));
            return;
        }

        try {
            await verifyPhoneOtp({
                phone: normalizedPhone,
                otp: otp.trim()
            });
            toast.success(t('loginPage.welcome'));
            const redirect = new URLSearchParams(window.location.search).get('redirect');
            router.push(redirect || '/');
            router.refresh();
        } catch (error: any) {
            toast.error(getErrorMessage(error, t('loginPage.invalidOtp')));
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const nextOtpValues = otpValues.map((item, itemIndex) => (itemIndex === index ? digit : item));

        setOtpValues(nextOtpValues);

        if (digit && index < OTP_LENGTH - 1) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Backspace' || otpValues[index]) return;

        otpInputRefs.current[index - 1]?.focus();
    };

    const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();

        const pastedOtp = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pastedOtp) return;

        setOtpValues(Array.from({ length: OTP_LENGTH }, (_, index) => pastedOtp[index] || ''));
        otpInputRefs.current[Math.min(pastedOtp.length, OTP_LENGTH) - 1]?.focus();
    };

    useEffect(() => {
        if (!otpSent) return;

        otpInputRefs.current[0]?.focus();
    }, [otpSent]);

    return (
        <div className='flex min-h-screen items-center justify-center px-4 py-12 dark:bg-slate-900'>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='relative z-10 w-full max-w-md rounded-[32px] border border-gray-100 bg-white/85 p-8 shadow-2xl backdrop-blur-xl md:px-10 dark:border-slate-700 dark:bg-slate-800/85 dark:shadow-blue-900/20'>
                <img src='/images/Logo.png' alt='Logo' className='mx-auto h-40 w-40 max-md:h-32 max-md:w-32' />

                <div className='mb-8 text-center'>
                    <h1 className='text-3xl font-black text-gray-900 md:text-4xl dark:text-white'>
                        {t('loginPage.title')}
                    </h1>
                    <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                        {otpSent
                            ? t('loginPage.otpDescription', { phone: normalizedPhone })
                            : t('loginPage.description')}
                    </p>
                </div>

                {!otpSent ? (
                    <form onSubmit={handleSendOtp} className='space-y-5'>
                        <div className='space-y-2'>
                            <label className='ml-1 text-sm font-bold text-gray-600 dark:text-gray-400'>
                                {t('loginPage.phone')}
                            </label>
                            <div className='group relative'>
                                <Phone
                                    className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400'
                                    size={18}
                                />
                                <Controller
                                    name='phone'
                                    control={control}
                                    rules={{
                                        required: t('loginPage.phoneRequired'),
                                        validate: (value) =>
                                            isValidUzPhone(normalizePhone(value)) || t('loginPage.invalidPhone')
                                    }}
                                    render={({ field }) => (
                                        <IMaskInput
                                            required
                                            mask='+998 00 000 00 00'
                                            inputMode='tel'
                                            placeholder='+998 90 123 45 67'
                                            className='w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-4 pl-12 text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400'
                                            value={field.value}
                                            onAccept={(value) => field.onChange(String(value))}
                                            onBlur={field.onBlur}
                                            inputRef={field.ref}
                                        />
                                    )}
                                />
                                {errors.phone && <p className='mt-1 text-sm text-red-500'>{errors.phone.message}</p>}
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] py-4 font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-[#d96f12] disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-orange-600/30'>
                            {isLoading ? (
                                <Loader2 className='animate-spin' size={22} />
                            ) : (
                                <>
                                    {t('loginPage.sendCode')} <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className='space-y-5'>
                        <div className='space-y-2'>
                            <label className='ml-1 text-sm font-bold text-gray-600 dark:text-gray-400'>
                                {t('loginPage.otpLabel')}
                            </label>
                            <div className='grid grid-cols-4 gap-3'>
                                {otpValues.map((digit, index) => (
                                    <div key={index} className='group relative'>
                                        <input
                                            ref={(element) => {
                                                otpInputRefs.current[index] = element;
                                            }}
                                            required
                                            type='text'
                                            inputMode='numeric'
                                            autoComplete={index === 0 ? 'one-time-code' : 'off'}
                                            maxLength={1}
                                            aria-label={t('loginPage.otpDigitLabel', { number: index + 1 })}
                                            className='h-16 w-full rounded-2xl border border-gray-200 bg-gray-50 text-center text-2xl font-black text-gray-900 transition-all outline-none placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-orange-400 dark:focus:ring-orange-950/40'
                                            value={digit}
                                            onChange={(event) => handleOtpChange(index, event.target.value)}
                                            onKeyDown={(event) => handleOtpKeyDown(index, event)}
                                            onPaste={handleOtpPaste}
                                        />
                                        {index === 0 ? (
                                            <ShieldCheck
                                                className='pointer-events-none absolute top-1/2 left-2 hidden -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-orange-500 sm:block dark:text-gray-500 dark:group-focus-within:text-orange-400'
                                                size={14}
                                            />
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] py-4 font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-[#d96f12] disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-orange-600/30'>
                            {isLoading ? (
                                <Loader2 className='animate-spin' size={22} />
                            ) : (
                                <>
                                    {t('loginPage.signIn')} <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        <div className='flex items-center justify-between gap-3 px-1 text-sm'>
                            <button
                                type='button'
                                onClick={() => {
                                    setOtpSent(false);
                                    setOtpValues(Array(OTP_LENGTH).fill(''));
                                }}
                                className='flex items-center gap-1 font-semibold text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'>
                                <ArrowLeft size={16} />
                                {t('loginPage.changePhone')}
                            </button>
                            <button
                                type='button'
                                disabled={isLoading}
                                onClick={handleSubmit(requestOtp)}
                                className='font-semibold text-orange-500 transition-colors hover:text-orange-600 disabled:opacity-60 dark:text-orange-400 dark:hover:text-orange-300'>
                                {t('loginPage.resendCode')}
                            </button>
                        </div>
                    </form>
                )}

                {!otpSent && (
                    <div className='mt-6 border-t border-gray-200 pt-6 text-center dark:border-slate-700'>
                        <Link
                            href='/auth/register'
                            className='flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#ef7f1a] py-3.5 font-bold text-[#ef7f1a] transition-all hover:bg-[#ef7f1a] hover:text-white dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-500 dark:hover:text-white'>
                            {t('loginPage.register')}
                            <ArrowRight size={19} />
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
