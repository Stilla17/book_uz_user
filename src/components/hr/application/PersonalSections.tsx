import type { ChangeEvent } from 'react';

import Image from 'next/image';

import { FormField, FormSection } from './FormControls';
import type { HrApplicationFormValues } from './form-types';
import { Camera, ShieldCheck, UserRound } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';

type Props = { register: UseFormRegister<HrApplicationFormValues> };

export const PersonalSection = ({
    register,
    photoPreview,
    changePhoto
}: Props & { photoPreview: string; changePhoto: (event: ChangeEvent<HTMLInputElement>) => void }) => (
    <FormSection icon={UserRound} title='Shaxsiy ma’lumotlar' description='Asosiy aloqa va yashash ma’lumotlari'>
        <div className='grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]'>
            <label className='group grid aspect-[3/4] w-48 max-w-[220px] cursor-pointer place-items-center self-start justify-self-center overflow-hidden rounded-[24px] border-2 border-dashed border-[#decdb4] bg-[#f6eddf] text-center transition hover:border-[#ef7f1a] sm:w-52 lg:w-full lg:justify-self-start'>
                {photoPreview ? (
                    <Image
                        src={photoPreview}
                        alt='Foto preview'
                        width={330}
                        height={440}
                        unoptimized
                        className='aspect-[3/4] h-full w-full object-cover'
                    />
                ) : (
                    <span className='grid h-full w-full place-items-center p-5 text-[#8c806f]'>
                        <span>
                            <Camera className='mx-auto mb-3' size={30} />
                            <b className='text-sm'>Foto yuklash</b>
                            <small className='mt-1 block'>JPG, PNG yoki WEBP</small>
                        </span>
                    </span>
                )}
                <input
                    type='file'
                    accept='image/jpeg,image/png,image/webp'
                    className='sr-only'
                    onChange={changePhoto}
                />
            </label>
            <div className='grid gap-4 sm:grid-cols-2'>
                <FormField label='Familiya' required {...register('lastName', { required: true })} />
                <FormField label='Ism' required {...register('firstName', { required: true })} />
                <FormField label='Sharif' {...register('middleName')} />
                <FormField label='Tug‘ilgan sana' type='date' required {...register('birthDate', { required: true })} />
                <FormField label='Tug‘ilgan joy' required {...register('birthPlace', { required: true })} />
                <FormField
                    label='Telefon raqami'
                    type='tel'
                    required
                    placeholder='+998 90 123 45 67'
                    {...register('phone', { required: true })}
                />
                <FormField label='Yashash manzili' required {...register('currentAddress', { required: true })} />
                <FormField label='Ro‘yxatdagi manzil' {...register('registeredAddress')} />
                <FormField label='Millati' {...register('nationality')} />
                <FormField label='Fuqaroligi' {...register('citizenship')} />
            </div>
        </div>
    </FormSection>
);

export const PassportSection = ({ register }: Props) => (
    <FormSection
        icon={ShieldCheck}
        title='Pasport va qo‘shimcha ma’lumotlar'
        description='Hujjat, oilaviy holat va o‘lchamlar'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <FormField label='Pasport seriyasi' maxLength={2} {...register('passportSeries')} />
            <FormField label='Pasport raqami' {...register('passportNumber')} />
            <FormField label='Berilgan sana' type='date' {...register('passportIssuedAt')} />
            <FormField label='Kim tomonidan berilgan' {...register('passportIssuedBy')} />
            <FormField label='Oilaviy holati' {...register('maritalStatus')} />
            <FormField label='Bo‘yi (sm)' type='number' min={50} max={250} {...register('heightCm')} />
            <FormField label='Og‘irligi (kg)' type='number' min={20} max={400} {...register('weightKg')} />
            <FormField label='Kiyim o‘lchami' {...register('clothingSize')} />
            <FormField label='Poyabzal o‘lchami' {...register('shoeSize')} />
        </div>
    </FormSection>
);
