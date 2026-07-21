'use client';

import React, { type ReactNode, createContext, useEffect, useReducer } from 'react';

import { AuthServiceAPI, UserService, hasAuthSession, setAuthSession } from '@/services/api';
import { type CartItem, setCart } from '@/store/features/cartSlice';
import { type WishlistBook, setWishlist } from '@/store/features/wishlistSlice';
import { useAppDispatch } from '@/store/hooks';
import type {
    AuthAction,
    AuthContextType,
    AuthState,
    PhoneLoginRequest,
    PhoneOtpRequest,
    PhoneOtpVerifyRequest,
    User
} from '@/types/auth.types';
import { clearGuestCart, getCartFromLocalStotage } from '@/utils/cartStorage';
import { clearGuestWishlist, getWishlistFromLocalStorage } from '@/utils/wishlistStorage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true };
        case 'AUTH_SUCCESS':
            return {
                user: action.payload,
                isAuthenticated: Boolean(action.payload),
                isLoading: false
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        case 'LOGOUT':
            return { user: null, isAuthenticated: false, isLoading: false };
        default:
            return state;
    }
};

const getResponseData = (response: any) => response?.data?.data ?? response?.data ?? response;

const getUserData = (response: any): User | null => {
    const data = getResponseData(response);
    return data?.user ?? data ?? null;
};

const getArrayData = (response: any) => {
    const data = getResponseData(response);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.wishlist)) return data.wishlist;

    return [];
};

const normalizeCartItem = (item: any): CartItem | null => {
    const book = item?.book ?? item?.product ?? item?.productId ?? item;
    if (!book || typeof book !== 'object' || !book._id) return null;

    return {
        book: {
            _id: book._id,
            title: book.title ?? "Noma'lum kitob",
            slug: book.slug,
            price: item?.price ?? book.price ?? 0,
            images: book.image ?? book.images?.[0] ?? '',
            stock: book.stock ?? 0,
            publisher: book.publisher,
            publisherId: book.publisherId,
            publisherName: book.publisherName,
            details: book.details
        },
        quantity: item?.quantity ?? 1
    };
};

const normalizeWishlistBook = (item: any): WishlistBook | null => {
    const book = item?.book ?? item?.product ?? item;
    if (!book || typeof book !== 'object' || !book._id) return null;

    return {
        _id: book._id,
        title: book.title ?? "Noma'lum kitob",
        slug: book.slug,
        price: book.price ?? 0,
        images: Array.isArray(book.images) ? book.images : book.image ? [book.image] : [],
        stock: book.stock ?? 0
    };
};

