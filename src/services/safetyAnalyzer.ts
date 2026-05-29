export type RiskLevel = "Safe" | "Suspicious" | "High Risk";

export interface SafetyAnalysisResult {
  riskLevel: RiskLevel;
  scamTypeKey: string | null;
  summaryKey: string;
  recommendationKey: string;
}

const HIGH_RISK_KEYWORDS = [
  "urgent", "kyc expired", "account blocked", "click immediately",
  "win money", "lottery", "prize", "loan approved instantly",
  "suspend", "deactivated", "cvv", "otp", "pin", "password"
];

const SUSPICIOUS_KEYWORDS = [
  "free", "refund", "cashback", "claim", "verify",
  "bit.ly", "tinyurl", "kyc"
];

const PHISHING_DOMAINS = [
  "sbi-onllne", "hdfc-rewards", "icici-kyc", "bank-update"
];

function isShortenedOrSuspiciousURL(text: string): boolean {
  return /bit\.ly|tinyurl|t\.co|goo\.gl/i.test(text);
}

function hasPhishingDomain(text: string): boolean {
  return PHISHING_DOMAINS.some(domain => text.toLowerCase().includes(domain));
}

function hasKeywords(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
}

export function analyzeSafetyInput(text: string): SafetyAnalysisResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      riskLevel: "Safe",
      scamTypeKey: null,
      summaryKey: "safeSummary",
      recommendationKey: "safeRecommendation"
    };
  }

  // Check for High Risk patterns
  if (hasPhishingDomain(trimmed) || hasKeywords(trimmed, HIGH_RISK_KEYWORDS)) {
    let scamType = "generalHighRisk";
    if (trimmed.toLowerCase().includes("kyc")) scamType = "fakeKycScam";
    else if (trimmed.toLowerCase().includes("loan")) scamType = "fakeLoanScam";
    else if (trimmed.toLowerCase().includes("otp") || trimmed.toLowerCase().includes("pin")) scamType = "otpScam";

    return {
      riskLevel: "High Risk",
      scamTypeKey: scamType,
      summaryKey: "highRiskSummary",
      recommendationKey: "highRiskRecommendation"
    };
  }

  // Check for Suspicious patterns
  if (isShortenedOrSuspiciousURL(trimmed) || hasKeywords(trimmed, SUSPICIOUS_KEYWORDS)) {
    return {
      riskLevel: "Suspicious",
      scamTypeKey: "suspiciousMessage",
      summaryKey: "suspiciousSummary",
      recommendationKey: "suspiciousRecommendation"
    };
  }

  // Phone number heuristic (10 digits might just be suspicious if context is bad, but generally Safe/Neutral alone)
  if (/^\d{10}$/.test(trimmed.replace(/[\s()+-]/g, ""))) {
    return {
      riskLevel: "Suspicious",
      scamTypeKey: "suspiciousPhone",
      summaryKey: "suspiciousPhoneSummary",
      recommendationKey: "suspiciousPhoneRecommendation"
    };
  }

  // Default to Safe
  return {
    riskLevel: "Safe",
    scamTypeKey: null,
    summaryKey: "safeSummary",
    recommendationKey: "safeRecommendation"
  };
}
