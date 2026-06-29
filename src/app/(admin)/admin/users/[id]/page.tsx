'use client';

import { FormEvent, useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useUpdateAdminUserQuery } from '@/components/admin/hooks/queries/users';
import { UsersService } from '@/components/admin/services/users.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';
import {
    ArrowLeft,
    BookOpenCheck,
    CalendarDays,
    ContactRound,
    Edit3,
    Mail,
    Phone,
    Save,
    ShoppingBag,
    X,
    UserRound
} from 'lucide-react';
import toast from 'react-hot-toast';

type EditForm = {
    name: string;
    phone: string;
    email: string;
    birthDate: string;
};

const inputClass =
    'h-11 rounded-2xl border-[#eadfce] bg-white font-semibold text-[#2f2a25] shadow-sm placeholder:text-[#b0a391] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

const formatDate = (value?: string) => {
    if (!value) return '-';

    const date = dayjs(value);

    return date.isValid() ? date.format('DD.MM.YYYY') : '-';
};

const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
    <div className='flex items-start justify-between gap-4 border-b border-[#eadfce] py-3 last:border-0 dark:border-slate-800'>
        <span className='text-sm font-bold text-[#9d907e] dark:text-slate-500'>{label}</span>
        <span className='text-right text-sm font-black break-words text-[#2f2a25] dark:text-white'>{value || '-'}</span>
    </div>
);

const getErrorMessage = (error: unknown, fallback: string) => {
    const apiError = error as { response?: { data?: { message?: string } }; message?: string };

    return apiError.response?.data?.message || apiError.message || fallback;
};

const StatCard = ({
    label,
    value,
    icon: Icon,
    color
}: {
    label: string;
    value: string | number;
    icon: typeof UserRound;
    color: string;
}) => (
    <article className='rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
        <span className={`grid size-11 place-items-center rounded-2xl ${color} text-white`}>
            <Icon size={20} />
        </span>
        <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>{value}</p>
        <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>{label}</p>
    </article>
);

