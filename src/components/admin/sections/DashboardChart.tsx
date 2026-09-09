'use client';

import { useMemo, useState } from 'react';

import { api } from '@/components/admin/services/api';
import { formatPrice } from '@/utils/currency';
import { isOrderRevenueEligible } from '@/utils/order';
import {
    type BranchSales,
    type SalesPeriod,
    type SalesPoint,
    addSaleToBuckets,
    getAllTimeSalesPoints,
    getSalesBuckets,
    toSalesPoints
} from '@/utils/sales-chart';
import { useQuery } from '@tanstack/react-query';

import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

type SiteOrder = {
    totalAmount: number;
    createdAt: string;
    status?: string;
    paymentStatus?: string;
    paymentType?: string;
};
type MoyskladSales = { sales: SalesPoint[]; branches: BranchSales[]; partial?: boolean; message?: string };
const periods: { value: SalesPeriod; label: string }[] = [
    { value: 'weekly', label: 'Oxirgi 7 kun' },
    { value: 'current-month', label: 'Oylik savdo' },
    { value: 'monthly', label: 'Oxirgi 6 oy' }
];
const cardClass =
    'min-w-0 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] sm:p-5 dark:bg-slate-950 dark:ring-slate-800';
const compactAmount = (value: number) =>
    new Intl.NumberFormat('uz-UZ', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const fetchSiteSales = async (signal: AbortSignal): Promise<SiteOrder[]> => {
    const getPage = async (page: number) => {
        const response = await api.get('/admin/orders', { params: { page, limit: 100 }, signal });
        return response.data.data as { orders: SiteOrder[]; pagination?: { pages?: number } };
    };
    const first = await getPage(1);
    const orders = [...(first.orders ?? [])];
    const pages = Number(first.pagination?.pages ?? 1);
    for (let page = 2; Number.isFinite(pages) && page <= pages; page += 4) {
        const batch = await Promise.all(
            Array.from({ length: Math.min(4, pages - page + 1) }, (_, index) => getPage(page + index))
        );
        batch.forEach((data) => orders.push(...(data.orders ?? [])));
    }
    return orders;
};

const fetchMoyskladSales = async (period: SalesPeriod, signal: AbortSignal): Promise<MoyskladSales> => {
    const response = await fetch(`/api/moysklad/sales?period=${period}`, { cache: 'no-store', signal });
    const data = await response.json();
    if (!response.ok || data.success === false) throw new Error(data.message || 'MoySklad savdosini yuklab bo‘lmadi');
    return data;
};

const PeriodSelect = ({
    value,
    onChange,
    onAllTime
}: {
    value: SalesPeriod | 'all';
    onChange: (period: SalesPeriod) => void;
    onAllTime?: () => void;
}) => (
    <div className='inline-flex flex-wrap gap-1 rounded-xl bg-[#f2e7d8] p-1 dark:bg-slate-900'>
        {periods.map((period) => (
            <button
                key={period.value}
                type='button'
                aria-pressed={value === period.value}
                onClick={() => onChange(period.value)}
                className={`rounded-lg px-3 py-2 text-xs font-bold ${value === period.value ? 'bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-800' : 'text-[#8b7e70]'}`}>
                {period.label}
            </button>
        ))}
        {onAllTime && (
            <button
                type='button'
                aria-pressed={value === 'all'}
                onClick={onAllTime}
                className={`rounded-lg px-3 py-2 text-xs font-bold ${value === 'all' ? 'bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-800' : 'text-[#8b7e70]'}`}>
                Umumiy
            </button>
        )}
    </div>
);

const SalesLine = ({ points, name, color }: { points: SalesPoint[]; name: string; color: string }) => {
    const option: EChartsOption = {
        tooltip: { trigger: 'axis', renderMode: 'richText', valueFormatter: (value) => formatPrice(Number(value)) },
        grid: { left: 12, right: 18, top: 24, bottom: 12, containLabel: true },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: points.map((point) => point.label ?? point.createdAt),
            axisLabel: { color: '#8b7e70' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#8b7e70', formatter: compactAmount },
            splitLine: { lineStyle: { color: '#eadfce', type: 'dashed' } }
        },
        series: [
            {
                name,
                type: 'line',
                data: points.map((point) => point.amount),
                symbolSize: 7,
                lineStyle: { color, width: 3 },
                itemStyle: { color },
                areaStyle: { color, opacity: 0.12 }
            }
        ]
    };
    return <ReactECharts option={option} notMerge style={{ height: 290, width: '100%' }} />;
};

const ChartError = ({ message, retry }: { message: string; retry: () => void }) => (
    <div role='alert' className='my-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-200'>
        <p>{message}</p>
        <button type='button' onClick={retry} className='mt-2 font-bold underline'>
            Qayta urinish
        </button>
    </div>
);
const LoadingChart = () => (
    <div role='status' className='grid h-72 place-items-center text-sm text-[#8b7e70]'>
        Savdo yuklanmoqda…
    </div>
);

const SiteSalesChart = () => {
    const [period, setPeriod] = useState<SalesPeriod | 'all'>('weekly');
    const query = useQuery({
        queryKey: ['dashboard', 'site-sales'],
        queryFn: ({ signal }) => fetchSiteSales(signal),
        staleTime: 60_000
    });
    const points = useMemo(() => {
        const sales = (query.data ?? []).filter(isOrderRevenueEligible).map((order) => ({
            amount: Number(order.totalAmount),
            createdAt: order.createdAt
        }));
        if (period === 'all') return getAllTimeSalesPoints(sales);
        const buckets = getSalesBuckets(period);
        sales.forEach((sale) => addSaleToBuckets(buckets, sale));
        return toSalesPoints(buckets);
    }, [period, query.data]);
    const total = points.reduce((sum, point) => sum + point.amount, 0);
    return (
        <section className={cardClass} aria-label='Sayt savdosi'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <h2 className='text-lg font-black text-[#2f2a25] dark:text-white'>Sayt savdosi</h2>
                <PeriodSelect value={period} onChange={setPeriod} onAllTime={() => setPeriod('all')} />
            </div>
            <p className='mt-5 text-xs font-bold text-[#8b7e70]'>
                {period === 'all' ? 'Barcha davr bo‘yicha jami · Oylar kesimida' : 'Tanlangan davr bo‘yicha jami'}
            </p>
            <p className='mt-1 text-2xl font-black text-[#4f73f6]'>
                {query.isLoading ? 'Yuklanmoqda…' : query.isError ? '—' : formatPrice(total)}
            </p>
            {query.isError ? (
                <ChartError message='Sayt savdosini yuklab bo‘lmadi.' retry={() => void query.refetch()} />
            ) : query.isLoading ? (
                <LoadingChart />
            ) : (
                <>
                    <SalesLine points={points} name='Sayt savdosi' color='#4f73f6' />
                    {total === 0 && <p className='text-sm text-[#8b7e70]'>Bu davrda sayt savdosi mavjud emas.</p>}
                </>
            )}
        </section>
    );
};

const MoyskladSalesChart = () => {
    const [period, setPeriod] = useState<SalesPeriod>('weekly');
    const [branchId, setBranchId] = useState('all');
    const query = useQuery({
        queryKey: ['dashboard', 'moysklad-sales', 'selected-branches', period],
        queryFn: ({ signal }) => fetchMoyskladSales(period, signal),
        staleTime: 60_000,
        retry: false
    });
    const branches = query.data?.branches ?? [];
    const selectedBranch = branches.find((branch) => branch.id === branchId);
    const points = selectedBranch?.sales ?? query.data?.sales ?? [];
    const total = points.reduce((sum, point) => sum + point.amount, 0);
    const comparison: EChartsOption = {
        tooltip: { trigger: 'axis', renderMode: 'richText', valueFormatter: (value) => formatPrice(Number(value)) },
        grid: { left: 8, right: 28, top: 10, bottom: 20, containLabel: true },
        xAxis: {
            type: 'value',
            axisLabel: { color: '#8b7e70', formatter: compactAmount },
            splitLine: { lineStyle: { color: '#eadfce', type: 'dashed' } }
        },
        yAxis: {
            type: 'category',
            inverse: true,
            data: branches.map((branch) => branch.name),
            axisLabel: { color: '#8b7e70', width: 135, overflow: 'truncate', interval: 0 }
        },
        series: [
            {
                name: 'Filial savdosi',
                type: 'bar',
                barMaxWidth: 24,
                data: branches.map((branch) => ({
                    value: branch.amount,
                    itemStyle: {
                        color: branch.id === selectedBranch?.id ? '#ef7f1a' : '#43a27a',
                        borderRadius: [0, 5, 5, 0]
                    }
                }))
            }
        ]
    };
    return (
        <section className={cardClass} aria-label='MoySklad savdosi'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <h2 className='text-lg font-black text-[#2f2a25] dark:text-white'>MoySklad savdosi</h2>
                <PeriodSelect value={period} onChange={setPeriod} />
            </div>
            <label className='mt-4 block text-xs font-bold text-[#8b7e70]'>
                Filial
                <select
                    value={selectedBranch?.id ?? 'all'}
                    onChange={(event) => setBranchId(event.target.value)}
                    disabled={query.isLoading || query.isError}
                    className='mt-1 block w-full rounded-xl border border-[#eadfce] bg-white p-3 text-sm text-[#2f2a25] dark:border-slate-800 dark:bg-slate-900 dark:text-white'>
                    <option value='all'>Barcha filiallar</option>
                    {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name}
                        </option>
                    ))}
                </select>
            </label>
            <p className='mt-5 text-xs font-bold text-[#8b7e70]'>
                {selectedBranch?.name ?? 'Barcha filiallar'} · Tanlangan davr bo‘yicha jami
            </p>
            <p className='mt-1 text-2xl font-black text-[#43a27a]'>
                {query.isLoading ? 'Yuklanmoqda…' : query.isError ? '—' : formatPrice(total)}
            </p>
            {query.data?.message && !query.isError && (
                <p role='status' className='mt-2 text-sm text-amber-700 dark:text-amber-300'>
                    {query.data.message}
                </p>
            )}
            {query.isError ? (
                <ChartError message={query.error.message} retry={() => void query.refetch()} />
            ) : query.isLoading ? (
                <LoadingChart />
            ) : (
                <>
                    <SalesLine points={points} name={selectedBranch?.name ?? 'MoySklad savdosi'} color='#43a27a' />
                    {total === 0 && <p className='text-sm text-[#8b7e70]'>Bu davrda savdo mavjud emas.</p>}
                    {branches.length > 0 && (
                        <div className='mt-5 border-t border-[#eadfce] pt-5 dark:border-slate-800'>
                            <h3 className='font-bold text-[#2f2a25] dark:text-white'>Filiallar bo‘yicha savdo</h3>
                            <p className='mt-1 text-xs text-[#8b7e70]'>
                                Filial grafigini ko‘rish uchun uning ustunini yoki nomini tanlang.
                            </p>
                            <div className='mt-3 max-h-96 overflow-y-auto'>
                                <ReactECharts
                                    option={comparison}
                                    notMerge
                                    style={{ height: Math.max(220, branches.length * 42 + 50), width: '100%' }}
                                    onEvents={{
                                        click: (event: { componentType?: string; dataIndex: number }) => {
                                            if (event.componentType === 'series' && branches[event.dataIndex])
                                                setBranchId(branches[event.dataIndex].id);
                                        }
                                    }}
                                />
                            </div>
                            <div className='mt-3 grid max-h-60 gap-2 overflow-y-auto sm:grid-cols-2'>
                                {branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        type='button'
                                        aria-pressed={selectedBranch?.id === branch.id}
                                        onClick={() => setBranchId(branch.id)}
                                        className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left text-xs ${selectedBranch?.id === branch.id ? 'border-orange-400 bg-orange-50 dark:bg-orange-950' : 'border-[#eadfce] dark:border-slate-800'}`}>
                                        <span className='min-w-0 font-bold break-words'>{branch.name}</span>
                                        <span className='shrink-0'>{formatPrice(branch.amount)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default function DashboardChart() {
    return (
        <div className='grid items-start gap-6 xl:grid-cols-2'>
            <SiteSalesChart />
            <MoyskladSalesChart />
        </div>
    );
}
