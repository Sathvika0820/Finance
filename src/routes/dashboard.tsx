import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown, Search, ExternalLink, ArrowDownUp, Settings, Landmark, Building2, Wallet, CreditCard, Home, Users, X, Mail, PiggyBank, Globe, MapPin, Shield, Activity, HeartHandshake, Award } from "lucide-react";
import { BANKS, CATEGORIES, getBankDisplayName, Bank, logoUrl, bankMatchesSearch } from "@/data/banks";
import { SERVICES_DATA, FinanceService, ServiceCategory, getServiceDescription, getServiceName } from "@/data/services";
import { openServiceAction } from "@/lib/serviceRedirect";
import { runServicesHealthCheckBackground } from "@/lib/urlHealth";
import { BankLogo } from "@/components/BankLogo";
import { useFavorites, pushRecent } from "@/lib/favorites";
import { AppShell } from "@/components/AppShell";
import { SettingsModal } from "@/components/SettingsModal";
import { CrestLogo } from "@/components/CrestLogo";
import { useVoiceAssistant } from "@/lib/voice";
import { LANGUAGE_OPTIONS, useTranslation } from "@/lib/i18n";
import { SmartGuidanceModal } from "@/components/SmartGuidanceModal";
import { SafetyShieldModal } from "@/components/SafetyShieldModal";
import { FinancialInclusionModal } from "@/components/FinancialInclusionModal";
import { CompareBankingModal } from "@/components/CompareBankingModal";
import { Lightbulb, ShieldCheck, ArrowLeftRight } from "lucide-react";
import { OfficialLinkButton, UNVERIFIED_LABEL } from "@/components/OfficialLinkButton";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "BankHub Dashboard — All your banks, one smart gateway" },
      {
        name: "description",
        content:
          "Access official bank links, AI banking assistance, loan comparison, fraud safety, and financial inclusion support from BankHub.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

const CATEGORY_ICONS: Record<string, { icon: any, color: string, bg: string }> = {
  "Public Sector": { icon: Landmark, color: "text-slate-700", bg: "bg-slate-100" },
  "Private Sector": { icon: Building2, color: "text-emerald-700", bg: "bg-emerald-50" },
  "Small Finance": { icon: Wallet, color: "text-amber-700", bg: "bg-amber-50" },
  "Payments": { icon: CreditCard, color: "text-sky-700", bg: "bg-sky-50" },
  "Regional Rural": { icon: Home, color: "text-lime-700", bg: "bg-lime-50" },
  "Co-operative": { icon: Users, color: "text-teal-700", bg: "bg-teal-50" },
};

const SURFACE_CARD = "fintech-card rounded-[18px]";
const SURFACE_CARD_INTERACTIVE = "fintech-card-interactive rounded-[18px]";
const PRIMARY_ACTION = "fintech-button rounded-[12px] font-bold active:scale-[0.98] transition-all";
const SECONDARY_ACTION = "fintech-button-secondary rounded-[12px] font-bold active:scale-[0.98] transition-all";
const CONTROL_INPUT = "fintech-input rounded-xl outline-none transition-all";

function getCatKey(cat: string) {
  const map: Record<string, string> = {
    "Public Sector": "publicSector",
    "Private Sector": "privateSector",
    "Small Finance": "smallFinance",
    "Payments": "payments",
    "Regional Rural": "regionalRural",
    "Co-operative": "cooperative"
  };
  return map[cat] || cat;
}

const BANKS_BY_CATEGORY = CATEGORIES.reduce<Record<string, Bank[]>>((groups, category) => {
  groups[category] = BANKS.filter((bank) => bank.category === category);
  return groups;
}, {});

import { getOfficialLink } from "@/data/officialLinks";

function SelectedBankTile({ bank, openBankSafely, speakVoice, t, lang }: { bank: Bank, openBankSafely: (b: Bank, source?: string, event?: any) => void, speakVoice: any, t: any, lang: any }) {
  const { toggle } = useFavorites();
  const displayName = getBankDisplayName(bank, lang);
  const officialUrl = getOfficialLink("banks", bank.id);
  const isVerified = !!officialUrl;
  
  return (
    <div className={`${SURFACE_CARD_INTERACTIVE} p-4 flex flex-col items-center gap-3 min-w-[125px] relative`}>
      <button
        disabled={!isVerified}
        onClick={(e) => {
          if (!isVerified) return;
          pushRecent(bank.id);
          openBankSafely(bank, "selected_bank", e);
        }} 
        className={`flex flex-col items-center gap-2 w-full pt-1 ${isVerified ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`} 
        aria-label={isVerified ? `Open ${displayName}` : "Official link not verified yet."}
      >
        <BankLogo bank={bank} size="md" />
        <div className="text-center mt-1">
          <p className="font-bold text-[12px] text-foreground leading-tight line-clamp-1">{displayName}</p>
          <p className="text-[9px] font-semibold text-muted-foreground mt-0.5 leading-tight">
            {isVerified ? t(getCatKey(bank.category)) : "Official link not verified yet."}
          </p>
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          speakVoice("bankRemoved", { bank });
          toggle(bank.id);
        }}
        aria-label="Remove from favorites"
        className="absolute top-2.5 right-2.5 rounded-full p-1 hover:bg-rose-50 transition-colors"
      >
        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
      </button>
    </div>
  );
}

