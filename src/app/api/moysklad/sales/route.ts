import { NextRequest, NextResponse } from 'next/server';

type MoyskladRow = {
    id?: string;
    moment?: string;
    created?: string;
    updated?: string;
    sum?: number;
    store?: {
        name?: string;
        meta?: {
            href?: string;
        };
    };
    retailStore?: {
        name?: string;
        meta?: {
            href?: string;
        };
    };
};

type ChartPeriod = 'weekly' | 'monthly';
type SalesMode = 'summary' | 'branches';

type DateRangeBucket = {
    start: Date;
    end: Date;
};

type MoyskladNamedEntity = {
    name?: string;
    meta?: {
        href?: string;
    };
};

const MOYSKLAD_API_URL = 'https://api.moysklad.ru/api/remap/1.2';
const MOYSKLAD_REQUEST_TIMEOUT = 25_000;
const MOYSKLAD_PAGE_TIMEOUT = 8_000;
const EXCLUDED_BRANCH_NAMES = ['solnechniy', 'yoshlar matbuoti', 'yangi asr avlodi'];

const isChartPeriod = (value: string | null): value is ChartPeriod => value === 'weekly' || value === 'monthly';
const isSalesMode = (value: string | null): value is SalesMode => value === 'summary' || value === 'branches';

const formatMoyskladDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getDateRange = (period: ChartPeriod) => {
    const today = new Date();

    if (period === 'weekly') {
        return {
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        };
    }

    return {
        start: new Date(today.getFullYear(), today.getMonth() - 5, 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 1)
    };
};

const getDateRangeBuckets = (period: ChartPeriod, mode: SalesMode): DateRangeBucket[] => {
    const today = new Date();

    if (period === 'weekly') {
        return Array.from({ length: 7 }, (_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - (6 - index));

            return {
                start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            };
        });
    }

    if (mode === 'branches') {
        return [
            {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: new Date(today.getFullYear(), today.getMonth() + 1, 1)
            }
        ];
    }

    return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);

        return {
            start: new Date(date.getFullYear(), date.getMonth(), 1),
            end: new Date(date.getFullYear(), date.getMonth() + 1, 1)
        };
    });
};

const fetchMoyskladRows = async (
    entity: 'demand' | 'retaildemand',
    token: string,
    start: Date,
    end: Date,
    options?: { allowPartial?: boolean }
) => {
    const rows: MoyskladRow[] = [];
    let offset = 0;
    const limit = 1000;
    const deadline = Date.now() + MOYSKLAD_REQUEST_TIMEOUT;
    let partial = false;

    while (true) {
        if (Date.now() > deadline) {
            if (options?.allowPartial) {
                partial = true;
                break;
            }

            throw new Error(`MoySklad ${entity} request timeout`);
        }

        const params = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
            order: 'moment,asc',
            expand: entity === 'retaildemand' ? 'store,retailStore' : 'store',
            filter: `moment>=${formatMoyskladDate(start)};moment<${formatMoyskladDate(end)}`
        });
        let response: Response | null = null;

        for (let attempt = 0; attempt < 4; attempt += 1) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), MOYSKLAD_PAGE_TIMEOUT);

            try {
                response = await fetch(`${MOYSKLAD_API_URL}/entity/${entity}?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json;charset=utf-8',
                        'Accept-Encoding': 'gzip'
                    },
                    cache: 'no-store',
                    signal: controller.signal
                });
            } catch (error) {
                if (options?.allowPartial) {
                    partial = true;
                    response = null;
                    break;
                }

                throw error;
            } finally {
                clearTimeout(timeoutId);
            }

            if (response.status !== 429) break;

            const retryAfter = Number(response.headers.get('Retry-After'));
            await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1200 * (attempt + 1));
        }

        if (!response || !response.ok) {
            if (options?.allowPartial && rows.length) {
                partial = true;
                break;
            }

            throw new Error(`MoySklad ${entity} request failed: ${response?.status ?? 'unknown'}`);
        }

        const data = await response.json();
        const nextRows = Array.isArray(data?.rows) ? data.rows : [];

        rows.push(...nextRows);

        if (nextRows.length < limit) break;
        offset += limit;
    }

    return { rows, partial };
};

const addRowToBuckets = (buckets: Array<DateRangeBucket & { amount: number }>, row: MoyskladRow) => {
    const date = new Date(row.moment || row.created || row.updated || '');
    if (Number.isNaN(date.getTime())) return;

    const bucket = buckets.find((item) => date >= item.start && date < item.end);
    if (bucket) bucket.amount += Number(row.sum ?? 0) / 100;
};

const fetchMoyskladNameMap = async (entity: 'store' | 'retailstore', token: string) => {
    const map = new Map<string, string>();
    let offset = 0;
    const limit = 1000;

    while (true) {
        const params = new URLSearchParams({
            limit: String(limit),
            offset: String(offset)
        });
        const response = await fetch(`${MOYSKLAD_API_URL}/entity/${entity}?${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json;charset=utf-8',
                'Accept-Encoding': 'gzip'
            },
            cache: 'no-store'
        });

        if (!response.ok) break;

        const data = await response.json();
        const rows: MoyskladNamedEntity[] = Array.isArray(data?.rows) ? data.rows : [];

        rows.forEach((row) => {
            if (row.meta?.href && row.name) map.set(row.meta.href, row.name);
        });

        if (rows.length < limit) break;
        offset += limit;
    }

    return map;
};

