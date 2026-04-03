export interface User {
    id: string;
    email: string;
    name?: string;
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
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: unknown) => Promise<void>;
    logout: () => Promise<void>;
}

export type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User | null }
    | { type: 'AUTH_FAILURE' }
    | { type: 'LOGOUT' };
