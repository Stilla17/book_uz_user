import Image from 'next/image';

import type { HrApplicationFormValues } from './form-types';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export const HrPageHeader = () => (
    <>
        <header className='border-b border-[#e4d5bf] bg-[#fffaf3]/90 backdrop-blur'>
            <div className='mx-auto flex max-w-6xl items-center px-4 py-3 md:px-6'>
                <Image
                    src='/images/Logo.png'
                    alt='Book.uz'
                    width={96}
                    height={96}
                    priority
                    className='size-20 object-contain md:size-24'
                />
            </div>
        </header>
        <div className='mx-auto max-w-6xl px-4 pt-8 md:px-6 md:pt-12'>
            <div className='max-w-3xl'>
            <p className='text-sm font-black tracking-[0.2em] text-[#ef7f1a] uppercase'>Book.uz jamoasi</p>
            <h1 className='mt-3 text-3xl leading-tight font-black md:text-5xl'>Xodim ma’lumotnomasini to‘ldiring</h1>
            <p className='mt-4 max-w-2xl leading-7 font-semibold text-[#776b5c]'>
                Ma’lumotlarni aniq va to‘liq kiriting. <b className='text-[#ef7f1a]'>*</b> bilan belgilangan maydonlar
                majburiy.
            </p>
            </div>
        </div>
    </>
);

export const SubmitPanel = ({
    register,
    errors,
    errorMessage,
    isSubmitting
}: {
    register: UseFormRegister<HrApplicationFormValues>;
    errors: FieldErrors<HrApplicationFormValues>;
    errorMessage: string;
    isSubmitting: boolean;
}) => (
    <section className='rounded-[28px] bg-[#2f2a25] p-5 text-white md:p-7'>
        <label className='flex cursor-pointer items-start gap-3'>
            <input
                type='checkbox'
                {...register('personalDataConsent', { required: true })}
                className='mt-1 size-5 accent-[#ef7f1a]'
            />
            <span className='text-sm leading-6 font-semibold text-white/80'>
                Kiritilgan ma’lumotlar to‘g‘riligini tasdiqlayman va shaxsiy ma’lumotlarim HR jarayoni doirasida qayta
                ishlanishiga roziman.
            </span>
        </label>
        {errors.personalDataConsent ? (
            <p className='mt-4 rounded-2xl bg-red-500/15 p-3 text-sm font-bold text-red-200'>
                Shaxsiy ma’lumotlarni qayta ishlashga rozilik berishingiz kerak.
            </p>
        ) : null}
        {errorMessage ? (
            <p className='mt-4 rounded-2xl bg-red-500/15 p-3 text-sm font-bold text-red-200'>{errorMessage}</p>
        ) : null}
        <button
            type='submit'
            disabled={isSubmitting}
            className='mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] px-7 font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'>
            {isSubmitting ? <Loader2 className='animate-spin' size={19} /> : <Send size={19} />}
            {isSubmitting ? 'Yuborilmoqda...' : 'Ma’lumotnomani yuborish'}
        </button>
    </section>
);

export const SuccessPanel = ({ applicationNumber }: { applicationNumber: string }) => (
    <main className='grid min-h-screen place-items-center bg-[#f4eadc] p-5'>
        <section className='w-full max-w-xl rounded-[32px] bg-[#fffaf3] p-8 text-center shadow-2xl ring-1 shadow-[#7b6040]/10 ring-[#eadfce] md:p-12'>
            <span className='mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-600'>
                <CheckCircle2 size={42} />
            </span>
            <h1 className='mt-6 text-3xl font-black text-[#2f2a25]'>Ma’lumotnoma qabul qilindi</h1>
            <p className='mt-3 leading-7 font-semibold text-[#776b5c]'>
                HR bo‘limi ma’lumotlaringizni ko‘rib chiqadi. Ariza raqamingizni saqlab qo‘ying.
            </p>
            <div className='mt-6 rounded-2xl bg-[#f2e7d8] px-5 py-4 font-mono text-xl font-black text-[#ef7f1a]'>
                {applicationNumber}
            </div>
            <button
                type='button'
                onClick={() => window.location.reload()}
                className='mt-7 h-12 rounded-2xl bg-[#2f2a25] px-6 text-sm font-black text-white transition hover:bg-[#ef7f1a]'>
                Yangi anketa to‘ldirish
            </button>
        </section>
    </main>
);
