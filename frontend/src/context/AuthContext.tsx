import React, { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, checkAuth } from "../services/api";

interface AuthState {
  authenticated: boolean;
  username: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    username: null,
    loading: true,
  });

  useEffect(() => {
    checkAuth()
      .then((result) => {
        setState({ authenticated: result.authenticated, username: result.username ?? null, loading: false });
      })
      .catch(() => {
        setState({ authenticated: false, username: null, loading: false });
      });
  }, []);

  const signIn = async (username: string, password: string) => {
    const result = await apiLogin(username, password);
    setState({ authenticated: true, username: result.username, loading: false });
  };

  const signOut = async () => {
    await apiLogout();
    setState({ authenticated: false, username: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
