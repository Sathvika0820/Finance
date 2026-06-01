import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X, ExternalLink, Mail, CreditCard, Wallet, PiggyBank, Globe, MapPin, Shield, Activity, Home, HeartHandshake, Award } from "lucide-react";
import { FinanceService, getServiceName } from "@/data/services";
import { logoUrl } from "@/data/banks";
import { openServiceAction } from "@/lib/serviceRedirect";
import { useTranslation } from "@/lib/i18n";

const SERVICE_ICONS: Record<string, any> = {
  Mail,
  CreditCard,
  Wallet,
  PiggyBank,
  Globe,
  MapPin,
  Shield,
  Activity,
  Home,
  HeartHandshake,
  Award
};

function isPostOfficeService(service: FinanceService) {
  return service.category === "post_office";
}

interface ServiceDetailModalProps {
  service: FinanceService | null;
  lang: string;
  onClose: () => void;
}

export function ServiceDetailModal({ service, lang, onClose }: ServiceDetailModalProps) {
  const [logoErrored, setLogoErrored] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setLogoErrored(false);
    if (!service || typeof window === "undefined") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [service, onClose]);

  if (!service) return null;

  const serviceName = getServiceName(service, lang);
  const serviceDescription = t("officialServiceDescription");
  const Icon = SERVICE_ICONS[service.iconName] || Mail;
  const categoryLabel = t(isPostOfficeService(service) ? "categoryPostOffice" : "categoryInsurance");
  const serviceLogoSrc = service.logo ? service.logo : (service.logoDomain ? logoUrl(service.logoDomain) : "");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center px-0 sm:px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
        />
        
        {/* Modal Sheet Container */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto bg-white/95 rounded-t-[28px] sm:rounded-[24px] shadow-2xl border border-border/65 p-5 pb-6 flex flex-col no-scrollbar backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={serviceName}
        >
          {/* Top handle bar for mobile sheets */}
          <div className="w-12 h-1 bg-muted rounded-full mx-auto -mt-2 mb-4 shrink-0 sm:hidden" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 shrink-0">
            <div className="flex items-start gap-3.5 min-w-0">
              {!logoErrored && serviceLogoSrc ? (
                <div className="w-12 h-12 rounded-2xl bg-white shadow-soft shrink-0 overflow-hidden flex items-center justify-center border border-border/60 p-2.5 transition-transform hover:scale-105">
                  <img
                    src={serviceLogoSrc}
                    alt={`${serviceName} logo`}
                    onError={() => setLogoErrored(true)}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-soft shrink-0">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-[17px] font-extrabold leading-tight text-foreground">{serviceName}</h3>
                <p className="inline-flex mt-1.5 px-2.5 py-0.5 rounded-full bg-muted text-[10px] font-extrabold text-muted-foreground tracking-wide uppercase">
                  {categoryLabel}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-muted/40 hover:bg-muted text-foreground transition-colors shrink-0 outline-none focus:ring-2 focus:ring-ring/30"
              aria-label={t("close")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[13px] font-medium text-muted-foreground leading-relaxed mt-4">
            {serviceDescription}
          </p>

          {/* Localized Trust Note */}
          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 shrink-0">
            <p className="text-[11.5px] font-semibold text-slate-700 leading-relaxed">
              {t("trustNote")}
            </p>
          </div>

          {/* Action Buttons List */}
          <div className="mt-5 flex-1">
            <h4 className="text-[11px] uppercase tracking-[0.1em] font-bold text-muted-foreground mb-3">
              {t("officialActions")}
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {service.actions?.map((action) => {
                const actionLabel = t("openOfficialLink");
                return (
                  <button
                    key={action.id}
                    onClick={(event) => openServiceAction(service.id, action.id, event)}
                    className="w-full min-h-12 px-4 py-3 rounded-2xl fintech-button font-bold text-[13px] flex items-center justify-between gap-3 active:scale-[0.985] transition-all outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer"
                  >
                    <span className="text-left leading-snug">{actionLabel}</span>
                    <ExternalLink className="w-4 h-4 shrink-0 opacity-80" />
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
