import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ExternalLink, Download, AlertCircle, Loader2, Globe } from 'lucide-react';
import { BankAppInfo } from '@/data/bankApps';

type LaunchState = 'idle' | 'trying' | 'not_installed';

interface BankAppLauncherProps {
  bankId: string;
  bankName: string;
  officialWebsite: string;
  app: BankAppInfo | null;
}

function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

export function BankAppLauncher({ bankName, officialWebsite, app }: BankAppLauncherProps) {
  const [launchState, setLaunchState] = useState<LaunchState>('idle');

  const handleOpenWebsite = () => {
    window.open(officialWebsite, '_blank', 'noopener,noreferrer');
  };

  const handleOpenApp = () => {
    if (!app) return;

    if (!isAndroid()) {
      // Non-Android: go straight to Play Store
      window.open(app.playStoreUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setLaunchState('trying');

    // Strategy: try URI scheme first (if available), then intent URL.
    // Listen for page visibility — if page goes hidden, app launched successfully.
    // If page is still visible after timeout, app is not installed.

    let launched = false;

    const onVisibilityChange = () => {
      if (document.hidden) {
        launched = true;
        setLaunchState('idle');
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange, { once: true });

    // Build intent URL without fallback so we can detect failure ourselves
    const intentUrl = `intent://#Intent;package=${app.androidPackage};end`;

    // Try the deep link / intent
    const launchUrl = app.uriScheme ? app.uriScheme : intentUrl;
    window.location.href = launchUrl;

    // After 2.5s if still on page, app not installed
    setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (!launched) {
        setLaunchState('not_installed');
      }
    }, 2500);
  };

  const handleDownload = () => {
    if (app) {
      window.open(app.playStoreUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const resetState = () => setLaunchState('idle');

  return (
    <div className="grid grid-cols-1 gap-3">
      {/* Open Website */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleOpenWebsite}
        className="fintech-card-interactive rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
      >
        <span className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </span>
          <span className="flex flex-col items-start">
            <span className="font-semibold text-sm">Open Website</span>
            <span className="text-xs text-muted-foreground">Official {bankName} website</span>
          </span>
        </span>
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      </motion.button>

      {/* Open App */}
      {app ? (
        <div>
          <AnimatePresence mode="wait">
            {launchState === 'idle' && (
              <motion.button
                key="open-app"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenApp}
                className="fintech-card-interactive rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform w-full"
              >
                <span className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-emerald-500" />
                  </span>
                  <span className="flex flex-col items-start">
                    <span className="font-semibold text-sm">Open App</span>
                    <span className="text-xs text-muted-foreground">{app.appName}</span>
                  </span>
                </span>
                <span className="text-xs font-bold text-muted-foreground">Launch</span>
              </motion.button>
            )}

            {launchState === 'trying' && (
              <motion.div
                key="trying"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="fintech-card rounded-2xl p-4 flex items-center gap-3"
              >
                <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
                <span className="text-sm font-medium">Launching {app.appName}…</span>
              </motion.div>
            )}

            {launchState === 'not_installed' && (
              <motion.div
                key="not-installed"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="fintech-card rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold leading-tight">Official app not installed on this device.</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.appName} was not found.</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold transition-opacity hover:opacity-90 shadow-md shadow-primary/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download on Play Store
                  </button>
                  <button
                    onClick={resetState}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        // No app data — show grayed out placeholder
        <div className="fintech-card rounded-2xl p-4 flex items-center gap-3 opacity-40">
          <span className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </span>
          <span className="flex flex-col items-start">
            <span className="font-semibold text-sm">Open App</span>
            <span className="text-xs text-muted-foreground">App not available for this bank</span>
          </span>
        </div>
      )}
    </div>
  );
}
