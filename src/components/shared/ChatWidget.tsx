'use client';

import { useEffect, useState } from 'react';

import { useSendSupportChatMessage, useSupportChatMessages } from '@/hooks/queries/useSupportChatQuery';
import { useAuth } from '@/hooks/useAuth';
import { useChatUnread } from '@/hooks/useChatUnread';
import { useChatVisitor } from '@/hooks/useChatVisitor';
import type { SupportChatMessage } from '@/types/support-chat';

import { AlertCircle, Headphones, Loader2, MessageCircle, Send, UserRound, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IMaskInput } from 'react-imask';

type Message = {
    id: string;
    text: string;
    sender: 'operator' | 'user';
    time: string;
};

type VisitorForm = {
    name: string;
    phone: string;
};

type MessageForm = {
    message: string;
};

const toMessage = (message: SupportChatMessage): Message => ({
    id: message.id,
    text: message.text,
    sender: message.sender,
    time: new Intl.DateTimeFormat('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(message.createdAt))
});

const normalizeUzPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 9) return `+998${digits}`;
    if (digits.length === 12 && digits.startsWith('998')) return `+${digits}`;

    return null;
};

type ChatWidgetProps = {
    initialOpen?: boolean;
};

const ChatWidget = ({ initialOpen = false }: ChatWidgetProps) => {
    const { t } = useTranslation();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(initialOpen);
    const { visitor, isReady, saveVisitor } = useChatVisitor(user);
    const messagesQuery = useSupportChatMessages(visitor?.id);
    const sendMessageMutation = useSendSupportChatMessage();
    const serverMessages = messagesQuery.data ?? [];
    const initialMessages: Message[] = [
        { id: 'welcome-1', text: t('chatWidget.greeting'), sender: 'operator', time: '10:24' },
        { id: 'welcome-2', text: t('chatWidget.helpQuestion'), sender: 'operator', time: '10:24' }
    ];
    const messages = [...initialMessages, ...serverMessages.map(toMessage)];
    const { unreadCount, hasReadChat } = useChatUnread(serverMessages, visitor?.id, isOpen);
    const canStartChat = Boolean(visitor?.name && visitor.phone);

    const visitorForm = useForm<VisitorForm>({
        defaultValues: { name: '', phone: '+998 ' }
    });
    const messageForm = useForm<MessageForm>({
        defaultValues: { message: '' }
    });
    const messageValue = messageForm.watch('message');

    useEffect(() => {
        if (!visitor) return;
        visitorForm.reset({ name: visitor.name, phone: visitor.phone || '+998 ' });
    }, [visitor, visitorForm]);

    const handleVisitorSubmit = visitorForm.handleSubmit(({ name, phone }) => {
        const normalizedPhone = normalizeUzPhone(phone);

        if (!normalizedPhone) {
            visitorForm.setError('phone', {
                message: t('chatWidget.phoneInvalid')
            });
            return;
        }

        saveVisitor({ name: name.trim(), phone: normalizedPhone });
    });

    const handleMessageSubmit = messageForm.handleSubmit(async ({ message }) => {
        if (!visitor?.name || !visitor.phone) return;

        try {
            await sendMessageMutation.mutateAsync({
                message: message.trim(),
                name: visitor.name,
                phone: visitor.phone,
                visitorId: visitor.id,
                pageUrl: window.location.href
            });
            messageForm.reset();
        } catch {
            // Mutation xatosi formaning o'zida ko'rsatiladi.
        }
    });

    return (
        <div className='fixed inset-x-3 bottom-3 z-[100] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6 sm:left-auto'>
            {isOpen && (
                <section
                    role='dialog'
                    aria-label={t('chatWidget.ariaLabel')}
                    className='flex h-[calc(100dvh-100px)] max-h-[560px] w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-15px_rgba(15,23,42,0.35)] sm:h-[500px] sm:w-[370px] dark:border-slate-700 dark:bg-slate-900'>
                    <header className='relative overflow-hidden bg-gradient-to-r from-[#00a0e3] to-[#007fbd] px-5 py-4 text-white'>
                        <div className='absolute -top-10 -right-8 h-28 w-28 rounded-full bg-white/10' />
                        <div className='relative flex items-center gap-3'>
                            <div className='relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20 ring-1 ring-white/30'>
                                <Headphones size={22} />
                                <span className='absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[#008dca] bg-emerald-400' />
                            </div>
                            <div className='min-w-0 flex-1'>
                                <h2 className='font-bold'>{t('chatWidget.operatorTitle')}</h2>
                                <p className='mt-0.5 text-xs text-white/80'>{t('chatWidget.responseTime')}</p>
                            </div>
                            <button
                                type='button'
                                onClick={() => setIsOpen(false)}
                                aria-label={t('chatWidget.close')}
                                className='grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white'>
                                <X size={20} />
                            </button>
                        </div>
                    </header>

                    {!isReady || isAuthLoading ? (
                        <div className='grid flex-1 place-items-center bg-slate-50 dark:bg-slate-950/60'>
                            <Loader2 className='animate-spin text-[#00a0e3]' size={26} />
                        </div>
                    ) : !canStartChat ? (
                        <div className='flex flex-1 flex-col justify-center bg-slate-50 p-6 dark:bg-slate-950/60'>
                            <div className='mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#00a0e3]/10 text-[#00a0e3]'>
                                <UserRound size={28} />
                            </div>
                            <h3 className='mt-4 text-center text-lg font-bold text-slate-900 dark:text-white'>
                                {t('chatWidget.introTitle')}
                            </h3>
                            <p className='mt-1 text-center text-sm text-slate-500 dark:text-slate-400'>
                                {t('chatWidget.introDescription')}
                            </p>

                            <form onSubmit={handleVisitorSubmit} className='mt-5 space-y-3'>
                                <label htmlFor='chat-visitor-name' className='sr-only'>
                                    {t('chatWidget.name')}
                                </label>
                                <input
                                    id='chat-visitor-name'
                                    maxLength={60}
                                    autoComplete='name'
                                    placeholder={t('chatWidget.name')}
                                    {...visitorForm.register('name', {
                                        required: t('chatWidget.nameRequired'),
                                        validate: (value) => value.trim().length >= 2 || t('chatWidget.nameInvalid')
                                    })}
                                    className='h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-[#00a0e3] focus:ring-2 focus:ring-[#00a0e3]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                                />
                                <label htmlFor='chat-visitor-phone' className='sr-only'>
                                    {t('chatWidget.phone')}
                                </label>
                                <Controller
                                    name='phone'
                                    control={visitorForm.control}
                                    rules={{
                                        required: t('chatWidget.phoneRequired'),
                                        validate: (value) =>
                                            Boolean(normalizeUzPhone(value)) || t('chatWidget.phoneInvalid')
                                    }}
                                    render={({ field }) => (
                                        <IMaskInput
                                            id='chat-visitor-phone'
                                            mask='+{998} 00 000 00 00'
                                            inputMode='tel'
                                            unmask={false}
                                            value={field.value}
                                            onAccept={(value) => field.onChange(String(value))}
                                            onBlur={field.onBlur}
                                            inputRef={field.ref}
                                            autoComplete='tel'
                                            placeholder={t('chatWidget.phonePlaceholder')}
                                            className='h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-[#00a0e3] focus:ring-2 focus:ring-[#00a0e3]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                                        />
                                    )}
                                />
                                {(visitorForm.formState.errors.name || visitorForm.formState.errors.phone) && (
                                    <p className='text-sm text-red-500'>
                                        {visitorForm.formState.errors.name?.message ||
                                            visitorForm.formState.errors.phone?.message}
                                    </p>
                                )}
                                <button
                                    type='submit'
                                    className='h-12 w-full rounded-2xl bg-[#ef7f1a] font-bold text-white transition hover:bg-[#dc6f10] active:scale-[0.99]'>
                                    {t('chatWidget.start')}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className='min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-slate-50 p-3 sm:p-4 dark:bg-slate-950/60'>
                                <p className='text-center text-[11px] font-medium text-slate-400'>
                                    {t('chatWidget.today')}
                                </p>

                                {messages.map((item) => {
                                    const isUser = item.sender === 'user';
                                    return (
                                        <div
                                            key={item.id}
                                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${
                                                    isUser
                                                        ? 'rounded-br-md bg-[#00a0e3] text-white'
                                                        : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                                                }`}>
                                                <p className='text-sm leading-5'>{item.text}</p>
                                                <p
                                                    className={`mt-1 text-right text-[10px] ${
                                                        isUser ? 'text-white/70' : 'text-slate-400'
                                                    }`}>
                                                    {item.time}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <form
                                onSubmit={handleMessageSubmit}
                                className='border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900'>
                                {sendMessageMutation.isError && (
                                    <div className='mb-2 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400'>
                                        <AlertCircle className='mt-0.5 shrink-0' size={14} />
                                        <span>{t('chatWidget.sendError')}</span>
                                    </div>
                                )}
                                <div className='flex items-end gap-2 rounded-2xl bg-slate-100 p-1.5 pl-4 transition focus-within:ring-2 focus-within:ring-[#00a0e3]/30 dark:bg-slate-800'>
                                    <textarea
                                        {...messageForm.register('message', {
                                            required: true,
                                            validate: (value) => Boolean(value.trim()),
                                            maxLength: 1500
                                        })}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' && !event.shiftKey) {
                                                event.preventDefault();
                                                event.currentTarget.form?.requestSubmit();
                                            }
                                        }}
                                        rows={1}
                                        maxLength={1500}
                                        placeholder={t('chatWidget.messagePlaceholder')}
                                        aria-label={t('chatWidget.messagePlaceholder')}
                                        className='max-h-24 min-h-10 flex-1 resize-none bg-transparent py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-sm dark:text-white'
                                    />
                                    <button
                                        type='submit'
                                        disabled={!messageValue.trim() || sendMessageMutation.isPending}
                                        aria-label={t('chatWidget.send')}
                                        className='grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ef7f1a] text-white transition hover:bg-[#dc6f10] disabled:cursor-not-allowed disabled:opacity-40'>
                                        {sendMessageMutation.isPending ? (
                                            <Loader2 className='animate-spin' size={18} />
                                        ) : (
                                            <Send size={18} />
                                        )}
                                    </button>
                                </div>
                                <p className='mt-2 text-center text-[10px] text-slate-400'>{t('chatWidget.service')}</p>
                            </form>
                        </>
                    )}
                </section>
            )}

            <button
                type='button'
                onClick={() => setIsOpen((current) => !current)}
                aria-label={isOpen ? t('chatWidget.close') : t('chatWidget.open')}
                aria-expanded={isOpen}
                className='group relative grid h-15 w-15 place-items-center rounded-full bg-[#ef7f1a] text-white shadow-[0_12px_35px_-8px_rgba(239,127,26,0.8)] transition duration-300 hover:-translate-y-1 hover:bg-[#dc6f10] active:scale-95 sm:h-16 sm:w-16'>
                <span className='absolute inset-0 animate-ping rounded-full bg-[#ef7f1a]/25 group-hover:animate-none' />
                {isOpen ? <X className='relative' size={27} /> : <MessageCircle className='relative' size={28} />}
                {!isOpen && unreadCount > 0 && (
                    <span className='absolute top-0 right-0 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold'>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
                {!isOpen && unreadCount === 0 && !hasReadChat && (
                    <span className='absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-red-500' />
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
