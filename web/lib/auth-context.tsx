"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "./api";

export interface User {
  id: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    router.push("/");
  };

  const register = async (email: string, password: string, displayName?: string) => {
    const res = await api.auth.register(email, password, displayName);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    router.push("/");
  };

  const demoLogin = async () => {
    const demoEmail = "student@habits.study";
    const demoPass = "Student2026!";
    const demoName = "Alex (Student)";

    try {
      // Try login first
      await login(demoEmail, demoPass);
    } catch {
      // If user doesn't exist, register
      try {
        await register(demoEmail, demoPass, demoName);
        // Seed default starter habits for the demo student
        try {
          await api.habits.create({ name: "📚 Deep Study (2 hrs)", monthlyGoal: 25 });
          await api.habits.create({ name: "💧 Hydrate (2L Water)", monthlyGoal: 30 });
          await api.habits.create({ name: "🏃 Exercise / Jogging", monthlyGoal: 20 });
          await api.habits.create({ name: "📖 Read 20 Pages", monthlyGoal: 26 });
          await api.habits.create({ name: "🧘 Mindfulness & Journal", monthlyGoal: 28 });
        } catch {
          // habits creation is optional enhancement
        }
      } catch (err: any) {
        throw new Error(err.message || "Failed to initialize demo account");
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