function PopularBankRow({ bank, openBankSafely, t, lang }: { bank: Bank, openBankSafely: (b: Bank, source?: string, event?: any) => void, t: any, lang: any }) {
  const displayName = getBankDisplayName(bank, lang);
  const officialUrl = getOfficialLink("banks", bank.id);
  const isVerified = !!officialUrl;

  return (
    <button 
      disabled={!isVerified}
      onClick={(e) => {
        if (!isVerified) return;
        pushRecent(bank.id);
        openBankSafely(bank, "popular_bank", e);
      }}
      className={`w-full flex items-center justify-between p-3 active:bg-muted/50 hover:bg-slate-50/70 transition-colors ${
        isVerified ? "cursor-pointer" : "cursor-not-allowed opacity-60"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <BankLogo bank={bank} size="sm" />
        <div className="text-left min-w-0">
          <p className="font-bold text-[13px] text-foreground truncate">{displayName}</p>
          <p className="text-[10px] font-semibold text-muted-foreground mt-0.5 leading-tight">
            {isVerified ? t(getCatKey(bank.category)) : "Official link not verified yet."}
          </p>
        </div>
      </div>
      {isVerified && <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />}
    </button>
  );
}

const SERVICE_FAV_KEY = "bankHubFavoriteServices";
const LEGACY_SERVICE_FAV_KEY = "bankhub:serviceFavorites";

function readServiceFavs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = window.localStorage.getItem(SERVICE_FAV_KEY);
    if (v) return JSON.parse(v) as string[];

    const legacy = window.localStorage.getItem(LEGACY_SERVICE_FAV_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as string[];
      window.localStorage.setItem(SERVICE_FAV_KEY, JSON.stringify(parsed));
      return parsed;
    }

    return [];
  } catch {
    return [];
  }
}

function writeServiceFavs(value: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SERVICE_FAV_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(`bankhub:${SERVICE_FAV_KEY}`));
}

export function useServiceFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readServiceFavs());
    const handler = () => setIds(readServiceFavs());
    window.addEventListener(`bankhub:${SERVICE_FAV_KEY}`, handler);
    return () => window.removeEventListener(`bankhub:${SERVICE_FAV_KEY}`, handler);
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = readServiceFavs();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    writeServiceFavs(next);
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, isFavorite };
}

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

const LOCAL_STRINGS: Record<string, Record<string, string>> = {
  english: {
    postOfficeInsurance: "Post Office & Insurance",
    postOfficeServices: "Post Office Services",
    insuranceServices: "Insurance Services",
    trustNote: "Bank Hub redirects only to official service websites. No credentials are stored.",
  },
  hindi: {
    postOfficeInsurance: "डाकघर और बीमा",
    postOfficeServices: "डाकघर सेवाएं",
    insuranceServices: "बीमा सेवाएं",
    trustNote: "Bank Hub केवल आधिकारिक सेवा वेबसाइटों पर रीडायरेक्ट करता है। कोई क्रेडेंशियल संग्रहीत नहीं किए जाते।",
  },
  telugu: {
    postOfficeInsurance: "పోస్ట్ ఆಫೀಸ್ & ఇన్సూరెన్స్",
    postOfficeServices: "పోస్ట్ ఆఫీస్ సేవలు",
    insuranceServices: "ಇನ್ಸೂರೆನ್ಸ್ సేవలు",
    trustNote: "Bank Hub అధికారిక సేవా వెబ్‌సైట్‌లకు మాత్రమే మళ్లిస్తుంది. ఎలాంటి క్రెడెన్షియల్స్ నిల్వ చేయబడవు.",
  }
};

type ServiceGroupKey = "post_office" | "insurance";

function isPostOfficeService(service: FinanceService) {
  return service.category === "post_office" || service.category === "post_office_bank";
}

function isInsuranceService(service: FinanceService) {
  return service.category === "insurance" || service.category === "insurance_regulator";
}

const SERVICE_STRINGS: Record<string, Record<string, string>> = {
  english: {
    postOfficeInsurance: "Post Office & Insurance",
    postOfficeServices: "Post Office Services",
    insuranceServices: "Insurance Services",
    searchPostOffice: "Search post office services...",
    searchInsurance: "Search insurance services...",
    noMatchingServices: "No matching services found.",
    services: "services",
    categoryPostOffice: "Post Office",
    categoryInsurance: "Insurance",
    officialActions: "Official Actions",
    closeServiceDetails: "Close service details",
    modalTrustNote: "Bank Hub redirects only to official service websites. No credentials are stored.",
    trustNote: "Bank Hub redirects only to official service websites. No credentials are stored.",
  },
  hindi: {
    postOfficeInsurance: "डाकघर और बीमा",
    postOfficeServices: "डाकघर सेवाएं",
    insuranceServices: "बीما सेवाएं",
    searchPostOffice: "डाकघर सेवाएं खोजें...",
    searchInsurance: "बीमा सेवाएं खोजें...",
    noMatchingServices: "कोई मिलती-जुलती सेवा नहीं मिली।",
    services: "सेवाएं",
    categoryPostOffice: "डाकघर",
    categoryInsurance: "बीमा",
    officialActions: "आधिकारिक कार्य",
    closeServiceDetails: "सेवा विवरण बंद करें",
    modalTrustNote: "आपको केवल आधिकारिक सेवा वेबसाइटों पर भेजा जाएगा। Bank Hub कोई क्रेडेंशियल सेव नहीं करता।",
    trustNote: "Bank Hub केवल आधिकारिक सेवा वेबसाइटों पर रीडायरेक्ट करता है। कोई क्रेडेंशियल संग्रहीत नहीं किए जाते।",
  },
  telugu: {
    postOfficeInsurance: "పోస్టాఫీస్ మరియు ఇన్సూరెన్స్",
    postOfficeServices: "పోస్టಾఫీస్ సేవలు",
    insuranceServices: "ಇನ್ಸೂರೆನ್ಸ್ సేవలు",
    searchPostOffice: "పోస్టಾఫీస్ సేవలను వెతಕండి...",
    searchInsurance: "ಇನ್ಸೂರೆನ್ಸ್ సేవలను వెతಕండి...",
    noMatchingServices: "ಸరిపోలే సేవలు కనబడలేదు.",
    services: "సేವಗಳು",
    categoryPostOffice: "పోస్టಾఫీస్",
    categoryInsurance: "ಇನ್ಸೂರೆన్స్",
    officialActions: "అధికారిక చర్యలు",
    closeServiceDetails: "సేవా వివరాలను మూసివేయండి",
    modalTrustNote: "మీరు అధికారిక సేవా వెబ్‌సైట్లకే పంపబడతారు. Bank Hub ఎలాంటి క్రెడెన్షియల్స్‌ను సేవ్ చేయದು.",
    trustNote: "Bank Hub అధికారిక సేవా వెబ్‌సైట్‌లకు మాత్రమే మళ్లిస్తుంది. ఎలాంటి క్రెడెన్షియల్స్ నిల్వ చేయబడవు.",
  },
};

interface ServiceCardProps {
  service: FinanceService;
  isFav: boolean;
  onToggleFav: () => void;
  onOpen: (e: any) => void;
  lang: string;
}

function ServiceCard({ service, isFav, onToggleFav, onOpen, lang }: ServiceCardProps) {
  const [logoErrored, setLogoErrored] = useState(false);
  const Icon = SERVICE_ICONS[service.iconName] || Mail;
  const serviceName = getServiceName(service, lang);
  const serviceDescription = getServiceDescription(service, lang);
  const serviceLogoSrc = service.logoDomain ? logoUrl(service.logoDomain) : "";
  const officialItem = {
    name: serviceName,
    officialWebsite: service.officialWebsite,
    verified: service.verified,
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onOpen(e);
        }
      }}
      aria-label={`Open ${serviceName}`}
      className={`${SURFACE_CARD_INTERACTIVE} p-4 flex items-center justify-between gap-3 relative group min-w-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/30`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer focus:outline-none">
        {!logoErrored && serviceLogoSrc ? (
          <div className="w-11 h-11 rounded-full bg-white shadow-soft shrink-0 overflow-hidden flex items-center justify-center border border-border/60 p-1.5 transition-transform group-hover:scale-105">
            <img
              src={serviceLogoSrc}
              alt={`${serviceName} logo`}
              loading="lazy"
              onError={() => setLogoErrored(true)}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-soft shrink-0 transition-transform group-hover:scale-105">
            <Icon className="w-5 h-5 stroke-[2.5]" />
          </div>
        )}

        <div className="min-w-0 flex-1 pl-1">
          <p className="font-bold text-[13px] text-foreground leading-snug group-hover:text-slate-950 transition-colors">
            {serviceName}
          </p>
          <p className="text-[11px] font-medium text-muted-foreground mt-0.5 leading-snug line-clamp-2">
            {serviceDescription}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleFav();
          }}
          className="p-1.5 rounded-full hover:bg-rose-50/80 transition-colors focus:outline-none"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-muted-foreground/30 hover:text-red-400"}`} />
        </button>

        <OfficialLinkButton
          item={officialItem}
          compact
          className="px-2 py-1.5"
          onVerifiedClick={(event) => {
            event.stopPropagation();
          }}
        />
      </div>
    </div>
  );
}

