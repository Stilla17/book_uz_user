// app/news/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  ArrowUpRight, 
  Megaphone, 
  Sparkles, 
  Newspaper, 
  ChevronRight,
  Clock, 
  Tag, 
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
  Compass, 
  Headphones, 
  Music,
  Search,
  X,
  Eye,
  Filter,
  ChevronLeft
} from "lucide-react";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewsItem {
  _id: string;
  title: string;
  titleRu: string;
  titleEn: string;
  slug: string;
  excerpt: string;
  excerptRu: string;
  excerptEn: string;
  content: string;
  contentRu: string;
  contentEn: string;
  image: string;
  category: "update" | "event" | "new_book" | "promo" | "blog";
  categoryLabel: string;
  categoryLabelRu: string;
  categoryLabelEn: string;
  tags: string[];
  views: number;
  likes: number;
  publishedAt: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  isFeatured: boolean;
  isActive: boolean;
}

// Mock ma'lumotlar (admin qo'shmagan bo'lsa)
const mockNews: NewsItem[] = [
  {
    _id: "n1",
    title: "Mobil ilovamiz endi yanada tezroq va qulayroq!",
    titleRu: "Наше мобильное приложение теперь быстрее и удобнее!",
    titleEn: "Our mobile app is now faster and more convenient!",
    slug: "mobil-ilova-yangilanishi",
    excerpt: "Interfeysni to'liq yangiladik, endi audio kitoblarni oflayn yuklash tizimi 2 barobar tez ishlaydi.",
    excerptRu: "Мы полностью обновили интерфейс, теперь система офлайн-загрузки аудиокниг работает в 2 раза быстрее.",
    excerptEn: "We've completely updated the interface, now the offline audiobook download system works 2 times faster.",
    content: "Batafsil ma'lumot...",
    contentRu: "Подробная информация...",
    contentEn: "Detailed information...",
    image: "https://images.unsplash.com/photo-1551288560-19973648e19c?q=80&w=2070",
    category: "update",
    categoryLabel: "Yangilanish",
    categoryLabelRu: "Обновление",
    categoryLabelEn: "Update",
    tags: ["mobil", "yangilanish"],
    views: 1240,
    likes: 89,
    publishedAt: "2026-03-02T10:00:00Z",
    author: {
      _id: "a1",
      name: "BOOK.UZ Team",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887"
    },
    isFeatured: true,
    isActive: true
  },
  {
    _id: "n2",
    title: "James Clear'ning 'Atomic Habits' kitobi o'zbek tilida!",
    titleRu: "Книга Джеймса Клира 'Атомные привычки' на узбекском языке!",
    titleEn: "James Clear's 'Atomic Habits' book is now in Uzbek!",
    slug: "atomic-habits-ozbek-tilida",
    excerpt: "Dunyoga mashhur bestseller endi bizning kutubxonamizda ham qog'oz, ham audio formatda mavjud.",
    excerptRu: "Всемирно известный бестселлер теперь доступен в нашей библиотеке как в бумажном, так и в аудиоформате.",
    excerptEn: "The world-famous bestseller is now available in our library in both paper and audio formats.",
    content: "Batafsil ma'lumot...",
    contentRu: "Подробная информация...",
    contentEn: "Detailed information...",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887",
    category: "new_book",
    categoryLabel: "Yangi Kitob",
    categoryLabelRu: "Новая книга",
    categoryLabelEn: "New Book",
    tags: ["atomic-habits", "yangi-kitob"],
    views: 892,
    likes: 67,
    publishedAt: "2026-02-28T09:00:00Z",
    author: {
      _id: "a2",
      name: "Madina Rahimova",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888"
    },
    isFeatured: true,
    isActive: true
  },
  {
    _id: "n3",
    title: "Bahorgi chegirmalar haftaligi boshlanmoqda!",
    titleRu: "Неделя весенних скидок начинается!",
    titleEn: "Spring discounts week is starting!",
    slug: "bahorgi-chegirmalar",
    excerpt: "Barcha badiiy adabiyotlar uchun 30% lik vaucherlarni qo'lga kiriting. Shoshiling, vaqt cheklangan.",
    excerptRu: "Получите ваучеры со скидкой 30% на всю художественную литературу. Торопитесь, время ограничено.",
    excerptEn: "Get 30% discount vouchers for all fiction. Hurry up, time is limited.",
    content: "Batafsil ma'lumot...",
    contentRu: "Подробная информация...",
    contentEn: "Detailed information...",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1890",
    category: "event",
    categoryLabel: "Aksiya",
    categoryLabelRu: "Акция",
    categoryLabelEn: "Promo",
    tags: ["chegirma", "aksiya"],
    views: 2341,
    likes: 156,
    publishedAt: "2026-02-25T14:30:00Z",
    author: {
      _id: "a3",
      name: "Jasur Tursunov",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887"
    },
    isFeatured: false,
    isActive: true
  },
  {
    _id: "n4",
    title: "Yangi yil aksiyasi: 50% chegirma!",
    titleRu: "Новогодняя акция: скидка 50%!",
    titleEn: "New Year promotion: 50% discount!",
    slug: "yangi-yil-aksiyasi",
    excerpt: "Yangi yil munosabati bilan barcha kitoblarga 50% chegirma. Faqat 10 kun!",
    excerptRu: "В честь Нового года скидка 50% на все книги. Всего 10 дней!",
    excerptEn: "Celebrating New Year with 50% discount on all books. Only 10 days!",
    content: "Batafsil ma'lumot...",
    contentRu: "Подробная информация...",
    contentEn: "Detailed information...",
    image: "https://images.unsplash.com/photo-1512386233331-f023884a92e8?q=80&w=1887",
    category: "promo",
    categoryLabel: "Promo",
    categoryLabelRu: "Промо",
    categoryLabelEn: "Promo",
    tags: ["aksiya", "chegirma", "yangi-yil"],
    views: 3456,
    likes: 234,
    publishedAt: "2026-02-20T10:00:00Z",
    author: {
      _id: "a4",
      name: "BOOK.UZ Team",
    },
    isFeatured: true,
    isActive: true
  },
  {
    _id: "n5",
    title: "Blog: Kitob o'qishning foydalari",
    titleRu: "Блог: Польза чтения книг",
    titleEn: "Blog: Benefits of reading books",
    slug: "kitob-oqish-foydalari",
    excerpt: "Nima uchun kitob o'qish inson hayotida muhim rol o'ynaydi?",
    excerptRu: "Почему чтение книг играет важную роль в жизни человека?",
    excerptEn: "Why does reading books play an important role in human life?",
    content: "Batafsil ma'lumot...",
    contentRu: "Подробная информация...",
    contentEn: "Detailed information...",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1887",
    category: "blog",
    categoryLabel: "Blog",
    categoryLabelRu: "Блог",
    categoryLabelEn: "Blog",
    tags: ["blog", "kitob", "foydalar"],
    views: 567,
    likes: 45,
    publishedAt: "2026-02-18T14:30:00Z",
    author: {
      _id: "a5",
      name: "Aziza Karimova",
      avatar: "https://images.unsplash.com/photo-1494790108777-9f8e60874d8b?q=80&w=1887"
    },
    isFeatured: false,
    isActive: true
  },
  {
    _id: "n6",
    title: "Audio kitoblar: Endi 500+ yangi nomlar",
    titleRu: "Аудиокниги: теперь 500+ новых названий",
    titleEn: "Audiobooks: Now 500+ new titles",
    slug: "audio-kitoblar-yangilari",
    excerpt: "Audio kitoblar kolleksiyamiz 500 ta yangi nom bilan to'ldirildi.",
    excerptRu: "Наша коллекция аудиокниг пополнилась 500 новыми названиями.",
    excerptEn: "Our audiobook collection has been updated with 500 new titles.",
    content: "Batafsil ma'lumot...",
    contentRu: "Подробная информация...",
    contentEn: "Detailed information...",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1887",
    category: "update",
    categoryLabel: "Yangilanish",
    categoryLabelRu: "Обновление",
    categoryLabelEn: "Update",
    tags: ["audio", "yangi"],
    views: 789,
    likes: 67,
    publishedAt: "2026-02-15T09:00:00Z",
    author: {
      _id: "a6",
      name: "BOOK.UZ Team",
    },
    isFeatured: false,
    isActive: true
  }
];

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1
  });

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
    loadNews();
  }, [pagination.page]);

  const loadNews = async () => {
    try {
      setLoading(true);
      // API dan yangiliklarni olish
      const response = await api.get(`/news?active=true&page=${pagination.page}&limit=${pagination.limit}`);
      
      if (response.data?.success && response.data.data?.length > 0) {
        // Admin qo'shgan yangiliklar
        setNews(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
          pages: Math.ceil((response.data.total || 0) / prev.limit)
        }));
      } else {
        // Mock ma'lumotlar
        setNews(mockNews);
        setPagination(prev => ({
          ...prev,
          total: mockNews.length,
          pages: Math.ceil(mockNews.length / prev.limit)
        }));
      }
    } catch (error) {
      console.error("Yangiliklar yuklanmadi:", error);
      setNews(mockNews);
      setPagination(prev => ({
        ...prev,
        total: mockNews.length,
        pages: Math.ceil(mockNews.length / prev.limit)
      }));
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "Barchasi", icon: <Megaphone size={14} /> },
    { id: "update", label: "Yangilanishlar", icon: <Sparkles size={14} /> },
    { id: "new_book", label: "Yangi kitoblar", icon: <Newspaper size={14} /> },
    { id: "event", label: "Aksiyalar", icon: <Tag size={14} /> },
    { id: "promo", label: "Promo", icon: <Zap size={14} /> },
    { id: "blog", label: "Blog", icon: <Heart size={14} /> },
  ];

  const filteredNews = news.filter(item => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Paginated news
  const paginatedNews = filteredNews.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  const getCategoryStyles = (category: string) => {
    switch(category) {
      case "update":
        return {
          bg: "bg-[#00a0e3]/10 dark:bg-blue-600/20",
          text: "text-[#00a0e3] dark:text-blue-400",
          icon: <Sparkles size={12} className="text-[#00a0e3] dark:text-blue-400" />
        };
      case "new_book":
        return {
          bg: "bg-[#ef7f1a]/10 dark:bg-orange-600/20",
          text: "text-[#ef7f1a] dark:text-orange-400",
          icon: <Newspaper size={12} className="text-[#ef7f1a] dark:text-orange-400" />
        };
      case "event":
        return {
          bg: "bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20",
          text: "text-[#00a0e3] dark:text-blue-400",
          icon: <Tag size={12} className="text-[#ef7f1a] dark:text-orange-400" />
        };
      case "promo":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-600 dark:text-purple-400",
          icon: <Zap size={12} className="text-purple-600 dark:text-purple-400" />
        };
      case "blog":
        return {
          bg: "bg-pink-100 dark:bg-pink-900/30",
          text: "text-pink-600 dark:text-pink-400",
          icon: <Heart size={12} className="text-pink-600 dark:text-pink-400" />
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-slate-700",
          text: "text-gray-600 dark:text-gray-400",
          icon: <Sparkles size={12} />
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const floatingIcons = [Sparkles, Star, Heart, Crown, Zap, Award, Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass, Headphones, Music, Newspaper, Megaphone];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#00a0e3]/20 border-t-[#00a0e3] rounded-full animate-spin mx-auto mb-4" />
            <Newspaper className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#00a0e3]" size={32} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Yangiliklar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
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

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full mb-4">
            <Megaphone size={16} className="text-[#00a0e3] dark:text-blue-400" />
            <span className="text-xs font-bold text-[#ef7f1a] dark:text-orange-400">BLOG & YANGILIKLAR</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a]">
              Barcha yangiliklar
            </span>
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">{' Platformamizdagi eng so\'nggi yangiliklar, yangi kitoblar va aksiyalardan xabardor bo\'ling '}</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Yangilik qidirish..."
                className="pl-10 h-12 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-[#00a0e3]"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] text-white shadow-lg scale-105"
                      : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#00a0e3]"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        {paginatedNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedNews.map((item, index) => {
                const styles = getCategoryStyles(item.category);
                
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => router.push(`/news/${item.slug}`)}
                    className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20 transition-all relative"
                  >
                    {/* Image */}
                    <div className="relative h-[200px] w-full overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-3 py-1 ${styles.bg} ${styles.text} rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm dark:backdrop-blur-md`}>
                          {styles.icon}
                          {item.categoryLabel}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {item.isFeatured && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                            <Star size={10} />
                            Tanlangan
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={10} className="text-gray-400 dark:text-gray-500" />
                          <span>{formatDate(item.publishedAt)}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                        <div className="flex items-center gap-1">
                          <Clock size={10} className="text-gray-400 dark:text-gray-500" />
                          <span>{Math.ceil(Math.random() * 5 + 2)} daq</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                        <div className="flex items-center gap-1">
                          <Eye size={10} className="text-gray-400 dark:text-gray-500" />
                          <span>{item.views}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#00a0e3] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {item.excerpt}
                      </p>

                      {/* Author */}
                      {item.author && (
                        <div className="flex items-center gap-2 pt-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00a0e3] to-[#ef7f1a] overflow-hidden flex items-center justify-center text-white text-xs font-bold">
                            {item.author.name.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{item.author.name}</span>
                        </div>
                      )}

                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ef7f1a] dark:text-orange-400 group-hover:gap-2 transition-all">{' Batafsil o\'qish '}<ArrowUpRight size={14} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:border-[#00a0e3] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} className="mx-auto" />
                </button>
                
                {[...Array(pagination.pages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                        className={`w-10 h-10 rounded-lg font-bold ${
                          pagination.page === pageNum
                            ? "bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] text-white"
                            : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#00a0e3]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    (pageNum === pagination.page - 2 && pagination.page > 3) ||
                    (pageNum === pagination.page + 2 && pagination.page < pagination.pages - 2)
                  ) {
                    return <span key={i} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:border-[#00a0e3] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} className="mx-auto" />
                </button>
              </div>
            )}
          </>
        ) : (
          // Empty State
          (<div className="text-center py-16">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mb-6">
              <Newspaper size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Yangilik topilmadi
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery ? `"${searchQuery}" bo'yicha hech qanday yangilik topilmadi` : "Hozircha yangiliklar yo'q"}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] text-white"
            >
              Filtrlarni tozalash
            </Button>
          </div>)
        )}

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-8 text-xs text-gray-400 dark:text-gray-500">
          <span>📰 {news.length}+ maqola</span>
          <span>📧 5K+ obunachi</span>
          <span>🔥 Haftada 3 yangilik</span>
        </div>
      </div>
    </div>
  );
}