import { OtherPagination } from '@/services/api';
import { Book } from '@/types/book';

export interface ShippingAddress {
    city: string;
    phone: string;
    region: string;
    street: string;
}

export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'PACKED'
    | 'SHIPPED'
    | 'DELIVERING'
    | 'DELIVERED'
    | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type PaymentType = 'PAYME' | 'CLICK' | 'CASH';

export interface OrderItem {
    product: string | Book;
    quantity: number;
    price?: number;
    priceAtTime?: number;
}

export interface Order {
    _id: string;
    guestName: string;
    totalAmount: number;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    description: string;
    discountAmount: number;
    deliveryType: 'DELIVERY' | 'PICKUP' | 'POST';
    postDeliveryType?: 'POST_OFFICE' | 'POST_TO_HOME';
    paymentType: PaymentType;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    deliveryFee: number;
    createdAt: string;
    updatedAt: string;
    orderNumber: number;
}

export interface OrdersResponse {
    orders: Order[];
    pagination: OtherPagination;
}
