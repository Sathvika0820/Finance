import { toast } from "sonner";
import {
  OFFICIAL_LINK_NOT_VERIFIED_LABEL,
  type OfficialLinkEntry,
  isVerifiedOfficialUrl,
} from "@/data/officialLinks";

export const SENSITIVE_DATA_WARNING =
  "For your safety, do not share OTP, PIN, CVV, card numbers, or banking passwords in BankHub.";

const sensitiveKeywordPattern =
  /\b(otp|one\s*time\s*password|aadhaar\s*otp|pin|atm\s*pin|upi\s*pin|cvv|cvv2|card\s*(number|no)?|banking\s*password|net\s*banking\s*password|netbanking\s*password|password|passcode)\b/i;

const cardLikePattern = /\b(?:\d[ -]?){12,19}\b/;
const shortSecretPattern = /\b\d{4,8}\b/;

export function containsSensitiveBankingData(value: string): boolean {
  const text = value.trim();
  if (!text) return false;

  if (sensitiveKeywordPattern.test(text)) return true;
  if (cardLikePattern.test(text)) return true;

  return /(otp|pin|cvv|password|aadhaar|card|upi)/i.test(text) && shortSecretPattern.test(text);
}

export function redactSensitiveBankingData(value: string): string {
  if (!containsSensitiveBankingData(value)) return value;
  return "[Sensitive banking data blocked]";
}

export function openVerifiedExternalLink(
  entry: OfficialLinkEntry | undefined,
  event?: Pick<Event, "preventDefault" | "stopPropagation"> | any,
): boolean {
  event?.preventDefault?.();
  event?.stopPropagation?.();

  if (!entry?.verified || !isVerifiedOfficialUrl(entry.officialLink)) {
    toast.warning(OFFICIAL_LINK_NOT_VERIFIED_LABEL);
    return false;
  }

  window.open(entry.officialLink, "_blank", "noopener,noreferrer");
  return true;
}
