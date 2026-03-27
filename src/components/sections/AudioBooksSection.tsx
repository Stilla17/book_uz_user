"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Headphones, Play, Pause, Clock, Heart, 
  ChevronRight, Star, Mic, Disc, Download,
  ChevronLeft, Volume2, X, Sparkles,
  Zap, Award, Crown, Gem, Flower2, Sun, Moon,
  Cloud, Coffee, Compass
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { toast } from "react-hot-toast";
import { audioBookService } from "@/services/audioBook.service";
import { AudioBook } from "@/types/audioBook.types";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface AudioBooksSectionProps {
  autoPlay?: boolean;
  title?: string;
  subtitle?: string;
  limit?: number;
  category?: string;
  hit?: boolean;
  new?: boolean;
  showCategories?: boolean;
}

export const AudioBooksSection = ({ 
  autoPlay = true,
  title = "Audio kitoblar",
  subtitle = "Eng sara audio asarlar",
  limit = 10,
  category,
  hit,
  new: isNew,
  showCategories = true
}: AudioBooksSectionProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [audioBooks, setAudioBooks] = useState<AudioBook[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [swiper, setSwiper] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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

  // Load audio books from backend
  useEffect(() => {
    const fetchAudioBooks = async () => {
      try {
        setLoading(true);
        const data = await audioBookService.getActiveAudioBooks(limit, category, hit, isNew);
        setAudioBooks(data);
      } catch (error) {
        console.error("Audio kitoblarni yuklashda xatolik:", error);
        setAudioBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioBooks();
  }, [limit, category, hit, isNew]);

  // Floating icons array
  const floatingIcons = [Sparkles, Zap, Award, Crown, Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass, Headphones, Star, Heart];

  const toggleBookmark = (id: string) => {
    setIsBookmarked(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePlay = (id: string, audioUrl?: string) => {
    if (playingId === id) {
      setPlayingId(null);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setPlayingId(id);
      setIsPlaying(true);
      if (audioUrl && audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    }
  };

  const handleDownload = async (id: string) => {
    const downloads = await audioBookService.incrementDownload(id);
    toast.success("Yuklab olish boshlandi");
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  const handlePrev = () => {
    if (swiper) swiper.slidePrev();
  };

  const handleNext = () => {
    if (swiper) swiper.slideNext();
  };

  // Get title in current language
  const getTitle = (book: AudioBook) => {
    return book.title.uz || book.title.ru || book.title.en || "Noma'lum";
  };

  const getAuthor = (book: AudioBook) => {
    return book.author.uz || book.author.ru || book.author.en || "Noma'lum muallif";
  };

  const getNarrator = (book: AudioBook) => {
    return book.narrator.uz || book.narrator.ru || book.narrator.en || "Noma'lum diktor";
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => {
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
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-48 bg-gradient-to-r from-[#00a0e3]/20 to-[#ef7f1a]/20 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full animate-pulse"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-[#00a0e3]/20 dark:bg-blue-600/20 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-[#ef7f1a]/20 dark:bg-orange-600/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-[240px] bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/10 dark:to-orange-600/10 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (audioBooks.length === 0) return null;

  const currentBook = audioBooks.find(b => b._id === playingId);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden relative">
      
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

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-lg">
              <Headphones size={20} className="text-[#00a0e3] dark:text-blue-300" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black">
                <span className="text-[#00a0e3] dark:text-blue-400">{title.split(' ')[0]}</span>
                <span className="text-[#ef7f1a] dark:text-orange-400"> {title.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              ref={prevRef}
              onClick={handlePrev}
              className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 hover:bg-[#00a0e3] dark:hover:bg-blue-600 hover:text-white transition-all"
            >
              <ChevronLeft size={16} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button
              ref={nextRef}
              onClick={handleNext}
              className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 hover:bg-[#ef7f1a] dark:hover:bg-orange-600 hover:text-white transition-all"
            >
              <ChevronRight size={16} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          onSwiper={setSwiper}
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.5}
          autoplay={autoPlay ? { 
            delay: 4000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          } : false}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            el: '.swiper-pagination'
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            640: { slidesPerView: 2.5, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
            1280: { slidesPerView: 5, spaceBetween: 16 },
          }}
          className="audio-swiper"
        >
          {audioBooks.map((book) => (
            <SwiperSlide key={book._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20 transition-all group relative"
              >
                {/* Floating Particles */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex gap-1">
                  {book.isHit && (
                    <span className="bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white text-[8px] px-2 py-0.5 rounded-full">
                      🔥 Хит
                    </span>
                  )}
                  {book.isNew && (
                    <span className="bg-[#ef7f1a] dark:bg-orange-600 text-white text-[8px] px-2 py-0.5 rounded-full">
                      ✨ Yangi
                    </span>
                  )}
                </div>

                {/* Cover */}
                <Link href={`/audio/${book.slug}`}>
                  <div className="relative h-[160px] w-full mb-3 rounded-lg overflow-hidden cursor-pointer">
                    <Image
                      src={book.coverImage}
                      alt={getTitle(book)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 bg-black/30 dark:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePlay(book._id, book.audioUrl);
                        }}
                        className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        {playingId === book._id ? (
                          <Pause size={16} className="text-[#00a0e3] dark:text-blue-400" />
                        ) : (
                          <Play size={16} className="ml-0.5 text-[#ef7f1a] dark:text-orange-400" />
                        )}
                      </div>
                    </div>

                    {/* Format Badge */}
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm w-6 h-6 rounded-full flex items-center justify-center">
                      <Headphones size={12} className="text-[#00a0e3] dark:text-blue-400" />
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-2 left-2 bg-black/70 dark:bg-slate-900/90 text-white text-[8px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock size={8} />
                      <span>{book.duration}</span>
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div>
                  <Link href={`/audio/${book.slug}`}>
                    <h3 className="font-bold text-sm line-clamp-1 text-gray-900 dark:text-white group-hover:text-[#00a0e3] dark:group-hover:text-blue-400 transition-colors">
                      {getTitle(book)}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{getAuthor(book)}</p>
                  
                  {/* Narrator */}
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                    <Mic size={10} className="text-[#ef7f1a] dark:text-orange-400" />
                    <span className="truncate">{getNarrator(book)}</span>
                  </div>

                  {/* Rating & Actions */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-[#ef7f1a] dark:text-orange-400 fill-[#ef7f1a] dark:fill-orange-400" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {book.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-[8px] text-gray-400 dark:text-gray-500">
                        ({book.reviewsCount || 0})
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => toggleBookmark(book._id)}
                        className={`p-1 rounded-lg transition-colors ${
                          isBookmarked.includes(book._id) 
                            ? 'text-red-500 dark:text-red-400' 
                            : 'text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400'
                        }`}
                      >
                        <Heart size={14} fill={isBookmarked.includes(book._id) ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => handleDownload(book._id)}
                        className="p-1 text-gray-300 dark:text-gray-600 hover:text-[#00a0e3] dark:hover:text-blue-400 transition-colors"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="swiper-pagination mt-6 !relative !bottom-0"></div>

        {/* Categories */}
        {showCategories && (
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              { name: "Detektiv", slug: "detektiv" },
              { name: "Fantastika", slug: "fantastika" },
              { name: "Romantika", slug: "roman" },
              { name: "Biznes", slug: "biznes" },
              { name: "Psixologiya", slug: "psixologiya" }
            ].map((cat, i) => (
              <Link
                key={i}
                href={`/audio?category=${cat.slug}`}
                className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-[#00a0e3] hover:text-white dark:hover:bg-blue-600 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-6">
          <Link 
            href="/audio"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#00a0e3] dark:text-blue-400 hover:text-[#ef7f1a] dark:hover:text-orange-400 transition-colors group"
          >
            Barcha audio kitoblar
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mini Player */}
        <AnimatePresence>
          {playingId && currentBook && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-md bg-white dark:bg-slate-800 rounded-xl p-3 shadow-xl dark:shadow-2xl dark:shadow-[#00a0e3]/20 border border-gray-100 dark:border-slate-700 flex items-center gap-3"
            >
              <button 
                onClick={() => {
                  setPlayingId(null);
                  setIsPlaying(false);
                  if (audioRef.current) {
                    audioRef.current.pause();
                  }
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 dark:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg text-xs hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
              >
                ✕
              </button>

              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={currentBook.coverImage} alt={getTitle(currentBook)} fill className="object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{getTitle(currentBook)}</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                  <Mic size={8} className="text-[#ef7f1a] dark:text-orange-400" />
                  {getNarrator(currentBook)}
                </p>
              </div>
              
              <button 
                onClick={() => {
                  if (audioRef.current) {
                    if (isPlaying) {
                      audioRef.current.pause();
                    } else {
                      audioRef.current.play();
                    }
                    setIsPlaying(!isPlaying);
                  }
                }}
                className="w-8 h-8 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden audio element */}
        <audio ref={audioRef} className="hidden" />
      </div>

      {/* Custom Styles */}
      <style>{`
        .audio-swiper {
          padding: 5px 0 20px !important;
          margin: -5px 0 !important;
        }
        
        .audio-swiper .swiper-slide {
          height: auto;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #00a0e3;
          opacity: 0.2;
          transition: all 0.3s ease;
        }
        
        .dark .swiper-pagination-bullet {
          background: #3b82f6;
        }
        
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 20px;
          border-radius: 4px;
          background: #ef7f1a;
        }
        
        .dark .swiper-pagination-bullet-active {
          background: #f97316;
        }
        
        .swiper-pagination {
          position: relative !important;
          margin-top: 20px !important;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </section>
  );
};
