import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DiscountForm, DiscountService } from '../../services/discount.service';

export const useGetDiscounts = () => {
    return useQuery({
        queryKey: ['admin', 'discounts'],
        queryFn: () => DiscountService.getDiscounts()
    });
};

export const useCreateDiscount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DiscountForm) => DiscountService.createDiscount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'discounts'] });
        }
    });
};

export const useDeleteDiscount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => DiscountService.deleteDiscount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'discounts'] });
        }
    });
};

export const useUpdateDiscount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: DiscountForm }) => DiscountService.updateDiscount(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'discounts'] });
        }
    });
};

export const useGetDiscountById = (id?: string | null) => {
    return useQuery({
        queryKey: ['admin', 'discounts', id],
        queryFn: () => DiscountService.getDiscountById(id!),
        enabled: !!id
    });
};
