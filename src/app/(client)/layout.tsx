import type { ReactNode } from 'react';

import { Footer } from '@/components/shared/Footer';
import { Navbar } from '@/components/shared/Navbar';

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <div className='relative flex min-h-screen min-w-0 flex-col overflow-x-hidden'>
            <Navbar />

            <main className='min-w-0 flex-1'>{children}</main>

            <Footer />
        </div>
    );
}
