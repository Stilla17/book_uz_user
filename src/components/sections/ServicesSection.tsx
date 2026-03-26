"use client";
import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Headphones,
  BookHeadphones,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Sparkles,
  Clock,
  Star,
  Heart,
  Crown,
  Zap,
  Award,
  Gem,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Coffee,
  Compass
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ServiceItem = {
  id: string;
  title: string;
  desc: string;
  icon: "delivery" | "support" | "audiobooks" | "secure" | "payment";
  href?: string;
  isActive?: boolean;
  badge?: string;
};

const iconMap = {
  delivery: Truck,
  support: Headphones,
  audiobooks: BookHeadphones,
  secure: ShieldCheck,
  payment: CreditCard,
};

const mockServices: ServiceItem[] = [
  {
    id: "s1",
    title: "Yetkazib berish",
    desc: "Toshkent bo‘ylab tez, viloyatlarga esa ishonchli yetkazamiz.",
    icon: "delivery",
    href: "/delivery",
    badge: "24 soat",
    isActive: true,
  },
  {
    id: "s2",
    title: "24/7 Support",
    desc: "Telegram/Chat orqali doim aloqadamiz. Savol bo‘lsa yozing.",
    icon: "support",
    href: "/support",
    badge: "24/7",
    isActive: true,
  },
  {
    id: "s3",
    title: "Audiokitoblar",
    desc: "Ilovada tinglang: yo‘lda, sportda, uyda — qulay format.",
    icon: "audiobooks",
    href: "/audiobooks",
    badge: "Yangi",
    isActive: true,
  },
  {
    id: "s4",
    title: "Kafolat & Ishonch",
    desc: "Buyurtma xavfsizligi, qaytarish qoidalari va nazorat tizimi.",
    icon: "secure",
    href: "/guarantee",
    badge: "100%",
    isActive: true,
  },
  {
    id: "s5",
    title: "Qulay to‘lovlar",
    desc: "Click/Payme/Uzum/Bank kartalar — hammasi bor.",
    icon: "payment",
    href: "/payments",
    badge: "0% komissiya",
    isActive: true,
  },
];

