import React from 'react';

import Link from 'next/link';

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    CreditCard,
    MapPin,
    PackageCheck,
    Phone,
    ReceiptText,
    Truck,
    User
} from 'lucide-react';

const orderItems = [
    {
        id: 1,
        title: "O'tkan kunlar",
        author: 'Abdulla Qodiriy',
        quantity: 1,
        price: 45000,
        image: '/images/xazna_logo.png'
    },
    {
        id: 2,
        title: 'Mehrobdan chayon',
        author: 'Abdulla Qodiriy',
        quantity: 2,
        price: 38000,
        image: '/images/xazna_logo.png'
    }
];

const timeline = [
    {
        title: 'Buyurtma qabul qilindi',
        description: 'Buyurtmangiz tizimga muvaffaqiyatli tushdi.',
        time: 'Bugun, 10:24',
        done: true
    },
    {
        title: 'Tayyorlanmoqda',
        description: "Mahsulotlar tekshirilib, jo'natishga tayyorlanmoqda.",
        time: 'Bugun, 10:40',
        done: true
    },
    {
        title: 'Yetkazib berishda',
        description: 'Kuryer buyurtmani manzilga olib boradi.',
        time: 'Kutilmoqda',
        done: false
    },
    {
        title: 'Topshirildi',
        description: 'Buyurtma mijozga topshiriladi.',
        time: 'Kutilmoqda',
        done: false
    }
];

const formatPrice = (price: number) => `${price.toLocaleString('uz-UZ')} so'm`;

