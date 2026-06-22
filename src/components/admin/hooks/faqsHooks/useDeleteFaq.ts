import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FaqService } from '../../services/faq.service';

export const useDeleteFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => FaqService.deleteFaq(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
        }
    });
};
