'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    BookMarked,
    BookOpen,
    Clock,
    FileQuestion,
    Headphones,
    Heart,
    Home,
    Mail,
    Phone,
    Search,
    ShoppingBag,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

// Random book facts array
const bookFacts = [
    { fact: 'Dunyodagi eng qimmat kitob 30 million dollarga sotilgan', emoji: '💰' },
    { fact: 'Eng katta kutubxonada 170 million dan ortiq kitob bor', emoji: '📚' },
    { fact: "O'rtacha kitob 300-400 sahifadan iborat", emoji: '📖' },
    { fact: 'Dunyoda har kuni 4000 dan ortiq kitob nashr etiladi', emoji: '🌍' },
    { fact: 'Eng qadimgi kitob 2500 yil oldin yozilgan', emoji: '🕰️' },
    { fact: "O'zbekistonda yiliga 2000 dan ortiq kitob nashr qilinadi", emoji: '🇺🇿' },
    { fact: "Audio kitoblar tinglash kitob o'qishdan 2 barobar tez", emoji: '🎧' },
    { fact: "Dunyo aholisining 15% kitob o'qishni yoqtirmaydi", emoji: '😴' },
    { fact: "Eng ko'p o'qilgan kitob - Bibliya", emoji: '📖' },
    { fact: 'Harry Potter kitoblari 500 million nusxada sotilgan', emoji: '⚡' },
    { fact: "O'zbekistonda eng ko'p o'qilgan muallif - Alisher Navoiy", emoji: '🖋️' },
    { fact: "Kitob o'qish stressni 68% ga kamaytiradi", emoji: '😌' },
    { fact: "Haftada 3 soat kitob o'qish umrni 2 yilga uzaytiradi", emoji: '⏳' },
    { fact: "Elektron kitoblar 1971-yilda paydo bo'lgan", emoji: '💻' },
    { fact: 'Eng kichik kitob tuz donasidek', emoji: '🔬' }
];

