"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Truck, MapPin, Clock, Package, Shield, 
  CreditCard, Phone, CheckCircle2, ChevronDown,
  Zap, Sparkles, Star, Heart, Crown, Award, Gem,
  Flower2, Sun, Moon, Cloud, Coffee, Compass
} from "lucide-react";

interface DeliveryOption {
  id: string;
  title: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: React.ReactNode;
  features: string[];
  color: "blue" | "orange";
}

export const DeliverySection = () => {
  const [selectedCity, setSelectedCity] = useState("Toshkent");
  const [deliveryType, setDeliveryType] = useState<string>("standard");
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

  const cities = ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", "Namangan", "Xiva"];

  const deliveryOptions: DeliveryOption[] = [
    {
      id: "pickup",
      title: "Do'kondan olib ketish",
      description: "O'zingizga qulay vaqtda",
      price: 0,
      estimatedDays: "Bugun",
      icon: <MapPin size={22} />,
      color: "blue",
      features: ["Navbatsiz qabul", "15 ta nuqta", "Tekshirish imkoni"]
    },
    {
      id: "standard",
      title: "Standart kuryer",
      description: "Eshigingizgacha",
      price: 15000,
      estimatedDays: "24-48 soat",
      icon: <Truck size={22} />,
      color: "orange",
      features: ["Kuzatuv", "Xavfsiz qadoq", "Kuryer aloqasi"]
    },
    {
      id: "express",
      title: "Tezkor Express",
      description: "Shoshilinch",
      price: 35000,
      estimatedDays: "3-6 soat",
      icon: <Zap size={22} />,
      color: "blue",
      features: ["Prioritet", "SMS bildirish", "Shaxsiy menejer"]
    }
  ];

  // Floating icons array
  const floatingIcons = [Sparkles, Star, Heart, Crown, Zap, Award, Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass, Truck, Package, Shield, CreditCard];

  const getColorClasses = (color: "blue" | "orange", isActive: boolean) => {
    if (color === "blue") {
      return {
        bg: isActive ? "bg-[#00a0e3] dark:bg-blue-600" : "bg-[#00a0e3]/10 dark:bg-blue-600/20",
        text: isActive ? "text-white" : "text-[#00a0e3] dark:text-blue-400",
        border: isActive ? "border-[#00a0e3] dark:border-blue-600" : "border-[#00a0e3]/20 dark:border-blue-500/30",
        hover: "hover:border-[#00a0e3]/40 dark:hover:border-blue-500/50"
      };
    } else {
      return {
        bg: isActive ? "bg-[#ef7f1a] dark:bg-orange-600" : "bg-[#ef7f1a]/10 dark:bg-orange-600/20",
        text: isActive ? "text-white" : "text-[#ef7f1a] dark:text-orange-400",
        border: isActive ? "border-[#ef7f1a] dark:border-orange-600" : "border-[#ef7f1a]/20 dark:border-orange-500/30",
        hover: "hover:border-[#ef7f1a]/40 dark:hover:border-orange-500/50"
      };
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden relative">
      
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

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full mb-4"
          >
            <Truck size={16} className="text-[#00a0e3] dark:text-blue-400" />
            <span className="text-xs font-bold text-[#ef7f1a] dark:text-orange-400">YETKAZIB BERISH</span>
            <Sparkles size={14} className="text-[#ef7f1a] dark:text-orange-400" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black mb-3"
          >
            <span className="text-[#00a0e3] dark:text-blue-400">Sizga qulay</span>{" "}
            <span className="text-[#ef7f1a] dark:text-orange-400">tarzda yetkazamiz</span>
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Side: City & Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/3 space-y-4"
          >
            {/* City Selector */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-[#00a0e3] dark:text-blue-400" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Shahar tanlang</span>
              </div>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full appearance-none bg-gray-50 dark:bg-slate-700 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00a0e3] dark:focus:ring-blue-600 cursor-pointer"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" size={18} />
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="text-[#00a0e3] dark:text-blue-400 font-bold">{selectedCity}</span> bo'ylab bepul yetkazish
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Clock size={16}/>, label: "Ish vaqti", val: "09:00-22:00", color: "blue" },
                { icon: <CreditCard size={16}/>, label: "To'lov", val: "Karta/Naqd", color: "orange" }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                  <div className={`text-${item.color === 'blue' ? '[#00a0e3]' : '[#ef7f1a]'} dark:${item.color === 'blue' ? 'text-blue-400' : 'text-orange-400'} mb-2`}>
                    {item.icon}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{item.label}</div>
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200">{item.val}</div>
                </div>
              ))}
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-[#00a0e3]/5 to-[#ef7f1a]/5 dark:from-blue-600/10 dark:to-orange-600/10 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#00a0e3] dark:text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Support</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">+998 (90) 123-45-67</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Delivery Cards */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-3">
            {deliveryOptions.map((option, index) => {
              const isActive = deliveryType === option.id;
              const colors = getColorClasses(option.color, isActive);

              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                  onClick={() => setDeliveryType(option.id)}
                  className={`relative p-4 rounded-xl transition-all duration-300 cursor-pointer border-2 ${
                    isActive ? colors.border : 'border-transparent hover:border-gray-200 dark:hover:border-slate-600'
                  } bg-white dark:bg-slate-800 shadow-sm`}
                >
                  {/* Floating Particles */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeDot"
                      className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                        option.color === 'blue' ? 'bg-[#00a0e3] dark:bg-blue-600' : 'bg-[#ef7f1a] dark:bg-orange-600'
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div className={`inline-flex p-2.5 rounded-lg mb-3 ${colors.bg} ${colors.text}`}>
                    {option.icon}
                  </div>

                  {/* Title & Price */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white">{option.title}</h3>
                    {option.price === 0 ? (
                      <span className="text-[10px] font-black text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                        BEPUL
                      </span>
                    ) : (
                      <span className="text-xs font-black text-[#ef7f1a] dark:text-orange-400">
                        {option.price.toLocaleString()} so'm
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{option.description}</p>

                  {/* Features */}
                  <div className="space-y-1.5 mb-3">
                    {option.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-gray-400">
                        <div className={`w-1 h-1 rounded-full ${
                          option.color === 'blue' ? 'bg-[#00a0e3] dark:bg-blue-400' : 'bg-[#ef7f1a] dark:bg-orange-400'
                        }`} />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Delivery Time */}
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500">
                    <Clock size={10} />
                    <span>{option.estimatedDays}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 rounded-xl p-4 text-white flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Shield size={20} />
            <div>
              <p className="text-sm font-bold">Kafolatli yetkazib berish</p>
              <p className="text-xs opacity-90">Barcha buyurtmalar tekshiriladi va kafolatlanadi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/20 dark:bg-white/10 px-3 py-1.5 rounded-lg">
            <CheckCircle2 size={14} />
            <span>100% kafolat</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};