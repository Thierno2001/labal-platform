"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { initAutoSync, syncPendingSubmissions } from "@/lib/offline/sync";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    initAutoSync();

    const handleOnline = async () => {
      setIsOnline(true);
      setJustReconnected(true);
      setShowBanner(true);
      try {
        const res = await syncPendingSubmissions();
        if (res.synced > 0) {
          setSyncedCount(res.synced);
        }
      } catch {
        // ignore
      }
      setTimeout(() => {
        setShowBanner(false);
        setJustReconnected(false);
        setSyncedCount(null);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <div
      className={
        !isOnline
          ? "offline-banner flex items-center justify-center gap-2"
          : "online-banner flex items-center justify-center gap-2"
      }
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span>
            Mode hors-ligne — Vos données sont sauvegardées localement et seront synchronisées au retour du réseau
          </span>
        </>
      ) : justReconnected ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>
            {syncedCount && syncedCount > 0
              ? `Connexion rétablie — ${syncedCount} enquête(s) hors-ligne synchronisée(s) avec succès !`
              : "Connexion rétablie — Synchronisation vérifiée."}
          </span>
        </>
      ) : null}
    </div>
  );
}
