import { Statistic, TeamMember, TimelineEvent } from '@/types/about';

import {
    BookOpen,
    Crown,
    Download,
    Eye,
    Globe,
    Headphones,
    Heart,
    Rocket,
    Shield,
    Star,
    Target,
    Users
} from 'lucide-react';

// Statistics data with new colors
export const statistics: Statistic[] = [
    {
        icon: <BookOpen size={28} />,
        value: '50,000+',
        label: 'Kitoblar',
        labelRu: 'Книги',
        labelEn: 'Books',
        color: 'from-[#00a0e3] to-[#4dc3ff]'
    },
    {
        icon: <Headphones size={28} />,
        value: '10,000+',
        label: 'Audio kitoblar',
        labelRu: 'Аудиокниги',
        labelEn: 'Audiobooks',
        color: 'from-[#ef7f1a] to-[#ff9f4d]'
    },
    {
        icon: <Users size={28} />,
        value: '1M+',
        label: 'Foydalanuvchilar',
        labelRu: 'Пользователи',
        labelEn: 'Users',
        color: 'from-[#00a0e3] to-[#ef7f1a]'
    },
    {
        icon: <Download size={28} />,
        value: '5M+',
        label: 'Yuklab olishlar',
        labelRu: 'Загрузки',
        labelEn: 'Downloads',
        color: 'from-[#4dc3ff] to-[#00a0e3]'
    },
    {
        icon: <Star size={28} />,
        value: '4.8',
        label: "O'rtacha reyting",
        labelRu: 'Средний рейтинг',
        labelEn: 'Average rating',
        color: 'from-[#ef7f1a] to-[#ff9f4d]'
    },
    {
        icon: <Globe size={28} />,
        value: '15',
        label: 'Mamlakatlar',
        labelRu: 'Страны',
        labelEn: 'Countries',
        color: 'from-[#00a0e3] to-[#4dc3ff]'
    }
];

// Team members data

export const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Alisher Karimov',
        position: 'Asoschi & CEO',
        positionRu: 'Основатель & CEO',
        positionEn: 'Founder & CEO',
        bio: '10 yillik IT va kitob biznesi tajribasiga ega. 50+ loyihalarni muvaffaqiyatli boshqargan.',
        bioRu: 'Имеет 10-летний опыт в IT и книжном бизнесе. Успешно руководил 50+ проектами.',
        bioEn: '10 years of experience in IT and book business. Successfully managed 50+ projects.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887',
        social: {
            linkedin: '#',
            twitter: '#'
        }
    },
    {
        id: '2',
        name: 'Madina Rahimova',
        position: 'Marketing direktori',
        positionRu: 'Директор по маркетингу',
        positionEn: 'Marketing Director',
        bio: 'Marketing sohasida 8 yillik tajriba. 100+ brend bilan hamkorlik qilgan.',
        bioRu: '8-летний опыт в маркетинге. Сотрудничала с 100+ брендами.',
        bioEn: '8 years of marketing experience. Collaborated with 100+ brands.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888',
        social: {
            instagram: '#',
            linkedin: '#'
        }
    },
    {
        id: '3',
        name: 'Jasur Tursunov',
        position: 'Texnik direktor',
        positionRu: 'Технический директор',
        positionEn: 'CTO',
        bio: 'Full-stack developer, 7 yillik tajriba. 30+ yirik loyihalarni ishlab chiqqan.',
        bioRu: 'Full-stack разработчик, 7 лет опыта. Разработал 30+ крупных проектов.',
        bioEn: 'Full-stack developer, 7 years experience. Developed 30+ major projects.',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887',
        social: {
            linkedin: '#'
        }
    },
    {
        id: '4',
        name: 'Nilufar Azizova',
        position: 'Content menejeri',
        positionRu: 'Контент-менеджер',
        positionEn: 'Content Manager',
        bio: 'Filolog, 5 yillik muharrirlik tajribasi. 1000+ kitobni tahrir qilgan.',
        bioRu: 'Филолог, 5 лет редакторского опыта. Отредактировала 1000+ книг.',
        bioEn: 'Philologist, 5 years of editing experience. Edited 1000+ books.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961',
        social: {
            instagram: '#',
            linkedin: '#'
        }
    }
];

