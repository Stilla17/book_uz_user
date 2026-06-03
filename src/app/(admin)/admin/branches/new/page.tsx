'use client';

import { useEffect, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useCreateBranch } from '@/components/admin/hooks/branchHooks/useCreateBranch';
import { useUpdateBranch } from '@/components/admin/hooks/branchHooks/useUpdateBranch';
import { useBranchDetailQuery } from '@/components/admin/hooks/queries/branch';
import { Field, SectionTitle, inputClass } from '@/components/admin/other/FiledSettingsAdmin';
import HeadSectionEdit from '@/components/admin/sections/HeadSectionEdit';
import { Input } from '@/components/ui/input';
import { BranchFormData } from '@/types';

import L from 'leaflet';
import { Building2, Map, MapPin } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

type BranchFormValues = {
    branchName: string;
    latitude: number;
    longitude: number;
};

const hasValidCoordinate = (latitude?: number, longitude?: number) =>
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Number(latitude) >= -90 &&
    Number(latitude) <= 90 &&
    Number(longitude) >= -180 &&
    Number(longitude) <= 180;

const BranchCoordinatePreview = ({
    latitude,
    longitude,
    name
}: {
    latitude?: number;
    longitude?: number;
    name?: string;
}) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const isValid = hasValidCoordinate(latitude, longitude);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
            zoomControl: true,
            scrollWheelZoom: false
        }).setView([41.3775, 64.5853], 6);

        map.attributionControl.setPrefix(false);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        mapRef.current = map;

        return () => {
            markerRef.current = null;
            mapRef.current = null;
            map.remove();
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !isValid) return;

        const position: [number, number] = [Number(latitude), Number(longitude)];
        const branchPinIcon = L.divIcon({
            className: 'branch-pin-wrapper',
            html: "<span class='branch-pin'></span>",
            iconSize: [22, 30],
            iconAnchor: [11, 30],
            popupAnchor: [0, -28]
        });

        if (!markerRef.current) {
            markerRef.current = L.marker(position, { icon: branchPinIcon }).addTo(map);
        } else {
            markerRef.current.setLatLng(position);
        }

        markerRef.current
            .bindPopup(`<strong>${name?.trim() || 'Yangi filial'}</strong><br/>${position[0]}, ${position[1]}`)
            .openPopup();
        map.flyTo(position, 13, { duration: 0.5 });
    }, [isValid, latitude, longitude, name]);

    return (
        <div className='relative mt-4 min-h-72 overflow-hidden rounded-[22px] border border-[#d8c7b2] bg-[#f2e7d8] dark:border-slate-700 dark:bg-slate-900'>
            <div ref={mapContainerRef} className='absolute inset-0 z-0' />
            {!isValid ? (
                <div className='absolute inset-0 z-10 grid place-items-center bg-[#f2e7d8]/90 p-5 text-center backdrop-blur-[1px] dark:bg-slate-900/90'>
                    <div>
                        <span className='mx-auto grid size-14 place-items-center rounded-2xl bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-950'>
                            <MapPin size={24} />
                        </span>
                        <p className='mt-4 font-black text-[#2f2a25] dark:text-white'>Koordinata kiriting</p>
                        <p className='mt-2 text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                            Latitude va longitude to'g'ri kiritilganda marker xaritada ko'rinadi.
                        </p>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

const AdminNewBranchPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEdit = !!id;

    const { data: branchData } = useBranchDetailQuery(id);
    const { mutate: createBranch, isPending: isCreatePending } = useCreateBranch();
    const { mutate: updateBranch, isPending: isUpdatePending } = useUpdateBranch();
    const isPending = isCreatePending || isUpdatePending;

    const { control, handleSubmit, register, reset } = useForm<BranchFormValues>({
        defaultValues: {
            branchName: '',
            latitude: undefined,
            longitude: undefined
        }
    });
    const watchedName = useWatch({ control, name: 'branchName' });
    const watchedLatitude = useWatch({ control, name: 'latitude' });
    const watchedLongitude = useWatch({ control, name: 'longitude' });
    const hasPreview = hasValidCoordinate(watchedLatitude, watchedLongitude);

    useEffect(() => {
        if (!branchData) return;

        reset({
            branchName: branchData.branchName || branchData.name || '',
            latitude: branchData.latitude,
            longitude: branchData.longitude ?? branchData.longitude
        });
    }, [branchData, reset]);

    const onSubmit = (values: BranchFormValues) => {
        const data: BranchFormData = {
            branchName: values.branchName,
            latitude: Number(values.latitude),
            longitude: Number(values.longitude)
        };

        const onSuccess = () => {
            toast.success(isEdit ? 'Filial muvaffaqiyatli yangilandi' : "Filial muvaffaqiyatli qo'shildi");
            router.push('/admin/branches');
            router.refresh();
        };

        const onError = (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || 'Filial saqlashda xatolik');
        };

        if (id) {
            updateBranch({ id, data }, { onSuccess, onError });
            return;
        }

        createBranch(data, { onSuccess, onError });
    };

    return (
        <div className='space-y-5'>
            <HeadSectionEdit
                title='Filial'
                href='/admin/branches'
                form='branch'
                backLabel='Barcha filiallar'
                isEdit={isEdit}
                createTitle="Yangi filial qo'shish"
                editTitle='Filialni tahrirlash'
                createDescription='Filial nomi va xaritadagi koordinatalarini kiriting.'
                editDescription="Filial ma'lumotlarini yangilang va o'zgarishlarni saqlang."
                isPending={isPending}
            />

            <form id='branch-form' onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <section className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
                    <div className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={Building2} title="Filial ma'lumotlari" />

                        <div className='grid gap-4'>
                            <Field label='Branch name'>
                                <Input
                                    className={inputClass}
                                    placeholder='Toshkent Chilonzor'
                                    autoComplete='off'
                                    {...register('branchName', { required: true })}
                                />
                            </Field>

                            <div className='grid gap-4 md:grid-cols-2'>
                                <Field label='Latitude (lat)' hint='Masalan: 41.292115169'>
                                    <Input
                                        type='number'
                                        step='any'
                                        className={inputClass}
                                        placeholder='41.292115169'
                                        autoComplete='off'
                                        {...register('latitude', { required: true, valueAsNumber: true })}
                                    />
                                </Field>

                                <Field label='Longitude (log)' hint='Masalan: 69.2114221'>
                                    <Input
                                        type='number'
                                        step='any'
                                        className={inputClass}
                                        placeholder='69.2114221'
                                        autoComplete='off'
                                        {...register('longitude', { required: true, valueAsNumber: true })}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <aside className='rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='flex items-center justify-between gap-3'>
                            <div>
                                <h3 className='font-black text-[#2f2a25] dark:text-white'>Koordinata preview</h3>
                                <p className='mt-1 text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                                    Lat va log kiritilganda marker darhol xaritada ko'rinadi.
                                </p>
                            </div>
                            <span className='grid size-11 shrink-0 place-items-center rounded-2xl bg-[#285c7f] text-white'>
                                <Map size={20} />
                            </span>
                        </div>

                        <BranchCoordinatePreview
                            latitude={watchedLatitude}
                            longitude={watchedLongitude}
                            name={watchedName}
                        />

                        <div className='mt-4 rounded-[18px] bg-white p-3 text-sm font-bold text-[#6f6255] ring-1 ring-[#eadfce] dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800'>
                            {hasPreview ? (
                                <span>
                                    Marker: {watchedLatitude}, {watchedLongitude}
                                </span>
                            ) : (
                                <span>Preview uchun latitude va longitude qiymatlarini kiriting.</span>
                            )}
                        </div>
                    </aside>
                </section>
            </form>
        </div>
    );
};

export default AdminNewBranchPage;
