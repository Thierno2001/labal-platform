"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile, AuditLog } from "./types";
import { hashPassword, verifyPassword } from "./password";
import { INITIAL_ADMINS, INITIAL_USERS, INITIAL_AUDIT_LOGS } from "./initialData";

export { INITIAL_ADMINS, INITIAL_USERS, INITIAL_AUDIT_LOGS };

const VALID_CLIENT_CODES = new Set(["LABAL2026", "LABAL-2026", "CONAKRY2026", "LABAL-GN"]);

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  auditLogs: AuditLog[];
  dbSource: "supabase" | "server_memory";
  autoApproveAll: boolean;
  defaultAccessCode: string;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerUser: (
    data: Omit<UserProfile, "id" | "role" | "status" | "created_at">,
    plainPassword: string,
    accessCode?: string
  ) => Promise<{ user: UserProfile; autoApproved: boolean }>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  validatePendingWithCode: (accessCode: string) => Promise<{ success: boolean; message?: string }>;
  toggleAutoApproveAll: (enabled: boolean) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = "labal_auth_user_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [dbSource, setDbSource] = useState<"supabase" | "server_memory">("server_memory");
  const [autoApproveAll, setAutoApproveAll] = useState<boolean>(false);
  const [defaultAccessCode, setDefaultAccessCode] = useState<string>("LABAL2026");
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
        if (typeof data.autoApproveAll === "boolean") {
          setAutoApproveAll(data.autoApproveAll);
        }
        if (data.defaultAccessCode) {
          setDefaultAccessCode(data.defaultAccessCode);
        }
        if (data.users && Array.isArray(data.users)) {
          const mergedMap = new Map<string, UserProfile>();
          INITIAL_USERS.forEach((u) => mergedMap.set(u.email.toLowerCase(), u));
          data.users.forEach((u: UserProfile) => mergedMap.set(u.email.toLowerCase(), u));

          const finalUsers = Array.from(mergedMap.values());
          setUsers(finalUsers);

          if (currentUser) {
            const freshCurrent = finalUsers.find(
              (u) => u.email.toLowerCase() === currentUser.email.toLowerCase()
            );
            if (freshCurrent && freshCurrent.status !== currentUser.status) {
              // Preserve local APPROVED status if user already self-validated via code
              if (!(currentUser.status === "APPROVED" && freshCurrent.status === "PENDING")) {
                setCurrentUser(freshCurrent);
                localStorage.setItem(AUTH_USER_KEY, JSON.stringify(freshCurrent));
              }
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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Authentification sécurisée
   */
  const login = async (
    email: string,
    plainPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
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
   * Inscription Enquêteur (avec validation automatique sans intervention humaine si code valide)
   */
  const registerUser = async (
    data: Omit<UserProfile, "id" | "role" | "status" | "created_at">,
    plainPassword: string,
    accessCode?: string
  ): Promise<{ user: UserProfile; autoApproved: boolean }> => {
    const hashed = await hashPassword(plainPassword);
    const cleanCode = accessCode?.trim().toUpperCase() || "";
    const isCodeValid =
      autoApproveAll ||
      VALID_CLIENT_CODES.has(cleanCode) ||
      data.email.trim().toLowerCase().endsWith("@labal-guinee.org");

    const initialStatus = isCodeValid ? "APPROVED" : "PENDING";

    let newUser: UserProfile = {
      ...data,
      id: `user-${Date.now()}`,
      role: "ENQUETEUR",
      status: initialStatus,
      password_hash: hashed,
      approved_by: isCodeValid ? "AUTO_SYSTEM" : null,
      approved_at: isCodeValid ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
    };

    let autoApproved = isCodeValid;

    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUser, plainPassword, accessCode: cleanCode }),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.user) {
          newUser = {
            ...resData.user,
            status: resData.autoApproved || isCodeValid ? "APPROVED" : resData.user.status,
          };
        }
        if (typeof resData.autoApproved === "boolean") {
          autoApproved = resData.autoApproved || isCodeValid;
        }
        await refreshUsers();
      }
    } catch (err) {
      console.error("[AuthContext] Failed to post new user to server:", err);
    }

    setUsers((prev) => [newUser, ...prev.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase())]);
    setCurrentUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));

    return { user: newUser, autoApproved };
  };

  /**
   * Auto-validation d'un compte en attente via Code d'Accès Terrain (sans intervention humaine)
   */
  const validatePendingWithCode = async (
    accessCode: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) {
      return { success: false, message: "Aucun utilisateur connecté." };
    }

    const cleanCode = accessCode.trim().toUpperCase();
    const isCodeOk =
      VALID_CLIENT_CODES.has(cleanCode) ||
      currentUser.email.toLowerCase().endsWith("@labal-guinee.org");

    if (!isCodeOk) {
      return {
        success: false,
        message: "Code d'accès invalide. Utilisez le code communiqué par l'équipe Labal (ex: LABAL2026).",
      };
    }

    try {
      await fetch("/api/auth/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userEmail: currentUser.email,
          action: "SELF_APPROVE_CODE",
          accessCode: cleanCode,
        }),
      });
    } catch (err) {
      console.warn("[AuthContext] Self-approve server sync warning:", err);
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      status: "APPROVED",
      approved_by: "AUTO_SYSTEM",
      approved_at: new Date().toISOString(),
    };

    setCurrentUser(updatedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
    setUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === updatedUser.email.toLowerCase() ? updatedUser : u))
    );

    return { success: true };
  };

  /**
   * Approbation d'un utilisateur par Admin
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
   * Rejet d'un utilisateur par Admin
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

  /**
   * Bascule du mode d'auto-approbation intégrale (sans code requis)
   */
  const toggleAutoApproveAll = async (enabled: boolean) => {
    setAutoApproveAll(enabled);
    try {
      await fetch("/api/auth/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TOGGLE_AUTO_APPROVE",
          autoApproveAll: enabled,
        }),
      });
    } catch (err) {
      console.error("[AuthContext] Error toggling autoApproveAll:", err);
    }
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
        autoApproveAll,
        defaultAccessCode,
        login,
        logout,
        registerUser,
        approveUser,
        rejectUser,
        validatePendingWithCode,
        toggleAutoApproveAll,
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
