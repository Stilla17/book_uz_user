import { type ReactNode, Suspense } from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    robots: { index: false, follow: false }
};

export default function AuthLayout({ children }: { children: ReactNode }) {
    return <Suspense fallback={null}>{children}</Suspense>;
}
