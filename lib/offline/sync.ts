import {
  getPendingSubmissions,
  removePendingSubmission,
  incrementRetryCount,
  markLocalSubmissionSynced,
  addPendingSubmission,
  type FormType,
} from "./indexeddb";

const API_BASE = "/api/enquetes";
const MAX_RETRIES = 5;

let syncInitialized = false;

/**
 * Migre d'éventuelles soumissions stockées dans l'ancienne file localStorage
 */
async function migrateLegacyOfflineQueue() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("labal_offline_queue");
    if (!raw) return;
    const queue = JSON.parse(raw);
    if (Array.isArray(queue) && queue.length > 0) {
      for (const item of queue) {
        if (item && item.type && item.data) {
          await addPendingSubmission(item.type as FormType, item.data);
        }
      }
    }
    localStorage.removeItem("labal_offline_queue");
  } catch {
    // ignore
  }
}

/**
 * Tente de synchroniser toutes les soumissions en attente.
 * Appelé automatiquement lors du retour en ligne ou manuellement depuis /mes-enquetes.
 */
export async function syncPendingSubmissions(): Promise<{
  synced: number;
  failed: number;
}> {
  await migrateLegacyOfflineQueue();
  const pending = await getPendingSubmissions();
  let synced = 0;
  let failed = 0;

  for (const submission of pending) {
    if (submission.retryCount >= MAX_RETRIES) {
      failed++;
      continue;
    }

    try {
      const response = await fetch(`${API_BASE}/${submission.formType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission.data),
      });

      if (response.ok) {
        const resData = await response.json().catch(() => ({}));
        await removePendingSubmission(submission.id);
        markLocalSubmissionSynced(submission.id, resData?.id);
        synced++;
      } else {
        await incrementRetryCount(submission.id);
        failed++;
      }
    } catch {
      await incrementRetryCount(submission.id);
      failed++;
    }
  }

  return { synced, failed };
}

/**
 * Initialise l'écoute de l'événement online pour auto-sync.
 */
export function initAutoSync() {
  if (typeof window === "undefined" || syncInitialized) return;
  syncInitialized = true;

  // Si on est déjà en ligne au chargement, synchroniser les enquêtes en attente
  if (navigator.onLine) {
    syncPendingSubmissions().catch(() => {});
  }

  window.addEventListener("online", async () => {
    const result = await syncPendingSubmissions();
    if (result.synced > 0) {
      console.log(
        `[Labal Sync] ${result.synced} enquête(s) synchronisée(s) avec succès.`
      );
    }
    if (result.failed > 0) {
      console.warn(
        `[Labal Sync] ${result.failed} enquête(s) en échec de synchronisation.`
      );
    }
  });
}
