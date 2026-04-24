import type { User as UserType } from '@/types';
import type { Category } from '@/types/category.types';

type LocalizedTitle = Partial<Record<keyof Category['title'], string>>;

export const getUserInitials = (user?: UserType | null): string => {
    if (!user?.name) return 'U';

    return user.name
        .split(' ')
        .map((namePart) => namePart[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

export const getUserFirstName = (user?: UserType | null): string => {
    if (!user?.name) return 'Profil';

    return user.name.split(' ')[0] || 'Profil';
};

export const getLocalizedTitle = (title: LocalizedTitle | undefined, language: string): string => {
    const currentLanguage = language.split('-')[0] as keyof Category['title'];

    return title?.[currentLanguage] || title?.uz || '';
};

export const getLocalizedCategoryName = (category: Category, language: string): string => {
    return getLocalizedTitle(category.title, language);
};
