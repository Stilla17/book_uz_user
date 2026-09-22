'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { useBookDetailQuery } from '@/hooks/queries/useBookQueries';
import { bookService } from '@/services/book.service';

import { isAxiosError } from 'axios';
import type { Contents, Book as EpubBook, Location, Rendition } from 'epubjs';
import { BookOpen, ChevronLeft, ChevronRight, Maximize, Minus, Plus, X } from 'lucide-react';

type ReaderProgress = {
    current: number;
    total: number;
    atStart: boolean;
    atEnd: boolean;
};

const EMPTY_PROGRESS: ReaderProgress = { current: 0, total: 0, atStart: true, atEnd: false };

const MIN_FONT_SIZE = 70;
const MAX_FONT_SIZE = 180;
const FONT_STEP = 10;
const DEFAULT_FONT_SIZE = 100;

const PROGRESS_STORAGE_PREFIX = 'ebook-progress:';

/**
 * epubjs 0.3.x adds a legacy `unload` listener asynchronously when its manager
 * is attached. React cleanup below already destroys the rendition and the book.
 */
function suppressNextLegacyUnloadListener(): () => void {
    const originalAddEventListener = window.addEventListener;
    let restored = false;

    const restore = () => {
        if (restored) return;
        restored = true;
        window.addEventListener = originalAddEventListener;
    };

    window.addEventListener = ((...args: Parameters<typeof window.addEventListener>) => {
        if (args[0] === 'unload') {
            restore();
            return;
        }
        return originalAddEventListener.apply(window, args);
    }) as typeof window.addEventListener;

    return restore;
}

function readSavedCfi(bookId: string): string | null {
    try {
        return localStorage.getItem(`${PROGRESS_STORAGE_PREFIX}${bookId}`);
    } catch {
        return null;
    }
}

function writeSavedCfi(bookId: string, cfi: string) {
    try {
        localStorage.setItem(`${PROGRESS_STORAGE_PREFIX}${bookId}`, cfi);
    } catch {
        // localStorage mavjud bo'lmasa yoki to'lgan bo'lsa, o'qishga xalaqit bermaymiz.
    }
}

function removeSavedCfi(bookId: string) {
    try {
        localStorage.removeItem(`${PROGRESS_STORAGE_PREFIX}${bookId}`);
    } catch {
        // localStorage mavjud bo'lmasa reader birinchi sahifadan ochilaveradi.
    }
}

