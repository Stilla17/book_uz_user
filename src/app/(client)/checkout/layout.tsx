import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Buyurtma berish | Book.uz',
    robots: {
        index: false,
        follow: false
    }
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
    return children;
}
