import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Landmark,
  FileText,
  Award,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import { LoanComparisonEntry } from "@/data/loanData";
import { BANKS, getBankDisplayName } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";
import { OfficialLinkButton } from "@/components/OfficialLinkButton";

interface LoanInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: LoanComparisonEntry | null;
  lang: string;
}

export const LoanInfoModal: React.FC<LoanInfoModalProps> = ({
  isOpen,
  onClose,
  entry,
  lang,
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  if (!isOpen || !entry) return null;

  const bank = BANKS.find((b) => b.id === entry.bankId);
  const bankDisplayName = bank ? getBankDisplayName(bank, lang) : entry.bankName;

  // Localized getters
  const l = (obj: Record<string, any>) => obj[lang] || obj["english"] || "";
  const lArr = (obj: Record<string, string[]>) => obj[lang] || obj["english"] || [];

  const loanTypeLabel = l(entry.loanTypeLabel);
  const interestRateDisplay = l(entry.interestRateDisplay);
  const processingFee = l(entry.processingFee);
  const repaymentPeriod = l(entry.repaymentPeriod);
  const howToApply = l(entry.howToApply);
  const eligibility = l(entry.eligibility);
  const safetyNote = l(entry.safetyNote);
  const documents = lArr(entry.documentsRequired);
  const benefits = lArr(entry.benefits);

  // Document checklist toggle
  const toggleDoc = (idx: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-0 overflow-hidden">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-[4px]"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0.5 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="relative w-full sm:max-w-[480px] max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-[32px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden border border-border/10"
        >
          {/* Top Notch for mobile */}
          <div className="w-full flex justify-center pt-2.5 pb-1 sm:hidden shrink-0">
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="shrink-0 px-6 py-4 border-b border-border/40 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3">
              {bank && <BankLogo bank={bank} size="md" />}
              <div>
                <h3 className="text-[17px] font-bold text-foreground leading-tight">
                  {bankDisplayName}
                </h3>
                <p className="text-[12px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md inline-block mt-1">
                  {loanTypeLabel}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-muted/65 hover:bg-muted/90 rounded-full transition-colors active:scale-90"
              aria-label="Close details"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 bg-slate-50/40 scrollbar-thin">
            
            {/* highlights grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white border border-border/40 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-purple-600 mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Interest Rate</span>
                </div>
                <p className="text-[14px] font-extrabold text-foreground leading-snug">
                  {interestRateDisplay}
                </p>
              </div>

              <div className="bg-white border border-border/40 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-indigo-600 mb-1.5">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Repayment Period</span>
                </div>
                <p className="text-[14px] font-extrabold text-foreground leading-snug">
                  {repaymentPeriod}
                </p>
              </div>
            </div>

            {/* All About the Loan / Overview */}
            <div className="bg-white border border-border/40 rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <Landmark className="w-4 h-4 text-slate-700" />
                <h4 className="text-[13px] font-bold text-foreground">All About the Loan</h4>
              </div>
              <p className="text-[12px] font-semibold text-muted-foreground leading-relaxed">
                This loan product from {bankDisplayName} provides finance options tailored specifically for {loanTypeLabel.toLowerCase()} requirements. 
                {processingFee && ` Standard processing fee: ${processingFee}.`}
              </p>
            </div>

            {/* How to Apply */}
            <div className="bg-white border border-border/40 rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <h4 className="text-[13px] font-bold text-foreground">How to Apply</h4>
              </div>
              <p className="text-[12px] font-medium text-muted-foreground leading-relaxed bg-emerald-50/30 border border-emerald-100/50 p-3 rounded-xl">
                {howToApply}
              </p>
            </div>

            {/* Eligibility */}
            <div className="bg-white border border-border/40 rounded-2xl p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <h4 className="text-[13px] font-bold text-foreground">Eligibility Criteria</h4>
              </div>
              <div className="text-[12px] font-semibold text-muted-foreground leading-relaxed bg-blue-50/20 border border-blue-100/30 p-3 rounded-xl">
                {eligibility}
              </div>
            </div>

            {/* Benefits */}
            {benefits.length > 0 && (
              <div className="bg-white border border-border/40 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h4 className="text-[13px] font-bold text-foreground">Key Benefits</h4>
                </div>
                <ul className="space-y-2.5">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[12px] font-semibold text-muted-foreground leading-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Documents Checklist */}
            {documents.length > 0 && (
              <div className="bg-white border border-border/40 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <div>
                    <h4 className="text-[13px] font-bold text-foreground">Documents Checklist</h4>
                    <p className="text-[9px] font-bold text-muted-foreground">Tap documents you have ready</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {documents.map((doc, idx) => {
                    const isChecked = !!checkedDocs[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleDoc(idx)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          isChecked
                            ? "bg-purple-50/30 border-purple-200"
                            : "bg-slate-50/40 border-border/50 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? "bg-purple-600 border-purple-600 text-white"
                              : "border-muted-foreground/30 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-[12px] leading-normal font-semibold transition-all ${
                            isChecked ? "text-slate-500 line-through decoration-slate-400" : "text-foreground"
                          }`}
                        >
                          {doc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Important Warning */}
            <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <h4 className="text-[12px] font-extrabold">Important Warnings</h4>
              </div>
              <p className="text-[11px] font-semibold text-amber-900/80 leading-relaxed">
                {safetyNote}
              </p>
            </div>

          </div>

          {/* Action Footer */}
          <div className="shrink-0 p-4 border-t border-border/40 bg-white flex flex-col gap-3 relative z-10">
            {/* Localized Disclaimer */}
            <p className="text-[9.5px] font-bold text-center text-muted-foreground/90 leading-tight">
              ⚠️ Interest rates may change. Please verify the latest rate on the official bank website before applying.
            </p>

            <OfficialLinkButton
              url={entry.officialWebsite}
              label={`Apply at Official ${entry.bankName}`}
              className="w-full py-3 text-[13px]"
            />
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
