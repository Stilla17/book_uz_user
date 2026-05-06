import React from 'react';

import Link from 'next/link';

import { CheckCircle2, PackageCheck, ShoppingBag } from 'lucide-react';

type PaymentSuccessPageProps = {
    searchParams?: Promise<{
        orderId?: string;
        order_id?: string;
        id?: string;
    }>;
};

const PaymentSuccessPage = async ({ searchParams }: PaymentSuccessPageProps) => {
    const params = await searchParams;
    const orderId = params?.orderId || params?.order_id || params?.id;
    const orderHref = orderId ? `/orders/${orderId}` : '/orders';

    return (
        <div className='min-h-screen bg-slate-50 py-8 dark:bg-slate-950'>
            <div className='container mx-auto flex max-w-3xl items-center justify-center px-4'>
                <section className='w-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900'>
                    <div className='mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300'>
                        <CheckCircle2 className='size-9' />
                    </div>

                    <p className='mt-6 text-sm font-bold text-[#ef7f1a]'>To'lov qabul qilindi</p>
                    <h1 className='mt-2 text-2xl font-black text-slate-950 sm:text-3xl dark:text-white'>
                        Buyurtmangiz muvaffaqiyatli rasmiylashtirildi
                    </h1>
                    <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400'>
                        To'lov operatoridan muvaffaqiyatli javob qaytdi. Yakuniy holat backend callback orqali
                        tasdiqlanadi va buyurtma sahifasida yangilanadi.
                    </p>

                    {orderId ? (
                        <div className='mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'>
                            Buyurtma ID: {orderId}
                        </div>
                    ) : null}

                    <div className='mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center'>
                        <Link
                            href={orderHref}
                            className='inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ef7f1a] px-5 text-sm font-black text-white transition hover:bg-orange-600'>
                            <PackageCheck className='size-5' />
                            Buyurtmani ko'rish
                        </Link>
                        <Link
                            href='/catalog'
                            className='inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'>
                            <ShoppingBag className='size-5' />
                            Katalogga qaytish
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
