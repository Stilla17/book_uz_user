import React from 'react';

import Link from 'next/link';

import { CheckCircle2, CreditCard, PackageCheck, RotateCcw } from 'lucide-react';

type PaymeReturnPageProps = {
    searchParams?: Promise<{
        orderId?: string;
        order_id?: string;
        id?: string;
        error?: string;
        reason?: string;
    }>;
};

const PaymeReturnPage = async ({ searchParams }: PaymeReturnPageProps) => {
    const params = await searchParams;
    const orderId = params?.orderId || params?.order_id || params?.id;
    const error = params?.error || params?.reason;
    const orderHref = orderId ? `/orders/${orderId}` : '/orders';

    return (
        <div className='min-h-screen bg-slate-50 py-8 dark:bg-slate-950'>
            <div className='container mx-auto flex max-w-3xl items-center justify-center px-4'>
                <section className='w-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900'>
                    <div
                        className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${
                            error
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'
                                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}>
                        {error ? <RotateCcw className='size-9' /> : <CheckCircle2 className='size-9' />}
                    </div>

                    <p className='mt-6 text-sm font-bold text-[#ef7f1a]'>Payme</p>
                    <h1 className='mt-2 text-2xl font-black text-slate-950 sm:text-3xl dark:text-white'>
                        {error ? "To'lov yakunlanmadi" : "To'lov so'rovi qabul qilindi"}
                    </h1>
                    <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        {error
                            ? "Payme to'lovni bekor qildi yoki xatolik qaytardi. Qayta urinib ko'rishingiz mumkin."
                            : "Payme sahifasidan qaytdingiz. Yakuniy to'lov holati backend callback orqali tasdiqlanadi va buyurtma sahifasida yangilanadi."}
                    </p>

                    {orderId ? (
                        <div className='mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'>
                            Buyurtma ID: {orderId}
                        </div>
                    ) : null}

                    {error ? (
                        <div className='mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300'>
                            Sabab: {error}
                        </div>
                    ) : null}

                    <div className='mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center'>
                        <Link
                            href={error ? '/checkout' : orderHref}
                            className='inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ef7f1a] px-5 text-sm font-black text-white transition hover:bg-orange-600'>
                            {error ? <CreditCard className='size-5' /> : <PackageCheck className='size-5' />}
                            {error ? "Qayta to'lash" : "Buyurtmani ko'rish"}
                        </Link>
                        <Link
                            href='/catalog'
                            className='inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'>
                            Katalogga qaytish
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymeReturnPage;