const OrdersDetailPage = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryPrice = 20000;
    const total = subtotal + deliveryPrice;

    return (
        <div className='min-h-screen bg-slate-50 py-6 sm:py-8 dark:bg-slate-950'>
            <div className='container mx-auto max-w-7xl px-4'>
                <div className='mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800'>
                    <div>
                        <Link
                            href='/orders'
                            className='inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#ef7f1a] dark:text-slate-400'>
                            <ArrowLeft className='size-4' />
                            Buyurtmalarga qaytish
                        </Link>
                        <p className='mt-4 text-sm font-bold text-[#ef7f1a]'>Buyurtma tafsilotlari</p>
                        <h1 className='mt-2 text-2xl font-black text-slate-950 sm:text-3xl dark:text-white'>
                            Buyurtma #BU-24819
                        </h1>
                        <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400'>
                            Buyurtma holati, mahsulotlar, yetkazib berish va to'lov ma'lumotlari.
                        </p>
                    </div>

                    <div className='inline-flex w-fit items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'>
                        <PackageCheck className='size-5' />
                        Tayyorlanmoqda
                    </div>
                </div>

                <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]'>
                    <main className='space-y-6'>
                        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                                <div className='flex items-center gap-3'>
                                    <span className='flex size-11 items-center justify-center rounded-xl bg-[#ef7f1a]/10 text-[#ef7f1a] dark:bg-orange-400/10 dark:text-orange-300'>
                                        <Truck className='size-5' />
                                    </span>
                                    <div>
                                        <h2 className='text-xl font-black text-slate-950 dark:text-white'>
                                            Yetkazib berish jarayoni
                                        </h2>
                                        <p className='text-sm text-slate-500 dark:text-slate-400'>
                                            Taxminiy yetkazish vaqti: 1-2 ish kuni
                                        </p>
                                    </div>
                                </div>

                                <div className='rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-slate-950 dark:text-slate-200'>
                                    2026-05-04, 10:24
                                </div>
                            </div>

                            <div className='mt-6 grid gap-4 md:grid-cols-4'>
                                {timeline.map((step, index) => (
                                    <div
                                        key={step.title}
                                        className='relative rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950'>
                                        <div
                                            className={`mb-4 flex size-10 items-center justify-center rounded-full ${
                                                step.done
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                            {step.done ? (
                                                <CheckCircle2 className='size-5' />
                                            ) : (
                                                <Clock3 className='size-5' />
                                            )}
                                        </div>
                                        <p className='text-sm font-black text-slate-950 dark:text-white'>{step.title}</p>
                                        <p className='mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400'>
                                            {step.description}
                                        </p>
                                        <p className='mt-3 text-xs font-bold text-[#ef7f1a]'>{step.time}</p>
                                        <span className='absolute top-4 right-4 text-xs font-black text-slate-300 dark:text-slate-700'>
                                            {index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <div className='flex items-center gap-3'>
                                <span className='flex size-11 items-center justify-center rounded-xl bg-[#ef7f1a]/10 text-[#ef7f1a] dark:bg-orange-400/10 dark:text-orange-300'>
                                    <ReceiptText className='size-5' />
                                </span>
                                <div>
                                    <h2 className='text-xl font-black text-slate-950 dark:text-white'>
                                        Buyurtmadagi mahsulotlar
                                    </h2>
                                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                                        {orderItems.length} xil mahsulot
                                    </p>
                                </div>
                            </div>

                            <div className='mt-5 space-y-4'>
                                {orderItems.map((item) => (
                                    <article
                                        key={item.id}
                                        className='flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-950'>
                                        <div className='flex h-28 w-full max-w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-3 dark:bg-slate-900'>
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className='h-full w-full object-contain'
                                            />
                                        </div>

                                        <div className='min-w-0 flex-1'>
                                            <h3 className='text-lg font-black text-slate-950 dark:text-white'>
                                                {item.title}
                                            </h3>
                                            <p className='mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400'>
                                                {item.author}
                                            </p>
                                            <p className='mt-3 w-fit rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300'>
                                                {item.quantity} dona
                                            </p>
                                        </div>

                                        <div className='text-left sm:text-right'>
                                            <p className='text-sm font-semibold text-slate-500 dark:text-slate-400'>
                                                Narxi
                                            </p>
                                            <p className='mt-1 text-xl font-black text-[#ef7f1a]'>
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </main>

                    <aside className='space-y-6'>
                        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <h2 className='text-xl font-black text-slate-950 dark:text-white'>To'lov xulosasi</h2>

                            <div className='mt-5 space-y-3 text-sm'>
                                <div className='flex items-center justify-between gap-4 text-slate-500 dark:text-slate-400'>
                                    <span>Mahsulotlar</span>
                                    <span className='font-bold text-slate-900 dark:text-white'>
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between gap-4 text-slate-500 dark:text-slate-400'>
                                    <span>Yetkazib berish</span>
                                    <span className='font-bold text-slate-900 dark:text-white'>
                                        {formatPrice(deliveryPrice)}
                                    </span>
                                </div>
                                <div className='border-t border-slate-200 pt-4 dark:border-slate-800'>
                                    <div className='flex items-center justify-between gap-4'>
                                        <span className='font-black text-slate-950 dark:text-white'>Jami</span>
                                        <span className='text-2xl font-black text-[#ef7f1a]'>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <h2 className='text-xl font-black text-slate-950 dark:text-white'>Qabul qiluvchi</h2>

                            <div className='mt-5 space-y-4'>
                                <div className='flex gap-3'>
                                    <User className='mt-0.5 size-5 text-[#ef7f1a]' />
                                    <div>
                                        <p className='text-sm font-black text-slate-950 dark:text-white'>Aziz Karimov</p>
                                        <p className='text-sm text-slate-500 dark:text-slate-400'>Mijoz</p>
                                    </div>
                                </div>
                                <div className='flex gap-3'>
                                    <Phone className='mt-0.5 size-5 text-[#ef7f1a]' />
                                    <div>
                                        <p className='text-sm font-black text-slate-950 dark:text-white'>
                                            +998 90 123 45 67
                                        </p>
                                        <p className='text-sm text-slate-500 dark:text-slate-400'>Telefon raqam</p>
                                    </div>
                                </div>
                                <div className='flex gap-3'>
                                    <MapPin className='mt-0.5 size-5 text-[#ef7f1a]' />
                                    <div>
                                        <p className='text-sm font-black leading-6 text-slate-950 dark:text-white'>
                                            Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi, 12-uy
                                        </p>
                                        <p className='text-sm text-slate-500 dark:text-slate-400'>Yetkazish manzili</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <h2 className='text-xl font-black text-slate-950 dark:text-white'>To'lov</h2>

                            <div className='mt-5 flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-950'>
                                <div className='flex items-center gap-3'>
                                    <span className='flex size-10 items-center justify-center rounded-xl bg-white text-[#ef7f1a] dark:bg-slate-900'>
                                        <CreditCard className='size-5' />
                                    </span>
                                    <div>
                                        <p className='text-sm font-black text-slate-950 dark:text-white'>Payme</p>
                                        <p className='text-xs text-slate-500 dark:text-slate-400'>Online to'lov</p>
                                    </div>
                                </div>
                                <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'>
                                    To'langan
                                </span>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default OrdersDetailPage;
