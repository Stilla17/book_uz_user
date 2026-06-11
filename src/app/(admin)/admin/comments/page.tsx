'use client';

import { useMemo, useState } from 'react';

import { useDeleteComment, useGetComment, useUpdateCommentStatus } from '@/components/admin/hooks/queries/comment';
import HeadSection from '@/components/admin/sections/HeadSection';
import { Button } from '@/components/ui/button';
import { BooksTableSkeleton } from '@/components/ui/skeleton';
import {
    getCommentAuthorName,
    getCommentBookTitle,
    statusLabels,
    statusOptions,
    statusStyles
} from '@/helpers/comment';
import type { CommentStatus } from '@/types/comment';

import dayjs from 'dayjs';
import { CheckCircle2, Clock3, MessageSquareText, Search, Trash2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCommentPage = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'all' | CommentStatus>('all');

    const { data: commentsData, isLoading } = useGetComment();
    const { mutate: deleteComment } = useDeleteComment();
    const { mutate: updateCommentStatus } = useUpdateCommentStatus();

    const filteredComments = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        return (
            commentsData?.filter((comment) => {
                const authorName = getCommentAuthorName(comment);
                const matchesStatus =
                    status === 'all' ||
                    comment.status === status ||
                    (status === 'approved' && comment.status === 'aproved');
                const matchesSearch =
                    authorName.toLowerCase().includes(keyword) || comment.text.toLowerCase().includes(keyword);
                return matchesStatus && matchesSearch;
            }) || []
        );
    }, [commentsData, search, status]);

    const stats = [
        {
            label: 'Jami izohlar',
            value: commentsData?.length ?? 0,
            icon: MessageSquareText,
            color: 'bg-[#ef7f1a]'
        },
        {
            label: 'Tasdiqlangan',
            value: commentsData?.filter((comment) => ['approved', 'aproved'].includes(comment.status)).length ?? 0,
            icon: CheckCircle2,
            color: 'bg-emerald-500'
        },
        {
            label: 'Kutilayotgan izohlar',
            value: commentsData?.filter((comment) => comment.status === 'pending').length ?? 0,
            icon: Clock3,
            color: 'bg-amber-500'
        },
        {
            label: 'Rad etilgan',
            value: commentsData?.filter((comment) => comment.status === 'rejected').length ?? 0,
            icon: XCircle,
            color: 'bg-red-500'
        }
    ];

    const handleStatusAction = (commentId: string, status: CommentStatus, message: string) => {
        updateCommentStatus(
            { commentId, status },
            {
                onSuccess: () => toast.success(message),
                onError: () => toast.error("Izoh statusini o'zgartirib bo'lmadi")
            }
        );
    };

    const handleDeleteAction = (commentId: string) => {
        deleteComment(commentId, {
            onSuccess: () => toast.success("Izoh o'chirildi"),
            onError: () => toast.error("Izohni o'chirib bo'lmadi")
        });
    };

    return (
        <div className='space-y-5'>
            <HeadSection
                title='Izohlar'
                text='Kitoblarga yozilgan fikrlar, reytinglar va moderatsiya holatlarini boshqarish sahifasi.'
                href='comment'
            />

            <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className='rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <span className={`grid size-11 place-items-center rounded-2xl ${color} text-white`}>
                            <Icon size={20} />
                        </span>
                        {isLoading ? (
                            <div className='mt-4 h-8 w-16 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                        ) : (
                            <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>{value}</p>
                        )}
                        <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>{label}</p>
                    </div>
                ))}
            </section>

            <section className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800'>
                    <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] lg:max-w-sm lg:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                        <Search size={18} className='shrink-0' />
                        <input
                            type='search'
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder='Foydalanuvchi, kitob yoki izoh qidirish'
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>

                    <div className='flex flex-wrap gap-2'>
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                type='button'
                                onClick={() => setStatus(option.value)}
                                className={`h-10 rounded-xl px-4 text-sm font-black transition ${
                                    status === option.value
                                        ? 'bg-[#ef7f1a] text-white'
                                        : 'bg-white text-[#817466] hover:bg-[#f2e7d8] dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                }`}>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[920px] text-left'>
                        <thead>
                            <tr className='border-b border-[#eadfce] text-xs font-black text-[#9d907e] uppercase dark:border-slate-800 dark:text-slate-500'>
                                <th className='px-4 py-3'>Foydalanuvchi</th>
                                <th className='px-4 py-3'>Kitob</th>
                                <th className='px-4 py-3'>Izoh</th>
                                <th className='px-4 py-3'>Status</th>
                                <th className='px-4 py-3'>Sana</th>
                                <th className='px-4 py-3 text-right'>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <BooksTableSkeleton />
                            ) : filteredComments.length ? (
                                filteredComments.map((comment) => (
                                    <tr
                                        key={comment._id}
                                        className='border-b border-[#f0e4d3] bg-white align-top last:border-0 dark:border-slate-900 dark:bg-slate-950'>
                                        <td className='px-4 py-4'>
                                            <span className='inline-flex max-w-[160px] rounded-full bg-[#f2e7d8] px-3 py-1 text-xs font-black text-[#6f6255] dark:bg-slate-900 dark:text-slate-300'>
                                                <span className='truncate'>{getCommentAuthorName(comment)}</span>
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <p className='max-w-[190px] truncate text-sm font-black text-[#2f2a25] dark:text-white'>
                                                {getCommentBookTitle(comment)}
                                            </p>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <p className='line-clamp-2 max-w-md text-sm leading-6 font-semibold text-[#6f6255] dark:text-slate-300'>
                                                {comment.text}
                                            </p>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${statusStyles[comment.status]}`}>
                                                {statusLabels[comment.status]}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span className='text-xs font-bold whitespace-nowrap text-[#9d907e] dark:text-slate-500'>
                                                {dayjs(comment.createdAt).format('DD.MM.YYYY HH:mm')}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='flex items-center justify-end gap-2'>
                                                <Button
                                                    size='icon-sm'
                                                    variant='ghost'
                                                    onClick={() =>
                                                        handleStatusAction(comment._id, 'approved', 'Izoh tasdiqlandi')
                                                    }
                                                    className='rounded-xl text-emerald-600 hover:text-emerald-700'>
                                                    <CheckCircle2 size={17} />
                                                </Button>
                                                <Button
                                                    size='icon-sm'
                                                    variant='ghost'
                                                    onClick={() =>
                                                        handleStatusAction(comment._id, 'rejected', 'Izoh rad etildi')
                                                    }
                                                    className='rounded-xl text-amber-600 hover:text-amber-700'>
                                                    <XCircle size={17} />
                                                </Button>
                                                <Button
                                                    size='icon-sm'
                                                    variant='ghost'
                                                    onClick={() => handleDeleteAction(comment._id)}
                                                    className='rounded-xl text-red-500 hover:text-red-600'>
                                                    <Trash2 size={17} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className='bg-white px-4 py-8 text-center text-sm font-bold text-[#8b7e70] dark:bg-slate-950 dark:text-slate-400'>
                                        Izoh topilmadi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminCommentPage;
