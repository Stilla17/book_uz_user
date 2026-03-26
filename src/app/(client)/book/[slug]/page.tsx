"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Headphones,
  BookOpen,
  Truck,
  Shield,
  RotateCcw,
  Loader2,
  MessageCircle,
  ThumbsUp,
  Flag,
  Camera,
  CheckCircle,
  Package,
  MessageSquare,
  Sparkles,
  Tag,
  Eye,
  Calendar,
  User,
  Hash,
  Globe,
  Clock,
  FileText,
  TrendingUp,
  Award,
  BookMarked,
  Mic2,
  Layers,
  BookCopy,
  Library,
  Users,
  Download,
  PlayCircle,
  PauseCircle,
  Volume2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Send,
  Smile,
  Info,
  StarHalf,
  Filter,
  X,
  Crown,
  Zap,
  Gem,
  Flower2,
  Coffee,
  Compass,
  Music,
  Gift,
  Percent,
  ShoppingBag,
  CreditCard,
  Phone,
  Mail,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { api, UserService } from "@/services/api";
import { toast } from "react-hot-toast";
import { BookCard } from "@/components/cards/BookCard";
import { motion, AnimatePresence } from "framer-motion";

// ==================== INTERFACES ====================
interface Product {
  _id: string;
  title: {
    uz: string;
    ru?: string;
    en?: string;
  };
  slug: string;
  description?: {
    uz?: string;
  };
  details?: {
    publisher?: string;
    publishedYear?: number;
    pages?: number;
    language?: string;
    isbn?: string;
    weight?: string;
    dimensions?: string;
    cover?: string;
  };
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  category: {
    _id: string;
    name: {
      uz: string;
    };
  };
  author: {
    _id: string;
    name: string;
    bio?: string;
    image?: string;
    booksCount?: number;
  };
  language: 'uz' | 'ru' | 'en';
  isTop: boolean;
  isDiscount: boolean;
  ratingAvg: number;
  ratingCount: number;
  format?: 'ebook' | 'audio' | 'paper';
  pages?: number;
  duration?: string;
  publisher?: string;
  publishedYear?: number;
  isbn?: string;
  views?: number;
  sales?: number;
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  images?: string[];
  isPurchased: boolean;
  isApproved: boolean;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Reply[];
  replyCount?: number;
}

interface Reply {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  comment: string;
  createdAt: string;
  likes?: number;
}

