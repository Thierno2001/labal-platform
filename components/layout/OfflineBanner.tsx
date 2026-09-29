"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
        setJustReconnected(false);
      }, 3000);
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
          <span>Mode hors-ligne — Vos données sont sauvegardées localement et seront synchronisées au retour du réseau</span>
        </>
      ) : justReconnected ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Connexion rétablie — Synchronisation en cours...</span>
        </>
      ) : null}
    </div>
  );
}
