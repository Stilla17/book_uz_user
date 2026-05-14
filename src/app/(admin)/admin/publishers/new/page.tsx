'use client';

import { type ChangeEvent, type ElementType, type ReactNode, useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useCreatePublisher } from '@/components/admin/hooks/publisherHooks/useCreatePublisher';
import { useUpdatePublisher } from '@/components/admin/hooks/publisherHooks/useUpdatePublisher';
import { usePublisherDetailQuery } from '@/components/admin/hooks/queries/publishers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowLeft, Building2, ImagePlus, Loader, Save, Upload, X } from 'lucide-react';

const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
    <label className='block space-y-2'>
        <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>{label}</span>
        {children}
        {hint ? <span className='block text-xs font-semibold text-[#9d907e] dark:text-slate-500'>{hint}</span> : null}
    </label>
);

const SectionTitle = ({ icon: Icon, title }: { icon: ElementType; title: string }) => (
    <div className='mb-4 flex items-center gap-2'>
        <span className='grid size-10 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-900'>
            <Icon size={18} />
        </span>
        <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>{title}</h3>
    </div>
);

const inputClass =
    'h-12 rounded-2xl border-[#eadfce] bg-white font-semibold text-[#2f2a25] shadow-sm placeholder:text-[#b0a391] focus-visible:ring-[#ef7f1a]/30 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

const AdminNewPublisherPage = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [existingImage, setExistingImage] = useState('');
    const [publishName, setPublishName] = useState('');
    const [publishSlug, setPublishSlug] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const isEdit = !!id;

    const { mutate: createPublisher, isPending: isCreatePending, error: createError } = useCreatePublisher();
    const { mutate: updatePublisher, isPending: isUpdatePending, error: updateError } = useUpdatePublisher();
    const { data: publisherData, isLoading: isDetailLoading } = usePublisherDetailQuery(id);

    const error = id ? updateError : createError;
    const isPending = id ? isUpdatePending : isCreatePending;

    useEffect(() => {
        if (publisherData) {
            setPublishName(publisherData.name);
            setPublishSlug(publisherData.slug || '');
            if (publisherData.image) {
                setImagePreview(publisherData.image);
                setExistingImage(publisherData.image);
            }
        }
    }, [publisherData]);

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImagePreview = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
        setImagePreview('');
        setImageFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!publishName.trim() || !publishSlug.trim()) {
            return;
        }

        const formData = new FormData();
        if (imageFile) formData.append('image', imageFile);
        formData.append('name', publishName);
        formData.append('slug', publishSlug);

        if (id) {
            updatePublisher({ id, formData }, {
                onSuccess: (response: unknown) => {
                    const updated = (response as { data?: { image?: string } })?.data;
                    if (updated?.image) {
                        setExistingImage(updated.image);
                        setImagePreview(updated.image);
                    }
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                }
            });
        } else {
            createPublisher(formData, {
                onSuccess: () => {
                    setPublishName('');
                    setPublishSlug('');
                    clearImagePreview();
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                }
            });
        }
    };

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div className='min-w-0'>
                    <Link
                        href='/admin/publishers'
                        className='inline-flex items-center gap-2 text-sm font-black text-[#9d907e] transition hover:text-[#ef7f1a] dark:text-slate-400 dark:hover:text-white'>
                        <ArrowLeft size={17} />
                        Barcha nashriyotlar
                    </Link>
                    <h2 className='mt-3 text-2xl font-black text-[#2f2a25] dark:text-white'>
                        {id ? 'Nashriyotni tahrirlash' : "Yangi nashriyot qo'shish"}
                    </h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        {id
                            ? "Nashriyot ma'lumotlarini yangilang va o'zgarishlarni saqlang."
                            : "Nashriyot profili uchun nom, slug, aloqa ma'lumotlari va katalogdagi ko'rinishini kiriting."}
                    </p>
                </div>

                <div className='flex gap-2'>
                    <Button
                        asChild
                        variant='outline'
                        className='h-11 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'
                        disabled={isPending}>
                        <Link href='/admin/publishers'>Bekor qilish</Link>
                    </Button>
                    <Button
                        type='submit'
                        form='publisher-form'
                        disabled={isPending}
                        className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600 disabled:opacity-50'>
                        <Save size={18} />
                        {isPending ? 'Saqlanmoqda...' : isEdit ? 'Yangilash' : 'Saqlash'}
                    </Button>
                </div>
            </section>

            <form id='publisher-form' onSubmit={handleSubmit} className='space-y-5'>
                {error && (
                    <div className='rounded-[24px] bg-red-50 p-4 text-sm font-semibold text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20'>
                        {error.message || 'Xatolik yuz berdi'}
                    </div>
                )}

                {showSuccess && (
                    <div className='rounded-[24px] bg-green-50 p-4 text-sm font-semibold text-green-700 ring-1 ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20'>
                        {id ? 'Nashriyot muvaffaqiyatli yangilandi!' : "Nashriyot muvaffaqiyatli qo'shildi!"}
                    </div>
                )}

                {isDetailLoading && (
                    <div className='flex items-center justify-center gap-2 rounded-[24px] bg-[#fffaf2] p-8 text-sm font-semibold text-[#8b7e70] ring-1 ring-[#eadfce] dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-800'>
                        <Loader size={18} className='animate-spin' />
                        Yuklanmoqda...
                    </div>
                )}

                <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <SectionTitle icon={Building2} title="Asosiy ma'lumotlar" />

                    <div className='grid gap-4 md:grid-cols-2'>
                        <Field label='Rasmiy nomi'>
                            <Input
                                className={inputClass}
                                placeholder='Nashryot nomi'
                                value={publishName}
                                onChange={(event) => setPublishName(event.target.value)}
                            />
                        </Field>

                        <Field label='Slug' hint='URL uchun qisqa nom: faqat lotin harflari, raqam va tire.'>
                            <Input
                                className={inputClass}
                                placeholder='gafur-gulom'
                                value={publishSlug}
                                onChange={(event) => setPublishSlug(event.target.value)}
                            />
                        </Field>
                    </div>

                    <div className='mt-5'>
                        <SectionTitle icon={ImagePlus} title='Rasm' />

                        <div className='relative grid place-items-center overflow-hidden rounded-[22px] border-2 border-dashed border-[#eadfce] bg-[#f7f0e6] p-5 text-center dark:border-slate-800 dark:bg-slate-900'>
                            {imagePreview ? (
                                <div className='absolute inset-0'>
                                    <img
                                        src={imagePreview}
                                        alt='Nashriyot rasmi'
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
                                    <div className='mx-auto grid size-16 place-items-center rounded-2xl bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-950'>
                                        <Upload size={26} />
                                    </div>
                                    <p className='mt-4 text-sm font-black text-[#2f2a25] dark:text-white'>
                                        Rasm yuklash
                                    </p>
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
                    </div>
                </section>
            </form>
        </div>
    );
};

export default AdminNewPublisherPage;
