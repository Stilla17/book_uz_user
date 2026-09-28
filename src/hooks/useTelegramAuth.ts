import { AuthServiceAPI } from '@/services/auth.service';
import { TelegramAuthPayload } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';

export const useTelegramAuth = () => {
    return useMutation({
        mutationFn: (payload: TelegramAuthPayload) => AuthServiceAPI.authWithTelegram(payload)
    });
};