function serviceMatchesQuery(service: FinanceService, query: string, lang: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const searchable = [
    service.category,
    getServiceName(service, lang),
    getServiceDescription(service, lang),
    service.name.english,
    service.name.hindi,
    service.name.telugu,
    service.description.english,
    service.description.hindi,
    service.description.telugu,
    ...service.keywords,
  ].join(" ").toLowerCase();

  return searchable.includes(q);
}

interface ServiceGroupProps {
  category: ServiceCategory;
  title: string;
  countLabel: string;
  placeholder: string;
  noResultsLabel: string;
  services: FinanceService[];
  isOpen: boolean;
  query: string;
  icon: any;
  iconClassName: string;
  onToggle: () => void;
  onQueryChange: (value: string) => void;
  isServiceFav: (id: string) => boolean;
  toggleServiceFav: (id: string) => void;
  onServiceSelect: (service: FinanceService, event?: any) => void;
  lang: string;
}

function ServiceGroup({
  category,
  title,
  countLabel,
  placeholder,
  noResultsLabel,
  services,
  isOpen,
  query,
  icon: GroupIcon,
  iconClassName,
  onToggle,
  onQueryChange,
  isServiceFav,
  toggleServiceFav,
  onServiceSelect,
  lang,
}: ServiceGroupProps) {
  const filteredServices = useMemo(
    () => services.filter((service) => serviceMatchesQuery(service, query, lang)),
    [services, query, lang],
  );

  return (
    <div className={`${SURFACE_CARD} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-4 text-left active:bg-muted/30 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`${category}-services-panel`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-[12px] bg-muted/60 flex items-center justify-center shrink-0">
            <GroupIcon className={`w-5 h-5 ${iconClassName}`} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[14px] text-foreground truncate">{title}</h4>
            <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
              {services.length} {countLabel}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${category}-services-panel`}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-border/50"
          >
            <div className="p-3 space-y-3 bg-background/20">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[2.5]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder={placeholder}
                  className={`w-full pl-10 pr-4 py-2.5 text-[13px] font-medium ${CONTROL_INPUT} placeholder:font-normal`}
                />
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isFav={service.isFavorite || isServiceFav(service.id)}
                    onToggleFav={() => toggleServiceFav(service.id)}
                    onOpen={(e) => onServiceSelect(service, e)}
                    lang={lang}
                  />
                ))}
              </div>

              {filteredServices.length === 0 && (
                <p className="text-center text-[13px] font-medium text-muted-foreground py-8">
                  {noResultsLabel}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceDetailModal({ service, lang, onClose }: { service: FinanceService | null; lang: string; onClose: () => void }) {
  const [logoErrored, setLogoErrored] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setLogoErrored(false);
    if (!service) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [service, onClose]);

  if (!service) return null;

  const localizedServiceStrings = SERVICE_STRINGS[lang] || SERVICE_STRINGS.english;
  const strings = {
    ...localizedServiceStrings,
    officialActions: t("officialActions"),
    closeServiceDetails: t("closeServiceDetails"),
    modalTrustNote: t("trustNote"),
  };
  const serviceName = getServiceName(service, lang);
  const serviceDescription = getServiceDescription(service, lang);
  const Icon = SERVICE_ICONS[service.iconName] || Mail;
  const categoryLabel = isPostOfficeService(service) ? strings.categoryPostOffice : strings.categoryInsurance;
  const serviceLogoSrc = service.logoDomain ? logoUrl(service.logoDomain) : "";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center px-0 sm:px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        />
        <motion.div
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 28, opacity: 0 }}
          className="relative w-full sm:max-w-md max-h-[88vh] overflow-y-auto bg-white/95 rounded-t-[28px] sm:rounded-[24px] shadow-2xl border border-border/70 p-5 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={serviceName}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              {!logoErrored && serviceLogoSrc ? (
                <div className="w-12 h-12 rounded-2xl bg-white shadow-soft shrink-0 overflow-hidden flex items-center justify-center border border-border/60 p-2">
                  <img src={serviceLogoSrc} alt={`${serviceName} logo`} onError={() => setLogoErrored(true)} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-soft shrink-0">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-[18px] font-bold leading-tight text-foreground">{serviceName}</h3>
                <p className="inline-flex mt-2 px-2.5 py-1 rounded-full bg-muted text-[11px] font-bold text-muted-foreground">{categoryLabel}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors shrink-0" aria-label={strings.closeServiceDetails}>
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          <p className="text-[13px] font-medium text-muted-foreground leading-relaxed mt-4">{serviceDescription}</p>

          <div className="mt-4 rounded-2xl bg-slate-50/90 border border-slate-200 px-4 py-3">
            <p className="text-[12px] font-medium text-slate-700 leading-relaxed">{strings.modalTrustNote}</p>
          </div>

          <div className="mt-5">
            <h4 className="text-[12px] uppercase tracking-[0.08em] font-bold text-muted-foreground mb-3">{strings.officialActions}</h4>
            <div className="grid grid-cols-1 gap-2.5">
              {service.actions.map((action) => {
                const isActionVerified = action.url && action.url.trim() !== "";
                const actionLabel = isActionVerified
                  ? (action.label[lang as keyof typeof action.label] || action.label.english)
                  : "Official link not verified yet.";
                return (
                  <button
                    key={action.id}
                    disabled={!isActionVerified}
                    onClick={(event) => {
                      if (!isActionVerified) {
                        event.stopPropagation();
                        event.preventDefault();
                        return;
                      }
                      openServiceAction(service.id, action.id, event);
                    }}
                    className={`w-full min-h-12 px-4 py-3 rounded-2xl font-bold text-[13px] flex items-center justify-between gap-3 transition-all ${
                      isActionVerified
                        ? "bg-foreground text-background active:scale-[0.99] cursor-pointer shadow-soft"
                        : "bg-muted text-muted-foreground/60 cursor-not-allowed opacity-75 active:scale-100"
                    }`}
                    title={isActionVerified ? undefined : "Official link not verified yet."}
                  >
                    <span className="text-left leading-snug">{actionLabel}</span>
                    {isActionVerified && <ExternalLink className="w-4 h-4 shrink-0" />}
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


function Dashboard() {
  const { t, lang, setLang } = useTranslation();
  const { ids, toggle, isFavorite } = useFavorites();
  const { speakVoice, openBankSafely } = useVoiceAssistant();
  
  const { toggle: toggleServiceFav, isFavorite: isServiceFav } = useServiceFavorites();

  // Run the services health check on load in background
  useEffect(() => {
    runServicesHealthCheckBackground(SERVICES_DATA);
  }, []);

  const postOfficeServices = useMemo(() => SERVICES_DATA.filter(isPostOfficeService), []);
  const insuranceServices = useMemo(() => SERVICES_DATA.filter(isInsuranceService), []);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isFinancialHelpOpen, setIsFinancialHelpOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeServiceCategory, setActiveServiceCategory] = useState<ServiceGroupKey | null>(null);
  const [selectedService, setSelectedService] = useState<FinanceService | null>(null);
  const [serviceQueries, setServiceQueries] = useState<Record<ServiceGroupKey, string>>({
    post_office: "",
    insurance: "",
  });
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const allBanksSorted = useMemo(() => {
    return [...BANKS].sort((a, b) => {
      const nameA = getBankDisplayName(a, lang).toLowerCase();
      const nameB = getBankDisplayName(b, lang).toLowerCase();
      if (sortDirection === 'asc') return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });
  }, [sortDirection, lang]);

  const favBanks = useMemo(
    () => ids.map((id) => BANKS.find((b) => b.id === id)).filter(Boolean) as Bank[],
    [ids]
  );
  
  const popular = useMemo(
    () => ["sbi", "hdfc", "icici", "axis", "pnb", "bob"].map((id) => BANKS.find((b) => b.id === id)!),
    []
  );

  const addResults = useMemo(() => {
    if (!addQuery.trim()) return allBanksSorted;
    return allBanksSorted.filter((b) =>
      bankMatchesSearch(b, addQuery, lang, [t(getCatKey(b.category))])
    );
  }, [addQuery, allBanksSorted, lang, t]);

  const openServiceDetails = useCallback((service: FinanceService, event?: any) => {
    event?.stopPropagation?.();
    event?.preventDefault?.();

    setSelectedService(service);
    const serviceName = getServiceName(service, lang);

    try {
      pushRecent(`service_view:${service.id}`);
      const payload = {
        type: "service_view",
        serviceId: service.id,
        serviceName,
        category: service.category,
        timestamp: Date.now(),
      };
      window.localStorage.setItem("bankhub:lastServiceActivity", JSON.stringify(payload));
    } catch (error) {
      console.warn("Could not save service detail activity:", error);
    }

    try {
      speakVoice("showingServiceDetails", { serviceName });
    } catch (error) {
      console.warn("Voice assistant service detail announcement failed:", error);
    }
  }, [lang, speakVoice]);

  return (
    <div className="space-y-8 pb-6 pt-2">
      <header className={`${SURFACE_CARD} flex items-start justify-between -mt-2 p-5`}>
        <div className="flex-1 pr-4">
          <p className="text-[12px] uppercase tracking-[0.08em] text-muted-foreground font-bold leading-tight">{t("welcomeTo")}</p>
          <h1 className="text-[33px] font-bold text-foreground leading-none mt-2">{t("bankHub")}</h1>
          <p className="text-[15px] font-bold text-muted-foreground mt-3 leading-[1.3] max-w-[200px] sm:max-w-none">
            {t("tagline")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <select
              value={lang}
              onChange={(event) => setLang(event.target.value)}
              className="max-w-[118px] rounded-xl border border-border/70 bg-white/85 px-2 py-1.5 text-[11px] font-bold text-foreground outline-none focus:ring-2 focus:ring-ring/30"
              aria-label={t("language")}
              dir={lang === "urdu" ? "rtl" : "ltr"}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id} dir={option.dir || "ltr"}>
                  {option.nativeLabel}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="tap-target rounded-xl p-2 -mr-1 text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors"
              aria-label={t("settings")}
            >
              <Settings className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
          <div className="h-20 w-auto opacity-95 -mr-1 flex items-center justify-end">
             <CrestLogo className="h-full w-auto" />
          </div>
        </div>
      </header>

      <section className="rounded-[18px] border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-[12px] font-semibold text-emerald-950 shadow-soft">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <p className="leading-relaxed">
            We redirect only to official websites. Never share OTP, PIN, CVV, card numbers, or banking passwords. Call 1930 immediately for online financial fraud.
          </p>
        </div>
      </section>

      {/* Selected Banks */}
      <section>
        <div className="flex items-baseline justify-between mb-4 mt-2">
          <h3 className="font-bold text-[15px] text-foreground">{t("selectedBanks")} ({favBanks.length})</h3>
          <Link to="/favorites" className="text-[13px] font-semibold text-slate-600 hover:text-slate-950 hover:underline">
            {t("seeAll")}
          </Link>
        </div>
        
        {favBanks.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {favBanks.map((b) => b && (
              <SelectedBankTile key={b.id} bank={b} openBankSafely={openBankSafely} speakVoice={speakVoice} t={t} lang={lang} />
            ))}
          </div>
        ) : (
          <div className={`${SURFACE_CARD} p-6 text-center text-muted-foreground text-sm`}>
            {t("noBanksSelected")}
          </div>
        )}

        {/* Inline Favourites Adder */}
        <div className={`mt-4 ${SURFACE_CARD} overflow-hidden`}>
          <div className="w-full flex items-center justify-between p-4 bg-transparent outline-none focus-within:bg-muted/10 transition-colors">
            <button
              onClick={() => setIsAdding((a) => !a)}
              className="text-[14px] font-semibold text-foreground flex items-center gap-2 min-w-0"
            >
              <span className="text-xl leading-none font-light -mt-0.5">+</span> {t("addYourBanks")}
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                }}
                className={`p-1.5 rounded-md transition-colors ${sortDirection === 'desc' ? 'bg-slate-100 text-slate-900' : 'text-muted-foreground/60 hover:bg-slate-100'}`}
                title={sortDirection === 'asc' ? "Sort A-Z" : "Sort Z-A"}
              >
                <ArrowDownUp className={`w-4 h-4 stroke-[2.5] transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setIsAdding((a) => !a)}
                className="p-1.5 rounded-md text-muted-foreground transition-colors hover:bg-muted/40"
                aria-label={isAdding ? "Collapse add banks" : "Expand add banks"}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isAdding ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-border/50"
              >
                <div className="p-3 flex flex-col h-[60vh] bg-background/20">
                  <div className="relative mb-3 shrink-0">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground stroke-[2.5]" />
                    <input
                      type="text"
                      placeholder={t("searchBanks")}
                      value={addQuery}
                      onChange={(e) => setAddQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 text-[13px] font-medium ${CONTROL_INPUT} placeholder:font-normal`}
                    />
                  </div>
                  <div className="overflow-y-auto pr-1 flex-1 relative bg-white/90 rounded-xl border border-border/50 divide-y divide-border/30">
                    {addResults.map((b) => {
                      const fav = isFavorite(b.id);
                      const displayName = getBankDisplayName(b, lang);
                      const bankOfficialUrl = getOfficialLink("banks", b.id);
                      const isBankVerified = !!bankOfficialUrl;
                      return (
                        <div key={b.id} className={`flex items-center gap-3 p-3 transition-colors ${
                          isBankVerified ? "hover:bg-muted/30" : "opacity-75"
                        }`}>
                          <BankLogo bank={b} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[13px] truncate text-foreground leading-snug">{displayName}</p>
                            <p className={`text-[10px] font-semibold mt-0.5 leading-tight ${
                              isBankVerified ? "text-muted-foreground" : "text-amber-600/90"
                            }`}>
                              {isBankVerified ? t(getCatKey(b.category)) : "Official link not verified yet."}
                            </p>
                          </div>
                          <button
                            disabled={!isBankVerified}
                            onClick={(e) => {
                              if (!isBankVerified) return;
                              e.stopPropagation();
                              e.preventDefault();
                              if (!fav) {
                                speakVoice("bankSelected", { bank: b });
                              } else {
                                speakVoice("bankRemoved", { bank: b });
                              }
                              toggle(b.id);
                            }}
                            className={`p-2 -mr-1 rounded-lg transition-colors focus:outline-none shrink-0 ${
                              isBankVerified ? "cursor-pointer" : "cursor-not-allowed opacity-40"
                            }`}
                            title={isBankVerified ? undefined : "Official link not verified yet."}
                          >
                            <Heart className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : "text-border/80"}`} />
                          </button>
                        </div>
                      );
                    })}
                    {addResults.length === 0 && (
                      <p className="text-center text-[13px] font-medium text-muted-foreground py-8">{t("noBanksFound")}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Popular Banks */}
      <section>
         <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-bold text-[15px] text-foreground">{t("popularBanks")}</h3>
          <div className="flex items-center gap-3">
            <Link to="/favorites" className="text-[13px] font-semibold text-slate-600 hover:text-slate-950 hover:underline">
              {t("seeAll")}
            </Link>
          </div>
        </div>
        <div className={`${SURFACE_CARD} p-1 divide-y divide-border/40`}>
          {popular.map((b) => b && <PopularBankRow key={b.id} bank={b} openBankSafely={openBankSafely} t={t} lang={lang} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="relative">
        <h3 className="font-bold text-[15px] text-foreground mb-4">{t("categories")}</h3>
        <div className="grid grid-cols-2 gap-3 relative">
          {CATEGORIES.map((cat) => {
            const banksInCat = BANKS_BY_CATEGORY[cat] || [];
            const ui = CATEGORY_ICONS[cat];
            const Icon = ui?.icon || Landmark;
            const isActive = activeCategory === cat;
            
            return (
              <div key={cat} className="relative">
                <button
                  onClick={() => {
                    setActiveCategory(isActive ? null : cat);
                  }}
                  className={`w-full text-left border rounded-[18px] p-3.5 flex items-center justify-between active:scale-[0.98] transition-all ${isActive ? 'bg-slate-100/90 border-slate-300 shadow-soft' : 'fintech-card-interactive'}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-[9px] ${ui?.bg || "bg-muted"} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${ui?.color || "text-foreground"}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-foreground truncate">{t(getCatKey(cat))}</p>
                      <p className="text-[9px] text-muted-foreground font-semibold mt-0.5">{banksInCat.length} {t("banks")}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground shrink-0 ml-1 transition-transform ${isActive ? 'rotate-180' : 'opacity-70'}`} />
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute left-0 right-0 top-full mt-2 z-[50] bg-white/95 border border-border shadow-xl rounded-2xl p-3 min-w-[280px] backdrop-blur-xl"
                      style={{ width: "calc(200% + 12px)", left: CATEGORIES.indexOf(cat) % 2 === 0 ? 0 : "auto", right: CATEGORIES.indexOf(cat) % 2 === 0 ? "auto" : 0 }}
                    >
                      <div className="flex items-center justify-between mb-3 px-1">
                        <h4 className="font-bold text-[13px] text-foreground">{t(getCatKey(cat))}</h4>
                        <button onClick={() => setActiveCategory(null)} className="p-1 hover:bg-muted rounded-full">
                          <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
                        {banksInCat.map(b => {
                          const catDisplayName = getBankDisplayName(b, lang);
                          const bankOfficialUrl = getOfficialLink("banks", b.id);
                          const isBankVerified = !!bankOfficialUrl;
                          return (
                            <button
                              key={b.id}
                              disabled={!isBankVerified}
                              onClick={(e) => {
                                if (!isBankVerified) {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  return;
                                }
                                pushRecent(b.id);
                                openBankSafely(b, "category_bank", e);
                              }}
                              className={`flex flex-col items-center justify-start gap-1.5 p-1 focus:outline-none rounded-xl transition-all ${
                                isBankVerified 
                                  ? "hover:bg-muted/30 active:scale-95 cursor-pointer" 
                                  : "cursor-not-allowed opacity-40"
                              }`}
                              title={isBankVerified ? undefined : "Official link not verified yet."}
                            >
                              <BankLogo bank={b} size="sm" />
                              <p className="text-[8px] font-bold text-foreground text-center line-clamp-2 leading-tight">
                                {catDisplayName}
                              </p>
                              {!isBankVerified && (
                                <span className="text-[6px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-200 mt-0.5 leading-none">
                                  Unverified
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Post Office & Insurance Section */}
      <section className="space-y-6">
        <h3 className="font-bold text-[15px] text-foreground">
          {t("postOfficeInsurance")}
        </h3>
        
        <div className="grid grid-cols-1 gap-3.5">
          <ServiceGroup
            category="post_office"
            title={t("postOfficeServices")}
            countLabel={t("services")}
            placeholder={t("searchPostOffice")}
            noResultsLabel={t("noMatchingServices")}
            services={postOfficeServices}
            isOpen={activeServiceCategory === "post_office"}
            query={serviceQueries.post_office}
            icon={Mail}
            iconClassName="text-red-500"
            onToggle={() => setActiveServiceCategory((current) => current === "post_office" ? null : "post_office")}
            onQueryChange={(value) => setServiceQueries((current) => ({ ...current, post_office: value }))}
            isServiceFav={isServiceFav}
            toggleServiceFav={toggleServiceFav}
            onServiceSelect={openServiceDetails}
            lang={lang}
          />

          <ServiceGroup
            category="insurance"
            title={t("insuranceServices")}
            countLabel={t("services")}
            placeholder={t("searchInsurance")}
            noResultsLabel={t("noMatchingServices")}
            services={insuranceServices}
            isOpen={activeServiceCategory === "insurance"}
            query={serviceQueries.insurance}
            icon={Shield}
            iconClassName="text-emerald-600"
            onToggle={() => setActiveServiceCategory((current) => current === "insurance" ? null : "insurance")}
            onQueryChange={(value) => setServiceQueries((current) => ({ ...current, insurance: value }))}
            isServiceFav={isServiceFav}
            toggleServiceFav={toggleServiceFav}
            onServiceSelect={openServiceDetails}
            lang={lang}
          />
        </div>
      </section>

      {/* Smart Services */}
      <section>
        <h3 className="font-bold text-[15px] text-foreground mb-1">{t("smartServices")}</h3>
        <p className="text-[12px] text-muted-foreground font-medium mb-4">{t("guidanceSubtitle")}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`${SURFACE_CARD_INTERACTIVE} p-4 flex flex-col gap-3`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-amber-50 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-foreground">{t("smartBankingGuidance")}</h4>
                <p className="text-[12px] font-medium text-muted-foreground mt-0.5">{t("findRightBankingService")}</p>
              </div>
            </div>
            <button
              onClick={() => {
                speakVoice("showingGuidance");
                setIsGuidanceOpen(true);
              }}
              className={`w-full mt-1 py-2.5 text-[13px] ${PRIMARY_ACTION}`}
            >
              {t("explore")}
            </button>
          </div>

          <div className={`${SURFACE_CARD_INTERACTIVE} p-4 flex flex-col gap-3`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-emerald-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-foreground">{t("bankingSafetyShield")}</h4>
                <p className="text-[12px] font-medium text-muted-foreground mt-0.5">{t("protectFromFraud")}</p>
              </div>
            </div>
            <button
              onClick={() => {
                speakVoice("showingSafety");
                setIsSafetyOpen(true);
              }}
              className={`w-full mt-1 py-2.5 text-[13px] ${PRIMARY_ACTION}`}
            >
              {t("explore")}
            </button>
          </div>

          <div className={`${SURFACE_CARD_INTERACTIVE} p-4 flex flex-col gap-3`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-sky-50 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-sky-700" />
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-foreground">{t("financialInclusionHelp")}</h4>
                <p className="text-[12px] font-medium text-muted-foreground mt-0.5">{t("simpleGuidance")}</p>
              </div>
            </div>
            <button
              onClick={() => {
                speakVoice("showingFinancialHelp");
                setIsFinancialHelpOpen(true);
              }}
              className={`w-full mt-1 py-2.5 text-[13px] ${PRIMARY_ACTION}`}
            >
              {t("explore")}
            </button>
          </div>

          <div className={`${SURFACE_CARD_INTERACTIVE} p-4 flex flex-col gap-3`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-slate-100 flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="font-bold text-[14px] text-foreground">{t("compareBankingServices")}</h4>
                <p className="text-[12px] font-medium text-muted-foreground mt-0.5">{t("compareBankingOptions")}</p>
              </div>
            </div>
            <button
              onClick={() => {
                speakVoice("showingComparison");
                setIsCompareOpen(true);
              }}
              className={`w-full mt-1 py-2.5 text-[13px] ${PRIMARY_ACTION}`}
            >
              {t("explore")}
            </button>
          </div>
        </div>
      </section>

      {/* Security Notice Footer */}
      <div className="pt-4 pb-2">
        <div className="mx-auto block text-center">
          <p className="text-[12px] font-medium text-foreground/60">
            {t("credentialsNote")}
          </p>
        </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SmartGuidanceModal isOpen={isGuidanceOpen} onClose={() => setIsGuidanceOpen(false)} t={t} lang={lang} openBankSafely={openBankSafely} speakVoice={speakVoice} />
      <SafetyShieldModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} t={t} lang={lang} speakVoice={speakVoice} />
      <FinancialInclusionModal isOpen={isFinancialHelpOpen} onClose={() => setIsFinancialHelpOpen(false)} t={t} speakVoice={speakVoice} />
      <CompareBankingModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} t={t} lang={lang} openBankSafely={openBankSafely} speakVoice={speakVoice} />
      <ServiceDetailModal service={selectedService} lang={lang} onClose={() => setSelectedService(null)} />
    </div>
  );
}
