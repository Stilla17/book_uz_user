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
    MapPinned,
    MessageCircleQuestionMark,
    MessageSquareText,
    Newspaper,
    PenLine,
    Percent,
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
        label: 'nav.promo',
        href: '/promo',
        icon: <Gift size={14} />,
        description: 'Chegirmalar va aksiyalar'
    },
    {
        label: 'nav.new',
        href: '/catalog?sort=-createdAt',
        icon: <Star size={14} />,
        description: 'Yangi kitoblar'
    },
    {
        label: 'nav.popular',
        href: '/catalog?sort=-ratingAvg',
        icon: <TrendingUp size={14} />,
        description: "Eng ko'p o'qilgan"
    },
    {
        label: 'nav.discount',
        href: '/catalog?isDiscount=true',
        icon: <Percent size={14} />,
        description: 'Chegirmadagi kitoblar'
    },
    {
        label: 'nav.top100',
        href: '/catalog?isTop=true',
        icon: <Award size={14} />,
        description: 'Eng yaxshi kitoblar'
    }
];

export const mainNav = [
    { label: 'nav.books', href: '/catalog' },
    { label: 'nav.authors', href: '/authors' },
    { label: 'nav.publishers', href: '/publishers' },
    { label: 'nav.news', href: '/news' },
    { label: 'nav.about', href: '/about' },
    { label: 'nav.services', href: '/service' }
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
        href: '/checkout',
        description: 'serviceItems.delivery.description'
    },
    {
        icon: <CreditCard size={16} />,
        label: 'serviceItems.payment.label',
        href: '/checkout',
        description: 'serviceItems.payment.description'
    },
    {
        icon: <Shield size={16} />,
        label: 'serviceItems.guarantee.label',
        href: '/about',
        description: 'serviceItems.guarantee.description'
    },
    {
        icon: <Headphones size={16} />,
        label: 'serviceItems.contact.label',
        href: '/about',
        description: 'serviceItems.contact.description'
    },
    {
        icon: <HelpCircle size={16} />,
        label: 'serviceItems.faq.label',
        href: '/about',
        description: 'serviceItems.faq.description'
    },
    {
        icon: <FileText size={16} />,
        label: 'serviceItems.terms.label',
        href: '/about',
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
        label: 'Filyallar',
        href: '/admin/branches',
        icon: MapPinned
    },
    {
        label: 'Banner',
        href: '/admin/banners',
        icon: ImageIcon
    },
    {
        label: 'Promo kod',
        href: '/admin/promo',
        icon: TicketPercent
    },
    {
        label: 'Chegirmalar',
        href: '/admin/discount',
        icon: Percent
    },
    {
        label: 'Kommentariya',
        href: '/admin/comments',
        icon: MessageSquareText
    },
    {
        label: 'Faq',
        href: '/admin/faq',
        icon: MessageCircleQuestionMark
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
        label: 'Mijozlar',
        href: '/admin/users',
        icon: Users
    },
    {
        label: 'Sozlamalar',
        href: '/admin/settings',
        icon: Settings
    }
];
