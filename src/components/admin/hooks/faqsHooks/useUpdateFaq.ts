import { FaqForm } from '@/app/(admin)/admin/faq/new/page';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FaqService } from '../../services/faq.service';

type UpdateFaqParams = {
    id: string;
    data: FaqForm;
};

export const useUpdateFaq = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateFaqParams) => FaqService.updateFaq(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
        }
    });
};
