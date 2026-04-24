import { filterService } from '@/services/filter.service';
import { useQuery } from '@tanstack/react-query';

export const bookFilterQuery = ['book-filter'] as const;

export const useBookFilterQuery = () => {
    return useQuery({
        queryKey: bookFilterQuery,
        queryFn: () => filterService.getAllFilters()
    });
};
