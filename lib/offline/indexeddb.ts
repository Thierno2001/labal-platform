import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "labal-offline";
const DB_VERSION = 1;

interface LabalDB {
  drafts: {
    key: string;
    value: {
      id: string;
      formType: "pme" | "menages" | "transit" | "autorites";
      data: Record<string, unknown>;
      currentStep: number;
      updatedAt: string;
    };
  };
  pending_submissions: {
    key: string;
    value: {
      id: string;
      formType: "pme" | "menages" | "transit" | "autorites";
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

// ============================================================
// Draft Operations (brouillons en cours de saisie)
// ============================================================

export async function saveDraft(
  formType: "pme" | "menages" | "transit" | "autorites",
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

export async function getDraft(formType: "pme" | "menages" | "transit" | "autorites") {
  const db = await getDB();
  return db.get("drafts", `draft-${formType}`);
}

export async function deleteDraft(formType: "pme" | "menages" | "transit" | "autorites") {
  const db = await getDB();
  await db.delete("drafts", `draft-${formType}`);
}

export async function getAllDrafts() {
  const db = await getDB();
  return db.getAll("drafts");
}

// ============================================================
// Pending Submissions (soumissions en attente de sync)
// ============================================================

export async function addPendingSubmission(
  formType: "pme" | "menages" | "transit" | "autorites",
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
