import type { UserProfile, AuditLog } from "./types";

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
    approved_at: "2026-09-01T08:00:00Z",
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
    approved_at: "2026-09-01T08:00:00Z",
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
    approved_at: "2026-09-01T08:00:00Z",
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
