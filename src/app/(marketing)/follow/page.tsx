import Image from 'next/image';

import { ArrowRight, Download } from 'lucide-react';
import { FaInstagram, FaTelegramPlane } from 'react-icons/fa';

export default function FollowPage() {
    return (
        <main className='relative min-h-dvh overflow-hidden bg-[#f7f8fc] px-5 py-8 text-slate-950 sm:px-8'>
            <div
                aria-hidden='true'
                className='absolute -top-28 -left-24 h-72 w-72 rounded-full bg-[#00a0e3]/12 blur-3xl'
            />
            <div
                aria-hidden='true'
                className='absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[#ff8a00]/15 blur-3xl'
            />

            <section className='relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col justify-between'>
                <header className='flex items-center'>
                    <Image
                        src='/images/Logo.png'
                        alt='Book.uz'
                        width={160}
                        height={160}
                        priority
                        className='h-24 w-24 object-contain sm:h-28 sm:w-28'
                    />
                </header>

                <div className='py-12'>
                    <div className='mb-8 flex items-center justify-center'>
                        <div className='relative grid size-32 place-items-center rounded-[2.25rem] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]'>
                            <div className='grid size-20 place-items-center rounded-3xl bg-[#fff4e8]'>
                                <Download className='size-9 text-[#ff8a00]' strokeWidth={2.2} />
                            </div>

                            <span className='absolute -top-3 -right-3 grid size-11 place-items-center rounded-2xl bg-[#229ED9] text-white shadow-lg shadow-sky-200'>
                                <FaTelegramPlane className='size-5' />
                            </span>
                            <span className='absolute -bottom-3 -left-3 grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-lg shadow-rose-200'>
                                <FaInstagram className='size-5' />
                            </span>
                        </div>
                    </div>

                    <div className='text-center'>
                        <p className='mb-3 text-sm font-bold tracking-[0.18em] text-[#ff8a00] uppercase'>
                            Bepul elektron kitob
                        </p>
                        <h1 className='text-3xl leading-tight font-black tracking-tight text-slate-950 sm:text-4xl'>
                            Sevimli kitobingizni PDF formatda oling
                        </h1>
                        <p className='mx-auto mt-5 max-w-sm text-base leading-7 text-slate-500'>
                            Book.uz’ning Telegram va Instagram sahifalariga obuna bo‘ling va PDF kitobga ega bo‘ling.
                        </p>
                    </div>

                    <div className='mt-8 flex justify-center gap-3'>
                        <div className='flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm'>
                            <FaTelegramPlane className='size-4 text-[#229ED9]' />
                            Telegram
                        </div>
                        <div className='flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm'>
                            <FaInstagram className='size-4 text-[#e1306c]' />
                            Instagram
                        </div>
                    </div>
                </div>

                <div className='pb-[max(0.5rem,env(safe-area-inset-bottom))]'>
                    <a
                        href='https://t.me/BookUzbekistan_auth_bot'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group flex h-15 w-full items-center justify-center gap-3 rounded-2xl bg-[#ff8a00] px-6 text-base font-bold text-white shadow-[0_16px_36px_rgba(255,138,0,0.28)] transition-transform duration-200 active:scale-[0.98]'>
                        PDFni yuklash
                        <ArrowRight className='size-5 transition-transform duration-200 group-hover:translate-x-1' />
                    </a>
                    <p className='mt-4 text-center text-xs leading-5 text-slate-400'>
                        Tugmani bosganingizda Telegram botiga yo‘naltirilasiz
                    </p>
                </div>
            </section>
        </main>
    );
}
