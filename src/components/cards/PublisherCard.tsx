import Link from 'next/link';

import type { PublisherItems } from '@/types';
import { getImageUrl } from '@/utils/image';

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PublisherCardProps = {
    publisher: PublisherItems;
    className?: string;
};

const PublisherCard = ({ publisher, className = '' }: PublisherCardProps) => {
    const { t } = useTranslation();

    return (
        <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_18px_50px_-26px_rgba(15,23,42,0.45)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#ef7f1a]/40 dark:border-slate-700 dark:bg-slate-900/75 ${className}`}>
            <div className='mb-5 flex items-start justify-between gap-4'>
                <div className='relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 text-2xl font-black text-[#ef7f1a] shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-slate-700 dark:bg-slate-800'>
                    {publisher.image ? (
                        <img
                            src={getImageUrl(publisher.image)}
                            alt={publisher.name}
                            className='h-full w-full object-contain p-2'
                        />
                    ) : (
                        <span>{publisher.name?.charAt(0)?.toUpperCase()}</span>
                    )}
                </div>

                <div className='rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#ef7f1a] dark:bg-orange-400/10 dark:text-orange-300'>
                    Nashriyot
                </div>
            </div>

            <div className='space-y-2'>
                <h3 className='line-clamp-2 text-xl font-black tracking-tight text-slate-900 dark:text-white'>
                    {publisher.name}
                </h3>
            </div>

            <div className='mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-slate-700'>
                <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200'>
                    <BookOpen size={16} className='text-[#ef7f1a] dark:text-orange-300' />
                    <span>{publisher.booksCount} ta kitob</span>
                </div>

                <Link
                    href={`/publishers/${publisher.slug ?? publisher._id}`}
                    className='flex items-center gap-1 text-sm font-bold text-slate-400 transition-colors group-hover:text-[#005CB9] dark:text-slate-500 dark:group-hover:text-blue-300'>
                    <span>{t('publish.viewDetails')}</span>
                    <ChevronRight size={16} />
                </Link>
            </div>
        </motion.article>
    );
};

export default PublisherCard;
