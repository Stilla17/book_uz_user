'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useCreateAuthor } from '@/components/admin/hooks/authorsHooks/useCreateAuthor';
import { useUpdateAuthor } from '@/components/admin/hooks/authorsHooks/useUpdateAuthor';
import { useAuthorDetailQuery } from '@/components/admin/hooks/queries/author';
import { useImagePreview } from '@/components/admin/hooks/useImagePreview';
import { Field, SectionTitle, inputClass } from '@/components/admin/other/FiledSettingsAdmin';
import HeadSectionEdit from '@/components/admin/sections/HeadSectionEdit';
import { Input } from '@/components/ui/input';
import { AUTHOR_DEFAULT_VALUES, buildAuthorFormData, validateAuthorDates } from '@/helpers/authorForm';
import type { AuthorFormValues } from '@/types/author.types';
import { formatDateInputValue, slugify } from '@/utils/formHelpers';
import { getImageUrl } from '@/utils/image';

import { ImagePlus, Loader, ScrollText, Upload, UserRound, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AdminNewAuthorPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const id = searchParams.get('id');
    const isEdit = !!id;

    const createMutation = useCreateAuthor();
    const updateMutation = useUpdateAuthor();
    const { data: authorData, isLoading: isDetailLoading, isError: isDetailError } = useAuthorDetailQuery(id);
    const { imageFile, imagePreview, setImagePreview, handleImageChange, clearImagePreview } = useImagePreview();
    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: { dirtyFields }
    } = useForm<AuthorFormValues>({
        defaultValues: AUTHOR_DEFAULT_VALUES
    });

    const isPending = isEdit ? updateMutation.isPending : createMutation.isPending;

    useEffect(() => {
        if (!authorData) return;

        reset({
            name: authorData.name ?? '',
            slug: authorData.slug ?? '',
            bio: {
                ...AUTHOR_DEFAULT_VALUES.bio,
                ...authorData.bio
            },
            birthDate: formatDateInputValue(authorData.birthDate),
            deathDate: formatDateInputValue(authorData.deathDate)
        });

        setImagePreview(getImageUrl(authorData.image) ?? '');
    }, [authorData, reset, setImagePreview]);

    const handleNameChange = (value: string) => {
        setValue('name', value, {
            shouldDirty: true
        });

        if (!dirtyFields.slug) {
            setValue('slug', slugify(value), {
                shouldDirty: false
            });
        }
    };

    const finishSubmission = (message: string) => {
        toast.success(message);
        router.push('/admin/authors');
        router.refresh();
    };

    const getErrorMessage = (error: unknown, fallback: string) => {
        const maybeError = error as { response?: { data?: { message?: string | string[] } } };
        const message = maybeError.response?.data?.message;

        return Array.isArray(message) ? message.join(', ') : message || fallback;
    };

    const onSubmit = (values: AuthorFormValues) => {
        const dateError = validateAuthorDates(values);

        if (dateError) {
            toast.error(dateError);
            return;
        }

        const formData = buildAuthorFormData(values, imageFile);

        if (isEdit) {
            const updateId = authorData?._id ?? id;

            if (!updateId || !/^[0-9a-fA-F]{24}$/.test(updateId)) {
                toast.error('Muallif topilmadi. Ro‘yxatga qaytib, qaytadan tahrirlashni oching.');
                return;
            }

            updateMutation.mutate(
                {
                    id: updateId,
                    formData
                },
                {
                    onSuccess: () => {
                        finishSubmission('Muallif muvaffaqiyatli yangilandi');
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, 'Muallifni yangilashda xatolik yuz berdi'));
                    }
                }
            );

            return;
        }

        createMutation.mutate(formData, {
            onSuccess: () => {
                reset(AUTHOR_DEFAULT_VALUES);
                clearImagePreview();
                finishSubmission('Muallif muvaffaqiyatli qo‘shildi');
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, 'Muallifni yaratishda xatolik yuz berdi'));
            }
        });
    };

    return (
        <div className='space-y-5'>
            <HeadSectionEdit
                title='Muallif'
                href='/admin/authors'
                form='author'
                backLabel='Barcha mualliflar'
                isEdit={isEdit}
                createTitle="Yangi muallif qo'shish"
                editTitle='Muallifni tahrirlash'
                createDescription='Muallif profili uchun ism, slug, biografiya, hayot sanalari va rasmni kiriting.'
                editDescription="Muallif ma'lumotlarini yangilang va o'zgarishlarni saqlang."
                isPending={isPending}
            />

            <form id='author-form' onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                {isDetailLoading && (
                    <div className='flex items-center justify-center gap-2 rounded-[24px] bg-[#fffaf2] p-8 text-sm font-semibold text-[#8b7e70] ring-1 ring-[#eadfce] dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-800'>
                        <Loader size={18} className='animate-spin' />
                        Yuklanmoqda...
                    </div>
                )}

                {isEdit && isDetailError && (
                    <div className='rounded-[24px] bg-red-50 p-5 text-sm font-semibold text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20'>
                        Muallif topilmadi yoki o'chirilgan. Mualliflar ro'yxatiga qaytib, sahifani yangilang.
                    </div>
                )}

                <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <SectionTitle icon={UserRound} title="Asosiy ma'lumotlar" />

                    <div className='grid gap-4 md:grid-cols-2'>
                        <Field label='Ism familiya'>
                            <Input
                                className={inputClass}
                                placeholder='Abdulla Qodiriy'
                                {...register('name', {
                                    required: true,
                                    onChange: (event) => handleNameChange(event.target.value)
                                })}
                            />
                        </Field>

                        <Field label='Slug' hint='URL uchun qisqa nom: faqat lotin harflari, raqam va tire.'>
                            <Input
                                className={inputClass}
                                placeholder='abdulla-qodiriy'
                                {...register('slug', {
                                    required: true,
                                    onChange: (event) =>
                                        setValue('slug', slugify(event.target.value), {
                                            shouldDirty: true
                                        })
                                })}
                            />
                        </Field>

                        <Field label="Tug'ilgan sana">
                            <Input type='date' className={inputClass} {...register('birthDate')} />
                        </Field>

                        <Field label='Vafot etgan sana' hint="Agar muallif hayot bo'lsa, bo'sh qoldiring.">
                            <Input type='date' className={inputClass} {...register('deathDate')} />
                        </Field>
                    </div>
                </section>

                <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <SectionTitle icon={ScrollText} title='Biografiya' />

                    <div className='grid gap-4 lg:grid-cols-3'>
                        <Field label='Bio uz'>
                            <textarea
                                rows={7}
                                placeholder="Muallif haqida qisqa ma'lumot"
                                className='min-h-40 w-full resize-none rounded-2xl border border-[#eadfce] bg-white p-4 font-semibold text-[#2f2a25] shadow-sm outline-none placeholder:text-[#b0a391] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500'
                                {...register('bio.uz')}
                            />
                        </Field>

                        <Field label='Bio ru'>
                            <textarea
                                rows={7}
                                placeholder='Краткая информация об авторе'
                                className='min-h-40 w-full resize-none rounded-2xl border border-[#eadfce] bg-white p-4 font-semibold text-[#2f2a25] shadow-sm outline-none placeholder:text-[#b0a391] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500'
                                {...register('bio.ru')}
                            />
                        </Field>

                        <Field label='Bio en'>
                            <textarea
                                rows={7}
                                placeholder='Short information about the author'
                                className='min-h-40 w-full resize-none rounded-2xl border border-[#eadfce] bg-white p-4 font-semibold text-[#2f2a25] shadow-sm outline-none placeholder:text-[#b0a391] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500'
                                {...register('bio.en')}
                            />
                        </Field>
                    </div>
                </section>

                <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <SectionTitle icon={ImagePlus} title='Rasm' />

                    <div className='relative grid min-h-64 place-items-center overflow-hidden rounded-[22px] border-2 border-dashed border-[#eadfce] bg-[#f7f0e6] p-5 text-center dark:border-slate-800 dark:bg-slate-900'>
                        {imagePreview ? (
                            <div className='absolute inset-0'>
                                <img src={imagePreview} alt='Muallif rasmi' className='h-full w-full object-cover' />
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
                                <div className='mx-auto grid size-16 place-items-center rounded-2xl bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-950'>
                                    <Upload size={26} />
                                </div>
                                <p className='mt-4 text-sm font-black text-[#2f2a25] dark:text-white'>Rasm yuklash</p>
                                <p className='mt-1 text-xs font-semibold text-[#9d907e] dark:text-slate-500'>
                                    JPG, PNG yoki WEBP
                                </p>
                            </div>
                        )}
                    </div>

                    <Input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        className='mt-4 h-auto rounded-2xl border-[#eadfce] bg-white py-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900'
                    />
                </section>
            </form>
        </div>
    );
};

export default AdminNewAuthorPage;
