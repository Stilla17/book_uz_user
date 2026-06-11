'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useImagePreview } from '@/components/admin/hooks/useImagePreview';
import { BookCard } from '@/components/cards/BookCard';
import { orderStatusConfig, profileTabs } from '@/data';
import { useWishlistBooks } from '@/hooks/bookHooks/useWishlistBooks';
import { useGetOrder } from '@/hooks/orderHooks/useGetOrder';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/services/api';
import type { Book } from '@/types/book';
import { formatPrice } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';
import { getOrderItemProduct } from '@/utils/order';

import dayjs from 'dayjs';
import { CalendarDays, Camera, ImageIcon, LogOut, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type ProfileForm = {
    firstName: string;
    lastName: string;
    phone: string;
};

const paymentStatusConfig = {
    PAID: {
        label: "To'langan",
        className: 'bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/10 dark:text-green-400'
    },
    PENDING: {
        label: 'Kutilmoqda',
        className: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400'
    },
    FAILED: {
        label: "To'lov amalga oshmadi",
        className: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-400'
    }
} as const;

const ProfilePage = () => {
    const { user, isLoading: authLoading, refreshUser, logout } = useAuth();
    const { imageFile, imagePreview, setImagePreview, handleImageChange } = useImagePreview();
    const { books, loadingBooks } = useWishlistBooks();
    const { data: orders = [], isLoading: ordersLoading } = useGetOrder(!authLoading && Boolean(user));
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'settings';
    const {
        register,
        reset,
        handleSubmit,
        watch,
        formState: { isSubmitting }
    } = useForm<ProfileForm>({
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: ''
        }
    });

    useEffect(() => {
        if (!user) return;

        const [firstName = '', ...lastNameParts] = (user.name ?? '').trim().split(/\s+/);

        reset({
            firstName,
            lastName: lastNameParts.join(' '),
            phone: user.phone ?? ''
        });
        setImagePreview(getImageUrl(user.avatar) ?? '');
    }, [user, reset, setImagePreview]);

    const firstName = watch('firstName');
    const lastName = watch('lastName');
    const phone = watch('phone');
    const fullName = [lastName, firstName].filter(Boolean).join(' ') || user?.name || 'Foydalanuvchi';

    const onSubmit = async (values: ProfileForm) => {
        const formData = new FormData();
        const name = [values.firstName.trim(), values.lastName.trim()].filter(Boolean).join(' ');

        formData.append('name', name);
        formData.append('phone', values.phone.trim());

        if (imageFile) {
            formData.append('avatar', imageFile);
        }

        try {
            const response = await UserService.updateProfile(formData);

            if (response?.success === false) {
                throw new Error(response.message || 'Profil yangilanmadi');
            }

            await refreshUser();
            toast.success('Profil muvaffaqiyatli yangilandi');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || 'Profilni yangilashda xatolik yuz berdi');
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const inputClassName =
        'h-12 w-full rounded-lg border border-[#dddddd] bg-white px-4 text-base text-black outline-none transition focus:border-[#ff7a00] dark:border-slate-700 dark:bg-slate-900 dark:text-white';

    return (
        <main className='min-h-[calc(100vh-80px)] bg-white py-5 dark:bg-slate-950'>
            <div className='mx-auto flex max-w-[1320px] flex-col gap-12 px-4 lg:flex-row lg:items-start'>
                <aside className='w-full shrink-0 rounded-lg bg-[#f5f5f5] px-6 py-6 lg:w-[303px] dark:bg-slate-900'>
                    <div className='text-center'>
                        <div className='relative mx-auto size-[100px]'>
                            <div className='size-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800'>
                                {imagePreview ? (
                                    <img src={imagePreview} alt='Profil rasmi' className='size-full object-cover' />
                                ) : (
                                    <div className='grid size-full place-items-center text-slate-500'>
                                        <User size={42} />
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor='profile-avatar'
                                className='absolute right-0 bottom-0 grid size-7 cursor-pointer place-items-center rounded-full bg-white text-[#666666] shadow-sm'>
                                <Camera size={16} fill='currentColor' />
                                <input
                                    id='profile-avatar'
                                    type='file'
                                    accept='image/*'
                                    className='hidden'
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        <h1 className='mt-2 text-lg font-bold text-black dark:text-white'>{fullName}</h1>
                        <p className='mt-0.5 text-base text-black dark:text-slate-300'>{phone || user?.phone}</p>
                    </div>

                    <div className='mt-4 border-t border-[#d8d8d8] pt-4 dark:border-slate-700'>
                        <nav className='space-y-1'>
                            {profileTabs?.map((item) => (
                                <Link
                                    key={item.value}
                                    href={`/profile?tab=${item.value}`}
                                    className={`flex items-center gap-3 py-2.5 text-base ${
                                        item.value === activeTab ? 'text-[#ff6b00]' : 'text-black dark:text-white'
                                    }`}>
                                    <item.icon size={17} strokeWidth={1.5} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className='mt-1 border-t border-[#d8d8d8] pt-2 dark:border-slate-700'>
                        <button
                            type='button'
                            onClick={handleLogout}
                            className='flex w-full items-center gap-3 py-2.5 text-base text-[#555555] dark:text-slate-300'>
                            <LogOut size={17} strokeWidth={1.5} />
                            Chiqish
                        </button>
                    </div>
                </aside>

                <section className='w-full max-w-[905px]'>
                    {activeTab === 'wishlist' && (
                        <>
                            <h2 className='text-2xl font-bold text-black dark:text-white'>Mening kitoblarim</h2>
                            {loadingBooks ? (
                                <p className='mt-5 text-[#777777] dark:text-slate-400'>Kitoblar yuklanmoqda...</p>
                            ) : books.length ? (
                                <div className='mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                                    {books.map((book) => (
                                        <BookCard key={book._id} book={book} />
                                    ))}
                                </div>
                            ) : (
                                <p className='mt-5 text-[#777777] dark:text-slate-400'>
                                    Hozircha sevimli kitoblar mavjud emas
                                </p>
                            )}
                        </>
                    )}

                    {activeTab === 'orders' && (
                        <>
                            <h2 className='text-2xl font-bold text-black dark:text-white'>Buyurtmalar</h2>
                            {ordersLoading ? (
                                <p className='mt-5 text-[#777777] dark:text-slate-400'>Buyurtmalar yuklanmoqda...</p>
                            ) : orders.length ? (
                                <div className='mt-5 space-y-4'>
                                    {orders.map((order) => {
                                        const status = orderStatusConfig[order.status];
                                        const paymentStatus = paymentStatusConfig[order.paymentStatus];

                                        return (
                                            <article
                                                key={order._id}
                                                className='rounded-lg border border-[#dddddd] p-4 dark:border-slate-700'>
                                                <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                                                    <div className='flex shrink-0 gap-2'>
                                                        {order.items.map((item, index) => {
                                                            const product = getOrderItemProduct(item);
                                                            const image = product
                                                                ? getImageUrl(
                                                                      (product as Book).images ||
                                                                          (product as Book).image
                                                                  )
                                                                : undefined;

                                                            return (
                                                                <div
                                                                    key={`${order._id}-${index}`}
                                                                    className='relative h-24 w-20 overflow-hidden rounded-lg border border-[#eeeeee] bg-[#f5f5f5] dark:border-slate-700 dark:bg-slate-800'>
                                                                    {image ? (
                                                                        <img
                                                                            src={image}
                                                                            alt={
                                                                                product &&
                                                                                typeof product.title === 'string'
                                                                                    ? product.title
                                                                                    : 'Buyurtma mahsuloti'
                                                                            }
                                                                            className='size-full object-cover'
                                                                        />
                                                                    ) : (
                                                                        <div className='grid size-full place-items-center text-slate-400'>
                                                                            <ImageIcon size={24} />
                                                                        </div>
                                                                    )}
                                                                    {item.quantity >= 1 && (
                                                                        <span className='absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white'>
                                                                            {item.quantity} ta
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className='min-w-0 flex-1'>
                                                        <div className='flex flex-wrap items-center gap-3'>
                                                            <h3 className='font-semibold text-black dark:text-white'>
                                                                Buyurtma № {order.orderNumber}
                                                            </h3>
                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${status.className}`}>
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                        <p className='mt-2 flex items-center gap-2 text-sm text-[#777777] dark:text-slate-400'>
                                                            <CalendarDays size={15} />
                                                            {dayjs(order.createdAt).format('DD.MM.YYYY, HH:mm')}
                                                        </p>
                                                    </div>

                                                    <div className='sm:text-right'>
                                                        <p className='font-semibold text-[#ff6b00]'>
                                                            {formatPrice(order.totalAmount)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className='mt-5 text-[#777777] dark:text-slate-400'>
                                    Hozircha buyurtmalar mavjud emas
                                </p>
                            )}
                        </>
                    )}

                    {activeTab === 'settings' && (
                        <>
                            <h2 className='text-2xl font-bold text-black dark:text-white'>Profilim sozlamalari</h2>

                            <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
                                <div className='grid gap-x-4 gap-y-5 md:grid-cols-2'>
                                    <label className='block text-[15px] text-[#777777] dark:text-slate-400'>
                                        Ismingiz
                                        <input {...register('firstName')} className={`mt-1 ${inputClassName}`} />
                                    </label>

                                    <label className='block text-[15px] text-[#777777] dark:text-slate-400'>
                                        Familiyangiz
                                        <input {...register('lastName')} className={`mt-1 ${inputClassName}`} />
                                    </label>

                                    <label className='block text-[15px] text-[#777777] dark:text-slate-400'>
                                        Telefon raqamingiz
                                        <input type='tel' {...register('phone')} className={`mt-1 ${inputClassName}`} />
                                    </label>
                                </div>

                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='mt-6 h-12 rounded-lg bg-[#ff760d] px-6 text-sm font-medium text-white transition hover:bg-[#ef6900] disabled:cursor-not-allowed disabled:opacity-60'>
                                    {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
                                </button>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
};

export default ProfilePage;
