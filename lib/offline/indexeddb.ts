import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "labal-offline";
const DB_VERSION = 2;
const LOCAL_HISTORY_KEY = "labal_submitted_history_v1";

export type FormType = "pme" | "menages" | "transit" | "autorites";

export interface SubmittedSurveyRecord {
  id: string;
  formType: FormType;
  label: string;
  commune: string;
  enqueteur_id?: string;
  enqueteur_nom?: string;
  enqueteur_email?: string;
  createdAt: string;
  syncStatus: "synced" | "pending";
}

interface LabalDB {
  drafts: {
    key: string;
    value: {
      id: string;
      formType: FormType;
      data: Record<string, unknown>;
      currentStep: number;
      updatedAt: string;
    };
  };
  pending_submissions: {
    key: string;
    value: {
      id: string;
      formType: FormType;
      data: Record<string, unknown>;
      createdAt: string;
      retryCount: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<LabalDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<LabalDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("drafts")) {
          db.createObjectStore("drafts", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("pending_submissions")) {
          db.createObjectStore("pending_submissions", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

// Legacy localStorage draft keys cleanup
const LEGACY_DRAFT_KEYS: Record<FormType, string[]> = {
  pme: ["labal_pme_draft"],
  menages: ["labal_menages_draft"],
  transit: ["labal_transit_form_draft"],
  autorites: ["labal_autorites_draft"],
};

// ============================================================
// Draft Operations (brouillons en cours de saisie)
// ============================================================

export async function saveDraft(
  formType: FormType,
  data: Record<string, unknown>,
  currentStep: number
) {
  const db = await getDB();
  const id = `draft-${formType}`;
  await db.put("drafts", {
    id,
    formType,
    data,
    currentStep,
    updatedAt: new Date().toISOString(),
  });
}

export async function getDraft(formType: FormType) {
  const db = await getDB();
  const draft = await db.get("drafts", `draft-${formType}`);
  if (draft) return draft;

  // Migrate legacy localStorage draft if present
  if (typeof window !== "undefined") {
    for (const key of LEGACY_DRAFT_KEYS[formType] || []) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          localStorage.removeItem(key);
          if (parsed && typeof parsed === "object") {
            return {
              id: `draft-${formType}`,
              formType,
              data: parsed as Record<string, unknown>,
              currentStep: 0,
              updatedAt: new Date().toISOString(),
            };
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
  }
  return undefined;
}

export async function deleteDraft(formType: FormType) {
  const db = await getDB();
  await db.delete("drafts", `draft-${formType}`);
  if (typeof window !== "undefined") {
    for (const key of LEGACY_DRAFT_KEYS[formType] || []) {
      localStorage.removeItem(key);
    }
  }
}

export async function getAllDrafts() {
  const db = await getDB();
  return db.getAll("drafts");
}

// ============================================================
// Pending Submissions (soumissions en attente de sync)
// ============================================================

export async function addPendingSubmission(
  formType: FormType,
  data: Record<string, unknown>
) {
  const db = await getDB();
  const id = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await db.put("pending_submissions", {
    id,
    formType,
    data,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  });
  return id;
}

export async function getPendingSubmissions() {
  const db = await getDB();
  return db.getAll("pending_submissions");
}

export async function removePendingSubmission(id: string) {
  const db = await getDB();
  await db.delete("pending_submissions", id);
}

export async function incrementRetryCount(id: string) {
  const db = await getDB();
  const submission = await db.get("pending_submissions", id);
  if (submission) {
    submission.retryCount += 1;
    await db.put("pending_submissions", submission);
  }
}

// ============================================================
// Local Submitted History (suivi personnel de l'enquêteur)
// ============================================================

export function getLocalSubmittedHistory(): SubmittedSurveyRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordLocalSubmission(record: SubmittedSurveyRecord) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalSubmittedHistory().filter((r) => r.id !== record.id);
    const updated = [record, ...existing].slice(0, 1000);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("[Labal History] Failed to save local submission record", e);
  }
}

export function markLocalSubmissionSynced(pendingId: string, serverId?: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalSubmittedHistory();
    const updated = existing.map((item) =>
      item.id === pendingId
        ? { ...item, id: serverId || item.id, syncStatus: "synced" as const }
        : item
    );
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
