const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('src/utils/transliteration.ts', 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, context);
const matches = context.exports.matchesTransliteratedSearch;

const options = ['Badiiy adabiyot', 'Bolalar adabiyoti', 'Ilmiy adabiyot'];
assert.equal(options.filter((label) => matches(label, '')).length, 3);
assert.equal(options.filter((label) => matches(label, '  \t\n')).length, 3);
assert.deepEqual(options.filter((label) => matches(label, 'bolalar')), ['Bolalar adabiyoti']);
assert.deepEqual(options.filter((label) => matches(label, 'БОЛАЛАР')), ['Bolalar adabiyoti']);
assert.equal(matches('Болалар адабиёти', 'bolalar'), true);
assert.equal(matches('O‘zbekiston', "o'zbekiston"), true);
assert.equal(matches('Badiiy adabiyot', 'matematika'), false);
assert.equal(matches('', 'bolalar'), false);
console.log('PASS: empty/whitespace queries show all options; Latin, Cyrillic, apostrophe and nonmatching searches work.');

fetch('http://localhost:5000/api/v1/categories?all=true')
    .then((response) => {
        assert.equal(response.ok, true);
        return response.json();
    })
    .then(({ data }) => {
        const categories = Array.isArray(data) ? data : data.categories;
        assert.ok(categories.length > 0);
        const labels = categories.map((category) => category.title?.uz || category.title?.ru || category.title?.en || 'Kategoriya');
        assert.equal(labels.filter((label) => matches(label, '')).length, categories.length);
        console.log(`PASS: all ${categories.length} live API categories remain visible with an empty search.`);
    })
    .catch((error) => { console.error(error); process.exitCode = 1; });
