// app/news/[slug]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  ArrowLeft,
  Megaphone, 
  Sparkles, 
  Newspaper, 
  Clock, 
  Tag, 
  Star, 
  Heart, 
  Eye,
  ChevronRight,
  Share2,
  ThumbsUp,
  MessageCircle
} from "lucide-react";
import { api } from "@/services/api";
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
}

// Mock ma'lumotlar
const mockNews: Record<string, NewsItem> = {
  "mobil-ilova-yangilanishi": {
    _id: "n1",
    title: "Mobil ilovamiz endi yanada tezroq va qulayroq!",
    titleRu: "Наше мобильное приложение теперь быстрее и удобнее!",
    titleEn: "Our mobile app is now faster and more convenient!",
    slug: "mobil-ilova-yangilanishi",
    excerpt: "Interfeysni to'liq yangiladik, endi audio kitoblarni oflayn yuklash tizimi 2 barobar tez ishlaydi.",
    excerptRu: "Мы полностью обновили интерфейс, теперь система офлайн-загрузки аудиокниг работает в 2 раза быстрее.",
    excerptEn: "We've completely updated the interface, now the offline audiobook download system works 2 times faster.",
    content: `
      <h2>Yangi imkoniyatlar</h2>
      <p>Mobil ilovamizning yangi versiyasida sizni quyidagi imkoniyatlar kutmoqda:</p>
      <ul>
        <li>Audio kitoblarni oflayn yuklash 2 barobar tezlashdi</li>
        <li>Yangi va zamonaviy interfeys</li>
        <li>Kitoblarni saqlash va sinxronlash yaxshilandi</li>
        <li>Kecha rejimi endi yanada qulay</li>
      </ul>
      <p>Ilovani hoziroq yangilang va barcha yangiliklardan bahramand bo'ling!</p>
    `,
    contentRu: "Подробная информация...",
    contentEn: "Detailed information...",
    image: "https://images.unsplash.com/photo-1551288560-19973648e19c?q=80&w=2070",
    category: "update",
    categoryLabel: "Yangilanish",
    tags: ["mobil", "yangilanish"],
    views: 1240,
    likes: 89,
    publishedAt: "2026-03-02T10:00:00Z",
    author: {
      _id: "a1",
      name: "BOOK.UZ Team",
    },
    isFeatured: true
  },
  "atomic-habits-ozbek-tilida": {
    _id: "n2",
    title: "James Clear'ning 'Atomic Habits' kitobi o'zbek tilida!",
    titleRu: "Книга Джеймса Клира 'Атомные привычки' на узбекском языке!",
    titleEn: "James Clear's 'Atomic Habits' book is now in Uzbek!",
    slug: "atomic-habits-ozbek-tilida",
    excerpt: "Dunyoga mashhur bestseller endi bizning kutubxonamizda ham qog'oz, ham audio formatda mavjud.",
    excerptRu: "Всемирно известный бестселлер теперь доступен в нашей библиотеке как в бумажном, так и в аудиоформате.",
    excerptEn: "The world-famous bestseller is now available in our library in both paper and audio formats.",
    content: `
      <h2>"Atomic Habits" o'zbek tilida!</h2>
      <p>Jeyms Klirning dunyoga mashhur "Atom odatlar" kitobi endi o'zbek tilida mavjud. Kitobda kichik o'zgarishlar qanday qilib katta natijalarga olib kelishi haqida so'z boradi.</p>
      <p>Kitobni bizning ilovada yoki veb-saytda sotib olishingiz mumkin:</p>
      <ul>
        <li>Qog'oz nusxa: 59,000 so'm</li>
        <li>Elektron kitob: 29,000 so'm</li>
        <li>Audio kitob: 39,000 so'm</li>
      </ul>
    `,
    contentRu: "Подробная информация...",
    contentEn: "Detailed information...",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887",
    category: "new_book",
    categoryLabel: "Yangi Kitob",
    tags: ["atomic-habits", "yangi-kitob"],
    views: 892,
    likes: 67,
    publishedAt: "2026-02-28T09:00:00Z",
    author: {
      _id: "a2",
      name: "Madina Rahimova",
    },
    isFeatured: true
  }
};

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    loadNews();
  }, [slug]);

  const loadNews = async () => {
    try {
      setLoading(true);
      
      // API dan yangilikni olish
      const response = await api.get(`/news/${slug}`);
      
      if (response.data?.success && response.data.data) {
        setNews(response.data.data);
        // Ko'rishlar sonini yangilash
        await api.post(`/news/${slug}/view`);
      } else {
        // Mock ma'lumotlardan olish
        const mockItem = mockNews[slug];
        if (mockItem) {
          setNews(mockItem);
        } else {
          // Topilmasa 404
          router.push('/404');
        }
      }

      // Related news
      const relatedResponse = await api.get(`/news?related=${slug}&limit=3`);
      if (relatedResponse.data?.success) {
        setRelatedNews(relatedResponse.data.data);
      }
    } catch (error) {
      console.error("Yangilik yuklanmadi:", error);
      // Mock ma'lumotlardan olish
      const mockItem = mockNews[slug];
      if (mockItem) {
        setNews(mockItem);
      } else {
        router.push('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`/news/${slug}/like`);
      setNews(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    } catch (error) {
      console.error("Xatolik yuz berdi");
    }
  };

  const getCategoryStyles = (category: string) => {
    switch(category) {
      case "update":
        return {
          bg: "bg-[#00a0e3]/10",
          text: "text-[#00a0e3]",
          icon: <Sparkles size={14} className="text-[#00a0e3]" />
        };
      case "new_book":
        return {
          bg: "bg-[#ef7f1a]/10",
          text: "text-[#ef7f1a]",
          icon: <Newspaper size={14} className="text-[#ef7f1a]" />
        };
      case "event":
        return {
          bg: "bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10",
          text: "text-[#00a0e3]",
          icon: <Tag size={14} className="text-[#ef7f1a]" />
        };
      case "promo":
        return {
          bg: "bg-purple-100",
          text: "text-purple-600",
          icon: <Sparkles size={14} className="text-purple-600" />
        };
      case "blog":
        return {
          bg: "bg-pink-100",
          text: "text-pink-600",
          icon: <Heart size={14} className="text-pink-600" />
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          icon: <Sparkles size={14} />
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00a0e3]/20 border-t-[#00a0e3] rounded-full animate-spin" />
      </div>
    );
  }

  if (!news) {
    return null;
  }

  const styles = getCategoryStyles(news.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#00a0e3] dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Orqaga</span>
        </motion.button>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden"
        >
          {/* Image */}
          <div className="relative h-[300px] md:h-[400px] w-full">
            <Image 
              src={news.image} 
              alt={news.title} 
              fill 
              className="object-cover" 
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 ${styles.bg} ${styles.text} rounded-full text-xs font-bold flex items-center gap-1`}>
                {styles.icon}
                {news.categoryLabel}
              </span>
              
              {news.isFeatured && (
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Star size={12} />
                  Tanlangan
                </span>
              )}

              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={12} />
                <span>{formatDate(news.publishedAt)}</span>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Eye size={12} />
                <span>{news.views}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4">
              {news.title}
            </h1>

            {/* Author */}
            {news.author && (
              <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00a0e3] to-[#ef7f1a] flex items-center justify-center text-white font-bold">
                  {news.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{news.author.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Muallif</p>
                </div>
              </div>
            )}

            {/* Excerpt */}
            <div className="mb-6 p-4 bg-[#00a0e3]/5 dark:bg-blue-600/10 rounded-xl border-l-4 border-[#00a0e3] dark:border-blue-400">
              <p className="text-gray-700 dark:text-gray-300 italic">
                {news.excerpt}
              </p>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Teglar:</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-xs text-gray-600 dark:text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-[#00a0e3]/10 hover:text-[#00a0e3] dark:hover:text-blue-400 transition-colors"
              >
                <ThumbsUp size={16} />
                <span className="text-sm font-medium">{news.likes}</span>
              </button>
              
              <button
                onClick={() => {
                  navigator.share?.({
                    title: news.title,
                    text: news.excerpt,
                    url: window.location.href
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-[#ef7f1a]/10 hover:text-[#ef7f1a] dark:hover:text-orange-400 transition-colors"
              >
                <Share2 size={16} />
                <span className="text-sm font-medium">Ulashish</span>
              </button>
            </div>
          </div>
        </motion.article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{' O\'xshash yangiliklar '}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedNews.map((item) => {
                const itemStyles = getCategoryStyles(item.category);
                
                return (
                  <Link
                    key={item._id}
                    href={`/news/${item.slug}`}
                    className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all"
                  >
                    <div className="relative h-32 w-full overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover transition-transform group-hover:scale-110" 
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 text-[8px] text-gray-400 mb-1">
                        <span className={`px-2 py-0.5 ${itemStyles.bg} ${itemStyles.text} rounded-full`}>
                          {item.categoryLabel}
                        </span>
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}