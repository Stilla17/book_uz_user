'use client';

import { useEffect, useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useCreatePromo } from '@/components/admin/hooks/promoHooks/useCreatePromo';
import { useUpdatePromo } from '@/components/admin/hooks/promoHooks/useUpdatePromo';
import { useBookQuery } from '@/components/admin/hooks/queries/book';
import { usePromoQuery } from '@/components/admin/hooks/queries/promo';
import { Field, SectionTitle, inputClass } from '@/components/admin/other/FiledSettingsAdmin';
import MultiValueField from '@/components/admin/other/MultiValueField';
import type { SearchableOption } from '@/components/admin/other/SearchableSelect';
import HeadSectionEdit from '@/components/admin/sections/HeadSectionEdit';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filterService } from '@/services/filter.service';
import type { CreatePromoPayload, PromoFormValues, PromoTargetType } from '@/types';
import type { Book, LocalizedText } from '@/types/book';
import { useQuery } from '@tanstack/react-query';

import { CalendarDays, Settings2, TicketPercent } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const getLocalizedLabel = (value: LocalizedText | undefined, fallback: string) => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;

    return value.uz || value.ru || value.en || fallback;
};

const getReferenceId = (value: string | { _id?: string }) => (typeof value === 'string' ? value : value._id || '');

const toDateInputValue = (value?: string) => (value ? value.slice(0, 10) : '');

const AdminNewPromoPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEdit = !!id;
    const { mutate: createPromo, isPending: isCreatePending } = useCreatePromo();
    const { mutate: updatePromo, isPending: isUpdatePending } = useUpdatePromo();

    const { handleSubmit, register, reset, setValue, watch } = useForm<PromoFormValues>({
        defaultValues: {
            code: '',
            discountType: 'percentage',
            discountValue: 10,
            targetType: 'book',
            bookIds: [],
            publisherIds: [],
            startDate: '',
            endDate: '',
            isActive: true
        }
    });

    const { data: promos = [], isLoading: isPromosLoading } = usePromoQuery();
    const { data: booksData, isLoading: isBooksLoading } = useBookQuery();
    const { data: filters, isLoading: isFiltersLoading } = useQuery({
        queryKey: ['admin-promo-form-filters'],
        queryFn: () => filterService.getAllFilters()
    });

    const targetType = watch('targetType');
    const selectedBookIds = watch('bookIds') ?? [];
    const selectedPublisherIds = watch('publisherIds') ?? [];
    const books = booksData ?? [];
    const publisherOptions = useMemo<SearchableOption[]>(
        () => (filters?.publishers ?? []).map((publisher) => ({ value: publisher._id, label: publisher.name })),
        [filters]
    );
    const bookOptions = useMemo<SearchableOption[]>(
        () =>
            books.map((book: Book) => ({
                value: book._id,
                label: getLocalizedLabel(book.title, "Noma'lum kitob")
            })),
        [books]
    );
    const targetOptions = targetType === 'book' ? bookOptions : publisherOptions;
    const targetValues = targetType === 'book' ? selectedBookIds : selectedPublisherIds;
    const isTargetLoading = targetType === 'book' ? isBooksLoading : isFiltersLoading;
    const editablePromo = useMemo(() => promos.find((promo) => promo._id === id), [id, promos]);

    useEffect(() => {
        if (!isEdit || !editablePromo) return;

        const productIds = (editablePromo.applicableProducts ?? []).map(getReferenceId);
        const publisherIds = (
            editablePromo.applicablePublishers ??
            editablePromo.applicablePublisherIds ??
            editablePromo.publisherIds ??
            editablePromo.publishers ??
            []
        ).map(getReferenceId);
        const targetType: PromoTargetType = publisherIds.length ? 'publisher' : 'book';

        reset({
            code: editablePromo.code,
            discountType: editablePromo.type === 'PERCENT' ? 'percentage' : 'amount',
            discountValue: editablePromo.value,
            targetType,
            bookIds: productIds,
            publisherIds,
            startDate: toDateInputValue(editablePromo.startDate),
            endDate: toDateInputValue(editablePromo.endDate),
            usageLimit: editablePromo.usageLimit,
            isActive: editablePromo.isActive
        });
    }, [editablePromo, isEdit, reset]);

    const onSubmit = (values: PromoFormValues) => {
        const publisherIds = values.targetType === 'publisher' ? values.publisherIds : [];
        const payload: CreatePromoPayload = {
            code: values.code,
            type: values.discountType === 'percentage' ? 'PERCENT' : 'FIXED',
            value: values.discountValue,
            discountPercentage: values.discountType === 'percentage' ? values.discountValue : undefined,
            applicableProducts: values.targetType === 'book' ? values.bookIds : [],
            applicablePublishers: publisherIds,
            applicablePublisherIds: publisherIds,
            publisherIds,
            publishers: publisherIds,
            startDate: values.startDate,
            endDate: values.endDate,
            usageLimit: values.usageLimit,
            isActive: values.isActive
        };

        const onSuccess = () => {
            toast.success(isEdit ? 'Promokod yangilandi' : "Promokod qo'shildi");
            router.push('/admin/promo');
            router.refresh();
        };

        if (isEdit && id) {
            updatePromo(
                { id, data: payload },
                {
                    onSuccess
                }
            );

            return;
        }

        createPromo(payload, {
            onSuccess
        });
    };

    const isPending = isCreatePending || isUpdatePending;

    if (isEdit && isPromosLoading) {
        return (
            <div className='rounded-[24px] bg-[#fffaf2] p-6 text-sm font-bold text-[#8b7e70] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-800'>
                Promokod yuklanmoqda...
            </div>
        );
    }

    if (isEdit && !editablePromo) {
        return (
            <div className='rounded-[24px] bg-[#fffaf2] p-6 text-sm font-bold text-[#8b7e70] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-800'>
                Promokod topilmadi.
            </div>
        );
    }

    return (
        <div className='space-y-5'>
            <HeadSectionEdit
                title='Promokod'
                href='/admin/promo'
                form='promo'
                backLabel='Barcha promokodlar'
                createTitle="Yangi promokod qo'shish"
                editTitle='Promokodni tahrirlash'
                createDescription='Chegirma miqdori, amal qilish muddati va foydalanish limitlarini kiriting.'
                editDescription="Promokod ma'lumotlarini yangilang va saqlang."
                isEdit={isEdit}
                isPending={isPending}
            />

            <form id='promo-form' onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <section className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
                    <div className='space-y-5'>
                        <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <SectionTitle icon={TicketPercent} title="Asosiy ma'lumotlar" />

                            <div className='grid gap-4 md:grid-cols-2'>
                                <Field label='Promokod'>
                                    <Input
                                        className={inputClass}
                                        placeholder='BOOKUZ10'
                                        autoComplete='off'
                                        {...register('code', {
                                            required: true,
                                            setValueAs: (value) => String(value).trim().toUpperCase()
                                        })}
                                    />
                                </Field>

                                <Field label='Chegirma turi'>
                                    <Select
                                        value={watch('discountType')}
                                        onValueChange={(value) =>
                                            setValue('discountType', value as PromoFormValues['discountType'])
                                        }>
                                        <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='percentage'>Foiz</SelectItem>
                                            <SelectItem value='amount'>So'm</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field label='Chegirma qiymati'>
                                    <Input
                                        type='number'
                                        className={inputClass}
                                        placeholder='10'
                                        {...register('discountValue', { required: true, valueAsNumber: true })}
                                    />
                                </Field>
                                <Field label='Nashriyot va kitob'>
                                    <Select
                                        value={targetType}
                                        onValueChange={(value) => {
                                            setValue('targetType', value as PromoTargetType);
                                            setValue('bookIds', []);
                                            setValue('publisherIds', []);
                                        }}>
                                        <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='book'>Kitob</SelectItem>
                                            <SelectItem value='publisher'>Nashriyot</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <div className='md:col-span-2'>
                                    <Field
                                        label={targetType === 'book' ? 'Kitoblarni tanlang' : 'Nashriyotlarni tanlang'}>
                                        <MultiValueField
                                            name={targetType === 'book' ? 'bookIds' : 'publisherIds'}
                                            values={targetValues}
                                            options={targetOptions}
                                            placeholder={isTargetLoading ? 'Yuklanmoqda...' : 'Tanlang'}
                                            disabled={isTargetLoading}
                                            onChange={(values) =>
                                                setValue(targetType === 'book' ? 'bookIds' : 'publisherIds', values)
                                            }
                                        />
                                    </Field>
                                </div>
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
                                        Promokod faol
                                    </span>
                                    <span className='mt-1 block text-xs font-semibold text-[#9d907e] dark:text-slate-500'>
                                        Foydalanuvchilar ushbu kodni ishlata oladi.
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

export default AdminNewPromoPage;
