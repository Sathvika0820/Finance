export const OFFICIAL_BANK_DOMAINS = [
  "onlinesbi.sbi",
  "sbi.co.in",
  "hdfcbank.com",
  "netbanking.hdfcbank.com",
  "icicibank.com",
  "axisbank.com",
  "pnbindia.in",
  "canarabank.com",
  "bankofbaroda.in",
  "unionbankofindia.co.in",
  "indianbank.in",
  "idfcfirstbank.com",
  "kotak.com",
  "yesbank.in",
  "ippbonline.com",
];

/**
 * Normalizes a URL to extract its bare domain.
 * Example: https://www.sbi.co.in/login -> sbi.co.in
 */
export function extractDomain(url: string): string | null {
  try {
    const obj = new URL(url.toLowerCase().trim());
    return obj.hostname.replace(/^www\./, "");
  } catch (e) {
    // If it lacks http, try parsing again
    try {
      const obj = new URL("https://" + url.toLowerCase().trim());
      return obj.hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  }
}

/**
 * Checks if a domain exactly matches an official bank domain.
 */
export function isOfficialBankDomain(domain: string): boolean {
  return OFFICIAL_BANK_DOMAINS.includes(domain);
}
