import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Smartphone, ExternalLink, ShieldCheck } from "lucide-react";
import { Bank, getBankDisplayName } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";
import { bankLinks } from "@/data/bankLinks";
import { useTranslation } from "@/lib/i18n";

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

interface BankActionModalProps {
  bank: Bank | null;
  onClose: () => void;
}

export function BankActionModal({ bank, onClose }: BankActionModalProps) {
  const { t, lang } = useTranslation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (bank) {
      setErrorMsg(null);
    }
  }, [bank]);

  if (!bank) return null;

  const links = bankLinks[bank.id];
  const displayName = getBankDisplayName(bank, lang);
  const isMobile = isMobileDevice();

  const handleOpenWebsite = () => {
    if (links?.website) {
      window.open(links.website, "_blank", "noopener,noreferrer");
      onClose();
    } else {
      setErrorMsg(t("officialWebsiteUnavailable") || "Official website unavailable.");
    }
  };

  const handleOpenApp = () => {
    if (!links) {
      setErrorMsg("App not installed. Redirecting to store.");
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const storeLink = isIOS ? links.iosApp : links.androidApp;

    if (links.deepLink) {
      const start = Date.now();
      window.location.href = links.deepLink;

      setTimeout(() => {
        if (Date.now() - start < 2000) {
          if (storeLink) {
            window.open(storeLink, "_blank", "noopener,noreferrer");
          } else {
            setErrorMsg("App not installed. Redirecting to store.");
          }
        }
      }, 1500);
    } else if (storeLink) {
      window.open(storeLink, "_blank", "noopener,noreferrer");
    } else {
      setErrorMsg("App not installed. Redirecting to store.");
    }
    
    // We don't instantly close on app try in case they need to see the error message
    setTimeout(onClose, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          className="relative w-full max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden pb-safe z-10"
        >
          {/* Header */}
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">
              How would you like to continue?
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <BankLogo bank={bank} size="lg" />
              <div>
                <p className="font-bold text-lg text-slate-900">{displayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Official Channels</p>
                </div>
              </div>
            </div>

            {errorMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4 text-center">
                <p className="text-sm font-medium text-rose-600 bg-rose-50 py-2 px-3 rounded-lg border border-rose-100">
                  {errorMsg}
                </p>
              </motion.div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleOpenWebsite}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[20px] transition-all active:scale-[0.98] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-indigo-700" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[15px] text-slate-900 leading-tight">{t("openOfficialWebsite") || "Open Official Website"}</p>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">{links?.website ? new URL(links.website).hostname : 'Browser Portal'}</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              {isMobile ? (
                <button
                  onClick={handleOpenApp}
                  className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 border border-slate-900 rounded-[20px] transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[15px] text-white leading-tight">{t("openMobileApp") || "Open Mobile App"}</p>
                      <p className="text-[12px] font-medium text-slate-400 mt-0.5">Secure Banking App</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                </button>
              ) : (
                <div className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 border-dashed rounded-[20px]">
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[15px] text-slate-600 leading-tight">Mobile App</p>
                      <p className="text-[12px] font-medium text-slate-500 mt-0.5 max-w-[200px]">Mobile banking apps are available only on mobile devices.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
