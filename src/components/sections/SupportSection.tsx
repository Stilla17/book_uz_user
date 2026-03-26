"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle, 
  Headphones, 
  Users, 
  Award, 
  Sparkles,
  Send, 
  Clock, 
  CheckCircle, 
  ChevronDown,
  ChevronRight,
  Star,
  Heart,
  Crown,
  Zap,
  Gem,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Coffee,
  Compass
} from "lucide-react";

export const SupportSection = () => {
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "chat">("faq");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
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

  const faqs = [
    {
      question: "Kitobni qanday qaytarish mumkin?",
      answer: "Agar kitobda nuqson bo'lsa, 14 kun ichida bepul almashtirib beramiz. Buning uchun do'konimizga murojaat qilishingiz yoki support@book.uz ga xabar yozishingiz mumkin."
    },
    {
      question: "Audio kitobni qanday tinglash mumkin?",
      answer: "Sotib olingan audio kitoblar 'Mening kutubxonam' bo'limida. Yuklab olib, oflayn rejimda ham tinglashingiz mumkin. Mobil ilovamiz orqali ham qulay."
    },
    {
      question: "Yetkazib berish narxi qancha?",
      answer: "Toshkent bo'ylab 15,000 so'm. 300,000 so'mdan yuqori xaridlarda BEPUL! Viloyatlarga yetkazish narxi 20,000-35,000 so'm."
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage("");
    }, 2000);
  };

  // Floating icons array
  const floatingIcons = [Sparkles, Star, Heart, Crown, Zap, Award, Gem, Flower2, Sun, Moon, Cloud, Coffee, Compass, Headphones, MessageCircle];

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden relative">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        {[...Array(15)].map((_, i) => {
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

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full mb-4"
          >
            <Headphones size={16} className="text-[#00a0e3] dark:text-blue-400" />
            <span className="text-xs font-bold text-[#ef7f1a] dark:text-orange-400">QO'LLAB-QUVVATLASH</span>
            <Sparkles size={12} className="text-[#ef7f1a] dark:text-orange-400" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black mb-2"
          >
            <span className="text-[#00a0e3] dark:text-blue-400">Sizga qanday</span>{" "}
            <span className="text-[#ef7f1a] dark:text-orange-400">yordam bera olamiz?</span>
          </motion.h2>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { icon: <Users size={16}/>, val: "50K+", lab: "Mijozlar", color: "blue" },
            { icon: <MessageCircle size={16}/>, val: "10 min", lab: "Tezkor javob", color: "orange" },
            { icon: <Clock size={16}/>, val: "24/7", lab: "Xizmat", color: "blue" },
            { icon: <Award size={16}/>, val: "99%", lab: "Mamnun", color: "orange" },
          ].map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 text-center"
            >
              <div className={`inline-flex p-2 rounded-lg mb-2 ${
                s.color === 'blue' 
                  ? 'bg-[#00a0e3]/10 dark:bg-blue-600/20 text-[#00a0e3] dark:text-blue-400' 
                  : 'bg-[#ef7f1a]/10 dark:bg-orange-600/20 text-[#ef7f1a] dark:text-orange-400'
              }`}>
                {s.icon}
              </div>
              <div className="text-lg font-black text-gray-900 dark:text-white">{s.val}</div>
              <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{s.lab}</div>
            </motion.div>
          ))}
        </div>

        {/* Support Tabs */}
        <div className="flex p-1 bg-gray-100 dark:bg-slate-700 rounded-xl max-w-xs mx-auto mb-8">
          {[
            { id: "faq", label: "FAQ" },
            { id: "contact", label: "Aloqa" },
            { id: "chat", label: "Chat" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.id ? "text-white" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeSupportTab"
                  className="absolute inset-0 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="max-w-3xl mx-auto min-h-[350px]">
          <AnimatePresence mode="wait">
            {activeTab === "faq" && (
              <motion.div 
                key="faq"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                {faqs.map((f, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{f.question}</span>
                      <div className={`p-1.5 rounded-full transition-all ${
                        openFaq === i 
                          ? 'bg-[#ef7f1a] dark:bg-orange-600 text-white' 
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        <ChevronDown size={14} className={`transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-50 dark:border-slate-700 pt-2"
                        >
                          {f.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div 
                key="contact"
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                {[
                  { icon: <Phone size={18} />, title: "Telefon", val: "+998 71 200-99-99", sub: "Bepul qo'ng'iroq", color: "blue" },
                  { icon: <Mail size={18} />, title: "Email", val: "support@book.uz", sub: "24/7", color: "orange" },
                  { icon: <MessageCircle size={18} />, title: "Telegram", val: "@bookuz_bot", sub: "Online", color: "blue" },
                  { icon: <Clock size={18} />, title: "Ish vaqti", val: "09:00 - 22:00", sub: "Dushanba-Yakshanba", color: "orange" },
                ].map((c, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-[#00a0e3]/20 dark:hover:border-blue-500/30 transition-all group">
                    <div className={`flex items-center gap-3 ${
                      c.color === 'blue' 
                        ? 'text-[#00a0e3] dark:text-blue-400' 
                        : 'text-[#ef7f1a] dark:text-orange-400'
                    } mb-2`}>
                      {c.icon}
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{c.title}</span>
                    </div>
                    <div className="text-sm font-black text-gray-900 dark:text-white ml-9">{c.val}</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 ml-9 mt-1">{c.sub}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div 
                key="chat"
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden"
                initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Headphones size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Online konsultant</div>
                      <div className="text-[10px] text-white/80 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> 
                        Hozirda faol
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Body */}
                <div className="h-[250px] p-4 overflow-y-auto bg-gray-50/30 dark:bg-slate-700/30 space-y-4">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
                      B
                    </div>
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-xl rounded-tl-none text-xs text-gray-600 dark:text-gray-300 max-w-[80%] shadow-sm">
                      Assalomu alaykum! Qanday yordam kerak? 😊
                    </div>
                  </div>
                  {sent && (
                    <div className="flex gap-2 justify-end">
                      <div className="bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 p-3 rounded-xl rounded-tr-none text-xs text-white max-w-[80%] shadow-sm">
                        {message}
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Savolingizni yozing..." 
                    className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#00a0e3] dark:focus:ring-blue-600 outline-none"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="w-10 h-10 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all active:scale-90"
                  >
                    {sent ? <CheckCircle size={16} /> : <Send size={16} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Support Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mt-8"
        >
          <a 
            href="tel:+998901234567" 
            className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-[#00a0e3] dark:hover:text-blue-400 transition-colors"
          >
            <Phone size={14} />
            <span>+998 (90) 123-45-67</span>
            <ChevronRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};