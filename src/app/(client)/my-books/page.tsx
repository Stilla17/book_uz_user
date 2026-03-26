"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Headphones, 
  Download, 
  Clock, 
  Star, 
  ChevronRight,
  Search,
  Filter,
  Grid3x3,
  List,
  Heart,
  Package,
  Truck,
  Shield,
  Play,
  CheckCircle,
  ChevronDown,
  X,
  Sparkles,
  Crown,
  Zap,
  Award,
  Gem,
  Diamond,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Coffee,
  Compass
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/cards/BookCard";
import { toast } from "react-hot-toast";

interface PurchasedBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  image: string;
  format: "ebook" | "audio" | "paper";
  purchaseDate: string;
  progress?: number;
  isFavorite?: boolean;
  description?: string;
  duration?: string; // Audio kitob uchun
  pages?: number; // E-kitob uchun
}

export default function MyBooksPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<PurchasedBook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "ebook" | "audio" | "favorites">("all");
  const [sortBy, setSortBy] = useState<"recent" | "title" | "progress">("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState<PurchasedBook | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
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

  // Mock ma'lumotlar (API dan keladigan ma'lumotlar)
  const mockBooks: PurchasedBook[] = [
    {
      _id: "1",
      title: "Atomic Habits",
      author: "James Clear",
      price: 42000,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1888",
      format: "ebook",
      purchaseDate: "2024-02-15",
      progress: 75,
      isFavorite: true,
      description: "Kichik o'zgarishlar, ajoyib natijalar",
      pages: 320
    },
    {
      _id: "2",
      title: "Sariq devni minib",
      author: "Xudoyberdi To'xtaboyev",
      price: 45000,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887",
      format: "ebook",
      purchaseDate: "2024-02-10",
      progress: 100,
      isFavorite: false,
      pages: 256
    },
    {
      _id: "3",
      title: "Kichik shahzoda",
      author: "Antuan de Sent-Ekzyuperi",
      price: 32000,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887",
      format: "audio",
      purchaseDate: "2024-02-05",
      progress: 30,
      isFavorite: true,
      duration: "2 soat 15 min"
    },
    {
      _id: "4",
      title: "Stiv Jobs",
      author: "Uolter Ayzekson",
      price: 89000,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887",
      format: "ebook",
      purchaseDate: "2024-01-28",
      progress: 45,
      isFavorite: false,
      pages: 680
    },
    {
      _id: "5",
      title: "Boy ota, kambag'al ota",
      author: "Robert Kiyosaki",
      price: 35000,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1824",
      format: "ebook",
      purchaseDate: "2024-01-20",
      progress: 90,
      isFavorite: true,
      pages: 336
    },
    {
      _id: "6",
      title: "Shaytanat",
      author: "Tohir Malik",
      price: 68000,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=1935",
      format: "audio",
      purchaseDate: "2024-01-15",
      progress: 15,
      isFavorite: false,
      duration: "8 soat 45 min"
    },
    {
      _id: "7",
      title: "Dunyoning ishlari",
      author: "O'tkir Hoshimov",
      price: 28000,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887",
      format: "ebook",
      purchaseDate: "2024-01-10",
      progress: 60,
      isFavorite: true,
      pages: 224
    },
    {
      _id: "8",
      title: "Alkimyogar",
      author: "Paulo Koelo",
      price: 38000,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887",
      format: "audio",
      purchaseDate: "2024-01-05",
      progress: 80,
      isFavorite: false,
      duration: "4 soat 30 min"
    }
  ];

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    loadBooks();
  }, [isAuthenticated, authLoading, router]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      // Mock ma'lumotlar
      setTimeout(() => {
        setBooks(mockBooks);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Kitoblar yuklanmadi:", error);
      toast.error("Kitoblar yuklanmadi");
      setLoading(false);
    }
  };

  const handleToggleFavorite = (bookId: string) => {
    setBooks(books.map(book => 
      book._id === bookId 
        ? { ...book, isFavorite: !book.isFavorite } 
        : book
    ));
    
    const book = books.find(b => b._id === bookId);
    if (book?.isFavorite) {
      toast.success("Sevimlilardan o'chirildi");
    } else {
      toast.success("Sevimlilarga qo'shildi");
    }
  };

  const handleReadBook = (bookId: string, format: string) => {
    if (format === "audio") {
      router.push(`/audio/${bookId}`);
    } else {
      router.push(`/read/${bookId}`);
    }
  };

  const handleDownloadBook = (bookId: string) => {
    toast.success("Yuklab olish boshlandi");
  };

  const handleQuickView = (book: PurchasedBook) => {
    setSelectedBook(book);
    setShowQuickView(true);
  };

  // Filtrlash va qidirish
  const filteredBooks = books.filter(book => {
    if (filter === "ebook" && book.format !== "ebook") return false;
    if (filter === "audio" && book.format !== "audio") return false;
    if (filter === "favorites" && !book.isFavorite) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return book.title.toLowerCase().includes(query) || 
             book.author.toLowerCase().includes(query);
    }
    
    return true;
  });

  // Sortirovka
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "progress") {
      return (b.progress || 0) - (a.progress || 0);
    }
    return 0;
  });

  const getFormatIcon = (format: string) => {
    switch(format) {
      case "audio": return <Headphones size={14} className="text-[#FF8A00] dark:text-orange-400" />;
      case "ebook": return <BookOpen size={14} className="text-[#005CB9] dark:text-blue-400" />;
      default: return <BookOpen size={14} className="text-gray-400 dark:text-gray-500" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500 dark:bg-green-600";
    if (progress >= 75) return "bg-[#005CB9] dark:bg-blue-500";
    if (progress >= 50) return "bg-[#FF8A00] dark:bg-orange-500";
    if (progress >= 25) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-gray-300 dark:bg-gray-600";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Floating icons array
  const floatingIcons = [BookOpen, Sparkles, Star, Heart, Crown, Zap, Award, Gem, Diamond, Flower2, Sun, Moon, Cloud, Coffee, Compass];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => {
            const IconComponent = floatingIcons[i % floatingIcons.length];
            const randomTop = Math.random() * 100;
            const randomLeft = Math.random() * 100;
            const randomFontSize = Math.random() * 40 + 20;
            
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

        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#005CB9]/20 dark:border-blue-400/20 border-t-[#005CB9] dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
            <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#005CB9] dark:text-blue-400" size={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Kitoblar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        {[...Array(25)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          const randomTop = Math.random() * 100;
          const randomLeft = Math.random() * 100;
          const randomFontSize = Math.random() * 40 + 20;
          
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

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="p-3 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-2xl"
            >
              <BookOpen size={28} className="text-[#005CB9] dark:text-blue-400" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-black"
              >
                <span className="text-[#005CB9] dark:text-blue-400">Mening</span>
                <span className="text-[#FF8A00] dark:text-orange-400"> kitoblarim</span>
              </motion.h1>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"
              >
                <span className="font-bold text-[#005CB9] dark:text-blue-400">{books.length}</span> ta kitob
              </motion.p>
            </div>
          </div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              href="/catalog" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white rounded-xl hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all text-sm font-bold"
            >
              <BookOpen size={16} />
              Yangi kitob sotib olish
            </Link>
          </motion.div>
        </motion.div>

        {/* Search and Filters with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Kitob nomi yoki muallif..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl text-gray-700 dark:text-gray-300"
            >
              <Filter size={16} />
              Filtrlar
              <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Filter Tabs */}
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-2`}>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {[
                  { id: "all", label: "Hammasi", count: books.length },
                  { id: "ebook", label: "E-kitoblar", count: books.filter(b => b.format === "ebook").length, icon: <BookOpen size={14} /> },
                  { id: "audio", label: "Audio kitoblar", count: books.filter(b => b.format === "audio").length, icon: <Headphones size={14} /> },
                  { id: "favorites", label: "Sevimlilar", count: books.filter(b => b.isFavorite).length, icon: <Heart size={14} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                      filter === tab.id
                        ? "bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {tab.icon}
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort and View */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">Saralash:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300"
              >
                <option value="recent">Oxirgi qo'shilgan</option>
                <option value="title">Nomi bo'yicha</option>
                <option value="progress">O'qish holati</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" 
                    ? "bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white shadow-md" 
                    : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
                title="Katakcha ko'rinishi"
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list" 
                    ? "bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white shadow-md" 
                    : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
                title="Ro'yxat ko'rinishi"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Books Grid/List with animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {sortedBooks.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {sortedBooks.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.7 }}
                    whileHover={{ y: -5 }}
                    className="relative group"
                  >
                    <div className="cursor-pointer" onClick={() => handleQuickView(book)}>
                      <BookCard book={book} />
                    </div>
                    
                    {/* Progress Bar */}
                    {book.format === "ebook" && book.progress !== undefined && (
                      <div className="absolute bottom-16 left-3 right-3">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(book.progress)} transition-all`}
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[8px] text-gray-400 dark:text-gray-500">O'qilgan: {book.progress}%</span>
                          {book.progress === 100 && (
                            <span className="text-[8px] text-green-600 dark:text-green-400 font-bold flex items-center gap-0.5">
                              <CheckCircle size={8} />
                              Tugatilgan
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Audio Progress */}
                    {book.format === "audio" && book.progress !== undefined && (
                      <div className="absolute bottom-16 left-3 right-3">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#FF8A00] dark:bg-orange-500 transition-all"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[8px] text-gray-400 dark:text-gray-500">Tinglangan: {book.progress}%</span>
                          {book.duration && (
                            <span className="text-[8px] text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
                              <Clock size={8} />
                              {book.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => handleToggleFavorite(book._id)}
                        className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${
                          book.isFavorite 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-white dark:bg-slate-700 text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                        }`}
                        title={book.isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                      >
                        <Heart size={14} fill={book.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => handleDownloadBook(book._id)}
                        className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg text-gray-400 dark:text-gray-400 hover:text-[#005CB9] dark:hover:text-blue-400 transition-all hover:scale-110"
                        title="Yuklab olish"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                    
                    {/* Read/Listen Button */}
                    <button
                      onClick={() => handleReadBook(book._id, book.format)}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100 hover:shadow-xl"
                      title={book.format === "audio" ? "Tinglash" : "O'qish"}
                    >
                      {book.format === "audio" ? <Headphones size={16} /> : <BookOpen size={16} />}
                    </button>
                    
                    {/* Format Badge */}
                    <div className="absolute top-2 left-2">
                      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm border border-gray-100 dark:border-slate-700">
                        {getFormatIcon(book.format)}
                        <span className="text-gray-700 dark:text-gray-300">
                          {book.format === "audio" ? "Audio" : "E-kitob"}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm border border-gray-100 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">{book.rating}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // List View
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                {sortedBooks.map((book, index) => (
                  <motion.div 
                    key={book._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.7 }}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                    className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                      index !== sortedBooks.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''
                    }`}
                    onClick={() => handleQuickView(book)}
                  >
                    {/* Cover */}
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md group">
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{book.title}</h3>
                        {book.isFavorite && (
                          <Heart size={12} className="text-red-500 fill-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
                      
                      {/* Meta info */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                          {getFormatIcon(book.format)}
                          <span>{book.format === "audio" ? "Audio kitob" : "Elektron kitob"}</span>
                        </div>
                        {book.format === "ebook" && book.pages && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                            <BookOpen size={10} />
                            {book.pages} bet
                          </div>
                        )}
                        {book.format === "audio" && book.duration && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                            <Clock size={10} />
                            {book.duration}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                          <Star size={10} className="text-yellow-500" />
                          {book.rating}
                        </div>
                      </div>
                      
                      {/* Progress */}
                      {book.progress !== undefined && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getProgressColor(book.progress)}`}
                              style={{ width: `${book.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">{book.progress}%</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(book._id);
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          book.isFavorite 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400'
                        }`}
                      >
                        <Heart size={18} fill={book.isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadBook(book._id);
                        }}
                        className="p-2 text-gray-300 dark:text-gray-600 hover:text-[#005CB9] dark:hover:text-blue-400"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReadBook(book._id, book.format);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all flex items-center gap-1"
                      >
                        {book.format === "audio" ? (
                          <>
                            <Play size={14} />
                            Tinglash
                          </>
                        ) : (
                          <>
                            <BookOpen size={14} />
                            O'qish
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            // Empty State with animation
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={48} className="text-[#005CB9] dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Kitoblar yo'q</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Siz hali hech qanday kitob sotib olmagansiz. Katalogdan o'zingizga yoqqan kitoblarni toping va kutubxonangizni boyiting.
              </p>
              <Link 
                href="/catalog" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white font-bold rounded-xl hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
              >
                <BookOpen size={18} />
                Katalogga o'tish
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Info Icons with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 grid grid-cols-3 gap-2 text-center text-xs"
        >
          <div className="p-2">
            <Truck size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">Bepul yetkazish</span>
          </div>
          <div className="p-2">
            <Shield size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">Xavfsiz to'lov</span>
          </div>
          <div className="p-2">
            <Package size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">24/7 qo'llab-quvvatlash</span>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal with animation */}
      <AnimatePresence>
        {showQuickView && selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">{selectedBook.title}</h2>
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-48 h-64 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                    <Image
                      src={selectedBook.image}
                      alt={selectedBook.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedBook.author}</p>
                    {selectedBook.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedBook.description}</p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900 dark:text-white">{selectedBook.rating}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getFormatIcon(selectedBook.format)}
                        <span className="text-gray-700 dark:text-gray-300">
                          {selectedBook.format === "audio" ? "Audio kitob" : "Elektron kitob"}
                        </span>
                      </div>
                      
                      {selectedBook.format === "ebook" && selectedBook.pages && (
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedBook.pages} bet</span>
                        </div>
                      )}
                      
                      {selectedBook.format === "audio" && selectedBook.duration && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedBook.duration}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Sotib olingan: {formatDate(selectedBook.purchaseDate)}
                        </span>
                      </div>
                      
                      {selectedBook.progress !== undefined && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">
                              {selectedBook.format === "audio" ? "Tinglangan" : "O'qilgan"}
                            </span>
                            <span className="font-bold text-[#005CB9] dark:text-blue-400">{selectedBook.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getProgressColor(selectedBook.progress)}`}
                              style={{ width: `${selectedBook.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleReadBook(selectedBook._id, selectedBook.format)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                      >
                        {selectedBook.format === "audio" ? "Tinglash" : "O'qish"}
                      </button>
                      <button
                        onClick={() => handleDownloadBook(selectedBook._id)}
                        className="px-4 py-3 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}