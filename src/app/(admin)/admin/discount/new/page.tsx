'use client';

import { useEffect, useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useBookQuery } from '@/components/admin/hooks/queries/book';
import { useCreateDiscount, useGetDiscountById, useUpdateDiscount } from '@/components/admin/hooks/queries/discount';
import { Field, SectionTitle, inputClass } from '@/components/admin/other/FiledSettingsAdmin';
import MultiValueField from '@/components/admin/other/MultiValueField';
import type { SearchableOption } from '@/components/admin/other/SearchableSelect';
import HeadSectionEdit from '@/components/admin/sections/HeadSectionEdit';
import { DiscountForm, DiscountTargetType, DiscountType } from '@/components/admin/services/discount.service';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filterService } from '@/services/filter.service';
import type { Book } from '@/types/book';
import { getLocalizedText } from '@/utils/book-formatters';
import { useQuery } from '@tanstack/react-query';

import { CalendarDays, Settings2, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AdminNewDiscountPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEdit = !!id;

    const { register, handleSubmit, setValue, watch, reset } = useForm<DiscountForm>({
        defaultValues: {
            name: '',
            type: 'PERCENT',
            value: 0,
            remainingDiscountPercentage: 0,
            targetType: 'PRODUCTS',
            products: [],
            publishers: [],
            minOrderAmount: 0,
            startDate: '',
            endDate: '',
            isActive: true
        }
    });

    const targetType = watch('targetType');
    const discountType = watch('type');
    const selectedProductIds = watch('products') ?? [];
    const selectedPublisherIds = watch('publishers') ?? [];
    const { mutate: createDiscount, isPending: isCreating } = useCreateDiscount();
    const { mutate: updateDiscount, isPending: isUpdating } = useUpdateDiscount();
    const isPending = isCreating || isUpdating;
    const { data: booksData = [], isLoading: isBooksLoading } = useBookQuery();

    const { data: filters, isLoading: isFiltersLoading } = useQuery({
        queryKey: ['admin-discount-form-filters'],
        queryFn: () => filterService.getAllFilters()
    });
    const bookOptions = useMemo<SearchableOption[]>(
        () =>
            booksData.map((book: Book) => ({
                value: book._id,
                label: getLocalizedText(book.title, "Noma'lum kitob")
            })),
        [booksData]
    );
    const publisherOptions = useMemo<SearchableOption[]>(
        () => (filters?.publishers ?? []).map((publisher) => ({ value: publisher._id, label: publisher.name })),
        [filters]
    );

    const { data: discountData } = useGetDiscountById(id);

    const targetOptions = targetType === 'PRODUCTS' ? bookOptions : publisherOptions;
    const targetValues = targetType === 'PRODUCTS' ? selectedProductIds : selectedPublisherIds;
    const isTargetLoading = targetType === 'PRODUCTS' ? isBooksLoading : isFiltersLoading;

    useEffect(() => {
        if (!isEdit || !discountData) return;
        reset({
            name: discountData.name ?? '',
            type: discountData.type ?? 'PERCENT',
            value: discountData.value ?? 0,
            targetType: discountData.targetType ?? 'PRODUCTS',
            products: (discountData.products ?? [])
                .map((product) => (typeof product === 'string' ? product : (product._id ?? '')))
                .filter((id): id is string => Boolean(id)),
            publishers: (discountData.publishers ?? [])
                .map((publisher) => (typeof publisher === 'string' ? publisher : publisher._id))
                .filter((id): id is string => Boolean(id)),
            remainingDiscountPercentage: discountData.remainingDiscountPercentage ?? 0,
            minOrderAmount: discountData.minOrderAmount ?? 0,
            startDate: discountData.startDate?.slice(0, 10) ?? '',
            endDate: discountData.endDate?.slice(0, 10) ?? '',
            isActive: discountData.isActive ?? true
        });
    }, [isEdit, discountData, reset]);

    const onSubmit = (values: DiscountForm) => {
        const data = {
            ...values,
            remainingDiscountPercentage: values.remainingDiscountPercentage ?? 0,
            products: values.targetType === 'PRODUCTS' ? values.products : [],
            publishers: values.targetType === 'PUBLISHERS' ? values.publishers : []
        };
        const onSuccess = () => {
            toast.success(isEdit ? 'Chegirma yangilandi' : "Chegirma qo'shildi");
            router.push('/admin/discount');
            router.refresh();
        };
        if (id) {
            updateDiscount({ id, data }, { onSuccess });
            return;
        }
        createDiscount(data, { onSuccess });
    };

    return (
        <div className='space-y-5'>
            <HeadSectionEdit
                title='Chegirma'
                href='/admin/discount'
                form='discount'
                backLabel='Barcha chegirmalar'
                createTitle="Yangi chegirma qo'shish"
                editTitle='Chegirmani tahrirlash'
                createDescription='Kitoblar yoki nashriyotlar uchun katalog chegirmasi sozlamalarini kiriting.'
                editDescription="Chegirma ma'lumotlarini yangilang va saqlang."
                isEdit={isEdit}
                isPending={isPending}
            />

            <form id='discount-form' onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <section className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
                    <div className='space-y-5'>
                        <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <SectionTitle icon={Tag} title="Asosiy ma'lumotlar" />

                            <div className='grid gap-4 md:grid-cols-2'>
                                <Field label='Chegirma nomi'>
                                    <Input
                                        className={inputClass}
                                        placeholder='Yozgi kitoblar chegirmasi'
                                        autoComplete='off'
                                        {...register('name', { required: true })}
                                    />
                                </Field>

                                <Field label='Chegirma obyekti'>
                                    <Select
                                        value={targetType}
                                        onValueChange={(value) => {
                                            setValue('targetType', value as DiscountTargetType);
                                            setValue('products', []);
                                            setValue('publishers', []);
                                        }}>
                                        <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='PRODUCTS'>Kitoblar</SelectItem>
                                            <SelectItem value='PUBLISHERS'>Nashriyotlar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field label='Chegirma turi'>
                                    <Select
                                        value={discountType}
                                        onValueChange={(value) => setValue('type', value as DiscountType)}>
                                        <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='PERCENT'>Foiz</SelectItem>
                                            <SelectItem value='FIXED'>So'm</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field label={discountType === 'PERCENT' ? 'Foiz miqdori' : 'Chegirma summasi'}>
                                    <Input
                                        type='number'
                                        className={inputClass}
                                        placeholder={discountType === 'PERCENT' ? '10' : '10000'}
                                        {...register('value', { required: true, valueAsNumber: true })}
                                    />
                                </Field>

                                <div className='md:col-span-2'>
                                    <Field
                                        label={
                                            targetType === 'PRODUCTS' ? 'Kitoblarni tanlang' : 'Nashriyotlarni tanlang'
                                        }
                                        hint={
                                            targetType === 'PRODUCTS'
                                                ? 'Tanlangan kitoblarga chegirma qo‘llanadi.'
                                                : 'Tanlangan nashriyotlardagi kitoblarga chegirma qo‘llanadi.'
                                        }>
                                        <MultiValueField
                                            name={targetType === 'PRODUCTS' ? 'products' : 'publishers'}
                                            values={targetValues}
                                            options={targetOptions}
                                            placeholder={
                                                isTargetLoading
                                                    ? 'Yuklanmoqda...'
                                                    : targetType === 'PRODUCTS'
                                                      ? 'Kitob qidirish'
                                                      : 'Nashriyot qidirish'
                                            }
                                            disabled={isTargetLoading}
                                            onChange={(values) =>
                                                setValue(targetType === 'PRODUCTS' ? 'products' : 'publishers', values)
                                            }
                                        />
                                    </Field>
                                </div>

                                <Field
                                    label='Qolgan barchasiga chegirma'
                                    hint="Tanlanmagan qolgan barcha kitoblarga foizli chegirma qo'llaniladi.">
                                    <div className='relative'>
                                        <Input
                                            type='number'
                                            min={0}
                                            max={100}
                                            step={1}
                                            className={`${inputClass} pr-12`}
                                            placeholder='Masalan: 10'
                                            {...register('remainingDiscountPercentage', {
                                                setValueAs: (value) => (value === '' ? undefined : Number(value)),
                                                min: 0,
                                                max: 100
                                            })}
                                        />
                                        <span className='pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-bold text-[#9d907e]'>
                                            %
                                        </span>
                                    </div>
                                </Field>
                            </div>
                        </section>
                    </div>

                    <aside className='space-y-5'>
                        <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <SectionTitle icon={CalendarDays} title='Muddat' />

                            <div className='space-y-4'>
                                <Field label='Boshlanish sanasi'>
                                    <Input
                                        type='date'
                                        className={inputClass}
                                        {...register('startDate', { required: true })}
                                    />
                                </Field>

                                <Field label='Tugash sanasi'>
                                    <Input
                                        type='date'
                                        className={inputClass}
                                        {...register('endDate', { required: true })}
                                    />
                                </Field>
                            </div>
                        </section>

                        <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <SectionTitle icon={Settings2} title='Holat' />

                            <label className='flex items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                                <span>
                                    <span className='block text-sm font-black text-[#2f2a25] dark:text-white'>
                                        Chegirma faol
                                    </span>
                                    <span className='mt-1 block text-xs font-semibold text-[#9d907e] dark:text-slate-500'>
                                        Faol bo‘lsa katalog narxlariga qo‘llanadi.
                                    </span>
                                </span>
                                <input type='checkbox' className='size-5 accent-[#ef7f1a]' {...register('isActive')} />
                            </label>
                        </section>
                    </aside>
                </section>
            </form>
        </div>
    );
};

export default AdminNewDiscountPage;
