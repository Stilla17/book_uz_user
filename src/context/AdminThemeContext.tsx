'use client';

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

export type AdminTheme = 'default' | 'valentine';

type AdminThemeContextValue = {
    adminTheme: AdminTheme;
    setAdminTheme: (theme: AdminTheme) => void;
};

const ADMIN_THEME_STORAGE_KEY = 'bookuz-admin-theme';
const AdminThemeContext = createContext<AdminThemeContextValue | undefined>(undefined);

export const AdminThemeProvider = ({ children }: { children: ReactNode }) => {
    const [adminTheme, setAdminThemeState] = useState<AdminTheme>('default');

    useEffect(() => {
        const savedTheme = window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
        if (savedTheme === 'default' || savedTheme === 'valentine') setAdminThemeState(savedTheme);
    }, []);

    const setAdminTheme = (theme: AdminTheme) => {
        setAdminThemeState(theme);
        window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
    };

    return <AdminThemeContext.Provider value={{ adminTheme, setAdminTheme }}>{children}</AdminThemeContext.Provider>;
};

export const useAdminTheme = () => {
    const context = useContext(AdminThemeContext);
    if (!context) throw new Error('useAdminTheme must be used within an AdminThemeProvider');
    return context;
};
