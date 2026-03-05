"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Don't show if dismissed
    if (localStorage.getItem("verbum-install-dismissed")) return;

    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua);
    setIsIOS(ios);

    if (ios) {
      setShow(true);
    } else {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt && "prompt" in deferredPrompt) {
      (deferredPrompt as { prompt: () => void }).prompt();
    }
    setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem("verbum-install-dismissed", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-border px-4 py-3 pb-[calc(var(--sab)+0.75rem)]">
      <div className="flex items-center gap-3">
        <div className="flex-1 text-sm text-t-primary">
          {isIOS ? (
            <p>
              Tap <span className="font-semibold">Share</span> then{" "}
              <span className="font-semibold">Add to Home Screen</span> for the
              best experience
            </p>
          ) : (
            <p>Install Verbum for offline access</p>
          )}
        </div>
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="bg-accent text-white font-semibold text-sm px-4 py-2 rounded-xl"
          >
            Install
          </button>
        )}
        <button
          onClick={dismiss}
          className="text-t-tertiary text-sm px-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