const AdminUserDetailPage = () => {
    const params = useParams();
    const id = String(params?.id || '');
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<EditForm>({
        name: '',
        phone: '',
        email: '',
        birthDate: ''
    });

    const { data: user, isLoading } = useQuery({
        queryKey: ['admin-user', id],
        queryFn: () => UsersService.getAdminUserById(id),
        enabled: Boolean(id)
    });
    const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateAdminUserQuery(id);

    const purchasedBooks = user?.purchasedBooks ?? [];
    const booksCount = purchasedBooks.reduce((sum, item) => sum + item.quantity, 0);
    const totalSpent = purchasedBooks.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);
    const primaryPhone = user?.phones[0] || '';
    const canEdit = user?.source === 'BOOK_UZ';

    useEffect(() => {
        if (!user) return;

        setForm({
            name: user.name,
            phone: primaryPhone,
            email: user.email || user.telegramUsername || '',
            birthDate: user.birthDate ? dayjs(user.birthDate).format('YYYY-MM-DD') : ''
        });
    }, [primaryPhone, user]);

    const updateForm = (key: keyof EditForm, value: string) => {
        setForm((current) => ({
            ...current,
            [key]: value
        }));
    };

    const cancelEdit = () => {
        if (user) {
            setForm({
                name: user.name,
                phone: primaryPhone,
                email: user.email || user.telegramUsername || '',
                birthDate: user.birthDate ? dayjs(user.birthDate).format('YYYY-MM-DD') : ''
            });
        }

        setIsEditing(false);
    };

    const submitUpdate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canEdit) {
            toast.error('Faqat Book.uz mijozlarini tahrirlash mumkin');
            return;
        }

        try {
            await updateUser({
                name: form.name,
                phone: form.phone,
                email: form.email,
                birthDate: form.birthDate,
                role: 'customer'
            });
            toast.success("Mijoz ma'lumotlari yangilandi");
            setIsEditing(false);
        } catch (error) {
            toast.error(getErrorMessage(error, "Mijozni yangilashda xatolik yuz berdi"));
        }
    };

    if (isLoading) {
        return (
            <div className='grid min-h-[420px] place-items-center rounded-[24px] bg-[#fffaf2] text-sm font-black text-[#9d907e] ring-1 ring-[#eadfce] dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-800'>
                Mijoz ma'lumotlari yuklanmoqda...
            </div>
        );
    }

    if (!user) {
        return (
            <div className='grid min-h-[420px] place-items-center rounded-[24px] bg-[#fffaf2] p-6 text-center ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <div className='mx-auto grid size-14 place-items-center rounded-2xl bg-[#f2e7d8] text-[#9d907e] dark:bg-slate-900 dark:text-slate-400'>
                        <UserRound size={24} />
                    </div>
                    <h2 className='mt-4 text-xl font-black text-[#2f2a25] dark:text-white'>Mijoz topilmadi</h2>
                    <Button asChild className='mt-5 rounded-2xl bg-[#ef7f1a] font-black text-white hover:bg-orange-600'>
                        <Link href='/admin/users'>
                            <ArrowLeft size={17} />
                            Ro'yxatga qaytish
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div className='min-w-0'>
                    <Link
                        href='/admin/users'
                        className='inline-flex items-center gap-2 text-sm font-black text-[#9d907e] transition hover:text-[#ef7f1a] dark:text-slate-400 dark:hover:text-white'>
                        <ArrowLeft size={17} />
                        Barcha mijozlar
                    </Link>
                    <div className='mt-3 flex flex-wrap items-center gap-3'>
                        <h2 className='truncate text-2xl font-black text-[#2f2a25] dark:text-white'>{user.name}</h2>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${
                                user.source === 'AMO_CRM'
                                    ? 'bg-blue-50 text-[#285c7f] ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20'
                                    : 'bg-orange-50 text-[#d7690d] ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/20'
                            }`}>
                            {user.source === 'AMO_CRM' ? 'amoCRM' : 'Book.uz'}
                        </span>
                    </div>
                    <p className='mt-2 text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        Ro'yxatdan o'tgan sana: {formatDate(user.createdAt)}
                    </p>
                </div>
                {canEdit ? (
                    <Button
                        asChild
                        className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600'>
                        <Link href={`/admin/users/new?id=${user.id}`}>
                            <Edit3 size={17} />
                            Tahrirlash
                        </Link>
                    </Button>
                ) : null}
            </section>

            <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                <StatCard
                    label='Buyurtmalar'
                    value={user.salesCount || purchasedBooks.length}
                    icon={ShoppingBag}
                    color='bg-[#ef7f1a]'
                />
                <StatCard
                    label='Kitoblar'
                    value={booksCount || purchasedBooks.length}
                    icon={BookOpenCheck}
                    color='bg-emerald-600'
                />
                <StatCard
                    label='Jami summa'
                    value={totalSpent ? formatPrice(totalSpent) : '-'}
                    icon={ContactRound}
                    color='bg-[#285c7f]'
                />
                <StatCard
                    label="Tug'ilgan sana"
                    value={formatDate(user.birthDate)}
                    icon={CalendarDays}
                    color='bg-slate-700'
                />
            </section>

            <div className='grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]'>
                <section className='overflow-hidden rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <div className='flex items-center justify-between gap-3 border-b border-[#eadfce] p-5 dark:border-slate-800'>
                        <div className='flex items-center gap-2'>
                            <BookOpenCheck size={20} className='text-[#ef7f1a]' />
                            <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Sotib olgan kitoblari</h3>
                        </div>
                        <span className='rounded-full bg-[#f2e7d8] px-3 py-1 text-xs font-black text-[#8b7e70] dark:bg-slate-900 dark:text-slate-300'>
                            {purchasedBooks.length} ta yozuv
                        </span>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[620px] text-left'>
                            <thead>
                                <tr className='text-xs font-black text-[#9d907e] uppercase dark:text-slate-500'>
                                    <th className='px-5 py-3'>Kitob</th>
                                    <th className='px-5 py-3'>Soni</th>
                                    <th className='px-5 py-3'>Narx</th>
                                    <th className='px-5 py-3 text-right'>Sana</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchasedBooks.length ? (
                                    purchasedBooks.map((book) => (
                                        <tr key={book.id} className='border-t border-[#f0e4d3] dark:border-slate-900'>
                                            <td className='px-5 py-4 font-black text-[#2f2a25] dark:text-white'>
                                                {book.title}
                                            </td>
                                            <td className='px-5 py-4'>
                                                <span className='grid size-8 place-items-center rounded-xl bg-[#f2e7d8] text-sm font-black dark:bg-slate-900'>
                                                    {book.quantity}
                                                </span>
                                            </td>
                                            <td className='px-5 py-4 text-sm font-bold whitespace-nowrap text-[#6f6255] dark:text-slate-300'>
                                                {book.price ? formatPrice(book.price) : '-'}
                                            </td>
                                            <td className='px-5 py-4 text-right text-sm font-bold whitespace-nowrap text-[#8b7e70] dark:text-slate-400'>
                                                {formatDate(book.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className='border-t border-[#f0e4d3] px-5 py-10 text-center text-sm font-bold text-[#9d907e] dark:border-slate-900 dark:text-slate-400'>
                                            Bu mijoz uchun sotib olingan kitoblar topilmadi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <aside className='space-y-5'>
                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='flex items-center justify-between gap-3'>
                            <div className='flex items-center gap-2'>
                                <UserRound size={20} className='text-[#ef7f1a]' />
                                <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>
                                    Aloqa ma'lumotlari
                                </h3>
                            </div>
                            {!canEdit ? (
                                <span className='rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#285c7f] ring-1 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20'>
                                    Faqat ko'rish
                                </span>
                            ) : null}
                        </div>

                        {isEditing && canEdit ? (
                            <form className='mt-4 space-y-4' onSubmit={submitUpdate}>
                                <label className='block space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Ism familiya
                                    </span>
                                    <Input
                                        value={form.name}
                                        onChange={(event) => updateForm('name', event.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </label>
                                <label className='block space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Telefon
                                    </span>
                                    <Input
                                        value={form.phone}
                                        onChange={(event) => updateForm('phone', event.target.value)}
                                        className={inputClass}
                                        placeholder='+998901234567'
                                    />
                                </label>
                                <label className='block space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Email yoki Telegram
                                    </span>
                                    <Input
                                        value={form.email}
                                        onChange={(event) => updateForm('email', event.target.value)}
                                        className={inputClass}
                                        placeholder='user@book.uz yoki @aziz'
                                    />
                                </label>
                                <label className='block space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                        Tug'ilgan sana
                                    </span>
                                    <Input
                                        type='date'
                                        value={form.birthDate}
                                        onChange={(event) => updateForm('birthDate', event.target.value)}
                                        className={inputClass}
                                    />
                                </label>
                                <div className='grid grid-cols-2 gap-2'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={cancelEdit}
                                        disabled={isUpdating}
                                        className='h-11 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                                        <X size={17} />
                                        Bekor qilish
                                    </Button>
                                    <Button
                                        type='submit'
                                        disabled={isUpdating}
                                        className='h-11 rounded-2xl bg-[#ef7f1a] font-black text-white hover:bg-orange-600 disabled:opacity-50'>
                                        <Save size={17} />
                                        {isUpdating ? 'Saqlanmoqda...' : 'Saqlash'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className='mt-4'>
                                <InfoRow label='Ism familiya' value={user.name} />
                                <InfoRow label='Telefon' value={primaryPhone} />
                                <InfoRow label='Email' value={user.email} />
                                <InfoRow label='Telegram' value={user.telegramUsername} />
                                <InfoRow label='Rol' value={user.role || 'USER'} />
                            </div>
                        )}
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='flex items-center gap-2'>
                            <ContactRound size={20} className='text-[#285c7f]' />
                            <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Tezkor aloqa</h3>
                        </div>
                        <div className='mt-4 grid gap-2'>
                            <Button
                                asChild
                                variant='outline'
                                disabled={!primaryPhone}
                                className='h-11 justify-start rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                                <a href={primaryPhone ? `tel:${primaryPhone.replace(/[^\d+]/g, '')}` : '#'}>
                                    <Phone size={17} />
                                    Qo'ng'iroq qilish
                                </a>
                            </Button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default AdminUserDetailPage;
