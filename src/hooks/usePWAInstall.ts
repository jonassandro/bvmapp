import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed as PWA)
    const checkStandalone = () => {
      const standaloneMediaQuery = window.matchMedia('(display-mode: standalone)').matches;
      const navigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isAndroidApp = typeof document !== 'undefined' && document.referrer.includes('android-app://');
      const active = standaloneMediaQuery || navigatorStandalone || isAndroidApp;
      setIsStandalone(active);
    };

    checkStandalone();

    // 2. Check if device is iOS (iPhone/iPad/iPod)
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(isAppleMobile);

    // 3. Listen for display-mode change (e.g. user opens or installs)
    const mql = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    try {
      mql.addEventListener('change', handleMediaChange);
    } catch {
      mql.addListener(handleMediaChange);
    }

    // 4. Capture beforeinstallprompt for Android / Chromium
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser default mini-infobar
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      try {
        mql.removeEventListener('change', handleMediaChange);
      } catch {
        mql.removeListener(handleMediaChange);
      }
    };
  }, []);

  // Trigger the native installation prompt
  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual'> => {
    if (!deferredPrompt) {
      return 'manual';
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
      return choice.outcome;
    } catch (err) {
      console.warn('Falha ao acionar prompt de instalação nativo:', err);
      return 'manual';
    }
  }, [deferredPrompt]);

  return {
    isStandalone,
    isIOS,
    canInstallNative: !!deferredPrompt,
    install,
  };
}
