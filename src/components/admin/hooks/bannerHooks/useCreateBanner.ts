import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BannerService } from '../../services/banner.service';

export const useCreateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => BannerService.addBanner(formData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['banners'] });
        }
    });
};
