'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/services/api';
import { type CartBook, type CartItem, addCart, clearCart, removeCart, setCart } from '@/store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getBookPriceInfo } from '@/utils/book-formatters';
import { getBookImageUrl } from '@/utils/image';
import {
    addGuestCart,
    clearCartPriceOverrides,
    clearGuestCart,
    getCartPriceOverride,
    getCartFromLocalStotage,
    removeCartPriceOverride,
    removeGuestCart,
    saveCartPriceOverride,
    updateGuestCart
} from '@/utils/cartStorage';

// Serverdan kelgan maxsulotlarni royxati keladi.
const getResponseData = (response: any) => response?.data?.data ?? response?.data ?? response;

const getArrayData = (response: any) => {
    const data = getResponseData(response);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.products)) return data.products;

    return [];
};

const getProductId = (value: any): string => {
    if (typeof value === 'string') return value;

    return value?._id || value?.id || value?.productId || value?.product?._id || value?.product?.id || '';
};

const getCartItemPriceInfo = (item: any, book: any) => {
    const productId = getProductId(book);
    const savedPrice = productId ? getCartPriceOverride(productId) : undefined;
    const priceInfo = getBookPriceInfo({
        price: Number(item?.price ?? item?.priceAtTime ?? book?.price ?? 0),
        oldPrice: book?.oldPrice,
        discountPrice: item?.discountPrice ?? book?.discountPrice,
        discount: book?.discount
    });

    return {
        ...priceInfo,
        price: typeof savedPrice === 'number' ? savedPrice : priceInfo.price
    };
};

// Serverdan kelgan maxsulotni CartItem formatiga o'tkazadi.
const normalizeCartItem = (item: any): CartItem | null => {
    const book = item?.book ?? item?.product ?? item?.productId ?? item;
    const productId = getProductId(book);
    if (!book || typeof book !== 'object' || !productId) return null;
    const priceInfo = getCartItemPriceInfo(item, book);

    return {
        book: {
            _id: productId,
            title: book.title ?? "Noma'lum kitob",
            slug: book.slug,
            price: priceInfo.price,
            oldPrice: priceInfo.oldPrice,
            discountPrice: priceInfo.price,
            discount: priceInfo.discount,
            images: getBookImageUrl(book) ?? '',
            stock: book.stock ?? 0,
            publisher: book.publisher,
            publisherId: book.publisherId,
            publisherName: book.publisherName,
            details: book.details
        },
        quantity: item?.quantity ?? 1
    };
};

// ombordagi maxsulot sonini tekshradi.
const clampQuantity = (quantity: number, stock?: number) => {
    const minQuantity = Math.max(1, quantity);

    if (typeof stock === 'number' && stock > 0) {
        return Math.min(minQuantity, stock);
    }

    return minQuantity;
};

export const useBookCart = ({ loadOnMount = true }: { loadOnMount?: boolean } = {}) => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const [loadingCart, setLoadingCart] = useState(loadOnMount);

    const loadCart = useCallback(async () => {
        if (authLoading) return;

        setLoadingCart(true);

        try {
            if (isAuthenticated) {
                const response = await UserService.getCart();
                const serverCart = getArrayData(response)
                    .map((item: any) => normalizeCartItem(item))
                    .filter((item: CartItem | null): item is CartItem => Boolean(item));

                dispatch(setCart(serverCart));
            } else {
                dispatch(setCart(getCartFromLocalStotage().map(normalizeCartItem).filter(Boolean) as CartItem[]));
            }
        } catch (error) {
            console.error("Cart ma'lumotlarini olishda xatolik:", error);
            dispatch(setCart([]));
        } finally {
            setLoadingCart(false);
        }
    }, [authLoading, dispatch, isAuthenticated]);

    useEffect(() => {
        if (!loadOnMount) return;

        loadCart();
    }, [loadCart, loadOnMount]);

    const addItem = async (book: CartBook, quantity = 1) => {
        const existingItem = cartItems.find((item) => item.book._id === book._id);
        const nextQuantity = clampQuantity(quantity, book.stock);

        if (existingItem) {
            return;
        }

        const cartItem = { book, quantity: nextQuantity };

        dispatch(addCart(cartItem));

        if (isAuthenticated) {
            await UserService.addToCart({ productId: book._id, quantity: nextQuantity, priceAtTime: book.price });
            saveCartPriceOverride(book._id, book.price);
            return;
        }

        saveCartPriceOverride(book._id, book.price);
        addGuestCart([cartItem]);
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        const currentItem = cartItems.find((item) => item.book._id === productId);
        const nextQuantity = clampQuantity(quantity, currentItem?.book.stock);
        const nextCart = cartItems.map((item) =>
            item.book._id === productId ? { ...item, quantity: nextQuantity } : item
        );

        dispatch(setCart(nextCart));

        if (isAuthenticated) {
            await UserService.updateCart({ productId, quantity: nextQuantity });
            return;
        }

        updateGuestCart(productId, nextQuantity);
    };

    const removeItem = async (productId: string) => {
        dispatch(removeCart(productId));

        if (isAuthenticated) {
            await UserService.removeFromCart(productId);
            removeCartPriceOverride(productId);
            return;
        }

        removeCartPriceOverride(productId);
        removeGuestCart(productId);
    };

    const clearItems = async () => {
        dispatch(clearCart());

        if (isAuthenticated) {
            await UserService.clearCart();
            clearCartPriceOverrides();
            return;
        }

        clearCartPriceOverrides();
        clearGuestCart();
    };

    const totalPrice = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0),
        [cartItems]
    );
    const totalQuantity = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

    return {
        cartItems,
        loadingCart,
        authLoading,
        isAuthenticated,
        totalPrice,
        totalQuantity,
        reloadCart: loadCart,
        updateQuantity,
        removeItem,
        clearItems,
        addItem
    };
};
