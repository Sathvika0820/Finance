import { extractDomain, isOfficialBankDomain } from "./officialBankDomains";

export type ThreatLevel = "SAFE" | "CAUTION" | "HIGH RISK";

export interface ScamAnalysisResult {
  threatLevel: ThreatLevel;
  confidence: number;
  reason: string;
  recommendation: string;
}

const SMS_HIGH_RISK_KEYWORDS = [
  "otp",
  "blocked",
  "suspend",
  "deactivated",
  "kyc",
  "verify",
  "click",
  "urgent",
  "reward",
  "lottery",
  "loan approved",
  "claim"
];

const URL_SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl"
];

const BANK_BRAND_KEYWORDS = [
  "sbi", "hdfc", "icici", "axis", "pnb", "canara", "baroda", "kotak"
];

const HIGH_RISK_URL_KEYWORDS = [
  "login", "verify", "update", "secure", "reward", "kyc", "otp"
];

export function analyzeScamInput(input: string): ScamAnalysisResult {
  const text = input.trim().toLowerCase();

  if (!text) {
    return {
      threatLevel: "CAUTION",
      confidence: 100,
      reason: "Empty input.",
      recommendation: "Please provide a valid URL, SMS, or message to analyze."
    };
  }

  try {
    // 1. Is it a URL?
    let isUrl = false;
    if (!text.includes(" ")) {
      try {
        new URL(text.startsWith("http") ? text : `https://${text}`);
        // If it doesn't throw and has no spaces, we treat it as a pure URL
        isUrl = true;
      } catch {}
    }

    if (isUrl) {
      return analyzeURL(text);
    }

    // 2. Is it a phone number?
    const phoneStripped = text.replace(/[\s\-\+\(\)]/g, "");
    if (/^\d{10,13}$/.test(phoneStripped)) {
      return analyzePhone(text);
    }

    // 3. Otherwise treat as SMS/Email/WhatsApp text
    return analyzeMessage(text);

  } catch (error) {
    // FAILSAFE
    return {
      threatLevel: "CAUTION",
      confidence: 100,
      reason: "Unable to fully verify the content.",
      recommendation: "Proceed with caution and do not click on any links."
    };
  }
}

function analyzeURL(urlStr: string): ScamAnalysisResult {
  const domain = extractDomain(urlStr);

  if (!domain) {
    return applyFailsafe({
      threatLevel: "CAUTION",
      confidence: 85,
      reason: "Could not parse domain properly.",
      recommendation: "Do not open this link."
    });
  }

  // 1. URL Shortener check
  if (URL_SHORTENERS.includes(domain)) {
    return applyFailsafe({
      threatLevel: "CAUTION",
      confidence: 90,
      reason: "URL shorteners are commonly used by scammers to hide malicious destinations.",
      recommendation: "Do not click shortened links in banking contexts."
    });
  }

  // 2. Official Domain Match
  if (isOfficialBankDomain(domain)) {
    const isHttps = urlStr.startsWith("https://");
    if (!isHttps && !urlStr.startsWith("www.") && !urlStr.includes("://")) {
      // If no protocol is provided, assume safe but recommend https
      return applyFailsafe({
        threatLevel: "SAFE",
        confidence: 95,
        reason: "Domain matches official bank records.",
        recommendation: "Make sure the loaded page has the HTTPS padlock icon before entering details."
      });
    }

    if (!isHttps && urlStr.startsWith("http://")) {
      return applyFailsafe({
        threatLevel: "CAUTION",
        confidence: 95,
        reason: "Domain is official but uses insecure HTTP connection.",
        recommendation: "Do not enter passwords or OTPs on insecure connections."
      });
    }

    return applyFailsafe({
      threatLevel: "SAFE",
      confidence: 99,
      reason: "URL exactly matches a verified official bank domain and uses secure HTTPS.",
      recommendation: "This link is safe to visit."
    });
  }

  // 3. Lookalike / Brand Impersonation
  const containsBankName = BANK_BRAND_KEYWORDS.some(b => domain.includes(b));
  const containsSuspiciousKeyword = HIGH_RISK_URL_KEYWORDS.some(k => domain.includes(k));

  if (containsBankName && containsSuspiciousKeyword) {
    return applyFailsafe({
      threatLevel: "HIGH RISK",
      confidence: 95,
      reason: "Domain mimics official bank branding using suspicious keywords (e.g., 'secure', 'update').",
      recommendation: "This is likely a phishing site designed to steal your credentials. DO NOT visit."
    });
  }

  if (containsBankName) {
    return applyFailsafe({
      threatLevel: "CAUTION",
      confidence: 92,
      reason: "Domain contains bank branding but does not match official bank domain.",
      recommendation: "Verify the URL directly through the official bank website before proceeding."
    });
  }

  // 4. Unknown domain
  return applyFailsafe({
    threatLevel: "CAUTION",
    confidence: 80,
    reason: "Unrecognized domain. It is not listed as an official banking domain.",
    recommendation: "Avoid entering any sensitive banking information."
  });
}

function analyzeMessage(text: string): ScamAnalysisResult {
  let riskScore = 0;
  const matches: string[] = [];

  for (const keyword of SMS_HIGH_RISK_KEYWORDS) {
    if (text.includes(keyword)) {
      riskScore += 1;
      matches.push(keyword);
    }
  }

  if (riskScore >= 2) {
    return applyFailsafe({
      threatLevel: "HIGH RISK",
      confidence: 95,
      reason: "Message contains multiple high-risk fraud triggers like urgency and OTP requests.",
      recommendation: "Do not reply, click links, or share any information. Report this sender."
    });
  } else if (riskScore === 1) {
    return applyFailsafe({
      threatLevel: "CAUTION",
      confidence: 90,
      reason: `Message contains a suspicious trigger ('${matches[0]}'). Banks rarely ask for this unexpectedly.`,
      recommendation: "Verify this request by calling your bank's official helpline."
    });
  }

  return applyFailsafe({
    threatLevel: "SAFE",
    confidence: 95,
    reason: "No prominent scam patterns detected in the message.",
    recommendation: "Still, never share OTPs or passwords, even if the message seems safe."
  });
}

function analyzePhone(text: string): ScamAnalysisResult {
  // Simple heuristic for phone numbers
  return applyFailsafe({
    threatLevel: "CAUTION",
    confidence: 85,
    reason: "Unknown phone number. Scammers often use unofficial numbers for fake customer support.",
    recommendation: "Only use customer care numbers found on the back of your card or the official website."
  });
}

/**
 * Failsafe Rule: 
 * If confidence < 90, never return SAFE.
 */
function applyFailsafe(result: ScamAnalysisResult): ScamAnalysisResult {
  if (result.threatLevel === "SAFE" && result.confidence < 90) {
    return {
      threatLevel: "CAUTION",
      confidence: result.confidence,
      reason: "Confidence is too low to guarantee safety. " + result.reason,
      recommendation: result.recommendation
    };
  }
  return result;
}
