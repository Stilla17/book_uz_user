'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useCreateNews } from '@/components/admin/hooks/newsHooks/useCreateNews';
import { useUpdateNews } from '@/components/admin/hooks/newsHooks/useUpdateNews';
import { useNewsDetailQuery } from '@/components/admin/hooks/queries/news';
import { useImagePreview } from '@/components/admin/hooks/useImagePreview';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/utils/image';

import { CalendarDays, FileText, ImagePlus, Languages, Link2, Loader, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type LocalizedText = {
    uz: string;
    ru: string;
    en: string;
};

type NewsFormValues = {
    title: LocalizedText;
    slug: string;
    image?: FileList;
    excerpt: LocalizedText;
    description: LocalizedText;
    views: number;
    createdAt?: string;
};

type LocalizedValue = string | Partial<LocalizedText> | null | undefined;

const inputClass =
    'h-12 w-full rounded-2xl border border-[#eadfce] bg-white px-4 text-sm font-semibold text-[#2f2a25] transition outline-none placeholder:text-[#b0a391] focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

const textareaClass =
    'w-full resize-none rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#2f2a25] transition outline-none placeholder:text-[#b0a391] focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/['"`]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const normalizeLocalizedText = (value: LocalizedValue): LocalizedText => {
    if (!value) return { uz: '', ru: '', en: '' };
    if (typeof value === 'string') return { uz: value, ru: '', en: '' };

    return {
        uz: value.uz || '',
        ru: value.ru || '',
        en: value.en || ''
    };
};

const formatDateInputValue = (value?: string) => (value ? value.slice(0, 10) : '');

const AdminNewsNewPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEdit = !!id;
    const { imageFile, imagePreview, setImagePreview, handleImageChange, clearImagePreview } = useImagePreview();
    const { handleSubmit, reset, register, setValue, getValues } = useForm<NewsFormValues>({
        defaultValues: {
            title: {
                uz: '',
                ru: '',
                en: ''
            },
            slug: '',
            image: undefined,
            excerpt: {
                uz: '',
                ru: '',
                en: ''
            },
            description: {
                uz: '',
                ru: '',
                en: ''
            },
            views: 0,
            createdAt: ''
        }
    });

    const { mutate: createNews, isPending: isCreatePending } = useCreateNews();
    const { mutate: updateNews, isPending: isUpdatePending } = useUpdateNews();
    const { data: newsData, isLoading: isDetailLoading } = useNewsDetailQuery(id);
    const isPending = isCreatePending || isUpdatePending;

    useEffect(() => {
        if (!newsData) return;

        reset({
            title: normalizeLocalizedText(newsData.title),
            slug: newsData.slug || '',
            image: undefined,
            excerpt: normalizeLocalizedText(newsData.excerpt),
            description: normalizeLocalizedText(newsData.description),
            views: newsData.views || 0,
            createdAt: formatDateInputValue(newsData.createdAt)
        });

        if (newsData.image) {
            setImagePreview(getImageUrl(newsData.image) || '');
        }
    }, [newsData, reset, setImagePreview]);

    const handleTitleUzChange = (value: string) => {
        setValue('title.uz', value);
        if (!getValues('slug')) setValue('slug', slugify(value));
    };

    const onSubmit = (values: NewsFormValues) => {
        const formData = new FormData();

        formData.append('title', JSON.stringify(values.title));
        formData.append('slug', values.slug);
        formData.append('excerpt', JSON.stringify(values.excerpt));
        formData.append('description', JSON.stringify(values.description));
        formData.append('views', String(values.views || 0));
        if (values.createdAt) formData.append('createdAt', values.createdAt);
        if (imageFile) formData.append('image', imageFile);

        const onSuccess = () => {
            reset();
            clearImagePreview();
            toast.success(isEdit ? 'Yangilik muvaffaqiyatli yangilandi' : "Yangilik muvaffaqiyatli qo'shildi");
            router.push('/admin/news');
            router.refresh();
        };
        const onError = (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || 'Yangilik saqlashda xatolik');
        };

        if (id) {
            updateNews(
                { id, formData },
                {
                    onSuccess,
                    onError
                }
            );
        } else {
            createNews(formData, {
                onSuccess,
                onError
            });
        }
    };

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <h2 className='text-2xl font-black text-[#2f2a25] dark:text-white'>
                        {isEdit ? 'Yangilikni tahrirlash' : 'Yangi yangilik'}
                    </h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        {isEdit
                            ? "Yangilik ma'lumotlarini yangilang va o'zgarishlarni saqlang."
                            : "Sayt uchun yangi maqola, e'lon yoki yangilik ma'lumotlarini kiriting."}
                    </p>
                </div>

                <div className='flex items-center gap-3 pt-4'>
                    <Button
                        asChild
                        variant='outline'
                        className='h-11 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                        <Link href='/admin/news'>Bekor qilish</Link>
                    </Button>
                    <Button
                        type='submit'
                        form='news-form'
                        disabled={isPending}
                        className='h-11 rounded-2xl bg-[#ef7f1a] px-6 font-black text-white hover:bg-orange-600 disabled:opacity-50'>
                        <Save size={18} />
                        {isPending ? 'Saqlanmoqda...' : isEdit ? 'Yangilash' : 'Saqlash'}
                    </Button>
                </div>
            </section>

            <section className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
                <form
                    id='news-form'
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-5 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                    {isDetailLoading ? (
                        <div className='flex items-center justify-center gap-2 rounded-[22px] bg-white p-8 text-sm font-semibold text-[#8b7e70] ring-1 ring-[#eadfce] dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'>
                            <Loader size={18} className='animate-spin' />
                            Yuklanmoqda...
                        </div>
                    ) : null}
                    <div className='space-y-5'>
                        <section className='rounded-[22px] bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                            <div className='mb-4 flex items-center gap-2'>
                                <span className='grid size-9 place-items-center rounded-xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-800'>
                                    <Languages size={17} />
                                </span>
                                <h3 className='text-base font-black text-[#2f2a25] dark:text-white'>Sarlavha</h3>
                            </div>

                            <div className='grid gap-3 md:grid-cols-3'>
                                <label className='space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Sarlavha uz
                                    </span>
                                    <input
                                        type='text'
                                        {...register('title.uz', {
                                            required: true,
                                            onChange: (event) => handleTitleUzChange(event.target.value)
                                        })}
                                        placeholder='Yangilik sarlavhasi'
                                        className={inputClass}
                                    />
                                </label>
                                <label className='space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Sarlavha ru
                                    </span>
                                    <input
                                        type='text'
                                        {...register('title.ru', { required: true })}
                                        placeholder='Заголовок новости'
                                        className={inputClass}
                                    />
                                </label>
                                <label className='space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Sarlavha en
                                    </span>
                                    <input
                                        type='text'
                                        {...register('title.en', { required: true })}
                                        placeholder='News title'
                                        className={inputClass}
                                    />
                                </label>
                            </div>
                        </section>

                        <div className='grid gap-4 md:grid-cols-2'>
                            <label className='space-y-2'>
                                <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Slug</span>
                                <div className='flex h-12 items-center gap-2 rounded-2xl border border-[#eadfce] bg-white px-4 text-[#817466] transition focus-within:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                                    <Link2 size={17} className='shrink-0' />
                                    <input
                                        type='text'
                                        {...register('slug', {
                                            required: true,
                                            onChange: (event) => setValue('slug', slugify(event.target.value))
                                        })}
                                        placeholder='yangilik-slugi'
                                        className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#2f2a25] outline-none placeholder:text-[#b0a391] dark:text-white dark:placeholder:text-slate-500'
                                    />
                                </div>
                            </label>

                            <label className='space-y-2'>
                                <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Sana</span>
                                <div className='flex h-12 items-center gap-2 rounded-2xl border border-[#eadfce] bg-white px-4 text-[#817466] transition focus-within:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                                    <CalendarDays size={17} className='shrink-0' />
                                    <input
                                        type='date'
                                        {...register('createdAt')}
                                        className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#2f2a25] outline-none dark:text-white'
                                    />
                                </div>
                            </label>
                        </div>

                        <section className='rounded-[22px] bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                            <div className='mb-4 flex items-center gap-2'>
                                <span className='grid size-9 place-items-center rounded-xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-800'>
                                    <FileText size={17} />
                                </span>
                                <h3 className='text-base font-black text-[#2f2a25] dark:text-white'>Qisqa izoh</h3>
                            </div>

                            <div className='grid gap-3 md:grid-cols-3'>
                                <label className='space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Izoh uz
                                    </span>
                                    <textarea
                                        rows={4}
                                        {...register('excerpt.uz', { required: true })}
                                        placeholder='Yangilik haqida qisqa matn'
                                        className={textareaClass}
                                    />
                                </label>
                                <label className='space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Izoh ru
                                    </span>
                                    <textarea
                                        rows={4}
                                        {...register('excerpt.ru', { required: true })}
                                        placeholder='Краткое описание новости'
                                        className={textareaClass}
                                    />
                                </label>
                                <label className='space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Izoh en
                                    </span>
                                    <textarea
                                        rows={4}
                                        {...register('excerpt.en', { required: true })}
                                        placeholder='Short news excerpt'
                                        className={textareaClass}
                                    />
                                </label>
                            </div>
                        </section>

                        <section className='rounded-[22px] bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                            <div className='mb-4 flex items-center gap-2'>
                                <span className='grid size-9 place-items-center rounded-xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-800'>
                                    <FileText size={17} />
                                </span>
                                <h3 className='text-base font-black text-[#2f2a25] dark:text-white'>To'liq matn</h3>
                            </div>

                            <div className='grid gap-3'>
                                <label className='space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Matn uz
                                    </span>
                                    <textarea
                                        rows={7}
                                        {...register('description.uz', { required: true })}
                                        placeholder='Yangilik matni'
                                        className={`${textareaClass} leading-6`}
                                    />
                                </label>
                                <label className='space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Matn ru
                                    </span>
                                    <textarea
                                        rows={7}
                                        {...register('description.ru', { required: true })}
                                        placeholder='Текст новости'
                                        className={`${textareaClass} leading-6`}
                                    />
                                </label>
                                <label className='space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Matn en
                                    </span>
                                    <textarea
                                        rows={7}
                                        {...register('description.en', { required: true })}
                                        placeholder='News content'
                                        className={`${textareaClass} leading-6`}
                                    />
                                </label>
                            </div>
                        </section>
                    </div>
                </form>

                <aside className='space-y-5'>
                    <div className='rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <h3 className='text-base font-black text-[#2f2a25] dark:text-white'>Rasm</h3>
                        <div className='relative mt-4 grid min-h-58 place-items-center overflow-hidden rounded-[22px] border-2 border-dashed border-[#eadfce] bg-white px-4 text-center dark:border-slate-800 dark:bg-slate-900'>
                            {imagePreview ? (
                                <div className='absolute inset-0'>
                                    <img
                                        src={imagePreview}
                                        alt='Yangilik rasmi'
                                        className='h-full w-full object-cover'
                                    />
                                    <button
                                        type='button'
                                        onClick={clearImagePreview}
                                        className='absolute top-3 right-3 grid size-9 place-items-center rounded-xl bg-white text-red-500 shadow-sm transition hover:bg-red-50 dark:bg-slate-950 dark:hover:bg-red-500/10'
                                        aria-label='Rasmni olib tashlash'>
                                        <X size={17} />
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <span className='mx-auto grid size-14 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-800'>
                                        <ImagePlus size={24} />
                                    </span>
                                    <span className='mt-4 block text-sm font-black text-[#2f2a25] dark:text-white'>
                                        Rasm yuklash
                                    </span>
                                    <span className='mt-1 block text-xs font-semibold text-[#9d907e] dark:text-slate-400'>
                                        PNG, JPG yoki WEBP
                                    </span>
                                </div>
                            )}
                        </div>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='mt-4 w-full rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#2f2a25] dark:border-slate-800 dark:bg-slate-900 dark:text-white'
                        />
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default AdminNewsNewPage;