const getBranchName = (row: MoyskladRow, storeNames: Map<string, string>, retailStoreNames: Map<string, string>) =>
    row.retailStore?.name ||
    (row.retailStore?.meta?.href ? retailStoreNames.get(row.retailStore.meta.href) : '') ||
    row.store?.name ||
    (row.store?.meta?.href ? storeNames.get(row.store.meta.href) : '') ||
    "Noma'lum filial";

const isExcludedBranch = (name: string) =>
    EXCLUDED_BRANCH_NAMES.some((excludedName) => name.trim().toLowerCase().includes(excludedName));

const getBranchSales = (rows: MoyskladRow[], storeNames: Map<string, string>, retailStoreNames: Map<string, string>) => {
    const totals = new Map<string, number>();

    rows.forEach((row) => {
        const branchName = getBranchName(row, storeNames, retailStoreNames);
        if (isExcludedBranch(branchName)) return;

        const amount = Number(row.sum ?? 0) / 100;

        totals.set(branchName, (totals.get(branchName) ?? 0) + amount);
    });

    return [...totals.entries()]
        .map(([name, amount]) => ({ name, amount }))
        .sort((first, second) => second.amount - first.amount);
};

export async function GET(request: NextRequest) {
    const periodParam = request.nextUrl.searchParams.get('period');
    const period: ChartPeriod = isChartPeriod(periodParam) ? periodParam : 'monthly';
    const modeParam = request.nextUrl.searchParams.get('mode');
    const mode: SalesMode = isSalesMode(modeParam) ? modeParam : 'summary';
    const token = process.env.MOYSKLAD_TOKEN || process.env.MOYSKLAD_API_TOKEN;

    if (!token) {
        return NextResponse.json({
            success: false,
            message: 'MOYSKLAD_TOKEN env variable is not configured',
            sales: []
        });
    }

    try {
        const buckets = getDateRangeBuckets(period, mode).map((bucket) => ({ ...bucket, amount: 0 }));
        const start = buckets[0].start;
        const end = buckets[buckets.length - 1].end;
        const allowPartial = period === 'monthly' && mode === 'branches';
        const demandResult = await fetchMoyskladRows('demand', token, start, end, { allowPartial });
        await wait(500);
        const retailDemandResult = await fetchMoyskladRows('retaildemand', token, start, end, { allowPartial });
        const [storeNames, retailStoreNames] = await Promise.all([
            fetchMoyskladNameMap('store', token),
            fetchMoyskladNameMap('retailstore', token)
        ]);
        const demands = demandResult.rows;
        const retailDemands = retailDemandResult.rows;
        const isPartial = demandResult.partial || retailDemandResult.partial;

        [...demands, ...retailDemands].forEach((row) => addRowToBuckets(buckets, row));

        const branches = getBranchSales([...demands, ...retailDemands], storeNames, retailStoreNames);
        const sales = buckets.map((bucket) => ({
            amount: bucket.amount,
            createdAt: bucket.start.toISOString()
        }));

        return NextResponse.json({
            success: true,
            sales,
            branches,
            totalAmount: sales.reduce((sum, item) => sum + item.amount, 0),
            message: isPartial ? "MoySklad ma'lumotlari ko'p bo'lgani uchun qisman yuklandi" : undefined
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'MoySklad sales request failed',
            sales: []
        });
    }
}
