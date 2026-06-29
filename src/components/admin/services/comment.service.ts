import type { CommentStatus } from '@/types/comment';

import { api } from './api';

type GetCommentParams = {
    search?: string;
    status?: 'all' | CommentStatus;
};

export const CommentService = {
    getComment: async (params?: GetCommentParams) => {
        const response = await api.get('/admin/comments', {
            params: {
                ...(params?.search ? { search: params.search } : {}),
                ...(params?.status && params.status !== 'all' ? { status: params.status } : {})
            }
        });
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
