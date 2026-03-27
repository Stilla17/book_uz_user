"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Check,
  Loader2,
  Plus,
  Trash2,
  Package,
  Home,
  Clock,
  Sparkles,
  Tag,
  MessageCircle,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, UserService } from "@/services/api";
import { toast } from "react-hot-toast";

interface Address {
  _id: string;
  city: string;
  region: string;
  street: string;
  isDefault: boolean;
}

interface CheckoutItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Product {
  _id: string;
  title: {
    uz: string;
    ru?: string;
    en?: string;
  };
  images: string[];
  price: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  
  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    city: "",
    region: "",
    street: "",
    isDefault: false
  });
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "CASH" | "ONLINE">("CARD");
  
  // Delivery state
  const [deliveryType, setDeliveryType] = useState<"STANDARD" | "EXPRESS" | "PICKUP">("STANDARD");
  
  // Promo state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    
    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // LocalStorage dan tanlangan itemlarni olish
      const storedItems = localStorage.getItem('checkoutItems');
      if (!storedItems) {
        router.push('/cart');
        return;
      }
      
      const parsedItems = JSON.parse(storedItems);
      setItems(parsedItems);
      
      // Mahsulot ma'lumotlarini yuklash
      const productMap = new Map();
      for (const item of parsedItems) {
        try {
          const response = await api.get(`/products/${item.productId}`);
          if (response.data?.success) {
            productMap.set(item.productId, response.data.data);
          }
        } catch (error) {
          console.error(`Product ${item.productId} yuklanmadi:`, error);
        }
      }
      setProducts(productMap);
      
      // Manzillarni yuklash
      const addressesResponse = await UserService.getAddresses();
      if (addressesResponse?.success) {
        setAddresses(addressesResponse.data || []);
        
        // Default manzilni tanlash
        const defaultAddress = addressesResponse.data?.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        } else if (addressesResponse.data?.length > 0) {
          setSelectedAddress(addressesResponse.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Ma'lumotlar yuklanmadi:", error);
      toast.error("Ma'lumotlar yuklanmadi");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await UserService.addAddress(newAddress);
      if (response?.success) {
        setAddresses(response.data);
        setShowAddressForm(false);
        setNewAddress({ city: "", region: "", street: "", isDefault: false });
        
        // Yangi qo'shilgan manzilni tanlash
        const newAddr = response.data?.find((addr: Address) => addr.isDefault) || response.data?.[0];
        if (newAddr) {
          setSelectedAddress(newAddr._id);
        }
        
        toast.success("Manzil qo'shildi");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Manzilni o'chirishni tasdiqlaysizmi?")) return;
    
    try {
      const response = await UserService.deleteAddress(addressId);
      if (response?.success) {
        setAddresses(addresses.filter(addr => addr._id !== addressId));
        
        if (selectedAddress === addressId) {
          const nextAddress = addresses.find(addr => addr._id !== addressId);
          setSelectedAddress(nextAddress?._id || "");
        }
        
        toast.success("Manzil o'chirildi");
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Promokodni kiriting");
      return;
    }
    
    if (promoCode.toUpperCase() === "WELCOME10") {
      setDiscount(10);
      setAppliedPromo(promoCode);
      toast.success("Promokod qabul qilindi! 10% chegirma");
    } else if (promoCode.toUpperCase() === "BOOK20") {
      setDiscount(20);
      setAppliedPromo(promoCode);
      toast.success("Promokod qabul qilindi! 20% chegirma");
    } else {
      toast.error("Noto'g'ri promokod");
    }
    
    setPromoCode("");
  };

  const handleRemovePromo = () => {
    setDiscount(0);
    setAppliedPromo(null);
  };

  // Mahsulot nomini olish
  const getProductTitle = (product: Product): string => {
    return product.title?.uz || product.title?.ru || product.title?.en || "Noma'lum";
  };

  // Rasm manzilini olish
  const getProductImage = (product: Product): string => {
    if (product.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887";
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  };

  const calculateDelivery = () => {
    switch(deliveryType) {
      case "STANDARD": return 15000;
      case "EXPRESS": return 35000;
      case "PICKUP": return 0;
      default: return 15000;
    }
  };

  const calculateDiscount = (amount: number) => {
    return (amount * discount) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const delivery = calculateDelivery();
    const discountAmount = calculateDiscount(subtotal);
    return subtotal + delivery - discountAmount;
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      toast.error("Iltimos, yetkazib berish manzilini tanlang");
      return;
    }

    try {
      setSubmitting(true);
      
      const orderData = {
        items: items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: addresses.find(addr => addr._id === selectedAddress),
        deliveryType,
        paymentType: paymentMethod,
        totalAmount: calculateTotal()
      };
      
      const response = await api.post('/orders', orderData);
      
      if (response.data?.success) {
        localStorage.removeItem('checkoutItems');
        toast.success("Buyurtma muvaffaqiyatli qabul qilindi!");
        router.push(`/orders/${response.data.data._id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const getDeliveryPrice = () => {
    const price = calculateDelivery();
    if (price === 0) return "Bepul";
    return `${price.toLocaleString()} so'm`;
  };

  const getDeliveryIcon = (type: string) => {
    switch(type) {
      case "STANDARD": return <Truck size={20} className="text-[#005CB9] dark:text-blue-400" />;
      case "EXPRESS": return <Truck size={20} className="text-[#FF8A00] dark:text-orange-400" />;
      case "PICKUP": return <Home size={20} className="text-green-500 dark:text-green-400" />;
      default: return <Truck size={20} className="text-gray-400" />;
    }
  };

  const getPaymentIcon = (type: string) => {
    switch(type) {
      case "CARD": return <CreditCard size={20} className="text-[#005CB9] dark:text-blue-400" />;
      case "CASH": return <CreditCard size={20} className="text-green-500 dark:text-green-400" />;
      case "ONLINE": return <CreditCard size={20} className="text-[#FF8A00] dark:text-orange-400" />;
      default: return <CreditCard size={20} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#005CB9]/20 dark:border-blue-400/20 border-t-[#005CB9] dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
            <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#005CB9] dark:text-blue-400" size={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors mb-6 group"
        >
          <div className="p-1 rounded-lg group-hover:bg-[#005CB9]/10 dark:group-hover:bg-blue-400/10 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span>Ortga</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-2xl">
            <Package size={28} className="text-[#005CB9] dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">
              <span className="text-[#005CB9] dark:text-blue-400">Buyurtma</span>
              <span className="text-[#FF8A00] dark:text-orange-400"> rasmiylashtirish</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {items.length} ta mahsulot uchun buyurtma
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin size={20} className="text-[#005CB9] dark:text-blue-400" />
                  Yetkazib berish manzili
                </h2>
                <Button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                >
                  <Plus size={16} className="mr-1" />
                  Yangi manzil
                </Button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">{'Yangi manzil qo\'shish'}</h3>
                  <div className="space-y-3">
                    <Input
                      placeholder="Shahar"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      required
                      className="bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                    />
                    <Input
                      placeholder="Tuman"
                      value={newAddress.region}
                      onChange={(e) => setNewAddress({...newAddress, region: e.target.value})}
                      required
                      className="bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                    />
                    <Input
                      placeholder="Ko'cha, uy"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      required
                      className="bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-[#005CB9] dark:text-blue-400 focus:ring-[#005CB9] dark:focus:ring-blue-400 bg-white dark:bg-slate-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Asosiy manzil</span>
                    </label>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-[#005CB9] hover:bg-[#004a96] dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                        Saqlash
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                        className="border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddress === address._id
                          ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9]/5 dark:bg-blue-400/10'
                          : 'border-gray-200 dark:border-slate-700 hover:border-[#005CB9]/30 dark:hover:border-blue-400/30'
                      }`}
                      onClick={() => setSelectedAddress(address._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedAddress === address._id
                              ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9] dark:bg-blue-400'
                              : 'border-gray-300 dark:border-slate-600'
                          }`}>
                            {selectedAddress === address._id && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {address.city}, {address.region}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{address.street}</p>
                            {address.isDefault && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-2">
                                <Check size={12} />
                                Asosiy manzil
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address._id);
                          }}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Manzillar mavjud emas</p>
                  <Button
                    onClick={() => setShowAddressForm(true)}
                    className="bg-[#005CB9] hover:bg-[#004a96] dark:bg-blue-600 dark:hover:bg-blue-700 text-white mt-2"
                  >
                    <Plus size={16} className="mr-2" />{' Manzil qo\'shish '}</Button>
                </div>
              )}
            </div>

            {/* Delivery Type */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Truck size={20} className="text-[#005CB9] dark:text-blue-400" />
                Yetkazib berish usuli
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setDeliveryType("STANDARD")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    deliveryType === "STANDARD"
                      ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9]/5 dark:bg-blue-400/10'
                      : 'border-gray-200 dark:border-slate-700 hover:border-[#005CB9]/30 dark:hover:border-blue-400/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getDeliveryIcon("STANDARD")}
                    <div className="text-left">
                      <p className={`font-bold ${deliveryType === "STANDARD" ? "text-[#005CB9] dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                        Standart
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">3-5 kun</p>
                      <p className="text-sm font-bold text-[#005CB9] dark:text-blue-400 mt-1">{'15,000 so\'m'}</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryType("EXPRESS")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    deliveryType === "EXPRESS"
                      ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9]/5 dark:bg-blue-400/10'
                      : 'border-gray-200 dark:border-slate-700 hover:border-[#005CB9]/30 dark:hover:border-blue-400/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getDeliveryIcon("EXPRESS")}
                    <div className="text-left">
                      <p className={`font-bold ${deliveryType === "EXPRESS" ? "text-[#FF8A00] dark:text-orange-400" : "text-gray-700 dark:text-gray-300"}`}>
                        Ekspress
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1-2 kun</p>
                      <p className="text-sm font-bold text-[#FF8A00] dark:text-orange-400 mt-1">{'35,000 so\'m'}</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryType("PICKUP")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    deliveryType === "PICKUP"
                      ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9]/5 dark:bg-blue-400/10'
                      : 'border-gray-200 dark:border-slate-700 hover:border-[#005CB9]/30 dark:hover:border-blue-400/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getDeliveryIcon("PICKUP")}
                    <div className="text-left">
                      <p className={`font-bold ${deliveryType === "PICKUP" ? "text-green-500 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>
                        Olib ketish
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{'Do\'kondan'}</p>
                      <p className="text-sm font-bold text-green-500 dark:text-green-400 mt-1">Bepul</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-[#005CB9] dark:text-blue-400" />{' To\'lov usuli '}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "CARD"
                      ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9]/5 dark:bg-blue-400/10'
                      : 'border-gray-200 dark:border-slate-700 hover:border-[#005CB9]/30 dark:hover:border-blue-400/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getPaymentIcon("CARD")}
                    <div className="text-left">
                      <p className={`font-bold ${paymentMethod === "CARD" ? "text-[#005CB9] dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                        Karta orqali
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Visa, Uzcard, Humo</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("CASH")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "CASH"
                      ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9]/5 dark:bg-blue-400/10'
                      : 'border-gray-200 dark:border-slate-700 hover:border-[#005CB9]/30 dark:hover:border-blue-400/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getPaymentIcon("CASH")}
                    <div className="text-left">
                      <p className={`font-bold ${paymentMethod === "CASH" ? "text-green-500 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>
                        Naqd pul
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Yetkazib berganda</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "ONLINE"
                      ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9]/5 dark:bg-blue-400/10'
                      : 'border-gray-200 dark:border-slate-700 hover:border-[#005CB9]/30 dark:hover:border-blue-400/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getPaymentIcon("ONLINE")}
                    <div className="text-left">
                      <p className={`font-bold ${paymentMethod === "ONLINE" ? "text-[#FF8A00] dark:text-orange-400" : "text-gray-700 dark:text-gray-300"}`}>{' Online to\'lov '}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Click, Payme, Apelsin</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 sticky top-24">
              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package size={18} className="text-[#FF8A00] dark:text-orange-400" />
                Buyurtma summasi
              </h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400">{'Promokod qo\'llanildi'}</p>
                      <p className="font-bold text-green-700 dark:text-green-400">{appliedPromo} ({discount}% chegirma)</p>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded-full text-green-700 dark:text-green-400"
                    >
                      <ChevronRight size={16} className="transform rotate-180" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promokod"
                      className="flex-1 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <Button
                      onClick={handleApplyPromo}
                      className="bg-[#005CB9] hover:bg-[#004a96] dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >{' Qo\'llash '}</Button>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => {
                  const product = products.get(item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={item.productId} className="flex gap-2 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={getProductImage(product)}
                          alt={getProductTitle(product)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                          {getProductTitle(product)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.quantity} x {item.price.toLocaleString()}{' so\'m '}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#005CB9] dark:text-blue-400">
                          {(item.quantity * item.price).toLocaleString()}{' so\'m '}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Mahsulotlar summasi</span>
                  <span className="font-bold text-gray-900 dark:text-white">{calculateSubtotal().toLocaleString()}{' so\'m'}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Yetkazib berish</span>
                  <span className="font-bold text-gray-900 dark:text-white">{getDeliveryPrice()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Chegirma ({discount}%)</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      -{calculateDiscount(calculateSubtotal()).toLocaleString()}{' so\'m '}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-100 dark:border-slate-700 my-3" />
                
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">Jami</span>
                  <span className="text-2xl font-black text-[#005CB9] dark:text-blue-400">
                    {calculateTotal().toLocaleString()}{' so\'m '}</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitOrder}
                disabled={submitting || !selectedAddress}
                className="w-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white font-bold py-4 text-lg rounded-xl hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Shield size={20} className="mr-2" />
                    Buyurtmani tasdiqlash
                  </>
                )}
              </Button>

              {/* Security Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  <Shield size={12} className="inline mr-1" />{' Ma\'lumotlaringiz xavfsiz himoyalangan '}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Icons */}
        <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2">
            <Truck size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">Bepul yetkazish</span>
          </div>
          <div className="p-2">
            <Shield size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">{'Xavfsiz to\'lov'}</span>
          </div>
          <div className="p-2">
            <MessageCircle size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">{'24/7 qo\'llab-quvvatlash'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}