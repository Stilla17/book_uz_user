import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Mening kitoblarim | Book.uz',
    robots: {
        index: false,
        follow: false
    }
};

export default function MyBooksLayout({ children }: { children: ReactNode }) {
    return children;
}
