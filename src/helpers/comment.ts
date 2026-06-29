import { AdminComment, CommentStatus } from '@/types/comment';

export const getCommentBookTitle = (comment: AdminComment) => {
    if (typeof comment.book === 'string') return 'Kitob';

    const title = comment.book.title;

    if (!title) return 'Kitob';
    if (typeof title === 'string') return title;

    return title.uz || title.ru || title.en || 'Kitob';
};

export const getCommentAuthorName = (comment: AdminComment) => {
    if (comment.name) return comment.name;

    if (comment.user && typeof comment.user === 'object') {
        return comment.user.name || comment.user.email || 'Foydalanuvchi';
    }

    return 'Foydalanuvchi';
};

export const statusOptions: Array<{ value: 'all' | CommentStatus; label: string }> = [
    { value: 'all', label: 'Barchasi' },
    { value: 'approved', label: 'Tasdiqlangan' },
    { value: 'rejected', label: 'Rad etilgan' }
];

export const statusStyles: Record<CommentStatus, string> = {
    pending:
        'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
    approved:
        'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
    aproved:
        'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
    rejected: 'bg-red-50 text-red-600 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20'
};

export const statusLabels: Record<CommentStatus, string> = {
    pending: 'Kutilmoqda',
    approved: 'Tasdiqlangan',
    aproved: 'Tasdiqlangan',
    rejected: 'Rad etilgan'
};
