import { api } from './api';

type AiChatResponse = {
    success: boolean;
    message: string;
    data: {
        answer: string;
    };
};

export const AiService = {
    sendMessage: async (message: string) => {
        const response = await api.post<AiChatResponse>('/ai/chat', { message });
        return response.data.data.answer;
    }
};
