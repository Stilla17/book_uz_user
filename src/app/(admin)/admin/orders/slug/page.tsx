'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useOrderIdQuery, useUpdateOrderStatus } from '@/components/admin/hooks/queries/order';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { orderStatusConfig, paymentStatusConfig } from '@/data';
import type { OrderStatus } from '@/types/orders';
import { getBookAuthorName, getLocalizedText } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';
import { getOrderItemPrice, getOrderItemProduct, getOrderItemsQuantity, getOrderProductsTotal } from '@/utils/order';

import dayjs from 'dayjs';
import { ArrowLeft, Banknote, BookOpen, Check, ClipboardCheck, Copy, Loader2, Truck, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';

const orderStatusOptions: Array<{ value: OrderStatus; label: string }> = [
    { value: 'PENDING', label: 'Kutilmoqda' },
    { value: 'CONFIRMED', label: 'Qabul qilindi' },
    { value: 'PROCESSING', label: 'Jarayonda' },
    { value: 'PACKED', label: 'Tayyorlanmoqda' },
    { value: 'SHIPPED', label: "Yo'lga chiqdi" },
    { value: 'DELIVERED', label: 'Yetkazib berildi' },
    { value: 'CANCELLED', label: 'Bekor qilindi' }
];

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className='flex items-start justify-between gap-4 border-b border-[#eadfce] py-3 last:border-0 dark:border-slate-800'>
        <span className='text-sm font-bold text-[#9d907e] dark:text-slate-500'>{label}</span>
        <span className='text-right text-sm font-black text-[#2f2a25] dark:text-white'>{value}</span>
    </div>
);

const getDeliveryLabel = (deliveryType?: string, postDeliveryType?: string) => {
    if (deliveryType === 'PICKUP') return "Do'kondan olib ketish";
    if (deliveryType === 'POST') {
        return postDeliveryType === 'POST_TO_HOME' ? 'Pochtadan uyga olib borib berish' : 'Pochta orqali';
    }

    return 'Kuryer orqali';
};

