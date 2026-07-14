import { Award, Clock, MessageCircle, Users } from "lucide-react";

export const supportStats = [
    {
        id: 'customers',
        icon: <Users size={24} strokeWidth={2.5} />,
        value: '50K+',
        label: 'Mijozlar',
        color: 'from-[#00a0e3] to-[#4dc3ff]'
    },
    {
        id: 'responseTime',
        icon: <MessageCircle size={24} strokeWidth={2.5} />,
        value: '10 min',
        label: 'Tezkor javob',
        color: 'from-[#ef7f1a] to-[#ff9f4d]'
    },
    {
        id: 'service',
        icon: <Clock size={24} strokeWidth={2.5} />,
        value: '24/7',
        label: 'Xizmat',
        color: 'from-[#00a0e3] to-[#4dc3ff]'
    },
    {
        id: 'satisfaction',
        icon: <Award size={24} strokeWidth={2.5} />,
        value: '99%',
        label: 'Mamnun',
        color: 'from-[#ef7f1a] to-[#ff9f4d]'
    }
];
