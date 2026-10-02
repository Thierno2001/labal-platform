"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, AuditLog, UserRole, UserStatus } from "./types";

export const INITIAL_ADMINS: UserProfile[] = [
  {
    id: "admin-1",
    email: "admin1@labal-guinee.org",
    full_name: "Marseille Camara",
    phone: "+224 621 00 11 22",
    commune_affectation: "Toutes (Conakry)",
    role: "ADMIN",
    status: "APPROVED",
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
    approved_by: "admin-1",
    approved_at: "2026-09-10T10:00:00Z",
    created_at: "2026-09-10T09:00:00Z",
  },
  {
    id: "enq-2",
    email: "fanta.conde@labal-guinee.org",
    full_name: "Fanta Condé",
    phone: "+224 624 44 55 66",
    commune_affectation: "Kaloum",
    role: "ENQUETEUR",
    status: "PENDING",
    created_at: new Date().toISOString(),
  },
  {
    id: "enq-3",
    email: "sekou.toure@labal-guinee.org",
    full_name: "Sékou Touré",
    phone: "+224 626 99 88 77",
    commune_affectation: "Matoto",
    role: "ENQUETEUR",
    status: "PENDING",
    created_at: new Date().toISOString(),
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
    details: "Approbation initiale pour la zone Ratoma",
    timestamp: "2026-09-10T10:00:00Z",
  },
];

interface AuthContextType {
  currentUser: UserProfile | null;
  users: UserProfile[];
  auditLogs: AuditLog[];
  login: (email: string) => boolean;
  logout: () => void;
  registerUser: (data: Omit<UserProfile, "id" | "role" | "status" | "created_at">) => UserProfile;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  setCurrentUserDirect: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = "labal_auth_user_v1";
const AUTH_USERS_LIST_KEY = "labal_auth_users_v1";
const AUTH_AUDIT_LOGS_KEY = "labal_auth_audit_v1";

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

  const login = (email: string): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      saveState(found, users, auditLogs);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const setCurrentUserDirect = (user: UserProfile) => {
    setCurrentUser(user);
    saveState(user, users, auditLogs);
  };

  const registerUser = (data: Omit<UserProfile, "id" | "role" | "status" | "created_at">): UserProfile => {
    const newUser: UserProfile = {
      ...data,
      id: `user-${Date.now()}`,
      role: "ENQUETEUR",
      status: "PENDING",
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
        setCurrentUserDirect,
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
