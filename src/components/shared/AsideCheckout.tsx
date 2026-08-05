import React from 'react';

import { getDeliveryCost } from '@/helpers/checkout';
import { useBookCart } from '@/hooks/bookHooks/useBookCart';
import { getText } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';

import { Button } from '../ui/button';
import { ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AsideCheckoutProps {
    disabled?: boolean;
    isSubmitting?: boolean;
    onConfirm?: () => void;
    promoCode?: string;
    promoDiscount?: number;
    selectedDelivery: string;
    deliveryFee?: number;
    freeDelivery?: boolean;
}

const AsideCheckout = ({
    disabled = false,
    isSubmitting = false,
    onConfirm,
    promoCode,
    promoDiscount = 0,
    selectedDelivery,
    deliveryFee,
    freeDelivery = false
}: AsideCheckoutProps) => {
    const { t } = useTranslation();
    const { cartItems, totalPrice, totalQuantity } = useBookCart();
    const formatCheckoutPrice = (value?: number) => formatPrice(value, t('bookCard.currency'));
    const deliveryCost = getDeliveryCost(selectedDelivery, deliveryFee, totalPrice, freeDelivery);
    const paymentTotal = Math.max(0, totalPrice + deliveryCost - promoDiscount);

    return (
        <aside className='h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:top-24 dark:border-slate-800 dark:bg-slate-900'>
            <div className='flex items-center justify-between gap-4'>
                <div>
                    <h2 className='text-xl font-black text-slate-950 dark:text-white'>{t('checkoutPage.summary')}</h2>
                    <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                        {t('checkoutPage.productCount', { count: totalQuantity })}
                    </p>
                </div>
            </div>

            <div className='mt-5 max-h-[360px] space-y-3 overflow-y-auto pr-1'>
                {cartItems.length > 0 ? (
                    cartItems.map((item) => {
                        const hasDiscount = Boolean(item.book.oldPrice && item.book.oldPrice > item.book.price);

                        return (
                            <div
                                key={item.book._id}
                                className='flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950'>
                                <div className='flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-2 shadow-sm dark:bg-slate-900'>
                                    <img
                                        src={getImageUrl(item.book.images)}
                                        alt={getText(item.book.title, t('checkoutPage.unknownBook'))}
                                        className='h-full w-full object-contain'
                                    />
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <p className='line-clamp-2 leading-5 font-black text-slate-950 dark:text-white'>
                                        {getText(item.book.title, t('checkoutPage.unknownBook'))}
                                    </p>
                                    <div className='mt-2 flex items-center justify-between gap-3'>
                                        <span className='rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-900 dark:text-slate-400'>
                                            x{item.quantity}
                                        </span>
                                        <div className='text-right'>
                                            {hasDiscount ? (
                                                <div className='mb-0.5 flex items-center justify-end gap-1.5'>
                                                    <span className='text-xs font-bold text-slate-400 line-through'>
                                                        {formatCheckoutPrice(item.book.oldPrice)}
                                                    </span>
                                                    {item.book.discount ? (
                                                        <span className='rounded-full bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-[#ef7f1a] dark:bg-orange-500/10'>
                                                            -{item.book.discount}%
                                                        </span>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                            <span className='text-sm font-black text-[#ef7f1a]'>
                                                {formatCheckoutPrice(item.book.price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className='rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-800 dark:bg-slate-950'>
                        <p className='text-sm font-bold text-slate-700 dark:text-slate-200'>
                            {t('checkoutPage.emptyCart')}
                        </p>
                    </div>
                )}
            </div>

            <div className='mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm dark:border-slate-800'>
                <div className='flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400'>
                    <span>{t('checkoutPage.price')}</span>
                    <span className='font-bold text-slate-800 dark:text-slate-200'>
                        {formatCheckoutPrice(totalPrice)}
                    </span>
                </div>
                <div className='flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400'>
                    <span>{t('checkoutPage.delivery')}</span>
                    <span className='font-bold text-slate-800 dark:text-slate-200'>
                        {deliveryCost === 0 ? t('checkoutPage.free') : formatCheckoutPrice(deliveryCost)}
                    </span>
                </div>
                {promoDiscount > 0 && (
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>
                            {t('checkoutPage.promoCode')} {promoCode ? `(${promoCode})` : ''}
                        </span>
                        <span className='font-semibold text-emerald-600'>-{formatCheckoutPrice(promoDiscount)}</span>
                    </div>
                )}
            </div>

            <div className='mt-5 rounded-xl bg-slate-950 p-4 text-white dark:bg-white dark:text-slate-950'>
                <div className='flex items-end justify-between gap-3'>
                    <span className='text-sm opacity-70'>{t('checkoutPage.totalPayment')}</span>
                    <span className='text-right text-2xl font-black text-[#ef7f1a]'>
                        {formatCheckoutPrice(paymentTotal)}
                    </span>
                </div>
            </div>

            <div className='mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950'>
                <div className='flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300'>
                    <ShieldCheck className='mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400' />
                    <span>{t('checkoutPage.paymentProtected')}</span>
                </div>
            </div>

            <Button
                type='button'
                disabled={disabled || isSubmitting}
                onClick={onConfirm}
                className='mt-5 h-14 w-full rounded-xl bg-[#ef7f1a] text-base font-black text-white shadow-lg shadow-orange-200 transition hover:bg-[#d96f14] dark:shadow-none'>
                {isSubmitting ? (
                    <>
                        <Loader2 className='size-5 animate-spin' />
                        {t('checkoutPage.submitting')}
                    </>
                ) : (
                    <>
                        {t('checkoutPage.confirmOrder')}
                        <ChevronRight className='size-5' />
                    </>
                )}
            </Button>
        </aside>
    );
};

export default AsideCheckout;
