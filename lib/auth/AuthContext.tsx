"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, AuditLog, UserStatus } from "./types";
import { hashPassword, verifyPassword } from "./password";

export const INITIAL_ADMINS: UserProfile[] = [
  {
    id: "admin-1",
    email: "admin1@labal-guinee.org",
    full_name: "Marseille Camara",
    phone: "+224 621 00 11 22",
    commune_affectation: "Toutes (Conakry)",
    role: "ADMIN",
    status: "APPROVED",
    password_hash: "pbkdf2:sha256:100000$a1b2c3d4e5f60718293a4b5c6d7e8f00$3f0582f8ff52d5bc92d8eb493b7e17fed35a2ef5b09ee9851d230087dbc7e7d1",
    approved_by: "SYSTEM",
    approved_at: new Date().toISOString(),
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "admin-2",
    email: "admin2@labal-guinee.org",
    full_name: "Fatoumata Binta Sow",
    phone: "+224 622 33 44 55",
    commune_affectation: "Toutes (Conakry)",
    role: "ADMIN",
    status: "APPROVED",
    password_hash: "pbkdf2:sha256:100000$b2c3d4e5f60718293a4b5c6d7e8f00a1$d4391b42f3bfc68006be2a2bce2e6b158bee74b269d61219c661cba1bcfa69f4",
    approved_by: "SYSTEM",
    approved_at: new Date().toISOString(),
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "admin-3",
    email: "admin3@labal-guinee.org",
    full_name: "Thierno Mamadou Diallo",
    phone: "+224 628 77 88 99",
    commune_affectation: "Toutes (Conakry)",
    role: "ADMIN",
    status: "APPROVED",
    password_hash: "pbkdf2:sha256:100000$c3d4e5f60718293a4b5c6d7e8f00a1b2$578e724db734882d2b7409211cb1b84a5dbc5c9a12acc060ea0861837eab7bd7",
    approved_by: "SYSTEM",
    approved_at: new Date().toISOString(),
    created_at: "2026-09-01T08:00:00Z",
  },
];

export const INITIAL_USERS: UserProfile[] = [
  ...INITIAL_ADMINS,
  {
    id: "enq-1",
    email: "amara.diallo@labal-guinee.org",
    full_name: "Amara Diallo",
    phone: "+224 620 11 22 33",
    commune_affectation: "Ratoma",
    role: "ENQUETEUR",
    status: "APPROVED",
    password_hash: "pbkdf2:sha256:100000$d4e5f60718293a4b5c6d7e8f00a1b2c3$85f18fff54516956949152fe0d16a0ff0b82f0ab3d0b47be51573c6f168729d0",
    approved_by: "admin-1",
    approved_at: "2026-09-10T10:00:00Z",
    created_at: "2026-09-10T09:00:00Z",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "audit-1",
    actor_id: "admin-1",
    actor_name: "Marseille Camara",
    action: "USER_APPROVED",
    target_id: "enq-1",
    target_name: "Amara Diallo",
    details: "Approbation du compte Enquêteur pour la zone Ratoma",
    timestamp: "2026-09-10T10:00:00Z",
  },
];

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  auditLogs: AuditLog[];
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerUser: (data: Omit<UserProfile, "id" | "role" | "status" | "created_at">, plainPassword: string) => Promise<UserProfile>;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = "labal_auth_user_v2";
const AUTH_USERS_LIST_KEY = "labal_auth_users_v2";
const AUTH_AUDIT_LOGS_KEY = "labal_auth_audit_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      const savedUsersList = localStorage.getItem(AUTH_USERS_LIST_KEY);
      const savedAuditLogs = localStorage.getItem(AUTH_AUDIT_LOGS_KEY);

      if (savedUsersList) {
        setUsers(JSON.parse(savedUsersList));
      } else {
        localStorage.setItem(AUTH_USERS_LIST_KEY, JSON.stringify(INITIAL_USERS));
      }

      if (savedAuditLogs) {
        setAuditLogs(JSON.parse(savedAuditLogs));
      } else {
        localStorage.setItem(AUTH_AUDIT_LOGS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      }

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error("[Auth] Failed to load local storage session", e);
    }
  }, []);

  const saveState = (updatedUser: UserProfile | null, updatedUsers: UserProfile[], updatedLogs: AuditLog[]) => {
    try {
      if (updatedUser) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
      localStorage.setItem(AUTH_USERS_LIST_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(AUTH_AUDIT_LOGS_KEY, JSON.stringify(updatedLogs));
    } catch (e) {
      console.error("[Auth] Storage save error", e);
    }
  };

  /**
   * Authentification sécurisée par Email et Mot de passe Haché (PBKDF2/SHA-256)
   */
  const login = async (email: string, plainPassword: string): Promise<{ success: boolean; message?: string }> => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, message: "Adresse email inconnue." };
    }

    if (!found.password_hash) {
      return { success: false, message: "Erreur d'authentification : mot de passe non configuré." };
    }

    // Vérification cryptographique Timing-Safe du Hash PBKDF2
    const isPasswordValid = await verifyPassword(plainPassword, found.password_hash);
    if (!isPasswordValid) {
      return { success: false, message: "Mot de passe incorrect." };
    }

    setCurrentUser(found);
    saveState(found, users, auditLogs);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  /**
   * Inscription Enquêteur avec hachage sécurisé du mot de passe
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

    const nextUsers = [newUser, ...users];
    setUsers(nextUsers);
    setCurrentUser(newUser);
    saveState(newUser, nextUsers, auditLogs);
    return newUser;
  };

  const approveUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const updatedUsers = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            status: "APPROVED" as UserStatus,
            approved_by: currentUser?.id || "admin-1",
            approved_at: new Date().toISOString(),
          }
        : u
    );

    const newAuditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actor_id: currentUser?.id || "admin-1",
      actor_name: currentUser?.full_name || "Marseille Camara",
      action: "USER_APPROVED",
      target_id: target.id,
      target_name: target.full_name,
      details: `Approbation du compte Enquêteur (${target.commune_affectation})`,
      timestamp: new Date().toISOString(),
    };

    const nextLogs = [newAuditLog, ...auditLogs];
    setUsers(updatedUsers);
    setAuditLogs(nextLogs);

    let nextCurrent = currentUser;
    if (currentUser?.id === userId) {
      nextCurrent = { ...currentUser, status: "APPROVED", approved_at: new Date().toISOString() };
      setCurrentUser(nextCurrent);
    }

    saveState(nextCurrent, updatedUsers, nextLogs);
  };

  const rejectUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const updatedUsers = users.map((u) =>
      u.id === userId
        ? {
            ...u,
            status: "REJECTED" as UserStatus,
          }
        : u
    );

    const newAuditLog: AuditLog = {
      id: `audit-${Date.now()}`,
      actor_id: currentUser?.id || "admin-1",
      actor_name: currentUser?.full_name || "Marseille Camara",
      action: "USER_REJECTED",
      target_id: target.id,
      target_name: target.full_name,
      details: "Demande d'inscription refusée par l'administration",
      timestamp: new Date().toISOString(),
    };

    const nextLogs = [newAuditLog, ...auditLogs];
    setUsers(updatedUsers);
    setAuditLogs(nextLogs);

    let nextCurrent = currentUser;
    if (currentUser?.id === userId) {
      nextCurrent = { ...currentUser, status: "REJECTED" };
      setCurrentUser(nextCurrent);
    }

    saveState(nextCurrent, updatedUsers, nextLogs);
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
        login,
        logout,
        registerUser,
        approveUser,
        rejectUser,
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
