"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  Send,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Heart,
  BookOpen,
  Headphones,
  Sparkles,
  Star
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const reduceMotion = useReducedMotion();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const footerLinks = {
    platform: [
      { name: "Asosiy", href: "/" },
      { name: "Kitoblar", href: "/books" },
      { name: "Audio kitoblar", href: "/audio" },
      { name: "Yangi kelganlar", href: "/new" },
      { name: "Chegirmalar", href: "/sale" },
      { name: "Bestsellerlar", href: "/bestsellers" },
    ],
    support: [
      { name: "Yordam markazi", href: "/help" },
      { name: "To'lov usullari", href: "/payment" },
      { name: "Yetkazib berish", href: "/shipping" },
      { name: "Qaytarish shartlari", href: "/returns" },
      { name: "Maxfiylik siyosati", href: "/privacy" },
      { name: "Foydalanish shartlari", href: "/terms" },
    ],
    company: [
      { name: "Biz haqimizda", href: "/about" },
      { name: "Vakansiyalar", href: "/jobs" },
      { name: "Hamkorlik", href: "/partnership" },
      { name: "Blog", href: "/blog" },
      { name: "Aloqa", href: "/contact" },
      { name: "Reklama", href: "/advertising" },
    ],
  };

  const socials = [
    { name: "Instagram", href: "#", Icon: Instagram, color: "hover:bg-pink-600" },
    { name: "Telegram", href: "#", Icon: TelegramIcon, color: "hover:bg-blue-500" },
    { name: "Facebook", href: "#", Icon: Facebook, color: "hover:bg-blue-600" },
    { name: "YouTube", href: "#", Icon: Youtube, color: "hover:bg-red-600" },
  ];

  const stats = [
    { icon: <BookOpen size={16} />, value: "50K+", label: "Kitoblar" },
    { icon: <Headphones size={16} />, value: "10K+", label: "Audio" },
    { icon: <Heart size={16} />, value: "100K+", label: "O'quvchilar" },
    { icon: <Star size={16} />, value: "4.9", label: "Reyting" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-black text-slate-300">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#005CB9] to-transparent" />

      {/* Background glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#005CB9]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#FF8A00]/10 blur-[120px]" />

      {/* Decorative grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container mx-auto px-4 max-w-6xl pt-12 pb-8 relative z-10">
        
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/5"
            >
              <div className={`text-${i % 2 === 0 ? '[#005CB9]' : '[#FF8A00]'} mb-1`}>
                {stat.icon}
              </div>
              <div className="text-lg font-black text-white">{stat.value}</div>
              <div className="text-[10px] text-slate-400 uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Brand - colSpan 4 */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="h-15 w-15 rounded-xl bg-gradient-to-r  grid place-items-center text-white font-black text-lg">
               <img src="/images/Logo.svg" alt="" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Raqamli kutubxona</div>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              O'zbekistondagi eng katta raqamli kutubxona. 50,000+ elektron va audio kitoblar. 
              O'qing, tinglang, kashf eting.
            </p>

            {/* Newsletter */}
            <div className="space-y-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                Yangiliklarga obuna bo'ling
              </h4>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 p-1"
              >
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-transparent outline-none text-xs text-white placeholder:text-slate-500 px-2 py-1.5"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white text-xs font-bold px-3 py-1.5 hover:shadow-lg transition-all"
                >
                  <Send size={12} />
                </button>
              </form>
            </div>

            {/* Social */}
            <div className="pt-1">
              <div className="text-white text-xs font-bold uppercase tracking-wider mb-2">
                Bizni kuzating
              </div>
              <div className="flex gap-2">
                {socials.map(({ name, href, Icon, color }) => (
                  <motion.a
                    key={name}
                    href={href}
                    aria-label={name}
                    whileHover={{ y: -2 }}
                    className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center hover:border-transparent transition-all ${color} hover:text-white`}
                  >
                    <Icon size={14} className="text-white" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Links - colSpan 2 each */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-sm font-bold flex items-center gap-1">
              <span className="w-1 h-3 bg-[#005CB9] rounded-full" />
              Platforma
            </h4>
            <ul className="space-y-1.5">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-[#005CB9] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-sm font-bold flex items-center gap-1">
              <span className="w-1 h-3 bg-[#FF8A00] rounded-full" />
              Yordam
            </h4>
            <ul className="space-y-1.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-[#FF8A00] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-sm font-bold flex items-center gap-1">
              <span className="w-1 h-3 bg-gradient-to-r from-[#005CB9] to-[#FF8A00] rounded-full" />
              Aloqa
            </h4>

            <div className="space-y-2">
              <a
                href="tel:+998901234567"
                className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 p-2 hover:border-[#005CB9]/30 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#005CB9]/10 grid place-items-center">
                  <Phone size={12} className="text-[#005CB9]" />
                </div>
                <div>
                  <div className="text-[8px] text-slate-500 uppercase">Telefon</div>
                  <div className="text-xs font-bold text-white">+998 90 123-45-67</div>
                </div>
              </a>

              <a
                href="mailto:support@book.uz"
                className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 p-2 hover:border-[#FF8A00]/30 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FF8A00]/10 grid place-items-center">
                  <Mail size={12} className="text-[#FF8A00]" />
                </div>
                <div>
                  <div className="text-[8px] text-slate-500 uppercase">Email</div>
                  <div className="text-xs font-bold text-white">support@book.uz</div>
                </div>
              </a>

              <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 p-2">
                <div className="w-7 h-7 rounded-lg bg-white/10 grid place-items-center">
                  <MapPin size={12} className="text-slate-400" />
                </div>
                <div>
                  <div className="text-[8px] text-slate-500 uppercase">Manzil</div>
                  <div className="text-xs font-bold text-white">Toshkent, Chilonzor</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex justify-center gap-3 mb-6">
          {["Uzcard", "Humo", "Visa", "Mastercard", "Payme", "Click"].map((payment, i) => (
            <div
              key={i}
              className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-bold text-slate-400 border border-white/5"
            >
              {payment}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px]">
          <p className="text-slate-500">
            © {currentYear} <span className="text-white font-bold">BOOK.UZ</span>. Barcha huquqlar himoyalangan.
          </p>

          <div className="flex items-center gap-3">
            <Link href="/privacy" className="text-slate-500 hover:text-[#005CB9] transition-colors">
              Maxfiylik
            </Link>
            <span className="w-1 h-1 bg-slate-600 rounded-full" />
            <Link href="/terms" className="text-slate-500 hover:text-[#FF8A00] transition-colors">
              Shartlar
            </Link>
            
            {/* Scroll top */}
            <button
              onClick={scrollToTop}
              className="ml-2 w-7 h-7 rounded-lg bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white grid place-items-center hover:shadow-lg transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Telegram icon
function TelegramIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}