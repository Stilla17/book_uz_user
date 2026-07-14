import type { CartItem } from '@/store/features/cartSlice';
import type { OrderPayload } from '@/types';
import { getLocalizedText } from '@/utils/book-formatters';

export interface LocationName {
    uz?: string;
    ru?: string;
    en?: string;
}

export interface RegionItem {
    id: string;
    externalId?: number;
    name?: LocationName;
    districtsCount?: number;
}

export interface DistrictItem {
    id: string;
    externalId?: number;
    name?: LocationName;
    order?: number;
    region?: {
        id?: string;
        name?: LocationName;
    };
}

export const DELIVERY_COST = 20000;
export const POST_OFFICE_DELIVERY_COST = 40000;
export const POST_TO_HOME_EXTRA_COST = 20000;
export const POST_TO_HOME_DELIVERY_COST = POST_OFFICE_DELIVERY_COST + POST_TO_HOME_EXTRA_COST;

export const getLocationName = (item?: { name?: LocationName }) => getLocalizedText(item?.name, "Noma'lum");

export const isValidUzPhone = (value: string) => /^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/.test(value);

export const getDeliveryType = (deliveryTitle: string): OrderPayload['deliveryType'] => {
    if (deliveryTitle === 'Pochta orqali' || deliveryTitle === 'Pochtadan uyga olib borib berish') return 'POST';
    if (deliveryTitle === "Do'kondan olib ketish") return 'PICKUP';

    return 'DELIVERY';
};

export const getPostDeliveryType = (deliveryTitle: string): OrderPayload['postDeliveryType'] => {
    if (deliveryTitle === 'Pochta orqali') return 'POST_OFFICE';
    if (deliveryTitle === 'Pochtadan uyga olib borib berish') return 'POST_TO_HOME';

    return undefined;
};

export const getPaymentType = (paymentTitle: string): OrderPayload['paymentType'] => {
    const normalizedPayment = paymentTitle.toUpperCase();

    if (normalizedPayment === 'CLICK') return 'CLICK';
    if (normalizedPayment === 'XAZNA') return 'XAZNA';
    if (normalizedPayment === 'PAYME') return 'PAYME';

    return 'CASH';
};

export const getCartProductId = (product: unknown) => {
    if (typeof product === 'string') return product;
    if (!product || typeof product !== 'object') return '';

    const book = product as { _id?: string; id?: string };

    return book._id || book.id || '';
};

const redirectUrlKeys = new Set(['redirectUrl', 'paymentUrl', 'paymeUrl', 'clickUrl', 'url']);

export const getPaymentRedirectUrl = (response: unknown): string => {
    const visited = new WeakSet<object>();

    const findUrl = (value: unknown): string => {
        if (!value || typeof value !== 'object') return '';
        if (visited.has(value)) return '';

        visited.add(value);

        for (const [key, nestedValue] of Object.entries(value)) {
            if (redirectUrlKeys.has(key) && typeof nestedValue === 'string' && /^https?:\/\//.test(nestedValue)) {
                return nestedValue;
            }

            const nestedUrl = findUrl(nestedValue);

            if (nestedUrl) return nestedUrl;
        }

        return '';
    };

    return findUrl(response);
};

export const getOrderId = (response: any) => response?.data?._id || response?.data?.id || response?._id || response?.id;

export const isOnlinePayment = (paymentTitle: string) => ['Click', 'Payme', 'Xazna'].includes(paymentTitle);

type CheckoutStateLike = {
    clientName: string;
    address: string;
    description: string;
    promoCode?: string;
    promoDiscount?: number;
};

type ValidateCheckoutParams = {
    cartItems: CartItem[];
    checkout: CheckoutStateLike;
    phone: string;
    selectedRegionItem?: RegionItem;
    selectedDistrictItem?: DistrictItem;
    selectedPayment: string;
    paymentTitles: string[];
};

