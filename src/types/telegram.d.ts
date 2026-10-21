import type { TelegramAuthPayload } from './auth.types';

declare module 'telegram-web-app' {
    interface Telegram {
        Login?: {
            auth: (
                options: {
                    bot_id: number;
                    request_access?: boolean;
                },
                callback: (payload: TelegramAuthPayload | false) => void
            ) => void;
        };
    }
}
