"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  RefreshCw,
  Loader2,
  Download,
  Printer,
  MessageCircle,
  Star,
  Phone,
  Mail,
  Home,
  AlertCircle,
  ChevronRight,
  FileText,
  Share2,
  Shield,
  Sparkles,
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
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { toast } from "react-hot-toast";

interface OrderItem {
  product: {
    _id: string;
    title?: {
      uz: string;
      ru?: string;
      en?: string;
    };
    images?: string[];
    price?: number;
    author?: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber?: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  totalAmount: number;
  subtotal?: number;
  discount?: number;
  deliveryCost?: number;
  shippingAddress: {
    city: string;
    region: string;
    street: string;
    apartment?: string;
    phone?: string;
    fullName?: string;
  };
  deliveryType: 'STANDARD' | 'EXPRESS' | 'PICKUP';
  paymentType: 'CARD' | 'CASH' | 'ONLINE';
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  note?: string;
  pickupPoint?: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'tracking' | 'support'>('details');
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
  const floatingIcons = [Package, Clock, Truck, Star, Sparkles, Crown, Zap, Award, Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass, TrendingUp];

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    loadOrderDetails();
  }, [isAuthenticated, authLoading, router, params.id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${params.id}`);
      
      if (response.data?.success) {
        setOrder(response.data.data);
      } else {
        toast.error("Buyurtma topilmadi");
        router.push('/orders');
      }
    } catch (error) {
      console.error("Buyurtma yuklanmadi:", error);
      toast.error("Buyurtma yuklanmadi");
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Bu buyurtmani bekor qilishni tasdiqlaysizmi?")) return;
    
    try {
      setCancelling(true);
      const response = await api.put(`/orders/${params.id}/cancel`);
      
      if (response.data?.success) {
        toast.success("Buyurtma bekor qilindi");
        loadOrderDetails();
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    try {
      const response = await api.post(`/orders/${params.id}/reorder`);
      
      if (response.data?.success) {
        toast.success("Mahsulotlar savatga qo'shildi");
        router.push('/cart');
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleDownloadInvoice = () => {
    toast.success("Hisob-faktura yuklanmoqda...");
  };

  const handleTrackOrder = () => {
    if (order?.trackingNumber) {
      window.open(`https://www.post.uz/tracking/${order.trackingNumber}`, '_blank');
    }
  };

  const handleContactSupport = () => {
    toast.success("Operator bilan bog'lanmoqda...");
  };

  const handleShareOrder = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Havola nusxalandi");
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: string, size: number = 20) => {
    switch(status) {
      case 'PENDING': return <Clock size={size} className="text-yellow-600 dark:text-yellow-400" />;
      case 'PROCESSING': return <Package size={size} className="text-blue-600 dark:text-blue-400" />;
      case 'SHIPPED': return <Truck size={size} className="text-purple-600 dark:text-purple-400" />;
      case 'DELIVERED': return <CheckCircle size={size} className="text-green-600 dark:text-green-400" />;
      case 'CANCELLED': return <XCircle size={size} className="text-red-600 dark:text-red-400" />;
      default: return <Package size={size} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'PENDING': return 'Kutilmoqda';
      case 'PROCESSING': return 'Jarayonda';
      case 'SHIPPED': return 'Yuborilgan';
      case 'DELIVERED': return 'Yetkazilgan';
      case 'CANCELLED': return 'Bekor qilingan';
      default: return status;
    }
  };

  const getStatusDescription = (status: string) => {
    switch(status) {
      case 'PENDING': return 'Buyurtmangiz qabul qilindi va tekshirilmoqda';
      case 'PROCESSING': return 'Buyurtmangiz tayyorlanmoqda';
      case 'SHIPPED': return 'Buyurtmangiz jo\'natildi';
      case 'DELIVERED': return 'Buyurtmangiz yetkazib berildi';
      case 'CANCELLED': return 'Buyurtma bekor qilingan';
      default: return '';
    }
  };

  const getStatusProgress = (status: string) => {
    const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = steps.indexOf(status);
    return currentIndex >= 0 ? (currentIndex + 1) * 25 : 0;
  };

  const getDeliveryTypeText = (type: string) => {
    switch(type) {
      case 'STANDARD': return 'Standart yetkazish';
      case 'EXPRESS': return 'Ekspress yetkazish';
      case 'PICKUP': return 'Do\'kondan olib ketish';
      default: return type;
    }
  };

  const getDeliveryTypeIcon = (type: string) => {
    switch(type) {
      case 'STANDARD': return <Truck size={18} className="text-gray-500 dark:text-gray-400" />;
      case 'EXPRESS': return <Truck size={18} className="text-[#FF8A00] dark:text-orange-400" />;
      case 'PICKUP': return <Home size={18} className="text-[#005CB9] dark:text-blue-400" />;
      default: return <Truck size={18} className="text-gray-400" />;
    }
  };

  const getPaymentTypeText = (type: string) => {
    switch(type) {
      case 'CARD': return 'Karta orqali';
      case 'CASH': return 'Naqd pul';
      case 'ONLINE': return 'Online to\'lov';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getProductTitle = (item: OrderItem): string => {
    if (item.product?.title) {
      if (typeof item.product.title === 'string') {
        return item.product.title;
      }
      return item.product.title.uz || item.product.title.ru || item.product.title.en || "Noma'lum kitob";
    }
    return "Noma'lum kitob";
  };

  const getProductImage = (item: OrderItem): string => {
    if (item.product?.images && item.product.images.length > 0) {
      return item.product.images[0];
    }
    return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887";
  };

  const getItemPrice = (item: OrderItem): number => {
    return item.price || item.product?.price || 0;
  };

  const getItemTotal = (item: OrderItem): number => {
    return (item.quantity || 0) * getItemPrice(item);
  };

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
            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#005CB9] dark:text-blue-400" size={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Buyurtma yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !order) {
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

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Back Button with animation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors mb-6 group"
        >
          <motion.div 
            whileHover={{ x: -3 }}
            className="p-1 rounded-lg group-hover:bg-[#005CB9]/10 dark:group-hover:bg-blue-400/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </motion.div>
          <span>Orqaga</span>
        </motion.button>

        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                whileHover={{ rotate: 360 }}
                className={`p-3 rounded-xl ${getStatusColor(order.status)}`}
              >
                {getStatusIcon(order.status, 24)}
              </motion.div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                    Buyurtma #{order.orderNumber || order._id.slice(-8)}
                  </h1>
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </motion.span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShareOrder}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Havolani nusxalash"
                  >
                    <Share2 size={14} className="text-gray-400" />
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Buyurtma summasi</p>
              <motion.p 
                key={order.totalAmount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-black text-[#005CB9] dark:text-blue-400"
              >
                {order.totalAmount?.toLocaleString() || 0} so'm
              </motion.p>
            </div>
          </div>

          {/* Status Progress Bar */}
          {order.status !== 'CANCELLED' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Kutilmoqda</span>
                <span>Jarayonda</span>
                <span>Yuborilgan</span>
                <span>Yetkazilgan</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${getStatusProgress(order.status)}%` }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-500 dark:to-orange-500"
                />
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-gray-600 dark:text-gray-300 mt-2"
              >
                {getStatusDescription(order.status)}
              </motion.p>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {[
            { id: 'details', label: 'Buyurtma tafsilotlari', icon: Package },
            { id: 'tracking', label: 'Kuzatish', icon: Truck },
            { id: 'support', label: 'Qo\'llab-quvvatlash', icon: MessageCircle },
          ].map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white shadow-md'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'details' && (
              <>
                {/* Items */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
                >
                  <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package size={18} className="text-[#005CB9] dark:text-blue-400" />
                    Kitoblar
                  </h2>
                  <div className="space-y-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.9 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex gap-4 pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0"
                        >
                          <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md group">
                            <Image
                              src={getProductImage(item)}
                              alt={getProductTitle(item)}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <Link 
                              href={`/book/${item.product?._id}`} 
                              className="font-bold text-gray-900 dark:text-white hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors"
                            >
                              {getProductTitle(item)}
                            </Link>
                            {item.product?.author && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {item.product.author}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.quantity || 0} x {getItemPrice(item).toLocaleString()} so'm
                            </p>
                          </div>
                          <div className="text-right">
                            <motion.p 
                              key={getItemTotal(item)}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="font-bold text-[#005CB9] dark:text-blue-400"
                            >
                              {getItemTotal(item).toLocaleString()} so'm
                            </motion.p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">Kitoblar mavjud emas</p>
                    )}
                  </div>

                  {/* Price Summary */}
                  {order.subtotal && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Mahsulotlar summasi</span>
                        <span className="text-gray-900 dark:text-white">{order.subtotal?.toLocaleString()} so'm</span>
                      </div>
                      {order.discount && order.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Chegirma</span>
                          <span className="text-green-600 dark:text-green-400">-{order.discount.toLocaleString()} so'm</span>
                        </div>
                      )}
                      {order.deliveryCost && order.deliveryCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Yetkazish</span>
                          <span className="text-gray-900 dark:text-white">{order.deliveryCost.toLocaleString()} so'm</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100 dark:border-slate-700">
                        <span className="text-gray-900 dark:text-white">Jami</span>
                        <span className="text-[#005CB9] dark:text-blue-400">{order.totalAmount?.toLocaleString()} so'm</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Delivery Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
                >
                  <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Truck size={18} className="text-[#FF8A00] dark:text-orange-400" />
                    Yetkazib berish ma'lumotlari
                  </h2>
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                    >
                      <MapPin size={20} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Manzil</p>
                        {order.shippingAddress?.fullName && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {order.shippingAddress.fullName}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {order.shippingAddress?.city || "Noma'lum"}, {order.shippingAddress?.region || "Noma'lum"}<br />
                          {order.shippingAddress?.street || "Noma'lum"}
                          {order.shippingAddress?.apartment && `, xonadon ${order.shippingAddress.apartment}`}
                        </p>
                        {order.shippingAddress?.phone && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone size={14} />
                            <span>{order.shippingAddress.phone}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                      >
                        {getDeliveryTypeIcon(order.deliveryType)}
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Yetkazish turi</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getDeliveryTypeText(order.deliveryType)}
                          </p>
                        </div>
                      </motion.div>

                      {order.pickupPoint && (
                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1.6 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                        >
                          <Home size={18} className="text-gray-400" />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">Olib ketish punkti</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.pickupPoint}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {order.trackingNumber && (
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.7 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <Package size={18} className="text-purple-600 dark:text-purple-400" />
                          <div>
                            <p className="font-bold text-purple-700 dark:text-purple-400">Tracking raqami</p>
                            <p className="text-sm text-purple-600 dark:text-purple-300 font-mono">{order.trackingNumber}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleTrackOrder}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          Kuzatish
                        </motion.button>
                      </motion.div>
                    )}

                    {order.estimatedDelivery && (
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.8 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                      >
                        <Clock size={18} className="text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-bold text-blue-700 dark:text-blue-400">Taxminiy yetkazish vaqti</p>
                          <p className="text-sm text-blue-600 dark:text-blue-300">
                            {formatShortDate(order.estimatedDelivery)}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {order.note && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.9 }}
                        className="flex gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
                      >
                        <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">{order.note}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === 'tracking' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
              >
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-[#FF8A00] dark:text-orange-400" />
                  Buyurtmani kuzatish
                </h2>
                
                {order.trackingNumber ? (
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                    >
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tracking raqami</p>
                        <p className="text-lg font-mono font-bold text-purple-700 dark:text-purple-400">
                          {order.trackingNumber}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTrackOrder}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
                      >
                        Kuzatish
                      </motion.button>
                    </motion.div>

                    {/* Tracking Timeline */}
                    <div className="space-y-4">
                      {([
                        { status: 'PENDING', label: 'Buyurtma qabul qilindi', date: order.createdAt },
                        { status: 'PROCESSING', label: 'Tayyorlanmoqda', date: order.status !== 'PENDING' ? order.updatedAt : null },
                        { status: 'SHIPPED', label: 'Jo\'natildi', date: null },
                        { status: 'DELIVERED', label: 'Yetkazildi', date: null },
                      ] as Array<{ status: Order["status"]; label: string; date: string | null }>).map((step, index, array) => {
                        const timelineSteps: Order["status"][] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                        const currentStepIndex = timelineSteps.indexOf(order.status);
                        const stepIndex = timelineSteps.indexOf(step.status);
                        const isCompleted = currentStepIndex > stepIndex;
                        
                        const isActive = order.status === step.status;
                        
                        return (
                          <motion.div
                            key={step.status}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 1 }}
                            className="flex gap-3"
                          >
                            <div className="relative">
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 1.1, type: "spring" }}
                                className={`w-4 h-4 rounded-full mt-1 ${
                                  isCompleted ? 'bg-green-500' : isActive ? 'bg-[#005CB9] dark:bg-blue-400 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              />
                              {index < array.length - 1 && (
                                <div className={`absolute top-4 left-2 w-0.5 h-12 -translate-x-1/2 ${
                                  isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`} />
                              )}
                            </div>
                            <div>
                              <p className={`font-bold ${
                                isCompleted ? 'text-gray-900 dark:text-white' : 
                                isActive ? 'text-[#005CB9] dark:text-blue-400' : 
                                'text-gray-400 dark:text-gray-500'
                              }`}>
                                {step.label}
                              </p>
                              {step.date && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(step.date)}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center py-8"
                  >
                    <Truck size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Kuzatish raqami mavjud emas</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
              >
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageCircle size={18} className="text-[#005CB9] dark:text-blue-400" />
                  Qo'llab-quvvatlash
                </h2>
                
                <div className="space-y-4">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                  >
                    <p className="text-blue-800 dark:text-blue-300">
                      Buyurtmangiz bo'yicha savollar bo'lsa, biz bilan bog'lanishingiz mumkin
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { icon: MessageCircle, label: 'Online chat', desc: 'Tezkor javob (5-10 daqiqa)', color: 'blue', action: handleContactSupport },
                      { icon: Phone, label: 'Telefon', desc: '+998 71 234-56-78', color: 'green', href: 'tel:+998712345678' },
                      { icon: Mail, label: 'Email', desc: 'support@example.com', color: 'purple', href: 'mailto:support@example.com' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      const content = (
                        <>
                          <Icon size={20} className={`text-${item.color}-600 dark:text-${item.color}-400`} />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                          </div>
                          <ChevronRight size={18} className="ml-auto text-gray-400" />
                        </>
                      );

                      return item.href ? (
                        <motion.a
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          href={item.href}
                          className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all text-left"
                        >
                          {content}
                        </motion.a>
                      ) : (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={item.action}
                          className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all text-left"
                        >
                          {content}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
                  >
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      <span className="font-bold">Ish vaqti:</span> Dushanba - Juma, 09:00 - 20:00
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
            >
              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-green-600 dark:text-green-400" />
                To'lov ma'lumotlari
              </h2>
              <div className="space-y-3">
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">To'lov turi</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {getPaymentTypeText(order.paymentType)}
                  </span>
                </motion.div>
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.7 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <span className="text-sm text-gray-500 dark:text-gray-400">To'lov holati</span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.paymentStatus === 'PAID' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : order.paymentStatus === 'UNPAID'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : order.paymentStatus === 'REFUNDED'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {order.paymentStatus === 'PAID' ? "To'langan" : 
                       order.paymentStatus === 'UNPAID' ? "To'lanmagan" :
                       order.paymentStatus === 'REFUNDED' ? "Qaytarilgan" : "Noma'lum"}
                    </motion.span>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Download size={16} />
                    Hisob-faktura
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
            >
              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">Amallar</h2>
              <div className="space-y-3">
                {order.status === 'PENDING' && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Button
                      onClick={handleCancelOrder}
                      variant="outline"
                      className="w-full border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      disabled={cancelling}
                    >
                      {cancelling ? (
                        <Loader2 size={16} className="mr-2 animate-spin" />
                      ) : (
                        <XCircle size={16} className="mr-2" />
                      )}
                      {cancelling ? "Bekor qilinmoqda..." : "Buyurtmani bekor qilish"}
                    </Button>
                  </motion.div>
                )}
                
                {order.status === 'DELIVERED' && (
                  <>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Button
                        onClick={handleReorder}
                        className="w-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Qayta buyurtma
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 2.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Link
                        href={`/review?order=${order._id}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:border-[#FF8A00] hover:text-[#FF8A00] dark:hover:border-orange-400 dark:hover:text-orange-400 transition-colors"
                      >
                        <Star size={16} />
                        Baholash
                      </Link>
                    </motion.div>
                  </>
                )}
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    href="/orders"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:border-[#005CB9] hover:text-[#005CB9] dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <FileText size={16} />
                    Barcha buyurtmalar
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Support Quick Action */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <button
                onClick={handleContactSupport}
                className="w-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white rounded-2xl p-4 hover:shadow-lg transition-all"
              >
                <MessageCircle size={24} className="mx-auto mb-2" />
                <p className="font-bold">Yordam kerakmi?</p>
                <p className="text-xs opacity-90">Operator bilan bog'lanishingiz mumkin</p>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Info Icons with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4 }}
          className="mt-8 grid grid-cols-3 gap-2 text-center text-xs"
        >
          {[
            { icon: Truck, text: "Bepul yetkazish" },
            { icon: Shield, text: "Xavfsiz to'lov" },
            { icon: MessageCircle, text: "24/7 qo'llab-quvvatlash" },
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
      </div>
    </div>
  );
}
