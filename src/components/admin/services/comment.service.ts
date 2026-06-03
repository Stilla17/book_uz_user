import type { CommentStatus } from '@/types/comment';

import { api } from './api';

export const CommentService = {
    getComment: async () => {
        const response = await api.get('/admin/comments');
        return response.data.data;
    },
    updateCommentStatus: async ({ commentId, status }: { commentId: string; status: CommentStatus }) => {
        const response = await api.patch(`/admin/comments/${commentId}/status`, { status });
        return response.data;
    },
    deleteComment: async (commentId: string) => {
        const response = await api.delete(`/admin/comments/${commentId}`);
        return response.data;
    }
};
