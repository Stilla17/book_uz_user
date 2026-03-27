"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  ChevronDown, 
  Search,
  BookOpen,
  Truck,
  CreditCard,
  RotateCcw,
  Headphones,
  Shield,
  MessageCircle,
  X,
  Star,
  Clock,
  Package,
  CheckCircle,
  Sparkles,
  Mail,
  Phone,
  Send,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  views?: number;
  helpful?: number;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [helpfulFeedback, setHelpfulFeedback] = useState<{[key: number]: boolean}>({});

  const faqs: FAQItem[] = [
    {
      question: "Kitobni qanday qaytarish mumkin?",
      answer: "Agar kitobda bosma nuqsonlar bo'lsa yoki yetkazib berishda zarar ko'rgan bo'lsa, 14 kun ichida kvitansiya bilan birga bepul almashtirib beramiz. Buning uchun do'konimizga murojaat qilishingiz yoki support@book.uz ga xabar yozishingiz mumkin. Qaytarish jarayoni odatda 3-5 ish kunini oladi.",
      category: "qaytarish",
      views: 1243,
      helpful: 89
    },
    {
      question: "Audio kitobni qanday tinglash mumkin?",
      answer: "Sotib olingan audio kitoblar shaxsiy kabinetingizdagi 'Mening kutubxonam' bo'limida paydo bo'ladi. Ularni onlayn yoki oflayn (yuklab olib) tinglashingiz mumkin. Mobil ilovamiz orqali ham tinglash imkoniyati mavjud. Audio kitoblarni tinglash uchun internet tezligi kamida 2 Mbit/s bo'lishi tavsiya etiladi.",
      category: "audio",
      views: 987,
      helpful: 76
    },
    {
      question: "Yetkazib berish narxi qancha?",
      answer: "Toshkent shahri ichida standart yetkazib berish 15,000 so'm. 300,000 so'mdan yuqori xaridlar uchun yetkazib berish mutlaqo bepul! Viloyatlarga yetkazib berish narxi 20,000-35,000 so'm oralig'ida. Ekspress yetkazib berish (1-2 kun) qo'shimcha 20,000 so'm turadi.",
      category: "yetkazish",
      views: 2156,
      helpful: 94
    },
    {
      question: "Qanday to'lov turlari mavjud?",
      answer: "Bizda quyidagi to'lov turlari mavjud: naqd pul (yetkazib berishda), bank kartalari (Visa, Uzcard, Humo), onlayn to'lov tizimlari (Click, Payme, Apelsin). Barcha to'lovlar xavfsiz. Onlayn to'lovlar uchun qo'shimcha komissiya olinmaydi.",
      category: "tolov",
      views: 1876,
      helpful: 92
    },
    {
      question: "Buyurtmamni qanday kuzatishim mumkin?",
      answer: "Buyurtma berilgandan so'ng, shaxsiy kabinetingizdagi 'Buyurtmalarim' bo'limida buyurtma holatini kuzatishingiz mumkin. Har bir buyurtma uchun tracking raqami beriladi. Tracking raqami orqali pochta xizmati saytida ham buyurtmangizni kuzatishingiz mumkin.",
      category: "buyurtma",
      views: 1432,
      helpful: 88
    },
    {
      question: "Elektron kitoblarni qanday qurilmalarda o'qish mumkin?",
      answer: "Elektron kitoblarni kompyuter, planshet, smartfon va maxsus o'quv qurilmalarida (PocketBook, Kindle) o'qishingiz mumkin. Bizning mobil ilovamiz barcha platformalarda mavjud. PDF, EPUB, FB2 va MOBI formatlari qo'llab-quvvatlanadi.",
      category: "format",
      views: 765,
      helpful: 71
    },
    {
      question: "Promokodni qanday ishlatish mumkin?",
      answer: "Promokodni savat sahifasida maxsus maydonga kiritishingiz kerak. Promokod qo'llanilgandan so'ng, chegirma avtomatik ravishda hisoblanadi. Har bir promokod faqat bir marta ishlatilishi mumkin va amal qilish muddati mavjud.",
      category: "chegirma",
      views: 654,
      helpful: 67
    },
    {
      question: "Kitobni do'kondan olib ketish mumkinmi?",
      answer: "Ha, albatta. Buyurtma berishda 'Do'kondan olib ketish' variantini tanlashingiz mumkin. Buyurtma tayyor bo'lgach, sizga SMS orqali xabar beramiz. Olib ketish punktlarimiz: Toshkent, Samarqand, Buxoro, Andijon va Farg'ona shaharlarida mavjud.",
      category: "yetkazish",
      views: 543,
      helpful: 63
    }
  ];

  const categories = [
    { id: "all", name: "Barchasi", icon: <HelpCircle size={16} />, count: faqs.length },
    { id: "yetkazish", name: "Yetkazib berish", icon: <Truck size={16} />, count: faqs.filter(f => f.category === "yetkazish").length },
    { id: "tolov", name: "To'lov", icon: <CreditCard size={16} />, count: faqs.filter(f => f.category === "tolov").length },
    { id: "qaytarish", name: "Qaytarish", icon: <RotateCcw size={16} />, count: faqs.filter(f => f.category === "qaytarish").length },
    { id: "audio", name: "Audio kitoblar", icon: <Headphones size={16} />, count: faqs.filter(f => f.category === "audio").length },
    { id: "format", name: "Formatlar", icon: <BookOpen size={16} />, count: faqs.filter(f => f.category === "format").length },
    { id: "chegirma", name: "Chegirmalar", icon: <Shield size={16} />, count: faqs.filter(f => f.category === "chegirma").length },
    { id: "buyurtma", name: "Buyurtmalar", icon: <Package size={16} />, count: faqs.filter(f => f.category === "buyurtma").length },
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleHelpful = (index: number) => {
    setHelpfulFeedback(prev => ({...prev, [index]: true}));
    // Here you would typically send feedback to backend
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFaqs = faqs.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full mb-4">
            <HelpCircle size={16} className="text-[#005CB9] dark:text-blue-400" />
            <span className="text-xs font-bold text-[#FF8A00] dark:text-orange-400">FAQ</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            <span className="text-[#005CB9] dark:text-blue-400">{'Tez-tez so\'raladigan'}</span>
            <span className="text-[#FF8A00] dark:text-orange-400"> savollar</span>
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">{' Savollaringizga javob topa olmadingizmi? Biz bilan bog\'lanishingiz mumkin. '}</p>
        </motion.div>

        {/* Popular FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {popularFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 hover:shadow-md dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all cursor-pointer group"
              onClick={() => {
                const faqIndex = faqs.findIndex(f => f.question === faq.question);
                if (!openItems.includes(faqIndex)) {
                  toggleItem(faqIndex);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#FF8A00]/10 dark:bg-orange-600/20 rounded-lg">
                  <Sparkles size={16} className="text-[#FF8A00] dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#005CB9] dark:group-hover:text-blue-400 transition-colors">
                    {faq.question}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <Eye size={12} />
                    <span>{faq.views}{' marta ko\'rilgan'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Savolni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-[#005CB9] dark:bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {category.icon}
              {category.name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const originalIndex = faqs.findIndex(f => f.question === faq.question);
              return (
                <motion.div
                  key={originalIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all"
                >
                  <button
                    onClick={() => toggleItem(originalIndex)}
                    className="w-full flex items-center justify-between p-6 text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        openItems.includes(originalIndex)
                          ? 'bg-[#005CB9]/10 dark:bg-blue-600/20'
                          : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-[#005CB9]/10 dark:group-hover:bg-blue-600/20'
                      }`}>
                        <HelpCircle size={18} className={`transition-colors ${
                          openItems.includes(originalIndex)
                            ? 'text-[#005CB9] dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500 group-hover:text-[#005CB9] dark:group-hover:text-blue-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg pr-8">
                          {faq.question}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {faq.views}{' marta ko\'rilgan '}</span>
                          {faq.helpful && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              {faq.helpful} kishi foydali deb topgan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-[#005CB9] dark:text-blue-400 transition-all duration-300 ${
                        openItems.includes(originalIndex) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openItems.includes(originalIndex) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                          
                          {/* Helpful buttons */}
                          {!helpfulFeedback[originalIndex] && (
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Bu javob sizga yordam berdimi?
                              </span>
                              <button
                                onClick={() => handleHelpful(originalIndex)}
                                className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
                              >
                                <CheckCircle size={14} />
                                Ha
                              </button>
                              <button className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm">
                                <X size={14} />{' Yo\'q '}</button>
                            </div>
                          )}
                          
                          {helpfulFeedback[originalIndex] && (
                            <div className="flex items-center gap-2 mt-4 text-green-600 dark:text-green-400">
                              <CheckCircle size={16} />
                              <span className="text-sm">Fikringiz uchun rahmat!</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700"
            >
              <HelpCircle size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Hech narsa topilmadi</p>
              <p className="text-gray-400 dark:text-gray-500 mb-4">{' "'}{searchQuery}{'" bo\'yicha hech qanday savol topilmadi '}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-[#005CB9] dark:text-blue-400 hover:underline text-sm"
              >
                Filtrlarni tozalash
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#005CB9]/10 dark:bg-blue-600/20 rounded-xl">
                <Mail size={24} className="text-[#005CB9] dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Email orqali</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  24 soat ichida javob olasiz
                </p>
                <a 
                  href="mailto:support@book.uz" 
                  className="inline-flex items-center gap-2 text-[#005CB9] dark:text-blue-400 hover:underline"
                >
                  support@book.uz
                  <Send size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FF8A00]/10 dark:bg-orange-600/20 rounded-xl">
                <Phone size={24} className="text-[#FF8A00] dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Telefon orqali</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                  Dushanba-Juma, 09:00-20:00
                </p>
                <a 
                  href="tel:+998712345678" 
                  className="inline-flex items-center gap-2 text-[#FF8A00] dark:text-orange-400 hover:underline"
                >
                  +998 71 234-56-78
                  <Phone size={14} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-[#005CB9]/5 to-[#FF8A00]/5 dark:from-blue-600/10 dark:to-orange-600/10 rounded-2xl p-8 text-center border border-gray-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            Savolingizga javob topa olmadingizmi?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{' Bizning qo\'llab-quvvatlash jamoamiz sizga yordam berishga tayyor. '}</p>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600 text-white font-bold px-8 py-6 rounded-xl hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all">
              <MessageCircle size={18} className="mr-2" />{' Biz bilan bog\'lanish '}</Button>
          </Link>
        </motion.div>

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
            <Headphones size={16} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-400 dark:text-gray-500">{'24/7 qo\'llab-quvvatlash'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}