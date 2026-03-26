// app/about/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Heart,
  Users,
  Award,
  Target,
  Eye,
  Globe,
  Clock,
  Headphones,
  Download,
  Infinity,
  Shield,
  Truck,
  CreditCard,
  MessageCircle,
  Star,
  Zap,
  Crown,
  Gem,
  Diamond,
  Flower2,
  Sun,
  Moon,
  Cloud,
  Coffee,
  Compass,
  Map,
  Rocket,
  TrendingUp,
  Wallet,
  Gift,
  ThumbsUp,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Twitter as XIcon,
  Send,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
import { api } from "@/services/api";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  positionRu: string;
  positionEn: string;
  bio: string;
  bioRu: string;
  bioEn: string;
  image: string;
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface Statistic {
  icon: React.ReactNode;
  value: string;
  label: string;
  labelRu: string;
  labelEn: string;
  color: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  titleRu: string;
  titleEn: string;
  description: string;
  descriptionRu: string;
  descriptionEn: string;
  icon: React.ReactNode;
}

export default function AboutPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"team" | "values" | "history">("team");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
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

  // Team members data
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Alisher Karimov",
      position: "Asoschi & CEO",
      positionRu: "Основатель & CEO",
      positionEn: "Founder & CEO",
      bio: "10 yillik IT va kitob biznesi tajribasiga ega. 50+ loyihalarni muvaffaqiyatli boshqargan.",
      bioRu: "Имеет 10-летний опыт в IT и книжном бизнесе. Успешно руководил 50+ проектами.",
      bioEn: "10 years of experience in IT and book business. Successfully managed 50+ projects.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887",
      social: {
        linkedin: "#",
        twitter: "#",
      }
    },
    {
      id: "2",
      name: "Madina Rahimova",
      position: "Marketing direktori",
      positionRu: "Директор по маркетингу",
      positionEn: "Marketing Director",
      bio: "Marketing sohasida 8 yillik tajriba. 100+ brend bilan hamkorlik qilgan.",
      bioRu: "8-летний опыт в маркетинге. Сотрудничала с 100+ брендами.",
      bioEn: "8 years of marketing experience. Collaborated with 100+ brands.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888",
      social: {
        instagram: "#",
        linkedin: "#",
      }
    },
    {
      id: "3",
      name: "Jasur Tursunov",
      position: "Texnik direktor",
      positionRu: "Технический директор",
      positionEn: "CTO",
      bio: "Full-stack developer, 7 yillik tajriba. 30+ yirik loyihalarni ishlab chiqqan.",
      bioRu: "Full-stack разработчик, 7 лет опыта. Разработал 30+ крупных проектов.",
      bioEn: "Full-stack developer, 7 years experience. Developed 30+ major projects.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887",
      social: {
        linkedin: "#",
      }
    },
    {
      id: "4",
      name: "Nilufar Azizova",
      position: "Content menejeri",
      positionRu: "Контент-менеджер",
      positionEn: "Content Manager",
      bio: "Filolog, 5 yillik muharrirlik tajribasi. 1000+ kitobni tahrir qilgan.",
      bioRu: "Филолог, 5 лет редакторского опыта. Отредактировала 1000+ книг.",
      bioEn: "Philologist, 5 years of editing experience. Edited 1000+ books.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961",
      social: {
        instagram: "#",
        linkedin: "#",
      }
    }
  ];

  // Statistics data with new colors
  const statistics: Statistic[] = [
    {
      icon: <BookOpen size={28} />,
      value: "50,000+",
      label: "Kitoblar",
      labelRu: "Книги",
      labelEn: "Books",
      color: "from-[#00a0e3] to-[#4dc3ff]"
    },
    {
      icon: <Headphones size={28} />,
      value: "10,000+",
      label: "Audio kitoblar",
      labelRu: "Аудиокниги",
      labelEn: "Audiobooks",
      color: "from-[#ef7f1a] to-[#ff9f4d]"
    },
    {
      icon: <Users size={28} />,
      value: "1M+",
      label: "Foydalanuvchilar",
      labelRu: "Пользователи",
      labelEn: "Users",
      color: "from-[#00a0e3] to-[#ef7f1a]"
    },
    {
      icon: <Download size={28} />,
      value: "5M+",
      label: "Yuklab olishlar",
      labelRu: "Загрузки",
      labelEn: "Downloads",
      color: "from-[#4dc3ff] to-[#00a0e3]"
    },
    {
      icon: <Star size={28} />,
      value: "4.8",
      label: "O'rtacha reyting",
      labelRu: "Средний рейтинг",
      labelEn: "Average rating",
      color: "from-[#ef7f1a] to-[#ff9f4d]"
    },
    {
      icon: <Globe size={28} />,
      value: "15",
      label: "Mamlakatlar",
      labelRu: "Страны",
      labelEn: "Countries",
      color: "from-[#00a0e3] to-[#4dc3ff]"
    }
  ];

  // Timeline events
  const timelineEvents: TimelineEvent[] = [
    {
      year: "2020",
      title: "BOOK.UZ tashkil topdi",
      titleRu: "BOOK.UZ основан",
      titleEn: "BOOK.UZ founded",
      description: "Kitobxonlar uchun zamonaviy platforma yaratish g'oyasi bilan ish boshladik.",
      descriptionRu: "Мы начали с идеи создания современной платформы для читателей.",
      descriptionEn: "We started with the idea of creating a modern platform for readers.",
      icon: <Rocket size={20} />
    },
    {
      year: "2021",
      title: "10,000 kitoblar to'plami",
      titleRu: "10,000 книг в коллекции",
      titleEn: "10,000 books collection",
      description: "Kutubxonamizda 10,000 dan ortiq kitoblar to'plandi.",
      descriptionRu: "В нашей библиотеке собрано более 10,000 книг.",
      descriptionEn: "Our library collected over 10,000 books.",
      icon: <BookOpen size={20} />
    },
    {
      year: "2022",
      title: "Audio kitoblar xizmati",
      titleRu: "Сервис аудиокниг",
      titleEn: "Audiobook service",
      description: "Audio kitoblar yo'nalishini ochdik va 5,000+ audio kitob qo'shdik.",
      descriptionRu: "Мы запустили аудиокниги и добавили 5,000+ аудиокниг.",
      descriptionEn: "We launched audiobooks and added 5,000+ audiobooks.",
      icon: <Headphones size={20} />
    },
    {
      year: "2023",
      title: "1 million foydalanuvchi",
      titleRu: "1 миллион пользователей",
      titleEn: "1 million users",
      description: "Platformamizdan 1 milliondan ortiq foydalanuvchi foydalanmoqda.",
      descriptionRu: "Нашей платформой пользуются более 1 миллиона пользователей.",
      descriptionEn: "Our platform is used by over 1 million users.",
      icon: <Users size={20} />
    },
    {
      year: "2024",
      title: "Xalqaro bozorga chiqish",
      titleRu: "Выход на международный рынок",
      titleEn: "International expansion",
      description: "15 ta mamlakatda xizmat ko'rsata boshladik.",
      descriptionRu: "Мы начали提供服务 в 15 странах.",
      descriptionEn: "We started serving in 15 countries.",
      icon: <Globe size={20} />
    },
    {
      year: "2025",
      title: "Premium obuna xizmati",
      titleRu: "Премиум подписка",
      titleEn: "Premium subscription",
      description: "Cheksiz kitoblar va maxsus imkoniyatlarga ega premium obunani ishga tushirdik.",
      descriptionRu: "Мы запустили премиум-подписку с безлимитными книгами.",
      descriptionEn: "We launched premium subscription with unlimited books.",
      icon: <Crown size={20} />
    }
  ];

  // Values data with new colors
  const values = [
    {
      icon: <Heart size={24} />,
      title: "Kitobxonlarga muhabbat",
      titleRu: "Любовь к читателям",
      titleEn: "Love for readers",
      description: "Har bir foydalanuvchimizni qadrlaymiz va ularning ehtiyojlarini birinchi o'ringa qo'yamiz.",
      descriptionRu: "Мы ценим каждого пользователя и ставим их потребности на первое место.",
      descriptionEn: "We value every user and prioritize their needs.",
      color: "from-[#00a0e3] to-[#ef7f1a]"
    },
    {
      icon: <Target size={24} />,
      title: "Sifat",
      titleRu: "Качество",
      titleEn: "Quality",
      description: "Eng yuqori sifatli kitoblar va audio kontentni taqdim etamiz.",
      descriptionRu: "Мы предоставляем книги и аудиоконтент высочайшего качества.",
      descriptionEn: "We provide the highest quality books and audio content.",
      color: "from-[#00a0e3] to-[#4dc3ff]"
    },
    {
      icon: <Eye size={24} />,
      title: "Innovatsiya",
      titleRu: "Инновации",
      titleEn: "Innovation",
      description: "Doimiy ravishda yangi texnologiyalarni joriy qilamiz va xizmatlarimizni takomillashtiramiz.",
      descriptionRu: "Мы постоянно внедряем новые технологии и улучшаем наши услуги.",
      descriptionEn: "We constantly introduce new technologies and improve our services.",
      color: "from-[#ef7f1a] to-[#ff9f4d]"
    },
    {
      icon: <Shield size={24} />,
      title: "Ishonchlilik",
      titleRu: "Надежность",
      titleEn: "Reliability",
      description: "Ma'lumotlaringiz xavfsizligi va to'lovlar ishonchliligiga kafolat beramiz.",
      descriptionRu: "Мы гарантируем безопасность ваших данных и надежность платежей.",
      descriptionEn: "We guarantee the security of your data and reliability of payments.",
      color: "from-[#00a0e3] to-[#4dc3ff]"
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email manzilingizni kiriting");
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/newsletter/subscribe', { email });
      toast.success("Obuna bo'ldingiz!");
      setEmail("");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Icons */}
        {[...Array(25)].map((_, i) => {
          const icons = [BookOpen, Sparkles, Star, Heart, Crown, Zap, Award, Gem, Diamond, Flower2, Sun, Moon, Cloud, Coffee, Compass];
          const IconComponent = icons[i % icons.length];
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
          className="absolute top-20 left-20 w-96 h-96 bg-[#00a0e3]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#ef7f1a]/10 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 rounded-full mb-6"
          >
            <Sparkles size={16} className="text-[#00a0e3]" />
            <span className="text-sm font-bold text-[#ef7f1a]">BIZ HAQIMIZDA</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a0e3] via-[#ef7f1a] to-[#00a0e3]">
              Kitobxonlar uchun
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">eng yaxshi platforma</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 dark:text-gray-400 max-w-3xl mx-auto text-xl"
          >
            BOOK.UZ - O'zbekistonning eng katta raqamli kutubxonasi.
            Biz 50,000+ kitob va 10,000+ audio kitoblar bilan sizga eng yaxshi o'qish tajribasini taqdim etamiz.
          </motion.p>

          {/* CTA Buttons with new colors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Link href="/catalog">
              <Button className="bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] text-white px-8 py-6 text-lg rounded-xl hover:shadow-xl transition-all">
                <BookOpen size={20} className="mr-2" />
                Kitoblarni ko'rish
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="px-8 py-6 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#00a0e3] hover:text-[#00a0e3] transition-all">
                <Mail size={20} className="mr-2" />
                Bog'lanish
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20"
        >
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.7 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs with new colors */}
        <div className="mb-8">
          <div className="flex justify-center gap-4">
            {[
              { id: "team", label: "Jamoa", icon: <Users size={18} /> },
              { id: "values", label: "Qadriyatlar", icon: <Heart size={18} /> },
              { id: "history", label: "Tarix", icon: <Clock size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${activeTab === tab.id
                    ? "bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] text-white shadow-lg scale-105"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#00a0e3]"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Team Tab */}
          {activeTab === "team" && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Bizning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a]">jamoa</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group relative"
                  >
                    <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Social Links */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
                        {member.social?.facebook && (
                          <a href={member.social.facebook} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#00a0e3] hover:bg-[#00a0e3] hover:text-white transition-colors">
                            <Facebook size={16} />
                          </a>
                        )}
                        {member.social?.twitter && (
                          <a href={member.social.twitter} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#00a0e3] hover:bg-[#00a0e3] hover:text-white transition-colors">
                            <XIcon size={16} />
                          </a>
                        )}
                        {member.social?.instagram && (
                          <a href={member.social.instagram} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#00a0e3] hover:bg-[#00a0e3] hover:text-white transition-colors">
                            <Instagram size={16} />
                          </a>
                        )}
                        {member.social?.linkedin && (
                          <a href={member.social.linkedin} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#00a0e3] hover:bg-[#00a0e3] hover:text-white transition-colors">
                            <Linkedin size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                      <p className="text-[#00a0e3] dark:text-[#ef7f1a] font-medium">{member.position}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{member.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Values Tab */}
          {activeTab === "values" && (
            <motion.div
              key="values"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Bizning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a]">qadriyatlarimiz</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-gradient-to-br ${value.color} p-1 rounded-2xl`}
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 h-full">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-4`}>
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Bizning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a]">tariximiz</span>
              </h2>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#00a0e3] to-[#ef7f1a] hidden md:block" />

                {timelineEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                  >
                    {/* Year Badge */}
                    <div className="md:w-1/2 flex justify-center md:justify-end md:pr-12">
                      <div className={`bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] p-8 rounded-2xl text-center ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                        }`}>
                        <span className="text-4xl font-black text-white">{event.year}</span>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white dark:bg-slate-800 border-4 border-[#00a0e3] rounded-full hidden md:flex items-center justify-center">
                      <div className="w-4 h-4 bg-[#ef7f1a] rounded-full" />
                    </div>

                    {/* Content */}
                    <div className="md:w-1/2 mt-4 md:mt-0 md:pl-12">
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] flex items-center justify-center text-white">
                            {event.icon}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.title}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mission & Vision with new colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20"
        >
          <div className="bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10 rounded-2xl p-8 border border-[#00a0e3]/20">
            <Target size={40} className="text-[#00a0e3] mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bizning missiyamiz</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              O'zbekistonda kitobxonlik madaniyatini rivojlantirish va har bir insonga
              sifatli kitoblarni qulay narxlarda taqdim etish. Biz orqali millionlab
              odamlar bilim olish va zavqlanish imkoniyatiga ega bo'ladi.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#ef7f1a]/10 to-[#00a0e3]/10 rounded-2xl p-8 border border-[#ef7f1a]/20">
            <Eye size={40} className="text-[#ef7f1a] mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bizning vizyonimiz</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Markaziy Osiyodagi eng yirik raqamli kutubxonaga aylanish va 5 yil ichida
              10 milliondan ortiq foydalanuvchiga xizmat ko'rsatish. Innovatsion
              texnologiyalar orqali kitob o'qishni yanada qulay va maroqli qilish.
            </p>
          </div>
        </motion.div>

        {/* Newsletter Section with new colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-br from-[#00a0e3] to-[#ef7f1a] rounded-3xl p-12 text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Yangiliklardan xabardor bo'ling
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Eng so'nggi kitoblar, aksiyalar va yangiliklar haqida birinchi bo'lib xabar oling
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email manzilingiz"
              className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/60 text-lg h-14"
            />
            <Button
              type="submit"
              disabled={submitting}
              className="bg-white text-[#00a0e3] hover:bg-white/90 px-8 h-14 text-lg font-bold"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="mr-2" />}
              {submitting ? "Yuborilmoqda..." : "Obuna bo'lish"}
            </Button>
          </form>
        </motion.div>

        {/* Contact Info with new colors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          <div className="p-6">
            <div className="w-12 h-12 mx-auto bg-[#00a0e3]/10 rounded-xl flex items-center justify-center text-[#00a0e3] mb-3">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Manzil</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Toshkent sh., Chilonzor tumani<br />
              19-kvartal, 45-uy
            </p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 mx-auto bg-[#ef7f1a]/10 rounded-xl flex items-center justify-center text-[#ef7f1a] mb-3">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Telefon</h3>
            <a href="tel:+998901234567" className="text-gray-500 dark:text-gray-400 hover:text-[#00a0e3] transition-colors">
              +998 (90) 123-45-67
            </a>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 rounded-xl flex items-center justify-center text-[#00a0e3] mb-3">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Email</h3>
            <a href="mailto:info@book.uz" className="text-gray-500 dark:text-gray-400 hover:text-[#00a0e3] transition-colors">
              info@book.uz
            </a>
          </div>
        </motion.div>

        {/* Social Links with new colors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-12 flex justify-center gap-4"
        >
          {[
            { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
            { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
            { icon: <Instagram size={20} />, href: "#", label: "Instagram" },
            { icon: <Youtube size={20} />, href: "#", label: "YouTube" },
            { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn" },
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -5 }}
              className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#00a0e3] hover:text-white dark:hover:bg-[#ef7f1a] transition-all"
              title={social.label}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}