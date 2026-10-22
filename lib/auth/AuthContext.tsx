"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile, AuditLog } from "./types";
import { hashPassword, verifyPassword } from "./password";
import { INITIAL_ADMINS, INITIAL_USERS, INITIAL_AUDIT_LOGS } from "./initialData";

export { INITIAL_ADMINS, INITIAL_USERS, INITIAL_AUDIT_LOGS };

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  auditLogs: AuditLog[];
  dbSource: "supabase" | "server_memory";
  autoApproveAll: boolean;
  accessCodes: string[];
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerUser: (
    data: Omit<UserProfile, "id" | "role" | "status" | "created_at">,
    plainPassword: string,
    accessCode?: string
  ) => Promise<{ success: boolean; user?: UserProfile; autoApproved?: boolean; error?: string }>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  validatePendingWithCode: (accessCode: string) => Promise<{ success: boolean; message?: string }>;
  createAccessCode: (newCode: string) => Promise<{ success: boolean; error?: string }>;
  revokeAccessCode: (codeToRemove: string) => Promise<void>;
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
  const [accessCodes, setAccessCodes] = useState<string[]>(["LABAL-GN-2026"]);
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
        if (Array.isArray(data.accessCodes)) {
          setAccessCodes(data.accessCodes);
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
   * Inscription Enquêteur (vérification du code côté serveur uniquement, aucun code exposé en public)
   */
  const registerUser = async (
    data: Omit<UserProfile, "id" | "role" | "status" | "created_at">,
    plainPassword: string,
    accessCode?: string
  ): Promise<{ success: boolean; user?: UserProfile; autoApproved?: boolean; error?: string }> => {
    const hashed = await hashPassword(plainPassword);
    const cleanCode = accessCode?.trim() || "";

    let newUser: UserProfile = {
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
        body: JSON.stringify({ newUser, plainPassword, accessCode: cleanCode }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: resData.error || "Code d'accès invalide.",
        };
      }

      const autoApproved = Boolean(resData.autoApproved);
      if (resData.user) {
        newUser = {
          ...resData.user,
          status: autoApproved ? "APPROVED" : resData.user.status,
        };
      }

      setUsers((prev) => [
        newUser,
        ...prev.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase()),
      ]);
      setCurrentUser(newUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      await refreshUsers();

      return { success: true, user: newUser, autoApproved };
    } catch (err) {
      console.error("[AuthContext] Failed to post new user to server:", err);
      return {
        success: false,
        error: "Erreur réseau lors de l'inscription.",
      };
    }
  };

  /**
   * Auto-validation d'un compte en attente via Code Superviseur (vérifié côté serveur)
   */
  const validatePendingWithCode = async (
    accessCode: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) {
      return { success: false, message: "Aucun utilisateur connecté." };
    }

    const cleanCode = accessCode.trim();
    if (!cleanCode) {
      return { success: false, message: "Veuillez saisir un code d'activation." };
    }

    try {
      const res = await fetch("/api/auth/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userEmail: currentUser.email,
          action: "SELF_APPROVE_CODE",
          accessCode: cleanCode,
        }),
      });

      const resData = await res.json();
      if (!res.ok || resData.success === false) {
        return {
          success: false,
          message: resData.error || "Code d'activation invalide.",
        };
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
    } catch {
      return {
        success: false,
        message: "Erreur de connexion lors de la vérification du code.",
      };
    }
  };

  /**
   * Création d'un nouveau code d'accès par le Superviseur / Admin
   */
  const createAccessCode = async (
    newCode: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_ACCESS_CODE",
          accessCode: newCode,
          adminId: currentUser?.id,
          adminName: currentUser?.full_name,
        }),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Impossible de créer le code." };
      }
      if (Array.isArray(resData.accessCodes)) {
        setAccessCodes(resData.accessCodes);
      }
      await refreshUsers();
      return { success: true };
    } catch {
      return { success: false, error: "Erreur réseau." };
    }
  };

  /**
   * Révocation d'un code d'accès par le Superviseur / Admin
   */
  const revokeAccessCode = async (codeToRemove: string) => {
    try {
      const res = await fetch("/api/auth/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REVOKE_ACCESS_CODE",
          accessCode: codeToRemove,
          adminId: currentUser?.id,
          adminName: currentUser?.full_name,
        }),
      });
      const resData = await res.json();
      if (res.ok && Array.isArray(resData.accessCodes)) {
        setAccessCodes(resData.accessCodes);
      }
      await refreshUsers();
    } catch (err) {
      console.error("[AuthContext] Error revoking code:", err);
    }
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
        accessCodes,
        login,
        logout,
        registerUser,
        approveUser,
        rejectUser,
        validatePendingWithCode,
        createAccessCode,
        revokeAccessCode,
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
