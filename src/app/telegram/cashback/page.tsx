'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Script from 'next/script';

import { TelegramService, type TelegramSessionUser } from '@/services/telegram.service';

import QRCode from 'qrcode';
import type { Telegram as TelegramSdk } from 'telegram-web-app';

export default function TelegramCashbackPage() {
    const [status, setStatus] = useState('Telegram tekshirilmoqda...');
    const [user, setUser] = useState<TelegramSessionUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [cashbackBalance, setCashbackBalance] = useState(0);
    const [qrImage, setQrImage] = useState('');
    const [qrExpiresAt, setQrExpiresAt] = useState('');
    const qrRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;

            if (qrRefreshTimerRef.current) {
                clearTimeout(qrRefreshTimerRef.current);
            }
        };
    }, []);

    const loadQrCode = async (initData: string) => {
        if (qrRefreshTimerRef.current) {
            clearTimeout(qrRefreshTimerRef.current);
            qrRefreshTimerRef.current = null;
        }

        try {
            setStatus('QR-kod yaratilmoqda...');

            const qr = await TelegramService.createCashbackQr(initData);
            const generatedQrImage = await QRCode.toDataURL(qr.qrValue, {
                width: 512,
                margin: 2,
                errorCorrectionLevel: 'M',
                color: {
                    dark: '#020617',
                    light: '#ffffff'
                }
            });

            if (!isMountedRef.current) return;

            setQrImage(generatedQrImage);
            setQrExpiresAt(qr.expiresAt);
            setStatus('Cashback QR-kodi tayyor');

            qrRefreshTimerRef.current = setTimeout(() => {
                void loadQrCode(initData);
            }, 45_000);
        } catch (error) {
            if (!isMountedRef.current) return;

            setStatus(error instanceof Error ? error.message : 'QR-kodni yangilab bo‘lmaydi');

            // Vaqtinchalik xatoda 10 soniyadan keyin qayta urinadi.
            qrRefreshTimerRef.current = setTimeout(() => {
                void loadQrCode(initData);
            }, 10_000);
        }
    };

    const initializeTelegram = async () => {
        try {
            const telegramWindow = window as Window & { Telegram?: TelegramSdk };
            const telegram = telegramWindow.Telegram?.WebApp;

            if (!telegram) {
                throw new Error('Telegram SDK yuklanmadi');
            }

            telegram.ready();
            telegram.expand();

            if (!telegram.initData) {
                throw new Error('Sahifani Telegram bot ichidan oching');
            }

            setStatus('Foydalanuvchi tekshirilmoqda...');

            const sessionUser = await TelegramService.createSession(telegram.initData);

            setUser(sessionUser);
            setStatus('Cashback balansi olinmoqda...');

            const balance = await TelegramService.getCashbackBalance(telegram.initData);

            setCashbackBalance(balance);
            await loadQrCode(telegram.initData);
        } catch (error) {
            setStatus(error instanceof Error ? error.message : 'Noma’lum xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Script
                src='https://telegram.org/js/telegram-web-app.js'
                strategy='afterInteractive'
                onReady={() => {
                    void initializeTelegram();
                }}
            />

            <main className='min-h-screen bg-slate-950 px-4 py-8 text-white'>
                <section className='mx-auto max-w-md'>
                    <h1 className='text-center text-2xl font-bold'>Cashback</h1>

                    <div className='mt-3 text-center text-sm text-slate-400'>{status}</div>

                    {loading && <div className='mt-8 text-center text-slate-400'>Yuklanmoqda...</div>}

                    {!loading && user && (
                        <>
                            <div className='mt-8 rounded-3xl bg-slate-900 p-6'>
                                <p className='text-sm text-slate-400'>Mijoz</p>

                                <p className='mt-1 text-xl font-semibold'>{user.name}</p>

                                <p className='mt-2 text-sm text-slate-400'>{user.phone}</p>
                            </div>

                            <div className='mt-4 rounded-3xl bg-slate-900 p-6 text-center'>
                                <p className='text-sm text-slate-400'>Cashback balansingiz</p>

                                <p className='mt-2 text-4xl font-bold text-emerald-400'>
                                    {cashbackBalance.toLocaleString('uz-UZ')} ball
                                </p>
                            </div>

                            <div className='mt-6 rounded-3xl bg-white p-6 text-center text-slate-950'>
                                <div className='mx-auto flex h-64 w-64 items-center justify-center rounded-2xl bg-slate-100'>
                                    {qrImage ? (
                                        <Image
                                            src={qrImage}
                                            alt='Cashback QR-kodi'
                                            width={256}
                                            height={256}
                                            unoptimized
                                            className='h-64 w-64 rounded-2xl'
                                        />
                                    ) : (
                                        <p className='text-sm text-slate-500'>QR-kod yaratilmoqda...</p>
                                    )}
                                </div>

                                <p className='mt-4 text-sm text-slate-600'>QR-kodni kassirga ko‘rsating</p>

                                {qrExpiresAt && (
                                    <p className='mt-2 text-xs text-slate-500'>
                                        Amal qilish muddati: {new Date(qrExpiresAt).toLocaleString('uz-UZ')}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </section>
            </main>
        </>
    );
}
