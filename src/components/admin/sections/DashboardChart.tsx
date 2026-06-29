'use client';

import { useMemo, useState } from 'react';

import { api } from '@/components/admin/services/api';
import { formatPrice } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';

import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

type ChartPeriod = 'weekly' | 'monthly';
type ChartView = 'summary' | 'branches';

type SaleRecord = {
    amount: number;
    createdAt: string;
};

type BranchSale = {
    name: string;
    amount: number;
};

type MoyskladSalesResult = {
    sales: SaleRecord[];
    branches: BranchSale[];
    message?: string;
};

type ChartPoint = {
    label: string;
    start: Date;
    end: Date;
    site: number;
    moysklad: number;
};

const periodOptions: Array<{ value: ChartPeriod; label: string }> = [
    { value: 'weekly', label: 'Haftalik' },
    { value: 'monthly', label: 'Oylik' }
];

const viewOptions: Array<{ value: ChartView; label: string }> = [
    { value: 'summary', label: 'Umumiy' },
    { value: 'branches', label: 'Filiallar' }
];

const monthLabels = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
const excludedBranchNames = ['solnechniy', 'yoshlar matbuoti', 'yangi asr avlodi'];

const isExcludedBranch = (name: string) =>
    excludedBranchNames.some((excludedName) => name.trim().toLowerCase().includes(excludedName));

const toDateKey = (date: Date) =>
    date.toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit'
    });

const toMonthKey = (date: Date) => monthLabels[date.getMonth()];

const getPeriodBuckets = (period: ChartPeriod): ChartPoint[] => {
    const today = new Date();

    if (period === 'weekly') {
        return Array.from({ length: 7 }, (_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - index));
            const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

            return {
                label: toDateKey(start),
                start,
                end,
                site: 0,
                moysklad: 0
            };
        });
    }

    return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        return {
            label: toMonthKey(start),
            start,
            end,
            site: 0,
            moysklad: 0
        };
    });
};

const getNestedArray = (value: any): any[] => {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return getNestedArray(value.data);
    if (Array.isArray(value?.data?.data)) return getNestedArray(value.data.data);
    if (Array.isArray(value?.orders)) return value.orders;
    if (Array.isArray(value?.rows)) return value.rows;
    if (Array.isArray(value?.items)) return value.items;
    if (Array.isArray(value?.demands)) return value.demands;

    return [];
};

const getSaleDate = (item: any) => item?.createdAt || item?.moment || item?.date || item?.updatedAt || '';

const getSaleAmount = (item: any, source: 'site' | 'moysklad') => {
    const value = Number(item?.totalAmount ?? item?.amount ?? item?.total ?? item?.sum ?? item?.sales ?? 0);

    if (!Number.isFinite(value)) return 0;
    if (source === 'moysklad' && item?.sum !== undefined) return value / 100;

    return value;
};

const normalizeSales = (response: any, source: 'site' | 'moysklad'): SaleRecord[] =>
    getNestedArray(response)
        .map((item) => ({
            amount: getSaleAmount(item, source),
            createdAt: getSaleDate(item)
        }))
        .filter((item) => item.amount > 0 && Boolean(item.createdAt));

const fetchSiteSales = async () => {
    const firstResponse = await api.get('/admin/orders', {
        params: { page: 1, limit: 100 }
    });
    const firstData = firstResponse.data.data;
    const firstOrders = normalizeSales(firstData, 'site');
    const totalPages = Number(firstData?.pagination?.pages ?? 1);

    if (totalPages <= 1) return firstOrders;

    const restResponses = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
            api.get('/admin/orders', {
                params: { page: index + 2, limit: 100 }
            })
        )
    );

    return [...firstOrders, ...restResponses.flatMap((response) => normalizeSales(response.data.data, 'site'))];
};

