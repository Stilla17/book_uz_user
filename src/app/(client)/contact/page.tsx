'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StoreLocation } from '@/types';

import { AnimatePresence, motion } from 'framer-motion';
import {
    Award,
    BookOpen,
    CheckCircle,
    ChevronRight,
    Clock,
    Cloud,
    Coffee,
    Compass,
    CreditCard,
    Crown,
    Eye,
    Facebook,
    Flower2,
    Gem,
    Gift,
    Globe,
    Headphones,
    Heart,
    HelpCircle,
    Instagram,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    Moon,
    Navigation,
    Package,
    Phone,
    Send,
    Shield,
    ShoppingBag,
    Sparkles,
    Star,
    Store,
    Sun,
    ThumbsUp,
    TrendingUp,
    Truck,
    Users,
    X,
    Youtube,
    Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Telegram icon component
const TelegramContactIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => {
    return (
        <svg
            width={size}
            height={size}
            className={className}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'>
            <path d='m22 2-7 20-4-9-9-4Z' />
            <path d='M22 2 11 13' />
        </svg>
    );
};

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string>('tashkent');
    const [showMap, setShowMap] = useState(false);
    const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Floating icons array
    const floatingIcons = [
        Headphones,
        MessageCircle,
        Phone,
        Mail,
        Globe,
        Store,
        Star,
        Crown,
        Zap,
        Gem,
        Flower2,
        Sun,
        Moon,
        Cloud,
        Coffee,
        Compass,
        TrendingUp
    ];

    // Do'kon lokatsiyalari
    const stores: StoreLocation[] = [
        {
            id: 'tashkent',
            city: 'Toshkent',
            region: 'Chilonzor tumani',
            address: '19-kvartal, 45-uy',
            phone: '+998 (71) 234-56-78',
            workingHours: '09:00 - 22:00',
            coordinates: '41.311512,69.279728',
            image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073',
            isMain: true,
            books: 15000
        },
        {
            id: 'samarkand',
            city: 'Samarqand',
            region: 'Markaziy tuman',
            address: "Registon ko'chasi, 15-uy",
            phone: '+998 (66) 233-44-55',
            workingHours: '09:00 - 20:00',
            coordinates: '39.6542,66.9597',
            image: 'https://images.unsplash.com/photo-1604719311686-9c5b6c5e5b5d?q=80&w=2070',
            books: 8500
        },
        {
            id: 'bukhara',
            city: 'Buxoro',
            region: 'Markaz',
            address: "Haqiqat ko'chasi, 7-uy",
            phone: '+998 (65) 222-33-44',
            workingHours: '09:00 - 20:00',
            coordinates: '39.7681,64.4556',
            image: 'https://images.unsplash.com/photo-1604719311666-9c5b6c5e5b5d?q=80&w=2070',
            books: 7200
        },
        {
            id: 'khiva',
            city: 'Xiva',
            region: "Ichan-Qal'a",
            address: "Pahlavon Mahmud ko'chasi, 12-uy",
            phone: '+998 (62) 377-88-99',
            workingHours: '09:00 - 19:00',
            coordinates: '41.3785,60.3640',
            image: 'https://images.unsplash.com/photo-1604719311666-9c5b6c5e5b5d?q=80&w=2070',
            books: 5400
        },
        {
            id: 'andijan',
            city: 'Andijon',
            region: 'Bobur tumani',
            address: "Navoiy ko'chasi, 23-uy",
            phone: '+998 (74) 233-44-55',
            workingHours: '09:00 - 20:00',
            coordinates: '40.7828,72.3442',
            image: 'https://images.unsplash.com/photo-1604719311666-9c5b6c5e5b5d?q=80&w=2070',
            books: 6800
        },
        {
            id: 'namangan',
            city: 'Namangan',
            region: 'Markaz',
            address: "Uychi ko'chasi, 5-uy",
            phone: '+998 (69) 233-22-11',
            workingHours: '09:00 - 20:00',
            coordinates: '41.0011,71.6726',
            image: 'https://images.unsplash.com/photo-1604719311666-9c5b6c5e5b5d?q=80&w=2070',
            books: 6100
        },
        {
            id: 'fergana',
            city: "Farg'ona",
            region: 'Markaz',
            address: "Al-Farg'oniy ko'chasi, 8-uy",
            phone: '+998 (73) 244-55-66',
            workingHours: '09:00 - 20:00',
            coordinates: '40.3894,71.7863',
            image: 'https://images.unsplash.com/photo-1604719311666-9c5b6c5e5b5d?q=80&w=2070',
            books: 5900
        },
        {
            id: 'nukus',
            city: 'Nukus',
            region: 'Markaz',
            address: "Qaraqalpaqstan ko'chasi, 1-uy",
            phone: '+998 (61) 222-33-44',
            workingHours: '09:00 - 19:00',
            coordinates: '42.4619,59.6167',
            image: 'https://images.unsplash.com/photo-1604719311666-9c5b6c5e5b5d?q=80&w=2070',
            books: 4800
        }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Iltimos, barcha maydonlarni to'ldiring");
            return;
        }

        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success('Xabaringiz muvaffaqiyatli yuborildi!');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring");
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: <Phone size={24} />,
            title: 'Telefon',
            value: '+998 (90) 123-45-67',
            sub: 'Dushanba - Juma, 09:00 - 22:00',
            color: 'text-[#005CB9] dark:text-blue-400',
            bgColor: 'bg-[#005CB9]/10 dark:bg-blue-600/20',
            link: 'tel:+998901234567'
        },
        {
            icon: <Mail size={24} />,
            title: 'Email',
            value: 'support@book.uz',
            sub: "24/7 qo'llab-quvvatlash",
            color: 'text-[#FF8A00] dark:text-orange-400',
            bgColor: 'bg-[#FF8A00]/10 dark:bg-orange-600/20',
            link: 'mailto:support@book.uz'
        },
        {
            icon: <Globe size={24} />,
            title: 'Veb-sayt',
            value: 'www.book.uz',
            sub: '24/7 onlayn',
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            link: 'https://book.uz'
        },
        {
            icon: <Clock size={24} />,
            title: 'Ish vaqti',
            value: '09:00 - 22:00',
            sub: 'Dushanba - Yakshanba',
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            link: '#'
        }
    ];

    const socialLinks = [
        {
            icon: <Instagram size={20} />,
            name: 'Instagram',
            href: 'https://instagram.com/book.uz',
            color: 'hover:bg-pink-600',
            bg: 'bg-pink-50 dark:bg-pink-900/20',
            text: 'text-pink-600 dark:text-pink-400'
        },
        {
            icon: <Facebook size={20} />,
            name: 'Facebook',
            href: 'https://facebook.com/book.uz',
            color: 'hover:bg-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400'
        },
        {
            icon: <Youtube size={20} />,
            name: 'YouTube',
            href: 'https://youtube.com/@book.uz',
            color: 'hover:bg-red-600',
            bg: 'bg-red-50 dark:bg-red-900/20',
            text: 'text-red-600 dark:text-red-400'
        },
        {
            icon: <TelegramContactIcon size={20} />,
            name: 'Telegram',
            href: 'https://t.me/book_uz',
            color: 'hover:bg-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-500 dark:text-blue-400'
        }
    ];

    const selectedStoreData = stores.find((s) => s.id === selectedCity) || stores[0];

    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 dark:from-slate-900 dark:to-slate-800'>
            {/* Animated Background Elements */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Floating Icons */}
                {[...Array(25)].map((_, i) => {
                    const IconComponent = floatingIcons[i % floatingIcons.length];
                    const randomTop = Math.random() * 100;
                    const randomLeft = Math.random() * 100;
                    const randomFontSize = Math.random() * 40 + 20;

                    return (
                        <motion.div
                            key={i}
                            className='absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10'
                            style={{
                                top: `${randomTop}%`,
                                left: `${randomLeft}%`,
                                fontSize: `${randomFontSize}px`
                            }}
                            animate={{
                                y: [0, -30, 30, 0],
                                x: [0, 30, -30, 0],
                                rotate: [0, 180, 360, 0],
                                opacity: [0.1, 0.3, 0.2, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 20 + 10,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}>
                            <IconComponent />
                        </motion.div>
                    );
                })}

                {/* Gradient Orbs with Parallax */}
                <motion.div
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#00a0e3]/5 blur-3xl'
                />
                <motion.div
                    animate={{
                        x: mousePosition.x * -2,
                        y: mousePosition.y * -2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#ef7f1a]/5 blur-3xl'
                />

                {/* Grid Pattern */}
                <div className='brand-grid' />
            </div>
            <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                {/* Header with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='mb-12 text-center'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className='mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 px-4 py-2 dark:from-blue-600/20 dark:to-orange-600/20'>
                        <Headphones size={16} className='text-[#005CB9] dark:text-blue-400' />
                        <span className='text-xs font-bold text-[#FF8A00] dark:text-orange-400'>ALOQA</span>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='mb-4 text-3xl font-black md:text-5xl'>
                        <span className='bg-gradient-to-r from-[#005CB9] to-[#FF8A00] bg-clip-text text-transparent dark:from-blue-400 dark:to-orange-400'>
                            {" Biz bilan bog'laning "}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400'>
                        {
                            " Savollaringiz bormi? Bizning jamoa sizga yordam berishdan mamnun. Quyidagi ma'lumotlar orqali biz bilan bog'lanishingiz mumkin. "
                        }
                    </motion.p>
                </motion.div>

                {/* Contact Info Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className='mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                    {contactInfo.map((item, index) => (
                        <motion.a
                            key={index}
                            href={item.link}
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className='group rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800/80 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className={`h-12 w-12 ${item.bgColor} mb-4 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110`}>
                                <div className={item.color}>{item.icon}</div>
                            </motion.div>
                            <h3 className='mb-1 text-sm font-bold text-gray-400 uppercase dark:text-gray-500'>
                                {item.title}
                            </h3>
                            <p className='mb-1 text-lg font-black text-gray-900 dark:text-white'>{item.value}</p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>{item.sub}</p>
                        </motion.a>
                    ))}
                </motion.div>

                {/* Store Locations Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className='mb-12'>
                    <div className='mb-6 flex items-center gap-3'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7, type: 'spring' }}
                            className='rounded-2xl bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 p-3 dark:from-blue-600/20 dark:to-orange-600/20'>
                            <Store size={28} className='text-[#005CB9] dark:text-blue-400' />
                        </motion.div>
                        <div>
                            <motion.h2
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className='text-2xl font-black md:text-3xl'>
                                <span className='text-[#005CB9] dark:text-blue-400'>{"Do'konlarimiz"}</span>
                                <span className='text-[#FF8A00] dark:text-orange-400'> manzillari</span>
                            </motion.h2>
                            <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                {stores.length}
                                {" ta shaharda do'konlarimiz mavjud "}
                            </motion.p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                        {/* City List */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.0 }}
                            className='rounded-2xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                            <h3 className='mb-4 flex items-center gap-2 font-black text-gray-900 dark:text-white'>
                                <MapPin size={16} className='text-[#FF8A00] dark:text-orange-400' />
                                Shaharlar
                            </h3>
                            <div className='max-h-96 space-y-2 overflow-y-auto pr-2'>
                                {stores.map((store, index) => (
                                    <motion.button
                                        key={store.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 + 1.1 }}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedCity(store.id)}
                                        className={`flex w-full items-center justify-between rounded-xl p-3 transition-all ${
                                            selectedCity === store.id
                                                ? 'border border-[#005CB9]/20 bg-[#005CB9]/10 dark:border-blue-400/30 dark:bg-blue-600/20'
                                                : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                                        }`}>
                                        <div className='flex items-center gap-3'>
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                                    selectedCity === store.id
                                                        ? 'bg-[#005CB9] text-white dark:bg-blue-600'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                                                }`}>
                                                <Store size={14} />
                                            </div>
                                            <div className='text-left'>
                                                <p
                                                    className={`font-bold ${
                                                        selectedCity === store.id
                                                            ? 'text-[#005CB9] dark:text-blue-400'
                                                            : 'text-gray-900 dark:text-white'
                                                    }`}>
                                                    {store.city}
                                                </p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                    {store.region}
                                                </p>
                                            </div>
                                        </div>
                                        {store.isMain && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className='rounded-full bg-[#FF8A00]/10 px-2 py-1 text-xs text-[#FF8A00] dark:bg-orange-600/20 dark:text-orange-400'>
                                                Asosiy
                                            </motion.span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Store Details */}
                        <div className='lg:col-span-2'>
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={selectedCity}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className='overflow-hidden rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                                    <div className='relative h-48 w-full'>
                                        <Image
                                            src={selectedStoreData.image}
                                            alt={selectedStoreData.city}
                                            fill
                                            className='object-cover'
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                                        <div className='absolute right-4 bottom-4 left-4'>
                                            <h3 className='mb-1 text-xl font-black text-white'>
                                                {selectedStoreData.city}
                                                {" do'koni "}
                                            </h3>
                                            {selectedStoreData.isMain && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className='inline-flex items-center gap-1 rounded-full bg-[#FF8A00] px-2 py-1 text-xs text-white'>
                                                    <Star size={10} />
                                                    Bosh ofis
                                                </motion.span>
                                            )}
                                        </div>
                                    </div>

                                    <div className='p-6'>
                                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                            <div className='space-y-3'>
                                                <motion.div
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                    className='flex items-start gap-3'>
                                                    <MapPin
                                                        size={16}
                                                        className='mt-1 text-[#005CB9] dark:text-blue-400'
                                                    />
                                                    <div>
                                                        <p className='text-sm font-bold text-gray-900 dark:text-white'>
                                                            Manzil
                                                        </p>
                                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                            {selectedStoreData.address}
                                                        </p>
                                                        <p className='text-xs text-gray-400 dark:text-gray-500'>
                                                            {selectedStoreData.region}
                                                        </p>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className='flex items-start gap-3'>
                                                    <Phone
                                                        size={16}
                                                        className='mt-1 text-[#FF8A00] dark:text-orange-400'
                                                    />
                                                    <div>
                                                        <p className='text-sm font-bold text-gray-900 dark:text-white'>
                                                            Telefon
                                                        </p>
                                                        <a
                                                            href={`tel:${selectedStoreData.phone}`}
                                                            className='text-sm text-gray-500 hover:text-[#005CB9] dark:text-gray-400 dark:hover:text-blue-400'>
                                                            {selectedStoreData.phone}
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            </div>

                                            <div className='space-y-3'>
                                                <motion.div
                                                    initial={{ x: 20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className='flex items-start gap-3'>
                                                    <Clock
                                                        size={16}
                                                        className='mt-1 text-green-600 dark:text-green-400'
                                                    />
                                                    <div>
                                                        <p className='text-sm font-bold text-gray-900 dark:text-white'>
                                                            Ish vaqti
                                                        </p>
                                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                            {selectedStoreData.workingHours}
                                                        </p>
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ x: 20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.4 }}
                                                    className='flex items-start gap-3'>
                                                    <BookOpen
                                                        size={16}
                                                        className='mt-1 text-purple-600 dark:text-purple-400'
                                                    />
                                                    <div>
                                                        <p className='text-sm font-bold text-gray-900 dark:text-white'>
                                                            Kitoblar soni
                                                        </p>
                                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                            {selectedStoreData.books.toLocaleString()} dona
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>

                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className='mt-4 border-t border-gray-100 pt-4 dark:border-slate-700'>
                                            <motion.button
                                                whileHover={{ x: 5 }}
                                                onClick={() => setShowMap(!showMap)}
                                                className='flex items-center gap-2 text-[#005CB9] hover:underline dark:text-blue-400'>
                                                <Navigation size={16} />
                                                {" Xaritada ko'rish "}
                                                <ChevronRight
                                                    size={16}
                                                    className={`transform transition-transform ${showMap ? 'rotate-90' : ''}`}
                                                />
                                            </motion.button>

                                            <AnimatePresence>
                                                {showMap && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className='mt-4 aspect-video w-full overflow-hidden rounded-xl'>
                                                        <iframe
                                                            src={`https://www.google.com/maps?q=${selectedStoreData.coordinates}&hl=uz&z=15&output=embed`}
                                                            width='100%'
                                                            height='100%'
                                                            style={{ border: 0 }}
                                                            allowFullScreen
                                                            loading='lazy'
                                                            className='h-full w-full'
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className='rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                        <h2 className='mb-6 flex items-center gap-2 text-xl font-black text-gray-900 dark:text-white'>
                            <Send size={20} className='text-[#005CB9] dark:text-blue-400' />
                            Xabar yuborish
                        </h2>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.3 }}>
                                <label className='text-sm font-bold text-gray-600 dark:text-gray-400'>Ismingiz *</label>
                                <Input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder='Ismingiz'
                                    className='mt-1 border-gray-200 bg-white text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.4 }}>
                                <label className='text-sm font-bold text-gray-600 dark:text-gray-400'>Email *</label>
                                <Input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder='email@example.com'
                                    className='mt-1 border-gray-200 bg-white text-gray-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white'
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.5 }}>
                                <label className='text-sm font-bold text-gray-600 dark:text-gray-400'>Mavzu</label>
                                <select
                                    name='subject'
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className='mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[#005CB9] focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'>
                                    <option value=''>Tanlang...</option>
                                    <option value='Savol'>Savol</option>
                                    <option value='Taklif'>Taklif</option>
                                    <option value='Shikoyat'>Shikoyat</option>
                                    <option value='Hamkorlik'>Hamkorlik</option>
                                    <option value='Boshqa'>Boshqa</option>
                                </select>
                            </motion.div>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.6 }}>
                                <label className='text-sm font-bold text-gray-600 dark:text-gray-400'>Xabar *</label>
                                <textarea
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder='Xabaringizni yozing...'
                                    className='mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-[#005CB9] focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-blue-400'
                                    required
                                />
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.7 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}>
                                <Button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full rounded-xl bg-gradient-to-r from-[#005CB9] to-[#FF8A00] py-6 font-bold text-white transition-all hover:shadow-lg disabled:opacity-50 dark:from-blue-600 dark:to-orange-600 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className='mr-2 animate-spin' />
                                            Yuborilmoqda...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} className='mr-2' />
                                            Xabarni yuborish
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </motion.div>

                    {/* Map & Social */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className='space-y-6'>
                        {/* Map */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.3 }}
                            className='rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                            <h2 className='mb-4 flex items-center gap-2 text-xl font-black text-gray-900 dark:text-white'>
                                <MapPin size={20} className='text-[#005CB9] dark:text-blue-400' />
                                Bosh ofis manzili
                            </h2>

                            <div className='aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-slate-700'>
                                <iframe
                                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.811446534697!2d69.2797285764231!3d41.31151219999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38aef4b3764b1bff%3A0x18a2e7a7b5f5c5c1!2sChilonzor%2019%20Kvartal%2C%20Tashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'
                                    width='100%'
                                    height='100%'
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading='lazy'
                                    referrerPolicy='no-referrer-when-downgrade'
                                    className='h-full w-full'
                                />
                            </div>

                            <div className='mt-4 flex items-center gap-2'>
                                <MapPin size={14} className='text-[#005CB9] dark:text-blue-400' />
                                <p className='text-sm text-gray-600 dark:text-gray-300'>
                                    Toshkent sh., Chilonzor tumani, 19-kvartal, 45-uy
                                </p>
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.4 }}
                            className='rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                            <h2 className='mb-4 flex items-center gap-2 text-xl font-black text-gray-900 dark:text-white'>
                                <MessageCircle size={20} className='text-[#FF8A00] dark:text-orange-400' />
                                Ijtimoiy tarmoqlar
                            </h2>

                            <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 + 1.5 }}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        className={`flex flex-col items-center gap-2 p-4 ${social.bg} rounded-xl transition-all hover:text-white ${social.color} group`}>
                                        <div className={social.text + ' group-hover:text-white'}>{social.icon}</div>
                                        <span className={`text-xs font-bold ${social.text} group-hover:text-white`}>
                                            {social.name}
                                        </span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* FAQ */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.6 }}
                            className='rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                            <h2 className='mb-4 flex items-center gap-2 text-xl font-black text-gray-900 dark:text-white'>
                                <HelpCircle size={20} className='text-[#005CB9] dark:text-blue-400' />
                                {" Tez-tez so'raladigan savollar "}
                            </h2>

                            <div className='space-y-3'>
                                {[
                                    {
                                        q: 'Kitobni qanday qaytarish mumkin?',
                                        a: "Agar kitobda nuqson bo'lsa, 14 kun ichida bepul almashtirib beramiz."
                                    },
                                    {
                                        q: 'Yetkazib berish necha kun davom etadi?',
                                        a: "Toshkent bo'ylab 1-2 kun, viloyatlarga 3-5 kun."
                                    },
                                    {
                                        q: "Qanday to'lov turlari mavjud?",
                                        a: 'Naqd, karta orqali, Click, Payme, Apelsin.'
                                    }
                                ].map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 + 1.7 }}
                                        whileHover={{ scale: 1.02 }}
                                        className='rounded-xl bg-gray-50 p-4 dark:bg-slate-700/50'>
                                        <h3 className='mb-2 font-bold text-gray-900 dark:text-white'>{faq.q}</h3>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>{faq.a}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div whileHover={{ x: 5 }}>
                                <Link
                                    href='/faq'
                                    className='mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#005CB9] transition-colors hover:text-[#FF8A00] dark:text-blue-400 dark:hover:text-orange-400'>
                                    Barcha savollar
                                    <ChevronRight size={14} />
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                    className='mt-12 grid grid-cols-2 gap-4 md:grid-cols-4'>
                    {[
                        {
                            icon: <Headphones size={24} />,
                            value: '24/7',
                            label: "Qo'llab-quvvatlash",
                            color: 'text-[#005CB9] dark:text-blue-400'
                        },
                        {
                            icon: <Clock size={24} />,
                            value: '15 min',
                            label: "O'rtacha javob",
                            color: 'text-[#FF8A00] dark:text-orange-400'
                        },
                        {
                            icon: <Users size={24} />,
                            value: '50k+',
                            label: 'Mamnun mijozlar',
                            color: 'text-green-600 dark:text-green-400'
                        },
                        {
                            icon: <Award size={24} />,
                            value: '98%',
                            label: 'Mijozlar mamnuniyati',
                            color: 'text-purple-600 dark:text-purple-400'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 1.9 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className='rounded-xl border border-gray-100 bg-white/80 p-6 text-center backdrop-blur-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                            <div className={stat.color + ' mb-2'}>{stat.icon}</div>
                            <div className='text-2xl font-black text-gray-900 dark:text-white'>{stat.value}</div>
                            <div className='text-xs text-gray-400 dark:text-gray-500'>{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Info Icons with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2 }}
                    className='mt-8 grid grid-cols-3 gap-2 text-center text-xs'>
                    {[
                        { icon: Truck, text: 'Bepul yetkazish' },
                        { icon: Shield, text: "Xavfsiz to'lov" },
                        { icon: Headphones, text: "24/7 qo'llab-quvvatlash" }
                    ].map((item, index) => (
                        <motion.div key={index} whileHover={{ y: -5 }} className='p-2'>
                            <item.icon size={16} className='mx-auto mb-1 text-gray-400 dark:text-gray-500' />
                            <span className='text-gray-400 dark:text-gray-500'>{item.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
