import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserService } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

import FormComment from './FormComment';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

type BookComment = {
    _id?: string;
    id?: string;
    name?: string;
    text?: string;
    comment?: string;
    content?: string;
    message?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    user?:
        | string
        | {
              name?: string;
              email?: string;
              avatar?: string;
          };
};

type TabPanelProps = {
    bookId?: string;
    description?: string;
    author?: string;
    category?: string;
    pages?: number;
    language?: string;
    publisherName?: string;
    year?: number;
    reviewsCount?: number;
};

const getCommentList = (data: unknown): BookComment[] => {
    if (Array.isArray(data)) return data;

    if (data && typeof data === 'object') {
        const value = data as {
            comment?: BookComment[] | BookComment;
            comments?: BookComment[];
            items?: BookComment[];
            docs?: BookComment[];
            results?: BookComment[];
            data?:
                | BookComment[]
                | {
                      comment?: BookComment[] | BookComment;
                      comments?: BookComment[];
                      items?: BookComment[];
                      docs?: BookComment[];
                      results?: BookComment[];
                  };
        };

        if (Array.isArray(value.comment)) return value.comment;
        if (value.comment && typeof value.comment === 'object') return [value.comment];
        if (Array.isArray(value.comments)) return value.comments;
        if (Array.isArray(value.items)) return value.items;
        if (Array.isArray(value.docs)) return value.docs;
        if (Array.isArray(value.results)) return value.results;
        if (Array.isArray(value.data)) return value.data;

        if (value.data && typeof value.data === 'object') {
            if (Array.isArray(value.data.comment)) return value.data.comment;
            if (value.data.comment && typeof value.data.comment === 'object') return [value.data.comment];
            if (Array.isArray(value.data.comments)) return value.data.comments;
            if (Array.isArray(value.data.items)) return value.data.items;
            if (Array.isArray(value.data.docs)) return value.data.docs;
            if (Array.isArray(value.data.results)) return value.data.results;
        }
    }

    return [];
};

const getCommentAuthor = (comment: BookComment) => {
    if (comment.name) return comment.name;
    if (comment.user && typeof comment.user === 'object')
        return comment.user.name || comment.user.email || 'Foydalanuvchi';

    return 'Foydalanuvchi';
};

const getCommentText = (comment: BookComment) =>
    comment.text || comment.comment || comment.content || comment.message || '';

const getCommentInitial = (name: string) => name.trim().charAt(0).toUpperCase() || 'F';

const formatCommentDate = (date?: string) => {
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY HH:mm') : 'Yangi izoh';
};

const TabPanel = ({
    bookId,
    description,
    author,
    category,
    pages,
    language,
    publisherName,
    year,
    reviewsCount
}: TabPanelProps) => {
    const [activeTab, setActiveTab] = React.useState('description');
    const { data: commentsData, isLoading: commentsLoading } = useQuery({
        queryKey: ['comments', bookId],
        queryFn: () => UserService.getComments(bookId!),
        enabled: !!bookId && activeTab === 'reviews',
        staleTime: 5 * 60 * 1000
    });

    const comments = getCommentList(commentsData).filter(
        (comment) => !comment.status || ['approved', 'aproved'].includes(comment.status)
    );
    const totalComments = commentsData ? comments.length : reviewsCount || 0;

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-12 rounded-[28px] border border-[#f7e3cf] bg-[#fff9f3] p-3 shadow-lg shadow-orange-100/70 backdrop-blur dark:border-slate-700 dark:bg-slate-800 dark:shadow-none'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
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
                            <p className='text-2xl font-black text-slate-900 dark:text-white'>{totalComments}</p>
                            <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>Jami izoh</p>
                        </div>
                    </div>

                    <div className='mt-6 space-y-4'>
                        {bookId ? <FormComment bookId={bookId} /> : null}

                        {commentsLoading ? (
                            <div className='space-y-3'>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className='animate-pulse rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60'>
                                        <div className='flex items-center gap-3'>
                                            <div className='size-10 rounded-2xl bg-slate-200 dark:bg-slate-800' />
                                            <div className='space-y-2'>
                                                <div className='h-4 w-36 rounded-full bg-slate-200 dark:bg-slate-800' />
                                                <div className='h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-800' />
                                            </div>
                                        </div>
                                        <div className='mt-4 h-4 w-full rounded-full bg-slate-200 dark:bg-slate-800' />
                                        <div className='mt-2 h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800' />
                                    </div>
                                ))}
                            </div>
                        ) : comments.length ? (
                            <div className='space-y-3'>
                                {comments.map((comment, index) => {
                                    const authorName = getCommentAuthor(comment);
                                    const commentText = getCommentText(comment);

                                    return (
                                        <div
                                            key={comment._id || comment.id || `${authorName}-${index}`}
                                            className='rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60'>
                                            <div className='flex items-start justify-between gap-3'>
                                                <div className='flex min-w-0 items-center gap-3'>
                                                    <span className='flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#ef7f1a]/10 text-sm font-black text-[#ef7f1a] dark:bg-white/10 dark:text-orange-300'>
                                                        {getCommentInitial(authorName)}
                                                    </span>
                                                    <div className='min-w-0'>
                                                        <p className='truncate font-bold text-slate-900 dark:text-white'>
                                                            {authorName}
                                                        </p>
                                                        <p className='text-sm text-slate-500 dark:text-slate-400'>
                                                            {formatCommentDate(comment.createdAt || comment.updatedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className='mt-4 leading-7 whitespace-pre-line text-slate-600 dark:text-slate-300'>
                                                {commentText}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className='rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-6 text-center dark:border-slate-800 dark:bg-slate-950/60'>
                                <div className='mx-auto flex size-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#ef7f1a] shadow-sm dark:bg-slate-900 dark:text-orange-300'>
                                    0
                                </div>
                                <h3 className='mt-4 text-lg font-black text-slate-900 dark:text-white'>
                                    Hozircha izohlar yo'q
                                </h3>
                                <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400'>
                                    Bu kitob haqida birinchi fikrni siz qoldirishingiz mumkin.
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </motion.section>
    );
};

export default TabPanel;
