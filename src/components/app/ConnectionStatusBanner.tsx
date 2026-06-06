import { useEffect, useRef, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

type ConnectionState = "online" | "offline" | "reconnected";

function getInitialConnectionState(): ConnectionState {
  if (typeof navigator === "undefined") return "online";
  return navigator.onLine ? "online" : "offline";
}

export function ConnectionStatusBanner() {
  const [status, setStatus] = useState<ConnectionState>(getInitialConnectionState);
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;
    let hideTimer: number | undefined;

    function handleOffline() {
      if (hideTimer) window.clearTimeout(hideTimer);
      setStatus("offline");
    }

    function handleOnline() {
      if (!hasMounted.current) return;
      setStatus("reconnected");
      hideTimer = window.setTimeout(() => setStatus("online"), 3200);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      if (hideTimer) window.clearTimeout(hideTimer);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (status === "online") return null;

  const isOffline = status === "offline";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className={
          "pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-xl " +
          (isOffline
            ? "border-amber-400/40 bg-amber-950/90 text-amber-50"
            : "border-emerald-400/40 bg-emerald-950/90 text-emerald-50")
        }
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10">
          {isOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
        </span>
        <span>
          {isOffline
            ? "You are currently using the app offline. Saved and local features still work."
            : "Now connected."}
        </span>
      </div>
    </div>
  );
}
