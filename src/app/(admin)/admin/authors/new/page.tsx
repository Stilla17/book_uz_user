'use client';

import { type ChangeEvent, type ElementType, type ReactNode, useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useCreateAuthor } from '@/components/admin/hooks/authorsHooks/useCreateAuthor';
import { useUpdateAuthor } from '@/components/admin/hooks/authorsHooks/useUpdateAuthor';
import { useAuthorDetailQuery } from '@/components/admin/hooks/queries/author';
import { useImagePreview } from '@/components/admin/hooks/useImagePreview';
import { Field, SectionTitle, inputClass } from '@/components/admin/other/FiledSettingsAdmin';
import HeadSectionEdit from '@/components/admin/sections/HeadSectionEdit';
import { Input } from '@/components/ui/input';
import { getImageUrl } from '@/utils/image';

import { ImagePlus, Loader, ScrollText, Upload, UserRound, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type AuthorFormValues = {
    name: string;
    slug: string;
    bio: {
        uz: string;
        ru: string;
        en: string;
    };
    birthDate: string;
    deathDate: string;
};

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/['"`]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const formatDateInputValue = (value?: string) => (value ? value.slice(0, 10) : '');

const AdminNewAuthorPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEdit = !!id;

    const { mutate: createAuthor, isPending: isCreatePanding } = useCreateAuthor();
    const { mutate: updateAuthor, isPending: isUpdatePending } = useUpdateAuthor();
    const { data: authorData, isLoading: isDetailLoading } = useAuthorDetailQuery(id);
    const { imageFile, imagePreview, setImagePreview, handleImageChange, clearImagePreview } = useImagePreview();

    const isPending = id ? isUpdatePending : isCreatePanding;

    const { getValues, handleSubmit, register, setValue, reset } = useForm<AuthorFormValues>({
        defaultValues: {
            name: '',
            slug: '',
            bio: {
                uz: '',
                ru: '',
                en: ''
            },
            birthDate: '',
            deathDate: ''
        }
    });

    useEffect(() => {
        if (authorData) {
            reset({
                name: authorData.name || '',
                slug: authorData.slug || '',
                bio: authorData.bio || {
                    uz: '',
                    ru: '',
                    en: ''
                },
                birthDate: formatDateInputValue(authorData.birthDate),
                deathDate: formatDateInputValue(authorData.deathDate)
            });

            if (authorData.image) {
                setImagePreview(getImageUrl(authorData.image) || '');
            }
        }
    }, [authorData, reset]);

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleNameChange = (value: string) => {
        setValue('name', value);
        if (!getValues('slug')) setValue('slug', slugify(value));
    };

    const onSubmit = (values: AuthorFormValues) => {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('slug', values.slug);
        formData.append('bio', JSON.stringify(values.bio));
        formData.append('birthDate', values.birthDate);
        if (values.deathDate) formData.append('deathDate', values.deathDate);
        if (imageFile) formData.append('image', imageFile);

        if (id) {
            updateAuthor(
                { id, formData },
                {
                    onSuccess: () => {
                        toast.success('Muallif muvaffaqiyatli yangilandi');
                        router.push('/admin/authors');
                        router.refresh();
                    }
                }
            );
        } else {
            createAuthor(formData, {
                onSuccess: () => {
                    reset();
                    clearImagePreview();
                    toast.success("Muallif muvaffaqiyatli qo'shildi");
                    router.push('/admin/authors');
                    router.refresh();
                }
            });
        }
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
                                    onChange: (event) => setValue('slug', slugify(event.target.value))
                                })}
                            />
                        </Field>

                        <Field label="Tug'ilgan sana">
                            <Input className={inputClass} {...register('birthDate', { required: true })} />
                        </Field>

                        <Field label='Vafot etgan sana' hint="Agar muallif hayot bo'lsa, bo'sh qoldiring.">
                            <Input className={inputClass} {...register('deathDate')} />
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
