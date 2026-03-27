"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Parollar mos kelmadi!");
    }

    if (formData.password.length < 6) {
      return toast.error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      await register(submitData);
      
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 dark:bg-orange-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-3xl" />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[40px] shadow-2xl dark:shadow-2xl dark:shadow-orange-900/20 p-8 md:p-10 border border-gray-100 dark:border-slate-700 relative z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-blue-500 rounded-2xl opacity-20 blur-xl" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-black">B</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Hisob yaratish</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{'Xush kelibsiz! Ma\'lumotlaringizni kiriting.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ism */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">Ism</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors" size={18} />
              <input 
                required
                type="text" 
                placeholder="Ismingiz"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors" size={18} />
              <input 
                required
                type="email" 
                placeholder="email@example.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Parol */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">Parol</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors" size={18} />
              <input 
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Parolni tasdiqlash */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">Parolni tasdiqlash</label>
            <div className="relative group">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors" size={18} />
              <input 
                required
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl focus:border-orange-500 dark:focus:border-orange-400 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1,2,3].map((level) => (
                  <div 
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      formData.password.length >= level * 2 
                        ? formData.password.length >= 8 
                          ? 'bg-green-500' 
                          : 'bg-orange-500'
                        : 'bg-gray-200 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formData.password.length < 6 
                  ? "Parol juda qisqa" 
                  : formData.password.length < 8 
                    ? "O'rtacha darajadagi parol" 
                    : "Kuchli parol"}
              </p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 dark:shadow-orange-600/30 flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>{' Ro\'yxatdan o\'tish '}<ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Akkauntingiz bormi? {" "}
            <Link href="/auth/login" className="text-blue-500 dark:text-blue-400 font-bold hover:underline underline-offset-4">
              Kirish
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="mt-6 text-xs text-center text-gray-400 dark:text-gray-500">{' Ro\'yxatdan o\'tish orqali siz'}{" "}
          <Link href="/terms" className="text-blue-500 dark:text-blue-400 hover:underline">Foydalanish shartlari</Link>
          {" "}va{" "}
          <Link href="/privacy" className="text-orange-500 dark:text-orange-400 hover:underline">Maxfiylik siyosati</Link>
          {" "}ga rozilik bildirasiz.
        </p>
      </motion.div>
    </div>
  );
}