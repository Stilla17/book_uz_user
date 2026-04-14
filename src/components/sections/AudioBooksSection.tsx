'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { audioBookService } from '@/services/audioBook.service';
import type { AudioBook } from '@/types/audioBook.types';
import type { AudioBooksSectionProps } from '@/types/section.types';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Clock, Headphones, Heart, Mic, Pause, Play, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export const AudioBooksSection = ({
    autoPlay = true,
    title = 'Audio kitoblar',
    subtitle = 'Eng sara audio asarlar',
    limit = 10,
    category,
    hit,
    new: isNew,
    showCategories = true
}: AudioBooksSectionProps) => {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [isBookmarked, setIsBookmarked] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [audioBooks, setAudioBooks] = useState<AudioBook[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [swiper, setSwiper] = useState<any>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const getLocalizedText = (field: AudioBook['title'] | undefined, fallback: string) =>
        field?.uz || field?.ru || field?.en || fallback;

    const getTitle = (book: AudioBook) => getLocalizedText(book.title, "Noma'lum audio kitob");
    const getAuthor = (book: AudioBook) => getLocalizedText(book.author, "Noma'lum muallif");
    const getNarrator = (book: AudioBook) => getLocalizedText(book.narrator, "Noma'lum ovoz");

    const fetchAudioBooks = async () => {
        try {
            setLoading(true);
            const data = await audioBookService.getActiveAudioBooks(limit, category, hit, isNew);
            setAudioBooks(data);
        } catch (error) {
            console.error('Audio kitoblarni yuklashda xatolik:', error);
            setAudioBooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAudioBooks();
    }, [limit, category, hit, isNew]);

    const toggleBookmark = (id: string) => {
        setIsBookmarked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const handlePlay = async (id: string, audioUrl?: string) => {
        if (playingId === id) {
            setPlayingId(null);
            setIsPlaying(false);
            audioRef.current?.pause();
            return;
        }

        if (!audioUrl || !audioRef.current) {
            toast.error('Audio fayl topilmadi');
            return;
        }

        try {
            audioRef.current.src = audioUrl;
            await audioRef.current.play();
            setPlayingId(id);
            setIsPlaying(true);
        } catch (error) {
            console.error('Audio ijro etishda xatolik:', error);
            toast.error("Audio ijro etib bo'lmadi");
        }
    };

    if (loading) {
        return (
            <section className='relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-12 dark:from-slate-900 dark:to-slate-800'>
                <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                    <div className='mb-6 flex items-center justify-between'>
                        <div className='h-8 w-48 animate-pulse rounded-full bg-gradient-to-r from-[#00a0e3]/20 to-[#ef7f1a]/20 dark:from-blue-600/20 dark:to-orange-600/20'></div>
                        <div className='flex gap-2'>
                            <div className='h-8 w-8 animate-pulse rounded-full bg-[#00a0e3]/20 dark:bg-blue-600/20'></div>
                            <div className='h-8 w-8 animate-pulse rounded-full bg-[#ef7f1a]/20 dark:bg-orange-600/20'></div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className='h-[240px] animate-pulse rounded-xl bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/10 dark:to-orange-600/10'></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (audioBooks.length === 0) return null;

    const currentBook = audioBooks.find((book) => book._id === playingId);
    const titleParts = title.trim().split(/\s+/);
    const titleFirstWord = titleParts[0] || 'Audio';
    const titleRemainder = titleParts.slice(1).join(' ');

    return (
        <section className='relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-12 dark:from-slate-900 dark:to-slate-800'>
            <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                <div className='mb-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <div className='rounded-lg bg-[#ef7f1a]/10 dark:bg-orange-500/20 p-3'>
                                <Headphones size={20} className='text-[#ef7f1a] dark:text-orange-400' />
                            </div>
                            <div>
                                <h2 className='text-xl font-black md:text-2xl'>
                                    <span className='text-[#00a0e3] dark:text-blue-400'>{titleFirstWord}</span>
                                    {titleRemainder && (
                                        <>
                                            {' '}
                                            <span className='text-[#ef7f1a] dark:text-orange-400'>
                                                {titleRemainder}
                                            </span>
                                        </>
                                    )}
                                </h2>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>{subtitle}</p>
                            </div>
                        </div>

                        <div>
                            <Link
                                href='/audio'
                                className='group inline-flex items-center gap-2 rounded-full bg-[#ef7f1a]/15 px-6 py-3 text-sm font-bold text-[#ef7f1a] transition-all duration-300 dark:bg-[#5b3a2b] dark:text-[#ef7f1a]'>
                                Barcha audio kitoblar
                                <ChevronRight
                                    size={14}
                                    className='transition-transform duration-300 group-hover:translate-x-1'
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                <Swiper
                    onSwiper={setSwiper}
                    modules={[Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1.5}
                    autoplay={
                        autoPlay
                            ? {
                                  delay: 4000,
                                  disableOnInteraction: false,
                                  pauseOnMouseEnter: true
                              }
                            : false
                    }
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        el: '.swiper-pagination'
                    }}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current
                    }}
                    breakpoints={{
                        480: { slidesPerView: 2, spaceBetween: 16 },
                        640: { slidesPerView: 2.5, spaceBetween: 16 },
                        768: { slidesPerView: 3, spaceBetween: 16 },
                        1024: { slidesPerView: 4, spaceBetween: 16 },
                        1280: { slidesPerView: 5, spaceBetween: 16 }
                    }}
                    className='audio-swiper'>
                    {audioBooks.map((book) => (
                        <SwiperSlide key={book._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className='group relative rounded-xl border border-gray-100 bg-white p-3 transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20'>
                                <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,160,227,0.05),transparent_70%)]' />

                                <Link href={`/audio/${book.slug}`}>
                                    <div className='relative mb-3 h-[160px] w-full cursor-pointer overflow-hidden rounded-lg'>
                                        <Image
                                            src={book.coverImage}
                                            alt={getTitle(book)}
                                            fill
                                            className='object-cover transition-transform duration-500 group-hover:scale-110'
                                        />

                                        <div className='absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/50'>
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    void handlePlay(book._id, book.audioUrl);
                                                }}
                                                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110 dark:bg-slate-800'>
                                                {playingId === book._id ? (
                                                    <Pause size={16} className='text-[#00a0e3] dark:text-blue-400' />
                                                ) : (
                                                    <Play
                                                        size={16}
                                                        className='ml-0.5 text-[#ef7f1a] dark:text-orange-400'
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className='absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm dark:bg-slate-800/90'>
                                            <Headphones size={12} className='text-[#00a0e3] dark:text-blue-400' />
                                        </div>

                                        <div className='absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[8px] text-white dark:bg-slate-900/90'>
                                            <Clock size={8} />
                                            <span>{book.duration}</span>
                                        </div>
                                    </div>
                                </Link>

                                <div>
                                    <Link href={`/audio/${book.slug}`}>
                                        <h3 className='line-clamp-1 text-sm font-bold text-gray-900 transition-colors group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'>
                                            {getTitle(book)}
                                        </h3>
                                    </Link>
                                    <p className='line-clamp-1 text-xs text-gray-500 dark:text-gray-400'>
                                        {getAuthor(book)}
                                    </p>

                                    <div className='mt-1 flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500'>
                                        <Mic size={10} className='text-[#ef7f1a] dark:text-orange-400' />
                                        <span className='truncate'>{getNarrator(book)}</span>
                                    </div>

                                    <div className='mt-2 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-slate-700'>
                                        <div className='flex items-center gap-1'>
                                            <Star
                                                size={10}
                                                className='fill-[#ef7f1a] text-[#ef7f1a] dark:fill-orange-400 dark:text-orange-400'
                                            />
                                            <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                                {book.rating?.toFixed(1) || '0.0'}
                                            </span>
                                            <span className='text-[8px] text-gray-400 dark:text-gray-500'>
                                                ({book.reviewsCount || 0})
                                            </span>
                                        </div>

                                        <div className='flex items-center gap-1'>
                                            <button
                                                onClick={() => toggleBookmark(book._id)}
                                                className={`rounded-lg p-1 transition-colors ${
                                                    isBookmarked.includes(book._id)
                                                        ? 'text-red-500 dark:text-red-400'
                                                        : 'text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400'
                                                }`}>
                                                <Heart
                                                    size={14}
                                                    fill={isBookmarked.includes(book._id) ? 'currentColor' : 'none'}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className='swiper-pagination !relative !bottom-0 mt-6'></div>

                {showCategories && (
                    <div className='mt-8 flex flex-wrap justify-center gap-2'>
                        {[
                            { name: 'Detektiv', slug: 'detektiv' },
                            { name: 'Fantastika', slug: 'fantastika' },
                            { name: 'Romantika', slug: 'roman' },
                            { name: 'Biznes', slug: 'biznes' },
                            { name: 'Psixologiya', slug: 'psixologiya' }
                        ].map((cat, i) => (
                            <Link
                                key={i}
                                href={`/audio?category=${cat.slug}`}
                                className='rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition-all hover:bg-[#00a0e3] hover:text-white dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-blue-600'>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                )}

                <AnimatePresence>
                    {playingId && currentBook && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className='fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:shadow-2xl dark:shadow-[#00a0e3]/20'>
                            <button
                                onClick={() => {
                                    setPlayingId(null);
                                    setIsPlaying(false);
                                    audioRef.current?.pause();
                                }}
                                className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg transition-colors hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'>
                                x
                            </button>

                            <div className='relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg'>
                                <Image
                                    src={currentBook.coverImage}
                                    alt={getTitle(currentBook)}
                                    fill
                                    className='object-cover'
                                />
                            </div>

                            <div className='min-w-0 flex-1'>
                                <h4 className='truncate text-xs font-bold text-gray-900 dark:text-white'>
                                    {getTitle(currentBook)}
                                </h4>
                                <p className='flex items-center gap-1 truncate text-[10px] text-gray-500 dark:text-gray-400'>
                                    <Mic size={8} className='text-[#ef7f1a] dark:text-orange-400' />
                                    {getNarrator(currentBook)}
                                </p>
                            </div>

                            <button
                                onClick={async () => {
                                    if (!audioRef.current) return;

                                    try {
                                        if (isPlaying) {
                                            audioRef.current.pause();
                                            setIsPlaying(false);
                                        } else {
                                            await audioRef.current.play();
                                            setIsPlaying(true);
                                        }
                                    } catch (error) {
                                        console.error('Audio ijro etishda xatolik:', error);
                                        toast.error("Audio ijro etib bo'lmadi");
                                    }
                                }}
                                className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] text-white shadow-md transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600'>
                                {isPlaying ? <Pause size={14} /> : <Play size={14} className='ml-0.5' />}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <audio
                    ref={audioRef}
                    className='hidden'
                    onEnded={() => {
                        setPlayingId(null);
                        setIsPlaying(false);
                    }}
                />
            </div>
        </section>
    );
};
