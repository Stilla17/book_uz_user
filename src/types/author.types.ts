import { OtherPagination } from '@/services/api';

import { Book } from './book';

export type AuthorResponse = {
    authors: AuthorItems[];
    pagination: OtherPagination;
};

export interface AuthorItems {
    _id: string;
    name: string;
    image: string;
    booksCount: number;
    birthDate: string;
    deathDate?: string;
    bio: { uz: string; ru: string; en: string };
    slug: string;
    books?: Book[];
}

// -------------------------create Author for Admin----------------------------------
