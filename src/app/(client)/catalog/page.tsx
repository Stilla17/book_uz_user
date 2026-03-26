"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Grid3x3,
  List,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Clock,
  Sparkles,
  Tag,
  BookOpen,
  Headphones,
  Loader2,
  CheckCircle,
  Package,
  Truck,
  Shield,
  MessageCircle,
  Crown,
  Zap,
  Award,
  Gem,
  Flower2,
  Coffee,
  Compass,
  Music,
  Gift,
  Percent,
  ShoppingBag,
  CreditCard,
  Phone,
  Mail,
  HelpCircle,
  BookCopy,
  Library,
  Users,
  TrendingUp,
  Mic2,
  Volume2,
  PlayCircle,
  PauseCircle,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, UserService } from "@/services/api";
import { toast } from "react-hot-toast";

interface Product {
  _id: string;
  title: {
    uz: string;
    ru?: string;
    en?: string;
  };
  slug: string;
  description?: {
    uz?: string;
  };
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  category: {
    _id: string;
    name: {
      uz: string;
    };
  };
  author: {
    _id: string;
    name: string;
  };
  language: 'uz' | 'ru' | 'en';
  isTop: boolean;
  isDiscount: boolean;
  ratingAvg: number;
  ratingCount: number;
  format?: 'ebook' | 'audio' | 'paper';
}

interface FilterState {
  keyword: string;
  category: string;
  author: string;
  minPrice: string;
  maxPrice: string;
  language: string;
  format: string;
  isTop: boolean;
  isDiscount: boolean;
  inStock: boolean;
}

interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export default function CatalogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pages: 1,
    limit: 12
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("-createdAt");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Savat uchun state
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  // Kupon state
  const [promoCode, setPromoCode] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercentage: number;
    discountAmount: number;
  } | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    keyword: searchParams.get('q') || "",
    category: searchParams.get('category') || "",
    author: searchParams.get('author') || "",
    minPrice: searchParams.get('minPrice') || "",
    maxPrice: searchParams.get('maxPrice') || "",
    language: searchParams.get('language') || "",
    format: searchParams.get('format') || "",
    isTop: searchParams.get('isTop') === 'true',
    isDiscount: searchParams.get('isDiscount') === 'true',
    inStock: searchParams.get('inStock') === 'true',
  });

  // Kategoriyalar (mock - API dan olinishi kerak)
  const categories = [
    { _id: "1", name: { uz: "Detektiv" } },
    { _id: "2", name: { uz: "Fantastika" } },
    { _id: "3", name: { uz: "Fentezi" } },
    { _id: "4", name: { uz: "Romantika" } },
    { _id: "5", name: { uz: "Psixologiya" } },
    { _id: "6", name: { uz: "Biznes" } },
    { _id: "7", name: { uz: "Tarix" } },
    { _id: "8", name: { uz: "Bolalar" } },
  ];

  // Mualliflar (mock - API dan olinishi kerak)
  const authors = [
    { _id: "1", name: "James Clear" },
    { _id: "2", name: "Xudoyberdi To'xtaboyev" },
    { _id: "3", name: "Pirimqul Qodirov" },
    { _id: "4", name: "Robert Kiyosaki" },
    { _id: "5", name: "Antuan de Sent-Ekzyuperi" },
  ];

  // Til variantlari
  const languages = [
    { value: "uz", label: "O'zbekcha" },
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
  ];

  // Format variantlari
  const formats = [
    { value: "ebook", label: "Elektron kitob", icon: <BookOpen size={14} /> },
    { value: "audio", label: "Audio kitob", icon: <Headphones size={14} /> },
    { value: "paper", label: "Qog'oz kitob", icon: <BookOpen size={14} /> },
  ];

  // Saralash variantlari
  const sortOptions = [
    { value: "-createdAt", label: "Eng yangilar" },
    { value: "price", label: "Narxi: arzon → qimmat" },
    { value: "-price", label: "Narxi: qimmat → arzon" },
    { value: "-ratingAvg", label: "Reyting bo'yicha" },
    { value: "-ratingCount", label: "Eng ko'p o'qilgan" },
  ];

  // Floating icons array
  const floatingIcons = [
    Sparkles, Star, Heart, Crown, Zap, Award, Gem, Flower2, 
    Coffee, Compass, Headphones, Music, BookOpen, BookCopy,
    Tag, Percent, Calendar,   Truck,
    Shield,  Gift, Phone, Clock, ShoppingCart, 
    Library, Users, TrendingUp, Award, Crown,
    Mic2, Volume2, PlayCircle, PauseCircle
  ];

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    loadProducts();
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [filters, sortBy, pagination.page]);

  useEffect(() => {
    // URL ni yangilash
    const params = new URLSearchParams();
    if (filters.keyword) params.set('q', filters.keyword);
    if (filters.category) params.set('category', filters.category);
    if (filters.author) params.set('author', filters.author);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.language) params.set('language', filters.language);
    if (filters.format) params.set('format', filters.format);
    if (filters.isTop) params.set('isTop', 'true');
    if (filters.isDiscount) params.set('isDiscount', 'true');
    if (filters.inStock) params.set('inStock', 'true');
    
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Filterlarni tayyorlash
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy,
        ...(filters.keyword && { keyword: filters.keyword }),
        ...(filters.category && { category: filters.category }),
        ...(filters.author && { author: filters.author }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.language && { language: filters.language }),
        ...(filters.format && { format: filters.format }),
        ...(filters.isTop && { isTop: 'true' }),
        ...(filters.isDiscount && { isDiscount: 'true' }),
      });

      const response = await api.get(`/products?${queryParams.toString()}`);
      
      if (response.data?.success) {
        setProducts(response.data.data.products || []);
        setPagination(response.data.data.pagination || {
          total: 0,
          page: pagination.page,
          pages: 1,
          limit: pagination.limit
        });
      }
    } catch (error) {
      console.error("Mahsulotlar yuklanmadi:", error);
      toast.error("Mahsulotlar yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      setLoadingWishlist(true);
      const response = await UserService.getWishlist();
      if (response?.success) {
        setWishlist(response.data.map((item: any) => item._id));
      }
    } catch (error) {
      console.error("Wishlist yuklanmadi:", error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/catalog');
      return;
    }

    try {
      const response = await UserService.toggleWishlist(productId);
      if (response?.success) {
        if (wishlist.includes(productId)) {
          setWishlist(wishlist.filter(id => id !== productId));
          toast.success("Sevimlilardan o'chirildi");
        } else {
          setWishlist([...wishlist, productId]);
          toast.success("Sevimlilarga qo'shildi");
        }
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  // Savatga qo'shish funksiyasi
  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/catalog');
      return;
    }

    try {
      setAddingToCart(productId);
      const response = await api.post('/cart/add', { productId, quantity });
      
      if (response.data?.success) {
        toast.success("Savatga qo'shildi");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Promokodni kiriting");
      return;
    }

    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/catalog');
      return;
    }

    try {
      setApplyingPromo(true);
      const response = await api.post('/coupons/apply', { code: promoCode });
      
      if (response.data?.success) {
        setAppliedCoupon({
          code: promoCode.toUpperCase(),
          discountPercentage: response.data.data.discountPercentage,
          discountAmount: response.data.data.discountAmount
        });
        toast.success(`Kupon qo'llandi! ${response.data.data.discountPercentage}% chegirma`);
        setPromoCode("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    toast.success("Kupon olib tashlandi");
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: "",
      category: "",
      author: "",
      minPrice: "",
      maxPrice: "",
      language: "",
      format: "",
      isTop: false,
      isDiscount: false,
      inStock: false,
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.author) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.language) count++;
    if (filters.format) count++;
    if (filters.isTop) count++;
    if (filters.isDiscount) count++;
    if (filters.inStock) count++;
    return count;
  };

  const getProductTitle = (product: Product) => {
    return product.title.uz || product.title.ru || product.title.en || "Noma'lum";
  };

  const getProductDescription = (product: Product) => {
    return product.description?.uz || "Tavsif mavjud emas";
  };

  const getDiscountedPrice = (product: Product) => {
    if (product.discountPrice && product.discountPrice > 0) {
      return product.discountPrice;
    }
    return product.price;
  };

  const getDiscountPercentage = (product: Product) => {
    if (product.discountPrice && product.discountPrice > 0) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  const getFormatIcon = (format?: string) => {
    switch(format) {
      case 'audio': return <Headphones size={14} className="text-[#FF8A00] dark:text-orange-400" />;
      case 'ebook': return <BookOpen size={14} className="text-[#005CB9] dark:text-blue-400" />;
      default: return <BookOpen size={14} className="text-gray-400 dark:text-gray-500" />;
    }
  };

  // Kitob detal sahifasiga o'tish
  const handleBookClick = (slug: string) => {
    router.push(`/book/${slug}`);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#005CB9]/20 dark:border-blue-400/20 border-t-[#005CB9] dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
            <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#005CB9] dark:text-blue-400" size={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Katalog yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-8 relative overflow-hidden">
      
      {/* ========== ANIMATED BACKGROUND ELEMENTS ========== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating Icons */}
        {[...Array(20)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          const randomTop = Math.random() * 100;
          const randomLeft = Math.random() * 100;
          const randomFontSize = Math.random() * 30 + 15;
          
          return (
            <motion.div
              key={i}
              className="absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10"
              style={{
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                fontSize: `${randomFontSize}px`,
              }}
              animate={{
                y: [0, -20, 20, 0],
                x: [0, 20, -20, 0],
                rotate: [0, 180, 360, 0],
                opacity: [0.1, 0.2, 0.15, 0.1],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              <IconComponent />
            </motion.div>
          );
        })}

        {/* Gradient Orbs with Parallax */}
        <motion.div
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute top-20 left-20 w-96 h-96 bg-[#00a0e3]/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#ef7f1a]/5 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-2xl">
            <BookOpen size={28} className="text-[#005CB9] dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">
              <span className="text-[#005CB9] dark:text-blue-400">Kitoblar</span>
              <span className="text-[#FF8A00] dark:text-orange-400"> katalogi</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {pagination.total > 0 
                ? `${pagination.total.toLocaleString()} ta kitob topildi` 
                : "Kitoblar yuklanmoqda..."
              }
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Kitob nomi, muallif yoki janr..."
                value={filters.keyword}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, keyword: e.target.value }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              {filters.keyword && (
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, keyword: "" }));
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {/* Filter Toggle */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filtrlar</span>
                {getActiveFilterCount() > 0 && (
                  <span className="w-5 h-5 bg-[#FF8A00] dark:bg-orange-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {getActiveFilterCount()}
                  </span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" 
                      ? "bg-[#005CB9] dark:bg-blue-600 text-white" 
                      : "text-gray-400 dark:text-gray-500 hover:text-[#005CB9] dark:hover:text-blue-400"
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" 
                      ? "bg-[#005CB9] dark:bg-blue-600 text-white" 
                      : "text-gray-400 dark:text-gray-500 hover:text-[#005CB9] dark:hover:text-blue-400"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mb-6 overflow-hidden relative"
            >
              {/* Floating Particles inside filter panel */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 92, 185, 0.05), transparent 70%)`,
                }}
                transition={{ duration: 0.3 }}
              />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  Filtrlar
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-[#005CB9] dark:text-blue-400 hover:underline"
                >
                  Tozalash
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
                {/* Category Filter */}
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Kategoriya
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, category: e.target.value }));
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Barchasi</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name.uz}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Filter */}
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Muallif
                  </label>
                  <select
                    value={filters.author}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, author: e.target.value }));
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Barchasi</option>
                    {authors.map(author => (
                      <option key={author._id} value={author._id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Narx oralig'i
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, minPrice: e.target.value }));
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className="w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, maxPrice: e.target.value }));
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className="w-full bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Til
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, language: e.target.value }));
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Barchasi</option>
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Format Filter */}
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Format
                  </label>
                  <select
                    value={filters.format}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, format: e.target.value }));
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Barchasi</option>
                    {formats.map(format => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkbox Filters */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isTop}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, isTop: e.target.checked }));
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-[#005CB9] dark:text-blue-400 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Top kitoblar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isDiscount}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, isDiscount: e.target.checked }));
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-[#005CB9] dark:text-blue-400 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chegirmalar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, inStock: e.target.checked }));
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-[#005CB9] dark:text-blue-400 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mavjud</span>
                  </label>
                </div>

                {/* Promo Code */}
                <div className="md:col-span-3 lg:col-span-1">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Promokod
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div>
                        <p className="text-xs text-green-600 dark:text-green-400">Qo'llanildi</p>
                        <p className="font-bold text-green-700 dark:text-green-400">
                          {appliedCoupon.code} (-{appliedCoupon.discountPercentage}%)
                        </p>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded-full text-green-700 dark:text-green-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Kodni kiriting"
                        className="flex-1 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      />
                      <Button
                        onClick={handleApplyPromo}
                        disabled={applyingPromo}
                        className="bg-[#005CB9] hover:bg-[#004a96] dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        {applyingPromo ? <Loader2 size={14} className="animate-spin" /> : "Qo'llash"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid/List */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-[350px] bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all group relative cursor-pointer"
                    onClick={() => handleBookClick(product.slug)}
                  >
                    {/* Floating Particles inside product card */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{
                        background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 92, 185, 0.05), transparent 70%)`,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      {product.isTop && (
                        <span className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Sparkles size={10} />
                          Top
                        </span>
                      )}
                      {product.isDiscount && (
                        <span className="bg-red-500 dark:bg-red-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Tag size={10} />
                          -{getDiscountPercentage(product)}%
                        </span>
                      )}
                      {product.format && (
                        <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 border border-gray-200 dark:border-slate-700 shadow-sm">
                          {getFormatIcon(product.format)}
                          <span>
                            {product.format === 'audio' ? 'Audio' : 
                             product.format === 'ebook' ? 'E-kitob' : 'Qog\'oz'}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button - stopPropagation qo'shildi */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product._id);
                      }}
                      className={`absolute top-2 right-2 z-20 p-1.5 rounded-full transition-all hover:scale-110 ${
                        wishlist.includes(product._id)
                          ? 'bg-red-500 dark:bg-red-600 text-white'
                          : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400'
                      }`}
                    >
                      <Heart size={14} fill={wishlist.includes(product._id) ? "currentColor" : "none"} />
                    </button>

                    {/* Image */}
                    <div className="relative h-[200px] w-full overflow-hidden bg-gray-100 dark:bg-slate-700">
                      <Image
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887"}
                        alt={getProductTitle(product)}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-bold text-sm line-clamp-2 hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors mb-1 text-gray-900 dark:text-white">
                        {getProductTitle(product)}
                      </h3>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                        {product.author?.name}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={12} className="text-[#FF8A00] dark:text-orange-400 fill-[#FF8A00] dark:fill-orange-400" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {product.ratingAvg?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          ({product.ratingCount || 0})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          {product.discountPrice && product.discountPrice > 0 ? (
                            <>
                              <span className="text-xs text-gray-400 dark:text-gray-500 line-through block">
                                {product.price.toLocaleString()} so'm
                              </span>
                              <span className="text-sm font-black text-[#FF8A00] dark:text-orange-400">
                                {product.discountPrice.toLocaleString()} so'm
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-black text-[#005CB9] dark:text-blue-400">
                              {product.price.toLocaleString()} so'm
                            </span>
                          )}
                        </div>

                        {/* Savatga qo'shish tugmasi - stopPropagation qo'shildi */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product._id, 1);
                          }}
                          disabled={addingToCart === product._id || product.stock === 0}
                          className={`p-1.5 rounded-lg transition-all ${
                            product.stock === 0
                              ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-[#005CB9] dark:hover:bg-blue-600 hover:text-white'
                          }`}
                        >
                          {addingToCart === product._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <ShoppingCart size={14} />
                          )}
                        </button>
                      </div>
                      
                      {/* Stock status */}
                      {product.stock === 0 && (
                        <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">Mavjud emas</p>
                      )}
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#005CB9]/20 dark:group-hover:border-blue-600/30 rounded-xl transition-all duration-300" />
                  </motion.div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all relative group cursor-pointer"
                    onClick={() => handleBookClick(product.slug)}
                  >
                    {/* Floating Particles in list view */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{
                        background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 92, 185, 0.05), transparent 70%)`,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-md">
                          <Image
                            src={product.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887"}
                            alt={getProductTitle(product)}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
                              {getProductTitle(product)}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{product.author?.name}</p>
                          </div>

                          {/* Badges */}
                          <div className="flex gap-1">
                            {product.isTop && (
                              <span className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Sparkles size={12} />
                                Top
                              </span>
                            )}
                            {product.isDiscount && (
                              <span className="bg-red-500 dark:bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Tag size={12} />
                                -{getDiscountPercentage(product)}%
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {getProductDescription(product)}
                        </p>

                        {/* Rating and Meta */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-[#FF8A00] dark:text-orange-400 fill-[#FF8A00] dark:fill-orange-400" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {product.ratingAvg?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {product.ratingCount || 0} ta baho
                          </span>
                          
                          {product.format && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                {getFormatIcon(product.format)}
                                <span>
                                  {product.format === 'audio' ? 'Audio kitob' : 
                                   product.format === 'ebook' ? 'Elektron kitob' : 'Qog\'oz kitob'}
                                </span>
                              </div>
                            </>
                          )}
                          
                          {product.language && (
                            <>
                              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {product.language === 'uz' ? 'O\'zbekcha' :
                                 product.language === 'ru' ? 'Русский' : 'English'}
                              </span>
                            </>
                          )}
                          
                          {product.stock > 0 ? (
                            <>
                              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                              <span className="text-xs text-green-600 dark:text-green-400">
                                <CheckCircle size={12} className="inline mr-1" />
                                {product.stock} dona mavjud
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                              <span className="text-xs text-red-500 dark:text-red-400">
                                Mavjud emas
                              </span>
                            </>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            {product.discountPrice && product.discountPrice > 0 ? (
                              <>
                                <span className="text-sm text-gray-400 dark:text-gray-500 line-through mr-2">
                                  {product.price.toLocaleString()} so'm
                                </span>
                                <span className="text-xl font-black text-[#FF8A00] dark:text-orange-400">
                                  {product.discountPrice.toLocaleString()} so'm
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-black text-[#005CB9] dark:text-blue-400">
                                {product.price.toLocaleString()} so'm
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleWishlist(product._id);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                wishlist.includes(product._id)
                                  ? 'bg-red-500 dark:bg-red-600 text-white'
                                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                              }`}
                            >
                              <Heart size={16} fill={wishlist.includes(product._id) ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product._id, 1);
                              }}
                              disabled={addingToCart === product._id || product.stock === 0}
                              className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1 ${
                                product.stock === 0
                                  ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'
                              }`}
                            >
                              {addingToCart === product._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <>
                                  <ShoppingCart size={16} />
                                  <span>Savatga</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#005CB9]/20 dark:group-hover:border-blue-600/30 rounded-xl transition-all duration-300" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-[#005CB9] dark:hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {[...Array(pagination.pages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                  ) {
                    return (
                      <button
                        key={pageNum}  
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-[#005CB9] dark:bg-blue-600 text-white'
                            : 'border border-gray-200 dark:border-slate-700 hover:border-[#005CB9] dark:hover:border-blue-400 hover:text-[#005CB9] dark:hover:text-blue-400 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === pagination.page - 3 ||
                    pageNum === pagination.page + 3
                  ) {
                    return <span key={pageNum} className="text-gray-400 dark:text-gray-500">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-[#005CB9] dark:hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          // Empty State
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center relative overflow-hidden">
            {/* Floating Particles in empty state */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 92, 185, 0.05), transparent 70%)`,
              }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="w-24 h-24 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <Search size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 relative z-10">Kitob topilmadi</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto relative z-10">
              Sizning so'rovingiz bo'yicha hech qanday kitob topilmadi. Boshqa filtrlar bilan urinib ko'ring.
            </p>
            <Button
              onClick={handleResetFilters}
              className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all relative z-10"
            >
              Filtrlarni tozalash
            </Button>
          </div>
        )}

        {/* Info Icons */}
        <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2">
            <Truck size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">Bepul yetkazish</span>
          </div>
          <div className="p-2">
            <Shield size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">Xavfsiz to'lov</span>
          </div>
          <div className="p-2">
            <MessageCircle size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">24/7 qo'llab-quvvatlash</span>
          </div>
        </div>
      </div>
    </div>
  );
}