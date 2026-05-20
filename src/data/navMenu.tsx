import React from 'react';

import { NavItem } from '@/types';

import {
    Award,
    BookOpen,
    Building2,
    CreditCard,
    FileText,
    Gift,
    Handshake,
    Headphones,
    HelpCircle,
    ImageIcon,
    Info,
    LayoutDashboard,
    Mail,
    MessageSquareText,
    Newspaper,
    PenLine,
    Percent,
    Quote,
    Settings,
    Shield,
    ShoppingCart,
    Star,
    Tags,
    TicketPercent,
    TrendingUp,
    Truck,
    Users
} from 'lucide-react';

// Bottom Navigation - to'liq jonlantirilgan (8 ta)
export const bottomNav: NavItem[] = [
    {
        label: 'Promokod',
        href: '/promo',
        icon: <Gift size={14} />,
        description: 'Chegirmalar va aksiyalar'
    },
    {
        label: 'Yangi',
        href: '/catalog?sort=-createdAt',
        icon: <Star size={14} />,
        description: 'Yangi kitoblar'
    },
    {
        label: 'Mashhur',
        href: '/catalog?sort=-ratingAvg',
        icon: <TrendingUp size={14} />,
        description: "Eng ko'p o'qilgan"
    },
    {
        label: 'Chegirma',
        href: '/catalog?isDiscount=true',
        icon: <Percent size={14} />,
        description: 'Chegirmadagi kitoblar'
    },
    {
        label: 'Top 100',
        href: '/catalog?isTop=true',
        icon: <Award size={14} />,
        description: 'Eng yaxshi kitoblar'
    },
    {
        label: "Sovg'a",
        href: '/gift-cards',
        icon: <Gift size={14} />,
        description: "Sovg'a kartalari"
    }
];

export const serviceMenuItems = [
    {
        icon: <Info size={16} />,
        label: 'serviceItems.about.label',
        href: '/about',
        description: 'serviceItems.about.description'
    },
    {
        icon: <Truck size={16} />,
        label: 'serviceItems.delivery.label',
        href: '/delivery',
        description: 'serviceItems.delivery.description'
    },
    {
        icon: <CreditCard size={16} />,
        label: 'serviceItems.payment.label',
        href: '/payment',
        description: 'serviceItems.payment.description'
    },
    {
        icon: <Shield size={16} />,
        label: 'serviceItems.guarantee.label',
        href: '/guarantee',
        description: 'serviceItems.guarantee.description'
    },
    {
        icon: <Headphones size={16} />,
        label: 'serviceItems.contact.label',
        href: '/contact',
        description: 'serviceItems.contact.description'
    },
    {
        icon: <HelpCircle size={16} />,
        label: 'serviceItems.faq.label',
        href: '/faq',
        description: 'serviceItems.faq.description'
    },
    {
        icon: <FileText size={16} />,
        label: 'serviceItems.terms.label',
        href: '/terms',
        description: 'serviceItems.terms.description'
    },
    {
        icon: <Mail size={16} />,
        label: 'serviceItems.news.label',
        href: '/news',
        description: 'serviceItems.news.description'
    }
];

export const menuItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard
    },
    {
        label: 'Kitoblar',
        href: '/admin/book',
        icon: BookOpen
    },
    {
        label: 'Janrlar',
        href: '/admin/genre',
        icon: Tags
    },
    {
        label: 'Nashriyotlar',
        href: '/admin/publishers',
        icon: Building2
    },
    {
        label: 'Mualliflar',
        href: '/admin/authors',
        icon: PenLine
    },
    {
        label: 'Yangiliklar',
        href: '/admin/news',
        icon: Newspaper
    },
    {
        label: 'Banner',
        href: '/admin/banners',
        icon: ImageIcon
    },
    {
        label: 'Promo kod',
        href: '/admin/promo-codes',
        icon: TicketPercent
    },
    {
        label: 'Kommentariya',
        href: '/admin/comments',
        icon: MessageSquareText
    },
    {
        label: 'Iqtibos',
        href: '/admin/quotes',
        icon: Quote
    },
    {
        label: 'Partners',
        href: '/admin/partners',
        icon: Handshake
    },
    {
        label: 'Buyurtmalar',
        href: '/admin/orders',
        icon: ShoppingCart
    },
    {
        label: 'Foydalanuvchilar',
        href: '/admin/users',
        icon: Users
    },
    {
        label: 'Sozlamalar',
        href: '/admin/settings',
        icon: Settings
    }
];