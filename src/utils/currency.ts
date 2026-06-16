export const formatPriceNumber = (value?: number) => Number(value ?? 0).toLocaleString('uz-UZ');

export const formatPrice = (value?: number) => `${formatPriceNumber(value)} so'm`;
