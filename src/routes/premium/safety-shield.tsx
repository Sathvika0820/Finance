import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ShieldCheck, AlertTriangle, Phone, Link2, MessageSquare,
  Smartphone, CreditCard, QrCode, KeyRound, UserX, Globe,
  ExternalLink, Search, Info, PhoneCall, ChevronDown, Award
} from "lucide-react";
import type { ElementType } from "react";
import { OfficialLinkButton } from "@/components/OfficialLinkButton";
import {
  CYBER_COMPLAINT_PORTAL,
  CYBER_FRAUD_HELPLINE,
  CYBER_SCAM_CATEGORIES,
} from "@/data/cyberSafetyData";
import { getOfficialLinkEntry } from "@/data/officialLinks";
import { openVerifiedExternalLink } from "@/lib/security";
import { useTranslation } from "@/lib/i18n";
import { useVoiceAssistant } from "@/lib/voice";
import { analyzeScamInput, ScamAnalysisResult } from "@/services/scamAnalyzer";
import { AppShell } from '@/components/AppShell';

const HELPLINE_NUMBER = CYBER_FRAUD_HELPLINE;

interface ScamCategory {
  id: string;
  title: string;
  description: string;
  icon: ElementType;
  color: string;
  bg: string;
  steps: string[];
}

const SCAM_ICON_MAP: Record<string, ElementType> = {
  globe: Globe,
  message: MessageSquare,
  phone: Phone,
  qr: QrCode,
  smartphone: Smartphone,
  key: KeyRound,
  userx: UserX,
  link: Link2,
  "phone-call": PhoneCall,
};

const ACTIVE_SCAM_CATEGORIES: ScamCategory[] = CYBER_SCAM_CATEGORIES.map((scam) => ({
  ...scam,
  icon: SCAM_ICON_MAP[scam.icon],
}));

export const Route = createFileRoute('/premium/safety-shield')({
  component: () => (
    <AppShell>
      <PremiumSafetyShield />
    </AppShell>
  ),
});

function PremiumSafetyShield() {
  const { t } = useTranslation();
  const { speakVoice } = useVoiceAssistant();
  const [selectedScam, setSelectedScam] = useState<ScamCategory | null>(null);
  const [checkerText, setCheckerText] = useState("");
  const [checkerResult, setCheckerResult] = useState<ScamAnalysisResult | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const checkerRef = useRef<HTMLTextAreaElement>(null);

  const localizedSafetySteps = [
    t("cyberFraudWarning"),
    t("bankHubOfficialRedirectTrust"),
    t("callImmediatelyIfMoneyLost"),
  ];

  const getScamCopy = (_scam: ScamCategory) => ({
    title: t("bankingSafetyShield"),
    description: t("cyberFraudWarning"),
  });

  const handleCheck = () => {
    if (!checkerText.trim()) return;
    setCheckerResult(analyzeScamInput(checkerText));
  };

  const handleScamSelect = (scam: ScamCategory) => {
    setSelectedScam(scam);
    setExpandedCard(scam.id);
  };

  return (
    <div className="min-h-screen bg-purple-50/30 pb-24">
      {/* Header Bar */}
      <div className="bg-white border-b border-purple-200 px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-purple-100 transition-colors text-purple-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-purple-900 leading-tight">Banking Shield Pro</h1>
            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3" /> Premium Protection
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 mt-4">
        
        {/* Scam Checker Section */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[24px] p-1 border border-purple-400/50 shadow-lg mb-8">
          <div className="bg-white rounded-[22px] p-5 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-purple-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <h3 className="font-bold text-[16px] text-slate-900 leading-tight">Advanced Scam Analyzer</h3>
                <p className="text-[12px] text-slate-500 font-medium">Paste suspicious SMS, URLs, or emails to scan for threats</p>
              </div>
            </div>

            <div className="space-y-3">
              <textarea
                ref={checkerRef}
                value={checkerText}
                onChange={(e) => {
                  setCheckerText(e.target.value);
                  setCheckerResult(null);
                }}
                placeholder="Paste the suspicious message or link here..."
                rows={3}
                className="w-full px-4 py-3 text-[13px] font-medium bg-slate-50 border border-slate-200 rounded-[12px] resize-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
              />

              <button
                onClick={handleCheck}
                disabled={!checkerText.trim()}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-[12px] font-bold text-[14px] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Analyze Threat Level
              </button>

              <AnimatePresence>
                {checkerResult !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`rounded-[14px] p-5 mt-4 border ${
                      checkerResult.threatLevel === "SAFE" 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                        : checkerResult.threatLevel === "CAUTION"
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : "bg-rose-50 border-rose-200 text-rose-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {checkerResult.threatLevel !== "SAFE" ? <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" /> : <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-black text-[16px] uppercase tracking-wider`}>
                            {checkerResult.threatLevel}
                          </p>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            checkerResult.confidence >= 90 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {checkerResult.confidence}% Confidence
                          </span>
                        </div>
                        <p className="text-[14px] font-medium mb-3 opacity-90">{checkerResult.reason}</p>
                        
                        <div className="bg-white/60 rounded-xl p-3 mb-2 text-[13px] font-medium shadow-sm">
                          <span className="font-bold opacity-75 uppercase tracking-wider text-[10px] block mb-1">AI Recommendation</span>
                          {checkerResult.recommendation}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
