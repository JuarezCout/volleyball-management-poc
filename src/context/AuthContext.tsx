import { createContext, useContext, useState, type ReactNode } from "react";
import type { User, UserRole } from "@/types";
import { mockUsers } from "@/mock";

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  login: (userId: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isCaptain: boolean;
  isPlayer: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userId: string) => {
    const found = mockUsers.find((u) => u.id === userId);
    setUser(found ?? null);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        login,
        logout,
        isAdmin: user?.role === "admin",
        isCaptain: user?.role === "captain",
        isPlayer: user?.role === "player",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
