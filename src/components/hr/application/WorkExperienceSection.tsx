import type { HrApplicationFormValues } from './form-types';
import { FormField, FormSection } from './FormControls';
import type { FieldArrayWithId, UseFormRegister } from 'react-hook-form';

import { BriefcaseBusiness, Plus, Trash2 } from 'lucide-react';

type Props = {
    register: UseFormRegister<HrApplicationFormValues>;
    fields: FieldArrayWithId<HrApplicationFormValues, 'workExperience', 'id'>[];
    append: () => void;
    remove: (index: number) => void;
};

export const WorkExperienceSection = ({ register, fields, append, remove }: Props) => (
    <FormSection icon={BriefcaseBusiness} title='Ish tajribasi' description='Avvalgi ish joylaringizni kiriting'>
        <div className='grid gap-4'>
            {fields.map((item, index) => (
                <div key={item.id} className='relative grid gap-4 rounded-3xl bg-[#f3e8d8] p-4 md:grid-cols-2 lg:grid-cols-5'>
                    <FormField label='Tashkilot' {...register(`workExperience.${index}.organization`)} />
                    <FormField label='Boshlagan sana' type='date' {...register(`workExperience.${index}.startedAt`)} />
                    <FormField label='Tugagan sana' type='date' {...register(`workExperience.${index}.endedAt`)} />
                    <FormField label='Lavozim' {...register(`workExperience.${index}.position`)} />
                    <div className='flex items-end gap-2'>
                        <FormField label='Ketish sababi' {...register(`workExperience.${index}.leavingReason`)} />
                        {fields.length > 1 ? <button type='button' aria-label='Ish joyini o‘chirish' onClick={() => remove(index)} className='grid size-12 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-600'><Trash2 size={18} /></button> : null}
                    </div>
                </div>
            ))}
            <button type='button' onClick={append} className='inline-flex h-11 w-fit items-center gap-2 rounded-2xl bg-[#2f2a25] px-5 text-sm font-black text-white'><Plus size={17} /> Ish joyi qo‘shish</button>
        </div>
    </FormSection>
);
