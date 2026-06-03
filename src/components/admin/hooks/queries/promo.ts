import type { Coupon } from '@/types';
import { useQuery } from '@tanstack/react-query';

import { PromoService } from '../../services/promo.service';

export const usePromoQuery = () => {
    return useQuery<Coupon[]>({
        queryKey: ['promos'],
        queryFn: () => PromoService.getPromos()
    });
};
