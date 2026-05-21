import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import {
  X, ShieldCheck, AlertTriangle, Phone, Link2, MessageSquare,
  Smartphone, CreditCard, QrCode, KeyRound, UserX, Globe,
  ExternalLink, Search, Info, PhoneCall, ChevronDown
} from "lucide-react";

/* ─── Official Links (single source of truth) ─── */
const CYBER_COMPLAINT_URL = "https://cybercrime.gov.in/";
const HELPLINE_NUMBER = "1930";

/* ─── Types ─── */
interface SafetyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  lang: string;
  speakVoice: (eventKey: string, payload?: any) => void;
}

interface ScamCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  steps: string[];
}

/* ─── Scam Categories ─── */
const SCAM_CATEGORIES: ScamCategory[] = [
  {
    id: "fake-website",
    title: "Fake Banking Website",
    description: "Lookalike URLs that mimic official bank login pages to steal credentials.",
    icon: Globe,
    color: "text-red-500",
    bg: "bg-red-50",
    steps: [
      "Close the suspicious website immediately.",
      "Check the URL — official bank sites use https:// and the exact registered domain.",
      "Never enter OTP, PIN, CVV or password on an unverified site.",
      "Visit the bank's official website directly or use the official bank app.",
      "If credentials were entered, change your password immediately and contact your bank.",
    ],
  },
  {
    id: "fake-sms",
    title: "Fake SMS / WhatsApp",
    description: "Fraudulent messages claiming to be from your bank asking for personal data.",
    icon: MessageSquare,
    color: "text-orange-500",
    bg: "bg-orange-50",
    steps: [
      "Do not click any links in suspicious SMS or WhatsApp messages.",
      "Banks never ask for OTP, PIN, or password via SMS or WhatsApp.",
      "Do not call back numbers mentioned in such messages.",
      "Report the message and block the sender.",
      "Contact your bank directly using the number on the official website.",
    ],
  },
  {
    id: "fake-call",
    title: "Fake Bank Call",
    description: "Callers impersonating bank officials requesting OTP or account details.",
    icon: Phone,
    color: "text-rose-500",
    bg: "bg-rose-50",
    steps: [
      "Hang up immediately if the caller asks for OTP, PIN, CVV or password.",
      "Banks NEVER ask for OTP or passwords over phone calls.",
      "Do not press any IVR keys as instructed by such callers.",
      "Note the number and report it to 1930.",
      "Call your bank's official helpline to verify any genuine request.",
    ],
  },
  {
    id: "upi-fraud",
    title: "UPI Fraud",
    description: "Fake UPI collection requests or payment reversal scams.",
    icon: QrCode,
    color: "text-purple-500",
    bg: "bg-purple-50",
    steps: [
      "Entering UPI PIN is for sending money — never for receiving it.",
      "Do not enter your UPI PIN for any 'refund' or 'reversal' requests.",
      "Verify the recipient's UPI ID before any payment.",
      "Report fraudulent UPI IDs to your UPI app and NPCI.",
      "If money is lost, call 1930 immediately.",
    ],
  },
  {
    id: "loan-app-scam",
    title: "Fake Loan App Scam",
    description: "Unofficial apps offering instant loans and then harassing borrowers.",
    icon: Smartphone,
    color: "text-amber-500",
    bg: "bg-amber-50",
    steps: [
      "Download loan apps only from official RBI-regulated bank websites or verified app stores.",
      "Never pay any upfront 'processing fee' before a loan is disbursed.",
      "Check if the lender is registered with RBI.",
      "Do not share Aadhaar, PAN, or bank details with unverified apps.",
      "Report predatory lending apps to cybercrime.gov.in.",
    ],
  },
  {
    id: "otp-scam",
    title: "OTP Scam",
    description: "Fraudsters trick users into sharing OTPs for unauthorized transactions.",
    icon: KeyRound,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    steps: [
      "NEVER share OTP with anyone — not even people claiming to be bank officials.",
      "OTPs expire quickly; if asked to wait and share OTP later, it's a scam.",
      "An OTP generated on your device is solely for your own use.",
      "Block the contact and report to your bank immediately.",
      "Call 1930 if any unauthorized transaction occurred.",
    ],
  },
  {
    id: "kyc-scam",
    title: "Fake KYC Update Scam",
    description: "Messages demanding KYC update via insecure links or apps.",
    icon: UserX,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    steps: [
      "Banks send official KYC notices through registered mail or in-branch visits.",
      "Do not click KYC update links in SMS, WhatsApp, or email.",
      "Visit your bank branch in person for genuine KYC updates.",
      "Do not install screen-sharing apps (like AnyDesk) for 'KYC assistance'.",
      "Report suspicious KYC requests to your bank and 1930.",
    ],
  },
  {
    id: "phishing-link",
    title: "Phishing Links",
    description: "Links that imitate official portals to harvest banking credentials.",
    icon: Link2,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    steps: [
      "Hover over links to see the actual destination URL before clicking.",
      "Look for misspellings in domain names (e.g., sbi-onllne.com vs sbi.co.in).",
      "Never enter banking credentials after clicking a link from email or social media.",
      "Use bookmarks for your bank's official website.",
      "Report phishing sites to CERT-In at incidents@cert-in.org.in.",
    ],
  },
  {
    id: "fake-customer-care",
    title: "Fake Customer Care Number",
    description: "Numbers listed on unofficial sites claiming to be bank helplines.",
    icon: PhoneCall,
    color: "text-teal-600",
    bg: "bg-teal-50",
    steps: [
      "Find customer care numbers only from the official bank website or card/passbook.",
      "Do not search for customer care numbers via Google ads.",
      "Do not share account details, OTP, or PIN with any helpline caller.",
      "Official bank helplines never ask for OTP, PIN, or CVV.",
      "Report fake numbers to 1930 and the bank's official helpline.",
    ],
  },
];

