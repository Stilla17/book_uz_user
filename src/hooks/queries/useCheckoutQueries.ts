'use client';

import { UserService } from '@/services/api';
import { PromoServiceUser } from '@/services/promo.service';
import type { Coupon } from '@/types';
import type { DistrictItem, RegionItem } from '@/helpers/checkout';
import { useQuery } from '@tanstack/react-query';

export const useDeliverySettingsQuery = () =>
    useQuery({
        queryKey: ['settings', 'delivery'],
        queryFn: UserService.getDeliverySettings,
        staleTime: 10 * 60 * 1000
    });

export const usePromosQuery = () =>
    useQuery<Coupon[]>({
        queryKey: ['user-promos'],
        queryFn: PromoServiceUser.getPromos,
        staleTime: 5 * 60 * 1000
    });

export const useRegionsQuery = () =>
    useQuery<RegionItem[]>({
        queryKey: ['regions'],
        queryFn: UserService.getRegions,
        staleTime: 30 * 60 * 1000
    });

export const useDistrictsQuery = () =>
    useQuery<DistrictItem[]>({
        queryKey: ['districts'],
        queryFn: UserService.getDistricts,
        staleTime: 30 * 60 * 1000
    });
