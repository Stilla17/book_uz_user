'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useDebounce } from './useDebounce';

export const useUrlSearch = (paramName = 'search', delay = 400) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const urlSearch = searchParams.get(paramName) || '';
    const [searchInput, setSearchInput] = useState(urlSearch);
    const debouncedSearch = useDebounce(searchInput, delay);

    useEffect(() => {
        setSearchInput(urlSearch);
    }, [urlSearch]);

    useEffect(() => {
        const nextSearch = debouncedSearch.trim();
        if (nextSearch === urlSearch.trim()) return;

        const params = new URLSearchParams(searchParams.toString());

        if (nextSearch) {
            params.set(paramName, nextSearch);
        } else {
            params.delete(paramName);
        }

        params.set('page', '1');

        router.replace(`?${params.toString()}`, {
            scroll: false
        });
    }, [debouncedSearch, paramName, router, searchParams, urlSearch]);

    return {
        searchInput,
        setSearchInput,
        debouncedSearch: debouncedSearch.trim()
    };
};
