import { useEffect, useState } from "react";

const HEALTH_KEY = "bankhub:urlHealth";
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

interface HealthData {
  isHealthy: boolean;
  lastCheckedAt: number;
}

function readHealth(): Record<string, HealthData> {
  if (typeof window === "undefined") return {};
  try {
    const v = window.localStorage.getItem(HEALTH_KEY);
    return v ? JSON.parse(v) : {};
  } catch {
    return {};
  }
}

function writeHealth(data: Record<string, HealthData>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HEALTH_KEY, JSON.stringify(data));
}

// Fallback checking function
async function checkUrl(url: string): Promise<boolean> {
  try {
    // using no-cors because we are checking external domains
    // if the domain is completely unreachable (e.g. DNS fail), fetch throws
    await fetch(url, { method: "HEAD", mode: "no-cors", cache: "no-store" });
    return true;
  } catch {
    return false;
  }
}

export function useUrlHealth(bankId: string, officialUrl: string, fallbackUrl: string) {
  const [safeUrl, setSafeUrl] = useState<string>(officialUrl);

  useEffect(() => {
    let active = true;

    async function performCheck() {
      const data = readHealth();
      const cached = data[bankId];
      const now = Date.now();

      // If we have a recent check within 24 hours, use it
      if (cached && (now - cached.lastCheckedAt) < CHECK_INTERVAL) {
        if (!cached.isHealthy) {
          setSafeUrl(fallbackUrl);
        }
        return;
      }

      // Otherwise we perform a new check
      const isHealthy = await checkUrl(officialUrl);
      
      if (active) {
        if (!isHealthy) {
          setSafeUrl(fallbackUrl);
        } else {
          setSafeUrl(officialUrl);
        }
        
        // Save result
        const newData = readHealth();
        newData[bankId] = { isHealthy, lastCheckedAt: Date.now() };
        writeHealth(newData);
      }
    }

    performCheck();

    return () => {
      active = false;
    };
  }, [bankId, officialUrl, fallbackUrl]);

  return safeUrl;
}
import { getOfficialLink } from "@/data/officialLinks";

export function getSafeBankUrl(bank: any): string {
  return getOfficialLink("banks", bank.id) || "";
}

export async function checkAndGetSafeUrl(bank: any): Promise<string> {
  return getOfficialLink("banks", bank.id) || "";
}

// ----------------------------------------------------
// Post Office & Insurance Services Health Check Utility
// ----------------------------------------------------

const SERVICES_HEALTH_KEY = "bankhub:servicesHealth";
const SERVICES_LAST_CHECK_KEY = "bankhub:servicesHealthLastCheck";

export interface ServiceHealthData {
  isHealthy: boolean;
  isActive: boolean;
  reason?: string;
  redirectChain?: string[];
  lastCheckedAt: number;
}

function readServicesHealth(): Record<string, ServiceHealthData> {
  if (typeof window === "undefined") return {};
  try {
    const v = window.localStorage.getItem(SERVICES_HEALTH_KEY);
    return v ? JSON.parse(v) : {};
  } catch {
    return {};
  }
}

function writeServicesHealth(data: Record<string, ServiceHealthData>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SERVICES_HEALTH_KEY, JSON.stringify(data));
}

function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isTrustedDomain(url: string, trustedDomains: string[] = []): boolean {
  const hostname = getHostname(url);
  if (!hostname) return false;
  return trustedDomains.some((domain) => {
    const normalized = domain.toLowerCase();
    return hostname === normalized || hostname.endsWith(`.${normalized}`);
  });
}

export async function checkServiceUrlHealth(
  id: string,
  url: string,
  trustedDomains: string[] = [],
): Promise<{ isHealthy: boolean; reason?: string; redirectChain?: string[] }> {
  // 1. Detect non-HTTPS URLs
  if (!url || !url.startsWith("https://")) {
    return { isHealthy: false, reason: "Non-HTTPS URL detected" };
  }

  // 2. Detect suspicious domains
  if (!isTrustedDomain(url, trustedDomains)) {
    return { isHealthy: false, reason: "Suspicious domain detected" };
  }

  // 3. Timeout error detection (5 seconds limit)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const redirectChain = response.redirected ? [url, response.url] : [url];

    if (!response.ok) {
      return { isHealthy: false, reason: `Broken URL returned HTTP ${response.status}`, redirectChain };
    }

    if (response.redirected) {
      if (!response.url.startsWith("https://")) {
        return { isHealthy: false, reason: "Redirected to unsafe HTTP destination", redirectChain };
      }

      if (!isTrustedDomain(response.url, trustedDomains)) {
        return { isHealthy: false, reason: "Redirected to untrusted domain", redirectChain };
      }
    }

    return { isHealthy: true, redirectChain };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      return { isHealthy: false, reason: "Timeout (service did not respond within 5s)" };
    }

    // Many official Indian financial sites do not allow browser CORS probes.
    // Keep HTTPS + trusted-domain validation as the browser fallback, and let
    // the production server-side scheduler perform the deeper status check.
    console.warn(`Browser health probe failed for service ${id}; falling back to domain validation.`, error);
    return { isHealthy: true, reason: "Browser probe unavailable; trusted domain validated" };
  }
}

/**
 * Runs a background health check for all registered services if 24 hours have elapsed
 */
export async function runServicesHealthCheckBackground(services: any[]): Promise<void> {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const lastCheckStr = window.localStorage.getItem(SERVICES_LAST_CHECK_KEY);
  const lastCheck = lastCheckStr ? parseInt(lastCheckStr, 10) : 0;

  // Run only if 24 hours have passed
  if (now - lastCheck < CHECK_INTERVAL) {
    console.log("Services health check was run recently, skipping.");
    return;
  }

  console.log("Running scheduled 24-hour health check for Post Office and Insurance services...");
  const currentHealth = readServicesHealth();

  for (const s of services) {
    const res = await checkServiceUrlHealth(s.id, s.officialUrl, s.trustedDomains);
    
    currentHealth[s.id] = {
      isHealthy: res.isHealthy,
      isActive: res.isHealthy,
      reason: res.reason,
      redirectChain: res.redirectChain,
      lastCheckedAt: now
    };

    if (!res.isHealthy) {
      const serviceName = typeof s.name === "string" ? s.name : s.name?.english || s.id;
      console.warn(`Admin Review Alert: Service "${serviceName}" (ID: ${s.id}) failed health check. Reason: ${res.reason}`);
    }
  }

  writeServicesHealth(currentHealth);
  window.localStorage.setItem(SERVICES_LAST_CHECK_KEY, String(now));
  console.log("Services health check completed successfully.");
}

/**
 * Sync check for single service health based on cached results
 */
export function getServiceHealthStatus(serviceId: string): { isHealthy: boolean; reason?: string } {
  const data = readServicesHealth();
  const cached = data[serviceId];
  if (cached) {
    return { isHealthy: cached.isHealthy && cached.isActive !== false, reason: cached.reason };
  }
  return { isHealthy: true }; // Default to true if not yet run
}
