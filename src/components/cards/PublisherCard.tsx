import Link from 'next/link';

import EntityImage from '@/components/shared/EntityImage';
import type { PublisherItems } from '@/types';

import { BookOpen, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PublisherCardProps = {
    publisher: PublisherItems;
    className?: string;
};

const PublisherCard = ({ publisher, className = '' }: PublisherCardProps) => {
    const { t } = useTranslation();

    return (
        <article className={className}>
            <Link
                href={`/publishers/${publisher.slug ?? publisher._id}`}
                className='group flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#ef7f1a]/40 dark:border-slate-700 dark:bg-slate-900'>
                <EntityImage
                    src={publisher.image}
                    alt={publisher.name}
                    type='publisher'
                    className='size-16 shrink-0 rounded-xl'
                    imageClassName='size-full object-contain p-2'
                    iconClassName='size-8 text-[#ef7f1a]'
                />

                <div className='min-w-0 flex-1'>
                    <h3 className='truncate text-lg font-semibold text-slate-900 dark:text-white'>{publisher.name}</h3>
                    <div className='mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400'>
                        <BookOpen size={15} className='text-[#ef7f1a]' />
                        <span>{t('publish.booksCount', { count: publisher.booksCount })}</span>
                    </div>
                </div>

                <ChevronRight
                    size={20}
                    className='shrink-0 text-slate-300 group-hover:text-[#ef7f1a] dark:text-slate-600'
                />
            </Link>
        </article>
    );
};

export default PublisherCard;
