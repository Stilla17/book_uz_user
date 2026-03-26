"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  Star,
  Heart,
  ShoppingCart,
  BookOpen,
  Headphones,
  Sparkles,
  Tag,
  Loader2,
  User,
  Package,
  Clock,
  TrendingUp,
  Eye,
  CheckCircle,
  SlidersHorizontal,
  ChevronDown,
  AlertCircle,
  Share2,
  Download,
  Award,
  BookMarked,
  Mic2,
  FileText,
  Users,
  FolderOpen,
  ThumbsUp,
  MessageCircle,
  Truck,
  Shield,
  Crown,
  Zap,
  Gem,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Coffee,
  Compass
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, UserService } from "@/services/api";
import { toast } from "react-hot-toast";

interface SearchProduct {
  _id: string;
  title: {
    uz: string;
    ru?: string;
    en?: string;
  };
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  author?: {
    _id: string;
    name: string;
  };
  ratingAvg?: number;
  ratingCount?: number;
  format?: 'ebook' | 'audio' | 'paper';
  language?: string;
  publishYear?: number;
  pages?: number;
  duration?: string;
  views?: number;
  sales?: number;
}

interface SearchCategory {
  _id: string;
  name: {
    uz: string;
    ru?: string;
  };
  slug: string;
  count?: number;
  image?: string;
  description?: string;
}

interface SearchAuthor {
  _id: string;
  name: string;
  image?: string;
  slug: string;
  bookCount?: number;
  bio?: string;
  books?: SearchProduct[];
}

