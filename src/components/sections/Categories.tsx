"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { 
  ChevronRight, 
  BookOpen, 
  Headphones, 
  History, 
  Brain, 
  Sparkles,
  Heart,
  Crown,
  Zap,
  Award,
  Gem,
  Diamond,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Coffee,
  Compass,
  Star,
  TrendingUp,
  Clock,
  Eye,
  ShoppingCart,
  Tag,
  Mic,
  Music,
  Palette,
  Rocket,
  Globe,
  Shield,
  Truck,
  Package,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { categoryService } from "@/services/category.service";

interface ICategory {
  _id: string;
  name: { uz: string; ru: string; en?: string };
  slug: string;
  icon?: string;
  image?: string;
  count?: number;
  bookCount?: number;
  description?: { uz?: string; ru?: string; en?: string };
  isFeatured?: boolean;
}

// Icon mapping based on slug
const getIconBySlug = (slug: string): { icon: React.ReactNode; color: string; darkColor: string } => {
  const iconMap: Record<string, { icon: React.ReactNode; color: string; darkColor: string }> = {
    roman: { 
      icon: <BookOpen size={24} />, 
      color: "from-pink-500 to-rose-500",
      darkColor: "dark:from-pink-500 dark:to-rose-500" 
    },
    psixologiya: { 
      icon: <Brain size={24} />, 
      color: "from-green-500 to-emerald-500",
      darkColor: "dark:from-green-500 dark:to-emerald-500" 
    },
    psixologik: { 
      icon: <Brain size={24} />, 
      color: "from-green-500 to-emerald-500",
      darkColor: "dark:from-green-500 dark:to-emerald-500" 
    },
    tarix: { 
      icon: <History size={24} />, 
      color: "from-amber-500 to-yellow-500",
      darkColor: "dark:from-amber-500 dark:to-yellow-500" 
    },
    darslik: { 
      icon: <BookOpen size={24} />, 
      color: "from-slate-500 to-gray-500",
      darkColor: "dark:from-slate-500 dark:to-gray-500" 
    },
    darsliklar: { 
      icon: <BookOpen size={24} />, 
      color: "from-slate-500 to-gray-500",
      darkColor: "dark:from-slate-500 dark:to-gray-500" 
    },
    audio: { 
      icon: <Headphones size={24} />, 
      color: "from-violet-500 to-purple-500",
      darkColor: "dark:from-violet-500 dark:to-purple-500" 
    },
    audiokitob: { 
      icon: <Headphones size={24} />, 
      color: "from-violet-500 to-purple-500",
      darkColor: "dark:from-violet-500 dark:to-purple-500" 
    },
    detektiv: { 
      icon: <Sparkles size={24} />, 
      color: "from-red-500 to-orange-500",
      darkColor: "dark:from-red-500 dark:to-orange-500" 
    },
    detektivlar: { 
      icon: <Sparkles size={24} />, 
      color: "from-red-500 to-orange-500",
      darkColor: "dark:from-red-500 dark:to-orange-500" 
    },
    fantastika: { 
      icon: <Sparkles size={24} />, 
      color: "from-purple-500 to-blue-500",
      darkColor: "dark:from-purple-500 dark:to-blue-500" 
    },
    fentezi: { 
      icon: <Sparkles size={24} />, 
      color: "from-indigo-500 to-purple-500",
      darkColor: "dark:from-indigo-500 dark:to-purple-500" 
    },
    biznes: { 
      icon: <TrendingUp size={24} />, 
      color: "from-blue-500 to-cyan-500",
      darkColor: "dark:from-blue-500 dark:to-cyan-500" 
    },
    bolalar: { 
      icon: <Heart size={24} />, 
      color: "from-orange-500 to-yellow-500",
      darkColor: "dark:from-orange-500 dark:to-yellow-500" 
    },
    ilmiy: { 
      icon: <Award size={24} />, 
      color: "from-teal-500 to-green-500",
      darkColor: "dark:from-teal-500 dark:to-green-500" 
    },
    "sheriyat": { 
      icon: <Feather size={24} />, 
      color: "from-fuchsia-500 to-pink-500",
      darkColor: "dark:from-fuchsia-500 dark:to-pink-500" 
    },
  };
  
  return iconMap[slug] || { 
    icon: <BookOpen size={24} />, 
    color: "from-[#00a0e3] to-[#ef7f1a]",
    darkColor: "dark:from-[#00a0e3] dark:to-[#ef7f1a]" 
  };
};

