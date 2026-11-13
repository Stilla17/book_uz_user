import { type ReactNode, Suspense } from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profil | Book.uz',
    robots: {
        index: false,
        follow: false
    }
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
    return <Suspense fallback={null}>{children}</Suspense>;
}
