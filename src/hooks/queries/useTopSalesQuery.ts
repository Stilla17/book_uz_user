import { TopSalesPeriod, topSalesService } from '@/services/topSales.service';
import { useQuery } from '@tanstack/react-query';

export const useTopSalesQuery = (period: TopSalesPeriod) =>
    useQuery({
        queryKey: ['top-sales', period],
        queryFn: () => topSalesService.getTopSales(period, 10),
        staleTime: 10 * 60 * 1000
    });
