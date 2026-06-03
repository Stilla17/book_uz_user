'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useCreateBanner } from '@/components/admin/hooks/bannerHooks/useCreateBanner';
import { useUpdateBanner } from '@/components/admin/hooks/bannerHooks/useUpdateBanner';
import { useBannerDetailQuery } from '@/components/admin/hooks/queries/banner';
import { useImagePreview } from '@/components/admin/hooks/useImagePreview';
import { Field, SectionTitle, inputClass } from '@/components/admin/other/FiledSettingsAdmin';
import HeadSectionEdit from '@/components/admin/sections/HeadSectionEdit';
import { Input } from '@/components/ui/input';
import { getLocalizedText } from '@/utils/book-formatters';
import { getImageUrl } from '@/utils/image';

import { ImageIcon, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type BannerFormValues = {
    name: string;
    link: string;
    order: number;
};

const AdminNewBannerPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEdit = !!id;
    const { data: bannerData } = useBannerDetailQuery(id);
    const { imageFile, imagePreview, setImagePreview, handleImageChange, clearImagePreview } = useImagePreview();
    const { mutate: createBanner, isPending: isCreatePending } = useCreateBanner();
    const { mutate: updateBanner, isPending: isUpdatePending } = useUpdateBanner();
    const isPending = isCreatePending || isUpdatePending;

    const { handleSubmit, register, reset } = useForm<BannerFormValues>({
        defaultValues: {
            name: '',
            link: '',
            order: 1
        }
    });

    useEffect(() => {
        if (!bannerData) return;

        reset({
            name: bannerData.name || getLocalizedText(bannerData.title),
            link: bannerData.link || bannerData.buttonLink || '',
            order: bannerData.order || 1
        });

        if (bannerData.imageUrl) {
            setImagePreview(getImageUrl(bannerData.imageUrl) || '');
        }
    }, [bannerData, reset, setImagePreview]);

    const onSubmit = (values: BannerFormValues) => {
        const formData = new FormData();
        const name = values.name.trim();

        formData.append('name', name);
        formData.append('link', values.link);
        formData.append('order', String(values.order || 1));
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const onSuccess = () => {
            toast.success(isEdit ? 'Banner muvaffaqiyatli yangilandi' : "Banner muvaffaqiyatli qo'shildi");
            router.push('/admin/banners');
            router.refresh();
        };

        const onError = (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || 'Banner saqlashda xatolik');
        };

        if (id) {
            updateBanner({ id, formData }, { onSuccess, onError });
            return;
        }

        createBanner(formData, { onSuccess, onError });
    };

    return (
        <div className='space-y-5'>
            <HeadSectionEdit
                title='Banner'
                href='/admin/banners'
                form='banner'
                backLabel='Barcha bannerlar'
                createTitle="Yangi banner qo'shish"
                editTitle='Bannerni tahrirlash'
                createDescription="Banner rasmi, sarlavha, joylashuv va havola ma'lumotlarini kiriting."
                editDescription="Banner ma'lumotlarini yangilang va o'zgarishlarni saqlang."
                isEdit={isEdit}
                isPending={isPending}
            />

            <form id='banner-form' onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <section className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]'>
                    <div className='space-y-5'>
                        <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <SectionTitle icon={ImageIcon} title="Asosiy ma'lumotlar" />

                            <div className='grid gap-4 md:grid-cols-2'>
                                <Field label='Banner nomi'>
                                    <Input
                                        className={inputClass}
                                        placeholder='Yozgi chegirmalar'
                                        autoComplete='off'
                                        {...register('name', { required: true })}
                                    />
                                </Field>

                                <Field label='Link'>
                                    <Input
                                        className={inputClass}
                                        placeholder='/catalog?isDiscount=true'
                                        autoComplete='off'
                                        {...register('link')}
                                    />
                                </Field>
                                <Field label='Tartib raqami'>
                                    <Input
                                        type='number'
                                        className={inputClass}
                                        placeholder='1'
                                        {...register('order', { valueAsNumber: true })}
                                    />
                                </Field>
                            </div>
                        </section>
                    </div>

                    <aside className='space-y-5'>
                        <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <SectionTitle icon={Upload} title='Banner rasmi' />

                            <div className='relative grid aspect-[16/9] place-items-center overflow-hidden rounded-[22px] border-2 border-dashed border-[#eadfce] bg-[#f7f0e6] p-5 text-center dark:border-slate-800 dark:bg-slate-900'>
                                {imagePreview ? (
                                    <div className='absolute inset-0'>
                                        <img
                                            src={imagePreview}
                                            alt='Banner rasmi'
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
                                            PNG, JPG yoki WEBP. Tavsiya: 1440x520
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
                    </aside>
                </section>
            </form>
        </div>
    );
};

export default AdminNewBannerPage;
