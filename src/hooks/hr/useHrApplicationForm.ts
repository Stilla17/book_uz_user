import { type ChangeEvent, useEffect, useState } from 'react';

import { emptyExperience, type HrApplicationFormValues } from '@/components/hr/application/form-types';
import { HrService } from '@/services/hr.service';
import { useFieldArray, useForm } from 'react-hook-form';

const simpleFields: (keyof HrApplicationFormValues)[] = [
    'firstName', 'lastName', 'middleName', 'birthDate', 'birthPlace', 'currentAddress', 'registeredAddress',
    'phone', 'nationality', 'citizenship', 'maritalStatus', 'heightCm', 'weightKg', 'clothingSize',
    'shoeSize', 'recentlyReadBooks', 'sports'
];

export const useHrApplicationForm = () => {
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [applicationNumber, setApplicationNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const form = useForm<HrApplicationFormValues>({
        defaultValues: { workExperience: [emptyExperience()], personalDataConsent: false }
    });
    const experience = useFieldArray({ control: form.control, name: 'workExperience' });

    useEffect(() => () => {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
    }, [photoPreview]);

    const changePhoto = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage('Foto hajmi 5 MB dan oshmasligi kerak.');
            event.target.value = '';
            return;
        }
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        setErrorMessage('');
    };

    const submit = form.handleSubmit(async (values) => {
        setErrorMessage('');
        const payload = new FormData();
        simpleFields.forEach((key) => {
            const value = values[key];
            if (typeof value === 'string' && value) payload.append(key, value);
        });
        payload.append('passport', JSON.stringify({
            series: values.passportSeries,
            number: values.passportNumber,
            issuedAt: values.passportIssuedAt,
            issuedBy: values.passportIssuedBy
        }));
        payload.append('education', JSON.stringify({
            institution: values.institution,
            faculty: values.faculty,
            fieldOfStudy: values.fieldOfStudy,
            specialty: values.specialty,
            graduationYear: values.graduationYear ? Number(values.graduationYear) : undefined
        }));
        payload.append('additionalEducation', JSON.stringify(values.additionalEducation?.split('\n').map((item) => item.trim()).filter(Boolean) || []));
        payload.append('hobbies', JSON.stringify(values.hobbies?.split(',').map((item) => item.trim()).filter(Boolean) || []));
        payload.append('workExperience', JSON.stringify(values.workExperience.filter((item) => item.organization || item.position)));
        payload.append('personalDataConsent', String(values.personalDataConsent));
        if (photo) payload.append('photo', photo);

        try {
            const result = await HrService.submit(payload);
            setApplicationNumber(result.applicationNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: unknown) {
            const apiError = error as { response?: { data?: { message?: string } } };
            setErrorMessage(apiError.response?.data?.message || 'Ma’lumotnomani yuborishda xatolik yuz berdi.');
        }
    });

    return {
        register: form.register,
        errors: form.formState.errors,
        isSubmitting: form.formState.isSubmitting,
        experienceFields: experience.fields,
        appendExperience: () => experience.append(emptyExperience()),
        removeExperience: experience.remove,
        photoPreview,
        changePhoto,
        applicationNumber,
        errorMessage,
        submit
    };
};
