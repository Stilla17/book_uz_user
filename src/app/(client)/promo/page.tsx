// app/promo/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gift, 
  Copy, 
  Check, 
  Percent,
  Tag,
  Sparkles,
  Loader2,
  Star,
  Zap,
  Crown,
  Heart,
  TrendingUp,
  Award,
  Gem,
  Diamond,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Snowflake,
  Flame,
  BadgePercent,
  ShoppingBag,
  Wallet,
  Headphones,
  Users,
  Timer,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";

interface PromoCode {
  _id: string;
  code: string;
  discountPercentage: number;
  discountAmount?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description: string;
  descriptionRu: string;
  descriptionEn: string;
  category?: string;
  usageLimit?: number;
  usedCount?: number;
  isNew?: boolean;
  isHot?: boolean;
}

export default function PromoPage() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [enteredCode, setEnteredCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");

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
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      // Try to load from admin first
      const response = await api.get('/promo-codes?active=true');
      
      if (response.data?.success && response.data.data?.length > 0) {
        setPromoCodes(response.data.data);
      } else {
        // Mock promocodes
        setPromoCodes(mockPromoCodes);
      }
    } catch (error) {
      console.error("Promokodlar yuklanmadi:", error);
      setPromoCodes(mockPromoCodes);
    } finally {
      setLoading(false);
    }
  };

  const mockPromoCodes: PromoCode[] = [
    {
      _id: "1",
      code: "WELCOME10",
      discountPercentage: 10,
      minOrderAmount: 50000,
      maxDiscount: 20000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      description: "Birinchi xaridingizga 10% chegirma",
      descriptionRu: "Скидка 10% на первый заказ",
      descriptionEn: "10% discount on your first order",
      category: "new",
      isNew: true,
      usageLimit: 1000,
      usedCount: 234
    },
    {
      _id: "2",
      code: "BOOK20",
      discountPercentage: 20,
      minOrderAmount: 100000,
      maxDiscount: 50000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      description: "Barcha kitoblarga 20% chegirma",
      descriptionRu: "Скидка 20% на все книги",
      descriptionEn: "20% discount on all books",
      category: "popular",
      isHot: true,
      usageLimit: 500,
      usedCount: 345
    },
    {
      _id: "3",
      code: "SUMMER2026",
      discountPercentage: 15,
      minOrderAmount: 75000,
      maxDiscount: 30000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      description: "Yozgi chegirma -15%",
      descriptionRu: "Летняя скидка -15%",
      descriptionEn: "Summer discount -15%",
      category: "seasonal",
      usageLimit: 2000,
      usedCount: 567
    },
    {
      _id: "4",
      code: "AUDIO30",
      discountPercentage: 30,
      minOrderAmount: 150000,
      maxDiscount: 75000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      description: "Audio kitoblarga 30% chegirma",
      descriptionRu: "Скидка 30% на аудиокниги",
      descriptionEn: "30% discount on audiobooks",
      category: "audio",
      isHot: true,
      usageLimit: 300,
      usedCount: 89
    },
    {
      _id: "5",
      code: "STUDENT25",
      discountPercentage: 25,
      minOrderAmount: 80000,
      maxDiscount: 40000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      description: "Talabalar uchun 25% chegirma",
      descriptionRu: "Скидка 25% для студентов",
      descriptionEn: "25% discount for students",
      category: "special",
      usageLimit: 1500,
      usedCount: 678
    },
    {
      _id: "6",
      code: "WEEKEND40",
      discountPercentage: 40,
      minOrderAmount: 200000,
      maxDiscount: 100000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      description: "Dam olish kunlari 40% chegirma",
      descriptionRu: "Скидка 40% на выходные",
      descriptionEn: "40% weekend discount",
      category: "flash",
      isNew: true,
      isHot: true,
      usageLimit: 100,
      usedCount: 23
    }
  ];

  // Calculate days remaining
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get usage percentage
  const getUsagePercentage = (promo: PromoCode) => {
    if (!promo.usageLimit) return 0;
    return (promo.usedCount || 0) / promo.usageLimit * 100;
  };

  // Get category color - brand colors
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      new: "from-[#005CB9] to-[#4da3ff]",
      popular: "from-[#FF8A00] to-[#ffb14d]",
      seasonal: "from-[#005CB9] to-[#FF8A00]",
      audio: "from-[#004a96] to-[#005CB9]",
      special: "from-[#FF8A00] to-[#ffb14d]",
      flash: "from-[#FF8A00] to-[#005CB9]"
    };
    return colors[category] || "from-[#005CB9] to-[#FF8A00]";
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "new": return <Sparkles size={16} />;
      case "popular": return <TrendingUp size={16} />;
      case "seasonal": return <Sun size={16} />;
      case "audio": return <Headphones size={16} />;
      case "special": return <Award size={16} />;
      case "flash": return <Zap size={16} />;
      default: return <Gift size={16} />;
    }
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      new: "Yangi",
      popular: "Ommabop",
      seasonal: "Mavsumiy",
      audio: "Audio",
      special: "Maxsus",
      flash: "Flash"
    };
    return labels[category] || "Promokod";
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Promokod nusxalandi!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyCode = async () => {
    if (!enteredCode.trim()) {
      toast.error("Promokodni kiriting");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Promokodni qo'llash uchun tizimga kiring");
      return;
    }

    try {
      setApplying(true);
      const response = await api.post('/cart/apply-promo', { code: enteredCode });
      
      if (response.data?.success) {
        toast.success("Promokod qo'llandi!");
        // Redirect to cart
        window.location.href = '/cart';
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Promokod yaroqsiz");
    } finally {
      setApplying(false);
    }
  };

  // Filter promocodes
  const filteredPromoCodes = promoCodes.filter(promo => {
    if (filter !== "all" && promo.category !== filter) return false;
    if (searchQuery) {
      return promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
             promo.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Categories for filter
  const categories = [
    { id: "all", label: "Barchasi", icon: <Gift size={14} /> },
    { id: "new", label: "Yangi", icon: <Sparkles size={14} /> },
    { id: "popular", label: "Ommabop", icon: <TrendingUp size={14} /> },
    { id: "seasonal", label: "Mavsumiy", icon: <Sun size={14} /> },
    { id: "audio", label: "Audio", icon: <Headphones size={14} /> },
    { id: "special", label: "Maxsus", icon: <Award size={14} /> },
    { id: "flash", label: "Flash", icon: <Zap size={14} /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#005CB9]/20 border-t-[#005CB9] rounded-full animate-spin mx-auto mb-6" />
            <Gift className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#005CB9]" size={40} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse text-xl">Promokodlar yuklanmoqda...</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Eng sara chegirmalarni tayyorlayapmiz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        {[...Array(20)].map((_, i) => {
          const icons = [Gift, Sparkles, Star, Heart, Crown, Zap, Award, Gem, Diamond, Flower2, Sun, Moon, Cloud, Snowflake, Flame];
          const IconComponent = icons[i % icons.length];
          const randomTop = Math.random() * 100;
          const randomLeft = Math.random() * 100;
          const randomFontSize = Math.random() * 40 + 20;
          
          return (
            <motion.div
              key={i}
              className="absolute text-[#005CB9]/10 dark:text-[#FF8A00]/10"
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
          className="absolute top-20 left-20 w-96 h-96 bg-[#005CB9]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF8A00]/10 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 rounded-full mb-6"
          >
            <Gift size={16} className="text-[#005CB9]" />
            <span className="text-sm font-bold text-[#FF8A00]">PROMOKODLAR</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005CB9] to-[#FF8A00]">
              Maxsus chegirmalar
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Promokodlar orqali sevimli kitoblaringizni yanada arzonroq xarid qiling
          </motion.p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Promokod qidirish..."
                className="pl-10 h-12 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#005CB9]"
              />
              <Gift size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                    filter === cat.id
                      ? "bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white shadow-lg scale-105"
                      : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#005CB9]"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Promo Code Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-[#005CB9]/20 dark:border-[#FF8A00]/20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BadgePercent size={18} className="text-[#005CB9]" />{' Promokodni qo\'llash '}</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                  placeholder="PROMOKOD"
                  className="flex-1 uppercase pl-10 h-12 border-2 focus:border-[#005CB9]"
                />
                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <Button
                onClick={handleApplyCode}
                disabled={applying}
                className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white px-8 h-12 text-lg font-bold hover:shadow-xl transition-all"
              >
                {applying ? <Loader2 size={18} className="animate-spin" /> : "Qo'llash"}
              </Button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{' Promokodni qo\'llash orqali savatdagi mahsulotlarga chegirma oling '}</p>
          </div>
        </motion.div>

        {/* Promo Codes Grid */}
        {filteredPromoCodes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromoCodes.map((promo, index) => {
              const daysRemaining = getDaysRemaining(promo.endDate);
              const usagePercentage = getUsagePercentage(promo);
              const isHovered = hoveredCode === promo._id;
              const categoryColor = getCategoryColor(promo.category || "default");
              const categoryIcon = getCategoryIcon(promo.category || "default");
              const categoryLabel = getCategoryLabel(promo.category || "default");

              return (
                <motion.div
                  key={promo._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                  onHoverStart={() => setHoveredCode(promo._id)}
                  onHoverEnd={() => setHoveredCode(null)}
                  className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-[#005CB9]/20 dark:border-[#FF8A00]/20 hover:shadow-2xl transition-all"
                >
                  {/* Animated Background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    animate={{
                      background: isHovered 
                        ? `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 92, 185, 0.1), transparent 70%)`
                        : 'none',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${categoryColor} text-white shadow-lg`}>
                      {categoryIcon}
                      <span>{categoryLabel}</span>
                    </div>
                  </div>
                  {/* New/Hot Badges */}
                  <div className="absolute top-3 right-3 z-10 flex gap-1">
                    {promo.isNew && (
                      <div className="px-2 py-1 bg-[#005CB9] text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <Sparkles size={12} />
                        <span>Yangi</span>
                      </div>
                    )}
                    {promo.isHot && (
                      <div className="px-2 py-1 bg-[#FF8A00] text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <Flame size={12} />
                        <span>Hot</span>
                      </div>
                    )}
                  </div>
                  {/* Header Gradient */}
                  <div className={`bg-gradient-to-r ${categoryColor} p-6 pt-8`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift size={24} className="text-white" />
                        <span className="text-white font-black text-2xl tracking-wider">{promo.code}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopyCode(promo.code)}
                        className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                      >
                        {copiedCode === promo.code ? (
                          <Check size={18} className="text-white" />
                        ) : (
                          <Copy size={18} className="text-white" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Discount */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Percent size={20} className="text-[#005CB9]" />
                        <span className="text-4xl font-black text-gray-900 dark:text-white">
                          {promo.discountPercentage}%
                        </span>
                      </div>
                      {promo.maxDiscount && (
                        <div className="text-right">
                          <span className="text-xs text-gray-400">Maksimal</span>
                          <p className="font-bold text-[#FF8A00] dark:text-orange-400">
                            {promo.maxDiscount.toLocaleString()}{' so\'m '}</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                      {promo.description}
                    </p>

                    {/* Min Order */}
                    {promo.minOrderAmount && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <ShoppingBag size={14} />
                        <span>Min. buyurtma: <span className="font-bold text-[#005CB9]">{promo.minOrderAmount.toLocaleString()}{' so\'m'}</span></span>
                      </div>
                    )}

                    {/* Timer */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Timer size={14} />
                      <span>
                        Amal qilish muddati: <span className="font-bold text-[#FF8A00]">{daysRemaining} kun</span>
                      </span>
                    </div>

                    {/* Progress Bar (if has usage limit) */}
                    {promo.usageLimit && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Ishlatilgan</span>
                          <span>{promo.usedCount || 0} / {promo.usageLimit}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${usagePercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                            className={`h-full bg-gradient-to-r ${categoryColor} rounded-full`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => window.location.href = '/catalog'}
                        className={`w-full bg-gradient-to-r ${categoryColor} text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all group`}
                      >
                        <span>Xarid qilish</span>
                        <ShoppingBag size={18} className="ml-2 inline group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Empty State
          (<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-[#005CB9]/20 dark:to-[#FF8A00]/20 rounded-full flex items-center justify-center mb-6">
              <Gift size={48} className="text-[#005CB9] dark:text-[#FF8A00]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Promokod topilmadi
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{' "'}{searchQuery}{'" bo\'yicha hech qanday promokod topilmadi '}</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
              }}
              className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white"
            >
              Filtrlarni tozalash
            </Button>
          </motion.div>)
        )}

        {/* Statistics */}
        {promoCodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: <Gift size={24} />, label: "Jami promokodlar", value: promoCodes.length },
              { icon: <Percent size={24} />, label: "O'rtacha chegirma", value: "25%" },
              { icon: <Users size={24} />, label: "Foydalanuvchilar", value: "10,000+" },
              { icon: <Wallet size={24} />, label: "Tejalgan summa", value: "50M+" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 1.3 }}
                className="text-center p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700"
              >
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#005CB9] to-[#FF8A00] rounded-xl flex items-center justify-center text-white mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Promokodlar haqida savollaringiz bormi?{" "}
            <Link href="/faq" className="text-[#005CB9] hover:text-[#FF8A00] font-bold">{' FAQ bo\'limiga o\'tish '}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}