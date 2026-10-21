import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CatalogService } from '../../services/catalog.service';
import { catalogQueryKey } from '../queries/catalog';

type UpdateCatalogParams = {
    id: string;
    formData: FormData;
};

const useInvalidateCatalog = () => {
    const queryClient = useQueryClient();

    return () => queryClient.invalidateQueries({ queryKey: catalogQueryKey });
};

export const useCreateCatalog = () => {
    const invalidateCatalog = useInvalidateCatalog();

    return useMutation({
        mutationFn: (formData: FormData) => CatalogService.createCatalog(formData),
        onSuccess: invalidateCatalog
    });
};

export const useUpdateCatalog = () => {
    const invalidateCatalog = useInvalidateCatalog();

    return useMutation({
        mutationFn: ({ id, formData }: UpdateCatalogParams) => CatalogService.updateCatalog(id, formData),
        onSuccess: invalidateCatalog
    });
};

export const useDeleteCatalog = () => {
    const invalidateCatalog = useInvalidateCatalog();

    return useMutation({
        mutationFn: (id: string) => CatalogService.deleteCatalog(id),
        onSuccess: invalidateCatalog
    });
};

export const useSyncCatalogPrices = () => {
    const invalidateCatalog = useInvalidateCatalog();

    return useMutation({
        mutationFn: () => CatalogService.syncCatalogPrices(),
        onSuccess: invalidateCatalog
    });
};

export const useToggleCatalogStatus = () => {
    const invalidateCatalog = useInvalidateCatalog();

    return useMutation({
        mutationFn: (id: string) => CatalogService.toggleCatalogStatus(id),
        onSuccess: invalidateCatalog
    });
};
