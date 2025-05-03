
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, AuthState } from "@/services/auth-service";
import { User } from "@/types";

interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(authService.getAuthState());

  // Update state when authService state changes
  useEffect(() => {
    const checkAuth = () => {
      setAuthState(authService.getAuthState());
    };
    
    // Check initially
    checkAuth();
    
    // Set up interval to check periodically
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const login = async (username: string, password: string) => {
    const user = await authService.login(username, password);
    setAuthState(authService.getAuthState());
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setAuthState(authService.getAuthState());
  };

  const isAdmin = () => {
    return authService.isAdmin();
  };

  const value = {
    authState,
    login,
    logout,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
