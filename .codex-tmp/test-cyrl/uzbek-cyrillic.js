"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localizeUzbekScript = exports.isUzbekCyrillicLanguage = exports.transliterateUzbekResource = exports.transliterateUzbekToCyrillic = void 0;
const protectedTextPattern = /(\{\{[^}]+\}\}|<[^>]*>|https?:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.\w+|\b(?:Book\.uz|BOOK\.UZ|Payme|Click|Xazna|Telegram|Instagram|Facebook|YouTube|FAQ|ISBN)\b)/gi;
const multiLetterMap = [
    ["yo'", 'йў'],
    ['yo‘', 'йў'],
    ['yo’', 'йў'],
    ['yoʻ', 'йў'],
    ["o'", 'ў'],
    ['o‘', 'ў'],
    ['o’', 'ў'],
    ['oʻ', 'ў'],
    ["g'", 'ғ'],
    ['g‘', 'ғ'],
    ['g’', 'ғ'],
    ['gʻ', 'ғ'],
    ['sh', 'ш'],
    ['ch', 'ч'],
    ['yo', 'ё'],
    ['yu', 'ю'],
    ['ya', 'я'],
    ['ye', 'е']
];
const singleLetterMap = {
    a: 'а',
    b: 'б',
    c: 'с',
    d: 'д',
    e: 'е',
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
    w: 'в',
    x: 'х',
    y: 'й',
    z: 'з'
};
const preserveCase = (source, result) => {
    if (source === source.toUpperCase())
        return result.toUpperCase();
    if (source[0] === source[0]?.toUpperCase())
        return result[0]?.toUpperCase() + result.slice(1);
    return result;
};
const transliterateSegment = (value) => {
    let result = '';
    for (let index = 0; index < value.length; index += 1) {
        const mappedPair = multiLetterMap.find(([latin]) => latin === value.slice(index, index + latin.length).toLowerCase());
        if (mappedPair) {
            const source = value.slice(index, index + mappedPair[0].length);
            result += preserveCase(source, mappedPair[1]);
            index += mappedPair[0].length - 1;
            continue;
        }
        const character = value[index];
        const lowerCharacter = character.toLowerCase();
        const mappedCharacter = singleLetterMap[lowerCharacter];
        if (mappedCharacter) {
            const isWordStart = index === 0 || !/[A-Za-z]/.test(value[index - 1]);
            const cyrillicCharacter = lowerCharacter === 'e' && isWordStart ? 'э' : mappedCharacter;
            result += preserveCase(character, cyrillicCharacter);
        }
        else if (["'", '’', '‘', 'ʻ', '`'].includes(character)) {
            result += 'ъ';
        }
        else {
            result += character;
        }
    }
    return result;
};
const transliterateUzbekToCyrillic = (value) => value
    .split(protectedTextPattern)
    .map((part, index) => (index % 2 === 1 ? part : transliterateSegment(part)))
    .join('');
exports.transliterateUzbekToCyrillic = transliterateUzbekToCyrillic;
const transliterateUzbekResource = (value) => {
    if (typeof value === 'string')
        return (0, exports.transliterateUzbekToCyrillic)(value);
    if (Array.isArray(value))
        return value.map(exports.transliterateUzbekResource);
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, (0, exports.transliterateUzbekResource)(nestedValue)]));
    }
    return value;
};
exports.transliterateUzbekResource = transliterateUzbekResource;
const isUzbekCyrillicLanguage = (language) => language?.toLowerCase() === 'uz-cyrl';
exports.isUzbekCyrillicLanguage = isUzbekCyrillicLanguage;
const localizeUzbekScript = (value, language) => (0, exports.isUzbekCyrillicLanguage)(language) ? (0, exports.transliterateUzbekToCyrillic)(value) : value;
exports.localizeUzbekScript = localizeUzbekScript;
