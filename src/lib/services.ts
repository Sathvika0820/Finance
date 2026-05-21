import { serviceUrlMap } from "@/data/serviceUrlMap";
import { speakVoice } from "@/lib/voice";

const serviceOpenGuardRef = {
  key: "",
  time: 0
};

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function openServicePage(serviceType: string, bankKey: string, source: string = "smart-services", event?: any) {
  if (event?.stopPropagation) event.stopPropagation();
  if (event?.preventDefault) event.preventDefault();

  const serviceEntry = serviceUrlMap?.[serviceType]?.[bankKey];
  const serviceLabel = serviceEntry?.label || `${bankKey} ${serviceType}`;
  const exactUrl = serviceEntry?.url;

  const url = isValidUrl(exactUrl)
    ? exactUrl!
    : `https://www.google.com/search?q=${encodeURIComponent(serviceLabel + " official website")}`;

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
