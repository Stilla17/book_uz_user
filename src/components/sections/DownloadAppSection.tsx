"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Smartphone, Apple, PlayCircle, CheckCircle2, 
  ArrowRight, Star, ShieldCheck, Zap, 
  Download, Headphones, BookOpen, Award,
  ChevronRight, Sparkles, Music, Cloud,
  QrCode, Gem, Crown, Flower2, Sun, Moon,
  Coffee, Compass, Heart
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Particle = { top: string; left: string; duration: number; delay: number; size: number };

export const DownloadAppSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const list: Particle[] = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 2,
      size: Math.random() * 2 + 1,
    }));
    setParticles(list);
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

  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.6, 1, 0.6]);

  const features = [
    { icon: <Headphones size={16} />, title: "Oflayn rejim", desc: "Internetisiz tinglang" },
    { icon: <Zap size={16} />, title: "Tez yuklash", desc: "2x tezroq" },
    { icon: <ShieldCheck size={16} />, title: "Xavfsiz", desc: "Ma'lumotlar himoyalangan" },
    { icon: <Music size={16} />, title: "Audio kitoblar", desc: "500+ audio" },
    { icon: <BookOpen size={16} />, title: "Elektron kitoblar", desc: "10K+ kitoblar" },
    { icon: <Cloud size={16} />, title: "Cloud sinxron", desc: "Barcha qurilmalarda" }
  ];

  const reviews = [
    { name: "Dilnoza K.", rating: 5, text: "Eng yaxshi ilova!" },
    { name: "Bobur A.", rating: 5, text: "Audio kitoblar ajoyib" },
    { name: "Malika S.", rating: 5, text: "Juda qulay" }
  ];

  // Floating icons array
  const floatingIcons = [Sparkles, Gem, Crown, Flower2, Sun, Moon, Coffee, Compass, Heart, Star, Award, Music];

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-b from-slate-900 to-black dark:from-slate-900 dark:to-black overflow-hidden relative">
      
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
      </div>

      {/* Original Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#00a0e3]/10 dark:bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#ef7f1a]/10 dark:bg-orange-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/5 dark:bg-white/10 rounded-full"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          animate={{ y: [0, -20, 20, -20], x: [0, 20, -20, 20], opacity: [0, 0.3, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
        />
      ))}

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div 
          className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 md:p-10 overflow-hidden shadow-2xl border border-white/5 dark:border-slate-800"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ y, opacity }}
        >
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00a0e3] to-transparent dark:via-blue-600" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ef7f1a] to-transparent dark:via-orange-600" />

          {/* Floating Particles */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`,
            }}
            transition={{ duration: 0.3 }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#00a0e3]/20 to-[#ef7f1a]/20 dark:from-blue-600/30 dark:to-orange-600/30 rounded-full border border-white/10 dark:border-slate-700"
              >
                <Sparkles size={14} className="text-[#ef7f1a] dark:text-orange-400" />
                <span className="text-xs font-bold text-white dark:text-white">Yangi versiya 2.0</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-black text-white dark:text-white leading-tight">
                <span className="text-[#00a0e3] dark:text-blue-400">Kutubxonangiz</span>
                <br />
                <span className="text-[#ef7f1a] dark:text-orange-400">endi cho'ntagingizda</span>
              </h2>

              <p className="text-slate-400 dark:text-slate-400 text-sm max-w-md">
                Ilovani yuklab oling va sevimli asarlaringizni istalgan joyda, 
                internetisiz ham tinglang. 50,000+ kitob va audio kitoblar.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-2">
                {features.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    className="bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/5 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`${i % 2 === 0 ? 'text-[#00a0e3] dark:text-blue-400' : 'text-[#ef7f1a] dark:text-orange-400'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-white dark:text-white text-xs font-bold">{item.title}</p>
                        <p className="text-slate-400 dark:text-slate-400 text-[8px]">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Apple size={20} className="relative z-10 group-hover:text-white dark:group-hover:text-white" />
                  <div className="relative z-10 text-left group-hover:text-white">
                    <p className="text-[8px] uppercase opacity-60">Download on</p>
                    <p className="text-sm">App Store</p>
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-2 bg-slate-800 dark:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm border border-white/10 dark:border-slate-600 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ef7f1a] to-[#00a0e3] dark:from-orange-600 dark:to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <PlayCircle size={20} className="relative z-10" />
                  <div className="relative z-10 text-left">
                    <p className="text-[8px] uppercase opacity-60">Get it on</p>
                    <p className="text-sm">Google Play</p>
                  </div>
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10 dark:border-slate-700">
                <div>
                  <p className="text-white dark:text-white text-xl font-black">500K+</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">Yuklashlar</p>
                </div>
                <div className="w-px h-8 bg-white/10 dark:bg-slate-700" />
                <div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-[#ef7f1a] dark:text-orange-400 fill-[#ef7f1a] dark:fill-orange-400" />
                    <span className="text-white dark:text-white text-xl font-black">4.9</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">Reyting</p>
                </div>
              </div>

              {/* Reviews */}
              <div className="flex items-center gap-2">
                {reviews.map((review, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    className="bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/5 dark:border-slate-700"
                  >
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={8} className="text-[#ef7f1a] dark:text-orange-400 fill-[#ef7f1a] dark:fill-orange-400" />
                      ))}
                    </div>
                    <p className="text-white dark:text-white text-[10px] font-medium">{review.name}</p>
                    <p className="text-slate-400 dark:text-slate-400 text-[8px]">"{review.text}"</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Phone Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative flex justify-center"
            >
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -left-4 z-20 bg-white/10 dark:bg-white/5 backdrop-blur-md p-2 rounded-lg border border-white/20 dark:border-slate-700 hidden lg:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 rounded-full flex items-center justify-center">
                    <Download size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white dark:text-white text-[10px] font-bold">10K+</p>
                    <p className="text-slate-300 dark:text-slate-400 text-[6px]">offline</p>
                  </div>
                </div>
              </motion.div>

              {/* Phone */}
              <div className="relative w-[220px] h-[450px] md:w-[260px] md:h-[520px]">
                {/* Phone Frame */}
                <div className="relative w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] border-[6px] border-slate-700 dark:border-slate-600 shadow-xl overflow-hidden">
                  
                  {/* Screen */}
                  <div className="absolute inset-0">
                    <Image 
                      src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070" 
                      alt="App UI" 
                      fill 
                      className="object-cover opacity-80 dark:opacity-70"
                    />
                  </div>
                  
                  {/* App UI Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent dark:from-slate-900 dark:via-transparent">
                    <div className="absolute bottom-4 left-3 right-3">
                      <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-lg p-2 border border-white/20 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#00a0e3] dark:bg-blue-600 rounded-lg flex items-center justify-center">
                            <Headphones size={12} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white dark:text-white text-[10px] font-bold">Atomic Habits</p>
                            <p className="text-slate-300 dark:text-slate-400 text-[6px]">6h 24min</p>
                          </div>
                          <PlayCircle size={16} className="text-[#ef7f1a] dark:text-orange-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Island */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-900 dark:bg-slate-800 rounded-full" />
                </div>

                {/* Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#00a0e3]/30 to-[#ef7f1a]/30 dark:from-blue-600/30 dark:to-orange-600/30 rounded-[3rem] blur-xl -z-10" />
              </div>

              {/* QR Code */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 bg-white/10 dark:bg-white/5 backdrop-blur-md p-2 rounded-lg border border-white/20 dark:border-slate-700 hidden lg:block"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/10 dark:bg-white/5 rounded-lg mx-auto flex items-center justify-center">
                    <QrCode size={24} className="text-white dark:text-white" />
                  </div>
                  <p className="text-white dark:text-white text-[8px] mt-1">Sketch bilan</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-6"
          >
            <button className="group inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-400 hover:text-white dark:hover:text-white">
              <span>Ilova haqida</span>
              <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};