export const ServicesSection = ({
  adminServices,
  title = "Xizmatlar",
  subtitle = "Biz sizga qulaylik yaratamiz — tez, xavfsiz va foydali",
}: {
  adminServices?: ServiceItem[];
  title?: string;
  subtitle?: string;
}) => {
  const reduceMotion = useReducedMotion();
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

  const services = useMemo(() => {
    const src = adminServices?.length ? adminServices : mockServices;
    return src.filter((s) => s.isActive !== false);
  }, [adminServices]);

  // Floating icons array
  const floatingIcons = [Sparkles, Star, Heart, Crown, Zap, Award, Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass, Truck, Headphones, ShieldCheck, CreditCard];

  // Badge ranglarini aniqlash (dark mode qo'shilgan)
  const getBadgeStyle = (badge: string) => {
    if (badge.includes("24")) 
      return "bg-[#00a0e3]/10 dark:bg-blue-600/20 text-[#00a0e3] dark:text-blue-400 border-[#00a0e3]/20 dark:border-blue-500/30";
    if (badge.includes("Yangi")) 
      return "bg-[#ef7f1a]/10 dark:bg-orange-600/20 text-[#ef7f1a] dark:text-orange-400 border-[#ef7f1a]/20 dark:border-orange-500/30";
    if (badge.includes("100%")) 
      return "bg-green-500/10 dark:bg-green-600/20 text-green-600 dark:text-green-400 border-green-500/20 dark:border-green-500/30";
    return "bg-[#00a0e3]/10 dark:bg-blue-600/20 text-[#00a0e3] dark:text-blue-400 border-[#00a0e3]/20 dark:border-blue-500/30";
  };

  return (
    <section className="py-14 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden relative">
      
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
        <motion.div 
          className="flex flex-col md:flex-row items-end justify-between gap-4 mb-7"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-[#ef7f1a] dark:text-orange-400" />
              <span className="text-xs font-bold text-[#00a0e3] dark:text-blue-400 uppercase tracking-wider">XIZMATLAR</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              <span className="text-[#00a0e3] dark:text-blue-400">{title.split(' ')[0]}</span>
              <span className="text-[#ef7f1a] dark:text-orange-400"> {title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">{subtitle}</p>
          </div>

          <Link
            href="/services"
            className="hidden md:inline-flex items-center gap-1 text-sm font-extrabold text-[#00a0e3] dark:text-blue-400 hover:text-[#ef7f1a] dark:hover:text-orange-400 transition-all group"
          >
            Hammasi 
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((item, idx) => {
            const Icon = iconMap[item.icon];

            return (
              <motion.div
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative"
              >
                <Link
                  href={item.href || "#"}
                  className="block h-full rounded-3xl bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20 transition-all p-6 relative overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00a0e3]/5 via-transparent to-[#ef7f1a]/5 dark:from-blue-600/10 dark:via-transparent dark:to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating Particles */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-bl-full transform translate-x-6 -translate-y-6 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />

                  {/* Icon section */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
                      "bg-white dark:bg-slate-800 group-hover:scale-110",
                      idx % 2 === 0 
                        ? "border-[#00a0e3]/20 dark:border-blue-500/30 group-hover:border-[#00a0e3] dark:group-hover:border-blue-600 group-hover:bg-[#00a0e3]/5 dark:group-hover:bg-blue-600/20" 
                        : "border-[#ef7f1a]/20 dark:border-orange-500/30 group-hover:border-[#ef7f1a] dark:group-hover:border-orange-600 group-hover:bg-[#ef7f1a]/5 dark:group-hover:bg-orange-600/20"
                    )}>
                      <Icon 
                        className={cn(
                          "transition-colors duration-300",
                          idx % 2 === 0 
                            ? "text-[#00a0e3] dark:text-blue-400 group-hover:text-[#00a0e3] dark:group-hover:text-blue-400" 
                            : "text-[#ef7f1a] dark:text-orange-400 group-hover:text-[#ef7f1a] dark:group-hover:text-orange-400"
                        )} 
                        size={26} 
                      />
                    </div>

                    {item.badge && (
                      <span className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-full border transition-all",
                        getBadgeStyle(item.badge)
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-4">
                    <h3 className={cn(
                      "text-[17px] font-extrabold transition-colors duration-300",
                      idx % 2 === 0 
                        ? "text-gray-900 dark:text-white group-hover:text-[#00a0e3] dark:group-hover:text-blue-400" 
                        : "text-gray-900 dark:text-white group-hover:text-[#ef7f1a] dark:group-hover:text-orange-400"
                    )}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className={cn(
                    "relative z-10 mt-5 inline-flex items-center gap-1 text-sm font-extrabold transition-all",
                    idx % 2 === 0 
                      ? "text-[#00a0e3] dark:text-blue-400 group-hover:text-[#00a0e3] dark:group-hover:text-blue-400" 
                      : "text-[#ef7f1a] dark:text-orange-400 group-hover:text-[#ef7f1a] dark:group-hover:text-orange-400"
                  )}>
                    Batafsil 
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Bottom line on hover */}
                  <div className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 group-hover:w-full transition-all duration-300",
                    idx % 2 === 0 ? "bg-[#00a0e3] dark:bg-blue-600" : "bg-[#ef7f1a] dark:bg-orange-600"
                  )} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <motion.div 
          className="md:hidden mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Hammasini ko'rish
            <ChevronRight size={18} />
          </Link>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div 
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {[
            { icon: <Clock size={16} />, label: "Tezkor xizmat", value: "24/7", color: "text-[#00a0e3] dark:text-blue-400" },
            { icon: <Truck size={16} />, label: "Yetkazib berish", value: "Bepul", color: "text-[#ef7f1a] dark:text-orange-400" },
            { icon: <ShieldCheck size={16} />, label: "Kafolat", value: "100%", color: "text-[#00a0e3] dark:text-blue-400" },
            { icon: <Headphones size={16} />, label: "Support", value: "Online", color: "text-[#ef7f1a] dark:text-orange-400" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};