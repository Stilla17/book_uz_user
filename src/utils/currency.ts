export const formatPriceNumber = (value?: number) => Number(value ?? 0).toLocaleString('ru-RU');

export const formatPrice = (value?: number) => `${formatPriceNumber(value)} so'm`;
