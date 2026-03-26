"use client";

import { motion } from "framer-motion";
import { 
  Calendar, ArrowUpRight, Megaphone, 
  Sparkles, Newspaper, ChevronRight,
  Clock, Tag, Bell, Star, Heart, Crown,
  Zap, Award, Gem, Flower2, Sun, Moon,
  Cloud, Coffee, Compass, Headphones, Music
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { userBannerService, UserBanner } from "@/services/userBanner.service";

// Yangilik banneri uchun interface
interface NewsBanner extends UserBanner {
  // Banner tipi 'news' bo'ladi
}

export const NewsSection = () => {
  const [news, setNews] = useState<NewsBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
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

  // Yangiliklarni yuklash
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      // Bannerlardan faqat 'news' tipidagilarni olish
      const banners = await userBannerService.getNewsBanners();
      
      // Faol va tartiblangan yangiliklar
      const activeNews = banners
        .filter(banner => banner.isActive)
        .sort((a, b) => a.order - b.order);
      
      setNews(activeNews);
    } catch (error) {
      console.error("Yangiliklar yuklanmadi:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Yangilik bosilganda statistikani yangilash
  const handleNewsClick = (bannerId: string, link?: string) => {
    userBannerService.trackClick(bannerId);
    if (link) {
      window.location.href = link;
    }
  };

  // Floating icons array
  const floatingIcons = [Sparkles, Star, Heart, Crown, Zap, Award, Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass, Headphones, Music, Newspaper, Megaphone];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Kategoriya uslubini olish
  const getCategoryStyles = (badge?: string) => {
    const badgeText = badge?.uz?.toLowerCase() || '';
    
    if (badgeText.includes('yangilanish') || badgeText.includes('update')) {
      return {
        bg: "bg-[#00a0e3]/10 dark:bg-blue-600/20",
        text: "text-[#00a0e3] dark:text-blue-400",
        icon: <Sparkles size={12} className="text-[#00a0e3] dark:text-blue-400" />
      };
    }
    if (badgeText.includes('kitob') || badgeText.includes('book')) {
      return {
        bg: "bg-[#ef7f1a]/10 dark:bg-orange-600/20",
        text: "text-[#ef7f1a] dark:text-orange-400",
        icon: <Newspaper size={12} className="text-[#ef7f1a] dark:text-orange-400" />
      };
    }
    if (badgeText.includes('aksiya') || badgeText.includes('event') || badgeText.includes('акция')) {
      return {
        bg: "bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20",
        text: "text-[#00a0e3] dark:text-blue-400",
        icon: <Tag size={12} className="text-[#ef7f1a] dark:text-orange-400" />
      };
    }
    if (badgeText.includes('promo') || badgeText.includes('chegirma')) {
      return {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-600 dark:text-purple-400",
        icon: <Zap size={12} className="text-purple-600 dark:text-purple-400" />
      };
    }
    // Default
    return {
      bg: "bg-gray-100 dark:bg-slate-700",
      text: "text-gray-600 dark:text-gray-400",
      icon: <Sparkles size={12} />
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#00a0e3]/20 border-t-[#00a0e3] rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null; // Yangiliklar bo'lmasa, komponent ko'rsatilmaydi
  }

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
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full">
              <Megaphone size={14} className="text-[#00a0e3] dark:text-blue-400" />
              <span className="text-xs font-bold text-[#ef7f1a] dark:text-orange-400">BLOG & YANGILIKLAR</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              <span className="text-[#00a0e3] dark:text-blue-400">Platforma</span>{" "}
              <span className="text-[#ef7f1a] dark:text-orange-400">yangiliklari</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Eng so'nggi yangiliklar va aksiyalardan xabardor bo'ling</p>
          </div>

          <Link href="/news" className="group flex items-center gap-1 text-sm font-bold text-[#00a0e3] dark:text-blue-400 hover:text-[#ef7f1a] dark:hover:text-orange-400 transition-colors">
            Barcha yangiliklar 
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.slice(0, 3).map((item, index) => {
            const styles = getCategoryStyles(item.badge);
            
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => handleNewsClick(item._id, item.buttonLink)}
                className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20 transition-all relative"
              >
                {/* Floating Particles */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Image */}
                <div className="relative h-[180px] w-full overflow-hidden">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title.uz} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  
                  {/* Category Badge */}
                  {item.badge?.uz && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`px-3 py-1 ${styles.bg} ${styles.text} rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm dark:backdrop-blur-md`}>
                        {styles.icon}
                        {item.badge.uz}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-gray-400 dark:text-gray-500" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-gray-400 dark:text-gray-500" />
                      <span>3 daq</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#00a0e3] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title.uz}
                  </h3>

                  {item.description?.uz && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {item.description.uz}
                    </p>
                  )}

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ef7f1a] dark:text-orange-400 group-hover:gap-2 transition-all">
                      Batafsil 
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#00a0e3]/20 dark:group-hover:border-blue-600/30 rounded-2xl transition-all duration-300" />
              </motion.div>
            );
          })}
        </div>

        {/* Newsletter Signup */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-gradient-to-r from-[#00a0e3]/5 to-[#ef7f1a]/5 dark:from-blue-600/10 dark:to-orange-600/10 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 relative overflow-hidden"
        >
          {/* Floating Particles */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`,
            }}
            transition={{ duration: 0.3 }}
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 rounded-xl">
                <Bell size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">Yangiliklarni o'tkazib yubormang!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Haftalik dayjest va maxsus takliflar</p>
              </div>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email manzilingiz" 
                className="flex-1 md:w-64 px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-[#00a0e3] dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white text-sm font-bold rounded-xl hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20 transition-all"
              >
                {subscribed ? "✅" : "Obuna"}
              </button>
            </form>
          </div>
          
          {subscribed && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-green-600 dark:text-green-400 mt-2 text-center relative z-10"
            >
              Muvaffaqiyatli obuna bo'ldingiz!
            </motion.p>
          )}
        </motion.div>

        {/* Bottom Stats */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-gray-400 dark:text-gray-500">
          <span>📰 {news.length}+ yangilik</span>
          <span>📧 5K+ obunachi</span>
          <span>🔥 Haftada 3 yangilik</span>
        </div>
      </div>
    </section>
  );
};