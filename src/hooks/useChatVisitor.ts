'use client';

import { useCallback, useEffect, useState } from 'react';

import type { User } from '@/types/auth.types';
import type { ChatVisitor } from '@/types/support-chat';

const VISITOR_ID_KEY = 'bookuz:chat-visitor-id';
const VISITOR_NAME_KEY = 'bookuz:chat-visitor-name';
const VISITOR_PHONE_KEY = 'bookuz:chat-visitor-phone';

const createVisitorId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const useChatVisitor = (user: User | null) => {
    const [visitor, setVisitor] = useState<ChatVisitor | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let id = localStorage.getItem(VISITOR_ID_KEY);

        if (!id) {
            id = createVisitorId();
            localStorage.setItem(VISITOR_ID_KEY, id);
        }

        setVisitor({
            id,
            name: user?.name?.trim() || localStorage.getItem(VISITOR_NAME_KEY) || '',
            phone: user?.phone?.trim() || localStorage.getItem(VISITOR_PHONE_KEY) || ''
        });
        setIsReady(true);
    }, [user]);

    const saveVisitor = useCallback((values: Pick<ChatVisitor, 'name' | 'phone'>) => {
        localStorage.setItem(VISITOR_NAME_KEY, values.name);
        localStorage.setItem(VISITOR_PHONE_KEY, values.phone);
        setVisitor((current) => (current ? { ...current, ...values } : current));
    }, []);

    return { visitor, isReady, saveVisitor };
};
