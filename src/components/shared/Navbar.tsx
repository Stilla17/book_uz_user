"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Search,
    ShoppingCart,
    Menu,
    User,
    Gift,
    BookOpen,
    Phone,
    ChevronDown,
    Star,
    Headphones,
    X,
    LogOut,
    Settings,
    UserCircle,
    Heart,
    Library,
    Info,
    Mail,
    HelpCircle,
    Shield,
    Truck,
    FileText,
    CreditCard,
    Grid3x3,
    TrendingUp,
    Award,
    Percent,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchDropdown } from "@/components/search/SearchDropdown";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { categoryService } from '@/services/category.service';
import { Category } from '@/types/category.types';
import { User as UserType } from "@/types";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import NavbarHeader from "./NavbarHeader";
import { bottomNav } from "@/data/navMenu";
import Image from "next/image";
import NavbarFooter from "./NavbarFooter";

// Kategoriya interfeysi
export const Navbar = () => {
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [loadingCart, setLoadingCart] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const { isDark, getBgColor, getTextColor, getBorderColor } = useThemeStyles();

    // Savatdagi mahsulotlar sonini olish
    useEffect(() => {
        if (isAuthenticated) {
            loadCartCount();
        } else {
            setCartCount(0);
        }
    }, [isAuthenticated]);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            // Use categoryService to get public categories and filter active ones
            const response = await categoryService.getAllCategoriesPublic();
            // console.log("Kategoriyalar yuklandi:", response);
            setCategories(response);
        } catch (error) {
            console.error("Kategoriyalar yuklanmadi:", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Kategoriyalarni yuklash
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCartCount = async () => {
        try {
            setLoadingCart(true);
            const response = await api.get('/cart');
            if (response.data?.success && response.data.data?.items) {
                const totalItems = response.data.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
                setCartCount(totalItems);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error("Savat ma'lumotlarini olishda xatolik:", error);
            setCartCount(0);
        } finally {
            setLoadingCart(false);
        }
    };

    const serviceMenuItems = [
        { icon: <Info size={16} />, label: "Biz haqimizda", href: "/about", description: "Kompaniyamiz haqida" },
        { icon: <Truck size={16} />, label: "Yetkazib berish", href: "/delivery", description: "Yetkazib berish shartlari" },
        { icon: <CreditCard size={16} />, label: "To'lov usullari", href: "/payment", description: "Qanday to'lash mumkin" },
        { icon: <Shield size={16} />, label: "Kafolat", href: "/guarantee", description: "Mahsulot kafolati" },
        { icon: <Headphones size={16} />, label: "Aloqa", href: "/contact", description: "Biz bilan bog'lanish" },
        { icon: <HelpCircle size={16} />, label: "FAQ", href: "/faq", description: "Tez-tez so'raladigan savollar" },
        { icon: <FileText size={16} />, label: "Foydalanish shartlari", href: "/terms", description: "Sayt qoidalari" },
        { icon: <Mail size={16} />, label: "Yangiliklar", href: "/news", description: "So'nggi yangiliklar" },
    ];

    const handleLoginClick = () => {
        router.push('/auth/login');
    };

    const handleLogout = async () => {
        await logout();
        setCartCount(0);
        router.push('/');
    };

    const getUserInitials = (): string => {
        if (!user?.name) return "U";
        return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const getUserFirstName = (): string => {
        if (!user?.name) return "Profil";
        return user.name.split(' ')[0] || "Profil";
    };

    return (
        <header className={`sticky top-0 z-50 w-full ${getBgColor('card')} backdrop-blur border-b ${getBorderColor()}`}>
            {/* Nav Header */}
            <NavbarHeader />

            {/* MAIN ROW */}
            <div className={`container mx-auto px-4 h-18 md:h-20 flex items-center justify-between gap-2 md:gap-4 ${getBgColor('card')}`}>
                {/* Chap qism - Logo va Katalog */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Mobile burger */}
                    <div className="lg:hidden">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`h-11 w-11 p-0 rounded-xl border ${getBorderColor()} ${getBgColor('card')}`}
                                    aria-label="Open menu"
                                >
                                    <Menu size={20} className={getTextColor()} />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="left" className={`w-[88vw] sm:w-[420px] p-0 ${getBgColor('card')}`}>
                                <SheetTitle className="sr-only">Mobil menyu</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Sayt bo‘limlari, katalog, qidiruv va sozlamalar.
                                </SheetDescription>

                                <div className={`p-5 border-b ${getBorderColor()} flex items-center justify-between`}>
                                    <Link href="/" className="flex flex-col items-center gap-1 group min-w-fit pt-2">

                                        <div className="text-xl md:text-2xl font-black flex items-center tracking-tighter leading-none mt-1">
                                            <img src="/images/Logo.svg" alt="Logo" />
                                        </div>
                                    </Link>

                                    <SheetClose asChild>
                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl">
                                            <X size={18} className={getTextColor()} />
                                        </Button>
                                    </SheetClose>
                                </div>

                                <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-120px)]">
                                    <div className="relative">
                                        <Input
                                            placeholder="Qidirish..."
                                            className={`h-12 rounded-2xl pr-12 ${getBgColor('muted')} border-2 ${getBorderColor()}`}
                                        />
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                                            <Search size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <MobileAction
                                            href="/cart"
                                            icon={<ShoppingCart size={18} />}
                                            label="Savat"
                                            badge={cartCount > 0 ? cartCount.toString() : undefined}
                                            onClick={() => setMobileOpen(false)}
                                        />
                                        <MobileAction
                                            href="/my-books"
                                            icon={<BookOpen size={18} />}
                                            label="Kitoblarim"
                                            onClick={() => setMobileOpen(false)}
                                        />
                                        <MobileAction
                                            href="/catalog"
                                            icon={<Grid3x3 size={18} />}
                                            label="Katalog"
                                            onClick={() => setMobileOpen(false)}
                                        />
                                        {isAuthenticated && user ? (
                                            <MobileAction
                                                href="/profile"
                                                icon={<UserCircle size={18} />}
                                                label={getUserFirstName()}
                                                primary
                                                onClick={() => setMobileOpen(false)}
                                            />
                                        ) : (
                                            <MobileAction
                                                href="/auth/login"
                                                icon={<User size={18} />}
                                                label="Kirish"
                                                primary
                                                onClick={() => setMobileOpen(false)}
                                            />
                                        )}
                                    </div>

                                    {/* Bottom Navigation (Mobile) */}
                                    <div className="space-y-2">
                                        <div className={`text-sm font-extrabold ${getTextColor()}`}>
                                            Bo‘limlar
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {bottomNav.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center gap-2 p-3 rounded-xl border ${getBorderColor()} hover:border-[#005CB9] dark:hover:border-blue-400 transition-all ${item.highlight ? 'bg-[#FF8A00]/10' : getBgColor('card')
                                                        }`}
                                                >
                                                    <span className={item.color}>{item.icon}</span>
                                                    <span className={`text-xs text-whitefont-bold ${getTextColor()}`}>{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Xizmatlar bo'limi (Mobile) */}
                                    <div className="space-y-2">
                                        <div className={`text-sm font-extrabold ${getTextColor()}`}>
                                            Xizmatlar
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {serviceMenuItems.slice(0, 6).map((item, index) => (
                                                <Link
                                                    key={index}
                                                    href={item.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex flex-col items-center gap-1 p-2 ${getBgColor('card')} border ${getBorderColor()} rounded-lg hover:border-[#005CB9] dark:hover:border-blue-400 transition-colors`}
                                                >
                                                    <div className="text-[#005CB9] dark:text-blue-400">{item.icon}</div>
                                                    <span className={`text-[10px] font-bold text-center ${getTextColor()}`}>{item.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <Link
                                            href="/services"
                                            onClick={() => setMobileOpen(false)}
                                            className={`block text-center text-xs font-bold text-[#005CB9] dark:text-blue-400 hover:underline mt-2`}
                                        >
                                            Barcha xizmatlar →
                                        </Link>
                                    </div>

                                    {/* Mobile kategoriyalar */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className={`text-sm font-extrabold ${getTextColor()}`}>
                                                Kategoriyalar
                                            </div>
                                            <Link
                                                href="/catalog"
                                                onClick={() => setMobileOpen(false)}
                                                className={`text-xs font-bold text-[#005CB9] dark:text-blue-400 hover:underline`}
                                            >
                                                Barchasi
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {categories.map((category) => (
                                                <Link
                                                    key={category._id}
                                                    href={`/category/${category.slug}`}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center gap-2 p-2 ${getBgColor('card')} border ${getBorderColor()} rounded-lg hover:border-[#005CB9] dark:hover:border-blue-400 transition-colors`}
                                                >
                                                    <div className="flex-1">
                                                        <p className={`text-xs font-bold `}>
                                                            {category.name.uz}
                                                        </p>
                                                        <p className="text-[8px] text-gray-400 dark:text-slate-500">{category.bookCount ?? 0} ta</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <a
                                        href="tel:+998901234567"
                                        className={`flex items-center justify-between rounded-2xl border ${getBorderColor()} ${getBgColor('muted')} p-4`}
                                    >
                                        <div className="text-sm">
                                            <div className={`font-extrabold ${getTextColor()}`}>Aloqa</div>
                                            <div className={`${getTextColor('muted')}`}>+998 (90) 123-45-67</div>
                                        </div>
                                        <Phone size={18} className="text-[#005CB9] dark:text-blue-400" />
                                    </a>

                                    <div className="flex items-center justify-between gap-3">
                                        {/* <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={`h-11 rounded-2xl border ${getBorderColor()} ${getBgColor('card')} flex items-center gap-2`}
                                                >
                                                    <span className="text-base">{currentLang.flag}</span>
                                                    <span className={`font-extrabold text-sm ${getTextColor()}`}>{currentLang.label}</span>
                                                    <ChevronDown size={14} className={getTextColor('muted')} />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className={`min-w-[180px] p-2 ${getBgColor('card')} ${getBorderColor()}`}>
                                                {languages.map((langOption) => (
                                                    <button
                                                        key={langOption.key}
                                                        onClick={() => {
                                                            setLang(langOption.key);
                                                            setMobileOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${lang === langOption.key
                                                            ? "bg-slate-100 dark:bg-slate-900"
                                                            : `hover:bg-slate-50 dark:hover:bg-slate-900 ${getTextColor()}`
                                                            }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="text-base">{langOption.flag}</span>
                                                            <span>{langOption.name}</span>
                                                        </span>
                                                        <span className={`text-xs font-black ${getTextColor('muted')}`}>{langOption.label}</span>
                                                    </button>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu> */}

                                        {/* {mounted && (
                                            <Button
                                                variant="outline"
                                                className={`h-11 rounded-2xl border ${getBorderColor()} ${getBgColor('card')}`}
                                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                            >
                                                {theme === "dark" ? <Sun size={18} className={getTextColor()} /> : <Moon size={18} className={getTextColor()} />}
                                                <span className={`ml-2 font-extrabold text-sm ${getTextColor()}`}>
                                                    {theme === "dark" ? "Light" : "Dark"}
                                                </span>
                                            </Button>
                                        )} */}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* LOGO */}
                    <Link href="/" className="max-md:hidden flex items-center gap-2 group">
                        <Image
                            src="/images/Logo.svg"
                            alt="Logo"
                            width={80}
                            height={80}
                        />
                    </Link>

                    {/* CATALOG (desktop) */}
                    <div className="hidden lg:block">
                        <DropdownMenu open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
                            {/* Name Button */}
                            <DropdownMenuTrigger asChild>
                                <Button className="h-11 md:h-12 px-5 rounded-xl border font-extrabold flex items-center gap-2 bg-[#f07e1a] hover:bg-[#fc953b] text-white hover:text-white border-transparent transition-all">
                                    <Menu size={20} />
                                    <span>Katalog</span>
                                    <ChevronDown size={16} className={`transition-transform ${isCatalogOpen ? "rotate-180" : ""}`} />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="start"
                                className={`w-225 p-6 mt-2 max-h-[80vh] overflow-y-auto ${getBgColor('card')} border ${getBorderColor()} shadow-2xl rounded-2xl`}
                            >
                                {/* Kategoriyalar bo'limi */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={`font-black ${getTextColor()} text-lg flex items-center gap-2`}>
                                            <Grid3x3 size={20} className="text-[#00a0e3] dark:text-blue-400" />
                                            Kategoriyalar
                                        </h3>
                                        <Link
                                            href="/catalog"
                                            onClick={() => setIsCatalogOpen(false)}
                                            className="text-sm font-bold text-[#00a0e3] dark:text-blue-400 hover:text-[#FF8A00] dark:hover:text-orange-400 transition-colors flex items-center gap-1"
                                        >
                                            Barchasini ko'rish
                                            <ChevronDown size={14} className="rotate-270" />
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        {categories.map((category) => (
                                            <Link
                                                key={category._id}
                                                href={`/category/${category.slug}`}
                                                onClick={() => setIsCatalogOpen(false)}
                                                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-[#005CB9]/5 dark:hover:bg-blue-500/10 transition-all group border border-transparent hover:border-[#005CB9]/20 dark:hover:border-blue-500/30`}
                                            >
                                                <div className="flex-1">
                                                    <p className={`text-sm font-bold ${getTextColor()} group-hover:text-[#005CB9] dark:group-hover:text-blue-400`}>
                                                        {category.name.uz}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-slate-500">{category.bookCount ?? 0} ta kitob</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <DropdownMenuSeparator className={`my-6 ${getBorderColor()}`} />

                                {/* Tezkor havolalar */}
                                <div className="grid grid-cols-4 gap-3">
                                    {bottomNav.slice(0, 4).map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsCatalogOpen(false)}
                                            className={`flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border ${getBorderColor()} hover:bg-[#005CB9] dark:hover:bg-blue-600 hover:text-white hover:border-transparent transition-all`}
                                        >
                                            <span className={item.color}>{item.icon}</span>
                                            <span className="text-sm font-semibold">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* SERVICES (desktop) */}
                    <div className="hidden lg:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className={`h-11 md:h-12 px-5 rounded-xl border font-extrabold flex items-center gap-2 bg-[#f07e1a] hover:bg-[#fc953b] text-white hover:text-white border-transparent transition-all`}>
                                    <Info size={20} />
                                    <span>Xizmatlar</span>
                                    <ChevronDown size={16} />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="start"
                                className={`w-87.5 p-4 mt-2 max-h-[80vh] overflow-y-auto ${getBgColor('card')} border ${getBorderColor()} shadow-2xl rounded-2xl`}
                            >
                                <div className="grid grid-cols-2 gap-2">
                                    {serviceMenuItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            onClick={() => setIsCatalogOpen(false)}
                                            className={`flex flex-col items-start p-3 rounded-xl hover:bg-[#005CB9]/5 dark:hover:bg-blue-500/10 transition-all group`}
                                        >
                                            <div className="flex items-center gap-2 w-full">
                                                <div className={`p-2 bg-gray-100 dark:bg-slate-900 rounded-lg text-[#00a0e3] dark:text-blue-400 group-hover:bg-[#005CB9] group-hover:text-white dark:group-hover:bg-blue-600 transition-all`}>
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-extrabold ${getTextColor()} group-hover:text-[#005CB9] dark:group-hover:text-blue-400`}>
                                                        {item.label}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 dark:text-slate-500">{item.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <DropdownMenuSeparator className={`my-4 ${getBorderColor()}`} />

                                <div className={`p-2 bg-gradient-to-r from-[#005CB9]/5 to-[#FF8A00]/5 dark:from-blue-500/10 dark:to-orange-500/10 rounded-xl`}>
                                    <Link
                                        href="/services"
                                        onClick={() => setIsCatalogOpen(false)}
                                        className="flex items-center justify-between p-2 text-sm font-extrabold text-[#005CB9] dark:text-blue-400 hover:text-[#FF8A00] dark:hover:text-orange-400 transition-colors"
                                    >
                                        <span>Barcha xizmatlar</span>
                                        <ChevronDown size={16} className="-rotate-90" />
                                    </Link>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* O'rta qism - SEARCH */}
                <div className="flex-1 max-w-2xl mx-auto relative max-sm:hidden">
                    <Input
                        placeholder="Kitob, muallif yoki janr..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchDropdown(true);
                        }}
                        onFocus={() => setShowSearchDropdown(true)}
                        className={`h-11 md:h-12 w-full rounded-xl pr-24 md:pr-28 ${getBgColor('muted')} border-2 ${getBorderColor()} focus:border-[#f07e1a] dark:focus:border-[#f07e1a] focus-visible:ring-0 `}
                    />
                    <Button
                        onClick={() => {
                            if (searchQuery.trim()) {
                                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                            }
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 md:h-10 px-4 rounded-lg bg-[#f07e1a] hover:bg-[#f07e1ab9] text-white font-extrabold flex items-center cursor-pointer gap-2"
                    >
                        <Search size={18} />
                        <span className="hidden sm:inline">Topish</span>
                    </Button>

                    {/* Search Dropdown */}
                    <SearchDropdown
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onClose={() => setShowSearchDropdown(false)}
                    />
                </div>

                {/* O'ng qism - ACTIONS */}
                <div className="flex items-center gap-3 md:gap-5 max-md:hidden">
                    <NavIcon
                        icon={<ShoppingCart size={22} />}
                        label="Savat"
                        badge={cartCount > 0 ? cartCount.toString() : undefined}
                        href="/cart"
                        isDark={isDark}
                    />

                    <NavIcon
                        icon={<BookOpen size={22} />}
                        label="Kitoblarim"
                        href="/my-books"
                        isDark={isDark}
                    />

                    {isAuthenticated && user ? (
                        <UserDropdown
                            user={user}
                            onLogout={handleLogout}
                            initials={getUserInitials()}
                            firstName={getUserFirstName()}
                            isDark={isDark}
                        />
                    ) : (
                        <NavIcon
                            icon={<User size={22} />}
                            label="Kirish"
                            primary
                            href="/auth/login"
                            onClick={handleLoginClick}
                            isDark={isDark}
                        />
                    )}
                </div>
            </div>

            {/* BOTTOM NAV - 10 ta link bilan */}
            <NavbarFooter />
        </header>
    );
};


















// Desktop NavIcon component
const NavIcon = ({
    icon,
    label,
    badge,
    primary,
    href = "#",
    onClick,
    isDark
}: {
    icon: React.ReactNode;
    label: string;
    badge?: string;
    primary?: boolean;
    href?: string;
    onClick?: () => void;
    isDark: boolean;
}) => (
    <Link
        href={href}
        onClick={onClick}
        className={`relative flex flex-col items-center gap-1 group ${primary
            ? "text-[#005CB9] dark:text-blue-400"
            : "text-slate-600 dark:text-slate-300 hover:text-[#005CB9] dark:hover:text-blue-400"
            }`}
    >
        <div className="p-1 group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-extrabold uppercase tracking-tight">{label}</span>
        {badge && (
            <span className="absolute -top-1 -right-1 bg-[#FF8A00] dark:bg-orange-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-black border-2 border-white dark:border-slate-950">
                {badge}
            </span>
        )}
    </Link>
);

// User Dropdown for authenticated users
const UserDropdown = ({
    user,
    onLogout,
    initials,
    firstName,
    isDark
}: {
    user: UserType;
    onLogout: () => void;
    initials: string;
    firstName: string;
    isDark: boolean;
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="flex flex-col items-center gap-1 group text-[#005CB9] dark:text-blue-400 outline-none">
                <div className="p-1 group-hover:scale-110 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                        {initials}
                    </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase truncate max-w-[70px] text-slate-600 dark:text-slate-300">
                    {firstName}
                </span>
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className={`w-64 p-2 rounded-2xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
            <DropdownMenuLabel className={`font-black text-xs uppercase px-3 py-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <div className="flex items-center gap-2">
                    <UserCircle size={16} className={isDark ? 'text-blue-400' : 'text-[#005CB9]'} />
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{user?.name || "Foydalanuvchi"}</span>
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : 'bg-gray-100'} />

            <DropdownMenuItem asChild className={`rounded-xl cursor-pointer ${isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'}`}>
                <Link href="/profile" className="flex items-center gap-2 py-2">
                    <UserCircle size={18} className="text-[#005CB9] dark:text-blue-400" />
                    <span>Shaxsiy kabinet</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className={`rounded-xl cursor-pointer ${isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'}`}>
                <Link href="/my-books" className="flex items-center gap-2 py-2">
                    <Library size={18} className="text-[#005CB9] dark:text-blue-400" />
                    <span>Mening kitoblarim</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className={`rounded-xl cursor-pointer ${isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'}`}>
                <Link href="/wishlist" className="flex items-center gap-2 py-2">
                    <Heart size={18} className="text-[#FF8A00] dark:text-orange-400" />
                    <span>Sevimlilar</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className={`rounded-xl cursor-pointer ${isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'}`}>
                <Link href="/orders" className="flex items-center gap-2 py-2">
                    <ShoppingCart size={18} className="text-[#005CB9] dark:text-blue-400" />
                    <span>Buyurtmalarim</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className={`rounded-xl cursor-pointer ${isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-50 text-gray-900'}`}>
                <Link href="/settings" className="flex items-center gap-2 py-2">
                    <Settings size={18} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                    <span>Sozlamalar</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : 'bg-gray-100'} />

            <DropdownMenuItem
                onClick={onLogout}
                className={`rounded-xl cursor-pointer text-red-500 focus:text-red-500 ${isDark ? 'focus:bg-red-500/10' : 'focus:bg-red-50'} py-2`}
            >
                <LogOut size={18} className="mr-2" />
                Chiqish
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

// Mobile quick action card
function MobileAction({
    href,
    icon,
    label,
    badge,
    primary,
    onClick,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    badge?: string;
    primary?: boolean;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`relative rounded-2xl border p-4 flex items-center gap-3 transition-all ${primary
                ? "bg-[#2572c0] dark:bg-blue-200 text-white border-transparent"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                }`}
        >
            <div className={`h-10 w-10 rounded-2xl grid place-items-center ${primary ? "bg-white/15" : "bg-slate-100 dark:bg-slate-700"
                }`}>
                {icon}
            </div>
            <div className="font-extrabold">{label}</div>
            {badge && (
                <span className="absolute top-2 right-2 bg-[#FF8A00] dark:bg-orange-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-black">
                    {badge}
                </span>
            )}
        </Link>
    );
}