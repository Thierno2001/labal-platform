import {
  getPendingSubmissions,
  removePendingSubmission,
  incrementRetryCount,
} from "./indexeddb";

const API_BASE = "/api/enquetes";
const MAX_RETRIES = 5;

/**
 * Tente de synchroniser toutes les soumissions en attente.
 * Appelé automatiquement lors du retour en ligne.
 */
export async function syncPendingSubmissions(): Promise<{
  synced: number;
  failed: number;
}> {
  const pending = await getPendingSubmissions();
  let synced = 0;
  let failed = 0;

  for (const submission of pending) {
    if (submission.retryCount >= MAX_RETRIES) {
      // Trop de tentatives — on garde pour traitement manuel
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
        await removePendingSubmission(submission.id);
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
  if (typeof window === "undefined") return;

  window.addEventListener("online", async () => {
    const result = await syncPendingSubmissions();
    if (result.synced > 0) {
      console.log(
        `[Lâbal Sync] ${result.synced} enquête(s) synchronisée(s) avec succès.`
      );
    }
    if (result.failed > 0) {
      console.warn(
        `[Lâbal Sync] ${result.failed} enquête(s) en échec de synchronisation.`
      );
    }
  });
}
