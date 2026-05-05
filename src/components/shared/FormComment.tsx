'use client';

import React, { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MessageSquareText, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

type Props = {
    bookId: string;
};

const FormComment = ({ bookId }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [comment, setComment] = useState('');

    const { mutate, isPending } = useMutation({
        mutationFn: UserService.createComment,
        onSuccess: () => {
            setComment('');
            toast.success('Izohingiz qabul qilindi');
            queryClient.invalidateQueries({
                queryKey: ['comments', bookId]
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Izoh yuborishda xatolik yuz berdi');
        }
    });

    const goToLogin = () => {
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (authLoading) return;

        if (!isAuthenticated) {
            toast.error('Izoh qoldirish uchun avval tizimga kiring');
            goToLogin();
            return;
        }

        const trimmedComment = comment.trim();

        if (!trimmedComment) {
            toast.error('Izoh matnini kiriting');
            return;
        }

        mutate({
            bookId,
            name: user?.name || user?.email || 'Foydalanuvchi',
            text: trimmedComment
        });
    };

    const isDisabled = authLoading || isPending || !isAuthenticated;

    return (
        <form
            onSubmit={handleSubmit}
            className='rounded-[22px] border border-[#f7e3cf] bg-[#fff9f3] p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-950/60'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-3'>
                    <span className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#ef7f1a]/10 text-[#ef7f1a] dark:bg-white/10 dark:text-orange-300'>
                        <MessageSquareText className='size-5' />
                    </span>
                    <div>
                        <label htmlFor='review' className='text-base font-black text-slate-900 dark:text-white'>
                            Fikringizni yozing
                        </label>
                        <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                            Kitob haqida qisqa taassurotingizni qoldiring.
                        </p>
                    </div>
                </div>
            </div>

            <div className='mt-4 overflow-hidden rounded-2xl border border-orange-100 bg-white transition focus-within:border-[#ef7f1a] focus-within:ring-4 focus-within:ring-[#ef7f1a]/10 dark:border-slate-800 dark:bg-slate-900'>
                <textarea
                    name='review'
                    id='review'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isDisabled}
                    rows={5}
                    placeholder={
                        isAuthenticated
                            ? 'Masalan: kitob juda qiziqarli, tavsiya qilaman...'
                            : 'Izoh qoldirish uchun avval tizimga kiring...'
                    }
                    className='min-h-32 w-full resize-none bg-transparent p-4 text-sm leading-7 text-slate-700 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:text-slate-200 dark:placeholder:text-slate-500'></textarea>
                <div className='flex flex-col gap-3 border-t border-orange-100 bg-orange-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950/70'>
                    <p className='text-xs font-medium text-slate-500 dark:text-slate-400'>
                        {isAuthenticated
                            ? 'Izohlaringiz boshqa xaridorlarga tanlov qilishda yordam beradi.'
                            : 'Izoh yozish va yuborish uchun akkauntingizga kiring.'}
                    </p>
                    {isAuthenticated ? (
                        <button
                            disabled={isDisabled}
                            type='submit'
                            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d96f14] focus:ring-4 focus:ring-[#ef7f1a]/25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none'>
                            <Send className='size-4' />
                            {isPending ? 'Yuborilmoqda...' : 'Izoh qoldirish'}
                        </button>
                    ) : (
                        <button
                            type='button'
                            onClick={goToLogin}
                            disabled={authLoading}
                            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-[#ef7f1a] focus:ring-4 focus:ring-[#ef7f1a]/25 focus:outline-none disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:shadow-none dark:hover:bg-orange-100'>
                            Tizimga kirish
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default FormComment;
