'use client';

import React, { useState } from 'react';

import { BranchMap } from '@/components/map/Map';
import { branchLocations } from '@/components/map/branches';

import { Award, Book, BookHeadphones, BookOpen, Building2, MapPin, Truck } from 'lucide-react';
import Link from 'next/link';

export const AboutSection = () => {
    const [focusRequest, setFocusRequest] = useState<{ name: string; id: number } | null>(null);

    const stats = [
        { icon: <Book size={24} />, label: 'Kitoblar', value: '50,000+' },
        { icon: <BookOpen size={24} />, label: 'Nashryotlar soni', value: '10+' },
        { icon: <Building2 size={24} />, label: 'Filyallar soni', value: '10+' },
        { icon: <Truck size={24} />, label: 'Yetkazib berish', value: '24/7' },
        { icon: <BookHeadphones size={24} />, label: 'Audio kitoblar', value: '10K+' }
    ];

    return (
        <section className='relative overflow-hidden bg-background py-16 dark:bg-slate-900'>
            <div className='brand-grid' />

            <div className='relative z-10 container mx-auto max-w-[1400px] px-4'>
                <div className='flex flex-col items-center gap-12 lg:flex-row lg:gap-16'>
                    <div className='space-y-6 lg:w-1/2'>
                        <div className='inline-flex items-center gap-2 rounded-full border border-[#ef7f1a] bg-[#ef7f1a]/15 px-4 py-2'>
                            <Award size={16} className='text-[#ef7f1a] dark:text-orange-400' />
                            <span className='text-xs font-bold text-[#ef7f1a] dark:text-white'>BIZ HAQIMIZDA</span>
                        </div>

                        <h2 className='text-3xl leading-tight font-black md:text-4xl lg:text-5xl'>
                            <span className='text-[#00a0e3] dark:text-blue-400'>Sizning intellektual</span>
                            <br />
                            <span className='text-[#ef7f1a] dark:text-orange-400'>hamrohingiz</span>
                        </h2>

                        <p className='max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400'>
                            Biz 2020-yildan buyon kitobxonlar uchun eng sara asarlarni yetkazib kelmoqdamiz. Maqsadimiz
                            - har bir xonadonga{' '}
                            <span className='font-bold text-[#00a0e3] dark:text-blue-400'>ilm nuri</span> kirib
                            borishini ta'minlash va mutolaa madaniyatini yuksaltirishdir.
                        </p>

                        <div className='grid grid-cols-2 gap-6 pt-6'>
                            {stats.map((stat, index) => (
                                <div key={index} className='group flex items-center gap-3'>
                                    <div className='rounded-2xl bg-[#ef7f1a]/10 p-3 transition-all group-hover:scale-110 group-hover:bg-[#ef7f1a]/20 dark:bg-orange-600/20 dark:group-hover:bg-orange-600/30'>
                                        <div className='text-[#ef7f1a] dark:text-orange-400'>{stat.icon}</div>
                                    </div>
                                    <div>
                                        <p className='text-2xl font-black text-gray-900 dark:text-white'>
                                            {stat.value}
                                        </p>
                                        <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className='group relative mt-4 transform overflow-hidden rounded-full bg-[#ef7f1a] px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl'>
                            <Link href={'/about'} className='relative z-10 flex items-center gap-2'>
                                <BookOpen size={18} />
                                Batafsil ma'lumot
                            </Link>
                        </button>
                    </div>

                    <div className='w-full lg:w-1/2'>
                        <div className='relative overflow-hidden rounded-[2rem] border border-[#00a0e3]/20 bg-white/80 p-5 shadow-xl backdrop-blur-sm dark:border-[#00a0e3]/30 dark:bg-slate-800/70'>
                            <div className='mb-4 flex items-center justify-between'>
                                <h3 className='text-xl font-black text-gray-900 dark:text-white'>
                                    {branchLocations.length} ta filial xaritada
                                </h3>
                                <span className='rounded-full bg-[#ef7f1a]/10 px-3 py-1 text-xs font-bold text-[#ef7f1a] dark:bg-orange-500/20 dark:text-orange-300'>
                                    O'zbekiston
                                </span>
                            </div>

                            <div className='h-90 w-full overflow-hidden rounded-2xl'>
                                <BranchMap focusRequest={focusRequest} />
                            </div>

                            <div className='mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3'>
                                {branchLocations.map((branch) => (
                                    <button
                                        type='button'
                                        key={`legend-${branch.name}`}
                                        onClick={() => setFocusRequest({ name: branch.name, id: Date.now() })}
                                        className='flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 text-left text-gray-700 transition hover:bg-[#ef7f1a]/15 dark:bg-slate-700/60 dark:text-gray-200 dark:hover:bg-orange-500/20'>
                                        <MapPin size={12} className='fill-[#ef7f1a] text-[#ef7f1a]' />
                                        <span className='font-semibold'>{branch.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
