'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import { Loader2, MessageCircle } from 'lucide-react';

const DynamicChatWidget = dynamic(() => import('./ChatWidget'), {
    ssr: false,
    loading: () => (
        <div className='fixed inset-x-3 bottom-3 z-[100] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6 sm:left-auto'>
            <button
                type='button'
                disabled
                aria-label='Yordam chati yuklanmoqda'
                className='grid h-15 w-15 place-items-center rounded-full bg-[#ef7f1a] text-white shadow-[0_12px_35px_-8px_rgba(239,127,26,0.8)] sm:h-16 sm:w-16'>
                <Loader2 className='animate-spin' size={27} />
            </button>
        </div>
    )
});

const preloadChat = () => {
    void import('./ChatWidget');
};

const LazyChatWidget = () => {
    const [shouldLoadChat, setShouldLoadChat] = useState(false);

    if (shouldLoadChat) {
        return <DynamicChatWidget initialOpen />;
    }

    return (
        <div className='fixed inset-x-3 bottom-3 z-[100] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6 sm:left-auto'>
            <button
                type='button'
                onClick={() => setShouldLoadChat(true)}
                onPointerEnter={preloadChat}
                onFocus={preloadChat}
                aria-label='Yordam chatini ochish'
                aria-expanded={false}
                className='group relative grid h-15 w-15 place-items-center rounded-full bg-[#ef7f1a] text-white shadow-[0_12px_35px_-8px_rgba(239,127,26,0.8)] transition duration-300 hover:-translate-y-1 hover:bg-[#dc6f10] active:scale-95 sm:h-16 sm:w-16'>
                <span className='absolute inset-0 animate-ping rounded-full bg-[#ef7f1a]/25 group-hover:animate-none' />

                <MessageCircle className='relative' size={28} />

                <span className='absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-red-500' />
            </button>
        </div>
    );
};

export default LazyChatWidget;
