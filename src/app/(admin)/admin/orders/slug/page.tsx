'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useOrderIdQuery } from '@/components/admin/hooks/queries/order';
import { orderStatusConfig, paymentStatusConfig } from '@/data';
import { getBookAuthorName, getLocalizedText } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';
import { getOrderItemPrice, getOrderItemProduct, getOrderItemsQuantity, getOrderProductsTotal } from '@/utils/order';

import dayjs from 'dayjs';
import { ArrowLeft, Banknote, BookOpen, Check, Truck, UserRound } from 'lucide-react';

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
    const { data: orderData, isLoading: isDetailLoading } = useOrderIdQuery(id);
    const statusConfig = orderData ? orderStatusConfig[orderData.status] : null;
    const paymentStatusLabel = orderData
        ? paymentStatusConfig[orderData.paymentStatus]?.label || orderData.paymentStatus || "Noma'lum"
        : '';
    const productsTotal = getOrderProductsTotal(orderData?.items);

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
                            <div className='flex items-center gap-2'>
                                <UserRound size={20} className='text-[#ef7f1a]' />
                                <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Mijoz</h3>
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
