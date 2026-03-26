"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Headphones, 
  Sparkles,
  FileQuestion,
  Compass,
  Coffee,
  Cloud,
  BookMarked,
  TrendingUp,
  Heart,
  ShoppingBag,
  Mail,
  Phone,
  Clock,
  MapPin,
  Menu,
  X,
  ChevronRight,
  Star,
  Award,
  Zap,
  Globe,
  Mic2,
  Library,
  BookCopy,
  Volume2,
  Disc3,
  Podcast,
  Radio,
  MessageCircle,
  ThumbsUp,
  Share2,
  Download,
  Bookmark,
  Eye,
  Calendar,
  Users,
  Rocket,
  Moon,
  Sun,
  Wind,
  Feather,
  Leaf,
  Flower2,
  TreePine,
  Mountain,
  Waves,
  Sunset,
  Sunrise,
  CloudSun,
  CloudMoon,
  Sparkle,
  Flame,
  Droplets,
  Snowflake,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Tornado,
  Rainbow,
  Compass as CompassIcon,
  Navigation,
  Map,
  Globe2,
  Earth,
  Satellite,
  Telescope,
  Microscope,
  Atom,
  Brain,
  Cpu,
  Bot,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Tv,
  RadioReceiver,
  RadioTower,
  SatelliteDish,
  Wifi,
  Bluetooth,
  Zap as ZapIcon,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Power,
  PowerOff,
  PowerCircle,
  CircleDot,
  CircleDashed,
  CircleDotDashed,
  CircleEllipsis,
  CircleOff,
  CircleSlash,
  CircleSlash2,
  CircleSlashed,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

// Random book facts array
const bookFacts = [
  { fact: "Dunyodagi eng qimmat kitob 30 million dollarga sotilgan", emoji: "💰" },
  { fact: "Eng katta kutubxonada 170 million dan ortiq kitob bor", emoji: "📚" },
  { fact: "O'rtacha kitob 300-400 sahifadan iborat", emoji: "📖" },
  { fact: "Dunyoda har kuni 4000 dan ortiq kitob nashr etiladi", emoji: "🌍" },
  { fact: "Eng qadimgi kitob 2500 yil oldin yozilgan", emoji: "🕰️" },
  { fact: "O'zbekistonda yiliga 2000 dan ortiq kitob nashr qilinadi", emoji: "🇺🇿" },
  { fact: "Audio kitoblar tinglash kitob o'qishdan 2 barobar tez", emoji: "🎧" },
  { fact: "Dunyo aholisining 15% kitob o'qishni yoqtirmaydi", emoji: "😴" },
  { fact: "Eng ko'p o'qilgan kitob - Bibliya", emoji: "📖" },
  { fact: "Harry Potter kitoblari 500 million nusxada sotilgan", emoji: "⚡" },
  { fact: "O'zbekistonda eng ko'p o'qilgan muallif - Alisher Navoiy", emoji: "🖋️" },
  { fact: "Kitob o'qish stressni 68% ga kamaytiradi", emoji: "😌" },
  { fact: "Haftada 3 soat kitob o'qish umrni 2 yilga uzaytiradi", emoji: "⏳" },
  { fact: "Elektron kitoblar 1971-yilda paydo bo'lgan", emoji: "💻" },
  { fact: "Eng kichik kitob tuz donasidek", emoji: "🔬" },
];

// Floating icons for background animation
const floatingIcons = [
  BookOpen, Headphones, Sparkles, Star, Heart, MessageCircle, ThumbsUp, Share2, Download, Bookmark,
  Eye, Calendar, Users, Rocket, Coffee, Cloud, Compass, Map, Globe, Satellite,
  Mic2, Library, BookCopy, Volume2, Disc3, Podcast, Radio, Wind, Feather, Leaf,
  Flower2, TreePine, Mountain, Waves, Sunset, Sunrise, CloudSun, CloudMoon, Sparkle, Flame,
  Droplets, Snowflake, Rainbow, Navigation, Telescope, Microscope, Atom, Brain, Cpu, Bot
];

