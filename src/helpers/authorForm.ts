import { AuthorFormValues } from '@/types/author.types';
import { isValidDateInput } from '@/utils/formHelpers';

export const AUTHOR_DEFAULT_VALUES: AuthorFormValues = {
    name: '',
    slug: '',
    bio: {
        uz: '',
        ru: '',
        en: ''
    },
    birthDate: '',
    deathDate: ''
};

export const buildAuthorFormData = (values: AuthorFormValues, imageFile?: File | null) => {
    const formData = new FormData();

    formData.append('name', values.name.trim());
    formData.append('slug', values.slug.trim());
    formData.append('bio', JSON.stringify(values.bio));

    if (values.birthDate) {
        formData.append('birthDate', values.birthDate);
    }

    if (values.deathDate) {
        formData.append('deathDate', values.deathDate);
    }

    if (imageFile) {
        formData.append('image', imageFile);
    }

    return formData;
};

export const validateAuthorDates = (values: AuthorFormValues) => {
    if (!isValidDateInput(values.birthDate) || !isValidDateInput(values.deathDate)) {
        return 'Sanani YYYY-MM-DD formatida to‘g‘ri kiriting';
    }

    if (values.birthDate && values.deathDate && values.deathDate < values.birthDate) {
        return 'Vafot etgan sana tug‘ilgan sanadan oldin bo‘lishi mumkin emas';
    }

    return null;
};
