import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { SendSupportChatMessage, SupportChatMessage } from '@/types/support-chat';

type ApiResponse<T> = {
    data: T;
};

const chatQueryKey = (visitorId?: string) => ['support-chat', visitorId] as const;

export const useSupportChatMessages = (visitorId?: string) =>
    useQuery({
        queryKey: chatQueryKey(visitorId),
        queryFn: async () => {
            const response = await api.get<ApiResponse<SupportChatMessage[]>>('/support-chat/messages', {
                params: { visitorId }
            });

            return response.data.data;
        },
        enabled: Boolean(visitorId),
        refetchInterval: 3000
    });

export const useSendSupportChatMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SendSupportChatMessage) => {
            const response = await api.post<ApiResponse<SupportChatMessage>>('/support-chat/messages', payload);
            return response.data.data;
        },
        onSuccess: (message, payload) => {
            queryClient.setQueryData<SupportChatMessage[]>(chatQueryKey(payload.visitorId), (current = []) =>
                current.some((item) => item.id === message.id) ? current : [...current, message]
            );
        }
    });
};
