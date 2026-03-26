// components/cards/BookCard.tsx
"use client";
import Image from "next/image";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface Book {
  _id: string;
  title: string | { uz: string; ru: string; en: string }; // title object yoki string bo'lishi mumkin
  author: string | { name: string }; // author object yoki string bo'lishi mumkin
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount?: number;
  image?: string; // optional qilish
  discount?: number;
  isNew?: boolean;
  isHit?: boolean;
  isFree?: boolean;
  format?: "ebook" | "audio" | "paper";
}

export const BookCard = ({ book }: { book: Book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Kitob nomini olish (title object bo'lsa, uz ni olish)
  const getBookTitle = () => {
    if (!book.title) return "Noma'lum kitob";
    if (typeof book.title === 'string') return book.title;
    return book.title.uz || book.title.ru || book.title.en || "Noma'lum kitob";
  };

  // Muallif ismini olish
  const getAuthorName = () => {
    if (!book.author) return "Noma'lum muallif";
    if (typeof book.author === 'string') return book.author;
    return (book.author as any).name || "Noma'lum muallif";
  };

  // Rasm URL ni olish
  const getImageSrc = () => {
    if (!book.image || book.image === '') return null;
    return book.image;
  };

  // Fallback images
  const fallbackImages = [
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887",
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1887"
  ];

  // imageError bo'lsa yoki rasm bo'lmasa, random fallback image
  const imageSrc = imageError || !book.image || book.image === ''
    ? fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
    : book.image;

  // Format belgisi
  const getFormatIcon = () => {
    switch(book.format) {
      case "audio": return "🎧";
      case "ebook": return "📱";
      case "paper": return "📖";
      default: return "📚";
    }
  };

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl h-[400px] animate-pulse" />
    );
  }

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 p-3 rounded-xl hover:shadow-xl transition-all duration-300 group relative flex flex-col h-full border border-gray-100 dark:border-slate-700 hover:border-[#00a0e3]/20 dark:hover:border-[#ef7f1a]/30"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      
      {/* Badges */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
        {book.isHit && (
          <span className="bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase shadow-sm flex items-center gap-1">
            <span className="text-xs">🔥</span> Хит
          </span>
        )}
        {book.isNew && (
          <span className="bg-gradient-to-r from-[#ef7f1a] to-[#00a0e3] dark:from-orange-600 dark:to-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase shadow-sm flex items-center gap-1">
            <span className="text-xs">✨</span> Yangi
          </span>
        )}
        {book.isFree && (
          <span className="bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase shadow-sm">
            Bepul
          </span>
        )}
      </div>

      {/* Book Cover */}
      <div className="relative h-[230px] w-full mb-3 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={getBookTitle()}
            fill
            sizes="(max-width: 768px) 100vw, 200px"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/10 dark:to-orange-600/10">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Overlay on Hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#00a0e3]/60 to-[#ef7f1a]/60 dark:from-blue-600/60 dark:to-orange-600/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        >
          <button className="p-2 bg-white dark:bg-slate-700 rounded-full hover:bg-[#00a0e3] dark:hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 shadow-lg">
            <Eye size={18} className="text-gray-700 dark:text-gray-300" />
          </button>
          <button 
            className={`p-2 rounded-full transition-all transform hover:scale-110 shadow-lg ${
              isBookmarked 
                ? 'bg-[#ef7f1a] dark:bg-orange-600 text-white' 
                : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-[#ef7f1a] dark:hover:bg-orange-600 hover:text-white'
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Heart size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </motion.div>

        {/* Format Badge */}
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-gray-200 dark:border-slate-600">
          <span className={book.format === "audio" ? "text-[#00a0e3] dark:text-blue-400" : "text-[#ef7f1a] dark:text-orange-400"}>
            {getFormatIcon()}
          </span>
        </div>

        {/* Discount Badge */}
        {book.discount && (
          <div className="absolute bottom-2 left-2">
            <div className="relative">
              <div className="bg-gradient-to-r from-[#ef7f1a] to-[#00a0e3] dark:from-orange-600 dark:to-blue-600 text-white text-[12px] font-black px-2 py-1 rounded transform -skew-x-6 shadow-md">
                -{book.discount}%
              </div>
              <div className="absolute -bottom-1 left-2 w-2 h-2 bg-[#00a0e3] dark:bg-blue-600 transform rotate-45"></div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow space-y-2">
        <h3 className="font-bold text-[15px] leading-snug line-clamp-2 text-gray-900 dark:text-white group-hover:text-[#00a0e3] dark:group-hover:text-blue-400 transition-colors">
          {getBookTitle()}
        </h3>
        
        <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-[#ef7f1a] dark:bg-orange-400 rounded-full"></span>
          {getAuthorName()}
        </p>
        
        {/* Rating */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((star) => (
              <Star 
                key={star}
                size={14} 
                className={star <= Math.round(book.rating || 0) 
                  ? "text-[#ef7f1a] dark:text-orange-400" 
                  : "text-gray-300 dark:text-gray-600"
                } 
                fill={star <= Math.round(book.rating || 0) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-[12px] font-bold text-[#00a0e3] dark:text-blue-400">{book.rating || 0}</span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            ({book.reviewsCount || Math.floor(Math.random() * 1000) + 100})
          </span>
        </div>

        {/* Price Section */}
        <div className="pt-3 mt-auto border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-end justify-between">
            <div>
              {book.oldPrice && (
                <span className="text-[11px] text-gray-400 dark:text-gray-500 line-through block leading-none">
                  {book.oldPrice.toLocaleString()} so'm
                </span>
              )}
              <motion.div 
                className="flex items-baseline gap-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-[18px] font-black text-[#00a0e3] dark:text-blue-400">
                  {(book.price || 0).toLocaleString()}
                </span>
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">so'm</span>
              </motion.div>
            </div>
            
            <motion.button 
              className="p-2.5 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white rounded-xl hover:from-[#ef7f1a] hover:to-[#00a0e3] dark:hover:from-orange-600 dark:hover:to-blue-600 transition-all transform active:scale-90 shadow-md hover:shadow-lg flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={18} />
              <span className="hidden md:inline text-xs font-medium">Savatga</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick add tooltip */}
      <motion.div 
        className="absolute -top-2 right-12 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white text-xs py-1 px-2 rounded-md opacity-0 pointer-events-none"
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 5
        }}
      >
        Tez sotib olish
        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-[#ef7f1a] dark:bg-orange-600 transform rotate-45"></div>
      </motion.div>
    </motion.div>
  );
};