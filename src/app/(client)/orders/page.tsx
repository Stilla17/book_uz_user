"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  CreditCard,
  MapPin,
  RefreshCw,
  Loader2,
  Download,
  Printer,
  MessageCircle,
  Star,
  ChevronDown,
  X,
  ShoppingBag,
  Shield,
  Home,
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
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import { toast } from "react-hot-toast";

interface OrderItem {
  product: {
    _id: string;
    title?: string | { uz?: string; ru?: string; en?: string };
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
  shippingAddress: {
    city: string;
    region: string;
    street: string;
    apartment?: string;
    phone?: string;
  };
  deliveryType: 'STANDARD' | 'EXPRESS' | 'PICKUP';
  deliveryCost?: number;
  paymentType: 'CARD' | 'CASH' | 'ONLINE';
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  note?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");
  const [showFilters, setShowFilters] = useState(false);

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

  // Status options
  const statusOptions = [
    { value: "ALL", label: "Barcha statuslar", icon: Package, color: "gray" },
    { value: "PENDING", label: "Kutilmoqda", icon: Clock, color: "yellow" },
    { value: "PROCESSING", label: "Jarayonda", icon: Package, color: "blue" },
    { value: "SHIPPED", label: "Yuborilgan", icon: Truck, color: "purple" },
    { value: "DELIVERED", label: "Yetkazilgan", icon: CheckCircle, color: "green" },
    { value: "CANCELLED", label: "Bekor qilingan", icon: XCircle, color: "red" },
  ];

  // Date filter options
  const dateOptions = [
    { value: "ALL", label: "Barcha vaqt" },
    { value: "WEEK", label: "Oxirgi 7 kun" },
    { value: "MONTH", label: "Oxirgi 30 kun" },
    { value: "3MONTHS", label: "Oxirgi 3 oy" },
    { value: "6MONTHS", label: "Oxirgi 6 oy" },
  ];

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/orders');
      return;
    }
    
    loadOrders();
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter, dateFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-orders');
      