const fetchMoyskladSales = async (period: ChartPeriod, view: ChartView): Promise<MoyskladSalesResult> => {
    try {
        const response = await fetch(`/api/moysklad/sales?period=${period}&mode=${view}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            return {
                sales: [],
                branches: [],
                message: errorData?.message || "MoySklad ma'lumotlarini olishda xatolik"
            };
        }

        const data = await response.json();
        return {
            sales: normalizeSales(data?.sales ?? data, 'moysklad'),
            branches: Array.isArray(data?.branches) ? data.branches : [],
            message: data?.message
        };
    } catch {
        return {
            sales: [],
            branches: [],
            message: "MoySklad ma'lumotlarini olishda xatolik"
        };
    }
};

const addSalesToBuckets = (buckets: ChartPoint[], sales: SaleRecord[], key: 'site' | 'moysklad') => {
    sales.forEach((sale) => {
        const saleDate = new Date(sale.createdAt);
        if (Number.isNaN(saleDate.getTime())) return;

        const bucket = buckets.find((item) => saleDate >= item.start && saleDate < item.end);
        if (bucket) bucket[key] += sale.amount;
    });
};

const DashboardChart = () => {
    const [period, setPeriod] = useState<ChartPeriod>('weekly');
    const [view, setView] = useState<ChartView>('summary');
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard', 'sales-chart', period, view],
        queryFn: async () => {
            const [siteSales, moyskladResult] = await Promise.all([fetchSiteSales(), fetchMoyskladSales(period, view)]);

            return {
                siteSales,
                moyskladSales: moyskladResult.sales,
                branchSales: moyskladResult.branches,
                moyskladMessage: moyskladResult.message
            };
        }
    });

    const chartData = useMemo(() => {
        const buckets = getPeriodBuckets(period);

        addSalesToBuckets(buckets, data?.siteSales ?? [], 'site');
        addSalesToBuckets(buckets, data?.moyskladSales ?? [], 'moysklad');

        return buckets;
    }, [data?.moyskladSales, data?.siteSales, period]);

    const siteTotal = chartData.reduce((sum, item) => sum + item.site, 0);
    const moyskladTotal = chartData.reduce((sum, item) => sum + item.moysklad, 0);
    const branchData = (data?.branchSales ?? []).filter((item) => !isExcludedBranch(item.name)).slice(0, 12);
    const maxValue = Math.max(
        ...(view === 'branches'
            ? branchData.map((item) => item.amount)
            : chartData.flatMap((item) => [item.site, item.moysklad])),
        1
    );
    const roundedMax = Math.ceil(maxValue / 1_000_000) * 1_000_000;

    const commonAxisStyle = {
        axisLine: {
            lineStyle: {
                color: '#4b5563'
            }
        },
        axisTick: {
            show: false
        }
    };

    const branchOption = {
        animation: true,
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => formatPrice(Number(value))
        },
        legend: {
            top: 0,
            right: 8,
            data: ['Filial savdosi']
        },
        grid: {
            left: 190,
            right: 32,
            top: 52,
            bottom: 44
        },
        xAxis: {
            type: 'value',
            axisLine: commonAxisStyle.axisLine,
            axisTick: commonAxisStyle.axisTick,
            axisLabel: {
                color: '#4b5563',
                formatter: (value: number) => `${Math.round(value / 1_000_000)}M`
            },
            splitLine: {
                lineStyle: {
                    color: '#d7dde6'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: branchData.map((item) => item.name),
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#4b5563',
                width: 170,
                overflow: 'truncate'
            }
        },
        series: [
            {
                name: 'Filial savdosi',
                type: 'bar',
                data: branchData.map((item) => item.amount),
                itemStyle: {
                    color: '#4f73f6'
                },
                barMaxWidth: 24
            }
        ]
    } as EChartsOption;

    const summaryOption = {
        animation: true,
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => formatPrice(Number(value))
        },
        legend: {
            top: 0,
            right: 8,
            data: ['Sayt savdosi', 'MoySklad savdosi']
        },
        grid: {
            left: 48,
            right: 32,
            top: 52,
            bottom: 44
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.map((item) => item.label),
            axisLine: commonAxisStyle.axisLine,
            axisTick: commonAxisStyle.axisTick,
            axisLabel: {
                color: '#4b5563'
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: roundedMax,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#4b5563',
                formatter: (value: number) => `${Math.round(value / 1_000_000)}M`
            },
            splitLine: {
                lineStyle: {
                    color: '#d7dde6'
                }
            }
        },
        series: [
            {
                name: 'MoySklad savdosi',
                type: 'line',
                data: chartData.map((item) => item.moysklad),
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 2,
                    color: '#b6e018'
                },
                itemStyle: {
                    color: '#ffffff',
                    borderColor: '#b6e018',
                    borderWidth: 2
                },
                areaStyle: {
                    color: 'rgba(182, 224, 24, 0.42)'
                },
                z: 1
            },
            {
                name: 'Sayt savdosi',
                type: 'line',
                data: chartData.map((item) => item.site),
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 2,
                    color: '#4f73f6'
                },
                itemStyle: {
                    color: '#ffffff',
                    borderColor: '#4f73f6',
                    borderWidth: 2
                },
                areaStyle: {
                    color: 'rgba(78, 111, 226, 0.68)'
                },
                z: 2
            }
        ]
    } as EChartsOption;

    const option = view === 'branches' ? branchOption : summaryOption;

    return (
        <section className='mt-14 bg-white p-4 dark:bg-slate-950'>
            <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                <div>
                    <h2 className='text-lg font-black text-[#2f2a25] dark:text-white'>Savdo tahlili</h2>
                    {data?.moyskladMessage ? (
                        <p className='text-xs font-bold text-red-500'>{data.moyskladMessage}</p>
                    ) : null}
                </div>
                <div className='flex flex-wrap gap-2'>
                    <div className='inline-flex rounded-xl bg-[#f2e7d8] p-1 dark:bg-slate-900'>
                        {viewOptions.map((option) => (
                            <button
                                key={option.value}
                                type='button'
                                onClick={() => setView(option.value)}
                                className={`rounded-lg px-3 py-2 text-xs font-black transition ${
                                    view === option.value
                                        ? 'bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-800 dark:text-orange-300'
                                        : 'text-[#8b7e70] hover:text-[#ef7f1a] dark:text-slate-400'
                                }`}>
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <div className='inline-flex rounded-xl bg-[#f2e7d8] p-1 dark:bg-slate-900'>
                        {periodOptions.map((option) => (
                            <button
                                key={option.value}
                                type='button'
                                onClick={() => setPeriod(option.value)}
                                className={`rounded-lg px-3 py-2 text-xs font-black transition ${
                                    period === option.value
                                        ? 'bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-800 dark:text-orange-300'
                                        : 'text-[#8b7e70] hover:text-[#ef7f1a] dark:text-slate-400'
                                }`}>
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className='mb-4 grid gap-3 sm:grid-cols-2'>
                <div className='rounded-2xl bg-[#f2e7d8] p-4 dark:bg-slate-900'>
                    <p className='text-xs font-black text-[#8b7e70] uppercase dark:text-slate-400'>Sayt jami</p>
                    <p className='mt-1 text-xl font-black text-[#2f2a25] dark:text-white'>{formatPrice(siteTotal)}</p>
                </div>
                <div className='rounded-2xl bg-[#f2e7d8] p-4 dark:bg-slate-900'>
                    <p className='text-xs font-black text-[#8b7e70] uppercase dark:text-slate-400'>MoySklad jami</p>
                    <p className='mt-1 text-xl font-black text-[#2f2a25] dark:text-white'>
                        {formatPrice(moyskladTotal)}
                    </p>
                </div>
            </div>
            <ReactECharts showLoading={isLoading} option={option} notMerge style={{ height: 300, width: '100%' }} />
        </section>
    );
};

export default DashboardChart;
