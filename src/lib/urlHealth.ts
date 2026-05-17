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
export function getSafeBankUrl(bank: any): string {
  const fallback = `https://www.google.com/search?q=${encodeURIComponent(bank.name + " official website")}`;
  const data = readHealth();
  const cached = data[bank.id];
  
  if (cached && !cached.isHealthy) {
    return fallback;
  }
  
  const targetUrl = bank.officialWebsiteUrl || bank.url || bank.website;
  return targetUrl || fallback;
}

export async function checkAndGetSafeUrl(bank: any): Promise<string> {
  const data = readHealth();
  const cached = data[bank.id];
  const now = Date.now();

  if (cached && (now - cached.lastCheckedAt) < CHECK_INTERVAL) {
    return cached.isHealthy ? (bank.officialWebsiteUrl || bank.website) : bank.fallbackSearchUrl;
  }

  const isHealthy = await checkUrl(bank.officialWebsiteUrl || bank.website);
  
  const newData = readHealth();
  newData[bank.id] = { isHealthy, lastCheckedAt: now };
  writeHealth(newData);

  return isHealthy ? (bank.officialWebsiteUrl || bank.website) : bank.fallbackSearchUrl;
}
