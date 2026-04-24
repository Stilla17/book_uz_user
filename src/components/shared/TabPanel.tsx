import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

type TabPanelProps = {
    description?: string;
    author?: string;
    category?: string;
    pages?: number;
    language?: string;
    publisherName?: string;
    year?: number;
    reviewsCount?: number;
};

const TabPanel = ({
    description,
    author,
    category,
    pages,
    language,
    publisherName,
    year,
    reviewsCount
}: TabPanelProps) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-12 rounded-[28px] border border-[#f7e3cf] bg-[#fff9f3] p-3 shadow-lg shadow-orange-100/70 backdrop-blur dark:border-slate-700 dark:bg-slate-800 dark:shadow-none'>
            <Tabs defaultValue='description' className='w-full'>
                <TabsList className='flex h-auto w-full flex-wrap justify-start gap-2 rounded-[22px] bg-white/80 p-2 dark:bg-slate-900/70'>
                    <TabsTrigger
                        value='description'
                        className='rounded-2xl px-5 py-3 text-sm font-semibold text-slate-600 data-[state=active]:bg-[#ef7f1a] data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900'>
                        Tavsif
                    </TabsTrigger>
                    <TabsTrigger
                        value='details'
                        className='rounded-2xl px-5 py-3 text-sm font-semibold text-slate-600 data-[state=active]:bg-[#ef7f1a] data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900'>
                        Tafsilotlar
                    </TabsTrigger>
                    <TabsTrigger
                        value='reviews'
                        className='rounded-2xl px-5 py-3 text-sm font-semibold text-slate-600 data-[state=active]:bg-[#ef7f1a] data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:bg-white dark:data-[state=active]:text-slate-900'>
                        Izohlar
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value='description'
                    className='mt-4 rounded-[24px] bg-white p-6 shadow-sm dark:bg-slate-900/80'>
                    <h2 className='text-2xl font-black text-slate-900 dark:text-white'>Kitob haqida</h2>
                    <p className='mt-5 leading-8 text-slate-600 dark:text-slate-300'>
                        {description ||
                            "Hozircha bu kitob uchun tavsif kiritilmagan. Keyinroq bu yerda asar mazmuni, uslubi va kimlar uchun tavsiya etilishi haqida ma'lumot chiqadi."}
                    </p>
                </TabsContent>

                <TabsContent
                    value='details'
                    className='mt-4 rounded-[24px] bg-white p-6 shadow-sm dark:bg-slate-900/80'>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <h2 className='text-2xl font-black text-slate-900 dark:text-white'>Kitob tafsilotlari</h2>
                            <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
                                Asosiy texnik va nashr ma'lumotlari
                            </p>
                        </div>
                    </div>

                    <div className='mt-6 grid gap-3 md:grid-cols-2'>
                        <div className='rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>Muallif</p>
                            <p className='mt-2 text-base font-bold text-slate-900 dark:text-white'>
                                {author || 'Kiritilmagan'}
                            </p>
                        </div>
                        <div className='rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>Kategoriya</p>
                            <p className='mt-2 text-base font-bold text-slate-900 dark:text-white'>
                                {category || 'Kiritilmagan'}
                            </p>
                        </div>
                        <div className='rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>Sahifalar</p>
                            <p className='mt-2 text-base font-bold text-slate-900 dark:text-white'>
                                {pages || 'Kiritilmagan'}
                            </p>
                        </div>
                        <div className='rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>Til</p>
                            <p className='mt-2 text-base font-bold text-slate-900 dark:text-white'>
                                {language?.toUpperCase() || 'Kiritilmagan'}
                            </p>
                        </div>
                        <div className='rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>Nashriyot</p>
                            <p className='mt-2 text-base font-bold text-slate-900 dark:text-white'>
                                {publisherName || 'Kiritilmagan'}
                            </p>
                        </div>
                        <div className='rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                            <p className='text-sm text-slate-500 dark:text-slate-400'>Yili</p>
                            <p className='mt-2 text-base font-bold text-slate-900 dark:text-white'>
                                {year || 'Kiritilmagan'}
                            </p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent
                    value='reviews'
                    className='mt-4 rounded-[24px] bg-white p-6 shadow-sm dark:bg-slate-900/80'>
                    <div className='flex justify-between gap-6'>
                        <div className='max-w-md'>
                            <h2 className='text-2xl font-black text-slate-900 dark:text-white'>Izohlar</h2>
                        </div>

                        <div className='rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-950/60'>
                            <p className='text-2xl font-black text-slate-900 dark:text-white'>{reviewsCount || 0}</p>
                            <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>Jami izoh</p>
                        </div>
                    </div>

                    <div className='mt-6 space-y-4'>
                        <div className='rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60'>
                            <div className='flex items-center justify-between gap-3'>
                                <div>
                                    <p className='font-bold text-slate-900 dark:text-white'>Foydalanuvchi izohi</p>
                                    <p className='text-sm text-slate-500 dark:text-slate-400'>Namuna ko‘rinish</p>
                                </div>
                                <div className='inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200'>
                                    <Star size={14} className='fill-yellow-400 text-yellow-400' />
                                    5.0
                                </div>
                            </div>
                            <p className='mt-4 leading-7 text-slate-600 dark:text-slate-300'>
                                Juda qulay o‘qiladigan nashr. Sifatli bosilgan va sovg‘a uchun ham mos ko‘rinadi.
                            </p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </motion.section>
    );
};

export default TabPanel;
