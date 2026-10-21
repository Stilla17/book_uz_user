export const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/['"`]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export const formatDateInputValue = (value?: string) => (value ? value.slice(0, 10) : '');

export const isValidDateInput = (value: string) => {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const date = new Date(`${value}T00:00:00Z`);

    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
