'use client';

import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import AsideCheckout from '@/components/shared/AsideCheckout';
import { deliveryOptions, paymentOptions } from '@/data';
import {
    type DistrictItem,
    type RegionItem,
    buildOrderPayload,
    getLocationName,
    getOrderId,
    getPaymentRedirectUrl,
    isOnlinePayment,
    isValidUzPhone,
    resolvePaymentRedirectUrl,
    validateCheckout
} from '@/helpers/checkout';
import { useAuth } from '@/hooks/useAuth';
import { useBookCart } from '@/hooks/useBookCart';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { UserService } from '@/services/api';
import { resetCheckout, updateField } from '@/store/features/checkoutSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useQuery } from '@tanstack/react-query';

import {
    Banknote,
    CheckCircle2,
    CreditCard,
    Home,
    LockKeyhole,
    MapPin,
    Phone,
    ShieldCheck,
    Truck,
    User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { IMaskInput } from 'react-imask';

const CheckoutPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const checkout = useAppSelector((state) => state.checkout);
    const promoDiscount = checkout.promoDiscount;
    const promoCode = checkout.promoCode;

    const { user } = useAuth();
    const { cartItems, totalPrice, clearItems } = useBookCart();
    const createOrder = useCreateOrder();
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [phone, setPhone] = useState(checkout.clientPhone);
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(
        checkout.paymentMethod || paymentOptions[0]?.title || 'Payme'
    );
    const [selectedDelivery, setSelectedDelivery] = useState(
        checkout.deliveryMethod || deliveryOptions[0]?.title || 'Kuryer'
    );

    const {
        data: regions,
        isLoading: regionsLoading,
        error: regionsError
    } = useQuery<RegionItem[]>({
        queryKey: ['regions'],
        queryFn: UserService.getRegions
    });

    const {
        data: districts,
        isLoading: districtsLoading,
        error: districtsError
    } = useQuery<DistrictItem[]>({
        queryKey: ['districts'],
        queryFn: UserService.getDistricts
    });

    const filteredDistricts = useMemo(() => {
        if (!selectedRegion) return [];

        return (districts || [])
            .filter((district) => district.region?.id === selectedRegion)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [districts, selectedRegion]);

    const selectedRegionItem = useMemo(
        () => (regions || []).find((region) => region.id === selectedRegion),
        [regions, selectedRegion]
    );
    const selectedDistrictItem = useMemo(
        () => (districts || []).find((district) => district.id === selectedDistrict),
        [districts, selectedDistrict]
    );

    const handleRegionChange = (regionId: string) => {
        setSelectedRegion(regionId);
        setSelectedDistrict('');
        dispatch(updateField({ region: regionId, district: '' }));
    };

    const phoneError = phoneTouched && phone.length > 0 && !isValidUzPhone(phone);

    const handleSubmitOrder = async () => {
        setPhoneTouched(true);

        const userId = user?._id || user?.id;
        const validationMessage = validateCheckout({
            cartItems,
            checkout,
            phone,
            selectedRegionItem,
            selectedDistrictItem,
            selectedPayment,
            paymentTitles: paymentOptions.map((option) => option.title)
        });

        if (validationMessage) {
            toast.error(validationMessage);
            return;
        }

        try {
            const payload = buildOrderPayload({
                cartItems,
                totalPrice,
                userId,
                checkout,
                phone,
                selectedRegionItem: selectedRegionItem!,
                selectedDistrictItem: selectedDistrictItem!,
                selectedDelivery,
                selectedPayment
            });
            const response = await createOrder.mutateAsync(payload);
            const orderId = getOrderId(response);
            let paymentRedirectUrl = await resolvePaymentRedirectUrl({
                response,
                selectedPayment,
                orderId,
                createClickPayment: UserService.createClickPayment,
                createPaymePayment: UserService.createPaymePayment
            });

            if (!paymentRedirectUrl && selectedPayment === 'Payme' && orderId) {
                const paymeResponse = await UserService.createPaymePayment(orderId);
                console.log('🔍 Payme Response:', paymeResponse);
                paymentRedirectUrl = getPaymentRedirectUrl(paymeResponse);
                console.log('💳 Payment Redirect URL:', paymentRedirectUrl);
            }

            if (!isOnlinePayment(selectedPayment)) {
                try {
                    await clearItems();
                } catch (clearCartError) {
                    console.warn('Savatni tozalashda xatolik, lekin buyurtma yaratildi:', clearCartError);
                }
            }

            dispatch(resetCheckout());
            toast.success('Buyurtma muvaffaqiyatli yaratildi');

            if (paymentRedirectUrl) {
                window.location.href = paymentRedirectUrl;
                return;
            }

            if (isOnlinePayment(selectedPayment)) {
                toast.error(`${selectedPayment} to'lov havolasi backenddan qaytmadi`);
                console.warn('Payment redirect URL topilmadi. Backend javobi:', response);
                return;
            }

            router.push(userId && orderId ? `/orders/${orderId}` : '/catalog');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Buyurtma yaratishda xatolik yuz berdi');
        }
    };

    return (
        <div className='min-h-screen bg-slate-50 py-6 sm:py-8 dark:bg-slate-950'>
            <div className='container mx-auto max-w-7xl px-4'>
                <div className='mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800'>
                    <div>
                        <p className='text-sm font-bold text-[#ef7f1a]'>Checkout</p>
                        <h1 className='mt-2 text-2xl font-black text-slate-950 sm:text-3xl dark:text-white'>
                            Buyurtmani rasmiylashtirish
                        </h1>
                        <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400'>
                            Yetkazib berish ma&apos;lumotlarini tekshiring va buyurtmani tasdiqlang.
                        </p>
                    </div>

                    <div className='inline-flex w-fit items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'>
                        <ShieldCheck className='size-5' />
                        {"Xavfsiz to'lov"}
                    </div>
                </div>

                <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]'>
                    <div className='space-y-6'>
                        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <div className='flex items-center gap-3'>
                                <span className='flex size-11 items-center justify-center rounded-xl bg-[#ef7f1a]/10 text-[#ef7f1a] dark:bg-orange-400/10 dark:text-orange-300'>
                                    <User className='size-5' />
                                </span>
                                <div>
                                    <h2 className='text-xl font-black text-slate-950 dark:text-white'>
                                        Qabul qiluvchi
                                    </h2>
                                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                                        Aloqa uchun asosiy ma&apos;lumotlar
                                    </p>
                                </div>
                            </div>

                            <div className='mt-5 grid gap-4 md:grid-cols-2'>
                                <label className='block'>
                                    <span className='mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200'>
                                        Ism familiya
                                    </span>
                                    <div className='flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-[#ef7f1a] focus-within:ring-4 focus-within:ring-orange-100 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:ring-orange-950/40'>
                                        <User className='size-5 text-slate-400' />
                                        <input
                                            type='text'
                                            value={checkout.clientName}
                                            onChange={(event) =>
                                                dispatch(updateField({ clientName: event.target.value }))
                                            }
                                            placeholder='Masalan: Aziz Karimov'
                                            className='w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white'
                                        />
                                    </div>
                                </label>

                                <label className='block'>
                                    <span className='mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200'>
                                        Telefon raqam
                                    </span>
                                    <div
                                        className={`flex h-12 items-center gap-3 rounded-xl border bg-slate-50 px-4 transition focus-within:ring-4 dark:bg-slate-950 ${
                                            phoneError
                                                ? 'border-rose-300 focus-within:border-rose-500 focus-within:ring-rose-100 dark:border-rose-900/70 dark:focus-within:ring-rose-950/40'
                                                : 'border-slate-200 focus-within:border-[#ef7f1a] focus-within:ring-orange-100 dark:border-slate-800 dark:focus-within:ring-orange-950/40'
                                        }`}>
                                        <Phone className='size-5 text-slate-400' />
                                        <IMaskInput
                                            mask='+{998} 00 000 00 00'
                                            value={phone}
                                            unmask={false}
                                            onBlur={() => setPhoneTouched(true)}
                                            onAccept={(value) => {
                                                const nextPhone = String(value);

                                                setPhone(nextPhone);
                                                dispatch(updateField({ clientPhone: nextPhone }));
                                            }}
                                            placeholder='+998 __ ___ __ __'
                                            aria-invalid={phoneError}
                                            className='w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white'
                                        />
                                    </div>
                                    {phoneError ? (
                                        <p className='mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400'>
                                            Telefon raqam +998 90 123 45 67 formatida bo&apos;lishi kerak.
                                        </p>
                                    ) : (
                                        <p className='mt-2 text-xs font-medium text-slate-400 dark:text-slate-500'>
                                            Masalan: +998 90 123 45 67
                                        </p>
                                    )}
                                </label>
                            </div>
                        </section>

                        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <div className='flex items-center gap-3'>
                                <span className='flex size-11 items-center justify-center rounded-xl bg-[#ef7f1a]/10 text-[#ef7f1a] dark:bg-orange-400/10 dark:text-orange-300'>
                                    <MapPin className='size-5' />
                                </span>
                                <div>
                                    <h2 className='text-xl font-black text-slate-950 dark:text-white'>
                                        Yetkazib berish manzili
                                    </h2>
                                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                                        Kuryer borishi kerak bo&apos;lgan joy
                                    </p>
                                </div>
                            </div>

                            <div className='mt-5 grid gap-4 md:grid-cols-2'>
                                <label className='block'>
                                    <span className='mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200'>
                                        Shahar
                                    </span>
                                    <select
                                        value={selectedRegion}
                                        disabled={regionsLoading || Boolean(regionsError)}
                                        onChange={(event) => handleRegionChange(event.target.value)}
                                        className='h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition outline-none focus:border-[#ef7f1a] focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-orange-950/40'>
                                        <option value=''>
                                            {regionsLoading
                                                ? 'Viloyatlar yuklanmoqda...'
                                                : regionsError
                                                  ? 'Viloyatlar yuklanmadi'
                                                  : 'Viloyatni tanlang'}
                                        </option>
                                        {(regions || []).map((region) => (
                                            <option key={region.id} value={region.id}>
                                                {getLocationName(region)}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className='block'>
                                    <span className='mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200'>
                                        Tuman
                                    </span>
                                    <select
                                        value={selectedDistrict}
                                        disabled={!selectedRegion || districtsLoading || Boolean(districtsError)}
                                        onChange={(event) => {
                                            setSelectedDistrict(event.target.value);
                                            dispatch(updateField({ district: event.target.value }));
                                        }}
                                        className='h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition outline-none focus:border-[#ef7f1a] focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-orange-950/40'>
                                        <option value=''>
                                            {districtsLoading
                                                ? 'Tumanlar yuklanmoqda...'
                                                : districtsError
                                                  ? 'Tumanlar yuklanmadi'
                                                  : selectedRegion
                                                    ? 'Tumanni tanlang'
                                                    : 'Avval viloyatni tanlang'}
                                        </option>
                                        {filteredDistricts.map((district) => (
                                            <option key={`${district.id}-${district.externalId}`} value={district.id}>
                                                {getLocationName(district)}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className='block md:col-span-2'>
                                    <span className='mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200'>
                                        Ko&apos;cha, uy, xonadon
                                    </span>
                                    <div className='flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-[#ef7f1a] focus-within:ring-4 focus-within:ring-orange-100 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:ring-orange-950/40'>
                                        <Home className='size-5 text-slate-400' />
                                        <input
                                            type='text'
                                            value={checkout.address}
                                            onChange={(event) => dispatch(updateField({ address: event.target.value }))}
                                            placeholder="Amir Temur ko'chasi, 12-uy"
                                            className='w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white'
                                        />
                                    </div>
                                </label>

                                <label className='block md:col-span-2'>
                                    <span className='mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200'>
                                        Qo&apos;shimcha izoh
                                    </span>
                                    <textarea
                                        rows={4}
                                        value={checkout.description}
                                        onChange={(event) => dispatch(updateField({ description: event.target.value }))}
                                        placeholder="Mo'ljal yoki kuryer uchun qo'shimcha ma'lumot"
                                        className='w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-[#ef7f1a] focus:ring-4 focus:ring-orange-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-orange-950/40'
                                    />
                                </label>
                            </div>
                        </section>

                        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <div className='flex items-center gap-3'>
                                <span className='flex size-11 items-center justify-center rounded-xl bg-[#ef7f1a]/10 text-[#ef7f1a] dark:bg-orange-400/10 dark:text-orange-300'>
                                    <Truck className='size-5' />
                                </span>
                                <div>
                                    <h2 className='text-xl font-black text-slate-950 dark:text-white'>
                                        Yetkazib berish turi
                                    </h2>
                                    <p className='text-sm text-slate-500 dark:text-slate-400'>
                                        Sizga qulay variantni tanlang
                                    </p>
                                </div>
                            </div>

                            <div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                                {deliveryOptions.map((option) => {
                                    const isActive = selectedDelivery === option.title;
                                    const Icon = option.icon;

                                    return (
                                        <button
                                            key={option.title}
                                            type='button'
                                            onClick={() => {
                                                setSelectedDelivery(option.title);
                                                dispatch(updateField({ deliveryMethod: option.title }));
                                            }}
                                            className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                                                isActive
                                                    ? 'border-[#ef7f1a] bg-orange-50 ring-4 ring-orange-100 dark:bg-orange-950/20 dark:ring-orange-950/40'
                                                    : 'border-slate-200 bg-slate-50 hover:border-orange-200 hover:bg-orange-50/60 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900'
                                            }`}>
                                            {isActive ? (
                                                <span className='absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-[#ef7f1a] text-white'>
                                                    <CheckCircle2 className='size-3.5' />
                                                </span>
                                            ) : null}
                                            <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-900 dark:text-orange-300'>
                                                <Icon className='size-5' />
                                            </span>
                                            <span className='min-w-0 flex-1'>
                                                <span className='block font-black text-slate-950 dark:text-white'>
                                                    {option.title}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <div className='flex items-center justify-between gap-3'>
                                <div className='flex items-center gap-3'>
                                    <span className='flex size-11 items-center justify-center rounded-xl bg-[#ef7f1a]/10 text-[#ef7f1a] dark:bg-orange-400/10 dark:text-orange-300'>
                                        <CreditCard className='size-5' />
                                    </span>
                                    <div>
                                        <h2 className='text-xl font-black text-slate-950 dark:text-white'>
                                            To&apos;lov usuli
                                        </h2>
                                        <p className='text-sm text-slate-500 dark:text-slate-400'>
                                            Buyurtma uchun to&apos;lov shakli
                                        </p>
                                    </div>
                                </div>
                                <div className='inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'>
                                    <LockKeyhole className='size-3.5' />
                                    Himoyalangan
                                </div>
                            </div>

                            <div className='mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                                {paymentOptions.map((option) => {
                                    const isActive = selectedPayment === option.title;
                                    const logoSrc = option.icon.replace('./', '/');

                                    return (
                                        <button
                                            key={option.title}
                                            type='button'
                                            onClick={() => {
                                                setSelectedPayment(option.title);
                                                dispatch(updateField({ paymentMethod: option.title }));
                                            }}
                                            className={`relative flex h-16 items-center justify-center rounded-xl border px-4 transition ${
                                                isActive
                                                    ? 'border-[#ef7f1a] bg-slate-950 ring-4 ring-orange-100 dark:bg-orange-950/20 dark:ring-orange-950/40'
                                                    : 'border-slate-200 bg-slate-950 hover:border-orange-200 hover:bg-slate-900 dark:border-slate-800'
                                            }`}>
                                            {isActive ? (
                                                <span className='absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-[#ef7f1a] text-white'>
                                                    <CheckCircle2 className='size-3.5' />
                                                </span>
                                            ) : null}
                                            {option.title === 'Naqd' ? (
                                                <span className='flex items-center gap-2 text-sm font-black text-white'>
                                                    <Banknote className='size-6 text-[#ef7f1a]' />
                                                    Naqd
                                                </span>
                                            ) : (
                                                <img
                                                    src={logoSrc}
                                                    alt={option.title}
                                                    className='max-h-7 max-w-24 object-contain'
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    <AsideCheckout
                        disabled={!cartItems.length}
                        isSubmitting={createOrder.isPending}
                        onConfirm={handleSubmitOrder}
                        promoDiscount={promoDiscount}
                        promoCode={promoCode}
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
