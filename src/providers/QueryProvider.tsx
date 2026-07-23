'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

const shouldRetryQuery = (failureCount: number, error: unknown) => {
    const status = (error as { response?: { status?: number } })?.response?.status;

    if (status && status >= 400 && status < 500) return false;

    return failureCount < 1;
};

export default function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 10 * 60 * 1000,
                        gcTime: 30 * 60 * 1000,
                        retry: shouldRetryQuery,
                        refetchOnWindowFocus: false
                    }
                }
            })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
