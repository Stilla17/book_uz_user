const cyrillicToLatinMap: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'j',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'x',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sh',
    ъ: '',
    ы: 'i',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ў: "o'",
    қ: 'q',
    ғ: "g'",
    ҳ: 'h'
};

const latinToCyrillicPairs: Array<[RegExp, string]> = [
    [/o['`ʻ‘’]/g, 'ў'],
    [/g['`ʻ‘’]/g, 'ғ'],
    [/sh/g, 'ш'],
    [/ch/g, 'ч'],
    [/yo/g, 'ё'],
    [/yu/g, 'ю'],
    [/ya/g, 'я'],
    [/ts/g, 'ц'],
    [/ye/g, 'е']
];

const latinToCyrillicMap: Record<string, string> = {
    a: 'а',
    b: 'б',
    d: 'д',
    e: 'э',
    f: 'ф',
    g: 'г',
    h: 'ҳ',
    i: 'и',
    j: 'ж',
    k: 'к',
    l: 'л',
    m: 'м',
    n: 'н',
    o: 'о',
    p: 'п',
    q: 'қ',
    r: 'р',
    s: 'с',
    t: 'т',
    u: 'у',
    v: 'в',
    x: 'х',
    y: 'й',
    z: 'з'
};

const normalizeSearchText = (value: string) =>
    value
        .toLowerCase()
        .replace(/[ʼʻ‘’`]/g, "'")
        .replace(/\s+/g, ' ')
        .trim();

export const toLatinSearchText = (value: string) =>
    normalizeSearchText(value)
        .split('')
        .map((letter) => cyrillicToLatinMap[letter] ?? letter)
        .join('');

export const toCyrillicSearchText = (value: string) => {
    let result = normalizeSearchText(value);

    latinToCyrillicPairs.forEach(([pattern, replacement]) => {
        result = result.replace(pattern, replacement);
    });

    return result
        .split('')
        .map((letter) => latinToCyrillicMap[letter] ?? letter)
        .join('');
};

export const getTransliteratedSearchVariants = (value: string) => {
    const normalized = normalizeSearchText(value);
    if (!normalized) return [];

    return Array.from(new Set([normalized, toLatinSearchText(normalized), toCyrillicSearchText(normalized)]));
};

export const matchesTransliteratedSearch = (text: string, query: string) => {
    const textVariants = getTransliteratedSearchVariants(text);
    const queryVariants = getTransliteratedSearchVariants(query);

    return textVariants.some((textVariant) =>
        queryVariants.some((queryVariant) => textVariant.includes(queryVariant))
    );
};