const getOrderItems = (cartItems: CartItem[]) =>
    cartItems.map((item) => ({
        product: getCartProductId(item.book),
        quantity: item.quantity,
        priceAtTime: Number(item.book.price || 0)
    }));

export const validateCheckout = ({
    cartItems,
    checkout,
    phone,
    selectedRegionItem,
    selectedDistrictItem,
    selectedPayment,
    paymentTitles
}: ValidateCheckoutParams) => {
    if (!cartItems.length) return 'emptyCart';
    if (!checkout.clientName.trim()) return 'nameRequired';
    if (!isValidUzPhone(phone)) return 'invalidPhone';
    if (!selectedRegionItem || !selectedDistrictItem) return 'locationRequired';
    if (!checkout.address.trim()) return 'addressRequired';
    if (!paymentTitles.includes(selectedPayment)) return 'paymentRequired';
    if (getOrderItems(cartItems).some((item) => !item.product)) {
        return 'productIdMissing';
    }

    return '';
};

type BuildOrderPayloadParams = {
    cartItems: CartItem[];
    totalPrice: number;
    userId?: string;
    checkout: CheckoutStateLike;
    phone: string;
    selectedRegionItem: RegionItem;
    selectedDistrictItem: DistrictItem;
    selectedDelivery: string;
    selectedPayment: string;
    deliveryFee?: number;
};

export const getDeliveryCost = (selectedDelivery: string, deliveryFee = DELIVERY_COST) => {
    const deliveryType = getDeliveryType(selectedDelivery);

    if (deliveryType === 'PICKUP') return 0;
    if (selectedDelivery === 'Pochta orqali') return POST_OFFICE_DELIVERY_COST;
    if (selectedDelivery === 'Pochtadan uyga olib borib berish') return POST_TO_HOME_DELIVERY_COST;

    return Math.max(0, Math.round(Number(deliveryFee) || DELIVERY_COST));
};

export const buildOrderPayload = ({
    cartItems,
    totalPrice,
    userId,
    checkout,
    phone,
    selectedRegionItem,
    selectedDistrictItem,
    selectedDelivery,
    selectedPayment,
    deliveryFee: configuredDeliveryFee
}: BuildOrderPayloadParams): OrderPayload => {
    const deliveryFee = getDeliveryCost(selectedDelivery, configuredDeliveryFee);
    const postDeliveryType = getPostDeliveryType(selectedDelivery);

    return {
        ...(userId ? { user: userId } : {}),
        items: getOrderItems(cartItems),
        totalAmount: Math.max(0, totalPrice + deliveryFee - (checkout.promoDiscount || 0)),
        deliveryFee,
        guestName: checkout.clientName.trim(),
        description: checkout.description.trim(),
        couponCode: checkout.promoCode || undefined,
        shippingAddress: {
            city: getLocationName(selectedRegionItem),
            region: getLocationName(selectedDistrictItem),
            street: checkout.address.trim(),
            phone
        },
        deliveryType: getDeliveryType(selectedDelivery),
        ...(postDeliveryType ? { postDeliveryType } : {}),
        paymentType: getPaymentType(selectedPayment)
    };
};

type ResolvePaymentRedirectParams = {
    response: unknown;
    selectedPayment: string;
    orderId?: string;
    createClickPayment: (orderId: string) => Promise<unknown>;
    createPaymePayment: (orderId: string) => Promise<unknown>;
};

export const resolvePaymentRedirectUrl = async ({
    response,
    selectedPayment,
    orderId,
    createClickPayment,
    createPaymePayment
}: ResolvePaymentRedirectParams) => {
    let paymentRedirectUrl = getPaymentRedirectUrl(response);

    if (!paymentRedirectUrl && selectedPayment === 'Click' && orderId) {
        paymentRedirectUrl = getPaymentRedirectUrl(await createClickPayment(orderId));
    }

    if (!paymentRedirectUrl && selectedPayment === 'Payme' && orderId) {
        paymentRedirectUrl = getPaymentRedirectUrl(await createPaymePayment(orderId));
    }

    return paymentRedirectUrl;
};
