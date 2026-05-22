'use client';

import { useRef } from 'react';

import Image from 'next/image';

import { motion, useScroll } from 'framer-motion';
import {
    Apple,
    Award,
    BookOpen,
    Coffee,
    Compass,
    Crown,
    Flower2,
    Gem,
    Headphones,
    Heart,
    Moon,
    Music,
    PlayCircle,
    Sparkles,
    Star,
    Sun,
    Zap
} from 'lucide-react';

type Particle = { top: string; left: string; duration: number; delay: number; size: number };

export const DownloadAppSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    const features = [
        { icon: <Headphones size={16} />, title: 'Oflayn rejim', desc: 'Internetisiz tinglang' },
        { icon: <Zap size={16} />, title: 'Tez yuklash', desc: '2x tezroq' },
        { icon: <Music size={16} />, title: 'Audio kitoblar', desc: '500+ audio' },
        { icon: <BookOpen size={16} />, title: 'Elektron kitoblar', desc: '10K+ kitoblar' }
    ];

    const reviews = [
        { name: 'Dilnoza K.', rating: 5, text: 'Eng yaxshi ilova!' },
        { name: 'Bobur A.', rating: 5, text: 'Audio kitoblar ajoyib' },
        { name: 'Malika S.', rating: 5, text: 'Juda qulay' }
    ];

    return (
        <section ref={sectionRef} className='bg-background relative overflow-hidden py-16 dark:bg-slate-900'>
            {/* Original Background */}
            <div className='absolute inset-0'>
                <div className='absolute top-0 left-0 h-[400px] w-[400px] animate-pulse rounded-full bg-[#00a0e3]/10 blur-[100px] dark:bg-blue-600/10' />
                <div className='absolute right-0 bottom-0 h-[400px] w-[400px] animate-pulse rounded-full bg-[#ef7f1a]/10 blur-[100px] delay-1000 dark:bg-orange-600/10' />
            </div>

            <div className='relative z-10 container mx-auto max-w-6xl px-4'>
                <motion.div
                    className='relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl md:p-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}>
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
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
