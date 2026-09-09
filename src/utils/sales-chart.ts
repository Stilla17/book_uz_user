export type SalesPeriod = 'weekly' | 'current-month' | 'monthly';
export type SalesPoint = { amount: number; createdAt: string; label?: string };
export type SalesBucket = { start: Date; end: Date; label: string; amount: number };
export type BranchSales = { id: string; name: string; amount: number; sales: SalesPoint[] };

const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

export const getSalesBuckets = (period: SalesPeriod, today = new Date()): SalesBucket[] =>
    Array.from({ length: period === 'weekly' ? 7 : period === 'current-month' ? today.getDate() : 6 }, (_, index) => {
        const start =
            period === 'weekly'
                ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + index)
                : period === 'current-month'
                  ? new Date(today.getFullYear(), today.getMonth(), index + 1)
                  : new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
        const end =
            period !== 'monthly'
                ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1)
                : new Date(start.getFullYear(), start.getMonth() + 1, 1);
        return {
            start,
            end,
            label:
                period !== 'monthly'
                    ? `${String(start.getDate()).padStart(2, '0')}.${String(start.getMonth() + 1).padStart(2, '0')}`
                    : `${months[start.getMonth()]} ${start.getFullYear()}`,
            amount: 0
        };
    });

export const addSaleToBuckets = (buckets: SalesBucket[], sale: SalesPoint) => {
    const date = new Date(sale.createdAt.replace(' ', 'T'));
    if (!Number.isFinite(sale.amount) || Number.isNaN(date.getTime())) return false;
    const bucket = buckets.find((item) => date >= item.start && date < item.end);
    if (!bucket) return false;
    bucket.amount += sale.amount;
    return true;
};

export const toSalesPoints = (buckets: SalesBucket[]): SalesPoint[] =>
    buckets.map((bucket) => ({ amount: bucket.amount, createdAt: bucket.start.toISOString(), label: bucket.label }));

export const getAllTimeSalesPoints = (sales: SalesPoint[], today = new Date()): SalesPoint[] => {
    const totals = new Map<number, number>();
    for (const sale of sales) {
        const date = new Date(sale.createdAt.replace(' ', 'T'));
        if (!Number.isFinite(sale.amount) || Number.isNaN(date.getTime())) continue;
        const month = date.getFullYear() * 12 + date.getMonth();
        totals.set(month, (totals.get(month) ?? 0) + sale.amount);
    }
    if (!totals.size) return [];
    const firstMonth = Math.min(...totals.keys());
    const lastMonth = Math.max(today.getFullYear() * 12 + today.getMonth(), ...totals.keys());
    return Array.from({ length: lastMonth - firstMonth + 1 }, (_, index) => {
        const month = firstMonth + index;
        const date = new Date(Math.floor(month / 12), month % 12, 1);
        return {
            amount: totals.get(month) ?? 0,
            createdAt: date.toISOString(),
            label: `${months[date.getMonth()]} ${date.getFullYear()}`
        };
    });
};
