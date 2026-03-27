// app/about/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { statistics, teamMembers, timelineEvents, values } from '@/data/about';
import { api } from '@/services/api';

import { AnimatePresence, motion } from 'framer-motion';
import {
    Award,
    BookOpen,
    Clock,
    Cloud,
    Coffee,
    Compass,
    Crown,
    Diamond,
    Eye,
    Facebook,
    Flower2,
    Gem,
    Heart,
    Instagram,
    Linkedin,
    Loader2,
    Mail,
    MapPin,
    Moon,
    Phone,
    Send,
    Sparkles,
    Star,
    Sun,
    Target,
    Twitter,
    Users,
    Twitter as XIcon,
    Youtube,
    Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// app/about/page.tsx

// app/about/page.tsx

// app/about/page.tsx

export default function AboutPage() {
    const tabs: Array<{ id: 'team' | 'values' | 'history'; label: string; icon: React.ReactNode }> = [
        { id: 'team', label: 'Jamoa', icon: <Users size={18} /> },
        { id: 'values', label: 'Qadriyatlar', icon: <Heart size={18} /> },
        { id: 'history', label: 'Tarix', icon: <Clock size={18} /> }
    ];

    const [activeTab, setActiveTab] = useState<'team' | 'values' | 'history'>('team');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email manzilingizni kiriting');

            return;
        }

        try {
            setSubmitting(true);
            await api.post('/newsletter/subscribe', { email });
            toast.success("Obuna bo'ldingiz!");
            setEmail('');
        } catch (error) {
            toast.error('Xatolik yuz berdi');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
            {/* Animated Background Elements */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Floating Icons */}
                {[...Array(25)].map((_, i) => {
                    const icons = [
                        BookOpen,
                        Sparkles,
                        Star,
                        Heart,
                        Crown,
                        Zap,
                        Award,
                        Gem,
                        Diamond,
                        Flower2,
                        Sun,
                        Moon,
                        Cloud,
                        Coffee,
                        Compass
                    ];
                    const IconComponent = icons[i % icons.length];
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
                    className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#00a0e3]/10 blur-3xl'
                />
                <motion.div
                    animate={{
                        x: mousePosition.x * -2,
                        y: mousePosition.y * -2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#ef7f1a]/10 blur-3xl'
                />

                {/* Grid Pattern */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' />
            </div>

            <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-16 text-center'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className='mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 px-6 py-2'>
                        <Sparkles size={16} className='text-[#00a0e3]' />
                        <span className='text-sm font-bold text-[#ef7f1a]'>BIZ HAQIMIZDA</span>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='mb-6 text-5xl font-black md:text-7xl'>
                        <span className='bg-gradient-to-r from-[#00a0e3] via-[#ef7f1a] to-[#00a0e3] bg-clip-text text-transparent'>
                            Kitobxonlar uchun
                        </span>
                        <br />
                        <span className='text-gray-900 dark:text-white'>eng yaxshi platforma</span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='mx-auto max-w-3xl text-xl text-gray-500 dark:text-gray-400'>
                        {"BOOK.UZ - O'zbekistonning eng katta raqamli kutubxonasi. Biz 50,000+ kitob va 10,000+ audio"}
                        {" kitoblar bilan sizga eng yaxshi o'qish tajribasini taqdim etamiz."}
                    </motion.p>

                    {/* CTA Buttons with new colors */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className='mt-8 flex flex-col justify-center gap-4 sm:flex-row'>
                        <Link href='/catalog'>
                            <Button className='rounded-xl bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] px-8 py-6 text-lg text-white transition-all hover:shadow-xl'>
                                <BookOpen size={20} className='mr-2' />
                                {"Kitoblarni ko'rish"}
                            </Button>
                        </Link>
                        <Link href='/contact'>
                            <Button
                                variant='outline'
                                className='rounded-xl border-2 border-gray-200 px-8 py-6 text-lg transition-all hover:border-[#00a0e3] hover:text-[#00a0e3] dark:border-gray-700'>
                                <Mail size={20} className='mr-2' />
                                {"Bog'lanish"}
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Statistics Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className='mb-20 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
                    {statistics.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.7 }}
                            whileHover={{ y: -5, scale: 1.05 }}
                            className='rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-lg transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800'>
                            <div
                                className={`mx-auto h-14 w-14 bg-gradient-to-br ${stat.color} mb-3 flex items-center justify-center rounded-xl text-white`}>
                                {stat.icon}
                            </div>
                            <div className='text-2xl font-black text-gray-900 dark:text-white'>{stat.value}</div>
                            <div className='text-sm text-gray-500 dark:text-gray-400'>{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Tabs with new colors */}
                <div className='mb-8'>
                    <div className='flex justify-center gap-4'>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all ${
                                    activeTab === tab.id
                                        ? 'scale-105 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] text-white shadow-lg'
                                        : 'border border-gray-200 bg-white text-gray-700 hover:border-[#00a0e3] dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300'
                                }`}>
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode='wait'>
                    {/* Team Tab */}
                    {activeTab === 'team' && (
                        <motion.div
                            key='team'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='mb-20'>
                            <h2 className='mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white'>
                                Bizning{' '}
                                <span className='bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] bg-clip-text text-transparent'>
                                    jamoa
                                </span>
                            </h2>

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                                {teamMembers.map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -10 }}
                                        className='group relative'>
                                        <div className='relative h-80 overflow-hidden rounded-2xl bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10'>
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className='object-cover transition-transform duration-700 group-hover:scale-110'
                                            />
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

                                            {/* Social Links */}
                                            <div className='absolute right-4 bottom-4 left-4 flex translate-y-20 justify-center gap-2 transition-transform duration-300 group-hover:translate-y-0'>
                                                {member.social?.facebook && (
                                                    <a
                                                        href={member.social.facebook}
                                                        className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#00a0e3] transition-colors hover:bg-[#00a0e3] hover:text-white'>
                                                        <Facebook size={16} />
                                                    </a>
                                                )}
                                                {member.social?.twitter && (
                                                    <a
                                                        href={member.social.twitter}
                                                        className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#00a0e3] transition-colors hover:bg-[#00a0e3] hover:text-white'>
                                                        <XIcon size={16} />
                                                    </a>
                                                )}
                                                {member.social?.instagram && (
                                                    <a
                                                        href={member.social.instagram}
                                                        className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#00a0e3] transition-colors hover:bg-[#00a0e3] hover:text-white'>
                                                        <Instagram size={16} />
                                                    </a>
                                                )}
                                                {member.social?.linkedin && (
                                                    <a
                                                        href={member.social.linkedin}
                                                        className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#00a0e3] transition-colors hover:bg-[#00a0e3] hover:text-white'>
                                                        <Linkedin size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className='mt-4 text-center'>
                                            <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                                                {member.name}
                                            </h3>
                                            <p className='font-medium text-[#00a0e3] dark:text-[#ef7f1a]'>
                                                {member.position}
                                            </p>
                                            <p className='mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400'>
                                                {member.bio}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Values Tab */}
                    {activeTab === 'values' && (
                        <motion.div
                            key='values'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='mb-20'>
                            <h2 className='mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white'>
                                Bizning{' '}
                                <span className='bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] bg-clip-text text-transparent'>
                                    qadriyatlarimiz
                                </span>
                            </h2>

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                {values.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className={`bg-gradient-to-br ${value.color} rounded-2xl p-1`}>
                                        <div className='h-full rounded-2xl bg-white p-6 dark:bg-slate-800'>
                                            <div
                                                className={`h-14 w-14 rounded-xl bg-gradient-to-br ${value.color} mb-4 flex items-center justify-center text-white`}>
                                                {value.icon}
                                            </div>
                                            <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                                                {value.title}
                                            </h3>
                                            <p className='text-gray-600 dark:text-gray-400'>{value.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <motion.div
                            key='history'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='mb-20'>
                            <h2 className='mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white'>
                                Bizning{' '}
                                <span className='bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] bg-clip-text text-transparent'>
                                    tariximiz
                                </span>
                            </h2>

                            <div className='relative'>
                                {/* Timeline Line */}
                                <div className='absolute left-1/2 hidden h-full w-1 -translate-x-1/2 transform bg-gradient-to-b from-[#00a0e3] to-[#ef7f1a] md:block' />

                                {timelineEvents.map((event, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative mb-12 flex flex-col items-center md:flex-row ${
                                            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}>
                                        {/* Year Badge */}
                                        <div className='flex justify-center md:w-1/2 md:justify-end md:pr-12'>
                                            <div
                                                className={`rounded-2xl bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] p-8 text-center ${
                                                    index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                                                }`}>
                                                <span className='text-4xl font-black text-white'>{event.year}</span>
                                            </div>
                                        </div>

                                        {/* Timeline Dot */}
                                        <div className='absolute left-1/2 hidden h-8 w-8 -translate-x-1/2 transform items-center justify-center rounded-full border-4 border-[#00a0e3] bg-white md:flex dark:bg-slate-800'>
                                            <div className='h-4 w-4 rounded-full bg-[#ef7f1a]' />
                                        </div>

                                        {/* Content */}
                                        <div className='mt-4 md:mt-0 md:w-1/2 md:pl-12'>
                                            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800'>
                                                <div className='mb-3 flex items-center gap-3'>
                                                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] text-white'>
                                                        {event.icon}
                                                    </div>
                                                    <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                                                        {event.title}
                                                    </h3>
                                                </div>
                                                <p className='text-gray-600 dark:text-gray-400'>{event.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mission & Vision with new colors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className='mb-20 grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='rounded-2xl border border-[#00a0e3]/20 bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10 p-8'>
                        <Target size={40} className='mb-4 text-[#00a0e3]' />
                        <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>Bizning missiyamiz</h3>
                        <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-400'>
                            {"O'zbekistonda kitobxonlik madaniyatini rivojlantirish va har bir insonga sifatli"}
                            {' kitoblarni qulay narxlarda taqdim etish. Biz orqali millionlab odamlar bilim olish va'}
                            {" zavqlanish imkoniyatiga ega bo'ladi."}
                        </p>
                    </div>

                    <div className='rounded-2xl border border-[#ef7f1a]/20 bg-gradient-to-br from-[#ef7f1a]/10 to-[#00a0e3]/10 p-8'>
                        <Eye size={40} className='mb-4 text-[#ef7f1a]' />
                        <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>Bizning vizyonimiz</h3>
                        <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-400'>
                            Markaziy Osiyodagi eng yirik raqamli kutubxonaga aylanish va 5 yil ichida 10 milliondan
                            {"ortiq foydalanuvchiga xizmat ko'rsatish. Innovatsion texnologiyalar orqali kitob"}
                            {" o'qishni yanada qulay va maroqli qilish."}
                        </p>
                    </div>
                </motion.div>

                {/* Newsletter Section with new colors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className='mb-20 rounded-3xl bg-gradient-to-br from-[#00a0e3] to-[#ef7f1a] p-12 text-center'>
                    <h2 className='mb-4 text-3xl font-black text-white md:text-4xl'>
                        {"Yangiliklardan xabardor bo'ling"}
                    </h2>
                    <p className='mx-auto mb-8 max-w-2xl text-lg text-white/90'>
                        {"Eng so'nggi kitoblar, aksiyalar va yangiliklar haqida birinchi bo'lib xabar oling"}
                    </p>

                    <form onSubmit={handleSubscribe} className='mx-auto flex max-w-md flex-col gap-3 sm:flex-row'>
                        <Input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email manzilingiz'
                            className='h-14 flex-1 border-white/30 bg-white/20 text-lg text-white placeholder-white/60'
                        />
                        <Button
                            type='submit'
                            disabled={submitting}
                            className='h-14 bg-white px-8 text-lg font-bold text-[#00a0e3] hover:bg-white/90'>
                            {submitting ? (
                                <Loader2 size={20} className='animate-spin' />
                            ) : (
                                <Send size={20} className='mr-2' />
                            )}
                            {submitting ? 'Yuborilmoqda...' : "Obuna bo'lish"}
                        </Button>
                    </form>
                </motion.div>

                {/* Contact Info with new colors */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className='grid grid-cols-1 gap-6 text-center md:grid-cols-3'>
                    <div className='p-6'>
                        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00a0e3]/10 text-[#00a0e3]'>
                            <MapPin size={24} />
                        </div>
                        <h3 className='mb-2 font-bold text-gray-900 dark:text-white'>Manzil</h3>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Toshkent sh., Chilonzor tumani
                            <br />
                            19-kvartal, 45-uy
                        </p>
                    </div>

                    <div className='p-6'>
                        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ef7f1a]/10 text-[#ef7f1a]'>
                            <Phone size={24} />
                        </div>
                        <h3 className='mb-2 font-bold text-gray-900 dark:text-white'>Telefon</h3>
                        <a
                            href='tel:+998901234567'
                            className='text-gray-500 transition-colors hover:text-[#00a0e3] dark:text-gray-400'>
                            +998 (90) 123-45-67
                        </a>
                    </div>

                    <div className='p-6'>
                        <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 text-[#00a0e3]'>
                            <Mail size={24} />
                        </div>
                        <h3 className='mb-2 font-bold text-gray-900 dark:text-white'>Email</h3>
                        <a
                            href='mailto:info@book.uz'
                            className='text-gray-500 transition-colors hover:text-[#00a0e3] dark:text-gray-400'>
                            info@book.uz
                        </a>
                    </div>
                </motion.div>

                {/* Social Links with new colors */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className='mt-12 flex justify-center gap-4'>
                    {[
                        { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
                        { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
                        { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
                        { icon: <Youtube size={20} />, href: '#', label: 'YouTube' },
                        { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' }
                    ].map((social, index) => (
                        <motion.a
                            key={index}
                            href={social.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            whileHover={{ scale: 1.1, y: -5 }}
                            className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-[#00a0e3] hover:text-white dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-[#ef7f1a]'
                            title={social.label}>
                            {social.icon}
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
