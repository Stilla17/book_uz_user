"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  BookOpen, 
  Headphones,
  ChevronRight,
  Search,
  Star,
  Loader2,
  Package,
  Truck,
  Shield,
  AlertCircle,
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
  Compass,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, UserService } from "@/services/api";
import { toast } from "react-hot-toast";

interface WishlistBook {
  _id: string;
  title: {
    uz: string;
    ru?: string;
    en?: string;
  };
  author?: {
    name: string;
    _id?: string;
  };
  price: number;
  oldPrice?: number;
  ratingAvg?: number;
  ratingCount?: number;
  images?: string[];
  discount?: number;
  format?: "ebook" | "audio" | "paper";
  inStock?: boolean;
  slug?: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<WishlistBook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [removingItems, setRemovingItems] = useState<string[]>([]);
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

  // Floating icons array
  const floatingIcons = [Heart, BookOpen, Star, Sparkles, Crown, Zap, Award, Gem, Diamond, Flower2, Sun, Moon, Cloud, Coffee, Compass];

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/wishlist');
      return;
    }
    
    loadWishlist();
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (wishlist.length > 0) {
      if (selectedItems.length === wishlist.length) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }
    }
  }, [selectedItems, wishlist]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await UserService.getWishlist();
      
      if (response?.success) {
        setWishlist(response.data || []);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Wishlist yuklanmadi:", error);
      toast.error("Sevimlilar yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemovingItems(prev => [...prev, productId]);
      const response = await UserService.toggleWishlist(productId);
      
      if (response?.success) {
        setWishlist(wishlist.filter(book => book._id !== productId));
        setSelectedItems(selectedItems.filter(id => id !== productId));
        toast.success("Sevimlilardan o'chirildi");
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setRemovingItems(prev => prev.filter(id => id !== productId));
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      setRemovingItems(selectedItems);
      
      for (const id of selectedItems) {
        await UserService.toggleWishlist(id);
      }
      
      setWishlist(wishlist.filter(book => !selectedItems.includes(book._id)));
      setSelectedItems([]);
      setSelectAll(false);
      toast.success(`${selectedItems.length} ta kitob sevimlilardan o'chirildi`);
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setRemovingItems([]);
    }
  };

  const handleAddToCart = async (bookId: string) => {
    try {
      await api.post('/cart/add', { productId: bookId, quantity: 1 });
      toast.success("Savatga qo'shildi");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleAddSelectedToCart = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      for (const id of selectedItems) {
        await api.post('/cart/add', { productId: id, quantity: 1 });
      }
      toast.success(`${selectedItems.length} ta kitob savatga qo'shildi`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleAddAllToCart = async () => {
    if (wishlist.length === 0) return;
    
    try {
      for (const book of wishlist) {
        await api.post('/cart/add', { productId: book._id, quantity: 1 });
      }
      toast.success(`${wishlist.length} ta kitob savatga qo'shildi`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleToggleSelect = (bookId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map(book => book._id));
    }
  };

  const getBookTitle = (book: WishlistBook): string => {
    return book.title?.uz || book.title?.ru || book.title?.en || "Noma'lum";
  };

  const getBookAuthor = (book: WishlistBook): string => {
    if (typeof book.author === 'string') return book.author;
    return book.author?.name || "Noma'lum muallif";
  };

  const getBookImage = (book: WishlistBook): string => {
    if (book.images && book.images.length > 0 && book.images[0]) {
      return book.images[0];
    }
    return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887";
  };

  const getFormatIcon = (format?: string) => {
    switch(format) {
      case 'audio': return <Headphones size={14} className="text-[#FF8A00] dark:text-orange-400" />;
      case 'ebook': return <BookOpen size={14} className="text-[#005CB9] dark:text-blue-400" />;
      default: return <BookOpen size={14} className="text-gray-400 dark:text-gray-500" />;
    }
  };

  const filteredWishlist = wishlist.filter(book => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const title = getBookTitle(book).toLowerCase();
      const author = getBookAuthor(book).toLowerCase();
      return title.includes(query) || author.includes(query);
    }
    return true;
  });

  const totalPrice = wishlist.reduce((sum, book) => sum + (book.price || 0), 0);
  const selectedTotalPrice = wishlist
    .filter(book => selectedItems.includes(book._id))
    .reduce((sum, book) => sum + (book.price || 0), 0);

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
            <div className="w-16 h-16 border-4 border-[#005CB9] dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#005CB9] dark:text-blue-400" size={24} fill="#005CB9" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Sevimlilar yuklanmoqda...</p>
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
              <Heart size={28} className="text-[#FF8A00] dark:text-orange-400" fill="#FF8A00" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-black"
              >
                <span className="text-[#005CB9] dark:text-blue-400">Sevimli</span>
                <span className="text-[#FF8A00] dark:text-orange-400"> kitoblar</span>
              </motion.h1>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 dark:text-gray-400 mt-1"
              >
                {wishlist.length > 0 
                  ? `Sizda ${wishlist.length} ta sevimli kitob bor` 
                  : "Sevimli kitoblar yo'q"
                }
              </motion.p>
            </div>
          </div>
          
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            {wishlist.length > 0 && (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleAddAllToCart}
                    className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Hammasini savatga
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/catalog"
                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:border-[#005CB9] dark:hover:border-blue-400 hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors inline-block"
                  >{' Katalogga o\'tish '}</Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>

        {wishlist.length > 0 ? (
          <>
            {/* Search with animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-4 mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Kitob nomi yoki muallif..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Select All with animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-4 mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.input
                    whileTap={{ scale: 0.9 }}
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-[#005CB9] dark:text-blue-400 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-700"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hammasini tanlash ({wishlist.length} ta kitob)
                  </span>
                </div>
                
                {selectedItems.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <Button
                      onClick={handleRemoveSelected}
                      variant="outline"
                      size="sm"
                      className="border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      disabled={removingItems.length > 0}
                    >
                      {removingItems.length > 0 ? (
                        <Loader2 size={14} className="animate-spin mr-2" />
                      ) : (
                        <Trash2 size={14} className="mr-2" />
                      )}{' O\'chirish ('}{selectedItems.length})
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Wishlist Items */}
            <div className="space-y-4">
              {filteredWishlist.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Checkbox */}
                    <div className="flex items-start pt-2">
                      <motion.input
                        whileTap={{ scale: 0.9 }}
                        type="checkbox"
                        checked={selectedItems.includes(book._id)}
                        onChange={() => handleToggleSelect(book._id)}
                        disabled={removingItems.includes(book._id)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-[#005CB9] dark:text-blue-400 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-700"
                      />
                    </div>

                    {/* Book Cover */}
                    <Link href={`/book/${book.slug || book._id}`} className="flex-shrink-0">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative w-24 h-32 rounded-lg overflow-hidden shadow-md"
                      >
                        <Image
                          src={getBookImage(book)}
                          alt={getBookTitle(book)}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </motion.div>
                    </Link>

                    {/* Book Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <Link 
                            href={`/book/${book.slug || book._id}`}
                            className="text-lg font-bold text-gray-900 dark:text-white hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors line-clamp-1"
                          >
                            {getBookTitle(book)}
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{getBookAuthor(book)}</p>
                          
                          {/* Rating */}
                          {book.ratingAvg ? (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.9 }}
                              className="flex items-center gap-2 mt-2"
                            >
                              <div className="flex items-center gap-0.5">
                                {[1,2,3,4,5].map((star) => (
                                  <Star 
                                    key={star}
                                    size={14} 
                                    className={star <= Math.round(book.ratingAvg || 0) 
                                      ? "text-[#FF8A00] dark:text-orange-400 fill-[#FF8A00] dark:fill-orange-400" 
                                      : "text-gray-200 dark:text-gray-700"
                                    } 
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{book.ratingAvg?.toFixed(1)}</span>
                              {book.ratingCount ? (
                                <span className="text-xs text-gray-400 dark:text-gray-500">({book.ratingCount})</span>
                              ) : null}
                            </motion.div>
                          ) : null}

                          {/* Format Badge */}
                          {book.format && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 1 }}
                              className="flex items-center gap-1 mt-2 px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-full w-fit"
                            >
                              {getFormatIcon(book.format)}
                              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                {book.format === "audio" ? "Audio" : "E-kitob"}
                              </span>
                            </motion.div>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            {book.oldPrice && book.oldPrice > book.price && (
                              <span className="text-xs text-gray-400 dark:text-gray-500 line-through block">
                                {book.oldPrice.toLocaleString()}{' so\'m '}</span>
                            )}
                            <motion.span 
                              whileHover={{ scale: 1.1, color: "#005CB9" }}
                              className="text-xl font-black text-[#005CB9] dark:text-blue-400"
                            >
                              {book.price?.toLocaleString() || 0}{' so\'m '}</motion.span>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <button
                                onClick={() => handleAddToCart(book._id)}
                                disabled={removingItems.includes(book._id)}
                                className="px-4 py-2 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white text-sm font-bold rounded-lg hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all disabled:opacity-50"
                              >
                                <ShoppingCart size={16} className="inline mr-1" />
                                Savatga
                              </button>
                            </motion.div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveFromWishlist(book._id)}
                              disabled={removingItems.includes(book._id)}
                              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                              title="Sevimlilardan o'chirish"
                            >
                              {removingItems.includes(book._id) ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <AnimatePresence>
              {selectedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 bg-gradient-to-r from-[#005CB9]/5 to-[#FF8A00]/5 dark:from-blue-600/10 dark:to-orange-600/10 backdrop-blur-sm rounded-xl p-6 border border-gray-100 dark:border-slate-700"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tanlangan kitoblar ({selectedItems.length})</p>
                      <motion.p 
                        key={selectedTotalPrice}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-black text-[#005CB9] dark:text-blue-400"
                      >
                        {selectedTotalPrice.toLocaleString()}{' so\'m '}</motion.p>
                    </div>
                    
                    <div className="flex gap-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handleRemoveSelected}
                          variant="outline"
                          className="border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={selectedItems.length === 0 || removingItems.length > 0}
                        >
                          {removingItems.length > 0 ? (
                            <Loader2 size={16} className="animate-spin mr-2" />
                          ) : (
                            <Trash2 size={16} className="mr-2" />
                          )}{' Tanlanganlarni o\'chirish '}</Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handleAddSelectedToCart}
                          className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
                          disabled={selectedItems.length === 0}
                        >
                          <ShoppingCart size={16} className="mr-2" />{' Savatga qo\'shish '}</Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 grid grid-cols-3 gap-2 text-center text-xs"
            >
              {[
                { icon: Truck, text: "Bepul yetkazish" },
                { icon: Shield, text: "Xavfsiz to'lov" },
                { icon: Package, text: "Kafolat" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-2"
                >
                  <item.icon size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-400 dark:text-gray-500">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          // Empty State with animation
          (<motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-r from-[#FF8A00]/10 to-[#005CB9]/10 dark:from-orange-600/20 dark:to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart size={48} className="text-[#FF8A00] dark:text-orange-400" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl font-black text-gray-900 dark:text-white mb-3"
            >{' Sevimli kitoblar yo\'q '}</motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto"
            >{' Hali hech qanday kitobni sevimlilarga qo\'shmagansiz. Katalogdan o\'zingizga yoqqan kitoblarni toping va ularni sevimlilarga qo\'shing. '}</motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white font-bold rounded-xl hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
              >
                <BookOpen size={18} />{' Katalogga o\'tish '}</Link>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-bold rounded-xl hover:border-[#005CB9] dark:hover:border-blue-400 hover:text-[#005CB9] dark:hover:text-blue-400 transition-all"
              >
                Profilga qaytish
              </Link>
            </motion.div>
          </motion.div>)
        )}
      </div>
    </div>
  );
}