export default function EbookReaderPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const { data: book, isLoading: bookLoading } = useBookDetailQuery(slug);

    const readerRef = useRef<HTMLDivElement>(null);
    const bookFrameRef = useRef<HTMLDivElement>(null);
    const renditionRef = useRef<Rendition | null>(null);
    const epubBookRef = useRef<EpubBook | null>(null);
    const isTurningRef = useRef(false);
    const isRelocatingFontRef = useRef(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState<ReaderProgress>(EMPTY_PROGRESS);
    const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

    const turnPage = useCallback(async (direction: 'prev' | 'next') => {
        const rendition = renditionRef.current;
        if (!rendition || isTurningRef.current) return;
        if (direction === 'prev' && rendition.location?.atStart) return;
        if (direction === 'next' && rendition.location?.atEnd) return;

        isTurningRef.current = true;

        try {
            await rendition[direction]();
        } catch {
            // Navigatsiya xatosi boshqaruvni bloklab qo‘ymasligi kerak.
        } finally {
            isTurningRef.current = false;
        }
    }, []);

    // Shrift o‘lchamini o‘zgartirishda joriy o‘qish o‘rnini saqlab qolamiz.
    // CFI locations matnga bog‘liq, shuning uchun uni qayta generatsiya qilish shart emas.
    const applyFontSize = useCallback(async (size: number) => {
        const rendition = renditionRef.current;
        const epubBook = epubBookRef.current;
        if (!rendition || !epubBook || isRelocatingFontRef.current) return;

        isRelocatingFontRef.current = true;
        const currentCfi = rendition.location?.start?.cfi;

        try {
            rendition.themes.fontSize(`${size}%`);

            // Shrift o‘zgarganda matn qayta joylanadi, so‘ng joriy o‘rinni tiklaymiz.
            if (currentCfi) {
                await rendition.display(currentCfi);
            }

            await rendition.reportLocation();
        } catch {
            // Shrift o‘lchamini qo‘llashda xatolik bo‘lsa, o‘qishni buzmaymiz.
        } finally {
            isRelocatingFontRef.current = false;
        }
    }, []);

    const changeFontSize = useCallback(
        (delta: number) => {
            setFontSize((current) => {
                const next = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, current + delta));
                if (next !== current) void applyFontSize(next);
                return next;
            });
        },
        [applyFontSize]
    );

    useEffect(() => {
        const frame = bookFrameRef.current;
        if (!book?._id || !book.hasEbook || !frame) return;

        let cancelled = false;

        async function loadEpub() {
            try {
                setLoading(true);
                setError('');
                setProgress(EMPTY_PROGRESS);
                setFontSize(DEFAULT_FONT_SIZE);

                const [{ default: ePub }, epubData] = await Promise.all([
                    import('epubjs'),
                    bookService.getEbookFile(book!._id)
                ]);
                if (cancelled) return;

                const epubBook = ePub(epubData);
                const restoreLegacyUnloadListener = suppressNextLegacyUnloadListener();
                const rendition = epubBook.renderTo(frame!, {
                    width: '100%',
                    height: '100%',
                    flow: 'paginated',
                    spread: 'auto',
                    minSpreadWidth: 900
                });

                epubBookRef.current = epubBook;
                renditionRef.current = rendition;

                rendition.themes.default({
                    body: { 'line-height': '1.6' }
                });
                rendition.themes.fontSize(`${DEFAULT_FONT_SIZE}%`);

                const configureContent = (contents: Contents) => {
                    const contentDocument = contents.document;
                    let pointerStartX: number | null = null;
                    let pointerDirection: 'prev' | 'next' = 'next';
                    let curlProgress = 0;

                    contentDocument.documentElement.style.userSelect = 'none';
                    contentDocument.documentElement.style.webkitUserSelect = 'none';

                    const capturePage = async (direction: 'prev' | 'next') => {
                        try {
                            const contentWindow = contentDocument.defaultView;
                            if (!contentWindow) return;
                        } catch {
                            // Ayrim tashqi rasmlar canvas nusxasini cheklashi mumkin.
                        }
                    };

                    contentDocument.oncopy = () => false;
                    contentDocument.oncut = () => false;
                    contentDocument.oncontextmenu = () => false;
                    contentDocument.onselectstart = () => false;
                    contentDocument.ondragstart = () => false;
                    contentDocument.onkeydown = (event) => {
                        if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'x'].includes(event.key.toLowerCase())) {
                            event.preventDefault();
                        }
                    };
                    contentDocument.onpointerdown = (event) => {
                        if (event.button !== 0) return;

                        const pageWidth = contentDocument.documentElement.clientWidth;
                        pointerStartX = event.clientX;
                        pointerDirection = event.clientX >= pageWidth / 2 ? 'next' : 'prev';
                        curlProgress = 0.04;
                        void capturePage(pointerDirection);
                    };
                    contentDocument.onpointercancel = () => {
                        pointerStartX = null;
                        curlProgress = 0;
                    };
                    contentDocument.onpointerup = (event) => {
                        if (pointerStartX === null) return;

                        const deltaX = event.clientX - pointerStartX;
                        const pageWidth = contentDocument.documentElement.clientWidth;
                        pointerStartX = null;

                        if (
                            (pointerDirection === 'next' && curlProgress >= 0.12) ||
                            deltaX <= -45 ||
                            (Math.abs(deltaX) < 8 && event.clientX >= pageWidth * 0.82)
                        ) {
                            void turnPage('next');
                        } else if (
                            (pointerDirection === 'prev' && curlProgress >= 0.12) ||
                            deltaX >= 45 ||
                            (Math.abs(deltaX) < 8 && event.clientX <= pageWidth * 0.18)
                        ) {
                            void turnPage('prev');
                        }

                        curlProgress = 0;
                    };
                };

                rendition.hooks.content.register(configureContent);

                const handleRelocated = (location: Location) => {
                    const total = epubBook.locations.length();
                    const generatedIndex = total ? Number(epubBook.locations.locationFromCfi(location.start.cfi)) : 0;

                    setProgress({
                        current: total ? Math.max(1, generatedIndex + 1) : location.start.displayed.page,
                        total: total || location.start.displayed.total,
                        atStart: location.atStart,
                        atEnd: location.atEnd
                    });

                    writeSavedCfi(book!._id, location.start.cfi);
                };

                rendition.on('relocated', handleRelocated);

                // Avval o'qilgan bo'lsa, saqlangan pozitsiyadan davom ettiramiz.
                const savedCfi = readSavedCfi(book!._id);
                let initialCfi: string | undefined;

                if (savedCfi) {
                    await epubBook.ready;

                    try {
                        initialCfi = epubBook.spine.get(savedCfi) ? savedCfi : undefined;
                    } catch {
                        initialCfi = undefined;
                    }

                    if (!initialCfi) removeSavedCfi(book!._id);
                }

                try {
                    try {
                        await rendition.display(initialCfi);
                    } catch (displayError) {
                        if (!initialCfi) throw displayError;

                        // EPUB almashtirilgan bo'lsa, eski CFI yangi spine ichida topilmaydi.
                        // Eskirgan progressni olib tashlab, kitob boshidan ochamiz.
                        removeSavedCfi(book!._id);
                        await rendition.display();
                    }
                } finally {
                    restoreLegacyUnloadListener();
                }
                if (!cancelled) setLoading(false);

                // Locations progress uchun yordamchi indeks, kitobni ko'rsatish uchun shart emas.
                // Ayrim eski EPUB fayllardagi noto'g'ri XHTML butun readerni yopib qo'ymasligi kerak.
                try {
                    await epubBook.locations.generate(1024);
                    if (!cancelled) await rendition.reportLocation();
                } catch (locationError) {
                    console.warn("EPUB progress indeksini yaratib bo'lmadi:", locationError);
                }
            } catch (readerError) {
                console.error('EPUB reader xatosi:', readerError);
                if (cancelled) return;
                if (isAxiosError(readerError)) {
                    const status = readerError.response?.status;
                    const serverMessage = readerError.response?.data?.message;
                    if (status === 401) {
                        const readerUrl = `/book/${slug}/reader`;

                        router.replace(`/auth/login?redirect=${encodeURIComponent(readerUrl)}`);
                        return;
                    }
                    if (status === 403) {
                        setError(serverMessage || "Bu elektron kitobni o'qish uchun avval sotib olishingiz kerak.");
                        setLoading(false);
                        return;
                    }
                    if (status === 404) {
                        setError('Bu kitobning EPUB fayli mavjud emas.');
                        setLoading(false);
                        return;
                    }
                }
                setError(
                    readerError instanceof Error
                        ? `Elektron kitobni ochib bo‘lmadi: ${readerError.message}`
                        : 'Elektron kitobni ochib bo‘lmadi.'
                );
                setLoading(false);
            }
        }

        void loadEpub();

        return () => {
            cancelled = true;

            const activeRendition = renditionRef.current;
            const activeBook = epubBookRef.current;

            try {
                activeRendition?.destroy?.();
            } catch {
                // EPUB o'zi DOMni tozalashi mumkin; React boshqa tomondan uni olib tashlashi
                // bilan kelib chiqadigan removeChild xatosini oldini olamiz.
            }

            try {
                activeBook?.destroy?.();
            } catch {
                // Book destroy() ham o'zining ichki xotirasi/DOMni tozalashga harakat qilishi mumkin.
            } finally {
                renditionRef.current = null;
                epubBookRef.current = null;
            }
        };
    }, [book?._id, book?.hasEbook, turnPage]);

    if (bookLoading) {
        return <div className='grid min-h-screen place-items-center'>Kitob yuklanmoqda...</div>;
    }

    if (!book?.hasEbook || error) {
        return (
            <div className='grid min-h-screen place-items-center gap-4'>
                <p>{error || 'Bu kitobning EPUB fayli mavjud emas.'}</p>
                <button onClick={() => router.back()}>Orqaga</button>
            </div>
        );
    }

    return (
        <main
            ref={readerRef}
            tabIndex={-1}
            onCopy={(event) => event.preventDefault()}
            onCut={(event) => event.preventDefault()}
            onContextMenu={(event) => event.preventDefault()}
            onDragStart={(event) => event.preventDefault()}
            onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'x'].includes(event.key.toLowerCase())) {
                    event.preventDefault();
                }
            }}
            className='ebook-reader flex h-dvh w-full flex-col items-center gap-3 overflow-hidden bg-[#FAF4E1] p-3 select-none md:p-6'>
            <div className='relative flex min-h-0 w-full max-w-[1680px] flex-1 [perspective:1800px]'>
                <div
                    ref={bookFrameRef}
                    className='relative h-full w-full overflow-hidden rounded-md border-[5px] border-[#6b5d48] bg-[#FAF4E1] shadow-2xl'>
                    {loading && (
                        <div className='absolute inset-0 z-10 grid place-items-center'>Kitob yuklanmoqda...</div>
                    )}
                </div>

                <div className='absolute bottom-0 left-1/2 z-50 -translate-x-1/2 translate-y-1/4 rounded-full bg-[#4d4942] px-4 py-2 text-xs font-bold text-white'>
                    {progress.current} / {progress.total} sahifa
                </div>
            </div>

            <div className='z-50 flex shrink-0 items-center gap-1 rounded-2xl bg-[#4d4942] p-2 text-white shadow-lg'>
                <BookOpen size={18} className='mx-2' />

                <button
                    aria-label='Oldingi sahifa'
                    onClick={() => void turnPage('prev')}
                    disabled={progress.atStart || loading}
                    className='rounded-lg p-2 hover:bg-white/15 disabled:opacity-40'>
                    <ChevronLeft size={18} />
                </button>

                <button
                    aria-label='Keyingi sahifa'
                    onClick={() => void turnPage('next')}
                    disabled={progress.atEnd || loading}
                    className='rounded-lg p-2 hover:bg-white/15 disabled:opacity-40'>
                    <ChevronRight size={18} />
                </button>

                <div className='mx-2 h-5 w-px bg-white/20' />

                <button
                    aria-label='Shriftni kichiklashtirish'
                    onClick={() => changeFontSize(-FONT_STEP)}
                    disabled={loading || fontSize <= MIN_FONT_SIZE}
                    className='rounded-lg p-2 hover:bg-white/15 disabled:opacity-40'>
                    <Minus size={16} />
                </button>

                <span className='min-w-[3ch] text-center text-xs font-semibold tabular-nums select-none'>
                    {fontSize}%
                </span>

                <button
                    aria-label='Shriftni kattalashtirish'
                    onClick={() => changeFontSize(FONT_STEP)}
                    disabled={loading || fontSize >= MAX_FONT_SIZE}
                    className='rounded-lg p-2 hover:bg-white/15 disabled:opacity-40'>
                    <Plus size={16} />
                </button>

                <div className='mx-2 h-5 w-px bg-white/20' />

                <button
                    aria-label='To‘liq ekran'
                    onClick={() => readerRef.current?.requestFullscreen()}
                    className='rounded-lg p-2 hover:bg-white/15'>
                    <Maximize size={17} />
                </button>

                <button
                    aria-label='Yopish'
                    onClick={() => router.back()}
                    className='ml-2 rounded-full p-2 hover:bg-white/15'>
                    <X size={18} />
                </button>
            </div>
        </main>
    );
}
