const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(process.argv[2] || path.join(__dirname, 'productController.js'), 'utf8');
const calls = {};
const sample = { total: 5, active: 4, inactive: 1, low: 1, available: 2, out: 2 };
let statsResult = [sample];
let aggregateError;
const Product = {
    aggregate: async () => {
        if (aggregateError) throw aggregateError;
        return statsResult;
    },
    find: (filter) => {
        calls.filter = filter;
        const chain = {
            populate: () => chain,
            sort: (sort) => { calls.sort = sort; return chain; },
            skip: (skip) => { calls.skip = skip; return chain; },
            limit: (limit) => { calls.limit = limit; return Promise.resolve([]); }
        };
        return chain;
    },
    countDocuments: async (filter) => { calls.countFilter = filter; return 75; }
};
const context = {
    module: { exports: {} },
    require: (id) => {
        if (id.endsWith('/Product')) return Product;
        if (id.endsWith('/Author') || id.endsWith('/Publisher')) {
            return { find: () => ({ select: async () => [] }) };
        }
        if (id.endsWith('/searchRegex')) return { buildSearchRegex: (value) => new RegExp(value, 'i') };
        if (id.endsWith('/pagination')) {
            return require(path.resolve(__dirname, '../../../backend/src/utils/pagination.js'));
        }
        if (id.endsWith('/apiResponse')) return (res, status, success, message, data) => res.json({ data });
        return {};
    }
};
vm.runInNewContext(source, context);
const controller = context.module.exports;
const plain = (value) => JSON.parse(JSON.stringify(value));
const res = { json: (body) => { calls.response = plain(body); } };
const next = (error) => { throw error; };

(async () => {
    await controller.getProductStats({}, res, next);
    assert.deepEqual(calls.response.data, sample);
    statsResult = [];
    await controller.getProductStats({}, res, next);
    assert.deepEqual(calls.response.data, { total: 0, active: 0, inactive: 0, low: 0, available: 0, out: 0 });
    aggregateError = new Error('database unavailable');
    let forwarded;
    await controller.getProductStats({}, res, (error) => { forwarded = error; });
    assert.equal(forwarded, aggregateError);

    for (const stockFilter of ['all', 'low', 'available', 'out']) {
        await controller.getAllProducts({ query: { page: 2, limit: 50, stockFilter, sortBy: 'price', sortOrder: 'desc' } }, res, next);
        assert.equal(calls.skip, 50);
        assert.equal(calls.limit, 50);
        assert.deepEqual(plain(calls.sort), { price: -1, _id: -1 });
        assert.equal(calls.countFilter, calls.filter);
        assert.equal(calls.response.data.pagination.pages, 2);
        if (stockFilter === 'all') assert.deepEqual(plain(calls.filter), {});
        if (stockFilter === 'low') assert.deepEqual(plain(calls.filter.stock), { $gt: 0, $lt: 10 });
        if (stockFilter === 'available') assert.deepEqual(plain(calls.filter.stock), { $gte: 10 });
        if (stockFilter === 'out') assert.deepEqual(plain(calls.filter.$and), [{ $or: [{ stock: { $lte: 0 } }, { stock: null }] }]);
    }
    await controller.getAllProducts({ query: { search: 'kitob', category: 'category-id', stockFilter: 'out', sortBy: 'title' } }, res, next);
    assert.ok(calls.filter.$or.length > 0);
    assert.equal(calls.filter.$and.length, 2);
    assert.deepEqual(plain(calls.sort), { 'title.uz': 1, _id: 1 });
    await controller.getAllProducts({ query: {} }, res, next);
    assert.deepEqual(plain(calls.sort), { createdAt: -1, _id: -1 });
    console.log('PASS: stats, empty stats, error forwarding, stock filters, search/category composition, sort, pagination.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
