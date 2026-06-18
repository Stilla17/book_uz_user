import { api } from './api';

type AiChatResponse = {
    success: boolean;
    message: string;
    data: {
        answer: string;
    };
};

export type AiChatHistoryItem = {
    role: 'assistant' | 'user';
    text: string;
};

export const AiService = {
    sendMessage: async (message: string, history: AiChatHistoryItem[] = []) => {
        const response = await api.post<AiChatResponse>('/ai/chat', { message, history });
        return response.data.data.answer;
    }
};
