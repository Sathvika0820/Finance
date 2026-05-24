import { toast } from "sonner";
import { FinanceService, SERVICES_DATA, getServiceName } from "@/data/services";
import { getCurrentStoredLanguage, type AppLanguage } from "@/lib/i18n";
import { checkServiceUrlHealth, getServiceHealthStatus } from "./urlHealth";
import { pushRecent } from "./favorites";
import { speakVoice } from "./voice";
import { OFFICIAL_LINK_NOT_VERIFIED_LABEL, isVerifiedOfficialUrl } from "@/data/officialLinks";

const serviceRedirectGuard = {
  key: "",
  time: 0
};

const serviceActionRedirectGuard = {
  key: "",
  time: 0
};

const REDIRECT_STRINGS: Partial<Record<AppLanguage, { missing: string; invalid: string; unavailable: string }>> & {
  english: { missing: string; invalid: string; unavailable: string };
} = {
  english: {
    missing: "Official link unavailable",
    invalid: "Invalid official link",
    unavailable: "Official link temporarily unavailable",
  },
  hindi: {
    missing: "आधिकारिक लिंक उपलब्ध नहीं है।",
    invalid: "अमान्य आधिकारिक लिंक।",
    unavailable: "आधिकारिक लिंक अस्थायी रूप से उपलब्ध नहीं है।",
  },
  telugu: {
    missing: "అధికారిక లింక్ అందుబాటులో లేదు.",
    invalid: "చెల్లని అధికారిక లింక్.",
    unavailable: "అధికారిక లింక్ తాత్కాలికంగా అందుబాటులో లేదు.",
  },
};

function getCurrentLanguage(): AppLanguage {
  if (typeof window === "undefined") return "english";
  return getCurrentStoredLanguage();
}

function getRedirectStrings() {
  return REDIRECT_STRINGS[getCurrentLanguage()] || REDIRECT_STRINGS.english;
}

function openResolvedService(service: FinanceService, event?: any) {
  if (event?.stopPropagation) event.stopPropagation();
  if (event?.preventDefault) event.preventDefault();

  const strings = getRedirectStrings();
  const now = Date.now();
  const lastOpen = serviceRedirectGuard.time;
  const lastKey = serviceRedirectGuard.key;

  if (lastKey === service.id && now - lastOpen < 1500) {
    console.warn("Duplicate service redirect blocked:", service.name.english);
    return;
  }

  serviceRedirectGuard.time = now;
  serviceRedirectGuard.key = service.id;

  if (service.isActive === false) {
    toast.error(strings.unavailable);
    console.warn(`Blocked inactive service redirect: ${service.name.english}`);
    return;
  }

  if (!service.officialUrl) {
    toast.error(strings.missing);
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(service.officialUrl);
  } catch {
    toast.error(strings.invalid);
    return;
  }

  if (parsedUrl.protocol !== "https:" || !isVerifiedOfficialUrl(service.officialUrl)) {
    toast.error(OFFICIAL_LINK_NOT_VERIFIED_LABEL);
    return;
  }

  const health = getServiceHealthStatus(service.id);
  let targetUrl = service.officialUrl;

  if (!health.isHealthy) {
    if (service.verifiedFallbackUrl?.startsWith("https://") && isVerifiedOfficialUrl(service.verifiedFallbackUrl)) {
      targetUrl = service.verifiedFallbackUrl;
    } else {
      toast.error(strings.unavailable);
      console.warn(`Blocked navigation to unhealthy service ${service.name.english}. Reason: ${health.reason}`);
      return;
    }
  }

  window.open(targetUrl, "_blank", "noopener,noreferrer");

  try {
    pushRecent(service.id);
  } catch (err) {
    console.warn("Could not save to recent activity:", err);
  }

  try {
    speakVoice("openingService", { serviceName: getServiceName(service, getCurrentLanguage()) });
  } catch (err) {
    console.warn("Voice assistant announcement failed:", err);
  }
}

export function openOfficialService(serviceId: string, event?: any) {
  if (event?.stopPropagation) event.stopPropagation();
  if (event?.preventDefault) event.preventDefault();

  const service = SERVICES_DATA.find((item) => item.id === serviceId);
  if (!service) {
    toast.error(getRedirectStrings().missing);
    return;
  }

  openResolvedService(service, event);
}

export function openServiceSafely(service: FinanceService, event?: any) {
  openOfficialService(service.id, event);
}

export function openServiceAction(serviceId: string, actionId: string, event?: any) {
  if (event?.stopPropagation) event.stopPropagation();
  if (event?.preventDefault) event.preventDefault();

  const strings = getRedirectStrings();
  const service = SERVICES_DATA.find((item) => item.id === serviceId);
  const action = service?.actions.find((item) => item.id === actionId);

  if (!service || !action?.url) {
    toast.error(strings.missing);
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(action.url);
  } catch {
    toast.error(strings.invalid);
    return;
  }

  if (parsedUrl.protocol !== "https:" || !isVerifiedOfficialUrl(action.url)) {
    toast.error(OFFICIAL_LINK_NOT_VERIFIED_LABEL);
    return;
  }

  const key = `${serviceId}-${actionId}`;
  const now = Date.now();
  if (serviceActionRedirectGuard.key === key && now - serviceActionRedirectGuard.time < 1500) {
    console.warn("Duplicate service action redirect blocked:", key);
    return;
  }

  serviceActionRedirectGuard.key = key;
  serviceActionRedirectGuard.time = now;

  const opened = window.open(action.url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.assign(action.url);
  }

  const lang = getCurrentLanguage();
  const actionName = action.label[lang] || action.label.english;

  try {
    pushRecent(`service_action:${serviceId}:${actionId}`);
    const payload = {
      type: "service_action",
      serviceId,
      actionId,
      actionName,
      timestamp: Date.now(),
    };
    window.localStorage.setItem("bankhub:lastServiceActivity", JSON.stringify(payload));
  } catch (err) {
    console.warn("Could not save to recent activity:", err);
  }

  try {
    speakVoice("openingServiceAction", { actionName });
  } catch (err) {
    console.warn("Voice assistant announcement failed:", err);
  }
}

export async function validateServiceRedirectTarget(service: FinanceService) {
  return checkServiceUrlHealth(service.id, service.officialUrl, service.trustedDomains);
}
