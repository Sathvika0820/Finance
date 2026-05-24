import { serviceUrlMap } from "@/data/serviceUrlMap";
import { speakVoice } from "@/lib/voice";
import { OFFICIAL_LINK_NOT_VERIFIED_LABEL, getSmartServiceOfficialLink } from "@/data/officialLinks";
import { toast } from "sonner";

const serviceOpenGuardRef = {
  key: "",
  time: 0
};

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function openServicePage(serviceType: string, bankKey: string, source: string = "smart-services", event?: any) {
  if (event?.stopPropagation) event.stopPropagation();
  if (event?.preventDefault) event.preventDefault();

  const serviceEntry = serviceUrlMap?.[serviceType]?.[bankKey];
  const serviceLabel = serviceEntry?.label || `${bankKey} ${serviceType}`;
  const officialEntry = getSmartServiceOfficialLink(serviceType, bankKey);
  const url = officialEntry?.officialLink || serviceEntry?.url;

  if (!officialEntry?.verified || !isValidUrl(url)) {
    toast.warning(OFFICIAL_LINK_NOT_VERIFIED_LABEL);
    return;
  }

  const openKey = `${serviceType}-${bankKey}`;
  const now = Date.now();

  if (
    serviceOpenGuardRef.key === openKey &&
    now - serviceOpenGuardRef.time < 1500
  ) {
    console.warn("Duplicate service open blocked:", openKey);
    return;
  }

  serviceOpenGuardRef.key = openKey;
  serviceOpenGuardRef.time = now;

  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.assign(url);
  }

  try {
    speakVoice("openingService", {
      serviceName: serviceLabel
    });
  } catch (error) {
    console.warn("Voice failed but service opened:", error);
  }
}
