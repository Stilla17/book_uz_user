import { NextRequest, NextResponse } from 'next/server';

import { SALES_BRANCHES, findSalesBranch } from '@/data/sales-branches';
import {
    type BranchSales,
    type SalesBucket,
    addSaleToBuckets,
    getSalesBuckets,
    toSalesPoints
} from '@/utils/sales-chart';

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

type ChartPeriod = import('@/utils/sales-chart').SalesPeriod;

type MoyskladNamedEntity = {
    name?: string;
    meta?: {
        href?: string;
    };
};

const MOYSKLAD_API_URL = 'https://api.moysklad.ru/api/remap/1.2';
const MOYSKLAD_REQUEST_TIMEOUT = 25_000;
const MOYSKLAD_PAGE_TIMEOUT = 8_000;
const SALES_CACHE_TTL = 15 * 60 * 1000;
const SALES_STALE_TTL = 24 * 60 * 60 * 1000;
const CIRCUIT_BREAKER_TTL = 5 * 60 * 1000;
const STORE_NAMES_CACHE_TTL = 6 * 60 * 60 * 1000;

type MoyskladSalesPayload = {
    success: true;
    sales: ReturnType<typeof toSalesPoints>;
    branches: BranchSales[];
    partial: boolean;
    totalAmount: number;
    message?: string;
};

type SalesCacheEntry = {
    data: MoyskladSalesPayload;
    cachedAt: number;
    expiresAt: number;
};

const salesCache = new Map<ChartPeriod, SalesCacheEntry>();
const inFlightRequests = new Map<ChartPeriod, Promise<MoyskladSalesPayload>>();
let circuitOpenUntil = 0;
let storeNamesCache:
    | { storeNames: Map<string, string>; retailStoreNames: Map<string, string>; expiresAt: number }
    | undefined;
let storeNamesRequest: Promise<{ storeNames: Map<string, string>; retailStoreNames: Map<string, string> }> | undefined;

const isChartPeriod = (value: string | null): value is ChartPeriod =>
    value === 'weekly' || value === 'current-month' || value === 'monthly';

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

        for (let attempt = 0; attempt < 2; attempt += 1) {
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
            cache: 'no-store',
            signal: AbortSignal.timeout(MOYSKLAD_PAGE_TIMEOUT)
        });

        if (!response.ok) throw new Error(`MoySklad ${entity} request failed: ${response.status}`);

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

const getCachedStoreNames = async (token: string) => {
    if (storeNamesCache && storeNamesCache.expiresAt > Date.now()) return storeNamesCache;
    if (!storeNamesRequest) {
        storeNamesRequest = Promise.all([
            fetchMoyskladNameMap('store', token),
            fetchMoyskladNameMap('retailstore', token)
        ]).then(([storeNames, retailStoreNames]) => ({ storeNames, retailStoreNames }));
    }

    try {
        const names = await storeNamesRequest;
        storeNamesCache = { ...names, expiresAt: Date.now() + STORE_NAMES_CACHE_TTL };
        return storeNamesCache;
    } finally {
        storeNamesRequest = undefined;
    }
};

const getBranchSales = (
    rows: MoyskladRow[],
    storeNames: Map<string, string>,
    retailStoreNames: Map<string, string>,
    buckets: SalesBucket[]
): BranchSales[] => {
    const branches = new Map<string, { name: string; buckets: SalesBucket[] }>();
    const ensureBranch = (id: string, name: string) => {
        if (!branches.has(id)) branches.set(id, { name, buckets: buckets.map((bucket) => ({ ...bucket, amount: 0 })) });
        return branches.get(id)!;
    };
    SALES_BRANCHES.forEach((branch) => ensureBranch(branch.id, branch.name));
    rows.forEach((row) => {
        const storeId = row.store?.meta?.href;
        const retailId = row.retailStore?.meta?.href;
        const branch =
            findSalesBranch(storeId, row.store?.name || (storeId ? storeNames.get(storeId) : '')) ||
            findSalesBranch(retailId, row.retailStore?.name || (retailId ? retailStoreNames.get(retailId) : ''));
        if (!branch) return;
        addSaleToBuckets(ensureBranch(branch.id, branch.name).buckets, {
            amount: Number(row.sum ?? 0) / 100,
            createdAt: row.moment || row.created || row.updated || ''
        });
    });
    return [...branches].map(([id, branch]) => ({
        id,
        name: branch.name,
        sales: toSalesPoints(branch.buckets),
        amount: branch.buckets.reduce((sum, bucket) => sum + bucket.amount, 0)
    }));
};