const isValidId = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const getCartItemProductId = (item: any) => {
    if (typeof item?.productId === 'string') return item.productId;
    if (typeof item?.product === 'string') return item.product;
    if (typeof item?.book === 'string') return item.book;

    return item?.book?._id ?? item?.product?._id ?? item?._id;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const reduxDispatch = useAppDispatch();

    const syncGuestData = async () => {
        const guestCart = getCartFromLocalStotage();
        const guestWishlist = getWishlistFromLocalStorage();

        let cartSynced = guestCart.length === 0;
        let wishlistSynced = guestWishlist.length === 0;

        try {
            if (guestCart.length) {
                const serverCartResponse = await UserService.getCart().catch(() => null);
                const serverCartIds = new Set(
                    getArrayData(serverCartResponse)
                        .map((item: any) => getCartItemProductId(item))
                        .filter(isValidId)
                );
                const cartItemsToSync = guestCart.filter(
                    (item) => isValidId(item?.book?._id) && !serverCartIds.has(item.book._id)
                );

                const cartSyncResults = await Promise.allSettled(
                    cartItemsToSync.map((item) => {
                        const quantity = Number(item.quantity);

                        return UserService.addToCart({
                            productId: item.book._id,
                            quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1
                        });
                    })
                );
                cartSynced = cartSyncResults.every((result) => result.status === 'fulfilled');
            }

            if (guestWishlist.length) {
                const bookIds = guestWishlist.map((book) => book._id).filter(isValidId);

                try {
                    await UserService.syncWishlist(bookIds);
                    wishlistSynced = true;
                } catch {
                    const wishlistSyncResults = await Promise.allSettled(
                        bookIds.map((bookId) => UserService.addWishlist(bookId))
                    );

                    wishlistSynced = wishlistSyncResults.every((result) => result.status === 'fulfilled');
                }
            }
        } catch (error) {
            console.error("Guest ma'lumotlarini serverga yuborishda xatolik:", error);
        }

        const [cartResponse, wishlistResponse] = await Promise.allSettled([
            UserService.getCart(),
            UserService.getWishlist()
        ]);

        if (cartResponse.status === 'fulfilled') {
            reduxDispatch(setCart(getArrayData(cartResponse.value).map(normalizeCartItem).filter(Boolean)));
        }

        if (wishlistResponse.status === 'fulfilled') {
            reduxDispatch(setWishlist(getArrayData(wishlistResponse.value).map(normalizeWishlistBook).filter(Boolean)));
        }

        if (cartSynced) clearGuestCart();
        if (wishlistSynced) clearGuestWishlist();
    };

    useEffect(() => {
        const initAuth = async () => {
            dispatch({ type: 'AUTH_START' });

            if (!hasAuthSession()) {
                dispatch({ type: 'AUTH_FAILURE' });
                return;
            }

            try {
                const res = await AuthServiceAPI.refresh();
                if (res && res.success && res.data) {
                    await syncGuestData();
                    dispatch({ type: 'AUTH_SUCCESS', payload: res.data.user });
                } else {
                    dispatch({ type: 'AUTH_FAILURE' });
                }
            } catch {
                setAuthSession(false);
                dispatch({ type: 'AUTH_FAILURE' });
            }
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const res = await AuthServiceAPI.login({ email, password });
            if (res.success && res.data) {
                await syncGuestData();
                dispatch({ type: 'AUTH_SUCCESS', payload: res.data.user });
            }
        } catch (error: any) {
            dispatch({ type: 'AUTH_FAILURE' });
            throw error;
        }
    };

    const loginWithPhone = async ({ phone, name }: PhoneLoginRequest) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const wishlist = getWishlistFromLocalStorage();
            const res = await AuthServiceAPI.loginWithPhone({
                phone,
                name,
                wishlist: wishlist.map((book) => book._id).filter(Boolean)
            });

            if (res.success && res.data) {
                await syncGuestData();
                dispatch({ type: 'AUTH_SUCCESS', payload: res.data.user });
            }
        } catch (error: any) {
            dispatch({ type: 'AUTH_FAILURE' });
            throw error;
        }
    };

    const refreshUser = async () => {
        try {
            const response = await UserService.getProfile();
            const user = getUserData(response);
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
            return user;
        } catch (error) {
            console.error('Profilni yangilashda xatolik:', error);
            return null;
        }
    };

    const sendPhoneOtp = async ({ phone, name, birthDate, mode }: PhoneOtpRequest) => {
        dispatch({ type: 'AUTH_START' });
        try {
            await AuthServiceAPI.sendPhoneOtp({ phone, name, birthDate, mode });
            dispatch({ type: 'AUTH_SUCCESS', payload: state.user });
        } catch (error: any) {
            dispatch({ type: 'AUTH_FAILURE' });
            throw error;
        }
    };

    const verifyPhoneOtp = async ({ phone, otp, name, birthDate }: PhoneOtpVerifyRequest) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const wishlist = getWishlistFromLocalStorage();
            const res = await AuthServiceAPI.verifyPhoneOtp({
                phone,
                otp,
                name,
                birthDate,
                wishlist: wishlist.map((book) => book._id).filter(Boolean)
            });

            if (res.success && res.data) {
                if (name || birthDate) {
                    await UserService.updateProfile({
                        ...(name ? { name } : {}),
                        ...(birthDate ? { birthDate } : {})
                    });
                }
                await syncGuestData();
                const authenticatedUser = name || birthDate ? await refreshUser() : res.data.user;
                dispatch({ type: 'AUTH_SUCCESS', payload: authenticatedUser });
            }
        } catch (error: any) {
            dispatch({ type: 'AUTH_FAILURE' });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AuthServiceAPI.logout();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error('Logout xatosi', error);
            dispatch({ type: 'LOGOUT' });
        }
    };

    return (
        <AuthContext.Provider
            value={{ ...state, login, loginWithPhone, sendPhoneOtp, verifyPhoneOtp, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
