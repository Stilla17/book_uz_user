import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BannerService } from '../../services/banner.service';

export const useDeleteBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => BannerService.deleteBanner(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['banners'] });
        }
    });
};
