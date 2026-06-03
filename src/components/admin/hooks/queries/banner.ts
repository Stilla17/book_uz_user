import { Banner } from '@/types';
import { useQuery } from '@tanstack/react-query';

import { BannerService } from '../../services/banner.service';

export const useBannerQuery = () => {
    return useQuery<Banner[]>({
        queryKey: ['banners'],
        queryFn: async () => {
            const data = await BannerService.getBanners();
            return data?.banners ?? data ?? [];
        }
    });
};

export const useBannerDetailQuery = (id: string | null) => {
    return useQuery<Banner>({
        queryKey: ['banners', 'detail', id],
        queryFn: () => BannerService.getBannerById(id!),
        enabled: !!id
    });
};
