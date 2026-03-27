'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { BookCard } from '@/components/cards/BookCard';
import type { Book as CardBook } from '@/components/cards/BookCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserService, api } from '@/services/api';
import { Product, Review, ReviewStats } from '@/types/book';

import { AnimatePresence, motion } from 'framer-motion';
import {
    Award,
    BookCopy,
    BookMarked,
    BookOpen,
    Calendar,
    Camera,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock,
    Coffee,
    Compass,
    Crown,
    Download,
    Eye,
    FileText,
    Flower2,
    Gem,
    Gift,
    Globe,
    Hash,
    Headphones,
    Heart,
    Info,
    Library,
    Loader2,
    MessageCircle,
    MessageSquare,
    Mic2,
    Minus,
    Music,
    Package,
    PauseCircle,
    Percent,
    Phone,
    PlayCircle,
    Plus,
    RotateCcw,
    Send,
    Shield,
    ShoppingCart,
    Sparkles,
    Star,
    Tag,
    ThumbsUp,
    TrendingUp,
    Truck,
    User,
    Users,
    Volume2,
    Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ==================== INTERFACES ====================

type TabType = 'details' | 'reviews' | 'discussion';

type ApiErrorLike = {
    message?: string;
    response?: {
        data?: {
            message?: string;
        };
    };
};

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
    const [activeTab, setActiveTab] = useState<TabType>('details');

    // Review states
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState({
        rating: 5,
        comment: '',
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
    const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
    const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});

    const [submittingReply, setSubmittingReply] = useState<{ [key: string]: boolean }>({});
    const [reviewFilterRating, setReviewFilterRating] = useState<number | null>(null);
    const [showReviewFilters, setShowReviewFilters] = useState(false);

    // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getErrorMessage = (error: unknown, fallback = 'Xatolik yuz berdi') => {
        const apiError = error as ApiErrorLike;

        return apiError.response?.data?.message || apiError.message || fallback;
    };

    // Floating icons array
    const floatingIcons = [
        Sparkles,
        Star,
        Heart,
        Crown,
        Zap,
        Award,
        Gem,
        Flower2,
        Coffee,
        Compass,
        Headphones,
        Music,
        BookOpen,
        BookMarked,
        Tag,
        Percent,
        Calendar,
        Download,
        Globe,
        Truck,
        Shield,
        Info,
        Gift,
        Phone,
        Clock,
        ShoppingCart,
        User,
        BookCopy,
        Library,
        Users,
        TrendingUp,
        Award,
        Crown,
        Mic2,
        Volume2,
        PlayCircle,
        PauseCircle
    ];

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
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
            console.log('Loading product with slug:', params.slug);

            const response = await api.get(`/products/${params.slug}`);
            console.log('Product response:', response.data);

            if (response.data?.success) {
                setProduct(response.data.data);

                // Load related products
                const relatedResponse = await api.get(`/products/${response.data.data._id}/related`);
                if (relatedResponse.data?.success) {
                    setRelatedProducts(relatedResponse.data.data);
                }
            }
        } catch (error) {
            console.error('Mahsulot yuklanmadi:', error);
            toast.error('Mahsulot topilmadi');
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
            console.error('Sharhlar yuklanmadi:', error);
        } finally {
            setLoadingReviews(false);
        }
    };

    const checkUserCanReview = async () => {
        try {
            const response = await api.get(`/orders/check-purchased/${product?._id}`);
            setCanReview(response.data?.purchased || false);
        } catch (error) {
            console.error('Xarid tekshirilmadi:', error);
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
            console.error('Foydalanuvchi sharhi yuklanmadi:', error);
        }
    };

    const checkWishlist = async () => {
        try {
            const response = await UserService.getWishlist();
            if (response?.success) {
                setIsInWishlist(response.data.some((item: { _id: string }) => item._id === product?._id));
            }
        } catch (error) {
            console.error('Wishlist tekshirilmadi:', error);
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
            toast.error('Xatolik yuz berdi');
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
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Havola nusxalandi');
    };

    // Review handlers
    const handleReviewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + userReview.images.length > 3) {
            toast.error('Maksimal 3 ta rasm yuklashingiz mumkin');

            return;
        }
        setUserReview((prev) => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const removeReviewImage = (index: number) => {
        setUserReview((prev) => ({
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
            toast.error('Sharh matnini kiriting');

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
                toast.success(userExistingReview ? 'Sharh tahrirlandi' : "Sharh qo'shildi");
                setShowReviewForm(false);
                setEditingReview(false);
                setUserReview({ rating: 5, comment: '', images: [] });
                loadReviews();
                loadUserReview();
            }
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
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
                setUserReview({ rating: 5, comment: '', images: [] });
                setReviewImages([]);
                loadReviews();
            }
        } catch (error) {
            toast.error('Xatolik yuz berdi');
        }
    };

    // Discussion handlers
    const toggleReplies = (reviewId: string) => {
        setShowReplies((prev) => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };

    const toggleReplyForm = (reviewId: string) => {
        setShowReplyForm((prev) => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };

    const handleReplyChange = (reviewId: string, text: string) => {
        setReplyText((prev) => ({
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
            toast.error('Javob matnini kiriting');

            return;
        }

        try {
            setSubmittingReply((prev) => ({ ...prev, [reviewId]: true }));

            // API call to submit reply
            await api.post(`/reviews/${reviewId}/reply`, { comment: replyText[reviewId] });

            toast.success("Javob qo'shildi");
            setReplyText((prev) => ({ ...prev, [reviewId]: '' }));
            setShowReplyForm((prev) => ({ ...prev, [reviewId]: false }));

            // Refresh reviews to show new reply
            loadReviews();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error));
        } finally {
            setSubmittingReply((prev) => ({ ...prev, [reviewId]: false }));
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
            toast.error('Xatolik yuz berdi');
        }
    };

    // ==================== HELPER FUNCTIONS ====================
    const getProductTitle = () => {
        return product?.title.uz || product?.title.ru || product?.title.en || "Noma'lum";
    };

    const getProductDescription = () => {
        return product?.description?.uz || 'Tavsif mavjud emas';
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
            case 'audio':
                return <Mic2 size={24} className='text-orange-500' />;
            case 'ebook':
                return <BookCopy size={24} className='text-blue-500' />;
            case 'paper':
                return <Library size={24} className='text-green-500' />;
            default:
                return <BookOpen size={24} className='text-gray-400' />;
        }
    };

    const getFormatLabel = () => {
        switch (product?.format) {
            case 'audio':
                return 'Audio kitob';
            case 'ebook':
                return 'Elektron kitob';
            case 'paper':
                return "Qog'oz kitob";
            default:
                return 'Kitob';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 kun oldin';
        if (diffDays < 7) return `${diffDays} kun oldin`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta oldin`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} oy oldin`;

        return `${Math.floor(diffDays / 365)} yil oldin`;
    };

    // Filter and sort reviews
    const filteredReviews = reviews.filter((review) =>
        reviewFilterRating ? review.rating === reviewFilterRating : true
    );

    const sortedReviews = [...filteredReviews].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            return (b.likes || 0) - (a.likes || 0);
        }
    });

    // Get rating breakdown
    const getRatingBreakdown = () => {
        const total = reviewStats.total || 1;

        return [5, 4, 3, 2, 1].map((star) => ({
            rating: star,
            count: reviewStats.distribution[star as keyof typeof reviewStats.distribution] || 0,
            percentage: (reviewStats.distribution[star as keyof typeof reviewStats.distribution] / total) * 100
        }));
    };

    const mapProductToCardBook = (book: Product): CardBook => ({
        _id: book._id,
        title: {
            uz: book.title.uz,
            ru: book.title.ru || '',
            en: book.title.en || ''
        },
        author: { name: book.author.name },
        price: book.discountPrice && book.discountPrice > 0 ? book.discountPrice : book.price,
        oldPrice: book.discountPrice && book.discountPrice > 0 ? book.price : undefined,
        rating: book.ratingAvg,
        reviewsCount: book.ratingCount,
        image: book.images?.[0],
        discount:
            book.discountPrice && book.discountPrice > 0
                ? Math.round(((book.price - book.discountPrice) / book.price) * 100)
                : undefined,
        isHit: book.isTop,
        format: book.format
    });

    // ==================== LOADING STATE ====================
    if (loading) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
                <div className='text-center'>
                    <div className='relative'>
                        <div className='mx-auto mb-4 h-20 w-20 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500 dark:border-blue-400/20 dark:border-t-blue-400' />
                        <BookOpen
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-blue-500 dark:text-blue-400'
                            size={32}
                        />
                    </div>
                    <p className='animate-pulse text-lg text-gray-500 dark:text-gray-400'>
                        Sehrli kitoblar dunyosiga sayohat...
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 py-4 sm:py-8 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900'>
            {/* ========== ANIMATED BACKGROUND ELEMENTS ========== */}
            <div className='pointer-events-none absolute inset-0 z-0 overflow-hidden'>
                {/* Floating Icons */}
                {[...Array(20)].map((_, i) => {
                    const IconComponent = floatingIcons[i % floatingIcons.length];
                    const randomTop = Math.random() * 100;
                    const randomLeft = Math.random() * 100;
                    const randomFontSize = Math.random() * 30 + 15;

                    return (
                        <motion.div
                            key={i}
                            className='absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10'
                            style={{
                                top: `${randomTop}%`,
                                left: `${randomLeft}%`,
                                fontSize: `${randomFontSize}px`
                            }}
                            animate={{
                                y: [0, -20, 20, 0],
                                x: [0, 20, -20, 0],
                                rotate: [0, 180, 360, 0],
                                opacity: [0.1, 0.2, 0.15, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 15 + 10,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}>
                            <IconComponent />
                        </motion.div>
                    );
                })}

                {/* Gradient Orbs with Parallax */}
                <motion.div
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#00a0e3]/5 blur-3xl'
                />
                <motion.div
                    animate={{
                        x: mousePosition.x * -2,
                        y: mousePosition.y * -2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#ef7f1a]/5 blur-3xl'
                />

                {/* Grid Pattern */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' />
            </div>
            <div className='relative z-10 container mx-auto max-w-7xl px-3 sm:px-4'>
                {/* ========== BREADCRUMB ========== */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='scrollbar-hide mb-4 flex items-center gap-1 overflow-x-auto pb-2 text-xs whitespace-nowrap text-gray-500 sm:mb-6 sm:gap-2 sm:text-sm dark:text-gray-400'>
                    <Link
                        href='/'
                        className='flex-shrink-0 transition-colors hover:text-blue-600 dark:hover:text-blue-400'>
                        Bosh sahifa
                    </Link>
                    <ChevronRight size={12} className='flex-shrink-0 sm:size-14' />
                    <Link
                        href='/catalog'
                        className='flex-shrink-0 transition-colors hover:text-blue-600 dark:hover:text-blue-400'>
                        Katalog
                    </Link>
                    <ChevronRight size={12} className='flex-shrink-0 sm:size-14' />
                    <Link
                        href={`/catalog?category=${product.category._id}`}
                        className='flex-shrink-0 transition-colors hover:text-blue-600 dark:hover:text-blue-400'>
                        {product.category.name.uz}
                    </Link>
                    <ChevronRight size={12} className='flex-shrink-0 sm:size-14' />
                    <span className='truncate font-medium text-gray-900 dark:text-white'>{getProductTitle()}</span>
                </motion.div>

                {/* ========== PRODUCT DETAIL SECTION ========== */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='mb-6 grid grid-cols-1 gap-6 sm:mb-8 sm:gap-8 lg:grid-cols-2'>
                    {/* LEFT COLUMN - IMAGES */}
                    <div className='space-y-3 sm:space-y-4'>
                        <div className='group relative h-[300px] overflow-hidden rounded-xl bg-gray-100 sm:h-[400px] sm:rounded-2xl lg:h-[500px] dark:bg-slate-700'>
                            <Image
                                src={
                                    product.images?.[selectedImage] ||
                                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887'
                                }
                                alt={getProductTitle()}
                                fill
                                className='object-cover transition-transform duration-700 group-hover:scale-110'
                                priority
                            />

                            {/* Sale badge */}
                            {product.isDiscount && (
                                <div className='absolute top-3 left-3 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg sm:top-4 sm:left-4 sm:px-3 sm:text-sm'>
                                    -{getDiscountPercentage()}%
                                </div>
                            )}

                            {/* Top badge */}
                            {product.isTop && (
                                <div className='absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-bold text-white shadow-lg sm:top-4 sm:right-4 sm:px-3 sm:text-sm'>
                                    <Award size={14} />
                                    <span>Top</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className='scrollbar-hide flex gap-2 overflow-x-auto pb-2'>
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${
                                            selectedImage === index
                                                ? 'border-blue-500 shadow-lg'
                                                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}>
                                        <Image
                                            src={img}
                                            alt={`${getProductTitle()} ${index + 1}`}
                                            fill
                                            className='object-cover'
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - INFO */}
                    <div className='space-y-4 sm:space-y-6'>
                        {/* Title */}
                        <div>
                            <h1 className='mb-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl dark:text-white'>
                                {getProductTitle()}
                            </h1>

                            {/* Author & Category */}
                            <div className='flex flex-wrap items-center gap-2 text-sm sm:gap-4 sm:text-base'>
                                <Link
                                    href={`/author/${product.author._id}`}
                                    className='text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'>
                                    {product.author.name}
                                </Link>
                                <span className='h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600' />
                                <Link
                                    href={`/catalog?category=${product.category._id}`}
                                    className='text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'>
                                    {product.category.name.uz}
                                </Link>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className='flex flex-wrap items-center gap-2 sm:gap-4'>
                            <div className='flex items-center gap-1'>
                                {[...Array(5)].map((_, i) => {
                                    const rating = product.ratingAvg;
                                    const filled = i < Math.floor(rating);
                                    const halfFilled = !filled && i < Math.ceil(rating) && rating % 1 !== 0;

                                    return (
                                        <div key={i} className='relative'>
                                            <Star size={18} className='text-gray-300 dark:text-gray-600' />
                                            <div
                                                className='absolute inset-0 overflow-hidden'
                                                style={{ width: halfFilled ? '50%' : filled ? '100%' : '0%' }}>
                                                <Star size={18} className='fill-yellow-400 text-yellow-400' />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <span className='font-semibold text-gray-900 dark:text-white'>
                                {product.ratingAvg.toFixed(1)}
                            </span>
                            <span className='text-gray-400 dark:text-gray-500'>({product.ratingCount} ta baho)</span>
                            {product.views && (
                                <>
                                    <span className='h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600' />
                                    <span className='flex items-center gap-1 text-gray-400 dark:text-gray-500'>
                                        <Eye size={14} />
                                        {product.views}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Price */}
                        <div className='rounded-xl bg-gradient-to-r from-blue-50 to-orange-50 p-4 sm:p-6 dark:from-blue-900/20 dark:to-orange-900/20'>
                            {product.discountPrice && product.discountPrice > 0 ? (
                                <div className='flex flex-wrap items-center gap-3'>
                                    <span className='bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
                                        {product.discountPrice.toLocaleString()}
                                        {" so'm "}
                                    </span>
                                    <span className='text-lg text-gray-400 line-through sm:text-xl'>
                                        {product.price.toLocaleString()}
                                        {" so'm "}
                                    </span>
                                    <span className='rounded-full bg-red-500 px-3 py-1 text-sm text-white'>
                                        -{getDiscountPercentage()}%
                                    </span>
                                </div>
                            ) : (
                                <span className='bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
                                    {product.price.toLocaleString()}
                                    {" so'm "}
                                </span>
                            )}
                        </div>

                        {/* Format & Stock */}
                        <div className='flex flex-wrap items-center gap-4'>
                            {product.format && (
                                <div className='flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-slate-700'>
                                    {getFormatIcon()}
                                    <span className='font-medium text-gray-700 dark:text-gray-300'>
                                        {getFormatLabel()}
                                    </span>
                                </div>
                            )}

                            <div className='flex items-center gap-2'>
                                {product.stock > 0 ? (
                                    <>
                                        <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                                        <span className='font-medium text-green-600 dark:text-green-400'>
                                            {product.stock === 1 ? "So'nggi nusxa!" : `${product.stock} dona mavjud`}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className='h-2 w-2 rounded-full bg-red-500' />
                                        <span className='font-medium text-red-600 dark:text-red-400'>Mavjud emas</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className='flex items-center gap-4'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>Miqdor:</span>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className='flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:border-blue-500 disabled:opacity-50 sm:h-10 sm:w-10 dark:border-gray-600'>
                                    <Minus size={16} />
                                </button>
                                <span className='w-10 text-center text-lg font-semibold sm:w-12'>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                    className='flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:border-blue-500 disabled:opacity-50 sm:h-10 sm:w-10 dark:border-gray-600'>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col gap-3 sm:flex-row'>
                            <Button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className='flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl sm:py-4 sm:text-lg'>
                                <ShoppingCart size={20} className='mr-2' />
                                {" Savatga qo'shish "}
                            </Button>

                            <Button
                                onClick={handleToggleWishlist}
                                variant='outline'
                                className={`flex-1 rounded-xl border-2 py-3 text-base transition-all sm:py-4 sm:text-lg ${
                                    isInWishlist
                                        ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                        : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300'
                                }`}>
                                <Heart size={20} className='mr-2' fill={isInWishlist ? 'currentColor' : 'none'} />
                                {isInWishlist ? 'Sevimlilarda' : "Sevimlilarga qo'shish"}
                            </Button>
                        </div>

                        {/* Benefits */}
                        <div className='grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 dark:border-gray-700'>
                            <div className='text-center'>
                                <Truck size={20} className='mx-auto mb-1 text-gray-400' />
                                <span className='text-xs text-gray-500'>Bepul yetkazish</span>
                            </div>
                            <div className='text-center'>
                                <Shield size={20} className='mx-auto mb-1 text-gray-400' />
                                <span className='text-xs text-gray-500'>Kafolat</span>
                            </div>
                            <div className='text-center'>
                                <RotateCcw size={20} className='mx-auto mb-1 text-gray-400' />
                                <span className='text-xs text-gray-500'>14 kun qaytarish</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ========== TABS (Mobile Dropdown) ========== */}
                <div className='mb-4 lg:hidden'>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className='flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-800'>
                        <span className='font-semibold text-gray-900 dark:text-white'>
                            {activeTab === 'details' && 'The Details'}
                            {activeTab === 'reviews' && `Ratings & Reviews (${reviewStats.total})`}
                            {activeTab === 'discussion' && 'Discussion'}
                        </span>
                        <ChevronDown
                            size={20}
                            className={`transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className='mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-slate-800'>
                                <button
                                    onClick={() => {
                                        setActiveTab('details');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 ${
                                        activeTab === 'details'
                                            ? 'font-semibold text-blue-600'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    The Details
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('reviews');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full border-t border-gray-100 p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-slate-700 ${
                                        activeTab === 'reviews'
                                            ? 'font-semibold text-blue-600'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    Ratings & Reviews ({reviewStats.total})
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('discussion');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full border-t border-gray-100 p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-slate-700 ${
                                        activeTab === 'discussion'
                                            ? 'font-semibold text-blue-600'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    Discussion
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ========== TABS (Desktop) ========== */}
                <div className='mb-6 hidden border-b border-gray-200 lg:block dark:border-gray-700'>
                    <div className='flex gap-8'>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`relative py-4 font-medium transition-colors ${
                                activeTab === 'details'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}>
                            The Details
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`relative py-4 font-medium transition-colors ${
                                activeTab === 'reviews'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}>
                            Ratings & Reviews ({reviewStats.total})
                        </button>
                        <button
                            onClick={() => setActiveTab('discussion')}
                            className={`relative py-4 font-medium transition-colors ${
                                activeTab === 'discussion'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}>
                            Discussion
                        </button>
                    </div>
                </div>

                {/* ========== TAB CONTENT ========== */}
                <AnimatePresence mode='wait'>
                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <motion.div
                            key='details'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='mb-8'>
                            <div className='rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-slate-800'>
                                <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white'>
                                    <Info size={20} className='text-blue-500' />
                                    The Details
                                </h2>

                                {/* Description */}
                                <div className='mb-6'>
                                    <p className='leading-relaxed text-gray-600 dark:text-gray-400'>
                                        {getProductDescription()}
                                    </p>
                                </div>

                                {/* Product Specifications */}
                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                    {product.publisher && (
                                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-slate-700/50'>
                                            <Package size={18} className='mt-1 text-blue-500' />
                                            <div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>Nashriyot</p>
                                                <p className='font-medium text-gray-900 dark:text-white'>
                                                    {product.publisher}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {product.publishedYear && (
                                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-slate-700/50'>
                                            <Calendar size={18} className='mt-1 text-orange-500' />
                                            <div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>Yili</p>
                                                <p className='font-medium text-gray-900 dark:text-white'>
                                                    {product.publishedYear}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {product.pages && (
                                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-slate-700/50'>
                                            <FileText size={18} className='mt-1 text-green-500' />
                                            <div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>Sahifalar</p>
                                                <p className='font-medium text-gray-900 dark:text-white'>
                                                    {product.pages}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {product.language && (
                                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-slate-700/50'>
                                            <Globe size={18} className='mt-1 text-purple-500' />
                                            <div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>Til</p>
                                                <p className='font-medium text-gray-900 dark:text-white'>
                                                    {product.language === 'uz'
                                                        ? "O'zbek"
                                                        : product.language === 'ru'
                                                          ? 'Русский'
                                                          : 'English'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {product.isbn && (
                                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-slate-700/50'>
                                            <Hash size={18} className='mt-1 text-pink-500' />
                                            <div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>ISBN</p>
                                                <p className='font-medium text-gray-900 dark:text-white'>
                                                    {product.isbn}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {product.format && (
                                        <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-slate-700/50'>
                                            {product.format === 'audio' ? (
                                                <Mic2 size={18} className='mt-1 text-orange-500' />
                                            ) : product.format === 'ebook' ? (
                                                <BookCopy size={18} className='mt-1 text-blue-500' />
                                            ) : (
                                                <Library size={18} className='mt-1 text-green-500' />
                                            )}
                                            <div>
                                                <p className='text-xs text-gray-500 dark:text-gray-400'>Format</p>
                                                <p className='font-medium text-gray-900 dark:text-white'>
                                                    {getFormatLabel()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* REVIEWS TAB */}
                    {activeTab === 'reviews' && (
                        <motion.div
                            key='reviews'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='mb-8'>
                            <div className='rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-slate-800'>
                                {/* Header */}
                                <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                                    <h2 className='flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white'>
                                        <Star size={20} className='fill-yellow-400 text-yellow-400' />
                                        Ratings & Reviews ({reviewStats.total})
                                    </h2>

                                    {isAuthenticated && canReview && !userExistingReview && (
                                        <Button
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                            className='bg-blue-600 text-white hover:bg-blue-700'>
                                            <MessageSquare size={16} className='mr-2' />
                                            Sharh yozish
                                        </Button>
                                    )}

                                    {userExistingReview && !showReviewForm && (
                                        <div className='flex gap-2'>
                                            <Button onClick={handleEditReview} variant='outline' size='sm'>
                                                Tahrirlash
                                            </Button>
                                            <Button
                                                onClick={handleDeleteReview}
                                                variant='outline'
                                                size='sm'
                                                className='border-red-200 text-red-600 hover:bg-red-50'>
                                                {" O'chirish "}
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Review Stats */}
                                {reviewStats.total > 0 && (
                                    <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
                                        <div className='rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 p-6 text-center dark:from-blue-900/20 dark:to-orange-900/20'>
                                            <div className='text-4xl font-bold text-gray-900 dark:text-white'>
                                                {reviewStats.average.toFixed(1)}
                                            </div>
                                            <div className='my-2 flex items-center justify-center gap-1'>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={18}
                                                        className={
                                                            i < Math.round(reviewStats.average)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300 dark:text-gray-600'
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {reviewStats.total} ta baho
                                            </p>
                                        </div>

                                        <div className='space-y-2 md:col-span-2'>
                                            {getRatingBreakdown().map((item) => (
                                                <div key={item.rating} className='flex items-center gap-2'>
                                                    <span className='w-8 text-sm text-gray-600 dark:text-gray-400'>
                                                        {item.rating} ★
                                                    </span>
                                                    <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700'>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.percentage}%` }}
                                                            transition={{ duration: 0.5, delay: item.rating * 0.1 }}
                                                            className='h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500'
                                                        />
                                                    </div>
                                                    <span className='w-8 text-sm text-gray-600 dark:text-gray-400'>
                                                        {item.count}
                                                    </span>
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
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className='mb-6 overflow-hidden'>
                                            <div className='rounded-xl bg-gray-50 p-4 sm:p-6 dark:bg-slate-700/50'>
                                                <h3 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>
                                                    {editingReview ? 'Sharhni tahrirlash' : 'Yangi sharh qoldirish'}
                                                </h3>

                                                {/* Rating Selection */}
                                                <div className='mb-4'>
                                                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                        Baholang
                                                    </label>
                                                    <div className='flex gap-2'>
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() =>
                                                                    setUserReview({ ...userReview, rating: star })
                                                                }
                                                                className={`rounded-lg p-2 transition-all hover:scale-110 ${
                                                                    userReview.rating >= star
                                                                        ? 'text-yellow-400'
                                                                        : 'text-gray-300 dark:text-gray-600'
                                                                }`}>
                                                                <Star
                                                                    size={28}
                                                                    fill={
                                                                        userReview.rating >= star
                                                                            ? 'currentColor'
                                                                            : 'none'
                                                                    }
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Comment */}
                                                <div className='mb-4'>
                                                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                        Sharh matni
                                                    </label>
                                                    <textarea
                                                        value={userReview.comment}
                                                        onChange={(e) =>
                                                            setUserReview({ ...userReview, comment: e.target.value })
                                                        }
                                                        rows={4}
                                                        placeholder='Kitob haqida fikringiz...'
                                                        className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-slate-800 dark:text-white'
                                                    />
                                                </div>

                                                {/* Image Upload */}
                                                <div className='mb-4'>
                                                    <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                        Rasmlar (ixtiyoriy)
                                                    </label>
                                                    <div className='flex flex-wrap gap-3'>
                                                        {userReview.images.map((file, index) => (
                                                            <div key={index} className='group relative h-20 w-20'>
                                                                <Image
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={`Review ${index + 1}`}
                                                                    fill
                                                                    className='rounded-lg object-cover'
                                                                />
                                                                <button
                                                                    onClick={() => removeReviewImage(index)}
                                                                    className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100'>
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {reviewImages.map((url, index) => (
                                                            <div
                                                                key={`existing-${index}`}
                                                                className='relative h-20 w-20'>
                                                                <Image
                                                                    src={url}
                                                                    alt={`Existing review ${index + 1}`}
                                                                    fill
                                                                    className='rounded-lg object-cover'
                                                                />
                                                            </div>
                                                        ))}
                                                        {userReview.images.length + reviewImages.length < 3 && (
                                                            <label className='flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white transition-colors hover:border-blue-500 dark:border-gray-600 dark:bg-slate-800'>
                                                                <Camera size={24} className='text-gray-400' />
                                                                <input
                                                                    type='file'
                                                                    multiple
                                                                    accept='image/*'
                                                                    onChange={handleReviewImageUpload}
                                                                    className='hidden'
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                    <p className='mt-2 text-xs text-gray-400 dark:text-gray-500'>
                                                        Maksimal 3 ta rasm (jpeg, png)
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className='flex gap-3'>
                                                    <Button
                                                        onClick={handleSubmitReview}
                                                        disabled={submittingReview}
                                                        className='bg-blue-600 text-white hover:bg-blue-700'>
                                                        {submittingReview ? (
                                                            <Loader2 size={18} className='mr-2 animate-spin' />
                                                        ) : null}
                                                        {submittingReview ? 'Yuborilmoqda...' : 'Yuborish'}
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setShowReviewForm(false);
                                                            setEditingReview(false);
                                                            if (!userExistingReview) {
                                                                setUserReview({ rating: 5, comment: '', images: [] });
                                                            }
                                                        }}
                                                        variant='outline'>
                                                        Bekor qilish
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Reviews List */}
                                {loadingReviews ? (
                                    <div className='space-y-4'>
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className='h-32 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-700'
                                            />
                                        ))}
                                    </div>
                                ) : sortedReviews.length > 0 ? (
                                    <div className='space-y-6'>
                                        {sortedReviews.map((review) => (
                                            <div
                                                key={review._id}
                                                className='border-b border-gray-100 pb-6 last:border-0 last:pb-0 dark:border-gray-700'>
                                                <div className='flex gap-3'>
                                                    {/* Avatar */}
                                                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500 font-bold text-white'>
                                                        {review.user.avatar ? (
                                                            <Image
                                                                src={review.user.avatar}
                                                                alt={review.user.name}
                                                                width={40}
                                                                height={40}
                                                                className='rounded-full object-cover'
                                                            />
                                                        ) : (
                                                            <span>{review.user.name.charAt(0)}</span>
                                                        )}
                                                    </div>

                                                    <div className='flex-1'>
                                                        {/* Header */}
                                                        <div className='mb-1 flex flex-wrap items-center justify-between gap-2'>
                                                            <div className='flex items-center gap-2'>
                                                                <h4 className='font-semibold text-gray-900 dark:text-white'>
                                                                    {review.user.name}
                                                                </h4>
                                                                {review.isPurchased && (
                                                                    <span className='inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600 dark:bg-green-900/20'>
                                                                        <CheckCircle size={10} />
                                                                        Sotib olingan
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className='text-xs text-gray-400'>
                                                                {formatDate(review.createdAt)}
                                                            </span>
                                                        </div>

                                                        {/* Rating */}
                                                        <div className='mb-2 flex items-center gap-1'>
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={
                                                                        i < review.rating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300 dark:text-gray-600'
                                                                    }
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* Comment */}
                                                        <p className='mb-3 text-sm text-gray-700 sm:text-base dark:text-gray-300'>
                                                            {review.comment}
                                                        </p>

                                                        {/* Images */}
                                                        {review.images && review.images.length > 0 && (
                                                            <div className='mb-3 flex gap-2'>
                                                                {review.images.map((img, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className='relative h-16 w-16 overflow-hidden rounded-lg'>
                                                                        <Image
                                                                            src={img}
                                                                            alt={`Review image ${idx + 1}`}
                                                                            fill
                                                                            className='object-cover'
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Actions */}
                                                        <div className='flex items-center gap-4'>
                                                            <button
                                                                onClick={() => handleLikeReview(review._id)}
                                                                className='flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-blue-600'>
                                                                <ThumbsUp size={14} />
                                                                <span>{review.likes || 0}</span>
                                                            </button>
                                                            <button
                                                                onClick={() => toggleReplyForm(review._id)}
                                                                className='flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-blue-600'>
                                                                <MessageCircle size={14} />
                                                                <span>Reply</span>
                                                            </button>
                                                        </div>

                                                        {/* Reply Form */}
                                                        {showReplyForm[review._id] && (
                                                            <div className='mt-3 flex gap-2'>
                                                                <input
                                                                    type='text'
                                                                    value={replyText[review._id] || ''}
                                                                    onChange={(e) =>
                                                                        handleReplyChange(review._id, e.target.value)
                                                                    }
                                                                    placeholder='Write a reply...'
                                                                    className='flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-800'
                                                                />
                                                                <Button
                                                                    onClick={() => handleSubmitReply(review._id)}
                                                                    disabled={submittingReply[review._id]}
                                                                    size='sm'
                                                                    className='bg-blue-600 text-white hover:bg-blue-700'>
                                                                    {submittingReply[review._id] ? (
                                                                        <Loader2 size={14} className='animate-spin' />
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
                                    <div className='py-12 text-center'>
                                        <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700'>
                                            <MessageCircle size={32} className='text-gray-400' />
                                        </div>
                                        <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                                            Hali sharhlar mavjud emas
                                        </h3>
                                        <p className='mb-4 text-gray-500 dark:text-gray-400'>
                                            {" Bu kitob haqida birinchi bo'lib fikr bildiring "}
                                        </p>
                                        {canReview && !userExistingReview && (
                                            <Button
                                                onClick={() => setShowReviewForm(true)}
                                                className='bg-blue-600 text-white hover:bg-blue-700'>
                                                <MessageSquare size={16} className='mr-2' />
                                                Birinchi sharh yozish
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* DISCUSSION TAB */}
                    {activeTab === 'discussion' && (
                        <motion.div
                            key='discussion'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='mb-8'>
                            <div className='rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-slate-800'>
                                {/* Header */}
                                <div className='mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                                    <h2 className='flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white'>
                                        <MessageCircle size={20} className='text-blue-500' />
                                        Discussion
                                    </h2>

                                    <div className='flex w-full items-center gap-2 sm:w-auto'>
                                        <span className='text-sm whitespace-nowrap text-gray-500'>Sort by</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
                                            className='flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm sm:flex-none dark:border-gray-700 dark:bg-slate-800'>
                                            <option value='newest'>Newest</option>
                                            <option value='popular'>Popular</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Discussion List */}
                                {sortedReviews.length > 0 ? (
                                    <div className='space-y-6'>
                                        {sortedReviews.map((review) => (
                                            <div
                                                key={review._id}
                                                className='border-b border-gray-100 pb-6 last:border-0 last:pb-0 dark:border-gray-700'>
                                                {/* Review */}
                                                <div className='flex gap-3'>
                                                    <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-orange-500 font-bold text-white'>
                                                        {review.user.avatar ? (
                                                            <Image
                                                                src={review.user.avatar}
                                                                alt={review.user.name}
                                                                width={40}
                                                                height={40}
                                                                className='rounded-full object-cover'
                                                            />
                                                        ) : (
                                                            <span>{review.user.name.charAt(0)}</span>
                                                        )}
                                                    </div>

                                                    <div className='flex-1'>
                                                        <div className='mb-1 flex flex-wrap items-center justify-between gap-2'>
                                                            <h4 className='font-semibold text-gray-900 dark:text-white'>
                                                                {review.user.name}
                                                            </h4>
                                                            <span className='text-xs text-gray-400'>
                                                                {formatDate(review.createdAt)}
                                                            </span>
                                                        </div>

                                                        <p className='mb-2 text-sm text-gray-700 sm:text-base dark:text-gray-300'>
                                                            {review.comment}
                                                        </p>

                                                        {/* Actions */}
                                                        <div className='flex items-center gap-4'>
                                                            <button className='flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600'>
                                                                <ThumbsUp size={14} />
                                                                <span>{review.likes || 0}</span>
                                                            </button>
                                                            <button
                                                                onClick={() => toggleReplyForm(review._id)}
                                                                className='flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600'>
                                                                <MessageCircle size={14} />
                                                                <span>Reply</span>
                                                            </button>

                                                            {review.replyCount ? (
                                                                <button
                                                                    onClick={() => toggleReplies(review._id)}
                                                                    className='flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700'>
                                                                    <span>
                                                                        {review.replyCount}{' '}
                                                                        {review.replyCount === 1 ? 'reply' : 'replies'}
                                                                    </span>
                                                                    {showReplies[review._id] ? (
                                                                        <ChevronUp size={14} />
                                                                    ) : (
                                                                        <ChevronDown size={14} />
                                                                    )}
                                                                </button>
                                                            ) : null}
                                                        </div>

                                                        {/* Reply Form */}
                                                        {showReplyForm[review._id] && (
                                                            <div className='mt-3 flex gap-2'>
                                                                <input
                                                                    type='text'
                                                                    value={replyText[review._id] || ''}
                                                                    onChange={(e) =>
                                                                        handleReplyChange(review._id, e.target.value)
                                                                    }
                                                                    placeholder='Write a reply...'
                                                                    className='flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-slate-800'
                                                                />
                                                                <Button
                                                                    onClick={() => handleSubmitReply(review._id)}
                                                                    disabled={submittingReply[review._id]}
                                                                    size='sm'
                                                                    className='bg-blue-600 text-white hover:bg-blue-700'>
                                                                    {submittingReply[review._id] ? (
                                                                        <Loader2 size={14} className='animate-spin' />
                                                                    ) : (
                                                                        <Send size={14} />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Replies */}
                                                {showReplies[review._id] &&
                                                    review.replies &&
                                                    review.replies.length > 0 && (
                                                        <div className='mt-4 ml-12 space-y-4'>
                                                            {review.replies.map((reply) => (
                                                                <div key={reply._id} className='flex gap-3'>
                                                                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold dark:bg-slate-700'>
                                                                        {reply.user.avatar ? (
                                                                            <Image
                                                                                src={reply.user.avatar}
                                                                                alt={reply.user.name}
                                                                                width={32}
                                                                                height={32}
                                                                                className='rounded-full object-cover'
                                                                            />
                                                                        ) : (
                                                                            <span>{reply.user.name.charAt(0)}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className='flex-1'>
                                                                        <div className='mb-1 flex items-center gap-2'>
                                                                            <span className='text-sm font-medium text-gray-900 dark:text-white'>
                                                                                {reply.user.name}
                                                                            </span>
                                                                            <span className='text-xs text-gray-400'>
                                                                                {formatDate(reply.createdAt)}
                                                                            </span>
                                                                        </div>
                                                                        <p className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
                                                                            {reply.comment}
                                                                        </p>
                                                                        <button className='flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600'>
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
                                    <div className='py-12 text-center'>
                                        <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700'>
                                            <MessageCircle size={32} className='text-gray-400' />
                                        </div>
                                        <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                                            {" Hali muhokamalar yo'q "}
                                        </h3>
                                        <p className='text-gray-500 dark:text-gray-400'>
                                            {" Bu kitob haqida birinchi bo'lib muhokama boshlang "}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ========== RELATED PRODUCTS ========== */}
                {relatedProducts.length > 0 && (
                    <div className='mt-8 sm:mt-12'>
                        <h2 className='mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl dark:text-white'>
                            <Sparkles size={24} className='text-orange-500' />
                            {" O'xshash kitoblar "}
                        </h2>

                        <div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4'>
                            {relatedProducts.map((book, index) => (
                                <motion.div
                                    key={book._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}>
                                    <BookCard book={mapProductToCardBook(book)} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========== BRAND SECTION ========== */}
                <div className='mt-8 rounded-xl border border-gray-100 bg-gradient-to-r from-blue-50 to-orange-50 p-4 sm:mt-12 sm:p-6 dark:border-gray-700 dark:from-blue-900/20 dark:to-orange-900/20'>
                    <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl'>
                            B
                        </div>
                        <div className='flex-1'>
                            <h3 className='mb-1 text-base font-bold text-gray-900 sm:text-lg dark:text-white'>
                                BOOK.UZ
                            </h3>
                            <p className='text-xs text-gray-500 sm:text-sm dark:text-gray-400'>
                                {
                                    " O'zbekistonning eng katta onlayn kitob do'koni. 50,000+ kitoblar, audio kitoblar va elektron nashrlar. "
                                }
                            </p>
                        </div>
                    </div>
                    <div className='mt-4 flex flex-wrap gap-4 border-t border-gray-200 pt-4 sm:gap-6 dark:border-gray-700'>
                        <Link
                            href='/catalog'
                            className='text-xs text-gray-600 hover:text-blue-600 sm:text-sm dark:text-gray-400'>
                            Barcha kitoblar
                        </Link>
                        <Link
                            href='/catalog?isDiscount=true'
                            className='text-xs text-gray-600 hover:text-blue-600 sm:text-sm dark:text-gray-400'>
                            Chegirmalar
                        </Link>
                        <Link
                            href='/catalog?isTop=true'
                            className='text-xs text-gray-600 hover:text-blue-600 sm:text-sm dark:text-gray-400'>
                            Top kitoblar
                        </Link>
                        <Link
                            href='/catalog?format=audio'
                            className='text-xs text-gray-600 hover:text-blue-600 sm:text-sm dark:text-gray-400'>
                            Audio kitoblar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
