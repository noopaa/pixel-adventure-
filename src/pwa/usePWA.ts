import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const STORAGE_KEY_DISMISSED = 'pixel_adventure_pwa_dismissed_until';

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  // Check standalone mode and platform
  useEffect(() => {
    // 1. Detect standalone mode
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isNavigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isFullscreenMedia = window.matchMedia('(display-mode: fullscreen)').matches;
      const standalone = isStandaloneMedia || isNavigatorStandalone || isFullscreenMedia;

      setIsStandalone(standalone);
      if (standalone) {
        setIsInstalled(true);
      }
    };

    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsStandalone(true);
        setIsInstalled(true);
      }
    };

    try {
      mediaQuery.addEventListener('change', handleMediaChange);
    } catch {
      // Fallback for older Safari
      mediaQuery.addListener(handleMediaChange);
    }

    // 2. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // 3. Check dismissal timestamp from localStorage
    try {
      const dismissedUntil = localStorage.getItem(STORAGE_KEY_DISMISSED);
      if (dismissedUntil) {
        const timestamp = parseInt(dismissedUntil, 10);
        if (Date.now() < timestamp) {
          setIsDismissed(true);
        } else {
          setIsDismissed(false);
        }
      } else {
        setIsDismissed(false);
      }
    } catch {
      setIsDismissed(false);
    }

    // 4. Query installed related apps if supported
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as unknown as { getInstalledRelatedApps: () => Promise<unknown[]> })
        .getInstalledRelatedApps()
        .then((apps) => {
          if (apps && apps.length > 0) {
            setIsInstalled(true);
          }
        })
        .catch(() => {
          // Ignore
        });
    }

    // 5. Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.removeItem(STORAGE_KEY_DISMISSED);
      } catch {
        // Ignore
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      try {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } catch {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger installation flow
  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual'> => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          return 'accepted';
        } else {
          return 'dismissed';
        }
      } catch {
        return 'manual';
      }
    }
    return 'manual';
  }, [deferredPrompt]);

  // Dismiss prompt for a given duration (default 24 hours)
  const dismiss = useCallback((hours = 24) => {
    setIsDismissed(true);
    try {
      const expiresAt = Date.now() + hours * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY_DISMISSED, expiresAt.toString());
    } catch {
      // Ignore
    }
  }, []);

  // Reset dismissal so user can manually open the install dialog anytime
  const resetDismissal = useCallback(() => {
    setIsDismissed(false);
    try {
      localStorage.removeItem(STORAGE_KEY_DISMISSED);
    } catch {
      // Ignore
    }
  }, []);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isStandalone,
    isIOS,
    isDismissed,
    isSupported,
    install,
    dismiss,
    resetDismissal,
  };
}
