"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType, AuthState } from "@/types";
import { AuthServiceAPI, setAccessToken } from "@/services/api";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await AuthServiceAPI.refresh();
        if (res && res.success && res.data) {
          setState({ 
            user: res.data.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false, isAuthenticated: false }));
        }
      } catch (error) {
        console.log("Sessiya mavjud emas (Login talab etiladi)");
        setState((prev) => ({ ...prev, isLoading: false, isAuthenticated: false }));
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await AuthServiceAPI.login({ email, password });
      if (res.success && res.data) {
        setState({ user: res.data.user, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: any) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await AuthServiceAPI.register(userData);
      if (res.success && res.data) {
        setState({ user: res.data.user, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthServiceAPI.logout();
      setState({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error("Logout xatosi", error);
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};