import { FaqForm } from '@/app/(admin)/admin/faq/new/page';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FaqService } from '../../services/faq.service';

export const useCreateFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FaqForm) => FaqService.createFaqs(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
        }
    });
};
