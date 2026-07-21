export interface User {
    _id?: string;
    id: string;
    email?: string;
    name?: string;
    wishlist?: unknown[];
    phone?: string;
    avatar?: string;
    telegramChatId?: string;
    role?: 'USER' | 'ADMIN';
    createdAt?: string;
    updatedAt?: string;
    bio?: string;
    birthDate?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    loginWithPhone: (data: PhoneLoginRequest) => Promise<void>;
    sendPhoneOtp: (data: PhoneOtpRequest) => Promise<void>;
    verifyPhoneOtp: (data: PhoneOtpVerifyRequest) => Promise<void>;
    refreshUser: () => Promise<User | null>;
    logout: () => Promise<void>;
}

export type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User | null }
    | { type: 'AUTH_FAILURE' }
    | { type: 'LOGOUT' };

export interface LoginPayload {
    email: string;
    password: string;
}

export interface PhoneOtpRequest {
    phone: string;
    mode?: 'login' | 'register';
    name?: string;
    birthDate?: string;
}

export interface PhoneLoginRequest {
    name: string;
    phone: string;
}

export interface PhoneOtpVerifyRequest {
    phone: string;
    otp: string;
    name?: string;
    birthDate?: string;
}

export interface LoginResponse {
    success?: boolean;
    message?: string;
    token?: string;
    user: User | null;
}
