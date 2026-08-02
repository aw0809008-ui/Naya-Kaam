"use client";

import { useEffect, useState } from "react";
import { X, Download, Share, ShieldCheck } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWARegister() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("SW registration failed: ", err);
      });
    }

    // Do not show prompt if already in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handleBeforeInstall = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
      setTimeout(() => setShow(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    let dismissed = false;
    try {
      dismissed = !!localStorage.getItem("nayakaam_pwa_dismissed");
    } catch {
      dismissed = false;
    }

    // Check for iOS Safari
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    if (isIOSDevice && !dismissed) {
      setTimeout(() => {
        setIsIOS(true);
        setShow(true);
      }, 3000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    try {
      localStorage.setItem("nayakaam_pwa_dismissed", "1");
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setShow(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 md:left-auto md:right-5 md:w-80 z-50 animate-fade-in">
      <div className="rounded-2xl p-4 bg-white border border-[#E5E7EB] shadow-xl text-[#1A1A1A] relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
          aria-label="Close prompt"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1E5AA8] text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold font-heading text-[#1A1A1A]">Install Naya Kaam App</h4>
            <p className="text-xs text-[#6B7280]">
              {isIOS ? "Fast access from your Home Screen" : "Instant worker search & offline support"}
            </p>
          </div>
        </div>

        {isIOS ? (
          <div className="mt-3 p-3 rounded-xl bg-[#F7F8FA] border border-gray-100 text-xs text-gray-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1E5AA8]">1.</span> Tap <Share size={14} className="text-[#1E5AA8]" /> Share button below
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1E5AA8]">2.</span> Select &quot;Add to Home Screen&quot;
            </div>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="mt-3.5 w-full py-2.5 rounded-xl bg-[#1E5AA8] hover:bg-[#154277] text-white text-xs font-bold font-heading shadow-sm transition flex items-center justify-center gap-2"
          >
            <Download size={15} /> Install Naya Kaam
          </button>
        )}
      </div>
    </div>
  );
}
