"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Globe, 
  Moon, 
  Sun,
  ChevronRight,
  Camera,
  Save,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Laptop,
  Clock,
  Languages,
  DollarSign,
  LogOut,
  Trash2,
  AlertCircle,
  Loader2,
  Package,
  Truck,
  BookOpen,
  Sparkles,
  Crown,
  Zap,
  Award,
  Gem,
  Flower2,
  Coffee,
  Compass,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { UserService } from "@/services/api";
import { toast } from "react-hot-toast";

interface NotificationSetting {
  email: boolean;
  sms: boolean;
  telegram: boolean;
  push: boolean;
}

interface SecuritySetting {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  deviceHistory: boolean;
}

interface Preferences {
  language: string;
  currency: string;
}

interface Device {
  _id: string;
  name: string;
  type: 'mobile' | 'laptop' | 'tablet' | 'other';
  location: string;
  lastActive: string;
  userAgent?: string;
  ip?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSetting>({
    email: true,
    sms: false,
    telegram: true,
    push: true
  });
  
  // Security settings
  const [security, setSecurity] = useState<SecuritySetting>({
    twoFactorAuth: false,
    loginAlerts: true,
    deviceHistory: false
  });
  
  // Preferences
  const [preferences, setPreferences] = useState<Preferences>({
    language: "uz",
    currency: "UZS"
  });
  
  // Devices
  const [devices, setDevices] = useState<Device[]>([]);
  
