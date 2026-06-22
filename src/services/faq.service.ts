import { api } from './api';

export const FaqServiceUser = {
    getUserFaqs: async () => {
        const response = await api.get('/faqs');
        return response.data;
    }
};
