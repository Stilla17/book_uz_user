'use client';

import { useEffect, useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useBookQuery } from '@/components/admin/hooks/queries/book';
import { useCreateAdminUsersQuery, useUpdateAdminUserQuery } from '@/components/admin/hooks/queries/users';
import { Field, SectionTitle, inputClass } from '@/components/admin/other/FiledSettingsAdmin';
import MultiValueField from '@/components/admin/other/MultiValueField';
import HeadSectionEdit from '@/components/admin/sections/HeadSectionEdit';
import { UsersService } from '@/components/admin/services/users.service';
import { Input } from '@/components/ui/input';
import { getBookTitle } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';

import { AtSign, BookOpenCheck, Phone, UserRound } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IMaskInput } from 'react-imask';

type ManualOrderFormValues = {
    customer: {
        name: string;
        birthDate?: string;
        email?: string;
        phone: string;
    };
    productIds: string[];
};

const getBookId = (book: { _id?: string; id?: string }) => book._id || book.id || '';

const getErrorMessage = (error: unknown, fallback: string) => {
    const apiError = error as { response?: { data?: { message?: string } }; message?: string };

    return apiError.response?.data?.message || apiError.message || fallback;
};

const AdminNewUserPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('id') ?? '';
    const isEdit = Boolean(userId);
    const { data: books = [], isLoading: isBooksLoading } = useBookQuery();
    const { data: editingUser, isLoading: isUserLoading } = useQuery({
        queryKey: ['admin-user', userId],
        queryFn: () => UsersService.getAdminUserById(userId),
        enabled: isEdit
    });
    const { mutateAsync: createUser, isPending: isCreating } = useCreateAdminUsersQuery();
    const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateAdminUserQuery(userId);
    const { register, handleSubmit, control, watch, reset } = useForm<ManualOrderFormValues>({
        defaultValues: {
            customer: {
                name: '',
                email: '',
                phone: '',
                birthDate: ''
            },
            productIds: []
        }
    });
    const selectedBookIds = watch('productIds');
    const isPending = isCreating || isUpdating || isUserLoading;

    useEffect(() => {
        if (!editingUser) return;

        reset({
            customer: {
                name: editingUser.name,
                email: editingUser.email || editingUser.telegramUsername || '',
                phone: editingUser.phones[0] || '',
                birthDate: editingUser.birthDate ? editingUser.birthDate.slice(0, 10) : ''
            },
            productIds: []
        });
    }, [editingUser, reset]);

    const bookOptions = useMemo(
        () =>
            books
                .map((book) => ({
                    value: getBookId(book),
                    label: `${getBookTitle(book)} - ${formatPrice(
                        book.discountPrice && book.discountPrice > 0 ? book.discountPrice : book.price
                    )}`
                }))
                .filter((option) => option.value),
        [books]
    );

    const selectedBooks = useMemo(
        () => selectedBookIds.map((bookId) => books.find((book) => getBookId(book) === bookId)).filter(Boolean),
        [books, selectedBookIds]
    );
    const editingPurchasedBooks = editingUser?.purchasedBooks ?? [];

    const onSubmit = async (values: ManualOrderFormValues) => {
        if (isEdit) {
            if (editingUser?.source && editingUser.source !== 'BOOK_UZ') {
                toast.error('Faqat Book.uz mijozlarini tahrirlash mumkin');
                return;
            }

            try {
                await updateUser({
                    name: values.customer.name,
                    phone: values.customer.phone,
                    email: values.customer.email,
                    birthDate: values.customer.birthDate,
                    role: 'customer'
                });
                toast.success("Mijoz ma'lumotlari yangilandi");
                router.push(`/admin/users/${userId}`);
                router.refresh();
            } catch (error) {
                toast.error(getErrorMessage(error, "Mijozni yangilashda xatolik yuz berdi"));
            }

            return;
        }

        const payload = {
            customer: {
                ...values.customer,
                role: 'customer' as const
            },
            items: values.productIds.map((productId) => ({
                product: productId,
                quantity: 1
            })),
            paymentType: 'CASH' as const,
            paymentStatus: 'PAID' as const,
            deliveryType: 'PICKUP' as const,
            status: 'DELIVERED' as const,
            allowDuplicate: true
        };

        try {
            await createUser(payload);
            toast.success("Mijoz muvaffaqiyatli qo'shildi");
            router.push('/admin/users');
            router.refresh();
        } catch (error) {
            toast.error(getErrorMessage(error, "Mijoz qo'shishda xatolik yuz berdi"));
        }
    };

    return (
        <div className='space-y-5'>
            <HeadSectionEdit
                title='Mijoz'
                href='/admin/users'
                form='user'
                backLabel='Barcha mijozlar'
                createTitle="Yangi mijoz qo'shish"
                editTitle="Mijoz ma'lumotlarini tahrirlash"
                createDescription="Mijoz profili uchun asosiy ma'lumotlar, aloqa, rol va xavfsizlik sozlamalarini kiriting."
                editDescription="Faqat Book.uz manbali mijoz ma'lumotlarini tahrirlash mumkin."
                submitLabel='Mijozni saqlash'
                editSubmitLabel='Mijozni yangilash'
                pendingLabel='Mijoz saqlanmoqda...'
                isPending={isPending}
                isEdit={isEdit}
            />

            {isEdit && editingUser?.source === 'AMO_CRM' ? (
                <div className='rounded-[24px] bg-blue-50 p-4 text-sm font-black text-[#285c7f] ring-1 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20'>
                    amoCRM kontaktlarini bu sahifada tahrirlab bo'lmaydi.
                </div>
            ) : null}

            <form id='user-form' className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
                <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <SectionTitle icon={UserRound} title="Asosiy ma'lumotlar" />

                    <div className='grid gap-4 md:grid-cols-2'>
                        <Field label='Ism familiya'>
                            <Input
                                className={inputClass}
                                {...register('customer.name', { required: true })}
                                placeholder='Masalan: Aziz Karimov'
                            />
                        </Field>

                        <Field label='Tugilgan sana'>
                            <Input
                                type='date'
                                {...register('customer.birthDate', { required: true })}
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </section>

                <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <SectionTitle icon={AtSign} title="Aloqa ma'lumotlari" />

                    <div className='grid gap-4 md:grid-cols-2'>
                        <Field label='Email yoki Telegram'>
                            <div className='relative'>
                                <AtSign
                                    size={18}
                                    className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#b0a391]'
                                />
                                <Input
                                    className={`${inputClass} pl-11`}
                                    {...register('customer.email')}
                                    placeholder='user@book.uz yoki @aziz'
                                />
                            </div>
                        </Field>

                        <Field label='Telefon raqam'>
                            <div className='relative'>
                                <Phone
                                    size={18}
                                    className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#b0a391]'
                                />
                                <Controller
                                    name='customer.phone'
                                    control={control}
                                    rules={{
                                        required: true,
                                        validate: (value) => value.replace(/\D/g, '').length === 12
                                    }}
                                    render={({ field }) => (
                                        <IMaskInput
                                            mask='+{998} 00 000 00 00'
                                            value={field.value}
                                            unmask={false}
                                            inputRef={field.ref}
                                            onBlur={field.onBlur}
                                            onAccept={(value) => field.onChange(String(value))}
                                            placeholder='+998 __ ___ __ __'
                                            className={`${inputClass} w-full pl-11 outline-none`}
                                        />
                                    )}
                                />
                            </div>
                        </Field>
                    </div>
                </section>

                <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <SectionTitle icon={BookOpenCheck} title='Sotib olgan kitoblari' />

                    <Field
                        label='Kitoblarni tanlash'
                        hint='Tanlangan kitoblar foydalanuvchining sotib olgan kitoblari sifatida saqlanadi.'>
                        <Controller
                            name='productIds'
                            control={control}
                            render={({ field }) => (
                                <MultiValueField
                                    name='productIds'
                                    values={field.value}
                                    options={bookOptions}
                                    placeholder={
                                        isBooksLoading ? 'Kitoblar yuklanmoqda...' : "Kitob nomi bo'yicha qidirish"
                                    }
                                    disabled={isBooksLoading || isEdit}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </Field>

                    {isEdit ? (
                        editingPurchasedBooks.length ? (
                            <div className='mt-5 overflow-hidden rounded-2xl border border-[#eadfce] bg-white dark:border-slate-800 dark:bg-slate-900'>
                                <div className='flex items-center justify-between gap-3 border-b border-[#eadfce] px-4 py-3 text-sm font-black text-[#6f6255] dark:border-slate-800 dark:text-slate-300'>
                                    <span>Sotib olgan kitoblari</span>
                                    <span className='rounded-full bg-[#f2e7d8] px-3 py-1 text-xs text-[#8b7e70] dark:bg-slate-800 dark:text-slate-300'>
                                        {editingPurchasedBooks.length} ta
                                    </span>
                                </div>
                                <div className='divide-y divide-[#f0e4d3] dark:divide-slate-800'>
                                    {editingPurchasedBooks.map((book) => (
                                        <div
                                            key={book.id}
                                            className='flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
                                            <div className='min-w-0'>
                                                <p className='truncate text-sm font-black text-[#2f2a25] dark:text-white'>
                                                    {book.title}
                                                </p>
                                                <p className='mt-1 text-xs font-semibold text-[#9d907e] dark:text-slate-500'>
                                                    Soni: {book.quantity}
                                                </p>
                                            </div>
                                            <span className='w-fit rounded-full bg-[#f2e7d8] px-3 py-1 text-xs font-black text-[#6f6255] dark:bg-slate-800 dark:text-slate-300'>
                                                {book.price ? formatPrice(book.price) : 'Narx kiritilmagan'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='mt-5 rounded-2xl border border-dashed border-[#eadfce] bg-white px-4 py-6 text-center text-sm font-semibold text-[#9d907e] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'>
                                Bu mijoz uchun sotib olingan kitoblar topilmadi.
                            </div>
                        )
                    ) : selectedBooks.length ? (
                        <div className='mt-5 overflow-hidden rounded-2xl border border-[#eadfce] bg-white dark:border-slate-800 dark:bg-slate-900'>
                            <div className='border-b border-[#eadfce] px-4 py-3 text-sm font-black text-[#6f6255] dark:border-slate-800 dark:text-slate-300'>
                                Tanlangan kitoblar
                            </div>
                            <div className='divide-y divide-[#f0e4d3] dark:divide-slate-800'>
                                {selectedBooks.map((book) =>
                                    book ? (
                                        <div
                                            key={getBookId(book)}
                                            className='flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
                                            <div className='min-w-0'>
                                                <p className='truncate text-sm font-black text-[#2f2a25] dark:text-white'>
                                                    {getBookTitle(book)}
                                                </p>
                                                <p className='mt-1 text-xs font-semibold text-[#9d907e] dark:text-slate-500'>
                                                    ID: {getBookId(book)}
                                                </p>
                                            </div>
                                            <span className='w-fit rounded-full bg-[#f2e7d8] px-3 py-1 text-xs font-black text-[#6f6255] dark:bg-slate-800 dark:text-slate-300'>
                                                {formatPrice(
                                                    book.discountPrice && book.discountPrice > 0
                                                        ? book.discountPrice
                                                        : book.price
                                                )}
                                            </span>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='mt-5 rounded-2xl border border-dashed border-[#eadfce] bg-white px-4 py-6 text-center text-sm font-semibold text-[#9d907e] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'>
                            Kitob tanlanmasa, faqat foydalanuvchi profili saqlanadi.
                        </div>
                    )}
                </section>
            </form>
        </div>
    );
};

export default AdminNewUserPage;
