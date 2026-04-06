'use client';

import { motion } from 'framer-motion';
import { BookOpen, Building2, ChevronRight, Crown, Sparkles, Star } from 'lucide-react';

type PublisherItem = {
    id: string;
    name: string;
    emblem: string;
    focus: string;
    books: string;
    gradient: string;
    accent: string;
};

const publishers: PublisherItem[] = [
    {
        id: 'hilol',
        name: 'Hilol Nashr',
        emblem: 'HN',
        focus: 'Badiiy va ma’rifiy to‘plamlar',
        books: '1200+ kitob',
        gradient: 'from-[#005CB9] via-[#0a7bd8] to-[#47b8ff]',
        accent: 'text-[#005CB9] dark:text-blue-300'
    },
    {
        id: 'akadem',
        name: 'Akademnashr',
        emblem: 'AN',
        focus: 'Tarix, tafakkur va klassika',
        books: '860+ nashr',
        gradient: 'from-[#ef7f1a] via-[#ff9d4d] to-[#ffd08a]',
        accent: 'text-[#ef7f1a] dark:text-orange-300'
    },
    {
        id: 'yangi-asr',
        name: 'Yangi Asr Avlodi',
        emblem: 'YA',
        focus: 'Bolalar va o‘smirlar adabiyoti',
        books: '940+ nom',
        gradient: 'from-[#0f766e] via-[#14b8a6] to-[#67e8f9]',
        accent: 'text-teal-600 dark:text-teal-300'
    },
    {
        id: 'sharq',
        name: 'Sharq NMAK',
        emblem: 'SH',
        focus: 'Ilmiy va madaniy meros',
        books: '700+ to‘plam',
        gradient: 'from-[#7c3aed] via-[#a855f7] to-[#f0abfc]',
        accent: 'text-violet-600 dark:text-violet-300'
    },
    {
        id: 'manaviyat',
        name: 'Ma’naviyat',
        emblem: 'MN',
        focus: 'Jamiyat va qadriyat mavzulari',
        books: '520+ nashr',
        gradient: 'from-[#be123c] via-[#f43f5e] to-[#fda4af]',
        accent: 'text-rose-600 dark:text-rose-300'
    },
    {
        id: 'booklab',
        name: 'BookLab Studio',
        emblem: 'BL',
        focus: 'Zamonaviy tarjima va biznes kitoblari',
        books: '410+ kitob',
        gradient: 'from-slate-700 via-slate-500 to-slate-300',
        accent: 'text-slate-700 dark:text-slate-200'
    }
];

const Publishers = () => {
    return (
        <section className='relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-16 dark:from-slate-900 dark:to-slate-950'>
            <div className='brand-grid pointer-events-none absolute inset-0 opacity-80' />

            <div className='relative z-10 container mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                    <div className='max-w-2xl'>
                        <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-[#ef7f1a]/20 bg-[#ef7f1a]/10 px-4 py-2 text-xs font-black tracking-[0.18em] text-[#ef7f1a] uppercase dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300'>
                            <Building2 size={14} />
                            Nashriyotlar
                        </div>
                        <h2 className='text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white'>
                            Ishonchli nashriyotlar bilan
                            <span className='ml-2 text-[#ef7f1a] dark:text-orange-300'>bir sahifada</span>
                        </h2>
                        <p className='mt-3 max-w-xl text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300'>
                            Book.uz vitrinasi uchun saralangan nashriyotlar. Har bir emblem ortida o‘z uslubi,
                            yo‘nalishi va o‘quvchiga mos katalogi bor.
                        </p>
                    </div>
                </motion.div>

                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                    {publishers.map((publisher, index) => (
                        <motion.article
                            key={publisher.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            whileHover={{ y: -6 }}
                            className='group relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/85 p-5 shadow-[0_18px_50px_-26px_rgba(15,23,42,0.45)] backdrop-blur-sm transition-all dark:border-slate-700 dark:bg-slate-900/75'>
                            <div
                                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${publisher.gradient} opacity-90`}
                            />

                            <div className='mb-5 flex items-start justify-between gap-4'>
                                <div
                                    className={`relative flex h-18 w-18 items-center justify-center rounded-[24px] bg-gradient-to-br ${publisher.gradient} text-2xl font-black text-white shadow-lg shadow-slate-300/40 transition-transform duration-300 group-hover:scale-105 dark:shadow-slate-950/40`}>
                                    <span>{publisher.emblem}</span>
                                    
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <h3 className='text-xl font-black tracking-tight text-slate-900 dark:text-white'>
                                    {publisher.name}
                                </h3>   
                                <p className='text-sm leading-6 text-slate-600 dark:text-slate-300'>
                                    {publisher.focus}
                                </p>
                            </div>

                            <div className='mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-slate-700'>
                                <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200'>
                                    <BookOpen size={16} className={publisher.accent} />
                                    <span>{publisher.books}</span>
                                </div>

                                <div className='flex items-center gap-1 text-sm font-bold text-slate-400 transition-colors group-hover:text-[#005CB9] dark:text-slate-500 dark:group-hover:text-blue-300'>
                                    <span>Batafsil</span>
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Publishers;
