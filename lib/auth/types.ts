export type UserRole = "ADMIN" | "ENQUETEUR";
export type UserStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  commune_affectation: string;
  role: UserRole;
  status: UserStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: "USER_APPROVED" | "USER_REJECTED" | "USER_SUSPENDED" | "ROLE_CHANGED";
  target_id: string;
  target_name: string;
  details?: string;
  timestamp: string;
}
