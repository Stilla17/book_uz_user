// app/subscription/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  Sparkles, 
  BookOpen, 
  Headphones, 
  Download,
  Award,
  Star,
  Zap,
  Infinity as InfinityIcon,
  Calendar,
  ArrowRight,
  Loader2,
  Crown,
  Gift,
  Shield,
  Clock,
  Users,
  Globe,
  Mic2,
  Library,
  Heart,
  Cloud,
  Compass,
  Rocket,
  Moon,
  Sun,
  Wind,
  Smartphone,
  Wifi as WifiIcon,
  Battery as BatteryIcon,
  BatteryFull,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { api } from "@/services/api";
import { SubscriptionPlan } from "@/types";

export default function SubscriptionPage() {
  const { user, isAuthenticated } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");
  const [loading, setLoading] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mock plans (agar API dan kelmasa)
  const mockPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Boshlang'ich",
      nameRu: "Начальный",
      nameEn: "Basic",
      price: 29000,
      yearlyPrice: 290000,
      period: "month",
      color: "from-blue-500 to-cyan-500",
      icon: "BookOpen",
      discount: 0,
      savings: 0,
      trialDays: 7,
      features: [
        "10 ta elektron kitob",
        "5 ta audio kitob",
        "Chegirmalar 10%",
        "Offline o'qish",
        "Reklama yo'q",
        "24/7 qo'llab-quvvatlash"
      ],
      featuresRu: [
        "10 электронных книг",
        "5 аудиокниг",
        "Скидки 10%",
        "Офлайн чтение",
        "Без рекламы",
        "Поддержка 24/7"
      ],
      featuresEn: [
        "10 e-books",
        "5 audiobooks",
        "10% discounts",
        "Offline reading",
        "No ads",
        "24/7 support"
      ],
      limits: {
        books: 10,
        audiobooks: 5,
        discount: 10
      }
    },
    {
      id: "standard",
      name: "Standart",
      nameRu: "Стандартный",
      nameEn: "Standard",
      price: 59000,
      yearlyPrice: 590000,
      period: "month",
      isPopular: true,
      color: "from-orange-500 to-pink-500",
      icon: "Zap",
      discount: 0,
      savings: 0,
      trialDays: 14,
      features: [
        "50 ta elektron kitob",
        "30 ta audio kitob",
        "Chegirmalar 20%",
        "Offline o'qish",
        "Reklama yo'q",
        "Premium qo'llab-quvvatlash",
        "Eksklyuziv kontent",
        "Yangi kitoblardan birinchi bo'lib xabardor bo'lish"
      ],
      featuresRu: [
        "50 электронных книг",
        "30 аудиокниг",
        "Скидки 20%",
        "Офлайн чтение",
        "Без рекламы",
        "Премиум поддержка",
        "Эксклюзивный контент",
        "Первыми узнавать о новинках"
      ],
      featuresEn: [
        "50 e-books",
        "30 audiobooks",
        "20% discounts",
        "Offline reading",
        "No ads",
        "Premium support",
        "Exclusive content",
        "First to know about new releases"
      ],
      limits: {
        books: 50,
        audiobooks: 30,
        discount: 20
      }
    },
    {
      id: "premium",
      name: "Premium",
      nameRu: "Премиум",
      nameEn: "Premium",
      price: 99000,
      yearlyPrice: 990000,
      period: "month",
      color: "from-purple-500 to-indigo-500",
      icon: "Crown",
      discount: 0,
      savings: 0,
      trialDays: 30,
      features: [
        "Cheksiz kitoblar",
        "Cheksiz audio kitoblar",
        "Chegirmalar 30%",
        "Offline o'qish",
        "Reklama yo'q",
        "VIP qo'llab-quvvatlash",
        "Eksklyuziv kontent",
        "Yangi kitoblardan birinchi bo'lib xabardor bo'lish",
        "Mualliflar bilan uchrashuvlar",
        "Maxsus tadbirlarga taklifnoma"
      ],
      featuresRu: [
        "Безлимитные книги",
        "Безлимитные аудиокниги",
        "Скидки 30%",
        "Офлайн чтение",
        "Без рекламы",
        "VIP поддержка",
        "Эксклюзивный контент",
        "Первыми узнавать о новинках",
        "Встречи с авторами",
        "Приглашения на спецмероприятия"
      ],
      featuresEn: [
        "Unlimited books",
        "Unlimited audiobooks",
        "30% discounts",
        "Offline reading",
        "No ads",
        "VIP support",
        "Exclusive content",
        "First to know about new releases",
        "Meet the authors",
        "Special event invitations"
      ],
      limits: {
        books: -1,
        audiobooks: -1,
        discount: 30
      }
    }
  ];

  useEffect(() => {
    loadPlans();
  }, []);

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

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      
      // Try to load from API
      try {
        const response = await api.get('/subscription/plans');
        
        if (response.data?.success && response.data.data?.length > 0) {
          // API plans
          setPlans(response.data.data);
          return;
        }
      } catch (apiError) {
        console.log("API dan planlar yuklanmadi, mock ishlatiladi:", apiError);
        // API error - continue to mock
      }
      
      // If API fails or returns empty, use mock plans
      console.log("Mock planlar ishlatilmoqda");
      setPlans(mockPlans);
      
    } catch (error) {
      console.error("Obuna planlari yuklanmadi:", error);
      setPlans(mockPlans);
    } finally {
      setLoadingPlans(false);
    }
  };

  // Calculate yearly prices with discount
  const getYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount
  };

  const getDisplayPrice = (plan: SubscriptionPlan) => {
    if (billingPeriod === "year") {
      return getYearlyPrice(plan.price).toLocaleString();
    }
    return plan.price.toLocaleString();
  };

  const getSavings = (plan: SubscriptionPlan) => {
    if (billingPeriod === "year") {
      const yearlyWithoutDiscount = plan.price * 12;
      const yearlyWithDiscount = getYearlyPrice(plan.price);
      const savings = yearlyWithoutDiscount - yearlyWithDiscount;
      return {
        amount: savings.toLocaleString(),
        percentage: 20
      };
    }
    return null;
  };

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      toast.error("Avval tizimga kiring");
      return;
    }

    try {
      setLoading(planId);
      const response = await api.post('/subscription/subscribe', {
        planId,
        period: billingPeriod
      });

      if (response.data?.success) {
        toast.success("Obuna muvaffaqiyatli yaratildi!");
        // Redirect to payment page or success page
        window.location.href = response.data.data.paymentUrl || '/subscription/success';
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(null);
    }
  };

  const getIconComponent = (icon: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      switch(icon) {
        case 'BookOpen': return <BookOpen size={24} />;
        case 'Zap': return <Zap size={24} />;
        case 'Crown': return <Crown size={24} />;
        case 'Award': return <Award size={24} />;
        default: return <BookOpen size={24} />;
      }
    }
    return icon;
  };

  if (loadingPlans) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500" size={40} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse text-xl">Obuna planlari yuklanmoqda...</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Bir zumda sizni kutubxona olamiga olib boramiz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        {[...Array(15)].map((_, i) => {
          const icons = [BookOpen, Headphones, Sparkles, Star, Heart, Crown, Zap, Gift, Shield, Cloud, Compass, Rocket, Moon, Sun, Wind];
          const IconComponent = icons[i % icons.length];
          const randomTop = Math.random() * 100;
          const randomLeft = Math.random() * 100;
          const randomFontSize = Math.random() * 40 + 20;
          
          return (
            <motion.div
              key={i}
              className="absolute text-gray-200 dark:text-gray-700/30"
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
                // repeatType: "loop" - bu qatorni olib tashladik, chunki repeat: Infinity bilan avtomatik loop bo'ladi
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
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
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
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-full mb-6"
          >
            <Sparkles size={16} className="text-blue-500" />
            <span className="text-sm font-bold text-orange-500">OBUNA</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-orange-500 to-pink-600">
              Cheksiz kitoblar olami
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >{' O\'zingizga mos tarifni tanlang va 50,000+ kitob va 10,000+ audio kitoblardan bahramand bo\'ling '}</motion.p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mb-12"
        >
          <button
            onClick={() => setBillingPeriod("month")}
            className={`relative px-8 py-4 rounded-full font-bold text-lg transition-all ${
              billingPeriod === "month"
                ? "bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-xl scale-105"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500"
            }`}
          >
            Oylik
            {billingPeriod === "month" && (
              <motion.div
                layoutId="billing-indicator"
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"
              />
            )}
          </button>
          
          <button
            onClick={() => setBillingPeriod("year")}
            className={`relative px-8 py-4 rounded-full font-bold text-lg transition-all ${
              billingPeriod === "year"
                ? "bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-xl scale-105"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500"
            }`}
          >
            Yillik
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg"
            >
              -20%
            </motion.span>
            {billingPeriod === "year" && (
              <motion.div
                layoutId="billing-indicator"
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"
              />
            )}
          </button>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const savings = billingPeriod === "year" ? getSavings(plan) : null;
            const isHovered = hoveredPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                onHoverStart={() => setHoveredPlan(plan.id)}
                onHoverEnd={() => setHoveredPlan(null)}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-all ${
                  plan.isPopular ? 'scale-105 z-10' : ''
                } ${isHovered ? 'shadow-2xl scale-[1.02]' : ''}`}
              >
                {/* Animated Background Gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  animate={{
                    background: isHovered 
                      ? `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, ${plan.color.split(' ')[1]}20, transparent 70%)`
                      : 'none',
                  }}
                  transition={{ duration: 0.3 }}
                />
                {plan.isPopular && (
                  <motion.div 
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-3 text-sm font-bold z-20"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Award size={16} />
                      <span>Eng ommabop tanlov</span>
                    </div>
                  </motion.div>
                )}
                {/* Trial Days Badge */}
                {plan.trialDays && plan.trialDays > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.8 }}
                    className="absolute top-4 right-4 z-20"
                  >
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <Calendar size={14} />
                      {plan.trialDays} kun bepul
                    </div>
                  </motion.div>
                )}
                <div className={`p-8 ${plan.isPopular ? 'pt-16' : ''}`}>
                  
                  {/* Icon with Glow Effect */}
                  <motion.div 
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                      rotate: isHovered ? 360 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-6 shadow-xl relative`}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50 blur-xl"
                      animate={{
                        scale: isHovered ? 1.5 : 1,
                        opacity: isHovered ? 0.3 : 0,
                      }}
                      style={{ background: `linear-gradient(to bottom right, ${plan.color})` }}
                    />
                    {typeof plan.icon === 'string' ? getIconComponent(plan.icon) : plan.icon}
                  </motion.div>

                  {/* Plan Name */}
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-gray-900 dark:text-white">
                        {getDisplayPrice(plan)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">{' so\'m / '}{billingPeriod === "month" ? "oy" : "yil"}
                      </span>
                    </div>
                    
                    {/* Savings Badge */}
                    {savings && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold"
                      >
                        <span className="flex items-center gap-1">
                          <Gift size={14} />
                          {savings.amount}{' so\'m tejasiz ('}{savings.percentage}%)
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature: string, i: number) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + i * 0.05 + 0.7 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-md`}>
                          <Check size={14} />
                        </div>
                        <span className="text-gray-600 dark:text-gray-400 text-base">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Subscribe Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loading === plan.id}
                      className={`w-full bg-gradient-to-r ${plan.color} text-white font-bold py-6 rounded-xl text-lg hover:shadow-xl transition-all relative overflow-hidden group`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                      
                      />
                      {loading === plan.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 size={20} className="animate-spin" />
                          <span>Jarayon...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Boshlash</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </motion.div>

                  {/* Money Back Guarantee */}
                  <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                    <Shield size={12} className="inline mr-1" />
                    30 kunlik kafolat
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Nima uchun <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">Book.uz</span>?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Library size={32} />, title: "50,000+ kitoblar", desc: "Eng katta raqamli kutubxona", color: "from-blue-500 to-cyan-500" },
              { icon: <Mic2 size={32} />, title: "10,000+ audio", desc: "Professional ovozlashtirish", color: "from-orange-500 to-pink-500" },
              { icon: <Download size={32} />, title: "Offline o'qish", desc: "Internet siz ham ishlaydi", color: "from-green-500 to-emerald-500" },
              { icon: <InfinityIcon size={32} />, title: "Cheksiz", desc: "Premium obunada barchasi ochiq", color: "from-purple-500 to-indigo-500" },
              { icon: <WifiIcon size={32} />, title: "Sinxronizatsiya", desc: "Barcha qurilmalarda", color: "from-yellow-500 to-orange-500" },
              { icon: <BatteryFull size={32} />, title: "Energiya tejamkor", desc: "Battery saving mode", color: "from-teal-500 to-cyan-500" },
              { icon: <Heart size={32} />, title: "Sevimlilar", desc: "O'zingizga yoqqanlarini saqlang", color: "from-red-500 to-pink-500" },
              { icon: <Users size={32} />, title: "1 million+ foydalanuvchi", desc: "Eng ishonchli platforma", color: "from-indigo-500 to-purple-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all"
              >
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Foydalanuvchilarimiz <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">fikri</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Shahzod", role: "Talaba", comment: "Premium obuna orqali cheksiz kitob o'qiyapman. Juda qulay!", rating: 5, avatar: "👨‍🎓" },
              { name: "Madina", role: "O'qituvchi", comment: "Audio kitoblar juda zo'r. Ishga ketayotganda tinglayman.", rating: 5, avatar: "👩‍🏫" },
              { name: "Jasur", role: "Biznesmen", comment: "Biznes kitoblar doim yangilanib turadi. Tavsiya qilaman!", rating: 5, avatar: "👨‍💼" },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 1.3 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{'"'}{testimonial.comment}{'"'}</p>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Savollaringiz bormi?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{' Obuna haqida batafsil ma\'lumot olish uchun FAQ bo\'limiga o\'ting '}</p>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-lg group"
          >
            <span>{'Tez-tez so\'raladigan savollar'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400 dark:text-gray-600"
        >
          <div className="flex items-center gap-2">
            <Shield size={20} />
            <span className="text-sm">{'Xavfsiz to\'lov'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={20} />
            <span className="text-sm">{'24/7 qo\'llab-quvvatlash'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={20} />
            <span className="text-sm">Global xizmat</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone size={20} />
            <span className="text-sm">Barcha qurilmalar</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
