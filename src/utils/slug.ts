const CYRILLIC_TO_LATIN: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    ғ: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'j',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    қ: 'q',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ў: 'o',
    ф: 'f',
    х: 'x',
    ҳ: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya'
};

export const slugifyBookSlug = (value: string) =>
    value
        .normalize('NFKC')
        .toLowerCase()
        .trim()
        .split('')
        .map((character) => CYRILLIC_TO_LATIN[character] ?? character)
        .join('')
        .replace(/[ʻʼ’‘`´']/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '');

const LEGACY_BOOK_ID_SUFFIX = /-[0-9a-f]{24}$/i;

export const getPublicBookSlug = (value?: string | null) =>
    String(value || '')
        .trim()
        .replace(LEGACY_BOOK_ID_SUFFIX, '');

export const getBookSlugSearchKeywords = (slug: string) => {
    const tokens = slug.split('-').filter(Boolean);
    const variants = [tokens.join(' '), tokens.slice(0, 3).join(' '), tokens.slice(0, 2).join(' '), tokens[0]];

    return [...new Set(variants.filter(Boolean))];
};
