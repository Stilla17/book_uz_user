export type SupportChatSender = 'operator' | 'user';

export type SupportChatMessage = {
    id: string;
    text: string;
    sender: SupportChatSender;
    createdAt: string;
};

export type ChatVisitor = {
    id: string;
    name: string;
    phone: string;
};

export type SendSupportChatMessage = {
    message: string;
    name: string;
    phone: string;
    visitorId: string;
    pageUrl: string;
};
