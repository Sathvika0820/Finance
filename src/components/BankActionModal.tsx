import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Bank, getBankDisplayName } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";
import { SmartRedirectActions } from "@/components/SmartRedirectActions";
import { getInstitutionRedirect } from "@/data/institutionRedirects";
import { useTranslation } from "@/lib/i18n";

interface BankActionModalProps {
  bank: Bank | null;
  onClose: () => void;
}

export function BankActionModal({ bank, onClose }: BankActionModalProps) {
  const { lang } = useTranslation();

  useEffect(() => {
    if (!bank) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [bank, onClose]);

  if (!bank) return null;

  const displayName = getBankDisplayName(bank, lang);
  const institution = getInstitutionRedirect("bank", bank.id) ?? {
    id: bank.id,
    kind: "bank" as const,
    name: displayName,
    website: bank.officialWebsiteUrl || bank.officialWebsite,
    appName: `${displayName} app`,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.96 }}
          className="relative z-10 w-full max-w-sm overflow-hidden rounded-t-[32px] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-4 shadow-2xl sm:rounded-[32px]"
          role="dialog"
          aria-modal="true"
          aria-label={`${displayName} official redirects`}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-blue-900/60">Official Channels</p>
              <h2 className="mt-1 text-xl font-black leading-tight text-slate-950">Continue with {displayName}</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <SmartRedirectActions
            institution={institution}
            logo={<BankLogo bank={bank} size="md" />}
            onWebsiteOpened={onClose}
            onAppResolved={onClose}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
