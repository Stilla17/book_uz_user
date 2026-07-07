'use client';

import Link from 'next/link';

import { mainNav } from '@/data/navMenu';

import { motion } from 'framer-motion';
import { ArrowUp, Facebook, Instagram, Mail, Phone, Send, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const footerLinks = {
        support: [
            { name: 'footer.supportLinks.payment', href: '/checkout' },
            { name: 'footer.supportLinks.delivery', href: '/checkout' },
            { name: 'footer.supportLinks.privacy', href: '/about' },
            { name: 'footer.supportLinks.terms', href: '/about' }
        ]
    };

    const socials = [
        {
            name: 'Instagram',
            href: 'https://www.instagram.com/bookuzbekistan/',
            Icon: Instagram,
            color: 'hover:bg-pink-600'
        },
        { name: 'Telegram', href: 'https://t.me/bookuzbekistan', Icon: Send, color: 'hover:bg-blue-500' },
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/bookuzbekistan',
            Icon: Facebook,
            color: 'hover:bg-blue-600'
        },
        { name: 'YouTube', href: 'https://www.youtube.com/@bookuzbekistan', Icon: Youtube, color: 'hover:bg-red-600' }
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
                        </Link>

                        <p className='max-w-sm text-xs leading-relaxed text-slate-400'>{t('footer.description')}</p>

                        {/* Social */}
                        <div className='pt-1'>
                            <div className='mb-2 text-xs font-bold tracking-wider text-white uppercase'>
                                {t('footer.followUs')}
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
                            {t('footer.platform')}
                        </h4>
                        <ul className='space-y-1.5'>
                            {mainNav.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-xs text-slate-400 transition-colors hover:text-[#005CB9]'>
                                        {t(link.label)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='space-y-3 lg:col-span-2'>
                        <h4 className='flex items-center gap-1 text-sm font-bold text-white'>
                            <span className='h-3 w-1 rounded-full bg-[#FF8A00]' />
                            {t('footer.support')}
                        </h4>
                        <ul className='space-y-1.5'>
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='text-xs text-slate-400 transition-colors hover:text-[#FF8A00]'>
                                        {t(link.name)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='space-y-3 lg:col-span-2'>
                        <h4 className='flex items-center gap-1 text-sm font-bold text-white'>
                            <span className='h-3 w-1 rounded-full bg-[#FF8A00]' />
                            {t('footer.contact')}
                        </h4>

                        <div className='space-y-2'>
                            <a
                                href='tel:+998712300050'
                                className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 transition-all'>
                                <div className='grid h-7 w-7 place-items-center rounded-lg bg-white/10'>
                                    <Phone size={12} className='text-white' />
                                </div>
                                <div className='text-xs font-bold text-nowrap text-white'>+998(71) 230-00-50</div>
                            </a>

                            <a
                                href='mailto:support@book.uz'
                                className='flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2'>
                                <div className='grid h-7 w-7 place-items-center rounded-lg bg-white/10'>
                                    <Mail size={12} className='text-white' />
                                </div>
                                <div className='text-xs font-bold text-white'>support@book.uz</div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className='flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-4 text-[10px] md:flex-row'>
                    <p className='text-slate-500'>
                        &copy; {currentYear} <span className='font-bold text-white'> BOOK.UZ</span>.{' '}
                        {t('footer.rights')}
                    </p>

                    {/* Scroll top */}
                    <button
                        onClick={scrollToTop}
                        className='fixed right-5 bottom-5 z-50 grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-[0_12px_30px_-12px_rgba(0,0,0,0.55)] transition-all hover:-translate-y-1 hover:shadow-lg'
                        aria-label={t('footer.scrollTop')}>
                        <ArrowUp size={14} />
                    </button>
                </div>
            </div>
        </footer>
    );
};