/* ─── Checker keywords ─── */
const SUSPICIOUS_KEYWORDS = [
  "otp", "pin", "cvv", "password", "verify", "kyc", "urgent", "suspended",
  "blocked", "reward", "lottery", "prize", "win", "claim", "click here",
  "bit.ly", "tinyurl", "free", "refund", "cashback", "loan approved",
  "account deactivated", "credit card blocked",
];

function analyzeInput(text: string): boolean {
  if (!text.trim()) return false;
  const lower = text.toLowerCase();
  return SUSPICIOUS_KEYWORDS.some((kw) => lower.includes(kw));
}

/* ─── Main Component ─── */
export function SafetyShieldModal({
  isOpen,
  onClose,
}: SafetyShieldModalProps) {
  const [selectedScam, setSelectedScam] = useState<ScamCategory | null>(null);
  const [checkerText, setCheckerText] = useState("");
  const [checkerResult, setCheckerResult] = useState<"suspicious" | "neutral" | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const checkerRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  const handleCheck = () => {
    if (!checkerText.trim()) return;
    setCheckerResult(analyzeInput(checkerText) ? "suspicious" : "neutral");
  };

  const handleScamSelect = (scam: ScamCategory) => {
    setSelectedScam(scam);
    setExpandedCard(scam.id);
  };

  const openCyberPortal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(CYBER_COMPLAINT_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-[3px]"
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative w-full sm:max-w-[500px] max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Banking Safety Shield"
        >
          {/* ── Header ── */}
          <div className="shrink-0 px-5 pt-5 pb-4 border-b border-border/50 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-green-50 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-green-600 fill-green-100" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-foreground leading-tight">Banking Safety Shield</h2>
                <p className="text-[12px] font-medium text-muted-foreground mt-0.5">Stay protected from online banking scams</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 bg-muted/50 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* ── Scrollable Content ── */}
          <div className="flex-1 overflow-y-auto">

            {/* Emergency Banner */}
            <div className="mx-4 mt-4 rounded-[16px] bg-gradient-to-r from-red-600 to-rose-500 p-4 text-white shadow-lg">
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">🚨 Emergency Cyber Fraud Helpline</p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[32px] font-black leading-none tracking-tight">{HELPLINE_NUMBER}</p>
                  <p className="text-[12px] font-medium opacity-90 mt-1">Call immediately if money is lost</p>
                </div>
                <button
                  onClick={openCyberPortal}
                  className="flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 active:scale-95 transition-all rounded-[12px] px-4 py-3 text-white text-center"
                  aria-label="File Cyber Complaint on official portal"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-[10px] font-bold leading-tight">File Cyber<br />Complaint</span>
                </button>
              </div>
            </div>

            {/* Warning strip */}
            <div className="mx-4 mt-3 rounded-[12px] bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[12px] font-semibold text-amber-800 leading-snug">
                If money is lost in online fraud, immediately call <strong>1930</strong> and file a complaint on the official cyber crime portal.
              </p>
            </div>

            {/* ── Scam Categories ── */}
            <div className="px-4 mt-5">
              <h3 className="text-[13px] font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Select your scam type for guidance
              </h3>

              <div className="space-y-2">
                {SCAM_CATEGORIES.map((scam) => {
                  const Icon = scam.icon;
                  const isExpanded = expandedCard === scam.id;
                  return (
                    <div
                      key={scam.id}
                      className="bg-white border border-border/60 rounded-[16px] overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => {
                          handleScamSelect(scam);
                          setExpandedCard(isExpanded ? null : scam.id);
                        }}
                        className="w-full flex items-center justify-between gap-3 p-3.5 text-left active:bg-muted/30 transition-colors"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-[10px] ${scam.bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${scam.color}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[13px] text-foreground leading-tight">{scam.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{scam.description}</p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-border/50"
                          >
                            <div className="p-4 pt-3 bg-muted/5 space-y-3">
                              {/* Scam type selected label */}
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${scam.bg} ${scam.color}`}>
                                <Icon className="w-3 h-3" />
                                <span className="text-[11px] font-bold">{scam.title} selected</span>
                              </div>

                              {/* Immediate safety steps */}
                              <div>
                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                  Immediate Safety Steps
                                </p>
                                <ul className="space-y-2">
                                  {scam.steps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                      </span>
                                      <span className="text-[12px] font-medium text-foreground/80 leading-snug">{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Helpline */}
                              <div className="bg-red-50 border border-red-200 rounded-[12px] px-4 py-3 flex items-center justify-between">
                                <div>
                                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Cyber Fraud Helpline</p>
                                  <p className="text-[22px] font-black text-red-700 leading-tight">{HELPLINE_NUMBER}</p>
                                </div>
                                <a
                                  href={`tel:${HELPLINE_NUMBER}`}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-[10px] text-[11px] font-bold active:scale-95 transition-transform"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  Call Now
                                </a>
                              </div>

                              {/* File complaint button */}
                              <button
                                onClick={openCyberPortal}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-foreground text-background rounded-[12px] font-bold text-[13px] active:scale-[0.98] transition-transform"
                                aria-label="File Cyber Complaint - opens official cybercrime.gov.in"
                              >
                                <ExternalLink className="w-4 h-4" />
                                File Cyber Complaint
                              </button>

                              {/* Warning */}
                              <div className="bg-amber-50 border border-amber-200 rounded-[10px] px-3 py-2.5">
                                <p className="text-[11px] font-semibold text-amber-800 leading-snug">
                                  ⚠️ If money is lost in online fraud, immediately call <strong>1930</strong> and file a complaint on the official cyber crime portal.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Scam Checker ── */}
            <div className="mx-4 mt-5 mb-2 bg-white border border-border/60 rounded-[20px] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-bold text-[14px] text-foreground flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-500" />
                  Suspicious Message / URL Checker
                </h3>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Paste suspicious text, URL, SMS, or a phone number for safety guidance.
                </p>
              </div>

              <div className="p-4 space-y-3">
                <textarea
                  ref={checkerRef}
                  value={checkerText}
                  onChange={(e) => {
                    setCheckerText(e.target.value);
                    setCheckerResult(null);
                  }}
                  placeholder="Paste suspicious text, URL, SMS text or phone number here…"
                  rows={3}
                  className="w-full px-4 py-3 text-[13px] font-medium bg-muted/10 border border-border/80 rounded-[12px] resize-none outline-none focus:border-blue-400 transition-colors placeholder:text-muted-foreground/60 placeholder:font-normal"
                  aria-label="Enter suspicious message or URL"
                />

                <button
                  onClick={handleCheck}
                  disabled={!checkerText.trim()}
                  className="w-full py-2.5 bg-foreground text-background rounded-[12px] font-bold text-[13px] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  Check for Safety Guidance
                </button>

                {/* Disclaimer — always visible once checker is shown */}
                <p className="text-[11px] text-muted-foreground text-center font-medium">
                  ℹ️ This is basic safety guidance, not guaranteed scam detection.
                </p>

                {/* Result */}
                <AnimatePresence>
                  {checkerResult !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className={`rounded-[14px] p-4 border ${
                        checkerResult === "suspicious"
                          ? "bg-red-50 border-red-200"
                          : "bg-green-50 border-green-200"
                      }`}
                    >
                      {checkerResult === "suspicious" ? (
                        <>
                          <p className="font-bold text-[13px] text-red-700 flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4" />
                            Suspicious patterns detected — follow these precautions:
                          </p>
                          <ul className="space-y-2 mb-4">
                            {[
                              "Do NOT enter OTP, UPI PIN, CVV or net banking password.",
                              "Do NOT click any links in this message.",
                              "Verify only through the official bank website or official app.",
                              "Do NOT share your Aadhaar, PAN or account number.",
                              "Call 1930 immediately if money is lost.",
                              "File complaint at cybercrime.gov.in",
                            ].map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-[12px] text-red-800 font-medium">
                                <span className="text-red-500 mt-0.5">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={openCyberPortal}
                            className="w-full py-2.5 bg-red-600 text-white rounded-[10px] font-bold text-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            File Cyber Complaint
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2 fill-green-100" />
                          <p className="font-bold text-[13px] text-green-800 mb-1">No obvious scam keywords detected</p>
                          <p className="text-[12px] text-green-700 leading-snug">
                            Still, never share OTP, PIN, CVV or passwords with anyone. When in doubt, contact your bank directly.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Official Sources ── */}
            <div className="mx-4 mt-4 mb-4">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Official Safety Portals
              </p>
              <div className="space-y-2">
                {[
                  { name: "National Cyber Crime Portal", url: "https://cybercrime.gov.in/", badge: "File Complaint" },
                  { name: "Reserve Bank of India (RBI)", url: "https://rbi.org.in/", badge: "RBI" },
                  { name: "RBI Sachet Portal", url: "https://sachet.rbi.org.in/", badge: "Sachet" },
                  { name: "CERT-In", url: "https://www.cert-in.org.in/", badge: "CERT‑In" },
                  { name: "NPCI / UPI Safety", url: "https://www.npci.org.in/", badge: "NPCI" },
                ].map((link) => (
                  <div
                    key={link.url}
                    className="flex items-center justify-between bg-white border border-border/60 px-4 py-3 rounded-[14px]"
                  >
                    <p className="font-bold text-[12px] text-foreground">{link.name}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(link.url, "_blank", "noopener,noreferrer");
                      }}
                      aria-label={`Open ${link.name}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 border border-border/50 text-foreground text-[10px] font-bold rounded-lg active:scale-95 transition-transform"
                    >
                      {link.badge}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety rules footer */}
            <div className="mx-4 mb-5 rounded-[14px] bg-slate-50 border border-slate-200 p-4">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">BankHub Safety Rules</p>
              <ul className="space-y-1.5">
                {[
                  "BankHub never asks for OTP, PIN, CVV or banking passwords.",
                  "BankHub redirects only to verified official bank/government websites.",
                  "No personal banking credentials are stored by BankHub.",
                  "For real help, always contact your bank directly.",
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-700 font-medium leading-snug">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
