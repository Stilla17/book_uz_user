'use client';

import { Apple, BookOpen, Headphones, Music, Pause, PlayCircle, Sparkles, Zap } from 'lucide-react';

const features = [
    { icon: Headphones, title: 'Oflayn rejim' },
    { icon: Zap, title: 'Tez yuklash' },
    { icon: Music, title: 'Audio kitoblar' },
    { icon: BookOpen, title: 'Elektron kitoblar' }
];

export const DownloadAppSection = () => {
    return (
        <section className='bg-background py-14 dark:bg-slate-900'>
            <div className='brand-grid' />

            <div className='container mx-auto max-w-6xl px-4'>
                <div className='relative overflow-hidden rounded-[2rem] bg-[#0c1629] text-white'>
                    <div className='absolute -top-32 right-20 size-80 rounded-full bg-[#22345d]/70' />
                    <div className='absolute -bottom-36 left-1/3 size-64 rounded-full bg-[#1a294b]/80' />

                    <div className='grid items-center gap-10 px-6 py-10 md:px-10 lg:grid-cols-[1fr_360px] lg:py-12'>
                        <div className='relative z-10'>
                            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-[#2d5faa] bg-[#13264a] px-3 py-1.5 text-xs text-blue-300'>
                                <BookOpen size={14} />
                                O'zbekiston №1 kutubxonasi
                            </div>

                            <h2 className='max-w-xl text-3xl leading-tight font-bold md:text-4xl'>
                                Kutubxonangiz doim <span className='text-[#4f7cff]'>yoningizda</span>
                            </h2>

                            <p className='mt-4 max-w-lg text-sm leading-6 text-blue-200/75 md:text-base'>
                                Kitoblarni o'qing, audio kitoblarni tinglang va sevimli asarlaringizni oflayn saqlang.
                            </p>

                            <div className='mt-7 grid max-w-lg grid-cols-2 gap-3'>
                                {features.map(({ icon: Icon, title }) => (
                                    <div
                                        key={title}
                                        className='flex items-center gap-3 rounded-xl border border-[#2b3e63] bg-[#132039] p-3 text-sm font-medium text-blue-50'>
                                        <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#1d3157]'>
                                            <Icon size={17} className='text-[#4f7cff]' />
                                        </span>
                                        <span>{title}</span>
                                    </div>
                                ))}
                            </div>

                            <div className='mt-7 flex flex-wrap gap-3'>
                                <button
                                    type='button'
                                    className='flex items-center gap-3 rounded-xl border border-slate-500/60 px-4 py-2.5 text-left text-white'>
                                    <Apple size={22} />
                                    <span>
                                        <span className='block text-[9px] leading-none opacity-70'>
                                            Download on the
                                        </span>
                                        <span className='text-sm font-semibold'>App Store</span>
                                    </span>
                                </button>

                                <button
                                    type='button'
                                    className='flex items-center gap-3 rounded-xl border border-[#354d78] bg-[#121f37] px-4 py-2.5 text-left text-white'>
                                    <PlayCircle size={22} />
                                    <span>
                                        <span className='block text-[9px] leading-none opacity-70'>Get it on</span>
                                        <span className='text-sm font-semibold'>Google Play</span>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className='relative z-10 flex justify-center lg:justify-end'>
                            <div className='relative w-full max-w-[300px] pt-8 pb-3'>
                                <div className='absolute top-0 -right-5 z-20 rounded-full border border-[#385383] bg-[#132442] px-3 py-1.5 text-xs text-blue-200 shadow-lg'>
                                    <span className='mr-1 text-emerald-400'>●</span> +2,400 kitob
                                </div>

                                <div className='relative rounded-[2.8rem] border-[7px] border-[#07101f] bg-[#172744] px-4 pt-8 pb-6 shadow-2xl ring-1 ring-[#3a527c]'>
                                    <div className='absolute top-2 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-[#07101f]'>
                                        <span className='absolute top-1/2 left-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-700' />
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-xs text-blue-300/60'>Mening kutubxonam</p>
                                            <p className='mt-0.5 text-sm font-semibold text-white'>
                                                Bugun nima o'qiymiz?
                                            </p>
                                        </div>
                                        <div className='flex size-9 items-center justify-center rounded-full bg-[#243a63] text-amber-400'>
                                            <Sparkles size={17} />
                                        </div>
                                    </div>

                                    <div className='mt-5 flex h-32 items-end justify-center gap-1.5 px-1'>
                                        <div className='h-20 w-7 rounded-t-lg bg-[#00a0e3] px-1 py-2 [writing-mode:vertical-rl]'></div>
                                        <div className='h-32 w-8 rounded-t-lg bg-[#ef7f1a] px-1 py-2 [writing-mode:vertical-rl]'></div>
                                        <div className='h-24 w-8 rounded-t-lg bg-slate-500 px-1 py-2 [writing-mode:vertical-rl]'></div>
                                        <div className='h-16 w-7 rounded-t-lg bg-amber-400 px-1 py-2 [writing-mode:vertical-rl]'></div>
                                        <div className='h-24 w-8 rounded-t-lg bg-emerald-500 px-1 py-2 [writing-mode:vertical-rl]'></div>
                                    </div>

                                    <div className='h-2 rounded-full bg-[#5b4722] shadow-[0_4px_0_#332814]' />

                                    <div className='mt-4 rounded-2xl border border-[#31486f] bg-[#111e35] p-3 text-white'>
                                        <div className='flex items-center gap-3'>
                                            <button
                                                type='button'
                                                aria-label='Audio kitobni pauza qilish'
                                                className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ef7f1a]'>
                                                <Pause size={17} fill='currentColor' />
                                            </button>
                                            <div className='min-w-0 flex-1'>
                                                <div className='flex items-center justify-between gap-2'>
                                                    <p className='truncate text-sm font-semibold'>Atomic Habits</p>
                                                    <Headphones size={15} className='text-[#00a0e3]' />
                                                </div>
                                                <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-white/15'>
                                                    <div className='h-full w-[64%] rounded-full bg-[#00a0e3]' />
                                                </div>
                                                <div className='mt-1 flex justify-between text-[9px] text-white/45'>
                                                    <span>4:08</span>
                                                    <span>6:24</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mt-3 flex items-center justify-between rounded-xl bg-[#213454] px-3 py-2.5'>
                                        <div className='flex items-center gap-2 text-sm text-blue-100'>
                                            <BookOpen size={16} className='text-[#00a0e3]' />
                                            <span>Haftalik maqsad</span>
                                        </div>
                                        <span className='text-sm font-bold text-[#ef7f1a]'>4 / 5</span>
                                    </div>

                                    <div className='absolute bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-white/25' />
                                </div>

                                <div className='absolute -right-10 bottom-20 z-20 rounded-xl border border-[#34517e] bg-[#172b4c] px-3 py-2 text-xs font-semibold text-blue-100 shadow-xl'>
                                    <span className='mr-1.5 text-amber-400'>★</span> 4.9 reyting
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
