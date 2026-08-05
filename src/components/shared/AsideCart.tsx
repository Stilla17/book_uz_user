import React, { useState } from 'react';

import Link from 'next/link';

import { FREE_DELIVERY_MIN_TOTAL } from '@/helpers/checkout';
import { calculatePromoDiscount } from '@/helpers/promoDiscount';
import { useDeliverySettingsQuery, usePromosQuery } from '@/hooks/queries/useCheckoutQueries';
import type { CartItem } from '@/store/features/cartSlice';
import { clearPromo, setPromo } from '@/store/features/checkoutSlice';
import { useAppDispatch } from '@/store/hooks';
import { Coupon } from '@/types';
import { formatPrice } from '@/utils/currency';

import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { BadgePercent, CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type AsideCartProps = {
    cartItems: CartItem[];
    totalPrice: number;
    totalQuantity: number;
};

interface PromoForm {
    promoCode: string;
}

const AsideCart = ({ cartItems, totalPrice, totalQuantity }: AsideCartProps) => {
    const { t } = useTranslation();
    const formatCartPrice = (value?: number) => formatPrice(value, t('bookCard.currency'));
    const { register, handleSubmit } = useForm<PromoForm>();
    const [matchedPromo, setMatchedPromo] = useState<Coupon | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const dispatch = useAppDispatch();
    const { data: deliverySettings } = useDeliverySettingsQuery();
    const deliveryPrice =
        totalQuantity > 0 && totalPrice < FREE_DELIVERY_MIN_TOTAL ? (deliverySettings?.deliveryFee ?? 20000) : 0;
    const paymentTotal = Math.max(0, totalPrice + deliveryPrice - discountAmount);

    const { data: promos = [] } = usePromosQuery();

    const onSumbit = (values: PromoForm) => {
        const promo = promos.find((promo) => promo.code.toLowerCase() === values.promoCode.trim().toLowerCase());
        if (!promo) {
            setMatchedPromo(null);
            setDiscountAmount(0);
            dispatch(clearPromo());
            return;
        }
        const discount = calculatePromoDiscount(promo, cartItems);

        if (discount <= 0) {
            setMatchedPromo(null);
            setDiscountAmount(0);
            dispatch(clearPromo());
            return;
        }

        setMatchedPromo(promo);
        setDiscountAmount(discount);
        dispatch(setPromo({ code: promo.code, discount }));
    };

    return (
        <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className='space-y-4 xl:sticky xl:top-24 xl:h-fit'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <h2 className='text-xl font-black text-slate-900 dark:text-white'>{t('cartPage.summary')}</h2>

                <div className='mt-5 space-y-3'>
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>{t('cartPage.products')}</span>
                        <span className='font-semibold text-slate-900 dark:text-white'>
                            {formatCartPrice(totalPrice)}
                        </span>
                    </div>
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>{t('cartPage.discount')}</span>
                        <span className='font-semibold text-emerald-600'>
                            {matchedPromo && discountAmount > 0
                                ? matchedPromo.type === 'PERCENT'
                                    ? `${matchedPromo.value}% (-${formatCartPrice(discountAmount)})`
                                    : `-${formatCartPrice(discountAmount)}`
                                : formatCartPrice(0)}
                        </span>
                    </div>
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>{t('cartPage.delivery')}</span>
                        <span className='font-semibold text-slate-900 dark:text-white'>
                            {deliveryPrice === 0 ? t('checkoutPage.free') : formatCartPrice(deliveryPrice)}
                        </span>
                    </div>
                </div>

                <div className='my-5 h-px bg-slate-200 dark:bg-slate-800' />

                <div className='flex items-end justify-between gap-3'>
                    <div>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>{t('cartPage.amountDue')}</p>
                        <p className='mt-1 text-2xl font-black text-slate-900 dark:text-white'>
                            {formatCartPrice(paymentTotal)}
                        </p>
                    </div>
                    <div className='rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-[#ef7f1a] dark:bg-slate-800 dark:text-orange-300'>
                        {t('cartPage.productCount', { count: totalQuantity })}
                    </div>
                </div>

                <div className='mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-950'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200'>
                        <BadgePercent size={16} className='text-[#ef7f1a]' />
                        {t('cartPage.promoCode')}
                    </div>
                    <form onSubmit={handleSubmit(onSumbit)} className='mt-3 flex gap-2'>
                        <input
                            type='text'
                            placeholder={t('cartPage.promoPlaceholder')}
                            className='h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm transition outline-none placeholder:text-slate-400 focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white'
                            {...register('promoCode')}
                        />
                        <Button className='h-12 rounded-xl bg-slate-900 px-5 text-white hover:bg-[#ef7f1a] dark:bg-white dark:text-slate-900'>
                            {t('cartPage.apply')}
                        </Button>
                    </form>
                </div>

                <Button className='mt-6 h-14 w-full rounded-xl bg-[#ef7f1a] text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d96f12] dark:shadow-none'>
                    <Link href='/checkout' className='flex items-center justify-center gap-2'>
                        <CreditCard size={18} />
                        {t('cartPage.checkout')}
                    </Link>
                </Button>
            </div>
        </motion.aside>
    );
};

export default AsideCart;
