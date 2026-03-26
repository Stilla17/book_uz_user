import React from 'react';
import { Gift, Star, TrendingUp, Percent, Award, Download } from 'lucide-react';
import { ICategory, NavItem } from '@/types/nav.types';

// Mock kategoriyalar (10 ta - admin qo'shmagan bo'lsa)
// export const mockCategories: ICategory[] = [
//     { _id: '1', name: { uz: 'Detektiv', ru: 'Детективы' }, slug: 'detektiv', icon: '🔍', count: 1240 },
//     { _id: '2', name: { uz: 'Fantastika', ru: 'Фантастика' }, slug: 'fantastika', icon: '🚀', count: 892 },
//     { _id: '3', name: { uz: 'Fentezi', ru: 'Фэнтези' }, slug: 'fentezi', icon: '🧙', count: 756 },
//     { _id: '4', name: { uz: 'Roman', ru: 'Романы' }, slug: 'roman', icon: '💕', count: 1450 },
//     { _id: '5', name: { uz: 'Psixologiya', ru: 'Психология' }, slug: 'psixologiya', icon: '🧠', count: 856 },
//     { _id: '6', name: { uz: 'Tarix', ru: 'История' }, slug: 'tarix', icon: '📜', count: 623 },
//     { _id: '7', name: { uz: 'Biznes', ru: 'Бизнес' }, slug: 'biznes', icon: '💼', count: 432 },
//     { _id: '8', name: { uz: 'Bolalar', ru: 'Детские' }, slug: 'bolalar', icon: '🧸', count: 289 },
//     { _id: '9', name: { uz: 'Ilmiy', ru: 'Научные' }, slug: 'ilmiy', icon: '🔬', count: 567 },
//     { _id: '10', name: { uz: "She'riyat", ru: 'Поэзия' }, slug: 'she-riyat', icon: '📝', count: 345 },
// ];



// Bottom Navigation - to'liq jonlantirilgan (8 ta)
export const bottomNav: NavItem[] = [
    {
        label: 'Promokod',
        href: '/promo',
        icon: <Gift size={14} />,
        description: 'Chegirmalar va aksiyalar',
        color: 'text-purple-500',
    },
    {
        label: 'Yangi',
        href: '/catalog?sort=-createdAt',
        icon: <Star size={14} />,
        description: 'Yangi kitoblar',
        color: 'text-blue-500',
    },
    {
        label: 'Mashhur',
        href: '/catalog?sort=-ratingAvg',
        icon: <TrendingUp size={14} />,
        description: "Eng ko'p o'qilgan",
        color: 'text-red-500',
    },
    {
        label: 'Chegirma',
        href: '/catalog?isDiscount=true',
        icon: <Percent size={14} />,
        description: 'Chegirmadagi kitoblar',
        color: 'text-green-500',
    },
    {
        label: 'Top 100',
        href: '/catalog?isTop=true',
        icon: <Award size={14} />,
        description: 'Eng yaxshi kitoblar',
        color: 'text-yellow-500',
    },
    {
        label: "Sovg'a",
        href: '/gift-cards',
        icon: <Gift size={14} />,
        description: "Sovg'a kartalari",
        color: 'text-pink-500',
    },
    {
        label: 'Bepul',
        href: '/catalog?price=0',
        icon: <Download size={14} />,
        description: 'Bepul kitoblar',
        color: 'text-teal-500',
    },
];


