import { OtherPagination } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

import { FaqService } from '../../services/faq.service';

type FaqLocalizedText = {
    uz: string;
    ru: string;
    en: string;
};

type Faq = {
    _id: string;
    question: FaqLocalizedText;
    answer: FaqLocalizedText;
    status: 'Active' | 'Disabled';
    createdAt?: string;
    updatedAt?: string;
};

type FaqResponse = {
    faqs: Faq[];
    pagination: OtherPagination;
};
export const useGetFaq = () => {
    return useQuery<FaqResponse>({
        queryKey: ['admin', 'faqs'],
        queryFn: () => FaqService.getFaqs()
    });
};

export const useFaqDetailQuery = (id: string | null) => {
    return useQuery({
        queryKey: ['admin', 'faqs', id],
        queryFn: () => (id ? FaqService.getFaqId(id) : null),
        enabled: !!id
    });
};

export const useFaqListQuery = (page: number, limit: number, keyword = '') => {
    const search = keyword.trim();

    return useQuery<FaqResponse>({
        queryKey: ['admin', 'faqs', 'list', page, limit, search],
        queryFn: () => FaqService.getFaqs({ page, limit, search }),
        placeholderData: (previousData) => previousData
    });
};