      if (response.data?.success) {
        setOrders(response.data.data || []);
      } else {
        setOrders(mockOrders);
      }
    } catch (error) {
      console.error("Buyurtmalar yuklanmadi:", error);
      toast.error("Buyurtmalar yuklanmadi");
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (dateFilter !== "ALL") {
      const now = new Date();
      const filterDate = new Date();
      
      if (dateFilter === "WEEK") {
        filterDate.setDate(now.getDate() - 7);
      } else if (dateFilter === "MONTH") {
        filterDate.setDate(now.getDate() - 30);
      } else if (dateFilter === "3MONTHS") {
        filterDate.setDate(now.getDate() - 90);
      } else if (dateFilter === "6MONTHS") {
        filterDate.setDate(now.getDate() - 180);
      }
      
      filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(query) ||
        order._id.toLowerCase().includes(query) ||
        order.items.some(item => {
          const title = getProductTitle(item).toLowerCase();
          return title.includes(query);
        })
      );
    }

    setFilteredOrders(filtered);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bu buyurtmani bekor qilishni tasdiqlaysizmi?")) return;
    
    try {
      setCancellingId(orderId);
      const response = await api.put(`/orders/${orderId}/cancel`);
      
      if (response.data?.success) {
        toast.success("Buyurtma bekor qilindi");
        loadOrders();
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setCancellingId(null);
    }
  };

  const handleReorder = async (orderId: string) => {
    try {
      const response = await api.post(`/orders/${orderId}/reorder`);
      
      if (response.data?.success) {
        toast.success("Mahsulotlar savatga qo'shildi");
        router.push('/cart');
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleDownloadInvoice = (orderId: string) => {
    toast.success("Hisob-faktura yuklanmoqda...");
    // PDF yuklab olish logikasi
  };

  const handleTrackOrder = (trackingNumber: string) => {
    window.open(`https://www.post.uz/tracking/${trackingNumber}`, '_blank');
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

  const getStatusIcon = (status: string, size: number = 16) => {
    switch(status) {
      case 'PENDING': return <Clock size={size} className="text-yellow-600 dark:text-yellow-400" />;
      case 'PROCESSING': return <Package size={size} className="text-blue-600 dark:text-blue-400" />;
      case 'SHIPPED': return <Truck size={size} className="text-purple-600 dark:text-purple-400" />;
      case 'DELIVERED': return <CheckCircle size={size} className="text-green-600 dark:text-green-400" />;
      case 'CANCELLED': return <XCircle size={size} className="text-red-600 dark:text-red-400" />;
      default: return <AlertCircle size={size} className="text-gray-600 dark:text-gray-400" />;
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
      case 'STANDARD': return <Truck size={16} className="text-gray-500 dark:text-gray-400" />;
      case 'EXPRESS': return <Truck size={16} className="text-[#FF8A00] dark:text-orange-400" />;
      case 'PICKUP': return <Home size={16} className="text-[#005CB9] dark:text-blue-400" />;
      default: return <Truck size={16} className="text-gray-400" />;
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

  const getProductTitle = (item: OrderItem): string => {
    if (!item.product) return "Noma'lum kitob";
    
    if (typeof item.product.title === 'string') {
      return item.product.title;
    }
    
    if (item.product.title && typeof item.product.title === 'object') {
      return item.product.title.uz || item.product.title.ru || item.product.title.en || "Noma'lum kitob";
    }
    
    return "Noma'lum kitob";
  };

  const getProductImage = (item: OrderItem): string => {
    if (item.product?.images && item.product.images.length > 0 && item.product.images[0]) {
      return item.product.images[0];
    }
    return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887";
  };

  const getItemPrice = (item: OrderItem): number => {
    return item.price || item.product?.price || 0;
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

  // Mock ma'lumotlar
  const mockOrders: Order[] = [
    {
      _id: "ord_1",
      orderNumber: "ORD-2024-0001",
      status: "DELIVERED",
      items: [
        {
          product: {
            _id: "p1",
            title: "Atomic Habits",
            images: ["https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1888"],
            price: 42000,
            author: "James Clear"
          },
          quantity: 1,
          price: 42000
        },
        {
          product: {
            _id: "p2",
            title: "Sariq devni minib",
            images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887"],
            price: 45000,
            author: "Xudoyberdi To'xtaboyev"
          },
          quantity: 1,
          price: 45000
        }
      ],
      totalAmount: 87000,
      shippingAddress: {
        city: "Toshkent",
        region: "Chilonzor",
        street: "Chilonzor 19-kvartal, 45-uy",
        apartment: "24",
        phone: "+998901234567"
      },
      deliveryType: "STANDARD",
      deliveryCost: 15000,
      paymentType: "CARD",
      paymentStatus: "PAID",
      createdAt: "2024-02-15T10:30:00Z",
      updatedAt: "2024-02-15T10:30:00Z",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-02-20T18:00:00Z"
    },
    {
      _id: "ord_2",
      orderNumber: "ORD-2024-0002",
      status: "PROCESSING",
      items: [
        {
          product: {
            _id: "p3",
            title: "Kichik shahzoda",
            images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887"],
            price: 32000,
            author: "Antuan de Sent-Ekzyuperi"
          },
          quantity: 2,
          price: 64000
        }
      ],
      totalAmount: 64000,
      shippingAddress: {
        city: "Samarqand",
        region: "Temir yo'l",
        street: "Amir Temur ko'chasi, 15-uy",
        phone: "+998912345678"
      },
      deliveryType: "EXPRESS",
      deliveryCost: 25000,
      paymentType: "CASH",
      paymentStatus: "UNPAID",
      createdAt: "2024-02-20T14:45:00Z",
      updatedAt: "2024-02-20T14:45:00Z",
      estimatedDelivery: "2024-02-23T18:00:00Z"
    },
    {
      _id: "ord_3",
      orderNumber: "ORD-2024-0003",
      status: "PENDING",
      items: [
        {
          product: {
            _id: "p4",
            title: "Shaytanat",
            images: ["https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=1935"],
            price: 68000,
            author: "Tohir Malik"
          },
          quantity: 1,
          price: 68000
        }
      ],
      totalAmount: 68000,
      shippingAddress: {
        city: "Buxoro",
        region: "Markaz",
        street: "Haqiqat ko'chasi, 7-uy",
        phone: "+998934567890"
      },
      deliveryType: "PICKUP",
      paymentType: "ONLINE",
      paymentStatus: "PAID",
      createdAt: "2024-02-22T09:15:00Z",
      updatedAt: "2024-02-22T09:15:00Z",
      note: "Iltimos, qo'ng'iroq qilib xabardor qiling"
    }
  ];

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
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Buyurtmalar yuklanmoqda...</p>
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
              <Package size={28} className="text-[#005CB9] dark:text-blue-400" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-black"
              >
                <span className="text-[#005CB9] dark:text-blue-400">Mening</span>
                <span className="text-[#FF8A00] dark:text-orange-400"> buyurtmalarim</span>
              </motion.h1>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1"
              >
                <span className="font-bold text-[#005CB9] dark:text-blue-400">{orders.length}</span> ta buyurtma
              </motion.p>
            </div>
          </div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white rounded-xl hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all text-sm font-bold"
            >
              <ShoppingBag size={16} />
              Yangi buyurtma berish
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Cards with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {statusOptions.filter(opt => opt.value !== "ALL").map((opt, index) => {
            const count = orders.filter(o => o.status === opt.value).length;
            if (count === 0) return null;
            
            return (
              <motion.div
                key={opt.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.7 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setStatusFilter(opt.value)}
                className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 p-4 cursor-pointer transition-all hover:shadow-lg ${
                  statusFilter === opt.value ? 'ring-2 ring-[#005CB9] dark:ring-blue-400' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-${opt.color}-100 dark:bg-${opt.color}-900/30`}>
                    {getStatusIcon(opt.value, 18)}
                  </div>
                  <motion.span 
                    key={count}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-black text-gray-900 dark:text-white"
                  >
                    {count}
                  </motion.span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{opt.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search and Filters with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Buyurtma raqami yoki kitob nomi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={14} />
                </motion.button>
              )}
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
              >
                <Filter size={16} />
                Filtrlar
                {(statusFilter !== "ALL" || dateFilter !== "ALL") && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-[#FF8A00] dark:bg-orange-400 rounded-full"
                  />
                )}
                <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 block">{' Vaqt oralig\'i '}</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400"
                    >
                      {dateOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {filteredOrders.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-4"
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 1 }}
                whileHover={{ scale: 1.01, x: 5 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
              >
                {/* Order Header */}
                <div className="p-4 bg-gray-50/80 dark:bg-slate-700/50 backdrop-blur-sm border-b border-gray-100 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`p-2 rounded-lg ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status, 18)}
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {order.orderNumber || `Buyurtma #${order._id.slice(-8)}`}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          {order.paymentStatus === 'PAID' && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center gap-1"
                            >
                              <CheckCircle size={10} />{' To\'langan '}</motion.span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{formatShortDate(order.createdAt)}</span>
                          </div>
                          {order.items && (
                            <div className="flex items-center gap-1">
                              <Package size={12} />
                              <span>{order.items.length} ta kitob</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <motion.span 
                          key={order.totalAmount}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="text-lg font-black text-[#005CB9] dark:text-blue-400"
                        >
                          {(order.totalAmount || 0).toLocaleString()}{' so\'m '}</motion.span>
                        {order.deliveryCost && order.deliveryCost > 0 && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Yetkazish: {order.deliveryCost.toLocaleString()}{' so\'m '}</p>
                        )}
                      </div>
                      <motion.div whileHover={{ x: 5 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetails(true);
                          }}
                          className="text-gray-400 hover:text-[#005CB9] dark:hover:text-blue-400"
                        >
                          <ChevronRight size={20} />
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: index * 0.1 + 1.2, duration: 0.5 }}
                      className="mt-3"
                    >
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Kutilmoqda</span>
                        <span>Jarayonda</span>
                        <span>Yuborilgan</span>
                        <span>Yetkazilgan</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${getStatusProgress(order.status)}%` }}
                          transition={{ delay: index * 0.1 + 1.3, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-500 dark:to-orange-500"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items && order.items.slice(0, 3).map((item, itemIndex) => (
                      <motion.div 
                        key={itemIndex} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + itemIndex * 0.05 + 1.4 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                          <Image
                            src={getProductImage(item)}
                            alt={getProductTitle(item)}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {getProductTitle(item)}
                          </p>
                          {item.product.author && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {item.product.author}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {item.quantity || 0} x {(getItemPrice(item)).toLocaleString()}{' so\'m '}</p>
                        </div>
                      </motion.div>
                    ))}
                    {order.items && order.items.length > 3 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 1.6 }}
                        className="flex items-center justify-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-sm text-gray-500 dark:text-gray-400"
                      >
                        +{order.items.length - 3} ta kitob
                      </motion.div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 1.7 }}
                    className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-slate-700"
                  >
                    {order.status === 'PENDING' && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => handleCancelOrder(order._id)}
                          variant="outline"
                          size="sm"
                          className="text-red-500 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={cancellingId === order._id}
                        >
                          {cancellingId === order._id ? (
                            <Loader2 size={14} className="mr-1 animate-spin" />
                          ) : (
                            <XCircle size={14} className="mr-1" />
                          )}
                          {cancellingId === order._id ? "Bekor qilinmoqda..." : "Bekor qilish"}
                        </Button>
                      </motion.div>
                    )}
                    
                    {order.status === 'DELIVERED' && (
                      <>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => handleReorder(order._id)}
                            variant="outline"
                            size="sm"
                            className="text-[#005CB9] dark:text-blue-400 border-[#005CB9]/20 dark:border-blue-800 hover:bg-[#005CB9]/5 dark:hover:bg-blue-900/20"
                          >
                            <RefreshCw size={14} className="mr-1" />
                            Qayta buyurtma
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => handleDownloadInvoice(order._id)}
                            variant="outline"
                            size="sm"
                            className="text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                          >
                            <Download size={14} className="mr-1" />
                            Hisob-faktura
                          </Button>
                        </motion.div>
                      </>
                    )}
                    
                    {order.status === 'SHIPPED' && order.trackingNumber && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => handleTrackOrder(order.trackingNumber!)}
                          variant="outline"
                          size="sm"
                          className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          <Truck size={14} className="mr-1" />
                          Kuzatish
                        </Button>
                      </motion.div>
                    )}

                    {order.status === 'DELIVERED' && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href={`/review?order=${order._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-[#FF8A00] dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        >
                          <Star size={14} />
                          Baholash
                        </Link>
                      </motion.div>
                    )}

                    <motion.div whileHover={{ x: 5 }} className="ml-auto">
                      <Link
                        href={`/orders/${order._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-[#005CB9] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        Batafsil
                        <ChevronRight size={14} />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty State with animation
          (<motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Package size={48} className="text-[#005CB9] dark:text-blue-400" />
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-2xl font-black text-gray-900 dark:text-white mb-3"
            >{' Buyurtmalar yo\'q '}</motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto"
            >{' Siz hali hech qanday buyurtma bermagansiz. Katalogdan o\'zingizga yoqqan kitoblarni toping va buyurtma bering. '}</motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white font-bold rounded-xl hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
              >
                <ShoppingBag size={18} />{' Katalogga o\'tish '}</Link>
            </motion.div>
          </motion.div>)
        )}

        {/* Info Icons with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
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
      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 rounded-lg ${getStatusColor(selectedOrder.status)}`}
                    >
                      {getStatusIcon(selectedOrder.status, 20)}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">
                        {selectedOrder.orderNumber || `Buyurtma #${selectedOrder._id.slice(-8)}`}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {/* Order Status */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Buyurtma holati</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    {selectedOrder.status !== 'CANCELLED' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Kutilmoqda</span>
                          <span>Jarayonda</span>
                          <span>Yuborilgan</span>
                          <span>Yetkazilgan</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${getStatusProgress(selectedOrder.status)}%` }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-500 dark:to-orange-500"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Products */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Package size={16} className="text-[#005CB9] dark:text-blue-400" />
                      Kitoblar
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.items && selectedOrder.items.map((item, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                        >
                          <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                            <Image
                              src={getProductImage(item)}
                              alt={getProductTitle(item)}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white">{getProductTitle(item)}</p>
                            {item.product.author && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.product.author}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.quantity || 0} x {getItemPrice(item).toLocaleString()}{' so\'m '}</p>
                              <motion.p 
                                key={item.price}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="font-bold text-[#005CB9] dark:text-blue-400"
                              >
                                {((item.quantity || 0) * getItemPrice(item)).toLocaleString()}{' so\'m '}</motion.p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Delivery Info */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Truck size={16} className="text-[#FF8A00] dark:text-orange-400" />
                      Yetkazib berish
                    </h4>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {selectedOrder.shippingAddress?.city || "Noma'lum"}, {selectedOrder.shippingAddress?.region || "Noma'lum"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedOrder.shippingAddress?.street || "Noma'lum"}
                            {selectedOrder.shippingAddress?.apartment && `, xonadon ${selectedOrder.shippingAddress.apartment}`}
                          </p>
                          {selectedOrder.shippingAddress?.phone && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Tel: {selectedOrder.shippingAddress.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        {getDeliveryTypeIcon(selectedOrder.deliveryType)}
                        <span className="text-gray-700 dark:text-gray-300">{getDeliveryTypeText(selectedOrder.deliveryType)}</span>
                      </div>
                      
                      {selectedOrder.deliveryCost && selectedOrder.deliveryCost > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Yetkazish narxi</span>
                          <span className="font-bold text-gray-900 dark:text-white">{selectedOrder.deliveryCost.toLocaleString()}{' so\'m'}</span>
                        </div>
                      )}
                      
                      {selectedOrder.trackingNumber && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Tracking raqami</span>
                          <span className="font-mono text-[#005CB9] dark:text-blue-400">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                      
                      {selectedOrder.estimatedDelivery && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Yetkazish: {formatShortDate(selectedOrder.estimatedDelivery)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Payment Info */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <CreditCard size={16} className="text-green-600 dark:text-green-400" />{' To\'lov '}</h4>
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{'To\'lov turi'}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {getPaymentTypeText(selectedOrder.paymentType)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{'To\'lov holati'}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedOrder.paymentStatus === 'PAID' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : selectedOrder.paymentStatus === 'UNPAID'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {selectedOrder.paymentStatus === 'PAID' ? "To'langan" : 
                           selectedOrder.paymentStatus === 'UNPAID' ? "To'lanmagan" : "Qaytarilgan"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-600">
                        <span className="font-bold text-gray-900 dark:text-white">Jami</span>
                        <motion.span 
                          key={selectedOrder.totalAmount}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="text-xl font-black text-[#005CB9] dark:text-blue-400"
                        >
                          {(selectedOrder.totalAmount || 0).toLocaleString()}{' so\'m '}</motion.span>
                      </div>
                    </div>
                  </motion.div>

                  {selectedOrder.note && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4"
                    >
                      <p className="text-sm text-blue-800 dark:text-blue-300">{selectedOrder.note}</p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700"
                  >
                    {selectedOrder.status === 'PENDING' && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => handleCancelOrder(selectedOrder._id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
                        >
                          <XCircle size={16} className="mr-2" />
                          Buyurtmani bekor qilish
                        </Button>
                      </motion.div>
                    )}
                    
                    {selectedOrder.status === 'DELIVERED' && (
                      <>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button
                            onClick={() => handleReorder(selectedOrder._id)}
                            className="w-full bg-[#005CB9] hover:bg-[#004a96] dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                          >
                            <RefreshCw size={16} className="mr-2" />
                            Qayta buyurtma
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => handleDownloadInvoice(selectedOrder._id)}
                            variant="outline"
                            className="border-gray-200 dark:border-slate-700"
                          >
                            <Download size={16} />
                          </Button>
                        </motion.div>
                      </>
                    )}
                    
                    {selectedOrder.status === 'SHIPPED' && selectedOrder.trackingNumber && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => handleTrackOrder(selectedOrder.trackingNumber!)}
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                        >
                          <Truck size={16} className="mr-2" />
                          Kuzatish
                        </Button>
                      </motion.div>
                    )}
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => window.print()}
                        variant="outline"
                        className="border-gray-200 dark:border-slate-700"
                      >
                        <Printer size={16} />
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}