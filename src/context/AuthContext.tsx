"use client";

import React, { createContext, useEffect, useReducer, type ReactNode } from "react";

import { AuthServiceAPI } from "@/services/api";
import type { AuthAction, AuthContextType, AuthState } from "@/types/auth.types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: Boolean(action.payload),
        isLoading: false,
      };
    case 'AUTH_FAILURE':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, isLoading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: 'AUTH_START' });
      try {
        const res = await AuthServiceAPI.refresh();
        if (res && res.success && res.data) {
          dispatch({ type: 'AUTH_SUCCESS', payload: res.data.user });
        } else {
          dispatch({ type: 'AUTH_FAILURE' });
        }
      } catch (error) {
        console.log("Sessiya mavjud emas (Login talab etiladi)");
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
      const res = await AuthServiceAPI.register(userData);
      if (res.success && res.data) {
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
      console.error("Logout xatosi", error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
