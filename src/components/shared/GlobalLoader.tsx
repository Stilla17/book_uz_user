'use client';

import { useAppSelector } from '@/store/hooks';

import { Loading } from './Loading';

export const GlobalLoader = () => {
    const isLoading = useAppSelector((state) => state.global.isLoading);

    if (!isLoading) return null;

    return <Loading />;
};