export const CategorySection = ({
  onCategoryClick,
  lang = "uz",
  limit = 8,
  showAllLink = true,
}: {
  onCategoryClick?: (cat: ICategory) => void;
  lang?: "uz" | "ru" | "en";
  limit?: number;
  showAllLink?: boolean;
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const { isDark, getBgColor, getTextColor, getBorderColor } = useThemeStyles();

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

  // Load categories from backend
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategoriesPublic();
      
      // Filter active categories and sort by order/bookCount
      const activeCategories = data
        .filter(cat => cat.isActive !== false)
        .sort((a, b) => {
          // Sort by order first, then by bookCount
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return (b.bookCount || 0) - (a.bookCount || 0);
        })
        .slice(0, limit);
      
      setCategories(activeCategories);
    } catch (error) {
      console.error("Kategoriyalar yuklanmadi:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const title = lang === "uz" ? "Kategoriyalar" : lang === "ru" ? "Категории" : "Categories";
  const subtitle =
    lang === "uz"
      ? "O‘zingizga yoqqan yo‘nalishni tanlang"
      : lang === "ru"
      ? "Выберите интересующее направление"
      : "Choose your favorite genre";
  
  const allText = lang === "uz" ? "Hammasi" : lang === "ru" ? "Все" : "All";
  const viewAllText = lang === "uz" ? "Hammasini ko'rish" : lang === "ru" ? "Посмотреть все" : "View all";

  const handleCategoryClick = (cat: ICategory) => {
    if (onCategoryClick) {
      onCategoryClick(cat);
    } else {
      window.location.href = `/category/${cat.slug}`;
    }
  };

  // Floating icons array
  const floatingIcons = [BookOpen, Sparkles, Star, Heart, Crown, Zap, Award, Gem, Diamond, Flower2, Sun, Moon, Cloud, Coffee, Compass, Brain, Headphones, History, TrendingUp, Globe];

  // If no categories and not loading, don't render anything
  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        {[...Array(15)].map((_, i) => {
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-black tracking-tight"
            >
              <span className="text-[#00a0e3] dark:text-blue-300">{title.split(' ')[0]}</span>
              <span className="text-[#ef7f1a] dark:text-orange-400"> {title.split(' ').slice(1).join(' ')}</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base"
            >
              {subtitle}
            </motion.p>
          </div>

          {showAllLink && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/catalog"
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#00a0e3] dark:text-blue-300 cursor-pointer hover:text-[#ef7f1a] dark:hover:text-orange-400 transition-colors group"
              >
                {allText} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {loading ? (
            // Skeleton loading
            Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="h-[140px] rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 animate-pulse"
              />
            ))
          ) : categories.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">Kategoriyalar mavjud emas</p>
            </div>
          ) : (
            categories.map((cat, index) => {
              const label = cat.name[lang as keyof typeof cat.name] || cat.name.uz || cat.name.ru;
              const iconConfig = getIconBySlug(cat.slug);
              const bookCount = cat.bookCount || cat.count || 0;

              return (
                <motion.button
                  key={cat._id}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={reduceMotion ? {} : { y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full"
                >
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl p-5",
                    "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700",
                    "border-2 border-transparent",
                    "hover:border-[#00a0e3]/30 dark:hover:border-[#ef7f1a]/30 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20",
                    "transition-all duration-300 h-full flex flex-col"
                  )}>
                    {/* Background Gradient - Light mode */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                      "bg-gradient-to-br",
                      iconConfig.color,
                      "dark:hidden"
                    )} />
                    
                    {/* Background Gradient - Dark mode */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 hidden dark:block",
                      "bg-gradient-to-br",
                      iconConfig.darkColor
                    )} />
                    
                    {/* Icon Container */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl mb-3",
                      "bg-gradient-to-br flex items-center justify-center",
                      iconConfig.color,
                      iconConfig.darkColor,
                      "text-white shadow-lg dark:shadow-2xl"
                    )}>
                      {iconConfig.icon}
                    </div>

                    {/* Category Name */}
                    <h3 className={cn(
                      "font-extrabold text-sm md:text-base text-left",
                      "text-slate-900 dark:text-white",
                      "group-hover:text-[#00a0e3] dark:group-hover:text-[#ef7f1a]",
                      "transition-colors line-clamp-2 flex-1"
                    )}>
                      {label}
                    </h3>

                    {/* Count Badge */}
                    {bookCount > 0 && (
                      <div className={cn(
                        "mt-2 text-xs flex items-center gap-1",
                        "text-slate-400 dark:text-slate-500",
                        "group-hover:text-[#ef7f1a] dark:group-hover:text-orange-400",
                        "transition-colors"
                      )}>
                        <BookOpen size={12} />
                        <span>{bookCount.toLocaleString()} ta</span>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {cat.isFeatured && (
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 bg-yellow-500 text-white text-[8px] rounded-full flex items-center gap-0.5">
                          <Star size={8} className="fill-white" />
                          <span>Top</span>
                        </span>
                      </div>
                    )}

                    {/* Hover Arrow */}
                    <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <ChevronRight size={18} className="text-[#ef7f1a] dark:text-orange-400" />
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                      <div className={cn(
                        "absolute top-0 right-0 w-12 h-12",
                        "bg-gradient-to-br from-[#00a0e3]/20 to-[#ef7f1a]/20",
                        "dark:from-[#00a0e3]/20 dark:to-[#ef7f1a]/20",
                        "transform rotate-12 translate-x-6 -translate-y-6",
                        "group-hover:translate-x-4 group-hover:-translate-y-4",
                        "transition-transform"
                      )} />
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>

        {/* Mobile "All" button */}
        {showAllLink && categories.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="md:hidden mt-8 flex justify-center"
          >
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-[#00a0e3] dark:to-[#ef7f1a] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {viewAllText}
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        )}

        {/* Decorative Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00a0e3]/20 to-transparent" />
      </div>
    </section>
  );
};

// Feather icon component
const Feather = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" x2="2" y1="8" y2="22" />
    <line x1="17.5" x2="9" y1="15" y2="15" />
  </svg>
);
