import type { AdminComment, CommentStatus } from '@/types/comment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CommentService } from '../../services/comment.service';

export const useGetComment = (params?: { search?: string; status?: 'all' | CommentStatus }) => {
    return useQuery<AdminComment[]>({
        queryKey: ['admin', 'comments', params?.search ?? '', params?.status ?? 'all'],
        queryFn: () => CommentService.getComment(params)
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: CommentService.deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        }
    });
};

export const useUpdateCommentStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, status }: { commentId: string; status: CommentStatus }) =>
            CommentService.updateCommentStatus({ commentId, status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] });
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        }
    });
};
