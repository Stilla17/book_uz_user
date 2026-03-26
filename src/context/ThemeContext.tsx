'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { useTheme as useNextTheme } from 'next-themes';

interface ThemeColors {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    brandBlue: string;
    brandOrange: string;
}

interface ThemeContextType {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    colors: ThemeColors;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme, setTheme } = useNextTheme();
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            setIsDark(theme === 'dark');

            // HTML elementiga dark class qo'shish
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [theme, mounted]);

    // Ranglar (light va dark mode uchun)
    const colors: ThemeColors = {
        background: isDark ? '#0f172a' : '#ffffff',
        foreground: isDark ? '#f8fafc' : '#0f172a',
        card: isDark ? '#1e293b' : '#ffffff',
        cardForeground: isDark ? '#f8fafc' : '#0f172a',
        primary: isDark ? '#3b82f6' : '#005CB9',
        primaryForeground: isDark ? '#ffffff' : '#ffffff',
        secondary: isDark ? '#334155' : '#f1f5f9',
        secondaryForeground: isDark ? '#f8fafc' : '#0f172a',
        muted: isDark ? '#475266' : '#f1f5f9',
        mutedForeground: isDark ? '#94a3b8' : '#64748b',
        accent: isDark ? '#1e293b' : '#f8fafc',
        accentForeground: isDark ? '#f8fafc' : '#0f172a',
        border: isDark ? '#334155' : '#e2e8f0',
        brandBlue: isDark ? '#4da3ff' : '#005CB9',
        brandOrange: isDark ? '#ffb14d' : '#FF8A00'
    };

    if (!mounted) {
        return null;
    }

    return <ThemeContext.Provider value={{ theme, setTheme, colors, isDark }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
