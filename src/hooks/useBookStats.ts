'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type BookStats = {
    viewsCount: number;
    ratingAvg: number;
    ratingCount: number;
    userRating?: number;
};

type UseBookStatsParams = {
    bookId?: string;
    initialViewsCount?: number;
    initialRatingAvg?: number;
    initialRatingCount?: number;
};

const STORAGE_KEY = 'book_stats';
const BOOK_STATS_EVENT = 'book-stats-change';

const getInitialStats = ({
    initialViewsCount,
    initialRatingAvg,
    initialRatingCount
}: UseBookStatsParams): BookStats => ({
    viewsCount: initialViewsCount ?? 0,
    ratingAvg: initialRatingAvg ?? 0,
    ratingCount: initialRatingCount ?? 0
});

const mergeStats = (savedStats: BookStats | undefined, fallbackStats: BookStats): BookStats => {
    if (!savedStats) return fallbackStats;

    return {
        viewsCount: Math.max(savedStats.viewsCount ?? 0, fallbackStats.viewsCount),
        ratingAvg: savedStats.userRating || savedStats.ratingCount ? savedStats.ratingAvg : fallbackStats.ratingAvg,
        ratingCount:
            savedStats.userRating || savedStats.ratingCount ? savedStats.ratingCount : fallbackStats.ratingCount,
        userRating: savedStats.userRating
    };
};

const readStatsMap = (): Record<string, BookStats> => {
    if (typeof window === 'undefined') return {};

    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
};

const writeStatsMap = (statsMap: Record<string, BookStats>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statsMap));
    window.dispatchEvent(new Event(BOOK_STATS_EVENT));
};

export const useBookStats = (params: UseBookStatsParams) => {
    const { bookId } = params;
    const fallbackStats = useMemo(
        () => getInitialStats(params),
        [params.initialRatingAvg, params.initialRatingCount, params.initialViewsCount]
    );
    const [stats, setStats] = useState<BookStats>(fallbackStats);

    const loadStats = useCallback(() => {
        if (!bookId) {
            setStats(fallbackStats);
            return;
        }

        const savedStats = readStatsMap()[bookId];
        setStats(mergeStats(savedStats, fallbackStats));
    }, [bookId, fallbackStats]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    useEffect(() => {
        window.addEventListener('storage', loadStats);
        window.addEventListener(BOOK_STATS_EVENT, loadStats);

        return () => {
            window.removeEventListener('storage', loadStats);
            window.removeEventListener(BOOK_STATS_EVENT, loadStats);
        };
    }, [loadStats]);

    const incrementViews = useCallback(() => {
        if (!bookId) return;

        const statsMap = readStatsMap();
        const currentStats = mergeStats(statsMap[bookId], fallbackStats);
        const nextStats = {
            ...currentStats,
            viewsCount: currentStats.viewsCount + 1
        };

        statsMap[bookId] = nextStats;
        writeStatsMap(statsMap);
        setStats(nextStats);
    }, [bookId, fallbackStats]);

    const rateBook = useCallback(
        (rating: number) => {
            if (!bookId) return;

            const nextRating = Math.max(1, Math.min(5, rating));
            const statsMap = readStatsMap();
            const currentStats = mergeStats(statsMap[bookId], fallbackStats);
            const previousUserRating = currentStats.userRating;
            const currentCount = currentStats.ratingCount || 0;
            const currentSum = currentStats.ratingAvg * currentCount;
            const nextCount = previousUserRating ? currentCount : currentCount + 1;
            const nextSum = previousUserRating ? currentSum - previousUserRating + nextRating : currentSum + nextRating;
            const nextStats = {
                ...currentStats,
                ratingAvg: nextCount ? nextSum / nextCount : nextRating,
                ratingCount: nextCount,
                userRating: nextRating
            };

            statsMap[bookId] = nextStats;
            writeStatsMap(statsMap);
            setStats(nextStats);
        },
        [bookId, fallbackStats]
    );

    return {
        ...stats,
        incrementViews,
        rateBook
    };
};
