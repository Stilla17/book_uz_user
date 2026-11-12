import type { HrApplicationFormValues } from './form-types';
import { FormField, FormSection, FormTextarea } from './FormControls';
import type { UseFormRegister } from 'react-hook-form';

import { GraduationCap, Heart } from 'lucide-react';

type Props = { register: UseFormRegister<HrApplicationFormValues> };

export const EducationSection = ({ register }: Props) => (
    <FormSection icon={GraduationCap} title='Ta’lim' description='Asosiy va qo‘shimcha ta’lim ma’lumotlari'>
        <div className='grid gap-4 sm:grid-cols-2'>
            <FormField label='Tamomlagan o‘quv muassasasi' {...register('institution')} />
            <FormField label='Fakultet' {...register('faculty')} />
            <FormField label='Yo‘nalish' {...register('fieldOfStudy')} />
            <FormField label='Mutaxassislik' {...register('specialty')} />
            <FormField label='Bitirgan yili' type='number' min={1900} max={2200} {...register('graduationYear')} />
            <FormTextarea label='Qo‘shimcha ta’lim (har birini yangi qatordan yozing)' {...register('additionalEducation')} />
        </div>
    </FormSection>
);

export const InterestsSection = ({ register }: Props) => (
    <FormSection icon={Heart} title='Qiziqishlar' description='Xobbi, kitob va sport bilan bog‘liq ma’lumotlar'>
        <div className='grid gap-4 md:grid-cols-3'>
            <FormTextarea label='Xobbilaringiz (vergul bilan ajrating)' {...register('hobbies')} />
            <FormTextarea label='Yaqinda mutolaa qilgan kitoblaringiz' {...register('recentlyReadBooks')} />
            <FormTextarea label='Sport bilan shug‘ullanish' {...register('sports')} />
        </div>
    </FormSection>
);
