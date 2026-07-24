import { OrderItem } from '@/types/orders';

type RevenueOrderLike = {
    paymentStatus?: string;
    paymentType?: string;
    status?: string;
};

const cashRevenueStatuses = new Set(['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED']);

export const isOrderRevenueEligible = (order: RevenueOrderLike) => {
    const orderStatus = String(order.status || '').toUpperCase();
    const paymentStatus = String(order.paymentStatus || '').toUpperCase();
    const paymentType = String(order.paymentType || '').toUpperCase();

    if (orderStatus === 'CANCELLED') return false;

    return paymentStatus === 'PAID' || (paymentType === 'CASH' && cashRevenueStatuses.has(orderStatus));
};

export const getOrderItemProduct = (item: OrderItem) => {
    return typeof item.product === 'string' ? null : item.product;
};

export const getOrderItemPrice = (item: OrderItem) => {
    const product = getOrderItemProduct(item);

    return item.priceAtTime ?? item.price ?? product?.price ?? 0;
};

export const getOrderItemsQuantity = (items?: OrderItem[]) => {
    return items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
};

export const getOrderProductsTotal = (items?: OrderItem[]) => {
    return items?.reduce((sum, item) => sum + getOrderItemPrice(item) * item.quantity, 0) ?? 0;
};