  // Loading states
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingSecurity, setLoadingSecurity] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [loadingDevices, setLoadingDevices] = useState(false);

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
  const floatingIcons = [User, Lock, Bell, Shield, Globe, Smartphone, Sparkles, Crown, Zap, Award, Gem, Flower2, Coffee, Compass, TrendingUp];

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/settings');
      return;
    }
    
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
      setBio(user.bio || "");
    }
    
    loadNotificationSettings();
    loadSecuritySettings();
    loadPreferences();
    loadDevices();
  }, [isAuthenticated, authLoading, user, router]);

  const loadNotificationSettings = async () => {
    try {
      setLoadingNotifications(true);
      const response = await UserService.getNotificationSettings();
      if (response?.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Xabarnoma sozlamalari yuklanmadi:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const loadSecuritySettings = async () => {
    try {
      setLoadingSecurity(true);
      const response = await UserService.getSecuritySettings();
      if (response?.success) {
        setSecurity(response.data);
      }
    } catch (error) {
      console.error("Xavfsizlik sozlamalari yuklanmadi:", error);
    } finally {
      setLoadingSecurity(false);
    }
  };

  const loadPreferences = async () => {
    try {
      setLoadingPreferences(true);
      const response = await UserService.getPreferences();
      if (response?.success) {
        setPreferences(response.data);
      }
    } catch (error) {
      console.error("Preferensiyalar yuklanmadi:", error);
    } finally {
      setLoadingPreferences(false);
    }
  };

  const loadDevices = async () => {
    try {
      setLoadingDevices(true);
      const response = await UserService.getDevices();
      if (response?.success) {
        setDevices(response.data);
      }
    } catch (error) {
      console.error("Qurilmalar yuklanmadi:", error);
    } finally {
      setLoadingDevices(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await UserService.updateProfile({ name, phone, bio });
      
      if (response?.success) {
        toast.success("Profil yangilandi");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Rasm yuklanmadi");
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

    if (newPassword.length < 6) {
      toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    try {
      setLoading(true);
      const response = await UserService.updatePassword({
        oldPassword: currentPassword,
        newPassword
      });
      
      if (response?.success) {
        toast.success("Parol yangilandi");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await UserService.updateNotificationSettings(notifications);
      
      if (response?.success) {
        toast.success("Xabarnoma sozlamalari saqlandi");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setLoadingSecurity(true);
      const response = await UserService.updateSecuritySettings(security);
      
      if (response?.success) {
        toast.success("Xavfsizlik sozlamalari saqlandi");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoadingSecurity(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setLoadingPreferences(true);
      const response = await UserService.updatePreferences(preferences);
      
      if (response?.success) {
        toast.success("Til va mintaqa sozlamalari saqlandi");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoadingPreferences(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm("Ushbu qurilmani o'chirishni tasdiqlaysizmi?")) return;
    
    try {
      const response = await UserService.removeDevice(deviceId);
      if (response?.success) {
        setDevices(devices.filter(d => d._id !== deviceId));
        toast.success("Qurilma o'chirildi");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Parolni kiriting");
      return;
    }
    
    try {
      setLoading(true);
      const response = await UserService.deleteAccount(deletePassword);
      
      if (response?.success) {
        toast.success("Hisob o'chirildi");
        await logout();
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeletePassword("");
    }
  };

  const getDeviceIcon = (type: string) => {
    switch(type) {
      case "laptop": return <Laptop size={16} className="text-[#005CB9] dark:text-blue-400" />;
      case "mobile": return <Smartphone size={16} className="text-[#FF8A00] dark:text-orange-400" />;
      case "tablet": return <Smartphone size={16} className="text-purple-500 dark:text-purple-400" />;
      default: return <Smartphone size={16} className="text-gray-400 dark:text-gray-500" />;
    }
  };

  const formatLastActive = (date: string) => {
    const last = new Date(date);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Hozirgina faol";
    if (diffHours < 24) return `${diffHours} soat oldin`;
    return `${Math.floor(diffHours / 24)} kun oldin`;
  };

  const isCurrentDevice = (device: Device) => {
    return device.userAgent === navigator.userAgent;
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
        
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="p-3 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-2xl"
          >
            <User size={28} className="text-[#005CB9] dark:text-blue-400" />
          </motion.div>
          <div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-black"
            >
              <span className="text-[#005CB9] dark:text-blue-400">Sozlamalar</span>
            </motion.h1>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-1"
            >
              Hisobingiz va profil sozlamalarini boshqaring
            </motion.p>
          </div>
        </motion.div>

        {/* Theme Toggle with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 flex justify-end"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              variant="outline"
              className="border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <motion.div
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
              </motion.div>
              {theme === 'dark' ? 'Yorqin rejim' : 'Qorong\'i rejim'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Settings Tabs with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-100 dark:border-slate-700 p-1 rounded-xl flex flex-wrap">
              {[
                { value: "profile", label: "Profil", icon: User },
                { value: "password", label: "Parol", icon: Lock },
                { value: "notifications", label: "Xabarnomalar", icon: Bell },
                { value: "security", label: "Xavfsizlik", icon: Shield },
                { value: "preferences", label: "Til va mintaqa", icon: Globe },
                { value: "devices", label: "Qurilmalar", icon: Smartphone },
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
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Profil ma'lumotlari</h2>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
                        {avatar ? (
                          <Image 
                            src={avatar} 
                            alt={name} 
                            width={128} 
                            height={128} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 flex items-center justify-center">
                            <User size={48} className="text-white" />
                          </div>
                        )}
                      </div>
                      <motion.label 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        htmlFor="avatar-upload-settings" 
                        className="absolute bottom-0 right-0 w-8 h-8 bg-[#005CB9] dark:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#004a96] dark:hover:bg-blue-700 transition-colors border-2 border-white dark:border-slate-700"
                      >
                        <Camera size={14} className="text-white" />
                        <input 
                          type="file" 
                          id="avatar-upload-settings" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={uploading}
                        />
                      </motion.label>
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                      Rasm formati: JPG, PNG<br />
                      Maksimal hajm: 5MB
                    </p>
                  </motion.div>

                  {/* Form */}
                  <div className="flex-1">
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
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
                        transition={{ delay: 0.4 }}
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
                        transition={{ delay: 0.5 }}
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
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005CB9] dark:focus:ring-blue-400 text-gray-900 dark:text-white"
                          rows={3}
                          placeholder="O'zingiz haqingizda qisqacha..."
                        />
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex gap-3 pt-4"
                      >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white"
                            disabled={loading}
                          >
                            {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                            {loading ? "Saqlanmoqda..." : "Saqlash"}
                          </Button>
                        </motion.div>
                      </motion.div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Password Tab */}
            <TabsContent value="password">
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
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Joriy parol</label>
                    <div className="relative mt-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="text-sm font-bold text-gray-600 dark:text-gray-400">Yangi parol</label>
                    <div className="relative mt-1">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-gray-400 dark:text-gray-500 mt-2"
                  >
                    <p>Parol kamida 6 ta belgidan iborat bo'lishi kerak</p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white mt-4"
                        disabled={loading}
                      >
                        {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                        {loading ? "Yangilanmoqda..." : "Parolni yangilash"}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </motion.div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
              >
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Xabarnoma sozlamalari</h2>
                
                {loadingNotifications ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={32} className="animate-spin text-[#005CB9] dark:text-blue-400" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {[
                      { key: 'email', label: 'Email xabarnomalar', desc: 'Yangi kitoblar va aksiyalar haqida email orqali xabardor bo\'ling' },
                      { key: 'sms', label: 'SMS xabarnomalar', desc: 'Buyurtma holati haqida SMS orqali xabardor bo\'ling' },
                      { key: 'telegram', label: 'Telegram xabarnomalar', desc: 'Telegram orqali tezkor xabarnomalarni qabul qiling' },
                      { key: 'push', label: 'Push xabarnomalar', desc: 'Brauzer orqali xabarnomalarni qabul qiling' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.key}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                      >
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                        </div>
                        <Switch
                          checked={notifications[item.key as keyof NotificationSetting]}
                          onCheckedChange={(checked) => setNotifications({...notifications, [item.key]: checked})}
                          className="data-[state=checked]:bg-[#005CB9] dark:data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={handleSaveNotifications}
                        className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white mt-4"
                        disabled={loadingNotifications}
                      >
                        {loadingNotifications ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                        {loadingNotifications ? "Saqlanmoqda..." : "Sozlamalarni saqlash"}
                      </Button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
              >
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Xavfsizlik sozlamalari</h2>
                
                {loadingSecurity ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={32} className="animate-spin text-[#005CB9] dark:text-blue-400" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {[
                      { key: 'twoFactorAuth', label: 'Ikki bosqichli autentifikatsiya', desc: 'Hisobingizni qo\'shimcha himoyalash' },
                      { key: 'loginAlerts', label: 'Login haqida ogohlantirish', desc: 'Yangi qurilmadan kirishda xabardor qilish' },
                      { key: 'deviceHistory', label: 'Qurilmalar tarixini saqlash', desc: 'Kirish qilingan qurilmalar ro\'yxatini saqlash' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.key}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl"
                      >
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                        </div>
                        <Switch
                          checked={security[item.key as keyof SecuritySetting]}
                          onCheckedChange={(checked) => setSecurity({...security, [item.key]: checked})}
                          className="data-[state=checked]:bg-[#005CB9] dark:data-[state=checked]:bg-blue-600"
                        />
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={handleSaveSecurity}
                        className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white mt-4"
                        disabled={loadingSecurity}
                      >
                        {loadingSecurity ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                        {loadingSecurity ? "Saqlanmoqda..." : "Sozlamalarni saqlash"}
                      </Button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
              >
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Til va mintaqa sozlamalari</h2>
                
                {loadingPreferences ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={32} className="animate-spin text-[#005CB9] dark:text-blue-400" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Language Selection */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="text-sm font-bold text-gray-600 dark:text-gray-400 block mb-3">Interfeys tili</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
                          { code: 'ru', name: 'Русский', flag: '🇷🇺' },
                          { code: 'en', name: 'English', flag: '🇬🇧' }
                        ].map((lang, index) => (
                          <motion.button
                            key={lang.code}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPreferences({...preferences, language: lang.code})}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              preferences.language === lang.code
                                ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9]/5 dark:bg-blue-400/10'
                                : 'border-gray-200 dark:border-slate-700 hover:border-[#005CB9]/30 dark:hover:border-blue-400/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{lang.flag}</span>
                              <span className={`font-bold ${
                                preferences.language === lang.code 
                                  ? 'text-[#005CB9] dark:text-blue-400' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {lang.name}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Currency Selection */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="pt-6 border-t border-gray-100 dark:border-slate-700"
                    >
                      <label className="text-sm font-bold text-gray-600 dark:text-gray-400 block mb-3">Valyuta</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { code: 'UZS', symbol: 'so\'m', name: 'O\'zbek so\'mi' },
                          { code: 'USD', symbol: '$', name: 'AQSH dollari' },
                          { code: 'RUB', symbol: '₽', name: 'Rus rubli' }
                        ].map((curr, index) => (
                          <motion.button
                            key={curr.code}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPreferences({...preferences, currency: curr.code})}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              preferences.currency === curr.code
                                ? 'border-[#005CB9] dark:border-blue-400 bg-[#005CB9]/5 dark:bg-blue-400/10'
                                : 'border-gray-200 dark:border-slate-700 hover:border-[#005CB9]/30 dark:hover:border-blue-400/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-[#005CB9] dark:text-blue-400">{curr.symbol}</span>
                              <div className="text-left">
                                <p className={`font-bold ${
                                  preferences.currency === curr.code 
                                    ? 'text-[#005CB9] dark:text-blue-400' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {curr.code}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{curr.name}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={handleSavePreferences}
                        className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] hover:from-[#004a96] hover:to-[#e67a00] dark:from-blue-600 dark:to-orange-600 text-white mt-4"
                        disabled={loadingPreferences}
                      >
                        {loadingPreferences ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                        {loadingPreferences ? "Saqlanmoqda..." : "Sozlamalarni saqlash"}
                      </Button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Devices Tab */}
            <TabsContent value="devices">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6"
              >
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Faol qurilmalar</h2>
                
                {loadingDevices ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={32} className="animate-spin text-[#005CB9] dark:text-blue-400" />
                  </div>
                ) : devices.length > 0 ? (
                  <div className="space-y-4">
                    {devices.map((device, index) => (
                      <motion.div
                        key={device._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(device.type)}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900 dark:text-white">{device.name}</p>
                              {isCurrentDevice(device) && (
                                <motion.span 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full"
                                >
                                  Hozirgi
                                </motion.span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{device.location}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              <Clock size={10} className="inline mr-1" />
                              {formatLastActive(device.lastActive)}
                            </p>
                          </div>
                        </div>
                        
                        {!isCurrentDevice(device) && (
                          <motion.button
                            whileHover={{ scale: 1.1, color: "#ef4444" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveDevice(device._id)}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center py-12"
                  >
                    <Smartphone size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Hozircha qurilmalar mavjud emas</p>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Info Icons with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800 p-6"
        >
          <h2 className="text-lg font-black text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            Xavfli hudud
          </h2>
          
          <div className="space-y-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Hisobdan chiqish</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Boshqa hisob bilan kirish uchun</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} className="mr-2" />
                  Chiqish
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-red-200 dark:border-red-800"
            >
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Hisobni o'chirish</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hisobingizni butunlay o'chirish</p>
              </div>
              
              {!showDeleteConfirm ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Hisobni o'chirish
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex gap-2"
                >
                  <Input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Parolingizni kiriting"
                    className="flex-1 bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleDeleteAccount}
                      className="bg-red-500 hover:bg-red-600 text-white"
                      disabled={loading}
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : "Tasdiqlash"}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword("");
                      }}
                      variant="outline"
                      className="border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
                    >
                      Bekor qilish
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}