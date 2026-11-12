'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { SupportChatMessage } from '@/types/support-chat';

const LAST_READ_AT_KEY = 'bookuz:chat-last-read-at';

export const useChatUnread = (messages: SupportChatMessage[], visitorId: string | undefined, isOpen: boolean) => {
    const [lastReadAt, setLastReadAt] = useState<string | null>(null);

    const storageKey = visitorId ? `${LAST_READ_AT_KEY}:${visitorId}` : LAST_READ_AT_KEY;

    useEffect(() => {
        setLastReadAt(localStorage.getItem(storageKey));
    }, [storageKey]);

    const markAsRead = useCallback(() => {
        const readAt = new Date().toISOString();
        localStorage.setItem(storageKey, readAt);
        setLastReadAt(readAt);
    }, [storageKey]);

    useEffect(() => {
        if (isOpen) markAsRead();
    }, [isOpen, markAsRead, messages]);

    const unreadCount = useMemo(() => {
        if (isOpen) return 0;

        const lastReadTime = lastReadAt ? new Date(lastReadAt).getTime() : 0;
        return messages.filter(
            (message) => message.sender === 'operator' && new Date(message.createdAt).getTime() > lastReadTime
        ).length;
    }, [isOpen, lastReadAt, messages]);

    return {
        unreadCount,
        hasReadChat: Boolean(lastReadAt),
        markAsRead
    };
};