// Timeline events
export const timelineEvents: TimelineEvent[] = [
    {
        year: '2020',
        title: 'BOOK.UZ tashkil topdi',
        titleRu: 'BOOK.UZ основан',
        titleEn: 'BOOK.UZ founded',
        description: "Kitobxonlar uchun zamonaviy platforma yaratish g'oyasi bilan ish boshladik.",
        descriptionRu: 'Мы начали с идеи создания современной платформы для читателей.',
        descriptionEn: 'We started with the idea of creating a modern platform for readers.',
        icon: <Rocket size={20} />
    },
    {
        year: '2021',
        title: "10,000 kitoblar to'plami",
        titleRu: '10,000 книг в коллекции',
        titleEn: '10,000 books collection',
        description: "Kutubxonamizda 10,000 dan ortiq kitoblar to'plandi.",
        descriptionRu: 'В нашей библиотеке собрано более 10,000 книг.',
        descriptionEn: 'Our library collected over 10,000 books.',
        icon: <BookOpen size={20} />
    },
    {
        year: '2022',
        title: 'Audio kitoblar xizmati',
        titleRu: 'Сервис аудиокниг',
        titleEn: 'Audiobook service',
        description: "Audio kitoblar yo'nalishini ochdik va 5,000+ audio kitob qo'shdik.",
        descriptionRu: 'Мы запустили аудиокниги и добавили 5,000+ аудиокниг.',
        descriptionEn: 'We launched audiobooks and added 5,000+ audiobooks.',
        icon: <Headphones size={20} />
    },
    {
        year: '2023',
        title: '1 million foydalanuvchi',
        titleRu: '1 миллион пользователей',
        titleEn: '1 million users',
        description: 'Platformamizdan 1 milliondan ortiq foydalanuvchi foydalanmoqda.',
        descriptionRu: 'Нашей платформой пользуются более 1 миллиона пользователей.',
        descriptionEn: 'Our platform is used by over 1 million users.',
        icon: <Users size={20} />
    },
    {
        year: '2024',
        title: 'Xalqaro bozorga chiqish',
        titleRu: 'Выход на международный рынок',
        titleEn: 'International expansion',
        description: "15 ta mamlakatda xizmat ko'rsata boshladik.",
        descriptionRu: 'Мы начали提供服务 в 15 странах.',
        descriptionEn: 'We started serving in 15 countries.',
        icon: <Globe size={20} />
    },
    {
        year: '2025',
        title: 'Premium obuna xizmati',
        titleRu: 'Премиум подписка',
        titleEn: 'Premium subscription',
        description: 'Cheksiz kitoblar va maxsus imkoniyatlarga ega premium obunani ishga tushirdik.',
        descriptionRu: 'Мы запустили премиум-подписку с безлимитными книгами.',
        descriptionEn: 'We launched premium subscription with unlimited books.',
        icon: <Crown size={20} />
    }
];

// Values data with new colors
export const values = [
    {
        icon: <Heart size={24} />,
        title: 'Kitobxonlarga muhabbat',
        titleRu: 'Любовь к читателям',
        titleEn: 'Love for readers',
        description: "Har bir foydalanuvchimizni qadrlaymiz va ularning ehtiyojlarini birinchi o'ringa qo'yamiz.",
        descriptionRu: 'Мы ценим каждого пользователя и ставим их потребности на первое место.',
        descriptionEn: 'We value every user and prioritize their needs.',
        color: 'from-[#00a0e3] to-[#ef7f1a]'
    },
    {
        icon: <Target size={24} />,
        title: 'Sifat',
        titleRu: 'Качество',
        titleEn: 'Quality',
        description: 'Eng yuqori sifatli kitoblar va audio kontentni taqdim etamiz.',
        descriptionRu: 'Мы предоставляем книги и аудиоконтент высочайшего качества.',
        descriptionEn: 'We provide the highest quality books and audio content.',
        color: 'from-[#00a0e3] to-[#4dc3ff]'
    },
    {
        icon: <Eye size={24} />,
        title: 'Innovatsiya',
        titleRu: 'Инновации',
        titleEn: 'Innovation',
        description: 'Doimiy ravishda yangi texnologiyalarni joriy qilamiz va xizmatlarimizni takomillashtiramiz.',
        descriptionRu: 'Мы постоянно внедряем новые технологии и улучшаем наши услуги.',
        descriptionEn: 'We constantly introduce new technologies and improve our services.',
        color: 'from-[#ef7f1a] to-[#ff9f4d]'
    },
    {
        icon: <Shield size={24} />,
        title: 'Ishonchlilik',
        titleRu: 'Надежность',
        titleEn: 'Reliability',
        description: "Ma'lumotlaringiz xavfsizligi va to'lovlar ishonchliligiga kafolat beramiz.",
        descriptionRu: 'Мы гарантируем безопасность ваших данных и надежность платежей.',
        descriptionEn: 'We guarantee the security of your data and reliability of payments.',
        color: 'from-[#00a0e3] to-[#4dc3ff]'
    }
];
