'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useCreateFaq } from '@/components/admin/hooks/faqsHooks/useCreateFaq';
import { useUpdateFaq } from '@/components/admin/hooks/faqsHooks/useUpdateFaq';
import { useFaqDetailQuery } from '@/components/admin/hooks/queries/faq';
import HeadSectionEdit from '@/components/admin/sections/HeadSectionEdit';
import { LocalizedText } from '@/types/book';

import { Languages, MessageSquareText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const inputClass =
    'h-12 w-full rounded-2xl border border-[#eadfce] bg-white px-4 text-sm font-semibold text-[#2f2a25] transition outline-none placeholder:text-[#b0a391] focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

const textareaClass =
    'w-full resize-none rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#2f2a25] transition outline-none placeholder:text-[#b0a391] focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

export type FaqForm = {
    question: LocalizedText;
    answer: LocalizedText;
};

const AdminFaqNewPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const editId = id;
    const { reset, handleSubmit, register } = useForm<FaqForm>({
        defaultValues: {
            question: {
                uz: '',
                ru: '',
                en: ''
            },
            answer: {
                uz: '',
                ru: '',
                en: ''
            }
        }
    });

    const { mutateAsync: createFaq, isPending: isCreateFaq } = useCreateFaq();
    const { mutateAsync: updateFaq, isPending: isUpdateFaq } = useUpdateFaq();
    const { data: faqData } = useFaqDetailQuery(id);
    const isPending = id ? isUpdateFaq : isCreateFaq;

    useEffect(() => {
        if (faqData?.data) {
            reset({
                question: {
                    uz: faqData.data.question?.uz ?? '',
                    ru: faqData.data.question?.ru ?? '',
                    en: faqData.data.question?.en ?? ''
                },
                answer: {
                    uz: faqData.data.answer?.uz ?? '',
                    ru: faqData.data.answer?.ru ?? '',
                    en: faqData.data.answer?.en ?? ''
                }
            });
        }
    }, [faqData, reset]);

    const onSubmit = async (values: FaqForm) => {
        try {
            if (id) {
                await updateFaq({ id, data: values });
                toast.success('Faq muvaffaqiyatli yangilandi');
                router.push('/admin/faq');
                router.refresh();
            } else {
                const onSuccess = () => {
                    toast.success("Faq muvaffaqiyatli qo'shildi");
                };

                const onError = () => {
                    toast.error("Faq muvaffaqiyatli qo'shilmadi");
                };

                await createFaq(values, { onSuccess, onError });
                reset();
                router.push('/admin/faq');
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || "Faq qo'shishda xatolik");
        }
    };

    return (
        <div className='space-y-5'>
            <HeadSectionEdit
                title='FAQ'
                href='/admin/faq'
                form='faq'
                isPending={isPending}
                isEdit={!!editId}
                backLabel='Barcha FAQ'
                createTitle="Yangi FAQ qo'shish"
                createDescription="Savol, javob, kategoriya va ko'rinish holatini kiriting."
            />

            <section className='grid gap-5'>
                <form
                    id='faq-form'
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-5 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                    <section className='rounded-[22px] bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                        <div className='mb-4 flex items-center gap-2'>
                            <span className='grid size-9 place-items-center rounded-xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-800'>
                                <Languages size={17} />
                            </span>
                            <h3 className='text-base font-black text-[#2f2a25] dark:text-white'>Savol matni</h3>
                        </div>

                        <div className='grid gap-3 md:grid-cols-3'>
                            <label className='space-y-2'>
                                <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Savol uz</span>
                                <input
                                    type='text'
                                    {...register('question.uz')}
                                    placeholder='Buyurtmani qanday beraman?'
                                    className={inputClass}
                                />
                            </label>
                            <label className='space-y-2'>
                                <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Savol ru</span>
                                <input
                                    type='text'
                                    {...register('question.ru')}
                                    placeholder='Kak oformit zakaz?'
                                    className={inputClass}
                                />
                            </label>
                            <label className='space-y-2'>
                                <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Savol en</span>
                                <input
                                    type='text'
                                    {...register('question.en')}
                                    placeholder='How can I place an order?'
                                    className={inputClass}
                                />
                            </label>
                        </div>
                    </section>

                    <section className='rounded-[22px] bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                        <div className='mb-4 flex items-center gap-2'>
                            <span className='grid size-9 place-items-center rounded-xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-800'>
                                <MessageSquareText size={17} />
                            </span>
                            <h3 className='text-base font-black text-[#2f2a25] dark:text-white'>Javob matni</h3>
                        </div>

                        <div className='grid gap-3'>
                            <label className='space-y-2'>
                                <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Javob uz</span>
                                <textarea
                                    rows={5}
                                    {...register('answer.uz')}
                                    placeholder="Kitobni savatga qo'shing, ma'lumotlarni kiriting va to'lovni tasdiqlang."
                                    className={textareaClass}
                                />
                            </label>
                            <label className='space-y-2'>
                                <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Javob ru</span>
                                <textarea
                                    rows={5}
                                    {...register('answer.ru')}
                                    placeholder='Dobavte knigu v korzinu, zapolnite dannye i podtverdite oplatu.'
                                    className={textareaClass}
                                />
                            </label>
                            <label className='space-y-2'>
                                <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Javob en</span>
                                <textarea
                                    rows={5}
                                    {...register('answer.en')}
                                    placeholder='Add the book to cart, fill in the details and confirm payment.'
                                    className={textareaClass}
                                />
                            </label>
                        </div>
                    </section>
                </form>
            </section>
        </div>
    );
};

export default AdminFaqNewPage;
