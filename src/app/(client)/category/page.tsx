"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Headphones, 
  Sparkles, 
  ChevronRight,
  Search,
  Loader2,
  FolderOpen,
  Grid,
  List,
  Star,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  ShoppingCart,
  Tag,
  Award,
  Gem,
  Crown,
  Zap,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Coffee,
  Compass,
  Mic,
  Music,
  Palette,
  Rocket,
  Shield,
  Truck,
  Package,
  Users,
  Globe,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { categoryService } from "@/services/category.service";
import { toast } from "react-hot-toast";

interface ICategory {
  _id: string;
  name: {
    uz: string;
    ru: string;
    en?: string;
  };
  slug: string;
  icon?: string;
  image?: string;
  description?: {
    uz?: string;
    ru?: string;
    en?: string;
  };
  bookCount?: number;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  parentId?: string | null;
  createdAt?: string;
  subCategories?: Array<{
    _id: string;
    name: { uz: string; ru: string; en: string };
    slug: string;
    bookCount?: number;
  }>;
}

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "bookCount" | "newest">("bookCount");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse position for parallax effect
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

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Filter and sort categories
  useEffect(() => {
    let filtered = [...categories];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cat => 
        cat.name.uz.toLowerCase().includes(query) ||
        cat.name.ru.toLowerCase().includes(query) ||
        cat.description?.uz?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.uz.localeCompare(b.name.uz);
      } else if (sortBy === "bookCount") {
        return (b.bookCount || 0) - (a.bookCount || 0);
      } else {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    setFilteredCategories(filtered);
  }, [categories, searchQuery, sortBy]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategoriesPublic();
      
      // Faqat faol kategoriyalarni ko'rsatish
      const activeCategories = data.filter(cat => cat.isActive !== false);
      setCategories(activeCategories);
    } catch (error) {
      console.error("Kategoriyalar yuklanmadi:", error);
      toast.error("Kategoriyalar yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: ICategory) => {
    if (category.icon) {
      return category.icon;
    }
    
    // Slug asosida icon
    const iconMap: Record<string, string> = {
      detektiv: "🔍",
      detektivlar: "🔍",
      fantastika: "🚀",
      fentezi: "🧙",
      roman: "💕",
      romantika: "💕",
      psixologiya: "🧠",
      psixologik: "🧠",
      tarix: "📜",
      biznes: "💼",
      bolalar: "🧸",
      ilmiy: "🔬",
      sheriyat: "📝",
      audio: "🎧",
      audiokitob: "🎧",
      darslik: "📚",
      darsliklar: "📚",
      sarguzasht: "🗺️",
      detektiv: "🔍",
      klassika: "📖",
      falsafa: "🤔",
      diniy: "🕋",
      sanat: "🎨",
      kompyuter: "💻",
      dasturlash: "👨‍💻",
      chet_tili: "🌐",
      lugat: "📘",
    };
    
    return iconMap[category.slug?.toLowerCase()] || "📚";
  };

  const getCategoryColor = (slug: string): string => {
    const colorMap: Record<string, string> = {
      detektiv: "from-red-500 to-orange-500",
      detektivlar: "from-red-500 to-orange-500",
      fantastika: "from-purple-500 to-blue-500",
      fentezi: "from-indigo-500 to-purple-500",
      roman: "from-pink-500 to-rose-500",
      romantika: "from-pink-500 to-rose-500",
      psixologiya: "from-green-500 to-emerald-500",
      psixologik: "from-green-500 to-emerald-500",
      tarix: "from-amber-500 to-yellow-500",
      biznes: "from-blue-500 to-cyan-500",
      bolalar: "from-orange-500 to-yellow-500",
      ilmiy: "from-teal-500 to-green-500",
      sheriyat: "from-fuchsia-500 to-pink-500",
      audio: "from-violet-500 to-purple-500",
      audiokitob: "from-violet-500 to-purple-500",
      darslik: "from-slate-500 to-gray-500",
      darsliklar: "from-slate-500 to-gray-500",
    };
    
    return colorMap[slug] || "from-[#005CB9] to-[#FF8A00]";
  };

  const getCategoryStats = () => {
    const totalBooks = categories.reduce((sum, cat) => sum + (cat.bookCount || 0), 0);
    const featuredCount = categories.filter(c => c.isFeatured).length;
    const activeCount = categories.filter(c => c.isActive !== false).length;
    
    return { totalBooks, featuredCount, activeCount };
  };

  const stats = getCategoryStats();

  // Floating icons for background
  const floatingIcons = [
    BookOpen, Headphones, Sparkles, Star, Crown, Zap, Award, 
    Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass, Mic, 
    Music, Palette, Rocket, Globe, Tag, TrendingUp
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => {
            const IconComponent = floatingIcons[i % floatingIcons.length];
            const randomTop = Math.random() * 100;
            const randomLeft = Math.random() * 100;
            const randomSize = Math.random() * 30 + 15;
            
            return (
              <motion.div
                key={i}
                className="absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10"
                style={{
                  top: `${randomTop}%`,
                  left: `${randomLeft}%`,
                  fontSize: `${randomSize}px`,
                }}
                animate={{
                  y: [0, -20, 20, 0],
                  x: [0, 15, -15, 0],
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
        </div>

        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-[#005CB9]/20 dark:border-blue-400/20 border-t-[#005CB9] dark:border-t-blue-400 rounded-full mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 dark:text-gray-400 text-lg"
          >
            Kategoriyalar yuklanmoqda...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-12 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          const randomTop = Math.random() * 100;
          const randomLeft = Math.random() * 100;
          const randomSize = Math.random() * 40 + 20;
          
          return (
            <motion.div
              key={i}
              className="absolute text-[#00a0e3]/5 dark:text-[#ef7f1a]/5"
              style={{
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                fontSize: `${randomSize}px`,
              }}
              animate={{
                y: [0, -30, 30, 0],
                x: [0, 20, -20, 0],
                rotate: [0, 180, 360, 0],
                opacity: [0.1, 0.2, 0.15, 0.1],
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
          className="absolute top-20 left-20 w-96 h-96 bg-[#005CB9]/5 dark:bg-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF8A00]/5 dark:bg-orange-600/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full mb-4"
          >
            <FolderOpen size={16} className="text-[#005CB9] dark:text-blue-400" />
            <span className="text-xs font-bold text-[#FF8A00] dark:text-orange-400">KATEGORIYALAR</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-black mb-4"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-400 dark:to-orange-400">
              Kitob olami
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            O'zingizga yoqqan janrni tanlang va eng sara kitoblarni kashf eting
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Kategoriyalar", value: categories.length, icon: FolderOpen, color: "from-blue-500 to-cyan-500" },
            { label: "Kitoblar", value: stats.totalBooks.toLocaleString(), icon: BookOpen, color: "from-green-500 to-emerald-500" },
            { label: "Tanlangan", value: stats.featuredCount, icon: Star, color: "from-yellow-500 to-orange-500" },
            { label: "Faol", value: stats.activeCount, icon: CheckCircle, color: "from-purple-500 to-pink-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 p-4 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Kategoriya qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 text-gray-900 dark:text-white"
              >
                <option value="bookCount">Eng ko'p kitoblar</option>
                <option value="name">Nomi bo'yicha</option>
                <option value="newest">Eng yangilar</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-xl">
                {[
                  { mode: "grid", icon: Grid },
                  { mode: "list", icon: List },
                  { mode: "compact", icon: SlidersHorizontal },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === mode
                        ? "bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white"
                        : "text-gray-400 dark:text-gray-500 hover:text-[#005CB9] dark:hover:text-blue-400"
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white border-transparent"
                    : "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-[#005CB9] dark:hover:border-blue-400"
                }`}
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-gray-200 dark:border-slate-700"
              >
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#005CB9] focus:ring-[#005CB9]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Faqat tanlanganlar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#005CB9] focus:ring-[#005CB9]"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Kitobi borlar</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Categories Grid/List */}
        {filteredCategories.length > 0 ? (
          <>
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredCategories.map((category, index) => {
                  const gradientColors = getCategoryColor(category.slug);
                  const icon = getCategoryIcon(category);
                  
                  return (
                    <motion.div
                      key={category._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <Link
                        href={`/category/${category.slug}`}
                        className="block bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
                      >
                        {/* Image/Icon Section */}
                        <div className={`relative h-40 bg-gradient-to-br ${gradientColors} bg-opacity-10 flex items-center justify-center overflow-hidden`}>
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name.uz}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <motion.span 
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="text-6xl transform group-hover:scale-110 transition-transform duration-500"
                            >
                              {icon}
                            </motion.span>
                          )}
                          
                          {/* Count Badge */}
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.8, type: "spring" }}
                            className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#005CB9] dark:text-blue-400 border border-gray-200 dark:border-slate-700 shadow-lg"
                          >
                            {category.bookCount?.toLocaleString() || 0} ta
                          </motion.div>

                          {/* Featured Badge */}
                          {category.isFeatured && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1 shadow-lg">
                                <Star size={10} className="fill-white" />
                                Tanlangan
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-[#005CB9] dark:group-hover:text-blue-400 transition-colors">
                            {category.name.uz}
                          </h3>
                          
                          {category.description?.uz && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                              {category.description.uz}
                            </p>
                          )}

                          {/* Subcategories Preview */}
                          {category.subCategories && category.subCategories.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-1">
                              {category.subCategories.slice(0, 3).map((sub) => (
                                <span
                                  key={sub._id}
                                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full"
                                >
                                  {sub.name.uz}
                                </span>
                              ))}
                              {category.subCategories.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full">
                                  +{category.subCategories.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {category.name.ru}
                            </span>
                            <motion.div
                              whileHover={{ x: 5 }}
                              className="text-[#005CB9] dark:text-blue-400"
                            >
                              <ChevronRight size={18} />
                            </motion.div>
                          </div>

                          {/* Popularity Indicator */}
                          {category.bookCount && category.bookCount > 500 && (
                            <div className="mt-3 flex items-center gap-1 text-[10px] text-[#FF8A00] dark:text-orange-400">
                              <TrendingUp size={10} />
                              <span>Ommabop</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredCategories.map((category, index) => {
                  const gradientColors = getCategoryColor(category.slug);
                  const icon = getCategoryIcon(category);
                  
                  return (
                    <motion.div
                      key={category._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <Link
                        href={`/category/${category.slug}`}
                        className="block bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradientColors} flex items-center justify-center text-3xl flex-shrink-0`}>
                            {icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-[#005CB9] dark:group-hover:text-blue-400 transition-colors">
                                {category.name.uz}
                              </h3>
                              <ChevronRight className="text-[#005CB9] dark:text-blue-400" size={20} />
                            </div>

                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {category.name.ru}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-[#005CB9]/10 dark:bg-blue-400/10 text-[#005CB9] dark:text-blue-400 rounded-full">
                                {category.bookCount?.toLocaleString() || 0} ta kitob
                              </span>
                              {category.isFeatured && (
                                <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center gap-1">
                                  <Star size={10} />
                                  Tanlangan
                                </span>
                              )}
                              {category.bookCount && category.bookCount > 500 && (
                                <span className="text-xs px-2 py-0.5 bg-[#FF8A00]/10 text-[#FF8A00] dark:text-orange-400 rounded-full flex items-center gap-1">
                                  <TrendingUp size={10} />
                                  Ommabop
                                </span>
                              )}
                            </div>

                            {category.description?.uz && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-1">
                                {category.description.uz}
                              </p>
                            )}

                            {/* Subcategories */}
                            {category.subCategories && category.subCategories.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {category.subCategories.slice(0, 5).map((sub) => (
                                  <span
                                    key={sub._id}
                                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full"
                                  >
                                    {sub.name.uz}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {viewMode === "compact" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {filteredCategories.map((category, index) => {
                  const icon = getCategoryIcon(category);
                  
                  return (
                    <motion.div
                      key={category._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.7 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Link
                        href={`/category/${category.slug}`}
                        className="block bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 p-3 text-center hover:shadow-lg transition-all group"
                      >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                          {icon}
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1">
                          {category.name.uz}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {category.bookCount?.toLocaleString()} ta
                        </p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="w-24 h-24 mx-auto bg-gradient-to-br from-[#005CB9] to-[#FF8A00] rounded-full flex items-center justify-center mb-6"
            >
              <FolderOpen size={40} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
              Kategoriya topilmadi
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              "{searchQuery}" bo'yicha hech qanday kategoriya topilmadi.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Qidiruvni tozalash
            </button>
          </motion.div>
        )}

        {/* Popular Categories */}
        {filteredCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-12"
          >
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-[#FF8A00]" size={20} />
              Ommabop kategoriyalar
            </h3>
            <div className="flex flex-wrap gap-2">
              {filteredCategories
                .filter(c => c.bookCount && c.bookCount > 500)
                .sort((a, b) => (b.bookCount || 0) - (a.bookCount || 0))
                .slice(0, 10)
                .map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 + 1.1 }}
                  >
                    <Link
                      href={`/category/${category.slug}`}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-slate-700 hover:border-[#005CB9] dark:hover:border-blue-400 hover:text-[#005CB9] dark:hover:text-blue-400 transition-all"
                    >
                      <span>{getCategoryIcon(category)}</span>
                      <span className="font-bold text-sm">{category.name.uz}</span>
                      <span className="text-xs text-gray-400">({category.bookCount})</span>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Info Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
        >
          {[
            { icon: Truck, text: "Bepul yetkazish", sub: "50 000 so'mdan" },
            { icon: Shield, text: "Xavfsiz to'lov", sub: "Visa, MasterCard, Uzcard" },
            { icon: Package, text: "14 kunlik kafolat", sub: "Qaytarish imkoniyati" },
            { icon: Headphones, text: "24/7 Qo'llab-quvvatlash", sub: "Har doim aloqada" },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700"
            >
              <item.icon size={24} className="mx-auto mb-2 text-[#005CB9] dark:text-blue-400" />
              <div className="font-bold text-sm text-gray-900 dark:text-white">{item.text}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{item.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}