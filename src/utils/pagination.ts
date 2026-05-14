import { ReadonlyURLSearchParams } from 'next/navigation';

export const getPageFromUrl = (value: string | null) => {
    const page = Number(value);

    return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
};

type UpdateUrlPageParams = {
    nextPage: number;
    totalPages: number;
    searchParams: ReadonlyURLSearchParams;
    replace: (href: string, options?: { scroll?: boolean }) => void;
    setPage: (page: number) => void;
};

export const updateUrlPage = ({ nextPage, totalPages, searchParams, replace, setPage }: UpdateUrlPageParams) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', String(safePage));
    replace(`?${params.toString()}`, { scroll: false });
    setPage(safePage);
};
