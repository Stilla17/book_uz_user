import { Mail, PackageCheck, Truck } from 'lucide-react';

export const deliveryOptions = [
    {
        icon: Mail,
        title: 'Pochta orqali',
        active: true
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
    }
];
