import type { ReactNode } from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'HR ma’lumotnomasi | Book.uz',
    description: 'Book.uz yangi xodimlari uchun onlayn ma’lumotnoma.',
    robots: { index: false, follow: false }
};

export default function HrLayout({ children }: { children: ReactNode }) {
    return children;
}
