import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { User } from "@/types";
import api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: { email: string; password: string; name: string; phone?: string; location?: string; role?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("fixitnow_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("fixitnow_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get("/auth/me")
        .then((res) => {
          setUser(res.data.user ?? res.data);
          localStorage.setItem("fixitnow_user", JSON.stringify(res.data.user ?? res.data));
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("fixitnow_token");
          localStorage.removeItem("fixitnow_user");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const payload = res.data?.data || res.data;
      const newToken = payload?.token;
      const newUser = payload?.user;
      if (!newToken) {
        throw new Error(res.data?.message || "Failed to log in");
      }
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("fixitnow_token", newToken);
      localStorage.setItem("fixitnow_user", JSON.stringify(newUser));
      return true;
    } catch (err: any) {
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fixitnow_token");
    localStorage.removeItem("fixitnow_user");
    window.location.href = "/";
  }, []);

  const register = useCallback(async (data: { email: string; password: string; name: string; phone?: string; location?: string; role?: string }) => {
    try {
      const res = await api.post("/auth/register", data);
      const payload = res.data?.data || res.data;
      const newToken = payload?.token;
      const newUser = payload?.user;
      if (!newToken) {
        throw new Error(res.data?.message || "Failed to register");
      }
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("fixitnow_token", newToken);
      localStorage.setItem("fixitnow_user", JSON.stringify(newUser));
      return true;
    } catch (err: any) {
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
