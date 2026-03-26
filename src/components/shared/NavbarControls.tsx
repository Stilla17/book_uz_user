'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { LANGUAGE_STORAGE_KEY } from '../../../i18n';
import { useTheme } from '@/context/ThemeContext';
import { useThemeStyles } from '@/hooks/useThemeStyles';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Lang = 'uz' | 'ru' | 'en';

const normalizeLanguage = (value?: string): Lang => {
    const language = value?.split('-')[0];

    if (language === 'uz' || language === 'ru' || language === 'en') {
        return language;
    }

    return 'uz';
};

type NavbarControlsProps = {
    variant?: 'header' | 'mobile';
    onLanguageSelect?: () => void;
};

const NavbarControls = ({ variant = 'header', onLanguageSelect }: NavbarControlsProps) => {
    const { getTextColor, getBgColor, getBorderColor } = useThemeStyles();
    const { theme, setTheme } = useTheme();
    const { i18n, t } = useTranslation();
    const [lang, setLang] = useState<Lang>(() => normalizeLanguage(i18n.resolvedLanguage || i18n.language));
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const languages = useMemo(
        () => [
            { key: 'uz' as const, label: 'UZ', name: "O'zbekcha", code: 'uz' },
            { key: 'ru' as const, label: 'RU', name: 'Русский', code: 'ru' },
            { key: 'en' as const, label: 'EN', name: 'English', code: 'gb' }
        ],
        []
    );

    const currentLang = languages.find((item) => item.key === lang) || languages[0];

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedLanguage = normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || undefined);

        if (savedLanguage !== lang) {
            setLang(savedLanguage);
            return;
        }

        if (normalizeLanguage(i18n.resolvedLanguage || i18n.language) !== savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, [i18n]);

    useEffect(() => {
        i18n.changeLanguage(lang);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        }
    }, [lang, i18n]);

    const isMobile = variant === 'mobile';

    return (
        <div className={isMobile ? 'grid grid-cols-2 gap-3' : 'flex items-center gap-3 md:gap-5'}>
            <DropdownMenu open={isLanguageMenuOpen} onOpenChange={setIsLanguageMenuOpen}>
                <DropdownMenuTrigger asChild>
                    {isMobile ? (
                        <Button
                            variant='outline'
                            className={`h-11 justify-between rounded-2xl border ${getBorderColor()} ${getBgColor('card')} px-4`}>
                            <span className='flex items-center gap-2'>
                                <img
                                    src={`https://flagcdn.com/w40/${currentLang.code}.png`}
                                    alt={currentLang.name}
                                    className='h-4 w-5 rounded-sm object-cover'
                                />
                                <span className={`font-extrabold text-sm ${getTextColor()}`}>{currentLang.label}</span>
                            </span>
                            <ChevronDown size={14} className={getTextColor('muted')} />
                        </Button>
                    ) : (
                        <button
                            className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 transition-all hover:bg-white/15'
                            aria-label='Language'>
                            <img
                                src={`https://flagcdn.com/w40/${currentLang.code}.png`}
                                alt={currentLang.name}
                                className='h-3.75 w-5 rounded-sm object-cover shadow-sm'
                            />
                            <span className='text-xs font-extrabold text-white/90'>{currentLang.label}</span>
                            <ChevronDown size={14} className='text-white/70' />
                        </button>
                    )}
                </DropdownMenuTrigger>

                <DropdownMenuContent className={`min-w-45 p-2 ${isMobile ? `${getBgColor('card')} ${getBorderColor()}` : ''}`}>
                    {languages.map((langOption) => (
                        <button
                            key={langOption.key}
                            onClick={() => {
                                setLang(langOption.key);
                                setIsLanguageMenuOpen(false);
                                onLanguageSelect?.();
                            }}
                            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                                lang === langOption.key
                                    ? 'bg-slate-100 dark:bg-slate-900'
                                    : `hover:bg-slate-50 dark:hover:bg-slate-900 ${getTextColor()}`
                            }`}>
                            <span className='flex items-center gap-2'>
                                <img
                                    src={`https://flagcdn.com/w40/${langOption.code}.png`}
                                    alt={langOption.name}
                                    className='w-5 rounded-sm border border-black/5 object-cover'
                                />
                                <span>{langOption.name}</span>
                            </span>
                            <span className={`text-xs font-black ${getTextColor('muted')}`}>{langOption.label}</span>
                        </button>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {mounted &&
                (isMobile ? (
                    <Button
                        variant='outline'
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`h-11 justify-between rounded-2xl border ${getBorderColor()} ${getBgColor('card')} px-4`}>
                        <span className='flex items-center gap-2'>
                            {theme === 'dark' ? (
                                <Sun size={18} className={getTextColor()} />
                            ) : (
                                <Moon size={18} className={getTextColor()} />
                            )}
                            <span className={`font-extrabold text-sm ${getTextColor()}`}>
                                {theme === 'dark' ? t('lightMode') : t('darkMode')}
                            </span>
                        </span>
                    </Button>
                ) : (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className='rounded-full p-1.5 transition-colors hover:bg-white/10'
                        aria-label='Theme toggle'>
                        {theme === 'dark' ? (
                            <Sun size={16} className='text-white' />
                        ) : (
                            <Moon size={16} className='text-white' />
                        )}
                    </button>
                ))}
        </div>
    );
};

export default NavbarControls;