interface SearchResults {
  products: SearchProduct[];
  categories: SearchCategory[];
  authors: SearchAuthor[];
  totalCount: number;
  totalProducts: number;
  totalCategories: number;
  totalAuthors: number;
  trending?: SearchProduct[];
  recommended?: SearchProduct[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { user, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResults>({
    products: [],
    categories: [],
    authors: [],
    totalCount: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalAuthors: 0
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'categories' | 'authors'>('all');
  const [sortBy, setSortBy] = useState<string>("-createdAt");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterFormat, setFilterFormat] = useState<string>("");
  const [filterLanguage, setFilterLanguage] = useState<string>("");
  const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([0, 1000000]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Floating icons array
  const floatingIcons = [Search, BookOpen, Headphones, Star, Sparkles, Crown, Zap, Award, Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass];

  const sortOptions = [
    { value: "-createdAt", label: "Eng yangilar", icon: <Clock size={14} /> },
    { value: "price", label: "Narxi: arzon → qimmat", icon: <TrendingUp size={14} /> },
    { value: "-price", label: "Narxi: qimmat → arzon", icon: <TrendingUp size={14} /> },
    { value: "-ratingAvg", label: "Reyting bo'yicha", icon: <Star size={14} /> },
    { value: "-views", label: "Eng ko'p ko'rilgan", icon: <Eye size={14} /> },
    { value: "-sales", label: "Eng ko'p sotilgan", icon: <ShoppingCart size={14} /> },
  ];

  const formatOptions = [
    { value: "", label: "Barcha formatlar" },
    { value: "ebook", label: "Elektron kitob" },
    { value: "audio", label: "Audio kitob" },
    { value: "paper", label: "Qog'oz kitob" },
  ];

  const languageOptions = [
    { value: "", label: "Barcha tillar" },
    { value: "uz", label: "O'zbekcha" },
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
  ];

  useEffect(() => {
    if (query) {
      loadSearchResults();
    }
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [query, activeTab, sortBy, pagination.page, filterFormat, filterLanguage]);

  const loadSearchResults = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        q: query,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy,
        type: activeTab,
        ...(filterFormat && { format: filterFormat }),
        ...(filterLanguage && { language: filterLanguage }),
        ...(filterPriceRange[0] > 0 && { minPrice: filterPriceRange[0].toString() }),
        ...(filterPriceRange[1] < 1000000 && { maxPrice: filterPriceRange[1].toString() })
      });

      const response = await api.get(`/search?${params.toString()}`);
      
      if (response.data?.success) {
        setResults(response.data.data);
        setPagination(response.data.data.pagination || {
          page: 1,
          limit: 12,
          total: response.data.data.totalCount,
          pages: Math.ceil(response.data.data.totalCount / 12)
        });
      }
    } catch (error) {
      console.error("Qidiruv xatosi:", error);
      toast.error("Qidiruvda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await UserService.getWishlist();
      if (response?.success) {
        setWishlist(response.data.map((item: any) => item._id));
      }
    } catch (error) {
      console.error("Wishlist yuklanmadi:", error);
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/search?q=${encodeURIComponent(query)}`);
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

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/search?q=${encodeURIComponent(query)}`);
      return;
    }

    try {
      setAddingToCart(productId);
      await api.post('/cart/add', { productId, quantity: 1 });
      toast.success("Savatga qo'shildi");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleShare = (product: SearchProduct) => {
    navigator.clipboard.writeText(`${window.location.origin}/book/${product.slug}`);
    toast.success("Havola nusxalandi");
  };

  const getProductTitle = (product: SearchProduct): string => {
    return product.title.uz || product.title.ru || product.title.en || "Noma'lum";
  };

  const getDiscountedPrice = (product: SearchProduct) => {
    if (product.discountPrice && product.discountPrice > 0) {
      return product.discountPrice;
    }
    return product.price;
  };

  const getDiscountPercentage = (product: SearchProduct) => {
    if (product.discountPrice && product.discountPrice > 0) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  const getFormatIcon = (format?: string) => {
    switch(format) {
      case 'audio': return <Headphones size={14} className="text-[#FF8A00] dark:text-orange-400" />;
      case 'ebook': return <BookOpen size={14} className="text-[#005CB9] dark:text-blue-400" />;
      case 'paper': return <BookOpen size={14} className="text-green-600 dark:text-green-400" />;
      default: return <BookOpen size={14} className="text-gray-400 dark:text-gray-500" />;
    }
  };

  const getFormatLabel = (format?: string) => {
    switch(format) {
      case 'audio': return 'Audio kitob';
      case 'ebook': return 'Elektron kitob';
      case 'paper': return 'Qog\'oz kitob';
      default: return 'Kitob';
    }
  };

  const clearFilters = () => {
    setFilterFormat("");
    setFilterLanguage("");
    setFilterPriceRange([0, 1000000]);
    setSortBy("-createdAt");
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => {
            const IconComponent = floatingIcons[i % floatingIcons.length];
            const randomTop = Math.random() * 100;
            const randomLeft = Math.random() * 100;
            const randomFontSize = Math.random() * 40 + 20;
            
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
                  y: [0, -30, 30, 0],
                  x: [0, 30, -30, 0],
                  rotate: [0, 180, 360, 0],
                  opacity: [0.1, 0.3, 0.2, 0.1],
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              >
                <IconComponent />
              </motion.div>
            );
          })}

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

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Search size={48} className="text-[#005CB9] dark:text-blue-400" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-gray-900 dark:text-white mb-2"
          >
            Qidiruv
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 dark:text-gray-400"
          >
            Qidirish uchun so'z kiriting
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        {[...Array(25)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          const randomTop = Math.random() * 100;
          const randomLeft = Math.random() * 100;
          const randomFontSize = Math.random() * 40 + 20;
          
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
                y: [0, -30, 30, 0],
                x: [0, 30, -30, 0],
                rotate: [0, 180, 360, 0],
                opacity: [0.1, 0.3, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
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
        
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="p-3 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-2xl"
          >
            <Search size={28} className="text-[#005CB9] dark:text-blue-400" />
          </motion.div>
          <div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-black"
            >
              <span className="text-[#005CB9] dark:text-blue-400">Qidiruv</span>
              <span className="text-[#FF8A00] dark:text-orange-400"> natijalari</span>
            </motion.h1>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-1"
            >
              <span className="font-bold text-[#005CB9] dark:text-blue-400">{results.totalCount}</span> ta natija topildi
            </motion.p>
          </div>
        </motion.div>

        {/* Search Query with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-[#005CB9]/10 dark:bg-blue-600/20 rounded-lg"
            >
              <Search size={16} className="text-[#005CB9] dark:text-blue-400" />
            </motion.div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Siz qidirdingiz</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">"{query}"</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/catalog"
                className="px-4 py-2 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
              >
                Katalogga o'tish
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {[
            { value: 'all', label: 'Barchasi', icon: Sparkles },
            { value: 'products', label: 'Kitoblar', icon: BookOpen },
            { value: 'categories', label: 'Kategoriyalar', icon: FolderOpen },
            { value: 'authors', label: 'Mualliflar', icon: Users },
          ].map((tab, index) => {
            const Icon = tab.icon;
            const count = tab.value === 'all' ? results.totalCount : 
                         tab.value === 'products' ? results.totalProducts :
                         tab.value === 'categories' ? results.totalCategories : results.totalAuthors;
            
            return (
              <motion.button
                key={tab.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.value
                    ? 'bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                <Icon size={14} />
                {tab.label}
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">
                  {count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Filters and Sort with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="flex-1">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full md:w-auto px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal size={16} />
                Filtrlar
                {(filterFormat || filterLanguage || filterPriceRange[0] > 0 || filterPriceRange[1] < 1000000) && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-[#FF8A00] dark:bg-orange-400 rounded-full"
                  />
                )}
                <ChevronDown size={16} className={`ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="hidden md:flex items-center gap-1 border border-gray-200 dark:border-slate-700 rounded-xl p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" 
                    ? "bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white" 
                    : "text-gray-400 dark:text-gray-500 hover:text-[#005CB9] dark:hover:text-blue-400"
                }`}
              >
                <Grid3x3 size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" 
                    ? "bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white" 
                    : "text-gray-400 dark:text-gray-500 hover:text-[#005CB9] dark:hover:text-blue-400"
                }`}
              >
                <List size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 p-6 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-gray-900 dark:text-white">Qo'shimcha filtrlar</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="text-sm text-[#005CB9] dark:text-blue-400 hover:underline"
                >
                  Tozalash
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Format Filter */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Format
                  </label>
                  <select
                    value={filterFormat}
                    onChange={(e) => setFilterFormat(e.target.value)}
                    className="w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    {formatOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Language Filter */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Til
                  </label>
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="w-full p-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  >
                    {languageOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Price Range */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                    Narx oralig'i
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filterPriceRange[0]}
                      onChange={(e) => setFilterPriceRange([Number(e.target.value), filterPriceRange[1]])}
                      className="w-full bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                    />
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filterPriceRange[1]}
                      onChange={(e) => setFilterPriceRange([filterPriceRange[0], Number(e.target.value)])}
                      className="w-full bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="h-[350px] bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Products */}
            {(activeTab === 'all' || activeTab === 'products') && results.products.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mb-8"
              >
                {(activeTab === 'all') && (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">Kitoblar</h2>
                    <span className="text-xs px-2 py-1 bg-[#005CB9]/10 dark:bg-blue-600/20 text-[#005CB9] dark:text-blue-400 rounded-full">
                      {results.totalProducts}
                    </span>
                  </motion.div>
                )}
                
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {results.products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 1.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all group relative"
                      >
                        {/* Badges */}
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          {product.discountPrice && product.discountPrice > 0 && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 1.2, type: "spring" }}
                              className="bg-red-500 dark:bg-red-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-lg"
                            >
                              <Tag size={10} />
                              -{getDiscountPercentage(product)}%
                            </motion.span>
                          )}
                          {product.format && (
                            <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 border border-gray-200 dark:border-slate-700 shadow-sm">
                              {getFormatIcon(product.format)}
                              <span>{getFormatLabel(product.format)}</span>
                            </span>
                          )}
                          {product.views && product.views > 1000 && (
                            <span className="bg-purple-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                              <Eye size={10} />
                              Trending
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleWishlist(product._id)}
                          className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all ${
                            wishlist.includes(product._id)
                              ? 'bg-red-500 dark:bg-red-600 text-white'
                              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400'
                          }`}
                        >
                          <Heart size={14} fill={wishlist.includes(product._id) ? "currentColor" : "none"} />
                        </motion.button>

                        {/* Share Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShare(product)}
                          className="absolute top-10 right-2 z-10 p-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-[#005CB9] dark:hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Share2 size={12} />
                        </motion.button>

                        {/* Image */}
                        <Link href={`/book/${product.slug}`}>
                          <div className="relative h-[200px] w-full overflow-hidden bg-gray-100 dark:bg-slate-700">
                            <Image
                              src={product.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887"}
                              alt={getProductTitle(product)}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="p-3">
                          <Link href={`/book/${product.slug}`}>
                            <h3 className="font-bold text-sm line-clamp-2 hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors mb-1 text-gray-900 dark:text-white">
                              {getProductTitle(product)}
                            </h3>
                          </Link>
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                            {product.author?.name}
                          </p>

                          {/* Rating */}
                          {product.ratingAvg ? (
                            <div className="flex items-center gap-1 mb-2">
                              <Star size={12} className="text-[#FF8A00] dark:text-orange-400 fill-[#FF8A00] dark:fill-orange-400" />
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                {product.ratingAvg.toFixed(1)}
                              </span>
                              {product.ratingCount && (
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                  ({product.ratingCount})
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="h-4 mb-2" />
                          )}

                          {/* Additional Info */}
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 mb-2">
                            {product.publishYear && (
                              <span>{product.publishYear}</span>
                            )}
                            {product.pages && (
                              <>
                                <span>•</span>
                                <span>{product.pages} bet</span>
                              </>
                            )}
                            {product.duration && (
                              <>
                                <span>•</span>
                                <span>{product.duration}</span>
                              </>
                            )}
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

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAddToCart(product._id)}
                              disabled={addingToCart === product._id}
                              className="p-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-[#005CB9] dark:hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                            >
                              {addingToCart === product._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <ShoppingCart size={14} />
                              )}
                            </motion.button>
                          </div>

                          {/* Sales Count */}
                          {product.sales && product.sales > 0 && (
                            <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                              <ShoppingCart size={8} />
                              <span>{product.sales} ta sotilgan</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 1.1 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:shadow-xl transition-all"
                      >
                        <div className="flex gap-4">
                          <Link href={`/book/${product.slug}`} className="flex-shrink-0">
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className="relative w-20 h-24 rounded-lg overflow-hidden"
                            >
                              <Image
                                src={product.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887"}
                                alt={getProductTitle(product)}
                                fill
                                className="object-cover"
                              />
                            </motion.div>
                          </Link>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <Link href={`/book/${product.slug}`}>
                                  <h3 className="font-bold text-lg hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">
                                    {getProductTitle(product)}
                                  </h3>
                                </Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.author?.name}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                {product.discountPrice && product.discountPrice > 0 && (
                                  <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
                                  >
                                    -{getDiscountPercentage(product)}%
                                  </motion.span>
                                )}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleToggleWishlist(product._id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    wishlist.includes(product._id)
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:text-red-500'
                                  }`}
                                >
                                  <Heart size={16} fill={wishlist.includes(product._id) ? "currentColor" : "none"} />
                                </motion.button>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {product.format && (
                                <div className="flex items-center gap-1">
                                  {getFormatIcon(product.format)}
                                  <span>{getFormatLabel(product.format)}</span>
                                </div>
                              )}
                              {product.language && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {product.language === 'uz' ? 'O\'zbekcha' :
                                     product.language === 'ru' ? 'Русский' : 'English'}
                                  </span>
                                </>
                              )}
                              {product.pages && (
                                <>
                                  <span>•</span>
                                  <span>{product.pages} bet</span>
                                </>
                              )}
                            </div>

                            {product.ratingAvg && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                  <Star size={14} className="text-[#FF8A00] fill-[#FF8A00]" />
                                  <span className="font-bold text-gray-900 dark:text-white">{product.ratingAvg.toFixed(1)}</span>
                                </div>
                                <span className="text-xs text-gray-400">({product.ratingCount} ta baho)</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-4">
                              <div>
                                {product.discountPrice && product.discountPrice > 0 ? (
                                  <>
                                    <span className="text-sm text-gray-400 line-through mr-2">
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

                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <button
                                  onClick={() => handleAddToCart(product._id)}
                                  disabled={addingToCart === product._id}
                                  className="px-4 py-2 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center gap-1"
                                >
                                  {addingToCart === product._id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <>
                                      <ShoppingCart size={16} />
                                      Savatga
                                    </>
                                  )}
                                </button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Categories */}
            {(activeTab === 'all' || activeTab === 'categories') && results.categories.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mb-8"
              >
                {(activeTab === 'all') && (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">Kategoriyalar</h2>
                    <span className="text-xs px-2 py-1 bg-[#005CB9]/10 dark:bg-blue-600/20 text-[#005CB9] dark:text-blue-400 rounded-full">
                      {results.totalCategories}
                    </span>
                  </motion.div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {results.categories.map((category, index) => (
                    <motion.div
                      key={category._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 1.4 }}
                      whileHover={{ y: -5 }}
                    >
                      <Link
                        href={`/category/${category.slug}`}
                        className="block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 flex items-center justify-center">
                            {category.image ? (
                              <Image
                                src={category.image}
                                alt={category.name.uz}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <FolderOpen size={20} className="text-[#005CB9] dark:text-blue-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#005CB9] dark:group-hover:text-blue-400 transition-colors">
                              {category.name.uz}
                            </p>
                            {category.count && (
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {category.count} ta kitob
                              </p>
                            )}
                          </div>
                        </div>
                        {category.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Authors */}
            {(activeTab === 'all' || activeTab === 'authors') && results.authors.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="mb-8"
              >
                {(activeTab === 'all') && (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.7 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">Mualliflar</h2>
                    <span className="text-xs px-2 py-1 bg-[#005CB9]/10 dark:bg-blue-600/20 text-[#005CB9] dark:text-blue-400 rounded-full">
                      {results.totalAuthors}
                    </span>
                  </motion.div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {results.authors.map((author, index) => (
                    <motion.div
                      key={author._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 1.8 }}
                      whileHover={{ y: -5 }}
                    >
                      <Link
                        href={`/author/${author.slug}`}
                        className="block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 flex items-center justify-center overflow-hidden">
                            {author.image ? (
                              <Image
                                src={author.image}
                                alt={author.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={20} className="text-[#005CB9] dark:text-blue-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#005CB9] dark:group-hover:text-blue-400 transition-colors">
                              {author.name}
                            </p>
                            {author.bookCount && (
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {author.bookCount} ta kitob
                              </p>
                            )}
                          </div>
                        </div>
                        {author.bio && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                            {author.bio}
                          </p>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Trending Section */}
            {results.trending && results.trending.length > 0 && activeTab === 'all' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-2 bg-gradient-to-r from-[#FF8A00]/10 to-[#005CB9]/10 dark:from-orange-600/20 dark:to-blue-600/20 rounded-lg"
                  >
                    <TrendingUp size={18} className="text-[#FF8A00] dark:text-orange-400" />
                  </motion.div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">Trenddagi kitoblar</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {results.trending.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 2.1 }}
                      whileHover={{ y: -5 }}
                      className="relative"
                    >
                      {/* Trending Badge */}
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 2.2, type: "spring" }}
                        className="absolute -top-2 -left-2 z-10"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FF8A00] to-[#005CB9] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          <Sparkles size={14} />
                        </div>
                      </motion.div>
                      {/* Product Card (simplified) */}
                      <Link href={`/book/${product.slug}`}>
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all">
                          <div className="relative h-[150px] w-full">
                            <Image
                              src={product.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887"}
                              alt={getProductTitle(product)}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-bold text-sm line-clamp-1 text-gray-900 dark:text-white">
                              {getProductTitle(product)}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {product.author?.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* No results */}
            {results.totalCount === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, type: "spring" }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring" }}
                  className="w-24 h-24 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Search size={48} className="text-gray-400 dark:text-gray-500" />
                </motion.div>
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-2xl font-black text-gray-900 dark:text-white mb-3"
                >
                  Natija topilmadi
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto"
                >
                  "{query}" bo'yicha hech qanday natija topilmadi.
                </motion.p>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="space-y-2 text-sm text-gray-400 dark:text-gray-500 mb-8"
                >
                  <p>Boshqa so'z bilan urinib ko'ring</p>
                  <p>Yoki quyidagi variantlardan birini tanlang:</p>
                </motion.div>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/catalog"
                      className="px-6 py-3 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all inline-flex items-center"
                    >
                      <BookOpen size={18} className="mr-2" />
                      Katalogga o'tish
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/contact"
                      className="px-6 py-3 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:border-[#005CB9] dark:hover:border-blue-400 transition-all inline-flex items-center"
                    >
                      <MessageCircle size={18} className="mr-2" />
                      Yordam so'rash
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.3 }}
                className="flex items-center justify-center gap-2 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-[#005CB9] dark:hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <ChevronLeft size={16} />
                </motion.button>
                
                {[...Array(pagination.pages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= pagination.page - 2 && pageNum <= pagination.page + 2)
                  ) {
                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                        className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white'
                            : 'border border-gray-200 dark:border-slate-700 hover:border-[#005CB9] dark:hover:border-blue-400 hover:text-[#005CB9] dark:hover:text-blue-400 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  } else if (
                    pageNum === pagination.page - 3 ||
                    pageNum === pagination.page + 3
                  ) {
                    return <span key={pageNum} className="text-gray-400 dark:text-gray-500">...</span>;
                  }
                  return null;
                })}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-[#005CB9] dark:hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <ChevronRight size={16} />
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {/* Info Icons with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4 }}
          className="mt-8 grid grid-cols-3 gap-2 text-center text-xs"
        >
          {[
            { icon: Truck, text: "Bepul yetkazish" },
            { icon: Shield, text: "Xavfsiz to'lov" },
            { icon: Headphones, text: "24/7 qo'llab-quvvatlash" },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-2"
            >
              <item.icon size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-400 dark:text-gray-500">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}