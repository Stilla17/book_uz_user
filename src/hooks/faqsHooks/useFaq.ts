import { FaqServiceUser } from '@/services/faq.service';
import { useQuery } from '@tanstack/react-query';

export const useFaq = () => {
    return useQuery({
        queryKey: ['user-faq'],
        queryFn: () => FaqServiceUser.getUserFaqs()
    });
};
