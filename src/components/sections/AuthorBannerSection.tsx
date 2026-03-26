"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookSection } from "./BookSection";
import { Book } from "@/types";
import { 
  Quote, 
  BookOpen, 
  ChevronRight, 
  Award,
  Sparkles,
  Star,
  Heart,
  Crown,
  Zap,
  Gem,
  Diamond,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Coffee,
  Compass,
  Feather,
  Leaf
} from "lucide-react";
import { userBannerService, UserBanner } from "@/services/userBanner.service";
import { bookService } from "@/services/book.service"; // TO'G'RI IMPORT!

interface AuthorBannerProps {
  authorId?: string;
}

export const AuthorBannerSection = ({ authorId }: AuthorBannerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [banner, setBanner] = useState<UserBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchAuthorBanner = async () => {
      try {
        setLoading(true);
        const banners = await userBannerService.getAuthorBanners();
        
        // Agar authorId berilgan bo'lsa, shu author uchun banner topish
        if (authorId && banners.length > 0) {
          const authorBanner = banners.find(b => b.author?.authorId === authorId);
          if (authorBanner) {
            setBanner(authorBanner);
            // Banner topilganda, shu authorning kitoblarini yuklash
            if (authorBanner.author?.authorId) {
              fetchAuthorBooks(authorBanner.author.authorId);
            }
          } else {
            setBanner(banners[0] || null);
            if (banners[0]?.author?.authorId) {
              fetchAuthorBooks(banners[0].author.authorId);
            }
          }
        } else {
          // Agar authorId berilmagan bo'lsa, birinchi author bannerni olish
          setBanner(banners[0] || null);
          if (banners[0]?.author?.authorId) {
            fetchAuthorBooks(banners[0].author.authorId);
          }
        }
      } catch (error) {
        console.error("Error fetching author banner:", error);
        setBanner(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorBanner();
  }, [authorId]);

  // Muallifning kitoblarini yuklash
  const fetchAuthorBooks = async (authorId: string) => {
    try {
      setBooksLoading(true);
      // Backenddan shu muallifning kitoblarini olish
      const response = await bookService.getBooksByAuthor(authorId);
      setAuthorBooks(response.books || []);
    } catch (error) {
      console.error("Error fetching author books:", error);
      setAuthorBooks([]);
    } finally {
      setBooksLoading(false);
    }
  };

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

  if (loading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-[50px] overflow-hidden bg-gradient-to-r from-gray-300 to-gray-200 dark:from-slate-800 dark:to-slate-800 animate-pulse" />
        </div>
      </section>
    );
  }

  if (!banner || !banner.author) {
    return null;
  }

  const { author } = banner;
  
  // Fallback image
  const imageSrc = imageError 
    ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2000" 
    : banner.imageUrl;

  const handleBannerClick = (link?: string) => {
    userBannerService.trackClick(banner._id);
    if (link) {
      window.location.href = link;
    }
  };

  // Floating icons array
  const floatingIcons = [Sparkles, Star, Heart, Crown, Zap, Award, Gem, Diamond, Flower2, Sun, Moon, Cloud, Coffee, Compass, Feather, Leaf, BookOpen, Quote];

  return (
    <motion.section 
      className="relative bg-white dark:bg-slate-900 overflow-hidden py-8 md:py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
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
      </div>

      <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
        <motion.div 
          className="relative w-full h-[400px] md:h-[500px] rounded-[50px] overflow-hidden mb-0 shadow-2xl group dark:shadow-2xl dark:shadow-[#00a0e3]/20"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          style={{ y }}
        >
          <motion.div 
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 8 }}
          >
            <Image
              src={imageSrc}
              alt={author.name || ''}
              fill
              className="object-cover"
              priority
              onError={() => setImageError(true)}
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent dark:from-slate-900/95 dark:via-slate-900/80" />
          
          <div className="absolute top-10 right-10 opacity-10">
            <Quote size={120} className="text-white dark:text-slate-400" />
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 text-white">
            <motion.div 
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="px-3 py-1 bg-white/20 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-sm font-medium border border-white/30 dark:border-slate-600">
                Tavsiya etilgan muallif
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 backdrop-blur-md rounded-full text-sm font-medium flex items-center gap-1">
                <Award size={14} />
                Top Author
              </span>
            </motion.div>
            
            <motion.h2 
              className="text-5xl md:text-7xl font-black mb-3 tracking-tight text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {author.name}
            </motion.h2>
            
            {author.shortBio?.uz && (
              <motion.p 
                className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 mb-4 font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {author.shortBio.uz}
              </motion.p>
            )}
            
            <motion.div 
              className="flex flex-wrap gap-6 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {author.birthYear && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-sm">📅</span>
                  </div>
                  <span className="text-sm font-medium text-white/90">
                    {author.birthYear} - {author.deathYear || 'h.v'}
                  </span>
                </div>
              )}
              
              {author.country && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-sm">📍</span>
                  </div>
                  <span className="text-sm font-medium text-white/90">{author.country}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <BookOpen size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-white/90">{author.booksCount || 0} ta asar</span>
              </div>
            </motion.div>
            
            {banner.description?.uz && (
              <motion.p 
                className="max-w-2xl text-lg md:text-xl text-gray-100 dark:text-gray-300 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {banner.description.uz}
              </motion.p>
            )}
            
            {banner.buttonText?.uz && (
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button 
                  onClick={() => handleBannerClick(banner.buttonLink)}
                  className="group bg-white text-black dark:bg-slate-800 dark:text-white font-extrabold py-4 px-10 rounded-2xl hover:bg-gradient-to-r hover:from-[#00a0e3] hover:to-[#ef7f1a] hover:text-white dark:hover:from-blue-600 dark:hover:to-orange-600 transition-all duration-300 shadow-xl flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {banner.buttonText.uz}
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Kitoblar bo'limi */}
        {authorBooks.length > 0 && (
          <div className="mt-12">
            <BookSection 
              title={`${author.name} asarlari`} 
              subtitle="Muallifning eng mashhur kitoblari"
              books={authorBooks}
              type="author"
              viewAllLink={banner.buttonLink || `/author/${author.authorId}`}
            />
          </div>
        )}

        {/* Agar authorBooks bo'lmasa va banner.selectedBooks to'liq obyekt bo'lsa */}
        {authorBooks.length === 0 && banner.selectedBooks && banner.selectedBooks.length > 0 && (
          <div className="mt-12">
            <BookSection 
              title={`${author.name} asarlari`} 
              subtitle="Muallifning eng mashhur kitoblari"
              books={banner.selectedBooks as any}
              type="author"
              viewAllLink={banner.buttonLink || `/author/${author.authorId}`}
            />
          </div>
        )}
      </div>
    </motion.section>
  );
};