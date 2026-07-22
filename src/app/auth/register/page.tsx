'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDays, Loader2, Phone, UserRound } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';

const OTP_LENGTH = 4;
const MINIMUM_REGISTRATION_AGE = 12;

type RegisterForm = {
    name: string;
    birthDate: string;
    phone: string;
};

const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('998')) return `+${digits}`;
    if (digits.length === 9) return `+998${digits}`;
    return value.trim().startsWith('+') ? `+${digits}` : value.trim();
};

const isValidUzPhone = (value: string) => /^\+998\d{9}$/.test(value);

const getMaximumBirthDate = () => {
    const today = new Date();
    const maximumBirthDate = new Date(
        today.getFullYear() - MINIMUM_REGISTRATION_AGE,
        today.getMonth(),
        today.getDate()
    );

    return [
        maximumBirthDate.getFullYear(),
        String(maximumBirthDate.getMonth() + 1).padStart(2, '0'),
        String(maximumBirthDate.getDate()).padStart(2, '0')
    ].join('-');
};

export default function RegisterPage() {
    const { t } = useTranslation();
    const { sendPhoneOtp, verifyPhoneOtp, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [otpSent, setOtpSent] = useState(false);
    const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const maximumBirthDate = useMemo(getMaximumBirthDate, []);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<RegisterForm>({ defaultValues: { name: '', birthDate: '', phone: '' } });

    const otp = useMemo(() => otpValues.join(''), [otpValues]);

    useEffect(() => {
        const phone = searchParams.get('phone');
        if (phone) setValue('phone', phone);
    }, [searchParams, setValue]);

    useEffect(() => {
        if (otpSent) otpRefs.current[0]?.focus();
    }, [otpSent]);

    const errorMessage = (error: any, fallback: string) => error?.response?.data?.message || error?.message || fallback;

    const isAlreadyRegistered = (error: any) => error?.response?.status === 409;

    const requestOtp = async (values: RegisterForm) => {
        const data = {
            phone: normalizePhone(values.phone),
            name: values.name.trim(),
            birthDate: values.birthDate,
            mode: 'register' as const
        };

        try {
            await sendPhoneOtp(data);
            setOtpValues(Array(OTP_LENGTH).fill(''));
            setOtpSent(true);
            toast.success(t('loginPage.codeSent'));
        } catch (error: any) {
            if (isAlreadyRegistered(error)) {
                toast.error(t('registerPage.alreadyRegistered'));
                router.push(`/auth/login?phone=${encodeURIComponent(data.phone)}`);
                return;
            }
            toast.error(errorMessage(error, t('loginPage.sendCodeError')));
        }
    };

    const verifyOtp = async (event: React.FormEvent) => {
        event.preventDefault();
        if (otp.length !== OTP_LENGTH) {
            toast.error(t('loginPage.enterOtpLength', { count: OTP_LENGTH }));
            return;
        }

        const values = getValues();
        try {
            await verifyPhoneOtp({
                phone: normalizePhone(values.phone),
                otp,
                name: values.name.trim(),
                birthDate: values.birthDate
            });
            toast.success(t('registerPage.success'));
            router.push('/');
            router.refresh();
        } catch (error: any) {
            toast.error(errorMessage(error, t('loginPage.invalidOtp')));
        }
    };

    const changeOtp = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        setOtpValues((current) => current.map((item, itemIndex) => (itemIndex === index ? digit : item)));
        if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
    };

    const pasteOtp = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pasted) return;
        setOtpValues(Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] || ''));
        otpRefs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
    };

    const fieldClass =
        'w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-4 pl-12 text-gray-900 outline-none transition focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white';

    return (
        <div className='flex min-h-screen items-center justify-center px-4 py-12 dark:bg-slate-900'>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-full max-w-md rounded-[32px] border border-gray-100 bg-white/90 p-8 shadow-2xl md:px-10 dark:border-slate-700 dark:bg-slate-800/90'>
                <img src='/images/Logo.png' alt='Book.uz' className='mx-auto h-32 w-32' />
                <div className='mb-7 text-center'>
                    <h1 className='text-3xl font-black text-gray-900 dark:text-white'>{t('registerPage.title')}</h1>
                    <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                        {otpSent
                            ? t('loginPage.otpDescription', { phone: normalizePhone(getValues('phone')) })
                            : t('registerPage.description')}
                    </p>
                </div>

                {!otpSent ? (
                    <form noValidate onSubmit={handleSubmit(requestOtp)} className='space-y-4'>
                        <label className='block text-sm font-bold text-gray-600 dark:text-gray-300'>
                            {t('loginPage.fullName')}
                            <span className='relative mt-2 block'>
                                <UserRound
                                    className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400'
                                    size={18}
                                />
                                <input
                                    {...register('name', {
                                        required: t('loginPage.nameRequired'),
                                        minLength: { value: 2, message: t('loginPage.nameMinLength') }
                                    })}
                                    className={fieldClass}
                                    placeholder={t('loginPage.fullNamePlaceholder')}
                                />
                            </span>
                            {errors.name && (
                                <span className='mt-1 block text-sm font-normal text-red-500'>
                                    {errors.name.message}
                                </span>
                            )}
                        </label>

                        <label className='block text-sm font-bold text-gray-600 dark:text-gray-300'>
                            {t('loginPage.birthDate')}
                            <span className='relative mt-2 block'>
                                <CalendarDays
                                    className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400'
                                    size={18}
                                />
                                <input
                                    type='date'
                                    max={maximumBirthDate}
                                    {...register('birthDate', {
                                        required: t('loginPage.birthDateRequired'),
                                        validate: (value) =>
                                            value <= maximumBirthDate || t('loginPage.birthDateMinimumAge')
                                    })}
                                    className={fieldClass}
                                />
                            </span>
                            {errors.birthDate && (
                                <span className='mt-1 block text-sm font-normal text-red-500'>
                                    {errors.birthDate.message}
                                </span>
                            )}
                        </label>

                        <label className='block text-sm font-bold text-gray-600 dark:text-gray-300'>
                            {t('loginPage.phone')}
                            <span className='relative mt-2 block'>
                                <Phone className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400' size={18} />
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
                                            mask='+998 00 000 00 00'
                                            inputMode='tel'
                                            placeholder='+998 90 123 45 67'
                                            className={fieldClass}
                                            value={field.value}
                                            onAccept={(value) => field.onChange(String(value))}
                                            onBlur={field.onBlur}
                                            inputRef={field.ref}
                                        />
                                    )}
                                />
                            </span>
                            {errors.phone && (
                                <span className='mt-1 block text-sm font-normal text-red-500'>
                                    {errors.phone.message}
                                </span>
                            )}
                        </label>

                        <button
                            disabled={isLoading}
                            className='flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] py-4 font-bold text-white disabled:opacity-60'>
                            {isLoading ? (
                                <Loader2 className='animate-spin' />
                            ) : (
                                <>
                                    {t('registerPage.submit')} <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verifyOtp} className='space-y-5'>
                        <div className='grid grid-cols-4 gap-3'>
                            {otpValues.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(element) => {
                                        otpRefs.current[index] = element;
                                    }}
                                    value={digit}
                                    maxLength={1}
                                    inputMode='numeric'
                                    onChange={(event) => changeOtp(index, event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Backspace' && !digit) otpRefs.current[index - 1]?.focus();
                                    }}
                                    onPaste={pasteOtp}
                                    className='h-16 rounded-2xl border border-gray-200 bg-gray-50 text-center text-2xl font-black outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                                />
                            ))}
                        </div>
                        <button
                            disabled={isLoading}
                            className='flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] py-4 font-bold text-white disabled:opacity-60'>
                            {isLoading ? (
                                <Loader2 className='animate-spin' />
                            ) : (
                                <>
                                    {t('registerPage.confirm')} <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                        <button
                            type='button'
                            onClick={() => setOtpSent(false)}
                            className='mx-auto flex items-center gap-1 text-sm font-semibold text-gray-500'>
                            <ArrowLeft size={16} /> {t('registerPage.changeDetails')}
                        </button>
                    </form>
                )}

                {!otpSent && (
                    <p className='mt-6 text-center text-sm text-gray-500'>
                        {t('registerPage.hasAccount')}{' '}
                        <Link href='/auth/login' className='font-bold text-[#ef7f1a]'>
                            {t('registerPage.login')}
                        </Link>
                    </p>
                )}
            </motion.div>
        </div>
    );
}
