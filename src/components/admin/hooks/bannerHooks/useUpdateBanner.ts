import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BannerService } from '../../services/banner.service';

type UpdateBannerParams = {
    id: string;
    formData: FormData;
};

export const useUpdateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: UpdateBannerParams) => BannerService.updateBanner(id, formData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['banners'] });
        }
    });
};
