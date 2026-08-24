'use client';

import { useEffect, useState } from 'react';

import { SettingsService } from '@/components/admin/services/settings.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type AdminTheme, useAdminTheme } from '@/context/AdminThemeContext';
import { formatPrice } from '@/utils/currency';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Check, Heart, Loader2, Palette, Save, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
    const queryClient = useQueryClient();
    const [deliveryFee, setDeliveryFee] = useState('20000');
    const { adminTheme, setAdminTheme } = useAdminTheme();

    const handleAdminThemeChange = (theme: AdminTheme) => {
        setAdminTheme(theme);
        toast.success(theme === 'valentine' ? 'Valentine mavzusi yoqildi' : 'Standart mavzu yoqildi');
    };

    const { data, isLoading } = useQuery({
        queryKey: ['admin-settings', 'delivery'],
        queryFn: SettingsService.getDeliverySettings
    });

    const { mutate: updateDelivery, isPending } = useMutation({
        mutationFn: (value: number) => SettingsService.updateDeliverySettings(value),
        onSuccess: async (nextSettings) => {
            setDeliveryFee(String(nextSettings.deliveryFee));
            await queryClient.invalidateQueries({ queryKey: ['admin-settings', 'delivery'] });
            toast.success('Yetkazib berish narxi yangilandi');
        },
        onError: (error: unknown) => {
            const apiError = error as { response?: { data?: { message?: string } }; message?: string };
            toast.error(apiError.response?.data?.message || apiError.message || 'Sozlamani saqlashda xatolik');
        }
    });

    useEffect(() => {
        if (data?.deliveryFee !== undefined) {
            setDeliveryFee(String(data.deliveryFee));
        }
    }, [data?.deliveryFee]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = Number(deliveryFee);

        if (!Number.isFinite(value) || value < 0) {
            toast.error("Yetkazib berish narxini to'g'ri kiriting");
            return;
        }

        updateDelivery(Math.round(value));
    };

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-base-100 p-4 shadow-sm ring-1 ring-base-300 md:flex-row md:items-center md:justify-between md:p-5'>
                <div>
                    <h2 className='mt-1 text-2xl font-black text-base-content'>Sozlamalar</h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-admin-muted'>
                        Do'kon bo'yicha umumiy narxlar va xizmat parametrlarini boshqarish.
                    </p>
                </div>
            </section>

            <section className='rounded-[24px] bg-base-100 p-5 shadow-sm ring-1 ring-base-300'>
                <div className='flex items-center gap-3'>
                    <span className='grid size-11 place-items-center rounded-2xl bg-base-200 text-primary'>
                        <Palette size={20} />
                    </span>
                    <div>
                        <h2 className='text-lg font-black text-base-content'>Admin panel mavzusi</h2>
                        <p className='mt-1 text-sm font-semibold text-admin-muted'>
                            Tanlov faqat admin panel ko'rinishiga ta'sir qiladi.
                        </p>
                    </div>
                </div>

                <div className='mt-5 grid gap-3 sm:grid-cols-2 md:max-w-xl'>
                    {(
                        [
                            { value: 'default', title: 'Standart', description: 'Saytning odatiy ranglari', icon: Palette },
                            { value: 'valentine', title: 'Valentine', description: 'Pushti mavzu', icon: Heart }
                        ] as const
                    ).map((option) => {
                        const Icon = option.icon;
                        const isActive = adminTheme === option.value;

                        return (
                            <button
                                key={option.value}
                                type='button'
                                onClick={() => handleAdminThemeChange(option.value)}
                                className={`relative flex items-center gap-3 rounded-2xl p-4 text-left ring-2 transition ${
                                    isActive
                                        ? 'bg-warning text-warning-content ring-warning'
                                        : 'bg-base-100 text-base-content ring-base-300 hover:ring-warning/50'
                                }`}>
                                <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-base-200 text-primary'>
                                    <Icon size={19} />
                                </span>
                                <span>
                                    <span className='block font-black'>{option.title}</span>
                                    <span className={`mt-1 block text-xs font-semibold ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                                        {option.description}
                                    </span>
                                </span>
                                {isActive && <Check className='ml-auto shrink-0' size={18} />}
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className='rounded-[24px] bg-base-100 p-5 shadow-sm ring-1 ring-base-300'>
                <div className='flex items-center gap-3'>
                    <span className='grid size-11 place-items-center rounded-2xl bg-base-200 text-primary'>
                        <Truck size={20} />
                    </span>
                    <div>
                        <h2 className='text-lg font-black text-base-content'>Yetkazib berish narxi</h2>
                        <p className='mt-1 text-sm font-semibold text-admin-muted'>
                            Bu narx kuryer orqali buyurtmalarga qo'llanadi. Pochta ofisigacha 20 000 so'm, pochtadan uygacha 40 000 so'm.
                        </p>
                    </div>
                </div>

                <form className='mt-5 grid gap-4 md:max-w-xl' onSubmit={handleSubmit}>
                    <label className='space-y-2'>
                        <span className='text-sm font-black text-admin-soft'>Narx, so'm</span>
                        <Input
                            type='number'
                            min={0}
                            step={1000}
                            value={deliveryFee}
                            disabled={isLoading || isPending}
                            onChange={(event) => setDeliveryFee(event.target.value)}
                            className='h-12 rounded-2xl border-base-300 bg-base-100 font-semibold text-base-content shadow-sm'
                        />
                    </label>

                    <div className='rounded-2xl bg-base-100 p-4 text-sm font-bold text-admin-soft ring-1 ring-base-300'>
                        Joriy narx: {formatPrice(Number(deliveryFee) || 0)}
                    </div>

                    <Button
                        type='submit'
                        disabled={isLoading || isPending}
                        className='h-12 w-fit rounded-2xl bg-warning px-6 font-black text-warning-content hover:opacity-90'>
                        {isPending ? <Loader2 size={18} className='animate-spin' /> : <Save size={18} />}
                        Saqlash
                    </Button>
                </form>
            </section>
        </div>
    );
};

export default AdminSettingsPage;