export default function NotFound() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [randomFact, setRandomFact] = useState(bookFacts[0]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentIconIndex, setCurrentIconIndex] = useState(0);

    // Change random fact every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * bookFacts.length);
            setRandomFact(bookFacts[randomIndex]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className='bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 dark:bg-slate-900'>
            <div className='relative z-10 container mx-auto max-w-4xl text-center'>
                {/* Main 404 Text with Parallax */}
                <motion.div
                    animate={{
                        x: mousePosition.x,
                        y: mousePosition.y
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='relative mb-8'>
                    <div className='bg-gradient-to-r from-blue-600 via-orange-500 to-pink-600 bg-clip-text text-[150px] leading-none font-black text-transparent select-none md:text-[250px] dark:from-blue-400 dark:via-orange-400 dark:to-pink-400'>
                        404
                    </div>

                    {/* Glitch Effect */}
                    <motion.div
                        animate={{
                            x: [0, -10, 10, -5, 5, 0],
                            opacity: [0, 0.5, 0, 0.3, 0, 0]
                        }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                        className='absolute top-0 left-0 w-full text-[150px] leading-none font-black text-red-500/30 select-none md:text-[250px] dark:text-red-400/30'>
                        404
                    </motion.div>
                    <motion.div
                        animate={{
                            x: [0, 10, -10, 5, -5, 0],
                            opacity: [0, 0.5, 0, 0.3, 0, 0]
                        }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5, delay: 0.2 }}
                        className='absolute top-0 left-0 w-full text-[150px] leading-none font-black text-blue-500/30 select-none md:text-[250px] dark:text-blue-400/30'>
                        404
                    </motion.div>

                    {/* Decorative Elements */}
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className='absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/10 to-orange-500/10 blur-2xl'
                    />

                    <motion.div
                        animate={{
                            rotate: [360, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className='absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-2xl'
                    />

                    {/* Floating Badges */}
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className='absolute top-0 right-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl md:right-20 dark:border-slate-700 dark:bg-slate-800'>
                        <BookOpen className='h-8 w-8 text-blue-500' />
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                        className='absolute bottom-0 left-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl md:left-20 dark:border-slate-700 dark:bg-slate-800'>
                        <Headphones className='h-8 w-8 text-orange-500' />
                    </motion.div>
                </motion.div>

                {/* Title with Typewriter Effect */}
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='mb-4 text-4xl font-black text-gray-900 md:text-5xl dark:text-white'>
                    <span className='bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-orange-400'>
                        Sahifa topilmadi
                    </span>
                </motion.h1>

                {/* Description with Animated Text */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='relative'>
                    <p className='mx-auto mb-4 max-w-2xl text-lg text-gray-600 md:text-xl dark:text-gray-400'>
                        {" Kechirasiz, siz qidirgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin. "}
                    </p>
                    <p className='mx-auto max-w-xl text-base text-gray-500 dark:text-gray-500'>
                        Bosh sahifaga qaytib, 50,000+ kitoblar olamini kashf etishni davom ettiring.
                    </p>
                </motion.div>

                {/* Random Fact Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className='mx-auto mt-8 mb-10 max-w-md'>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={randomFact.fact}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className='rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-orange-50 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-orange-900/20'>
                            <div className='flex items-center gap-3'>
                                <span className='text-4xl'>{randomFact.emoji}</span>
                                <div className='flex-1 text-left'>
                                    <p className='mb-1 text-xs font-bold text-blue-600 dark:text-blue-400'>
                                        BILASIZMI?
                                    </p>
                                    <p className='text-sm text-gray-700 dark:text-gray-300'>{randomFact.fact}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Quick Links Grid */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className='mx-auto mb-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4'>
                    {[
                        { icon: <Home size={20} />, label: 'Bosh sahifa', href: '/', color: 'blue' },
                        { icon: <BookOpen size={20} />, label: 'Kitoblar', href: '/catalog', color: 'orange' },
                        {
                            icon: <Headphones size={20} />,
                            label: 'Audio',
                            href: '/catalog?format=audio',
                            color: 'green'
                        },
                        {
                            icon: <Sparkles size={20} />,
                            label: 'Yangiliklar',
                            href: '/catalog?sort=-createdAt',
                            color: 'purple'
                        },
                        {
                            icon: <TrendingUp size={20} />,
                            label: 'Mashhur',
                            href: '/catalog?sort=-ratingAvg',
                            color: 'red'
                        },
                        { icon: <Heart size={20} />, label: 'Sevimlilar', href: '/wishlist', color: 'pink' },
                        { icon: <ShoppingBag size={20} />, label: 'Savat', href: '/cart', color: 'amber' },
                        { icon: <BookMarked size={20} />, label: 'Kitoblarim', href: '/my-books', color: 'indigo' }
                    ].map((item, index) => {
                        const colorClasses = {
                            blue: 'hover:border-blue-500 hover:text-blue-500',
                            orange: 'hover:border-orange-500 hover:text-orange-500',
                            green: 'hover:border-green-500 hover:text-green-500',
                            purple: 'hover:border-purple-500 hover:text-purple-500',
                            red: 'hover:border-red-500 hover:text-red-500',
                            pink: 'hover:border-pink-500 hover:text-pink-500',
                            amber: 'hover:border-amber-500 hover:text-amber-500',
                            indigo: 'hover:border-indigo-500 hover:text-indigo-500'
                        };

                        return (
                            <motion.div key={index} whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href={item.href}
                                    className={`flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${colorClasses[item.color as keyof typeof colorClasses]} group transition-all`}>
                                    <div
                                        className={`rounded-lg bg-gray-50 p-2 text-gray-600 dark:bg-slate-700 dark:text-gray-400 group-hover:text-${item.color}-500 group-hover:bg-${item.color}-50 dark:group-hover:bg-${item.color}-900/20 transition-all`}>
                                        {item.icon}
                                    </div>
                                    <span className='text-xs font-bold text-gray-600 group-hover:text-inherit dark:text-gray-400'>
                                        {item.label}
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Search Bar */}
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    onSubmit={handleSearch}
                    className='mx-auto mb-10 max-w-md'>
                    <div className='group relative'>
                        <Input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Kitob nomi, muallif yoki janr...'
                            className='w-full rounded-xl border-2 border-gray-200 bg-white py-6 pr-24 pl-12 transition-all group-hover:shadow-lg focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-blue-400'
                        />
                        <Search
                            size={18}
                            className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-blue-500'
                        />
                        <Button
                            type='submit'
                            className='absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-gradient-to-r from-blue-600 to-orange-600 px-6 py-4 text-white hover:from-blue-700 hover:to-orange-700'>
                            Qidirish
                        </Button>
                    </div>
                </motion.form>

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className='flex flex-col justify-center gap-4 sm:flex-row'>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => router.back()}
                            variant='outline'
                            className='flex items-center gap-2 border-2 border-gray-200 px-8 py-6 text-base transition-all hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:hover:border-blue-400 dark:hover:text-blue-400'>
                            <ArrowLeft size={18} />
                            Ortga qaytish
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href='/'>
                            <Button className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-600 px-8 py-6 text-base text-white shadow-lg transition-all hover:from-blue-700 hover:to-orange-700 hover:shadow-xl'>
                                <Home size={18} />
                                {" Bosh sahifaga o'tish "}
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className='mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3'>
                    <a
                        href='tel:+998901234567'
                        className='flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'>
                        <Phone size={14} />
                        +998 (90) 123-45-67
                    </a>
                    <a
                        href='mailto:support@book.uz'
                        className='flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'>
                        <Mail size={14} />
                        support@book.uz
                    </a>
                    <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                        <Clock size={14} />
                        09:00 - 22:00
                    </div>
                </motion.div>

                {/* Fun Fact Counter */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className='mt-8 flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500'>
                    <FileQuestion size={14} />
                    <span>Kutubxonamizda 50,000+ kitob va 10,000+ audio kitob mavjud</span>
                </motion.div>
            </div>
        </div>
    );
}