const AdminOrderDetailPage = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') ?? '';
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
    const { data: orderData, isLoading: isDetailLoading } = useOrderIdQuery(id);
    const { mutate: updateOrderStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();
    const statusConfig = orderData ? orderStatusConfig[orderData.status] : null;
    const paymentStatusLabel = orderData
        ? paymentStatusConfig[orderData.paymentStatus]?.label || orderData.paymentStatus || "Noma'lum"
        : '';
    const productsTotal = getOrderProductsTotal(orderData?.items);

    useEffect(() => {
        if (orderData?.status) setSelectedStatus(orderData.status);
    }, [orderData?.status]);

    const handleCopyLocation = async () => {
        const address = orderData?.shippingAddress;

        if (!address) return;
        const fullAddress = [address.street, address.region].filter(Boolean).join(', ');

        if (!fullAddress) {
            toast.error('Manzil mavjud emas.');
            return;
        }

        const yandexUrl = `https://yandex.uz/maps/?text=${encodeURIComponent(fullAddress)}`;

        try {
            await navigator.clipboard.writeText(yandexUrl);
            toast.success('Manzil Yandex xaritasi havolasi nusxalandi.');
        } catch (error) {
            console.error('Havolani nusxalashda xatolik:', error);
            toast.error('Manzilni nusxalashda xatolik yuz berdi.');
        }
    };

    const handleChangeOrderStatus = () => {
        if (!orderData || !selectedStatus || selectedStatus === orderData.status) return;

        updateOrderStatus(
            { orderId: orderData._id, status: selectedStatus },
            {
                onSuccess: () => toast.success('Buyurtma holati yangilandi'),
                onError: () => toast.error("Buyurtma holatini o'zgartirib bo'lmadi")
            }
        );
    };

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <Link
                        href='/admin/orders'
                        className='inline-flex items-center gap-2 text-sm font-black text-[#9d907e] transition hover:text-[#ef7f1a] dark:text-slate-400'>
                        <ArrowLeft size={17} />
                        Barcha buyurtmalar
                    </Link>
                    <div className='mt-3 flex flex-wrap items-center gap-3'>
                        <h2 className='text-2xl font-black text-[#2f2a25] dark:text-white'>
                            Buyurtma: № {orderData?.orderNumber}
                        </h2>
                        {statusConfig && (
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusConfig.className}`}>
                                {statusConfig.label}
                            </span>
                        )}
                    </div>
                    <p className='mt-2 text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        {isDetailLoading
                            ? 'Buyurtma ma’lumotlari yuklanmoqda...'
                            : orderData?.createdAt
                              ? `${dayjs(orderData.createdAt).format('DD.MM.YYYY | HH:mm')}`
                              : 'Buyurtma vaqti mavjud emas'}
                    </p>
                </div>
            </section>

            <div className='grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]'>
                <div className='space-y-5'>
                    <section className='overflow-hidden rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='flex items-center justify-between border-b border-[#eadfce] p-5 dark:border-slate-800'>
                            <div className='flex items-center gap-2'>
                                <BookOpen size={20} className='text-[#ef7f1a]' />
                                <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Mahsulotlar</h3>
                            </div>
                            <span className='rounded-full bg-[#f2e7d8] px-3 py-1 text-xs font-black text-[#817466] dark:bg-slate-900 dark:text-slate-300'>
                                {getOrderItemsQuantity(orderData?.items)} ta kitob
                            </span>
                        </div>

                        <div className='overflow-x-auto'>
                            <table className='w-full min-w-[620px] text-left'>
                                <thead>
                                    <tr className='text-xs font-black text-[#9d907e] uppercase dark:text-slate-500'>
                                        <th className='px-5 py-3'>Kitob</th>
                                        <th className='px-5 py-3'>Narx</th>
                                        <th className='px-5 py-3'>Soni</th>
                                        <th className='px-5 py-3 text-right'>Jami</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isDetailLoading ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className='border-t border-[#f0e4d3] px-5 py-8 text-center text-sm font-bold text-[#9d907e] dark:border-slate-900'>
                                                Mahsulotlar yuklanmoqda...
                                            </td>
                                        </tr>
                                    ) : orderData?.items.length ? (
                                        orderData.items.map((item, index) => {
                                            const product = getOrderItemProduct(item);
                                            const price = getOrderItemPrice(item);
                                            const imageUrl = product
                                                ? getImageUrl(product.image || product.images?.[0])
                                                : '';

                                            return (
                                                <tr
                                                    key={product?._id ?? `${item.product}-${index}`}
                                                    className='border-t border-[#f0e4d3] dark:border-slate-900'>
                                                    <td className='px-5 py-4'>
                                                        <div className='flex items-center gap-3'>
                                                            <span className='grid size-30 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-900'>
                                                                {imageUrl ? (
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={getLocalizedText(
                                                                            product?.title,
                                                                            'Kitob rasmi'
                                                                        )}
                                                                        className='h-full w-full object-contain'
                                                                    />
                                                                ) : (
                                                                    <BookOpen size={19} />
                                                                )}
                                                            </span>
                                                            <div>
                                                                <p className='font-black text-[#2f2a25] dark:text-white'>
                                                                    {product
                                                                        ? getLocalizedText(product.title)
                                                                        : `Mahsulot: ${item.product}`}
                                                                </p>
                                                                <p className='mt-1 text-xs font-bold text-[#9d907e] dark:text-slate-500'>
                                                                    {product
                                                                        ? getBookAuthorName(product)
                                                                        : 'Mahsulot ma’lumoti yuklanmagan'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-5 py-4 text-sm font-bold whitespace-nowrap text-[#6f6255] dark:text-slate-300'>
                                                        {formatPrice(price)}
                                                    </td>
                                                    <td className='px-5 py-4'>
                                                        <span className='grid size-8 place-items-center rounded-xl bg-[#f2e7d8] text-sm font-black dark:bg-slate-900'>
                                                            {item.quantity}
                                                        </span>
                                                    </td>
                                                    <td className='px-5 py-4 text-right font-black whitespace-nowrap text-[#2f2a25] dark:text-white'>
                                                        {formatPrice(price * item.quantity)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className='border-t border-[#f0e4d3] px-5 py-8 text-center text-sm font-bold text-[#9d907e] dark:border-slate-900'>
                                                Mahsulotlar topilmadi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className='grid gap-5 md:grid-cols-2'>
                        <article className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <div className='flex items-center justify-between gap-3'>
                                <div className='flex items-center gap-2'>
                                    <UserRound size={20} className='text-[#ef7f1a]' />
                                    <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Mijoz</h3>
                                </div>
                                <button
                                    type='button'
                                    onClick={handleCopyLocation}
                                    aria-label='Manzilni nusxalash'
                                    title='Yandex Maps havolasini nusxalash'
                                    className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-900'>
                                    <Copy size={17} />
                                </button>
                            </div>
                            <div className='mt-5 flex items-center gap-3'>
                                <div>
                                    <p className='font-black text-[#2f2a25] dark:text-white'>{orderData?.guestName}</p>
                                    <p className='mt-1 text-xs font-bold text-[#9d907e] dark:text-slate-500'>
                                        {orderData?.items.length} ta buyurtma
                                    </p>
                                </div>
                            </div>
                            <div className='mt-5 space-y-3'>
                                <InfoRow label='Telefon' value={orderData?.shippingAddress.phone || ''} />
                                <InfoRow label='Viloyat' value={orderData?.shippingAddress.city || ''} />
                                <InfoRow label='Tuman' value={orderData?.shippingAddress.region || ''} />
                                <InfoRow label='Manzil' value={orderData?.shippingAddress.street || ''} />
                            </div>
                        </article>

                        <article className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <div className='flex items-center gap-2'>
                                <Truck size={20} className='text-[#ef7f1a]' />
                                <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Yetkazib berish</h3>
                            </div>
                            <div className='mt-4'>
                                <InfoRow
                                    label='Usul'
                                    value={getDeliveryLabel(orderData?.deliveryType, orderData?.postDeliveryType)}
                                />
                                <InfoRow label='Yetkazish narxi' value={formatPrice(orderData?.deliveryFee ?? 0)} />
                                <InfoRow label="To'lov turi" value={orderData?.paymentType || ''} />
                                <InfoRow label="To'lov holati" value={paymentStatusLabel} />
                            </div>
                        </article>
                    </section>
                </div>

                <aside className='space-y-5'>
                    <section className='bg-base-100 ring-base-300 rounded-[24px] p-5 shadow-sm ring-1'>
                        <div className='flex items-start justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                                <span className='bg-warning/10 text-warning grid size-9 place-items-center rounded-xl'>
                                    <ClipboardCheck size={19} />
                                </span>
                                <div>
                                    <h3 className='text-base-content text-lg font-black'>Buyurtma holati</h3>
                                    <p className='text-admin-subtle mt-0.5 text-xs font-semibold'>
                                        Buyurtmaning joriy bosqichini tanlang
                                    </p>
                                </div>
                            </div>
                            {statusConfig && (
                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${statusConfig.className}`}>
                                    {statusConfig.label}
                                </span>
                            )}
                        </div>

                        <label className='mt-5 block'>
                            <span className='text-admin-subtle mb-2 block text-xs font-black tracking-wide uppercase'>
                                Yangi holat
                            </span>
                            <Select
                                value={selectedStatus || undefined}
                                disabled={isDetailLoading || isUpdatingStatus}
                                onValueChange={(value) => setSelectedStatus(value as OrderStatus)}>
                                <SelectTrigger className='border-base-300 bg-base-200 text-base-content focus:border-warning focus:ring-warning/10 h-12 w-full font-black shadow-none focus:ring-4'>
                                    <SelectValue placeholder='Holatni tanlang' />
                                </SelectTrigger>
                                <SelectContent className='border-[#eadfce] bg-[#fffaf2]'>
                                    {orderStatusOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className='font-bold focus:bg-[#f2e7d8] focus:text-[#2f2a25]'>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>

                        <button
                            type='button'
                            onClick={handleChangeOrderStatus}
                            disabled={
                                isDetailLoading ||
                                isUpdatingStatus ||
                                !orderData ||
                                !selectedStatus ||
                                selectedStatus === orderData.status
                            }
                            className='bg-warning text-warning-content mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'>
                            {isUpdatingStatus ? (
                                <Loader2 size={18} className='animate-spin' />
                            ) : (
                                <Check size={18} strokeWidth={3} />
                            )}
                            Holatni saqlash
                        </button>
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='flex items-center gap-2'>
                            <Banknote size={20} className='text-[#ef7f1a]' />
                            <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Buyurtma summasi</h3>
                        </div>
                        <div className='mt-4'>
                            <InfoRow label='Mahsulotlar' value={formatPrice(productsTotal)} />
                            <InfoRow label='Yetkazib berish' value={formatPrice(orderData?.deliveryFee ?? 0)} />
                            <InfoRow label='Chegirma' value={formatPrice(-(orderData?.discountAmount ?? 0))} />
                        </div>
                        <div className='mt-4 flex items-end justify-between gap-3 rounded-2xl bg-[#2f2a25] p-4 text-white dark:bg-white dark:text-slate-950'>
                            <span className='text-sm font-bold opacity-70'>Jami</span>
                            <span className='text-2xl font-black'>{formatPrice(orderData?.totalAmount ?? 0)}</span>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage;
