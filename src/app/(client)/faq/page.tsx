'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    CheckCircle,
    ChevronDown,
    Clock,
    CreditCard,
    Eye,
    Headphones,
    HelpCircle,
    Mail,
    MessageCircle,
    Package,
    Phone,
    RotateCcw,
    Search,
    Send,
    Shield,
    Sparkles,
    Star,
    Truck,
    X
} from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
    views?: number;
    helpful?: number;
}

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState<number[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [helpfulFeedback, setHelpfulFeedback] = useState<{ [key: number]: boolean }>({});

    const faqs: FAQItem[] = [
        {
            question: 'Kitobni qanday qaytarish mumkin?',
            answer: "Agar kitobda bosma nuqsonlar bo'lsa yoki yetkazib berishda zarar ko'rgan bo'lsa, 14 kun ichida kvitansiya bilan birga bepul almashtirib beramiz. Buning uchun do'konimizga murojaat qilishingiz yoki support@book.uz ga xabar yozishingiz mumkin. Qaytarish jarayoni odatda 3-5 ish kunini oladi.",
            category: 'qaytarish',
            views: 1243,
            helpful: 89
        },
        {
            question: 'Audio kitobni qanday tinglash mumkin?',
            answer: "Sotib olingan audio kitoblar shaxsiy kabinetingizdagi 'Mening kutubxonam' bo'limida paydo bo'ladi. Ularni onlayn yoki oflayn (yuklab olib) tinglashingiz mumkin. Mobil ilovamiz orqali ham tinglash imkoniyati mavjud. Audio kitoblarni tinglash uchun internet tezligi kamida 2 Mbit/s bo'lishi tavsiya etiladi.",
            category: 'audio',
            views: 987,
            helpful: 76
        },
        {
            question: 'Yetkazib berish narxi qancha?',
            answer: "Toshkent shahri ichida standart yetkazib berish 15,000 so'm. 300,000 so'mdan yuqori xaridlar uchun yetkazib berish mutlaqo bepul! Viloyatlarga yetkazib berish narxi 20,000-35,000 so'm oralig'ida. Ekspress yetkazib berish (1-2 kun) qo'shimcha 20,000 so'm turadi.",
            category: 'yetkazish',
            views: 2156,
            helpful: 94
        },
        {
            question: "Qanday to'lov turlari mavjud?",
            answer: "Bizda quyidagi to'lov turlari mavjud: naqd pul (yetkazib berishda), bank kartalari (Visa, Uzcard, Humo), onlayn to'lov tizimlari (Click, Payme, Apelsin). Barcha to'lovlar xavfsiz. Onlayn to'lovlar uchun qo'shimcha komissiya olinmaydi.",
            category: 'tolov',
            views: 1876,
            helpful: 92
        },
        {
            question: 'Buyurtmamni qanday kuzatishim mumkin?',
            answer: "Buyurtma berilgandan so'ng, shaxsiy kabinetingizdagi 'Buyurtmalarim' bo'limida buyurtma holatini kuzatishingiz mumkin. Har bir buyurtma uchun tracking raqami beriladi. Tracking raqami orqali pochta xizmati saytida ham buyurtmangizni kuzatishingiz mumkin.",
            category: 'buyurtma',
            views: 1432,
            helpful: 88
        },
        {
            question: "Elektron kitoblarni qanday qurilmalarda o'qish mumkin?",
            answer: "Elektron kitoblarni kompyuter, planshet, smartfon va maxsus o'quv qurilmalarida (PocketBook, Kindle) o'qishingiz mumkin. Bizning mobil ilovamiz barcha platformalarda mavjud. PDF, EPUB, FB2 va MOBI formatlari qo'llab-quvvatlanadi.",
            category: 'format',
            views: 765,
            helpful: 71
        },
        {
            question: 'Promokodni qanday ishlatish mumkin?',
            answer: "Promokodni savat sahifasida maxsus maydonga kiritishingiz kerak. Promokod qo'llanilgandan so'ng, chegirma avtomatik ravishda hisoblanadi. Har bir promokod faqat bir marta ishlatilishi mumkin va amal qilish muddati mavjud.",
            category: 'chegirma',
            views: 654,
            helpful: 67
        },
        {
            question: "Kitobni do'kondan olib ketish mumkinmi?",
            answer: "Ha, albatta. Buyurtma berishda 'Do'kondan olib ketish' variantini tanlashingiz mumkin. Buyurtma tayyor bo'lgach, sizga SMS orqali xabar beramiz. Olib ketish punktlarimiz: Toshkent, Samarqand, Buxoro, Andijon va Farg'ona shaharlarida mavjud.",
            category: 'yetkazish',
            views: 543,
            helpful: 63
        }
    ];

    const categories = [
        { id: 'all', name: 'Barchasi', icon: <HelpCircle size={16} />, count: faqs.length },
        {
            id: 'yetkazish',
            name: 'Yetkazib berish',
            icon: <Truck size={16} />,
            count: faqs.filter((f) => f.category === 'yetkazish').length
        },
        {
            id: 'tolov',
            name: "To'lov",
            icon: <CreditCard size={16} />,
            count: faqs.filter((f) => f.category === 'tolov').length
        },
        {
            id: 'qaytarish',
            name: 'Qaytarish',
            icon: <RotateCcw size={16} />,
            count: faqs.filter((f) => f.category === 'qaytarish').length
        },
        {
            id: 'audio',
            name: 'Audio kitoblar',
            icon: <Headphones size={16} />,
            count: faqs.filter((f) => f.category === 'audio').length
        },
        {
            id: 'format',
            name: 'Formatlar',
            icon: <BookOpen size={16} />,
            count: faqs.filter((f) => f.category === 'format').length
        },
        {
            id: 'chegirma',
            name: 'Chegirmalar',
            icon: <Shield size={16} />,
            count: faqs.filter((f) => f.category === 'chegirma').length
        },
        {
            id: 'buyurtma',
            name: 'Buyurtmalar',
            icon: <Package size={16} />,
            count: faqs.filter((f) => f.category === 'buyurtma').length
        }
    ];

    const toggleItem = (index: number) => {
        setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const handleHelpful = (index: number) => {
        setHelpfulFeedback((prev) => ({ ...prev, [index]: true }));
        // Here you would typically send feedback to backend
    };

    const filteredFaqs = faqs.filter((faq) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const popularFaqs = faqs.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 dark:from-slate-900 dark:to-slate-800'>
            <div className='container mx-auto max-w-5xl px-4'>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='mb-12 text-center'>
                    <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 px-4 py-2 dark:from-blue-600/20 dark:to-orange-600/20'>
                        <HelpCircle size={16} className='text-[#005CB9] dark:text-blue-400' />
                        <span className='text-xs font-bold text-[#FF8A00] dark:text-orange-400'>FAQ</span>
                    </div>

                    <h1 className='mb-4 text-3xl font-black md:text-5xl'>
                        <span className='text-[#005CB9] dark:text-blue-400'>{"Tez-tez so'raladigan"}</span>
                        <span className='text-[#FF8A00] dark:text-orange-400'> savollar</span>
                    </h1>

                    <p className='mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400'>
                        {" Savollaringizga javob topa olmadingizmi? Biz bilan bog'lanishingiz mumkin. "}
                    </p>
                </motion.div>

                {/* Popular FAQs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-3'>
                    {popularFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className='group cursor-pointer rounded-xl border border-gray-100 bg-white p-4 transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'
                            onClick={() => {
                                const faqIndex = faqs.findIndex((f) => f.question === faq.question);
                                if (!openItems.includes(faqIndex)) {
                                    toggleItem(faqIndex);
                                }
                            }}>
                            <div className='flex items-start gap-3'>
                                <div className='rounded-lg bg-[#FF8A00]/10 p-2 dark:bg-orange-600/20'>
                                    <Sparkles size={16} className='text-[#FF8A00] dark:text-orange-400' />
                                </div>
                                <div>
                                    <h3 className='line-clamp-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#005CB9] dark:text-white dark:group-hover:text-blue-400'>
                                        {faq.question}
                                    </h3>
                                    <div className='mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500'>
                                        <Eye size={12} />
                                        <span>
                                            {faq.views}
                                            {" marta ko'rilgan"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='mb-8'>
                    <div className='relative mx-auto max-w-2xl'>
                        <Search
                            size={18}
                            className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 dark:text-gray-500'
                        />
                        <Input
                            type='text'
                            placeholder='Savolni qidirish...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='border-gray-200 bg-white py-6 pl-12 text-lg text-gray-900 placeholder-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-gray-500'
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className='absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className='mb-8 flex flex-wrap justify-center gap-2'>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                                selectedCategory === category.id
                                    ? 'scale-105 bg-[#005CB9] text-white shadow-lg dark:bg-blue-600'
                                    : 'border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700'
                            }`}>
                            {category.icon}
                            {category.name}
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-xs ${
                                    selectedCategory === category.id
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                                }`}>
                                {category.count}
                            </span>
                        </button>
                    ))}
                </motion.div>

                {/* FAQ List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className='space-y-4'>
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => {
                            const originalIndex = faqs.findIndex((f) => f.question === faq.question);
                            return (
                                <motion.div
                                    key={originalIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className='overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                    <button
                                        onClick={() => toggleItem(originalIndex)}
                                        className='group flex w-full items-center justify-between p-6 text-left'>
                                        <div className='flex items-start gap-3'>
                                            <div
                                                className={`rounded-lg p-2 transition-colors ${
                                                    openItems.includes(originalIndex)
                                                        ? 'bg-[#005CB9]/10 dark:bg-blue-600/20'
                                                        : 'bg-gray-100 group-hover:bg-[#005CB9]/10 dark:bg-slate-700 dark:group-hover:bg-blue-600/20'
                                                }`}>
                                                <HelpCircle
                                                    size={18}
                                                    className={`transition-colors ${
                                                        openItems.includes(originalIndex)
                                                            ? 'text-[#005CB9] dark:text-blue-400'
                                                            : 'text-gray-400 group-hover:text-[#005CB9] dark:text-gray-500 dark:group-hover:text-blue-400'
                                                    }`}
                                                />
                                            </div>
                                            <div>
                                                <h3 className='pr-8 text-lg font-bold text-gray-900 dark:text-white'>
                                                    {faq.question}
                                                </h3>
                                                <div className='mt-1 flex items-center gap-3'>
                                                    <span className='text-xs text-gray-400 dark:text-gray-500'>
                                                        {faq.views}
                                                        {" marta ko'rilgan "}
                                                    </span>
                                                    {faq.helpful && (
                                                        <span className='text-xs text-green-600 dark:text-green-400'>
                                                            {faq.helpful} kishi foydali deb topgan
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            size={20}
                                            className={`text-[#005CB9] transition-all duration-300 dark:text-blue-400 ${
                                                openItems.includes(originalIndex) ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {openItems.includes(originalIndex) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className='px-6 pb-6'>
                                                <div className='border-t border-gray-100 pt-4 dark:border-slate-700'>
                                                    <p className='leading-relaxed text-gray-600 dark:text-gray-300'>
                                                        {faq.answer}
                                                    </p>

                                                    {/* Helpful buttons */}
                                                    {!helpfulFeedback[originalIndex] && (
                                                        <div className='mt-4 flex items-center gap-4 border-t border-gray-100 pt-4 dark:border-slate-700'>
                                                            <span className='text-sm text-gray-500 dark:text-gray-400'>
                                                                Bu javob sizga yordam berdimi?
                                                            </span>
                                                            <button
                                                                onClick={() => handleHelpful(originalIndex)}
                                                                className='flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'>
                                                                <CheckCircle size={14} />
                                                                Ha
                                                            </button>
                                                            <button className='flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'>
                                                                <X size={14} />
                                                                {" Yo'q "}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {helpfulFeedback[originalIndex] && (
                                                        <div className='mt-4 flex items-center gap-2 text-green-600 dark:text-green-400'>
                                                            <CheckCircle size={16} />
                                                            <span className='text-sm'>Fikringiz uchun rahmat!</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='rounded-xl border border-gray-100 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-800'>
                            <HelpCircle size={64} className='mx-auto mb-4 text-gray-300 dark:text-gray-600' />
                            <p className='mb-2 text-lg text-gray-500 dark:text-gray-400'>Hech narsa topilmadi</p>
                            <p className='mb-4 text-gray-400 dark:text-gray-500'>
                                {' "'}
                                {searchQuery}
                                {'" bo\'yicha hech qanday savol topilmadi '}
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className='text-sm text-[#005CB9] hover:underline dark:text-blue-400'>
                                Filtrlarni tozalash
                            </button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Contact Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className='mt-12 grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='rounded-xl border border-gray-100 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
                        <div className='flex items-start gap-4'>
                            <div className='rounded-xl bg-[#005CB9]/10 p-3 dark:bg-blue-600/20'>
                                <Mail size={24} className='text-[#005CB9] dark:text-blue-400' />
                            </div>
                            <div>
                                <h3 className='mb-1 text-lg font-bold text-gray-900 dark:text-white'>Email orqali</h3>
                                <p className='mb-3 text-sm text-gray-500 dark:text-gray-400'>
                                    24 soat ichida javob olasiz
                                </p>
                                <a
                                    href='mailto:support@book.uz'
                                    className='inline-flex items-center gap-2 text-[#005CB9] hover:underline dark:text-blue-400'>
                                    support@book.uz
                                    <Send size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className='rounded-xl border border-gray-100 bg-white p-6 dark:border-slate-700 dark:bg-slate-800'>
                        <div className='flex items-start gap-4'>
                            <div className='rounded-xl bg-[#FF8A00]/10 p-3 dark:bg-orange-600/20'>
                                <Phone size={24} className='text-[#FF8A00] dark:text-orange-400' />
                            </div>
                            <div>
                                <h3 className='mb-1 text-lg font-bold text-gray-900 dark:text-white'>Telefon orqali</h3>
                                <p className='mb-3 text-sm text-gray-500 dark:text-gray-400'>
                                    Dushanba-Juma, 09:00-20:00
                                </p>
                                <a
                                    href='tel:+998712345678'
                                    className='inline-flex items-center gap-2 text-[#FF8A00] hover:underline dark:text-orange-400'>
                                    +998 71 234-56-78
                                    <Phone size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className='mt-8 rounded-2xl border border-gray-200 bg-gradient-to-r from-[#005CB9]/5 to-[#FF8A00]/5 p-8 text-center dark:border-slate-700 dark:from-blue-600/10 dark:to-orange-600/10'>
                    <h2 className='mb-2 text-2xl font-black text-gray-900 dark:text-white'>
                        Savolingizga javob topa olmadingizmi?
                    </h2>
                    <p className='mb-6 text-gray-500 dark:text-gray-400'>
                        {" Bizning qo'llab-quvvatlash jamoamiz sizga yordam berishga tayyor. "}
                    </p>
                    <Link href='/contact'>
                        <Button className='rounded-xl bg-gradient-to-r from-[#005CB9] to-[#FF8A00] px-8 py-6 font-bold text-white transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                            <MessageCircle size={18} className='mr-2' />
                            {" Biz bilan bog'lanish "}
                        </Button>
                    </Link>
                </motion.div>

                {/* Info Icons */}
                <div className='mt-8 grid grid-cols-3 gap-2 text-center text-xs'>
                    <div className='p-2'>
                        <Truck size={16} className='mx-auto mb-1 text-gray-400 dark:text-gray-500' />
                        <span className='text-gray-400 dark:text-gray-500'>Bepul yetkazish</span>
                    </div>
                    <div className='p-2'>
                        <Shield size={16} className='mx-auto mb-1 text-gray-400 dark:text-gray-500' />
                        <span className='text-gray-400 dark:text-gray-500'>{"Xavfsiz to'lov"}</span>
                    </div>
                    <div className='p-2'>
                        <Headphones size={16} className='mx-auto mb-1 text-gray-400 dark:text-gray-500' />
                        <span className='text-gray-400 dark:text-gray-500'>{"24/7 qo'llab-quvvatlash"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
