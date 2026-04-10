'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowUp,
    BookOpen,
    Facebook,
    Headphones,
    Heart,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Send,
    Sparkles,
    Star,
    Youtube
} from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const reduceMotion = useReducedMotion();

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const footerLinks = {
        platform: [
            { name: 'Asosiy', href: '/' },
            { name: 'Kitoblar', href: '/books' },
            { name: 'Audio kitoblar', href: '/audio' },
            { name: 'Yangi kelganlar', href: '/new' },
            { name: 'Chegirmalar', href: '/sale' },
            { name: 'Bestsellerlar', href: '/bestsellers' }
        ],
        support: [
            { name: 'Yordam markazi', href: '/help' },
            { name: "To'lov usullari", href: '/payment' },
            { name: 'Yetkazib berish', href: '/shipping' },
            { name: 'Qaytarish shartlari', href: '/returns' },
            { name: 'Maxfiylik siyosati', href: '/privacy' },
            { name: 'Foydalanish shartlari', href: '/terms' }
        ],
        company: [
            { name: 'Biz haqimizda', href: '/about' },
            { name: 'Vakansiyalar', href: '/jobs' },
            { name: 'Hamkorlik', href: '/partnership' },
            { name: 'Blog', href: '/blog' },
            { name: 'Aloqa', href: '/contact' },
            { name: 'Reklama', href: '/advertising' }
        ]
    };

    const socials = [
        { name: 'Instagram', href: '#', Icon: Instagram, color: 'hover:bg-pink-600' },
        { name: 'Telegram', href: '#', Icon: TelegramIcon, color: 'hover:bg-blue-500' },
        { name: 'Facebook', href: '#', Icon: Facebook, color: 'hover:bg-blue-600' },
        { name: 'YouTube', href: '#', Icon: Youtube, color: 'hover:bg-red-600' }
    ];

    return (
        <footer className='relative overflow-hidden bg-gradient-to-b from-slate-900 to-black text-slate-300'>
            {/* Decorative top line */}
            <div className='absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#005CB9] to-transparent' />

            {/* Background glows */}
            <div className='pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#005CB9]/10 blur-[120px]' />
            <div className='pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#FF8A00]/10 blur-[120px]' />

            {/* Decorative grid */}
            <div
                className='absolute inset-0'
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className='relative z-10 container mx-auto max-w-6xl px-4 pt-12 pb-8'>
                <div className='mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12'>
                    {/* Brand - colSpan 4 */}
                    <div className='space-y-4 lg:col-span-4'>
                        <Link href='/' className='group inline-flex items-center gap-2'>
                            <div className='grid h-15 w-15 place-items-center rounded-xl bg-gradient-to-r text-lg font-black text-white'>
                                <img src='/images/Logo.svg' alt='' />
                            </div>
                            <div>
                                <div className='text-[10px] text-slate-400'>Raqamli kutubxona</div>
                            </div>
                        </Link>

                        <p className='max-w-sm text-xs leading-relaxed text-slate-400'>
                            O'zbekistondagi eng katta raqamli kutubxona. 50,000+ elektron va audio kitoblar. O'qing,
                            tinglang, kashf eting.
                        </p>

                        {/* Newsletter */}
                        <div className='space-y-2'>
                            <h4 className='text-xs font-bold tracking-wider text-white uppercase'>
                                Yangiliklarga obuna bo'ling
                            </h4>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className='flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1'>
                                <input
                                    type='email'
                                    placeholder='Email'
                                    className='w-full bg-transparent px-2 py-1.5 text-xs text-white outline-none placeholder:text-slate-500'
                                />
                                <button
                                    type='submit'
                                    className='shrink-0 rounded-lg  px-3 py-1.5 text-xs font-bold bg-white text-black transition-all hover:shadow-lg'>
                                    <Send size={12} />
                                </button>
                            </form>
                        </div>

                        {/* Social */}
                        <div className='pt-1'>
                            <div className='mb-2 text-xs font-bold tracking-wider text-white uppercase'>
                                Bizni kuzating
                            </div>
                            <div className='flex gap-2'>
                                {socials.map(({ name, href, Icon, color }) => (
                                    <motion.a
                                        key={name}
                                        href={href}
                                        aria-label={name}
                                        whileHover={{ y: -2 }}
                                        className={`grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 transition-all hover:border-transparent ${color} hover:text-white`}>
                                        <Icon size={14} className='text-white' />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Links - colSpan 2 each */}
                    <div className='space-y-3 lg:col-span-2'>
                        <h4 className='flex items-center gap-1 text-sm font-bold text-white'>
                            <span className='h-3 w-1 rounded-full bg-[#005CB9]' />
                            Platforma
                        </h4>
                        <ul className='space-y-1.5'>
                            {footerLinks.platform.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='text-xs text-slate-400 transition-colors hover:text-[#005CB9]'>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='space-y-3 lg:col-span-2'>
                        <h4 className='flex items-center gap-1 text-sm font-bold text-white'>
                            <span className='h-3 w-1 rounded-full bg-[#FF8A00]' />
                            Yordam
                        </h4>
                        <ul className='space-y-1.5'>
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='text-xs text-slate-400 transition-colors hover:text-[#FF8A00]'>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='space-y-3 lg:col-span-2'>
                        <h4 className='flex items-center gap-1 text-sm font-bold text-white'>
                            <span className='h-3 w-1 rounded-full bg-[#FF8A00]' />
                            Aloqa
                        </h4>

                        <div className='space-y-2'>
                            <a
                                href='tel:+998901234567'
                                className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 transition-all hover:border-[#005CB9]/30'>
                                <div className='grid h-7 w-7 place-items-center rounded-lg bg-[#005CB9]/10'>
                                    <Phone size={12} className='text-[#005CB9]' />
                                </div>
                                <div>
                                    <div className='text-[8px] text-slate-500 uppercase'>Telefon</div>
                                    <div className='text-xs font-bold text-white'>+998 90 123-45-67</div>
                                </div>
                            </a>

                            <a
                                href='mailto:support@book.uz'
                                className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 transition-all hover:border-[#FF8A00]/30'>
                                <div className='grid h-7 w-7 place-items-center rounded-lg bg-[#FF8A00]/10'>
                                    <Mail size={12} className='text-[#FF8A00]' />
                                </div>
                                <div>
                                    <div className='text-[8px] text-slate-500 uppercase'>Email</div>
                                    <div className='text-xs font-bold text-white'>support@book.uz</div>
                                </div>
                            </a>

                            <div className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2'>
                                <div className='grid h-7 w-7 place-items-center rounded-lg bg-white/10'>
                                    <MapPin size={12} className='text-slate-400' />
                                </div>
                                <div>
                                    <div className='text-[8px] text-slate-500 uppercase'>Manzil</div>
                                    <div className='text-xs font-bold text-white'>Toshkent, Chilonzor</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className='mb-6 flex justify-center gap-3'>
                    {['Uzcard', 'Humo', 'Visa', 'Mastercard', 'Payme', 'Click'].map((payment, i) => (
                        <div
                            key={i}
                            className='rounded-md border border-white/5 bg-white/5 px-2 py-1 text-[8px] font-bold text-slate-400'>
                            {payment}
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className='flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-4 text-[10px] md:flex-row'>
                    <p className='text-slate-500'>
                        © {currentYear} <span className='font-bold text-white'>BOOK.UZ</span>. Barcha huquqlar
                        himoyalangan.
                    </p>

                    <div className='flex items-center gap-3'>
                        <Link href='/privacy' className='text-slate-500 transition-colors hover:text-[#005CB9]'>
                            Maxfiylik
                        </Link>
                        <span className='h-1 w-1 rounded-full bg-slate-600' />
                        <Link href='/terms' className='text-slate-500 transition-colors hover:text-[#FF8A00]'>
                            Shartlar
                        </Link>

                        {/* Scroll top */}
                        <button
                            onClick={scrollToTop}
                            className='ml-2 grid h-7 w-7 place-items-center rounded-lg  bg-white text-black transition-all hover:shadow-lg'
                            aria-label='Scroll to top'>
                            <ArrowUp size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Telegram icon
function TelegramIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            className={className}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'>
            <path d='m22 2-7 20-4-9-9-4Z' />
            <path d='M22 2 11 13' />
        </svg>
    );
}
