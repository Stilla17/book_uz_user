"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Heart,
    BookOpen,
    ShoppingBag,
    Settings,
    LogOut,
    Camera,
    Plus,
    Trash2,
    Check,
    Clock,
    Package,
    Truck,
    Shield,
    Star,
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
    ChevronRight,
    Edit2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCard } from "@/components/cards/BookCard";
import { UserService } from "@/services/api";
import { toast } from "react-hot-toast";

interface Address {
    _id: string;
    city: string;
    region: string;
    street: string;
    isDefault: boolean;
}

interface Order {
    _id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
    
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // Profile state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");
    
    // Password state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // Wishlist state
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [wishlistError, setWishlistError] = useState(false);
    
    // Address state
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [addressesError, setAddressesError] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [newAddress, setNewAddress] = useState({
        city: "",
        region: "",
        street: "",
        isDefault: false
    });
    
    // Orders state
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

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
    const floatingIcons = [User, Heart, BookOpen, ShoppingBag, Star, Sparkles, Crown, Zap, Award, Gem, Diamond, Flower2, Sun, Moon, Cloud, Coffee, Compass];

    useEffect(() => {
        if (authLoading) return;
        
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        
        if (user && !initialized) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setAvatar(user.avatar || "");
            
            // Ma'lumotlarni parallel yuklash
            loadUserData();
            setInitialized(true);
        }
    }, [isAuthenticated, authLoading, user, router, initialized]);

    const loadUserData = async () => {
        try {
            // Wishlist va addresses ni parallel yuklash
            await Promise.all([
                loadWishlist().catch(err => console.error("Wishlist error:", err)),
                loadAddresses().catch(err => console.error("Addresses error:", err)),
                loadOrders().catch(err => console.error("Orders error:", err))
            ]);
        } catch (error) {
            console.error("User data load error:", error);
        }
    };

    const loadWishlist = async () => {
        try {
            setLoadingWishlist(true);
            setWishlistError(false);
            
            const response = await UserService.getWishlist();
            
            if (response?.success) {
                setWishlist(response.data || []);
            } else {
                setWishlist([]);
            }
        } catch (error: any) {
            console.error("Wishlist yuklanmadi:", error);
            setWishlistError(true);
            
            if (error.response?.status !== 401) {
                toast.error("Sevimlilar yuklanmadi");
            }
        } finally {
            setLoadingWishlist(false);
        }
    };

    const loadAddresses = async () => {
        try {
            setLoadingAddresses(true);
            setAddressesError(false);
            
            const response = await UserService.getAddresses();
            
            if (response?.success) {
                setAddresses(response.data || []);
            } else {
                setAddresses([]);
            }
        } catch (error: any) {
            console.error("Manzillar yuklanmadi:", error);
            setAddressesError(true);
            
            if (error.response?.status !== 401) {
                toast.error("Manzillar yuklanmadi");
            }
        } finally {
            setLoadingAddresses(false);
        }
    };

    const loadOrders = async () => {
        try {
            setLoadingOrders(true);
            setOrders([]); // Mock ma'lumotlar
        } catch (error) {
            console.error("Buyurtmalar yuklanmadi:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await UserService.updateProfile({ name, phone });
            if (response?.success) {
                toast.success("Profil yangilandi");
            }
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setUploading(true);
            const response = await UserService.uploadAvatar(formData);
            if (response?.success) {
                setAvatar(response.data.avatar);
                toast.success("Rasm yangilandi");
            }
        } catch (error) {
            toast.error("Rasm yuklanmadi");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error("Yangi parollar mos kelmadi");
            return;
        }

        try {
            setLoading(true);
            const response = await UserService.updatePassword({
                oldPassword,
                newPassword
            });
            if (response?.success) {
                toast.success("Parol yangilandi");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleWishlist = async (productId: string) => {
        try {
            const response = await UserService.toggleWishlist(productId);
            if (response?.success) {
                const isRemoved = wishlist.some(item => item._id === productId);
                if (isRemoved) {
                    setWishlist(wishlist.filter(item => item._id !== productId));
                    toast.success("Sevimlilardan o'chirildi");
                } else {
                    loadWishlist();
                    toast.success("Sevimlilarga qo'shildi");
                }
            }
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await UserService.addAddress(newAddress);
            if (response?.success) {
                setAddresses(response.data);
                setShowAddressForm(false);
                setNewAddress({ city: "", region: "", street: "", isDefault: false });
                toast.success("Manzil qo'shildi");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setNewAddress({
            city: address.city,
            region: address.region,
            street: address.street,
            isDefault: address.isDefault
        });
        setShowAddressForm(true);
    };

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAddress) return;
        
        try {
            setLoading(true);
            const response = await UserService.updateAddress(editingAddress._id, newAddress);
            if (response?.success) {
                setAddresses(response.data);
                setShowAddressForm(false);
                setEditingAddress(null);
                setNewAddress({ city: "", region: "", street: "", isDefault: false });
                toast.success("Manzil yangilandi");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm("Manzilni o'chirishni tasdiqlaysizmi?")) return;
        
        try {
            const response = await UserService.deleteAddress(addressId);
            if (response?.success) {
                setAddresses(addresses.filter(addr => addr._id !== addressId));
                toast.success("Manzil o'chirildi");
            }
        } catch (error) {
            toast.error("Xatolik yuz berdi");
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusText = (status: string) => {
        switch(status) {
            case 'pending': return 'Kutilmoqda';
            case 'processing': return 'Jarayonda';
            case 'shipped': return 'Yuborilgan';
            case 'delivered': return 'Yetkazilgan';
            case 'cancelled': return 'Bekor qilingan';
            default: return status;
        }
    };

    if (authLoading) {
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
                        <User className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#005CB9] dark:text-blue-400" size={24} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 animate-pulse">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Login qilinmagan...</p>
                    <div className="w-8 h-8 border-4 border-[#005CB9] dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            </div>
        );
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
                
                {/* Profile Header with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 mb-6"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar with animation */}
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="relative"
                        >
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
                                {avatar ? (
                                    <Image 
                                        src={avatar} 
                                        alt={name} 
                                        width={96} 
                                        height={96} 
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 flex items-center justify-center">
                                        <User size={40} className="text-white" />
                                    </div>
                                )}
                            </div>
                            <label 
                                htmlFor="avatar-upload" 
                                className="absolute bottom-0 right-0 w-8 h-8 bg-[#005CB9] dark:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#004a96] dark:hover:bg-blue-700 transition-colors border-2 border-white dark:border-slate-700"
                            >
                                <Camera size={14} className="text-white" />
                                <input 
                                    type="file" 
                                    id="avatar-upload" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                />
                            </label>
                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </motion.div>

                        {/* Info */}
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex-1"
                        >
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{name || "Foydalanuvchi"}</h1>
                            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                <Mail size={14} />
                                {email}
                            </p>
                            {phone && (
                                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                    <Phone size={14} />
                                    {phone}
                                </p>
                            )}
                        </motion.div>

                        {/* Stats */}
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex gap-6"
                        >
                            <div className="text-center">
                                <motion.div 
                                    whileHover={{ scale: 1.1, color: "#005CB9" }}
                                    className="text-2xl font-black text-[#005CB9] dark:text-blue-400"
                                >
                                    {wishlist.length}
                                </motion.div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">Sevimlilar</div>
                            </div>
                            <div className="text-center">
                                <motion.div 
                                    whileHover={{ scale: 1.1, color: "#FF8A00" }}
                                    className="text-2xl font-black text-[#FF8A00] dark:text-orange-400"
                                >
                                    {orders.length}
                                </motion.div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">Buyurtmalar</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Tabs with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-100 dark:border-slate-700 p-1 rounded-xl flex flex-wrap">
                            {[
                                { value: "profile", label: "Profil", icon: User },
                                { value: "wishlist", label: "Sevimlilar", icon: Heart },
                                { value: "orders", label: "Buyurtmalar", icon: ShoppingBag },
                                { value: "addresses", label: "Manzillar", icon: MapPin },
                                { value: "settings", label: "Sozlamalar", icon: Settings },
                            ].map((tab, index) => {
                                const Icon = tab.icon;
                                return (
                                    <TabsTrigger 
                                        key={tab.value}
                                        value={tab.value} 
                                        className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#005CB9] data-[state=active]:to-[#FF8A00] dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-orange-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300 transition-all"
                                    >
                                        <Icon size={16} className="mr-2" />
                                        {tab.label}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
                            >
                                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Shaxsiy ma'lumotlar</h2>
                                
                                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Ism</label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                                            placeholder="Ismingiz"
                                        />
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Email</label>
                                        <Input
                                            value={email}
                                            disabled
                                            className="mt-1 bg-gray-100 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400"
                                        />
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email o'zgartirilmaydi</p>
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Telefon</label>
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="mt-1 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                                            placeholder="+998 (__) ___-__-__"
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Button 
                                            type="submit" 
                                            className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? "Saqlanmoqda..." : "Saqlash"}
                                        </Button>
                                    </motion.div>
                                </form>
                            </motion.div>
                        </TabsContent>

                        {/* Wishlist Tab */}
                        <TabsContent value="wishlist">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white">Sevimli kitoblar</h2>
                                    <motion.span 
                                        whileHover={{ scale: 1.1 }}
                                        className="text-sm text-gray-400 dark:text-gray-500"
                                    >
                                        {wishlist.length} ta kitob
                                    </motion.span>
                                </div>

                                {loadingWishlist ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {[1,2,3,4].map(i => (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="h-[300px] bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : wishlistError ? (
                                    <motion.div 
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <Heart size={48} className="mx-auto text-red-300 dark:text-red-700 mb-4" />
                                        <p className="text-red-500 dark:text-red-400 mb-2">Xatolik yuz berdi</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Sevimlilarni yuklab bo'lmadi</p>
                                        <Button 
                                            onClick={loadWishlist}
                                            className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white"
                                        >
                                            Qayta urinish
                                        </Button>
                                    </motion.div>
                                ) : wishlist.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {wishlist.map((book, index) => (
                                            <motion.div
                                                key={book._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ y: -5 }}
                                                className="relative group"
                                            >
                                                <BookCard book={book} />
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleToggleWishlist(book._id)}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 dark:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                >
                                                    <Trash2 size={14} />
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <Heart size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">Sevimli kitoblar yo'q</p>
                                        <Link href="/catalog" className="text-[#005CB9] dark:text-blue-400 hover:underline text-sm mt-2 inline-block">
                                            Katalogga o'tish
                                        </Link>
                                    </motion.div>
                                )}
                            </motion.div>
                        </TabsContent>

                        {/* Orders Tab */}
                        <TabsContent value="orders">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
                            >
                                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Buyurtmalarim</h2>

                                {loadingOrders ? (
                                    <div className="space-y-4">
                                        {[1,2,3].map(i => (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="h-24 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map((order, index) => (
                                            <motion.div
                                                key={order._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                className="border border-gray-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all cursor-pointer"
                                                onClick={() => router.push(`/orders/${order._id}`)}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                                    <div>
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">Buyurtma №</span>
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white ml-2">{order._id.slice(-8)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                                            {getStatusText(order.status)}
                                                        </span>
                                                        <span className="text-sm font-black text-[#005CB9] dark:text-blue-400">{order.totalAmount.toLocaleString()} so'm</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ShoppingBag size={12} />
                                                        {order.items.length} ta kitob
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <ShoppingBag size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">Buyurtmalar yo'q</p>
                                        <Link href="/catalog" className="text-[#005CB9] dark:text-blue-400 hover:underline text-sm mt-2 inline-block">
                                            Katalogga o'tish
                                        </Link>
                                    </motion.div>
                                )}
                            </motion.div>
                        </TabsContent>

                        {/* Addresses Tab */}
                        <TabsContent value="addresses">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-black text-gray-900 dark:text-white">Manzillar</h2>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={() => {
                                                setEditingAddress(null);
                                                setNewAddress({ city: "", region: "", street: "", isDefault: false });
                                                setShowAddressForm(!showAddressForm);
                                            }}
                                            className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white"
                                        >
                                            <Plus size={16} className="mr-2" />
                                            {showAddressForm ? "Bekor qilish" : "Yangi manzil"}
                                        </Button>
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {showAddressForm && (
                                        <motion.form
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
                                            className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl overflow-hidden"
                                        >
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                                                {editingAddress ? "Manzilni tahrirlash" : "Yangi manzil qo'shish"}
                                            </h3>
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
                                                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-[#005CB9] dark:text-blue-400 focus:ring-[#005CB9] dark:focus:ring-blue-400"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">Asosiy manzil</span>
                                                </label>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        type="submit" 
                                                        className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white"
                                                        disabled={loading}
                                                    >
                                                        {loading ? "Saqlanmoqda..." : "Saqlash"}
                                                    </Button>
                                                    <Button 
                                                        type="button" 
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowAddressForm(false);
                                                            setEditingAddress(null);
                                                        }}
                                                        className="border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                                                    >
                                                        Bekor qilish
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>

                                {loadingAddresses ? (
                                    <div className="space-y-3">
                                        {[1,2,3].map(i => (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="h-20 bg-gray-100 dark:bg-slate-700 rounded-xl animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : addressesError ? (
                                    <motion.div 
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <MapPin size={48} className="mx-auto text-red-300 dark:text-red-700 mb-4" />
                                        <p className="text-red-500 dark:text-red-400 mb-2">Xatolik yuz berdi</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Manzillarni yuklab bo'lmadi</p>
                                        <Button 
                                            onClick={loadAddresses}
                                            className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white"
                                        >
                                            Qayta urinish
                                        </Button>
                                    </motion.div>
                                ) : addresses.length > 0 ? (
                                    <div className="space-y-3">
                                        {addresses.map((address, index) => (
                                            <motion.div
                                                key={address._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.01, x: 5 }}
                                                className="border border-gray-100 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <MapPin size={18} className="text-[#005CB9] dark:text-blue-400 mt-1" />
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">
                                                                {address.city}, {address.region}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{address.street}</p>
                                                            {address.isDefault && (
                                                                <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-2">
                                                                    <Check size={12} />
                                                                    Asosiy manzil
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleEditAddress(address)}
                                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-[#005CB9] dark:hover:text-blue-400 transition-colors"
                                                        >
                                                            <Edit2 size={16} />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleDeleteAddress(address._id)}
                                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <MapPin size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">Manzillar yo'q</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
                            >
                                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Parolni o'zgartirish</h2>

                                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Eski parol</label>
                                        <Input
                                            type="password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="mt-1 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                                            required
                                        />
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Yangi parol</label>
                                        <Input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="mt-1 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                                            required
                                        />
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Yangi parol (takror)</label>
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="mt-1 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                                            required
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Button 
                                            type="submit" 
                                            className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white"
                                            disabled={loading}
                                        >
                                            {loading ? "Yangilanmoqda..." : "Parolni yangilash"}
                                        </Button>
                                    </motion.div>
                                </form>

                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700"
                                >
                                    <Button 
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="text-red-500 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Chiqish
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </motion.div>

                {/* Info Icons with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
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
            </div>
        </div>
    );
}