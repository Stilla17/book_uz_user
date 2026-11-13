import React from 'react';

import Link from 'next/link';

import { getLocalizedPath } from '@/lib/i18n-routing';

import { ArrowLeft, CreditCard, XCircle } from 'lucide-react';

type PaymentFailPageProps = {
    params?: Promise<{ locale?: string }>;
    searchParams?: Promise<{
        orderId?: string;
        order_id?: string;
        id?: string;
        reason?: string;
    }>;
};

const PaymentFailPage = async ({ params, searchParams }: PaymentFailPageProps) => {
    const routeParams = await params;
    const query = await searchParams;
    const locale = routeParams?.locale || 'uz';
    const orderId = query?.orderId || query?.order_id || query?.id;
    const reason = query?.reason;

    return (
        <div className='min-h-screen bg-slate-50 py-8 dark:bg-slate-950'>
            <div className='container mx-auto flex max-w-3xl items-center justify-center px-4'>
                <section className='w-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900'>
                    <div className='mx-auto flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300'>
                        <XCircle className='size-9' />
                    </div>

                    <p className='mt-6 text-sm font-bold text-[#ef7f1a]'>To'lov yakunlanmadi</p>
                    <h1 className='mt-2 text-2xl font-black text-slate-950 sm:text-3xl dark:text-white'>
                        To'lov bekor qilindi yoki amalga oshmadi
                    </h1>
                    <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        Savatingiz saqlanib turadi. Qayta urinib ko'rishingiz yoki boshqa to'lov usulini tanlashingiz
                        mumkin.
                    </p>

                    {reason ? (
                        <div className='mt-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300'>
                            Sabab: {reason}
                        </div>
                    ) : null}

                    <div className='mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center'>
                        <Link
                            href={getLocalizedPath(locale, '/checkout')}
                            className='inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ef7f1a] px-5 text-sm font-black text-white transition hover:bg-orange-600'>
                            <CreditCard className='size-5' />
                            Qayta to'lash
                        </Link>
                        <Link
                            href={getLocalizedPath(locale, orderId ? '/profile?tab=orders' : '/cart')}
                            className='inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'>
                            <ArrowLeft className='size-5' />
                            {orderId ? "Buyurtmani ko'rish" : 'Savatga qaytish'}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymentFailPage;
