'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';

import { AiService } from '@/services/ai.service';

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, Bot, ChevronDown, MessageCircle, Send, Sparkles, X } from 'lucide-react';

type ChatMessage = {
    id: number;
    role: 'assistant' | 'user';
    text: string;
};

const quickQuestions = ['Menga kitob tavsiya qil', "O'zbek adabiyoti", 'Bestsellerlar'];

const initialMessages: ChatMessage[] = [
    {
        id: 1,
        role: 'assistant',
        text: 'Salom! Men Book.uz AI yordamchisiman. Kayfiyatingiz va qiziqishlaringizga mos kitob topishga yordam beraman.'
    }
];

export const BookAiAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen, messages]);

    const submitMessage = async (text: string) => {
        const trimmedText = text.trim();

        if (!trimmedText || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            role: 'user',
            text: trimmedText
        };

        setMessages((current) => [...current, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = [...messages, userMessage]
                .slice(-8)
                .map(({ role, text }) => ({ role, text }));

            const answer = await AiService.sendMessage(trimmedText, history);

            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: answer
                }
            ]);
        } catch (error) {
            console.error('AI chat xatosi:', error);

            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: "Kechirasiz, hozir javob bera olmadim. Qayta urinib ko'ring. Yoki +998(71) 230-00-50 shu nomerga bog'lanishingiz mumkin"
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitMessage(input);
    };

    return (
        <div className='pointer-events-none fixed right-3 bottom-3 z-[60] flex flex-col items-end sm:right-5 sm:bottom-5'>
            <AnimatePresence>
                {isOpen && (
                    <motion.section
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        role='dialog'
                        aria-label='Book.uz AI yordamchi'
                        className='pointer-events-auto mb-3 flex h-[min(470px,calc(100dvh-85px))] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.4)] sm:w-[340px] dark:border-slate-700/80 dark:bg-slate-900'>
                        <header className='relative overflow-hidden bg-slate-950 px-4 py-3.5 text-white'>
                            <div className='pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-[#00a0e3]/30 blur-3xl' />
                            <div className='pointer-events-none absolute -bottom-20 -left-8 size-36 rounded-full bg-[#ef7f1a]/25 blur-3xl' />

                            <div className='relative flex items-center justify-between gap-3'>
                                <div className='flex min-w-0 items-center gap-2.5'>
                                    <div className='relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#00a0e3] to-[#0067a3] shadow-lg shadow-sky-950/40'>
                                        <BookOpenText size={20} />
                                        <span className='absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-slate-950 bg-emerald-400' />
                                    </div>

                                    <div className='min-w-0'>
                                        <div className='flex items-center gap-1.5'>
                                            <h2 className='truncate text-sm font-black'>Book.uz AI</h2>
                                            <Sparkles size={12} className='text-[#ef7f1a]' />
                                        </div>
                                        <p className='mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-300'>
                                            <span className='size-1.5 rounded-full bg-emerald-400' />
                                            Onlayn, yordam berishga tayyor
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type='button'
                                    onClick={() => setIsOpen(false)}
                                    className='grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white'
                                    aria-label='AI chatni yopish'>
                                    <X size={16} />
                                </button>
                            </div>
                        </header>

                        <div className='no-scrollbar flex-1 space-y-3 overflow-y-auto bg-slate-50/80 px-3.5 py-3 dark:bg-slate-950/70'>
                            <div className='flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.14em] text-slate-400 uppercase'>
                                <span className='h-px w-7 bg-slate-200 dark:bg-slate-800' />
                                Bugun
                                <span className='h-px w-7 bg-slate-200 dark:bg-slate-800' />
                            </div>

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-end gap-2 ${
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}>
                                    {message.role === 'assistant' && (
                                        <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-[#00a0e3]/10 text-[#00a0e3] dark:bg-sky-400/10 dark:text-sky-300'>
                                            <Bot size={15} />
                                        </span>
                                    )}
                                    <p
                                        className={`max-w-[84%] whitespace-pre-line rounded-2xl px-3 py-2.5 text-xs leading-4.5 shadow-sm ${
                                            message.role === 'user'
                                                ? 'rounded-br-md bg-[#ef7f1a] text-white'
                                                : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
                                        }`}>
                                        {message.text}
                                    </p>
                                </div>
                            ))}

                            {isLoading && (
                                <div className='flex items-end gap-2'>
                                    <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-[#00a0e3]/10 text-[#00a0e3]'>
                                        <Bot size={15} />
                                    </span>

                                    <div className='flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-900'>
                                        <span className='size-1.5 animate-bounce rounded-full bg-slate-400' />
                                        <span className='size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]' />
                                        <span className='size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]' />
                                    </div>
                                </div>
                            )}

                            {messages.length === 1 && (
                                <div className='pl-9'>
                                    <p className='mb-1.5 text-[9px] font-bold tracking-wide text-slate-400 uppercase'>
                                        Tezkor savollar
                                    </p>
                                    <div className='flex flex-wrap gap-1.5'>
                                        {quickQuestions.map((question) => (
                                            <button
                                                key={question}
                                                type='button'
                                                onClick={() => submitMessage(question)}
                                                className='rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-600 transition hover:border-[#ef7f1a]/40 hover:bg-orange-50 hover:text-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-400/40 dark:hover:bg-orange-400/10 dark:hover:text-orange-300'>
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className='border-t border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900'>
                            <form
                                onSubmit={handleSubmit}
                                className='flex items-end gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-[#00a0e3]/60 focus-within:ring-3 focus-within:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:border-sky-400/60 dark:focus-within:ring-sky-950'>
                                <textarea
                                    value={input}
                                    onChange={(event) => setInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' && !event.shiftKey) {
                                            event.preventDefault();
                                            submitMessage(input);
                                        }
                                    }}
                                    rows={1}
                                    disabled={isLoading}
                                    placeholder="Kitob haqida so'rang..."
                                    aria-label='AI yordamchiga xabar'
                                    className='max-h-20 min-h-8 flex-1 resize-none bg-transparent px-2 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-white'
                                />
                                <button
                                    type='submit'
                                    disabled={!input.trim() || isLoading}
                                    className='grid size-8 shrink-0 place-items-center rounded-lg bg-[#ef7f1a] text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40 dark:shadow-none'
                                    aria-label='Xabarni yuborish'>
                                    <Send size={14} />
                                </button>
                            </form>
                            <p className='mt-1.5 text-center text-[9px] text-slate-400'>
                                AI javoblari xato bo'lishi mumkin. Muhim ma'lumotlarni tekshiring.
                            </p>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <div className='pointer-events-auto flex items-center gap-1.5'>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='hidden rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg lg:block dark:border-slate-700 dark:bg-slate-900'>
                        <p className='text-[10px] font-black text-slate-800 dark:text-white'>
                            Kitob tanlashda yordam kerakmi?
                        </p>
                    </motion.div>
                )}

                <motion.button
                    type='button'
                    onClick={() => setIsOpen((current) => !current)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className='relative grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[#00a0e3] to-[#0067a3] text-white shadow-[0_12px_28px_-8px_rgba(0,160,227,0.65)] ring-3 ring-white transition sm:size-13 dark:ring-slate-900'
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'AI chatni yopish' : 'AI chatni ochish'}>
                    {!isOpen && (
                        <span className='absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full border-2 border-white bg-[#ef7f1a] dark:border-slate-900'>
                            <Sparkles size={8} />
                        </span>
                    )}
                    {isOpen ? <ChevronDown size={21} /> : <MessageCircle size={21} />}
                </motion.button>
            </div>
        </div>
    );
};
