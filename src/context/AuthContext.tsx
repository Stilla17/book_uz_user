'use client';

import React, { type ReactNode, createContext, useCallback, useEffect, useReducer } from 'react';

import { AuthServiceAPI, UserService } from '@/services/api';
import type { AuthAction, AuthContextType, AuthState } from '@/types/auth.types';
import { clearGuestWishlist, getGuestWishlist, getGuestWishlistProductIds } from '@/utils/wishlist';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    wishlistCount: 0
};

const getGuestWishlistCount = () => {
    return getGuestWishlist().length;
};

const getUserWishlistCount = (user: AuthState['user']) => user?.wishlist?.length ?? 0;

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true };
        case 'AUTH_SUCCESS':
            return {
                user: action.payload,
                isAuthenticated: Boolean(action.payload),
                isLoading: false,
                wishlistCount: action.payload ? getUserWishlistCount(action.payload) : getGuestWishlistCount()
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                wishlistCount: getGuestWishlistCount()
            };
        case 'LOGOUT':
            return { user: null, isAuthenticated: false, isLoading: false, wishlistCount: getGuestWishlistCount() };
        case 'SET_WISHLIST_COUNT':
            return { ...state, wishlistCount: action.payload };
        case 'SYNC_WISHLIST':
            return {
                ...state,
                user: state.user ? { ...state.user, wishlist: action.payload } : state.user,
                wishlistCount: action.payload.length
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const updateWishlistCount = useCallback(() => {
        dispatch({
            type: 'SET_WISHLIST_COUNT',
            payload: state.user ? getUserWishlistCount(state.user) : getGuestWishlistCount()
        });
    }, [state.user]);

    const syncWishlist = useCallback((wishlist: unknown[]) => {
        dispatch({ type: 'SYNC_WISHLIST', payload: wishlist });
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            dispatch({ type: 'AUTH_START' });
            try {
                const res = await AuthServiceAPI.refresh();
                if (res && res.success && res.data) {
                    const guestProductIds = getGuestWishlistProductIds();
                    let nextUser = res.data.user;

                    if (guestProductIds.length) {
                        const mergeResponse = await UserService.mergeWishlist(guestProductIds);
                        if (mergeResponse?.success) {
                            nextUser = { ...nextUser, wishlist: mergeResponse.data };
                            clearGuestWishlist();
                        }
                    }

                    dispatch({ type: 'AUTH_SUCCESS', payload: nextUser });
                } else {
                    dispatch({ type: 'AUTH_FAILURE' });
                }
            } catch (error) {
                console.log('Sessiya mavjud emas (Login talab etiladi)');
                dispatch({ type: 'AUTH_FAILURE' });
            }
        };
        initAuth();
    }, []);

    useEffect(() => {
        updateWishlistCount();
    }, [updateWishlistCount]);

    const login = async (email: string, password: string) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const productIds = getGuestWishlistProductIds();
            const res = await AuthServiceAPI.login({ email, password, productIds });
            if (res.success && res.data) {
                if (productIds.length) clearGuestWishlist();
                dispatch({ type: 'AUTH_SUCCESS', payload: res.data.user });
            }
        } catch (error: any) {
            dispatch({ type: 'AUTH_FAILURE' });
            throw error;
        }
    };

    const register = async (userData: any) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const productIds = getGuestWishlistProductIds();
            const res = await AuthServiceAPI.register({ ...userData, productIds });
            if (res.success && res.data) {
                if (productIds.length) clearGuestWishlist();
                dispatch({ type: 'AUTH_SUCCESS', payload: res.data.user });
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
        <AuthContext.Provider value={{ ...state, login, register, logout, updateWishlistCount, syncWishlist }}>
            {children}
        </AuthContext.Provider>
    );
};
