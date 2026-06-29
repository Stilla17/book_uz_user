'use client';

import { useEffect, useState } from 'react';

import { SettingsService } from '@/components/admin/services/settings.service';
import HeadSection from '@/components/admin/sections/HeadSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/utils/currency';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Loader2, Save, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
    const queryClient = useQueryClient();
    const [deliveryFee, setDeliveryFee] = useState('20000');

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
            <HeadSection
                title='Sozlamalar'
                text="Do'kon bo'yicha umumiy narxlar va xizmat parametrlarini boshqarish."
                href='settings'
            />

            <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex items-center gap-3'>
                    <span className='grid size-11 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-900'>
                        <Truck size={20} />
                    </span>
                    <div>
                        <h2 className='text-lg font-black text-[#2f2a25] dark:text-white'>Yetkazib berish narxi</h2>
                        <p className='mt-1 text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                            Bu narx kuryer orqali buyurtmalarga qo'llanadi. Pochta narxlari alohida: 40 000 so'm va uyga olib borish 60 000 so'm.
                        </p>
                    </div>
                </div>

                <form className='mt-5 grid gap-4 md:max-w-xl' onSubmit={handleSubmit}>
                    <label className='space-y-2'>
                        <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Narx, so'm</span>
                        <Input
                            type='number'
                            min={0}
                            step={1000}
                            value={deliveryFee}
                            disabled={isLoading || isPending}
                            onChange={(event) => setDeliveryFee(event.target.value)}
                            className='h-12 rounded-2xl border-[#eadfce] bg-white font-semibold text-[#2f2a25] shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white'
                        />
                    </label>

                    <div className='rounded-2xl bg-white p-4 text-sm font-bold text-[#6f6255] ring-1 ring-[#eadfce] dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800'>
                        Joriy narx: {formatPrice(Number(deliveryFee) || 0)}
                    </div>

                    <Button
                        type='submit'
                        disabled={isLoading || isPending}
                        className='h-12 w-fit rounded-2xl bg-[#ef7f1a] px-6 font-black text-white hover:bg-[#db7418]'>
                        {isPending ? <Loader2 size={18} className='animate-spin' /> : <Save size={18} />}
                        Saqlash
                    </Button>
                </form>
            </section>
        </div>
    );
};

export default AdminSettingsPage;