const loadMoyskladSales = async (period: ChartPeriod, token: string): Promise<MoyskladSalesPayload> => {
    const buckets = getSalesBuckets(period);
    const start = buckets[0].start;
    const end = buckets[buckets.length - 1].end;
    const allowPartial = period !== 'weekly';
    const demandResult = await fetchMoyskladRows('demand', token, start, end, { allowPartial });
    await wait(500);
    const retailDemandResult = await fetchMoyskladRows('retaildemand', token, start, end, { allowPartial });
    const { storeNames, retailStoreNames } = await getCachedStoreNames(token);
    const isPartial = demandResult.partial || retailDemandResult.partial;
    const branches = getBranchSales(
        [...demandResult.rows, ...retailDemandResult.rows],
        storeNames,
        retailStoreNames,
        buckets
    );
    const sales = toSalesPoints(buckets).map((sale, index) => ({
        ...sale,
        amount: branches.reduce((sum, branch) => sum + branch.sales[index].amount, 0)
    }));

    return {
        success: true,
        sales,
        branches,
        partial: isPartial,
        totalAmount: sales.reduce((sum, item) => sum + item.amount, 0),
        message: isPartial ? "MoySklad ma'lumotlari ko'p bo'lgani uchun qisman yuklandi" : undefined
    };
};

const jsonResponse = (data: MoyskladSalesPayload, cacheStatus: 'HIT' | 'MISS' | 'STALE') =>
    NextResponse.json(data, {
        headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=86400',
            'X-Moysklad-Cache': cacheStatus
        }
    });

export async function GET(request: NextRequest) {
    const periodParam = request.nextUrl.searchParams.get('period');
    const period: ChartPeriod = isChartPeriod(periodParam) ? periodParam : 'monthly';
    const token = process.env.MOYSKLAD_TOKEN || process.env.MOYSKLAD_API_TOKEN;

    if (!token) {
        return NextResponse.json(
            {
                success: false,
                message: 'MoySklad ulanishi sozlanmagan',
                sales: []
            },
            { status: 503 }
        );
    }

    const now = Date.now();
    const cached = salesCache.get(period);
    if (cached && cached.expiresAt > now) return jsonResponse(cached.data, 'HIT');

    if (circuitOpenUntil > now) {
        if (cached && now - cached.cachedAt < SALES_STALE_TTL) {
            return jsonResponse(
                { ...cached.data, message: 'MoySklad vaqtincha cheklangan. Oxirgi saqlangan ma’lumot ko‘rsatildi.' },
                'STALE'
            );
        }
        return NextResponse.json(
            { success: false, message: 'MoySklad vaqtincha cheklangan. Keyinroq qayta urinib ko‘ring.', sales: [] },
            { status: 503, headers: { 'Retry-After': String(Math.ceil((circuitOpenUntil - now) / 1000)) } }
        );
    }

    try {
        let requestPromise = inFlightRequests.get(period);
        if (!requestPromise) {
            requestPromise = loadMoyskladSales(period, token);
            inFlightRequests.set(period, requestPromise);
        }
        const data = await requestPromise;
        salesCache.set(period, { data, cachedAt: now, expiresAt: now + SALES_CACHE_TTL });
        circuitOpenUntil = 0;
        return jsonResponse(data, 'MISS');
    } catch (error) {
        circuitOpenUntil = Date.now() + CIRCUIT_BREAKER_TTL;
        if (cached && Date.now() - cached.cachedAt < SALES_STALE_TTL) {
            return jsonResponse(
                { ...cached.data, message: 'MoySklad javob bermadi. Oxirgi saqlangan ma’lumot ko‘rsatildi.' },
                'STALE'
            );
        }
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'MoySklad sales request failed',
                sales: []
            },
            { status: 502 }
        );
    } finally {
        inFlightRequests.delete(period);
    }
}
