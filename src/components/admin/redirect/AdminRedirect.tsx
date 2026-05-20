'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import Cookies from 'js-cookie';

const isTokenExpired = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() >= exp;
    } catch (err) {
        return true;
    }
};

const AdminRedirect = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token || isTokenExpired(token)) {
            Cookies.remove('token');
            router.push('/admin/auth/login');
        }
    }, [router]);

    return <>{children}</>;
};

export default AdminRedirect;
