import type { Coupon } from '@/types';
import type { CartItem } from '@/store/features/cartSlice';

type EntityRef = string | { _id?: string; id?: string } | null | undefined;
type CouponWithPublisherAliases = Coupon & {
    applicablePublisherIds?: EntityRef[];
    publisherIds?: EntityRef[];
    publishers?: EntityRef[];
};

const getId = (value: EntityRef) => {
    if (!value) return '';

    return typeof value === 'string' ? value : value._id || value.id || '';
};

const getBookPublisherId = (book: CartItem['book']) =>
    getId(book.publisher) || book.publisherId || getId(book.details?.publisher) || book.details?.publisherId || '';

const getPromoPublisherIds = (promo: CouponWithPublisherAliases) =>
    [
        ...(promo.applicablePublishers ?? []),
        ...(promo.applicablePublisherIds ?? []),
        ...(promo.publisherIds ?? []),
        ...(promo.publishers ?? [])
    ]
        .map(getId)
        .filter(Boolean);

export const isPromoApplicableToCartItem = (promo: Coupon, item: CartItem) => {
    const productIds = (promo.applicableProducts ?? []).map(getId).filter(Boolean);
    const publisherIds = getPromoPublisherIds(promo);
    const hasRules = productIds.length > 0 || publisherIds.length > 0;

    if (!hasRules) return true;

    return productIds.includes(item.book._id) || publisherIds.includes(getBookPublisherId(item.book));
};

export const getPromoEligibleTotal = (promo: Coupon, items: CartItem[]) => {
    return items.reduce((sum, item) => {
        if (!isPromoApplicableToCartItem(promo, item)) return sum;

        return sum + item.book.price * item.quantity;
    }, 0);
};

export const calculatePromoDiscount = (promo: Coupon, items: CartItem[]) => {
    const eligibleTotal = getPromoEligibleTotal(promo, items);

    if (eligibleTotal <= 0) return 0;

    if (promo.type === 'PERCENT') {
        return Math.round((eligibleTotal * promo.value) / 100);
    }

    return Math.min(promo.value, eligibleTotal);
};
