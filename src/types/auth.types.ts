export interface User {
    _id?: string;
    id: string;
    email: string;
    name?: string;
    wishlist?: unknown[];
    phone?: string;
    avatar?: string;
    telegramChatId?: string;
    role?: 'user' | 'admin';
    createdAt?: string;
    updatedAt?: string;
    bio?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    wishlistCount: number;
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: unknown) => Promise<void>;
    logout: () => Promise<void>;
    updateWishlistCount: () => void;
    syncWishlist: (wishlist: unknown[]) => void;
}

export type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User | null }
    | { type: 'AUTH_FAILURE' }
    | { type: 'LOGOUT' }
    | { type: 'SET_WISHLIST_COUNT'; payload: number }
    | { type: 'SYNC_WISHLIST'; payload: unknown[] };
