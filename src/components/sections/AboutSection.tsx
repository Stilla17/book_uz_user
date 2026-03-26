"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  Truck, 
  ShieldCheck, 
  Star, 
  Award, 
  Heart,
  Sparkles,
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

export const AboutSection = () => {
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

  const stats = [
    { id: 1, icon: <BookOpen size={24} />, label: "Kitoblar", value: "50,000+", color: "blue" },
    { id: 2, icon: <Users size={24} />, label: "Mijozlar", value: "100,000+", color: "orange" },
    { id: 3, icon: <Truck size={24} />, label: "Yetkazib berish", value: "24/7", color: "blue" },
    { id: 4, icon: <ShieldCheck size={24} />, label: "Kafolat", value: "100%", color: "orange" },
  ];

  const achievements = [
    { icon: <Star size={16} />, label: "4.9 reyting", color: "orange" },
    { icon: <Award size={16} />, label: "Top 10 kitob do'koni", color: "blue" },
    { icon: <Heart size={16} />, label: "100K+ sevimli kitoblar", color: "orange" },
  ];

  // Floating icons array
  const floatingIcons = [Sparkles, Star, Heart, Crown, Zap, Award, Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-900 overflow-hidden relative">
      
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

      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Chap tomon: Matn */}
          <motion.div 
            className="lg:w-1/2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full">
              <Award size={16} className="text-[#ef7f1a] dark:text-orange-400" />
              <span className="text-xs font-bold text-[#00a0e3] dark:text-blue-400">BIZ HAQIMIZDA</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              <span className="text-[#00a0e3] dark:text-blue-400">Sizning intellektual</span>
              <br />
              <span className="text-[#ef7f1a] dark:text-orange-400">hamrohingiz</span>
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-xl">
              Biz 2020-yildan buyon kitobxonlar uchun eng sara asarlarni yetkazib kelmoqdamiz. 
              Maqsadimiz — har bir xonadonga <span className="font-bold text-[#00a0e3] dark:text-blue-400">ilm nuri</span> kirib borishini 
              ta'minlash va mutolaa madaniyatini yuksaltirishdir.
            </p>

            {/* Achievements */}
            <div className="flex flex-wrap gap-4 pt-2">
              {achievements.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 ${
                    item.color === 'blue' 
                      ? 'text-[#00a0e3] dark:text-blue-400' 
                      : 'text-[#ef7f1a] dark:text-orange-400'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs font-bold dark:text-white">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className={`p-3 rounded-2xl transition-all group-hover:scale-110 ${
                    stat.color === 'blue' 
                      ? 'bg-[#00a0e3]/10 dark:bg-blue-600/20 group-hover:bg-[#00a0e3]/20 dark:group-hover:bg-blue-600/30' 
                      : 'bg-[#ef7f1a]/10 dark:bg-orange-600/20 group-hover:bg-[#ef7f1a]/20 dark:group-hover:bg-orange-600/30'
                  }`}>
                    <div className={stat.color === 'blue' ? 'text-[#00a0e3] dark:text-blue-400' : 'text-[#ef7f1a] dark:text-orange-400'}>
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-4 group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <BookOpen size={18} />
                Batafsil ma'lumot
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ef7f1a] to-[#00a0e3] dark:from-orange-600 dark:to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          {/* O'ng tomon: Vizual rasm */}
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Asosiy rasm */}
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-[3rem] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00a0e3]/20 to-[#ef7f1a]/20 dark:from-blue-600/30 dark:to-orange-600/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070" 
                alt="Library" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Floating Particles */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.1), transparent 70%)`,
                }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Decorative overlay */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 dark:from-slate-900/50 to-transparent z-20" />
              
              {/* Floating card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-6 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border-l-4 border-[#ef7f1a] dark:border-orange-600"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 rounded-xl flex items-center justify-center text-white font-black">
                    5+
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Yillik tajriba</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">Mukammal xizmat</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Dekorativ elementlar */}
            <div className="absolute -bottom-6 -left-6 z-30 hidden md:block">
              <motion.div 
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="bg-gradient-to-br from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white p-6 rounded-3xl shadow-2xl"
              >
                <p className="text-4xl font-black">10K+</p>
                <p className="text-sm opacity-90 font-medium">Audio kitoblar</p>
              </motion.div>
            </div>

            <div className="absolute -top-4 -right-4 z-30 hidden md:block">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-[#ef7f1a] dark:text-orange-400 fill-[#ef7f1a] dark:fill-orange-400" />
                  <Star size={20} className="text-[#ef7f1a] dark:text-orange-400 fill-[#ef7f1a] dark:fill-orange-400" />
                  <Star size={20} className="text-[#ef7f1a] dark:text-orange-400 fill-[#ef7f1a] dark:fill-orange-400" />
                  <Star size={20} className="text-[#ef7f1a] dark:text-orange-400 fill-[#ef7f1a] dark:fill-orange-400" />
                  <Star size={20} className="text-[#ef7f1a] dark:text-orange-400 fill-[#ef7f1a] dark:fill-orange-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mijozlar reytingi</p>
              </motion.div>
            </div>

            {/* Stats badge */}
            <div className="absolute bottom-6 left-6 z-30 hidden md:block">
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#00a0e3]/10 dark:bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-[#00a0e3] dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Faol o'quvchilar</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">100K+</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom decorative line */}
        <motion.div 
          className="mt-16 h-px bg-gradient-to-r from-transparent via-[#00a0e3]/30 dark:via-blue-600/30 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
      </div>
    </section>
  );
};