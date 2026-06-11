import { OrderItem } from '@/types/orders';

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
