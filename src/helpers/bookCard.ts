import { Book } from "@/types";

export type TextLike =
    | string
    | { uz?: unknown; ru?: unknown; en?: unknown; name?: unknown; title?: unknown }
    | null
    | undefined;

export const getText = (value: TextLike, fallback: string): string => {
    if (!value) return fallback;
    if (typeof value === 'string') return value || fallback;
    if (typeof value.uz === 'string') return value.uz;
    if (typeof value.ru === 'string') return value.ru;
    if (typeof value.en === 'string') return value.en;
    if (typeof value.name === 'string') return value.name;
    if (typeof value.title === 'string') return value.title;

    return fallback;
};

export const getBookTitle = (book: Book) => {
    return getText(book.title, "Noma'lum kitob");
};

export const getAuthorName = (book: Book) => {
    if (typeof book.author === 'string') return book.author;

    return getText(book.author?.name ? { name: book.author.name } : book.author, "Noma'lum muallif");
};
