import { OrderStatus, PaymentStatus } from '@/types/orders';
import { Heart, Mail, PackageCheck, Settings, ShoppingBag, Truck, User } from 'lucide-react';

export const deliveryOptions = [
    {
        icon: Mail,
        title: 'Pochta orqali',
        active: true,
        postDeliveryType: 'POST_OFFICE'
    },
    {
        icon: Truck,
        title: 'Pochtadan uyga olib borib berish',
        active: false,
        postDeliveryType: 'POST_TO_HOME'
    },
    {
        icon: Truck,
        title: 'Kuryer orqali',
        active: false
    },
    {
        icon: PackageCheck,
        title: "Do'kondan olib ketish",
        active: false
    }
];

export const paymentOptions = [
    {
        icon: './images/Paymeuz_logo.png',
        title: 'Payme'
    },
    {
        icon: './images/click_white_logo.png',
        title: 'Click'
    },
    {
        icon: './images/xazna_logo.png',
        title: 'Xazna'
    },
    {
        icon: '',
        title: 'Naqd'
    }
];

export const LANGUAGE_OPTIONS = [
    { value: '', label: 'Barcha tillar' },
    { value: 'uz', label: 'Ozbekcha' },
    { value: 'kr', label: 'Kirilcha' },
    { value: 'ru', label: 'Ruscha' },
    { value: 'en', label: 'Inglizcha' }
] as const;


export const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
    DELIVERED: {
        label: 'Yetkazib berildi',
        className:
            'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
    },
    PROCESSING: {
        label: 'Qabul qilindi',
        className: 'bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20'
    },
    CONFIRMED: {
        label: 'Qabul qilindi',
        className: 'bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20'
    },
    PACKED: {
        label: 'Tayyorlanmoqda',
        className: 'bg-cyan-50 text-cyan-700 ring-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/20'
    },
    DELIVERING: {
        label: "Yo'lda",
        className:
            'bg-violet-50 text-violet-700 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20'
    },
    SHIPPED: {
        label: "Yo'lda",
        className:
            'bg-violet-50 text-violet-700 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20'
    },
    CANCELLED: {
        label: 'Bekor qilindi',
        className: 'bg-red-50 text-red-600 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20'
    },
    PENDING: {
        label: 'Kutilmoqda',
        className:
            'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20'
    }
};

export const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
    PAID: {
        label: "To'landi",
        className:
            'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
    },
    PENDING: {
        label: "To'lov kutilmoqda",
        className:
            'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20'
    },
    FAILED: {
        label: "To'lov bekor bo'ldi",
        className: 'bg-red-50 text-red-600 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20'
    }
};

export const profileTabs = [
    { value: 'wishlist', label: 'Mening kitoblarim', icon: Heart },
    { value: 'orders', label: 'Buyurtmalar', icon: ShoppingBag },
    { value: 'settings', label: 'Sozlamalar', icon: Settings }
];
