'use client';

import { userBannerService } from '@/services/userBanner.service';
import { useQuery } from '@tanstack/react-query';

export const useHeroBannersQuery = () =>
    useQuery({
        queryKey: ['user-banners', 'hero'],
        queryFn: () => userBannerService.getHeroBanners()
    });
