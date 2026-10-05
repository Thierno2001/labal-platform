"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile, AuditLog, UserStatus } from "./types";
import { hashPassword, verifyPassword } from "./password";
import { INITIAL_ADMINS, INITIAL_USERS, INITIAL_AUDIT_LOGS } from "./initialData";

export { INITIAL_ADMINS, INITIAL_USERS, INITIAL_AUDIT_LOGS };

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  auditLogs: AuditLog[];
  dbSource: "supabase" | "server_memory";
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerUser: (data: Omit<UserProfile, "id" | "role" | "status" | "created_at">, plainPassword: string) => Promise<UserProfile>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = "labal_auth_user_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [dbSource, setDbSource] = useState<"supabase" | "server_memory">("server_memory");
  const [mounted, setMounted] = useState(false);

  // Synchronisation centralisée avec le serveur
  const refreshUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/users", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.source) {
          setDbSource(data.source);
        }
        if (data.users && Array.isArray(data.users)) {
          const mergedMap = new Map<string, UserProfile>();
          INITIAL_USERS.forEach((u) => mergedMap.set(u.email.toLowerCase(), u));
          data.users.forEach((u: UserProfile) => mergedMap.set(u.email.toLowerCase(), u));
          
          const finalUsers = Array.from(mergedMap.values());
          setUsers(finalUsers);

          if (currentUser) {
            const freshCurrent = finalUsers.find((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());
            if (freshCurrent && freshCurrent.status !== currentUser.status) {
              setCurrentUser(freshCurrent);
              localStorage.setItem(AUTH_USER_KEY, JSON.stringify(freshCurrent));
            }
          }
        }
        if (data.auditLogs && Array.isArray(data.auditLogs)) {
          setAuditLogs(data.auditLogs);
        }
      }
    } catch (err) {
      console.warn("[AuthContext] Sync error:", err);
    }
  }, [currentUser]);

  useEffect(() => {
    setMounted(true);
    try {
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("[Auth] Failed to load local storage session", e);
    }
    
    refreshUsers();
    const interval = setInterval(() => {
      refreshUsers();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Authentification sécurisée
   */
  const login = async (email: string, plainPassword: string): Promise<{ success: boolean; message?: string }> => {
    await refreshUsers();
    
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, message: "Adresse email inconnue." };
    }

    if (!found.password_hash) {
      return { success: false, message: "Erreur d'authentification : mot de passe non configuré." };
    }

    const isPasswordValid = await verifyPassword(plainPassword, found.password_hash);
    if (!isPasswordValid) {
      return { success: false, message: "Mot de passe incorrect." };
    }

    setCurrentUser(found);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(found));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  /**
   * Inscription Enquêteur
   */
  const registerUser = async (
    data: Omit<UserProfile, "id" | "role" | "status" | "created_at">,
    plainPassword: string
  ): Promise<UserProfile> => {
    const hashed = await hashPassword(plainPassword);

    const newUser: UserProfile = {
      ...data,
      id: `user-${Date.now()}`,
      role: "ENQUETEUR",
      status: "PENDING",
      password_hash: hashed,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUser, plainPassword }),
      });
      if (res.ok) {
        await refreshUsers();
      }
    } catch (err) {
      console.error("[AuthContext] Failed to post new user to server:", err);
    }

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

    return newUser;
  };

  /**
   * Approbation d'un utilisateur
   */
  const approveUser = async (userId: string) => {
    try {
      await fetch("/api/auth/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "APPROVE",
          adminId: currentUser?.id,
          adminName: currentUser?.full_name,
        }),
      });
    } catch (err) {
      console.error("[AuthContext] Error approving user:", err);
    }
    await refreshUsers();
  };

  /**
   * Rejet d'un utilisateur
   */
  const rejectUser = async (userId: string) => {
    try {
      await fetch("/api/auth/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "REJECT",
          adminId: currentUser?.id,
          adminName: currentUser?.full_name,
        }),
      });
    } catch (err) {
      console.error("[AuthContext] Error rejecting user:", err);
    }
    await refreshUsers();
  };

  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        auditLogs,
        dbSource,
        login,
        logout,
        registerUser,
        approveUser,
        rejectUser,
        refreshUsers,
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