interface ReviewStats {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

type TabType = "details" | "reviews" | "discussion";

// ==================== MAIN COMPONENT ====================
export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Product states
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("details");

  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: "",
    images: [] as File[]
  });
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [canReview, setCanReview] = useState(false);
  const [userExistingReview, setUserExistingReview] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Discussion states
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});

  const [submittingReply, setSubmittingReply] = useState<{ [key: string]: boolean }>({});
  const [reviewFilterRating, setReviewFilterRating] = useState<number | null>(null);
  const [showReviewFilters, setShowReviewFilters] = useState(false);

  // Audio player state (for audio books)
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Floating icons array
  const floatingIcons = [
    Sparkles, Star, Heart, Crown, Zap, Award, Gem, Flower2,
    Coffee, Compass, Headphones, Music, BookOpen, BookMarked,
    Tag, Percent, Calendar, Download, Globe, Truck,
    Shield, Info, Gift, Phone, Clock, ShoppingCart, User,
    BookCopy, Library, Users, TrendingUp, Award, Crown,
    Mic2, Volume2, PlayCircle, PauseCircle
  ];

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

  // ==================== EFFECTS ====================
  useEffect(() => {
    loadProduct();
  }, [params.slug]);

  useEffect(() => {
    if (product && isAuthenticated) {
      checkWishlist();
      checkUserCanReview();
      loadUserReview();
    }
    if (product) {
      loadReviews();
    }
  }, [product, isAuthenticated]);

  // ==================== API FUNCTIONS ====================
  const loadProduct = async () => {
    try {
      setLoading(true);
      console.log("Loading product with slug:", params.slug);

      const response = await api.get(`/products/${params.slug}`);
      console.log("Product response:", response.data);

      if (response.data?.success) {
        setProduct(response.data.data);

        // Load related products
        const relatedResponse = await api.get(`/products/${response.data.data._id}/related`);
        if (relatedResponse.data?.success) {
          setRelatedProducts(relatedResponse.data.data);
        }
      }
    } catch (error) {
      console.error("Mahsulot yuklanmadi:", error);
      toast.error("Mahsulot topilmadi");
      router.push('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!product) return;

    try {
      setLoadingReviews(true);
      const response = await api.get(`/reviews/product/${product._id}`);

      if (response.data?.success) {
        setReviews(response.data.data.reviews || []);

        // Calculate stats
        const stats = response.data.data.stats || {
          average: product.ratingAvg,
          total: product.ratingCount,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
        setReviewStats(stats);
      }
    } catch (error) {
      console.error("Sharhlar yuklanmadi:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkUserCanReview = async () => {
    try {
      const response = await api.get(`/orders/check-purchased/${product?._id}`);
      setCanReview(response.data?.purchased || false);
    } catch (error) {
      console.error("Xarid tekshirilmadi:", error);
    }
  };

  const loadUserReview = async () => {
    try {
      const response = await api.get(`/reviews/user/product/${product?._id}`);
      if (response.data?.success && response.data.data) {
        setUserExistingReview(response.data.data);
        setUserReview({
          rating: response.data.data.rating,
          comment: response.data.data.comment,
          images: []
        });
        setReviewImages(response.data.data.images || []);
      }
    } catch (error) {
      console.error("Foydalanuvchi sharhi yuklanmadi:", error);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await UserService.getWishlist();
      if (response?.success) {
        setIsInWishlist(response.data.some((item: any) => item._id === product?._id));
      }
    } catch (error) {
      console.error("Wishlist tekshirilmadi:", error);
    }
  };

  // ==================== HANDLERS ====================
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/book/' + params.slug);
      return;
    }

    try {
      const response = await UserService.toggleWishlist(product!._id);
      if (response?.success) {
        setIsInWishlist(!isInWishlist);
        toast.success(isInWishlist ? "Sevimlilardan o'chirildi" : "Sevimlilarga qo'shildi");
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/book/' + params.slug);
      return;
    }

    try {
      await api.post('/cart/add', { productId: product!._id, quantity });
      toast.success(`${quantity} ta kitob savatga qo'shildi`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Havola nusxalandi");
  };

  // Review handlers
  const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + userReview.images.length > 3) {
      toast.error("Maksimal 3 ta rasm yuklashingiz mumkin");
      return;
    }
    setUserReview(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeReviewImage = (index: number) => {
    setUserReview(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/book/' + params.slug);
      return;
    }

    if (!userReview.comment.trim()) {
      toast.error("Sharh matnini kiriting");
      return;
    }

    try {
      setSubmittingReview(true);

      const formData = new FormData();
      formData.append('productId', product!._id);
      formData.append('rating', userReview.rating.toString());
      formData.append('comment', userReview.comment);

      userReview.images.forEach((image) => {
        formData.append('images', image);
      });

      let response;
      if (userExistingReview && editingReview) {
        response = await api.put(`/reviews/${userExistingReview._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/reviews', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data?.success) {
        toast.success(userExistingReview ? "Sharh tahrirlandi" : "Sharh qo'shildi");
        setShowReviewForm(false);
        setEditingReview(false);
        setUserReview({ rating: 5, comment: "", images: [] });
        loadReviews();
        loadUserReview();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditReview = () => {
    setEditingReview(true);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async () => {
    if (!confirm("Sharhni o'chirishni tasdiqlaysizmi?")) return;

    try {
      const response = await api.delete(`/reviews/${userExistingReview?._id}`);
      if (response.data?.success) {
        toast.success("Sharh o'chirildi");
        setUserExistingReview(null);
        setUserReview({ rating: 5, comment: "", images: [] });
        setReviewImages([]);
        loadReviews();
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  // Discussion handlers
  const toggleReplies = (reviewId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const toggleReplyForm = (reviewId: string) => {
    setShowReplyForm(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleReplyChange = (reviewId: string, text: string) => {
    setReplyText(prev => ({
      ...prev,
      [reviewId]: text
    }));
  };

  const handleSubmitReply = async (reviewId: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/book/' + params.slug);
      return;
    }

    if (!replyText[reviewId]?.trim()) {
      toast.error("Javob matnini kiriting");
      return;
    }

    try {
      setSubmittingReply(prev => ({ ...prev, [reviewId]: true }));

      // API call to submit reply
      await api.post(`/reviews/${reviewId}/reply`, { comment: replyText[reviewId] });

      toast.success("Javob qo'shildi");
      setReplyText(prev => ({ ...prev, [reviewId]: "" }));
      setShowReplyForm(prev => ({ ...prev, [reviewId]: false }));

      // Refresh reviews to show new reply
      loadReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmittingReply(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleLikeReview = async (reviewId: string) => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/book/' + params.slug);
      return;
    }

    try {
      await api.post(`/reviews/${reviewId}/like`);
      loadReviews();
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  // ==================== HELPER FUNCTIONS ====================
  const getProductTitle = () => {
    return product?.title.uz || product?.title.ru || product?.title.en || "Noma'lum";
  };

  const getProductDescription = () => {
    return product?.description?.uz || "Tavsif mavjud emas";
  };

  const getDiscountedPrice = () => {
    if (product?.discountPrice && product.discountPrice > 0) {
      return product.discountPrice;
    }
    return product?.price || 0;
  };

  const getDiscountPercentage = () => {
    if (product?.discountPrice && product.discountPrice > 0) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return 0;
  };

  const getFormatIcon = () => {
    switch (product?.format) {
      case 'audio': return <Mic2 size={24} className="text-orange-500" />;
      case 'ebook': return <BookCopy size={24} className="text-blue-500" />;
      case 'paper': return <Library size={24} className="text-green-500" />;
      default: return <BookOpen size={24} className="text-gray-400" />;
    }
  };

  const getFormatLabel = () => {
    switch (product?.format) {
      case 'audio': return 'Audio kitob';
      case 'ebook': return 'Elektron kitob';
      case 'paper': return 'Qog\'oz kitob';
      default: return 'Kitob';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 kun oldin";
    if (diffDays < 7) return `${diffDays} kun oldin`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta oldin`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} oy oldin`;
    return `${Math.floor(diffDays / 365)} yil oldin`;
  };

  // Filter and sort reviews
  const filteredReviews = reviews.filter(review =>
    reviewFilterRating ? review.rating === reviewFilterRating : true
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return (b.likes || 0) - (a.likes || 0);
    }
  });

  // Get rating breakdown
  const getRatingBreakdown = () => {
    const total = reviewStats.total || 1;
    return [5, 4, 3, 2, 1].map(star => ({
      rating: star,
      count: reviewStats.distribution[star as keyof typeof reviewStats.distribution] || 0,
      percentage: (reviewStats.distribution[star as keyof typeof reviewStats.distribution] / total) * 100
    }));
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500/20 dark:border-blue-400/20 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
            <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400" size={32} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse text-lg">Sehrli kitoblar dunyosiga sayohat...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-4 sm:py-8 relative overflow-hidden">

      {/* ========== ANIMATED BACKGROUND ELEMENTS ========== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating Icons */}
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

      <div className="container mx-auto px-3 sm:px-4 max-w-7xl relative z-10">

        {/* ========== BREADCRUMB ========== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 overflow-x-auto pb-2 whitespace-nowrap scrollbar-hide"
        >
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0">Bosh sahifa</Link>
          <ChevronRight size={12} className="sm:size-14 flex-shrink-0" />
          <Link href="/catalog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0">Katalog</Link>
          <ChevronRight size={12} className="sm:size-14 flex-shrink-0" />
          <Link href={`/catalog?category=${product.category._id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0">
            {product.category.name.uz}
          </Link>
          <ChevronRight size={12} className="sm:size-14 flex-shrink-0" />
          <span className="text-gray-900 dark:text-white font-medium truncate">{getProductTitle()}</span>
        </motion.div>

        {/* ========== PRODUCT DETAIL SECTION ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8"
        >
          {/* LEFT COLUMN - IMAGES */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-700 group">
              <Image
                src={product.images?.[selectedImage] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887"}
                alt={getProductTitle()}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />

              {/* Sale badge */}
              {product.isDiscount && (
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                  -{getDiscountPercentage()}%
                </div>
              )}

              {/* Top badge */}
              {product.isTop && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg flex items-center gap-1">
                  <Award size={14} />
                  <span>Top</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === index
                        ? 'border-blue-500 shadow-lg'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${getProductTitle()} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - INFO */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {getProductTitle()}
              </h1>

              {/* Author & Category */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
                <Link
                  href={`/author/${product.author._id}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {product.author.name}
                </Link>
                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <Link
                  href={`/catalog?category=${product.category._id}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {product.category.name.uz}
                </Link>
              </div>
            </div>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                  const rating = product.ratingAvg;
                  const filled = i < Math.floor(rating);
                  const halfFilled = !filled && i < Math.ceil(rating) && rating % 1 !== 0;

                  return (
                    <div key={i} className="relative">
                      <Star
                        size={18}
                        className="text-gray-300 dark:text-gray-600"
                      />
                      <div className="absolute inset-0 overflow-hidden" style={{ width: halfFilled ? '50%' : filled ? '100%' : '0%' }}>
                        <Star
                          size={18}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{product.ratingAvg.toFixed(1)}</span>
              <span className="text-gray-400 dark:text-gray-500">({product.ratingCount} ta baho)</span>
              {product.views && (
                <>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Eye size={14} />
                    {product.views}
                  </span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-xl p-4 sm:p-6">
              {product.discountPrice && product.discountPrice > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                    {product.discountPrice.toLocaleString()} so'm
                  </span>
                  <span className="text-lg sm:text-xl text-gray-400 line-through">
                    {product.price.toLocaleString()} so'm
                  </span>
                  <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                    -{getDiscountPercentage()}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                  {product.price.toLocaleString()} so'm
                </span>
              )}
            </div>

            {/* Format & Stock */}
            <div className="flex flex-wrap items-center gap-4">
              {product.format && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                  {getFormatIcon()}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{getFormatLabel()}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {product.stock === 1 ? "So'nggi nusxa!" : `${product.stock} dona mavjud`}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-red-600 dark:text-red-400 font-medium">Mavjud emas</span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700 dark:text-gray-300">Miqdor:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 disabled:opacity-50 flex items-center justify-center transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 sm:w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 disabled:opacity-50 flex items-center justify-center transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingCart size={20} className="mr-2" />
                Savatga qo'shish
              </Button>

              <Button
                onClick={handleToggleWishlist}
                variant="outline"
                className={`flex-1 py-3 sm:py-4 rounded-xl border-2 transition-all text-base sm:text-lg ${isInWishlist
                    ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600'
                  }`}
              >
                <Heart size={20} className="mr-2" fill={isInWishlist ? "currentColor" : "none"} />
                {isInWishlist ? "Sevimlilarda" : "Sevimlilarga qo'shish"}
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Truck size={20} className="mx-auto mb-1 text-gray-400" />
                <span className="text-xs text-gray-500">Bepul yetkazish</span>
              </div>
              <div className="text-center">
                <Shield size={20} className="mx-auto mb-1 text-gray-400" />
                <span className="text-xs text-gray-500">Kafolat</span>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="mx-auto mb-1 text-gray-400" />
                <span className="text-xs text-gray-500">14 kun qaytarish</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========== TABS (Mobile Dropdown) ========== */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <span className="font-semibold text-gray-900 dark:text-white">
              {activeTab === "details" && "The Details"}
              {activeTab === "reviews" && `Ratings & Reviews (${reviewStats.total})`}
              {activeTab === "discussion" && "Discussion"}
            </span>
            <ChevronDown size={20} className={`transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => { setActiveTab("details"); setIsMobileMenuOpen(false); }}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${activeTab === "details" ? 'text-blue-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  The Details
                </button>
                <button
                  onClick={() => { setActiveTab("reviews"); setIsMobileMenuOpen(false); }}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-t border-gray-100 dark:border-gray-700 ${activeTab === "reviews" ? 'text-blue-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  Ratings & Reviews ({reviewStats.total})
                </button>
                <button
                  onClick={() => { setActiveTab("discussion"); setIsMobileMenuOpen(false); }}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-t border-gray-100 dark:border-gray-700 ${activeTab === "discussion" ? 'text-blue-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  Discussion
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========== TABS (Desktop) ========== */}
        <div className="hidden lg:block border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 font-medium transition-colors relative ${activeTab === "details"
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              The Details
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 font-medium transition-colors relative ${activeTab === "reviews"
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              Ratings & Reviews ({reviewStats.total})
            </button>
            <button
              onClick={() => setActiveTab("discussion")}
              className={`py-4 font-medium transition-colors relative ${activeTab === "discussion"
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              Discussion
            </button>
          </div>
        </div>

        {/* ========== TAB CONTENT ========== */}
        <AnimatePresence mode="wait">
          {/* DETAILS TAB */}
          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Info size={20} className="text-blue-500" />
                  The Details
                </h2>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {getProductDescription()}
                  </p>
                </div>

                {/* Product Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.publisher && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <Package size={18} className="text-blue-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Nashriyot</p>
                        <p className="font-medium text-gray-900 dark:text-white">{product.publisher}</p>
                      </div>
                    </div>
                  )}

                  {product.publishedYear && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <Calendar size={18} className="text-orange-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Yili</p>
                        <p className="font-medium text-gray-900 dark:text-white">{product.publishedYear}</p>
                      </div>
                    </div>
                  )}

                  {product.pages && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <FileText size={18} className="text-green-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sahifalar</p>
                        <p className="font-medium text-gray-900 dark:text-white">{product.pages}</p>
                      </div>
                    </div>
                  )}

                  {product.language && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <Globe size={18} className="text-purple-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Til</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.language === 'uz' ? 'O\'zbek' :
                            product.language === 'ru' ? 'Русский' : 'English'}
                        </p>
                      </div>
                    </div>
                  )}

                  {product.isbn && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <Hash size={18} className="text-pink-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ISBN</p>
                        <p className="font-medium text-gray-900 dark:text-white">{product.isbn}</p>
                      </div>
                    </div>
                  )}

                  {product.format && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      {product.format === 'audio' ? <Mic2 size={18} className="text-orange-500 mt-1" /> :
                        product.format === 'ebook' ? <BookCopy size={18} className="text-blue-500 mt-1" /> :
                          <Library size={18} className="text-green-500 mt-1" />}
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Format</p>
                        <p className="font-medium text-gray-900 dark:text-white">{getFormatLabel()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    Ratings & Reviews ({reviewStats.total})
                  </h2>

                  {isAuthenticated && canReview && !userExistingReview && (
                    <Button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Sharh yozish
                    </Button>
                  )}

                  {userExistingReview && !showReviewForm && (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEditReview}
                        variant="outline"
                        size="sm"
                      >
                        Tahrirlash
                      </Button>
                      <Button
                        onClick={handleDeleteReview}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        O'chirish
                      </Button>
                    </div>
                  )}
                </div>

                {/* Review Stats */}
                {reviewStats.total > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-xl">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        {reviewStats.average.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center gap-1 my-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={i < Math.round(reviewStats.average)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {reviewStats.total} ta baho
                      </p>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      {getRatingBreakdown().map((item) => (
                        <div key={item.rating} className="flex items-center gap-2">
                          <span className="text-sm w-8 text-gray-600 dark:text-gray-400">{item.rating} ★</span>
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.percentage}%` }}
                              transition={{ duration: 0.5, delay: item.rating * 0.1 }}
                              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                            />
                          </div>
                          <span className="text-sm w-8 text-gray-600 dark:text-gray-400">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Form */}
                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 sm:p-6">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                          {editingReview ? "Sharhni tahrirlash" : "Yangi sharh qoldirish"}
                        </h3>

                        {/* Rating Selection */}
                        <div className="mb-4">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Baholang
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setUserReview({ ...userReview, rating: star })}
                                className={`p-2 rounded-lg transition-all hover:scale-110 ${userReview.rating >= star
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                  }`}
                              >
                                <Star size={28} fill={userReview.rating >= star ? "currentColor" : "none"} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment */}
                        <div className="mb-4">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Sharh matni
                          </label>
                          <textarea
                            value={userReview.comment}
                            onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                            rows={4}
                            placeholder="Kitob haqida fikringiz..."
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                          />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Rasmlar (ixtiyoriy)
                          </label>
                          <div className="flex gap-3 flex-wrap">
                            {userReview.images.map((file, index) => (
                              <div key={index} className="relative w-20 h-20 group">
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt={`Review ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removeReviewImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {reviewImages.map((url, index) => (
                              <div key={`existing-${index}`} className="relative w-20 h-20">
                                <Image
                                  src={url}
                                  alt={`Existing review ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                            ))}
                            {userReview.images.length + reviewImages.length < 3 && (
                              <label className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-white dark:bg-slate-800">
                                <Camera size={24} className="text-gray-400" />
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleReviewImageUpload}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Maksimal 3 ta rasm (jpeg, png)
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button
                            onClick={handleSubmitReview}
                            disabled={submittingReview}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {submittingReview ? (
                              <Loader2 size={18} className="mr-2 animate-spin" />
                            ) : null}
                            {submittingReview ? "Yuborilmoqda..." : "Yuborish"}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowReviewForm(false);
                              setEditingReview(false);
                              if (!userExistingReview) {
                                setUserReview({ rating: 5, comment: "", images: [] });
                              }
                            }}
                            variant="outline"
                          >
                            Bekor qilish
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                {loadingReviews ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : sortedReviews.length > 0 ? (
                  <div className="space-y-6">
                    {sortedReviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                        <div className="flex gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {review.user.avatar ? (
                              <Image
                                src={review.user.avatar}
                                alt={review.user.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <span>{review.user.name.charAt(0)}</span>
                            )}
                          </div>

                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {review.user.name}
                                </h4>
                                {review.isPurchased && (
                                  <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                                    <CheckCircle size={10} />
                                    Sotib olingan
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                  }
                                />
                              ))}
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-3">
                              {review.comment}
                            </p>

                            {/* Images */}
                            {review.images && review.images.length > 0 && (
                              <div className="flex gap-2 mb-3">
                                {review.images.map((img, idx) => (
                                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden">
                                    <Image
                                      src={img}
                                      alt={`Review image ${idx + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLikeReview(review._id)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                              >
                                <ThumbsUp size={14} />
                                <span>{review.likes || 0}</span>
                              </button>
                              <button
                                onClick={() => toggleReplyForm(review._id)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                              >
                                <MessageCircle size={14} />
                                <span>Reply</span>
                              </button>
                            </div>

                            {/* Reply Form */}
                            {showReplyForm[review._id] && (
                              <div className="mt-3 flex gap-2">
                                <input
                                  type="text"
                                  value={replyText[review._id] || ''}
                                  onChange={(e) => handleReplyChange(review._id, e.target.value)}
                                  placeholder="Write a reply..."
                                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-slate-800"
                                />
                                <Button
                                  onClick={() => handleSubmitReply(review._id)}
                                  disabled={submittingReply[review._id]}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {submittingReply[review._id] ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Send size={14} />
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Hali sharhlar mavjud emas
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Bu kitob haqida birinchi bo'lib fikr bildiring
                    </p>
                    {canReview && !userExistingReview && (
                      <Button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <MessageSquare size={16} className="mr-2" />
                        Birinchi sharh yozish
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* DISCUSSION TAB */}
          {activeTab === "discussion" && (
            <motion.div
              key="discussion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageCircle size={20} className="text-blue-500" />
                    Discussion
                  </h2>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Sort by</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "newest" | "popular")}
                      className="flex-1 sm:flex-none px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-slate-800"
                    >
                      <option value="newest">Newest</option>
                      <option value="popular">Popular</option>
                    </select>
                  </div>
                </div>

                {/* Discussion List */}
                {sortedReviews.length > 0 ? (
                  <div className="space-y-6">
                    {sortedReviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                        {/* Review */}
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {review.user.avatar ? (
                              <Image
                                src={review.user.avatar}
                                alt={review.user.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <span>{review.user.name.charAt(0)}</span>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {review.user.name}
                              </h4>
                              <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-2">
                              {review.comment}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-4">
                              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                                <ThumbsUp size={14} />
                                <span>{review.likes || 0}</span>
                              </button>
                              <button
                                onClick={() => toggleReplyForm(review._id)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                              >
                                <MessageCircle size={14} />
                                <span>Reply</span>
                              </button>

                              {review.replyCount ? (
                                <button
                                  onClick={() => toggleReplies(review._id)}
                                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                                >
                                  <span>{review.replyCount} {review.replyCount === 1 ? 'reply' : 'replies'}</span>
                                  {showReplies[review._id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                              ) : null}
                            </div>

                            {/* Reply Form */}
                            {showReplyForm[review._id] && (
                              <div className="mt-3 flex gap-2">
                                <input
                                  type="text"
                                  value={replyText[review._id] || ''}
                                  onChange={(e) => handleReplyChange(review._id, e.target.value)}
                                  placeholder="Write a reply..."
                                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-slate-800"
                                />
                                <Button
                                  onClick={() => handleSubmitReply(review._id)}
                                  disabled={submittingReply[review._id]}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {submittingReply[review._id] ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Send size={14} />
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Replies */}
                        {showReplies[review._id] && review.replies && review.replies.length > 0 && (
                          <div className="ml-12 mt-4 space-y-4">
                            {review.replies.map((reply) => (
                              <div key={reply._id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                  {reply.user.avatar ? (
                                    <Image
                                      src={reply.user.avatar}
                                      alt={reply.user.name}
                                      width={32}
                                      height={32}
                                      className="rounded-full object-cover"
                                    />
                                  ) : (
                                    <span>{reply.user.name.charAt(0)}</span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                                      {reply.user.name}
                                    </span>
                                    <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{reply.comment}</p>
                                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                                    <ThumbsUp size={12} />
                                    <span>{reply.likes || 0}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Hali muhokamalar yo'q
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Bu kitob haqida birinchi bo'lib muhokama boshlang
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== RELATED PRODUCTS ========== */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
              <Sparkles size={24} className="text-orange-500" />
              O'xshash kitoblar
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BookCard book={book as any} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ========== BRAND SECTION ========== */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
              B
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">BOOK.UZ</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                O'zbekistonning eng katta onlayn kitob do'koni. 50,000+ kitoblar, audio kitoblar va elektron nashrlar.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/catalog" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Barcha kitoblar
            </Link>
            <Link href="/catalog?isDiscount=true" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Chegirmalar
            </Link>
            <Link href="/catalog?isTop=true" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Top kitoblar
            </Link>
            <Link href="/catalog?format=audio" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600">
              Audio kitoblar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}