export default function NotFound() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [randomFact, setRandomFact] = useState(bookFacts[0]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  // Change random fact every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * bookFacts.length);
      setRandomFact(bookFacts[randomIndex]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Rotate floating icons
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % floatingIcons.length);
    }, 3000);
    return () => clearInterval(interval);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Get random icon component
  const RandomIcon = floatingIcons[currentIconIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Icons */}
        {[...Array(20)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          return (
            <motion.div
              key={i}
              className="absolute text-gray-200 dark:text-gray-700/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 40 + 20}px`,
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

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute bottom-20 right-20 w-64 h-64 bg-orange-500/10 dark:bg-orange-600/10 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container max-w-4xl mx-auto text-center relative z-10">
        
        {/* Floating Icon */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity },
          }}
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 text-blue-500/20 dark:text-blue-400/20"
          style={{ fontSize: "120px" }}
        >
          <RandomIcon />
        </motion.div>

        {/* Main 404 Text with Parallax */}
        <motion.div
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="relative mb-8"
        >
          <div className="text-[150px] md:text-[250px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-orange-500 to-pink-600 dark:from-blue-400 dark:via-orange-400 dark:to-pink-400 leading-none select-none">
            404
          </div>
          
          {/* Glitch Effect */}
          <motion.div
            animate={{
              x: [0, -10, 10, -5, 5, 0],
              opacity: [0, 0.5, 0, 0.3, 0, 0],
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
            className="absolute top-0 left-0 w-full text-[150px] md:text-[250px] font-black text-red-500/30 dark:text-red-400/30 leading-none select-none"
          >
            404
          </motion.div>
          <motion.div
            animate={{
              x: [0, 10, -10, 5, -5, 0],
              opacity: [0, 0.5, 0, 0.3, 0, 0],
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5, delay: 0.2 }}
            className="absolute top-0 left-0 w-full text-[150px] md:text-[250px] font-black text-blue-500/30 dark:text-blue-400/30 leading-none select-none"
          >
            404
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-orange-500/10 rounded-full blur-2xl"
          />
          
          <motion.div
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-2xl"
          />

          {/* Floating Badges */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-10 md:right-20 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700"
          >
            <BookOpen className="w-8 h-8 text-blue-500" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-10 md:left-20 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700"
          >
            <Headphones className="w-8 h-8 text-orange-500" />
          </motion.div>
        </motion.div>

        {/* Title with Typewriter Effect */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600 dark:from-blue-400 dark:to-orange-400">
            Sahifa topilmadi
          </span>
        </motion.h1>

        {/* Description with Animated Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative"
        >
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
            Kechirasiz, siz qidirgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
          </p>
          <p className="text-base text-gray-500 dark:text-gray-500 max-w-xl mx-auto">
            Bosh sahifaga qaytib, 50,000+ kitoblar olamini kashf etishni davom ettiring.
          </p>
        </motion.div>

        {/* Random Fact Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-md mx-auto mt-8 mb-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={randomFact.fact}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800"
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{randomFact.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                    BILASIZMI?
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {randomFact.fact}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10"
        >
          {[
            { icon: <Home size={20} />, label: "Bosh sahifa", href: "/", color: "blue" },
            { icon: <BookOpen size={20} />, label: "Kitoblar", href: "/catalog", color: "orange" },
            { icon: <Headphones size={20} />, label: "Audio", href: "/catalog?format=audio", color: "green" },
            { icon: <Sparkles size={20} />, label: "Yangiliklar", href: "/catalog?sort=-createdAt", color: "purple" },
            { icon: <TrendingUp size={20} />, label: "Mashhur", href: "/catalog?sort=-ratingAvg", color: "red" },
            { icon: <Heart size={20} />, label: "Sevimlilar", href: "/wishlist", color: "pink" },
            { icon: <ShoppingBag size={20} />, label: "Savat", href: "/cart", color: "amber" },
            { icon: <BookMarked size={20} />, label: "Kitoblarim", href: "/my-books", color: "indigo" },
          ].map((item, index) => {
            const colorClasses = {
              blue: "hover:border-blue-500 hover:text-blue-500",
              orange: "hover:border-orange-500 hover:text-orange-500",
              green: "hover:border-green-500 hover:text-green-500",
              purple: "hover:border-purple-500 hover:text-purple-500",
              red: "hover:border-red-500 hover:text-red-500",
              pink: "hover:border-pink-500 hover:text-pink-500",
              amber: "hover:border-amber-500 hover:text-amber-500",
              indigo: "hover:border-indigo-500 hover:text-indigo-500",
            };
            
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm ${colorClasses[item.color as keyof typeof colorClasses]} transition-all group`}
                >
                  <div className={`p-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-400 group-hover:text-${item.color}-500 group-hover:bg-${item.color}-50 dark:group-hover:bg-${item.color}-900/20 transition-all`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-inherit">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onSubmit={handleSearch}
          className="max-w-md mx-auto mb-10"
        >
          <div className="relative group">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kitob nomi, muallif yoki janr..."
              className="w-full pl-12 pr-24 py-6 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-all group-hover:shadow-lg"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-6 py-4 rounded-lg"
            >
              Qidirish
            </Button>
          </div>
        </motion.form>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2 px-8 py-6 text-base border-2 border-gray-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all"
            >
              <ArrowLeft size={18} />
              Ortga qaytish
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/">
              <Button className="flex items-center gap-2 px-8 py-6 text-base bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all">
                <Home size={18} />
                Bosh sahifaga o'tish
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          <a
            href="tel:+998901234567"
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Phone size={14} />
            +998 (90) 123-45-67
          </a>
          <a
            href="mailto:support@book.uz"
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Mail size={14} />
            support@book.uz
          </a>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            09:00 - 22:00
          </div>
        </motion.div>

        {/* Fun Fact Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2"
        >
          <FileQuestion size={14} />
          <span>Kutubxonamizda 50,000+ kitob va 10,000+ audio kitob mavjud</span>
        </motion.div>
      </div>
    </div>
  );
}