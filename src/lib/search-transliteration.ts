const CYRILLIC_TO_LATIN_PAIRS: Array<[string, string]> = [
    ['ё', 'yo'],
    ['ю', 'yu'],
    ['я', 'ya'],
    ['ў', "o'"],
    ['ғ', "g'"],
    ['ш', 'sh'],
    ['ч', 'ch'],
    ['нг', 'ng'],
    ['ц', 'ts'],
    ['а', 'a'],
    ['б', 'b'],
    ['в', 'v'],
    ['г', 'g'],
    ['д', 'd'],
    ['е', 'e'],
    ['ж', 'j'],
    ['з', 'z'],
    ['и', 'i'],
    ['й', 'y'],
    ['к', 'k'],
    ['л', 'l'],
    ['м', 'm'],
    ['н', 'n'],
    ['о', 'o'],
    ['п', 'p'],
    ['р', 'r'],
    ['с', 's'],
    ['т', 't'],
    ['у', 'u'],
    ['ф', 'f'],
    ['х', 'x'],
    ['қ', 'q'],
    ['ҳ', 'h'],
    ['ъ', "'"],
    ['ь', '']
];

const LATIN_TO_CYRILLIC_PAIRS: Array<[RegExp, string]> = [
    [/o['‘`ʼ]/gi, 'ў'],
    [/g['‘`ʼ]/gi, 'ғ'],
    [/sh/gi, 'ш'],
    [/ch/gi, 'ч'],
    [/ng/gi, 'нг'],
    [/yo/gi, 'ё'],
    [/yu/gi, 'ю'],
    [/ya/gi, 'я'],
    [/ts/gi, 'ц'],
    [/a/gi, 'а'],
    [/b/gi, 'б'],
    [/v/gi, 'в'],
    [/g/gi, 'г'],
    [/d/gi, 'д'],
    [/e/gi, 'е'],
    [/j/gi, 'ж'],
    [/z/gi, 'з'],
    [/i/gi, 'и'],
    [/y/gi, 'й'],
    [/k/gi, 'к'],
    [/l/gi, 'л'],
    [/m/gi, 'м'],
    [/n/gi, 'н'],
    [/o/gi, 'о'],
    [/p/gi, 'п'],
    [/r/gi, 'р'],
    [/s/gi, 'с'],
    [/t/gi, 'т'],
    [/u/gi, 'у'],
    [/f/gi, 'ф'],
    [/x/gi, 'х'],
    [/q/gi, 'қ'],
    [/h/gi, 'ҳ']
];

const CYRILLIC_PATTERN = /[а-яёғқҳў]/i;
const LATIN_PATTERN = /[a-z]/i;
const APOSTROPHE_PATTERN = /[‘`ʼ]/g;

const restoreCase = (source: string, converted: string) => {
    if (source.toUpperCase() === source) return converted.toUpperCase();
    if (source[0]?.toUpperCase() === source[0]) return `${converted[0]?.toUpperCase() ?? ''}${converted.slice(1)}`;

    return converted;
};

export const normalizeSearchQuery = (query: string) =>
    query.trim().replace(APOSTROPHE_PATTERN, "'").replace(/\s+/g, ' ');

export const cyrillicToLatin = (query: string) =>
    CYRILLIC_TO_LATIN_PAIRS.reduce(
        (result, [cyrillic, latin]) => result.replace(new RegExp(cyrillic, 'gi'), (match) => restoreCase(match, latin)),
        normalizeSearchQuery(query)
    );

export const latinToCyrillic = (query: string) =>
    LATIN_TO_CYRILLIC_PAIRS.reduce(
        (result, [latin, cyrillic]) => result.replace(latin, (match) => restoreCase(match, cyrillic)),
        normalizeSearchQuery(query)
    );

export const getSearchQueryVariants = (query: string) => {
    const normalizedQuery = normalizeSearchQuery(query);
    if (!normalizedQuery) return [];

    const variants = new Set([normalizedQuery]);

    if (CYRILLIC_PATTERN.test(normalizedQuery)) {
        variants.add(cyrillicToLatin(normalizedQuery));
    }

    if (LATIN_PATTERN.test(normalizedQuery)) {
        variants.add(latinToCyrillic(normalizedQuery));
    }

    return Array.from(variants).filter((variant) => variant.length >= 2);
};
