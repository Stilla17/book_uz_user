"use client";
import { ChevronDown, Clock, Moon, Phone, Sun } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useThemeStyles } from '@/hooks/useThemeStyles';
import { useTheme } from '@/context/ThemeContext';

type Lang = "uz" | "ru" | "en";

const NavbarHeader = () => {

    const { getTextColor } = useThemeStyles();
    const [lang, setLang] = useState<Lang>("uz");
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    const languages = useMemo(
        () => [
            { key: "uz" as const, label: "UZ", name: "O‘zbekcha", code: "uz", symbol: "O'zb" },
            { key: "ru" as const, label: "RU", name: "Русский", code: "ru", symbol: "Рус" },
            { key: "en" as const, label: "EN", name: "English", code: "gb", symbol: "Eng" }, // UK bayrog'i uchun 'gb'
        ],
        []
    );

    const currentLang = languages.find((l) => l.key === lang) || languages[0];

    useEffect(() => setMounted(true), []);

    return (
        <div className="w-full bg-slate-950 dark:bg-slate-900 text-white py-2">
            <div className="container mx-auto px-4 h-10 flex items-center justify-end text-sm">

                <div className="flex items-center gap-3 md:gap-5">
                    <div className=" flex gap-2 text-white/70 max-sm:hidden">
                        <Clock size={14} />
                        <span>09:00 - 22:00</span>
                    </div>

                    <a
                        href="tel:+998901234567"
                        className=" flex gap-2 text-white/85 hover:text-[#FF8A00] dark:hover:text-orange-400 transition-colors max-sm:hidden"
                    >
                        <Phone size={14} />
                        <span className="font-extrabold">+998 (90) 123-45-67</span>
                    </a>

                    {/* Language dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 hover:bg-white/15 transition-all px-3 py-1.5"
                                aria-label="Language"
                            >
                                {/* Asosiy tugmadagi bayroq rasmi */}
                                <img
                                    src={`https://flagcdn.com/w40/${currentLang.code}.png`}
                                    alt={currentLang.name}
                                    className="w-5 h-3.75 rounded-sm object-cover shadow-sm"
                                />
                                <span className="text-xs font-extrabold text-white/90">{currentLang.label}</span>
                                <ChevronDown size={14} className="text-white/70" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className={`min-w-45 p-2 `}>

                            {languages.map((langOption) => (
                                <button
                                    key={langOption.key}
                                    onClick={() => setLang(langOption.key)}
                                    className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${lang === langOption.key
                                        ? "bg-slate-100 dark:bg-slate-900"
                                        : `hover:bg-slate-50 dark:hover:bg-slate-900 ${getTextColor()}`
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {/* Ro'yxatdagi bayroq rasmlari */}
                                        <img
                                            src={`https://flagcdn.com/w40/${langOption.code}.png`}
                                            alt={langOption.name}
                                            className="w-5 rounded-sm object-cover border border-black/5"
                                        />
                                        <span>{langOption.name}</span>
                                    </span>
                                    <span className={`text-xs font-black ${getTextColor('muted')}`}>{langOption.label}</span>
                                </button>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Theme toggle"
                        >
                            {theme === "dark" ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NavbarHeader