'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Apple,
    ArrowRight,
    Award,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    Cloud,
    Coffee,
    Compass,
    Crown,
    Download,
    Flower2,
    Gem,
    Headphones,
    Heart,
    Moon,
    Music,
    PlayCircle,
    QrCode,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Star,
    Sun,
    Zap
} from 'lucide-react';

type Particle = { top: string; left: string; duration: number; delay: number; size: number };

export const DownloadAppSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    });

    const [particles, setParticles] = useState<Particle[]>([]);

    const y = useTransform(scrollYProgress, [0, 1], [0, -30]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.6, 1, 0.6]);

    const features = [
        { icon: <Headphones size={16} />, title: 'Oflayn rejim', desc: 'Internetisiz tinglang' },
        { icon: <Zap size={16} />, title: 'Tez yuklash', desc: '2x tezroq' },
        { icon: <ShieldCheck size={16} />, title: 'Xavfsiz', desc: "Ma'lumotlar himoyalangan" },
        { icon: <Music size={16} />, title: 'Audio kitoblar', desc: '500+ audio' },
        { icon: <BookOpen size={16} />, title: 'Elektron kitoblar', desc: '10K+ kitoblar' },
        { icon: <Cloud size={16} />, title: 'Cloud sinxron', desc: 'Barcha qurilmalarda' }
    ];

    const reviews = [
        { name: 'Dilnoza K.', rating: 5, text: 'Eng yaxshi ilova!' },
        { name: 'Bobur A.', rating: 5, text: 'Audio kitoblar ajoyib' },
        { name: 'Malika S.', rating: 5, text: 'Juda qulay' }
    ];

    // Floating icons array
    const floatingIcons = [Sparkles, Gem, Crown, Flower2, Sun, Moon, Coffee, Compass, Heart, Star, Award, Music];

    return (
        <section
            ref={sectionRef}
            className='relative overflow-hidden bg-gradient-to-b from-slate-900 to-black py-16 dark:from-slate-900 dark:to-black'>
            {/* Animated Background Elements */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Floating Icons */}
                {[...Array(15)].map((_, i) => {
                    const IconComponent = floatingIcons[i % floatingIcons.length];
                    const randomTop = Math.random() * 100;
                    const randomLeft = Math.random() * 100;
                    const randomFontSize = Math.random() * 30 + 15;

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
                                y: [0, -20, 20, 0],
                                x: [0, 20, -20, 0],
                                rotate: [0, 180, 360, 0],
                                opacity: [0.1, 0.2, 0.15, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 15 + 10,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}>
                            <IconComponent />
                        </motion.div>
                    );
                })}

                {/* Gradient Orbs with Parallax */}
                <motion.div
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#00a0e3]/5 blur-3xl'
                />
                <motion.div
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#ef7f1a]/5 blur-3xl'
                />
            </div>

            {/* Original Background */}
            <div className='absolute inset-0'>
                <div className='absolute top-0 left-0 h-[400px] w-[400px] animate-pulse rounded-full bg-[#00a0e3]/10 blur-[100px] dark:bg-blue-600/10' />
                <div className='absolute right-0 bottom-0 h-[400px] w-[400px] animate-pulse rounded-full bg-[#ef7f1a]/10 blur-[100px] delay-1000 dark:bg-orange-600/10' />
            </div>

            {/* Floating Particles */}
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className='absolute rounded-full bg-white/5 dark:bg-white/10'
                    style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
                    animate={{ y: [0, -20, 20, -20], x: [0, 20, -20, 20], opacity: [0, 0.3, 0] }}
                    transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
                />
            ))}

            <div className='relative z-10 container mx-auto max-w-6xl px-4'>
                <motion.div
                    className='relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl md:p-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ y, opacity }}>
                    {/* Decorative lines */}
                    <div className='absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#00a0e3] to-transparent dark:via-blue-600' />
                    <div className='absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#ef7f1a] to-transparent dark:via-orange-600' />

                    {/* Floating Particles */}
                    <motion.div className='absolute inset-0' transition={{ duration: 0.3 }} />

                    <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2'>
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className='space-y-6'>
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-[#00a0e3]/20 to-[#ef7f1a]/20 px-3 py-1.5 dark:border-slate-700 dark:from-blue-600/30 dark:to-orange-600/30'>
                                <Sparkles size={14} className='text-[#ef7f1a] dark:text-orange-400' />
                                <span className='text-xs font-bold text-white dark:text-white'>Yangi versiya 2.0</span>
                            </motion.div>

                            <h2 className='text-3xl leading-tight font-black text-white md:text-4xl dark:text-white'>
                                <span className='text-[#00a0e3] dark:text-blue-400'>Kutubxonangiz</span>
                                <br />
                                <span className='text-[#ef7f1a] dark:text-orange-400'>endi cho'ntagingizda</span>
                            </h2>

                            <p className='max-w-md text-sm text-slate-400 dark:text-slate-400'>
                                Ilovani yuklab oling va sevimli asarlaringizni istalgan joyda, internetisiz ham
                                tinglang. 50,000+ kitob va audio kitoblar.
                            </p>

                            {/* Feature Grid */}
                            <div className='grid grid-cols-2 gap-2'>
                                {features.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.03 }}
                                        className='rounded-lg border border-white/5 bg-white/5 p-2 backdrop-blur-sm dark:border-slate-700 dark:bg-white/5'>
                                        <div className='flex items-center gap-2'>
                                            <div
                                                className={`${i % 2 === 0 ? 'text-[#00a0e3] dark:text-blue-400' : 'text-[#ef7f1a] dark:text-orange-400'}`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className='text-xs font-bold text-white dark:text-white'>
                                                    {item.title}
                                                </p>
                                                <p className='text-[8px] text-slate-400 dark:text-slate-400'>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Download Buttons */}
                            <div className='flex flex-wrap gap-3 pt-2'>
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className='group relative flex items-center gap-2 overflow-hidden rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg dark:bg-slate-800 dark:text-white'>
                                    <div className='absolute inset-0 bg-[#ef7f1a] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-[#ef7f1a]' />
                                    <Apple
                                        size={20}
                                        className='relative z-10 group-hover:text-white dark:group-hover:text-white'
                                    />
                                    <div className='relative z-10 text-left group-hover:text-white'>
                                        <p className='text-[8px] uppercase opacity-60'>Download on</p>
                                        <p className='text-sm'>App Store</p>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className='group relative flex items-center gap-2 overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white'>
                                    <div className='absolute inset-0 bg-[#ef7f1a] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-[#ef7f1a]' />
                                    <PlayCircle
                                        size={20}
                                        className='relative z-10 group-hover:text-white dark:group-hover:text-white'
                                    />
                                    <div className='relative z-10 text-left group-hover:text-white'>
                                        <p className='text-[8px] uppercase opacity-60'>Get it on</p>
                                        <p className='text-sm'>Google Play</p>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Right - Phone Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className='relative flex justify-center'>
                            {/* Phone */}
                            <div className='relative h-[450px] w-[220px] md:h-[520px] md:w-[260px]'>
                                {/* Phone Frame */}
                                <div className='relative h-full w-full overflow-hidden rounded-[2.5rem] border-[6px] border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl dark:border-slate-600 dark:from-slate-800 dark:to-slate-900'>
                                    {/* Screen */}
                                    <div className='absolute inset-0'>
                                        <Image
                                            src='https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070'
                                            alt='App UI'
                                            fill
                                            className='object-cover opacity-80 dark:opacity-70'
                                        />
                                    </div>

                                    {/* App UI Overlay */}
                                    <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent dark:from-slate-900 dark:via-transparent'>
                                        <div className='absolute right-3 bottom-4 left-3'>
                                            <div className='rounded-lg border border-white/20 bg-white/10 p-2 backdrop-blur-md dark:border-slate-700 dark:bg-white/5'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-[#00a0e3] dark:bg-blue-600'>
                                                        <Headphones size={12} className='text-white' />
                                                    </div>
                                                    <div className='flex-1'>
                                                        <p className='text-[10px] font-bold text-white dark:text-white'>
                                                            Atomic Habits
                                                        </p>
                                                        <p className='text-[6px] text-slate-300 dark:text-slate-400'>
                                                            6h 24min
                                                        </p>
                                                    </div>
                                                    <PlayCircle
                                                        size={16}
                                                        className='text-[#ef7f1a] dark:text-orange-400'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dynamic Island */}
                                    <div className='absolute top-1 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-slate-900 dark:bg-slate-800' />
                                </div>

                                {/* Glow */}
                                <div className='absolute -inset-2 -z-10 rounded-[3rem] bg-gradient-to-r from-[#00a0e3]/30 to-[#ef7f1a]/30 blur-xl dark:from-blue-600/30 dark:to-orange-600/30' />
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom CTA */}
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className='mt-6 text-center'>
                        <button className='group inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-white'>
                            <span>Ilova haqida</span>
                            <ChevronRight size={12} className='transition-transform group-hover:translate-x-1' />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
