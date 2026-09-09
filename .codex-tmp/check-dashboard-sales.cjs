const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const compile = (file, extra = '') => ts.transpileModule(fs.readFileSync(file, 'utf8') + extra, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const load = (file) => {
    const context = { exports: {} };
    vm.runInNewContext(compile(file), context);
    return context.exports;
};
const utils = load('src/utils/sales-chart.ts');
const branchConfig = load('src/data/sales-branches.ts');
const orders = load('src/utils/order.ts');
const today = new Date();
const current = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12).toISOString();
const old = new Date(today.getFullYear(), today.getMonth() - 5, 15, 12).toISOString();
const stores = [
    ...branchConfig.SALES_BRANCHES.map((branch, index) => ({ name: `${index + 1} ${branch.name}`, meta: { href: `store/${branch.id}` } })),
    { name: '0 Book.uz sklad', meta: { href: 'store/excluded' } }
];
const makeRow = (sum, storeIndex, moment = current) => ({ sum, moment, store: stores[storeIndex] });
let mode = 'normal';
const route = { exports: {}, URLSearchParams, AbortController, AbortSignal, setTimeout, clearTimeout,
    process: { env: { MOYSKLAD_TOKEN: 'mock-token' } },
    require: (id) => {
        if (id === '@/utils/sales-chart') return utils;
        if (id === '@/data/sales-branches') return branchConfig;
        if (id === 'next/server') return { NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) } };
        throw new Error(`Unexpected import ${id}`);
    },
    fetch: async (url) => {
        if (mode === 'error') throw new Error('upstream offline');
        const parsed = new URL(url);
        const entity = parsed.pathname.split('/').pop();
        let rows;
        if (entity === 'store') rows = stores;
        if (entity === 'retailstore') rows = [];
        if (entity === 'demand') {
            if (mode === 'partial') {
                if (Number(parsed.searchParams.get('offset')) > 0) throw new Error('second page unavailable');
                rows = Array.from({ length: 1000 }, () => makeRow(100, 0));
            } else rows = [makeRow(10000, 0), makeRow(20000, 1), makeRow(30000, 0, old), makeRow(900, 0, 'invalid'), makeRow(99999900, 8)];
        }
        if (entity === 'retaildemand') rows = [
            { ...makeRow(5000, 0), retailStore: { name: 'Retail register', meta: { href: 'retail/1' } } },
            { sum: 2500, moment: current, retailStore: { name: 'Retail-only branch', meta: { href: 'retail/2' } } }
        ];
        return { ok: true, status: 200, headers: new Headers(), json: async () => ({ rows }) };
    }
};
vm.runInNewContext(compile('src/app/api/moysklad/sales/route.ts'), route);
const get = (period) => route.exports.GET({ nextUrl: new URL(`http://localhost/api/moysklad/sales?period=${period}`) });
(async () => {
    const weekly = await get('weekly');
    assert.equal(weekly.status, 200);
    assert.equal(weekly.body.sales.length, 7);
    assert.equal(weekly.body.branches.length, 8);
    assert.equal(weekly.body.totalAmount, 350);
    assert.equal(weekly.body.branches[0].amount, 150);
    assert.equal(weekly.body.branches[7].amount, 0);
    assert.equal(JSON.stringify(weekly.body.branches.map((b) => b.name)), JSON.stringify(branchConfig.SALES_BRANCHES.map((b) => b.name)));
    assert.equal(branchConfig.findSalesBranch(undefined, '3 Toshkent - Qoraqamish').name, 'Toshkent - Qoramish');
    assert.equal(branchConfig.findSalesBranch(undefined, '4 Farg‘ona filial').name, "Farg'ona filial");
    assert.equal(branchConfig.findSalesBranch(undefined, 'Qarshi 1-filial'), undefined);
    assert.equal(branchConfig.findSalesBranch(undefined, 'Yangi asr avlodi'), undefined);
    const monthly = await get('monthly');
    assert.equal(monthly.body.sales.length, 6);
    assert.equal(monthly.body.totalAmount, 650);
    const currentMonth = await get('current-month');
    assert.equal(currentMonth.status, 200);
    assert.equal(currentMonth.body.sales.length, today.getDate());
    assert.equal(currentMonth.body.totalAmount, 350);
    for (const response of [weekly, monthly, currentMonth]) {
        assert.equal(response.body.branches.reduce((sum, b) => sum + b.amount, 0), response.body.totalAmount);
        response.body.branches.forEach((branch) => {
            assert.equal(branch.sales.length, response.body.sales.length);
            assert.equal(branch.sales.reduce((sum, point) => sum + point.amount, 0), branch.amount);
        });
    }
    mode = 'partial';
    const partial = await get('monthly');
    assert.equal(partial.body.partial, true);
    assert.ok(partial.body.message);
    mode = 'error';
    assert.equal((await get('weekly')).status, 502);
    delete route.process.env.MOYSKLAD_TOKEN;
    assert.equal((await get('weekly')).status, 503);

    const buckets = utils.getSalesBuckets('weekly', new Date(2026, 0, 2));
    for (const date of [new Date(2026, 0, 1), new Date(2024, 1, 29), new Date(2026, 3, 30), new Date(2026, 11, 31)]) {
        const days = utils.getSalesBuckets('current-month', date);
        assert.equal(days.length, date.getDate());
        assert.equal(days[0].start.getDate(), 1);
        assert.equal(days.at(-1).start.getDate(), date.getDate());
        assert.equal(utils.addSaleToBuckets(days, { amount: 5, createdAt: new Date(date.getFullYear(), date.getMonth(), 0, 12).toISOString() }), false);
    }
    assert.equal(buckets.length, 7);
    assert.equal(buckets[0].start.getFullYear(), 2025);
    assert.equal(utils.addSaleToBuckets(buckets, { amount: 10, createdAt: buckets[0].start.toISOString() }), true);
    assert.equal(utils.addSaleToBuckets(buckets, { amount: 50, createdAt: buckets[6].end.toISOString() }), false);
    assert.equal(utils.addSaleToBuckets(buckets, { amount: NaN, createdAt: current }), false);
    const allTime = utils.getAllTimeSalesPoints([
        { amount: 100, createdAt: '2025-11-10T12:00:00.000Z' },
        { amount: 50, createdAt: '2025-11-20T12:00:00.000Z' },
        { amount: 200, createdAt: '2026-01-02T12:00:00.000Z' },
        { amount: NaN, createdAt: '2026-01-02T12:00:00.000Z' },
        { amount: 999, createdAt: 'invalid' }
    ], new Date(2026, 1, 1));
    assert.equal(allTime.length, 4);
    assert.equal(allTime[0].amount, 150);
    assert.equal(allTime[1].amount, 0);
    assert.equal(allTime[2].amount, 200);
    assert.equal(allTime[3].amount, 0);
    assert.equal(allTime.reduce((sum, point) => sum + point.amount, 0), 350);
    assert.equal(utils.getAllTimeSalesPoints([]).length, 0);
    assert.equal(orders.isOrderRevenueEligible({ paymentStatus: 'PAID', status: 'CANCELLED' }), true);
    assert.equal(orders.isOrderRevenueEligible({ paymentType: 'CASH', status: 'CONFIRMED', paymentStatus: 'PENDING' }), false);
    assert.equal(orders.isOrderRevenueEligible({ paymentType: 'CLICK', status: 'PENDING', paymentStatus: 'PAID' }), true);
    assert.equal(orders.isOrderRevenueEligible({ paymentStatus: 'UNPAID', status: 'PENDING' }), false);
    console.log('PASS: exactly 8 branches in requested order, exact display names, aliases, warehouse/retail consolidation, excluded sales removed from totals, zero sales, period histories and error responses.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
