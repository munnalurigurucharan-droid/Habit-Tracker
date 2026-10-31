"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * No accounts, no passwords, no server. The only "profile" is a display
 * name kept in this browser's localStorage.
 */
export interface User {
  id: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setName: (name: string) => void;
}

const NAME_KEY = "habit-journal:name";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const name = localStorage.getItem(NAME_KEY);
      if (name) setUser({ id: "local", email: "", displayName: name });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setName = (name: string) => {
    localStorage.setItem(NAME_KEY, name);
    setUser({ id: "local", email: "", displayName: name });
    router.push("/");
  };

  return <AuthContext.Provider value={{ user, isLoading, setName }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
