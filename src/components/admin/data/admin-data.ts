import { BookOpen, Users } from 'lucide-react';

export const getAuthorStats = (totalAuthors: number = 0, totalAuthorBooks: number = 0) => [
    {
        label: 'Jami mualliflar',
        value: totalAuthors,
        icon: Users,
        color: 'bg-[#ef7f1a]'
    },
    {
        label: 'Kitoblar',
        value: totalAuthorBooks,
        icon: BookOpen,
        color: 'bg-[#285c7f]'
    }
];
