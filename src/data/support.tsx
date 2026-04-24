import { Award, Clock, MessageCircle, Users } from "lucide-react";

export const faqs = [
    {
        question: 'Kitobni qanday qaytarish mumkin?',
        answer: "Agar kitobda nuqson bo'lsa, 14 kun ichida bepul almashtirib beramiz. Buning uchun do'konimizga murojaat qilishingiz yoki support@book.uz ga xabar yozishingiz mumkin."
    },
    {
        question: 'Audio kitobni qanday tinglash mumkin?',
        answer: "Sotib olingan audio kitoblar 'Mening kutubxonam' bo'limida. Yuklab olib, oflayn rejimda ham tinglashingiz mumkin. Mobil ilovamiz orqali ham qulay."
    },
    {
        question: 'Yetkazib berish narxi qancha?',
        answer: "Toshkent bo'ylab 15,000 so'm. 300,000 so'mdan yuqori xaridlarda BEPUL! Viloyatlarga yetkazish narxi 20,000-35,000 so'm."
    }
];

export const supportStats = [
    {
        icon: <Users size={24} color="#4dc3ff"/>,
        value: '50K+',
        label: 'Mijozlar',
        color: 'from-[#00a0e3] to-[#4dc3ff]'
    },
    {
        icon: <MessageCircle size={24} color="#ff9f4d"/>,
        value: '10 min',
        label: 'Tezkor javob',
        color: 'from-[#ef7f1a] to-[#ff9f4d]'
    },
    {
        icon: <Clock size={24} color="#4dc3ff"/>,
        value: '24/7',
        label: 'Xizmat',
        color: 'from-[#00a0e3] to-[#4dc3ff]'
    },
    {
        icon: <Award size={24} color="#ff9f4d"/>,
        value: '99%',
        label: 'Mamnun',
        color: 'from-[#ef7f1a] to-[#ff9f4d]'
    }
];
