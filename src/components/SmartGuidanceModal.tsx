import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ExternalLink, Lightbulb, Landmark } from "lucide-react";
import { useState } from "react";
import { SMART_GUIDANCE_OPTIONS } from "@/data/smartServices";
import { BANKS, Bank, getBankDisplayName } from "@/data/banks";
import { BankLogo } from "@/components/BankLogo";
import { openServicePage } from "@/lib/services";
import { OFFICIAL_LINK_NOT_VERIFIED_LABEL } from "@/data/officialLinks";

interface SmartGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  lang: string;
  openBankSafely: (b: Bank, source?: string, event?: any) => void;
  speakVoice: (eventKey: string, payload?: any) => void;
}

export function SmartGuidanceModal({ isOpen, onClose, t, lang, openBankSafely, speakVoice }: SmartGuidanceModalProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pb-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-[420px] max-h-[90vh] bg-white/95 rounded-t-[28px] sm:rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-border/70 backdrop-blur-xl"
        >
          {/* Header */}
          <div className="shrink-0 p-5 pb-3 border-b border-border/50 flex items-center justify-between bg-white/90 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                {t("smartBankingGuidance")}
              </h2>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {t("findRightBankingService")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="tap-target p-2 -mr-2 bg-muted/50 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            {SMART_GUIDANCE_OPTIONS.map((option) => {
              const isExpanded = expandedId === option.id;
              
              const handleExpand = () => {
                if (!isExpanded) {
                  speakVoice("showingGuidanceOption", { serviceName: t(option.nameKey) });
                  setExpandedId(option.id);
                } else {
                  setExpandedId(null);
                }
              };

              return (
                <div key={option.id} className="bg-white/95 border border-border/50 rounded-[18px] overflow-hidden shadow-sm">
                  <button
                    onClick={handleExpand}
                    className="w-full text-left p-4 flex items-center justify-between active:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-bold text-[15px] text-foreground">{t(option.nameKey)}</h3>
                      <p className="text-[12px] font-medium text-muted-foreground mt-0.5 line-clamp-1">
                        {option.id === "complaint-support" || option.id === "nearest-branch-atm" 
                          ? t("findRightBankingService") // We can just use a generic text if no specific desc
                          : t("checkLatestRates")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        {t("viewOptions")}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-border/50 bg-muted/5"
                      >
                        <div className="p-4 pt-3 space-y-3">
                          {option.suggestedBanks.length > 0 ? (
                            <>
                              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">{t("recommendedBanks")}</p>
                              <div className="space-y-2">
                                {option.suggestedBanks.map((bankId) => {
                                  const bank = BANKS.find(b => b.id === bankId);
                                  if (!bank) return null;
                                  return (
                                    <div key={bank.id} className="flex items-center justify-between bg-white border border-border/60 p-3 rounded-2xl">
                                      <div className="flex items-center gap-3">
                                        <BankLogo bank={bank} size="sm" />
                                        <p className="font-bold text-[13px] text-foreground">{getBankDisplayName(bank, lang)}</p>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          let serviceType = "";
                                          if (option.id === "education-loan") serviceType = "educationLoan";
                                          else if (option.id === "home-loan") serviceType = "homeLoan";
                                          else if (option.id === "savings-account") serviceType = "savingsAccount";
                                          else if (option.id === "fixed-deposit") serviceType = "fixedDeposit";
                                          else if (option.id === "gold-loan") serviceType = "goldLoan";

                                          openServicePage(serviceType, bank.id, option.id, e);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background text-[11px] font-bold rounded-full active:scale-95 transition-transform"
                                      >
                                        Open {bank.name.split(" ")[0]} {t(option.nameKey)}
                                        <ExternalLink className="w-3 h-3" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          ) : option.id === "complaint-support" ? (
                            <div className="space-y-2">
                               <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">{t("viewOptions")}</p>
                               {[
                                 { label: "RBI Complaint Portal", key: "rbiComplaintPortal" },
                                 { label: "RBI Sachet Portal", key: "rbiSachet" },
                                 { label: "National Cyber Crime Portal", key: "cyberCrimePortal" }
                               ].map((service, idx) => (
                                 <div key={idx} className="flex items-center justify-between bg-white border border-border/60 p-3 rounded-2xl">
                                    <p className="font-bold text-[13px] text-foreground">{service.label}</p>
                                    <button
                                      onClick={(e) => openServicePage("complaintSupport", service.key, "complaint-support", e)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background text-[11px] font-bold rounded-full active:scale-95 transition-transform"
                                    >
                                      Open {service.label}
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                 </div>
                               ))}
                            </div>
                          ) : option.id === "nearest-branch-atm" ? (
                            <div className="space-y-2">
                               <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">{t("viewOptions")}</p>
                               {[
                                 "Bank official branch locator",
                                 "Bank official ATM locator"
                               ].map((service, idx) => (
                                 <div key={idx} className="flex items-center justify-between bg-white border border-border/60 p-3 rounded-2xl">
                                    <p className="font-bold text-[13px] text-foreground">{service}</p>
                                    <button
                                      disabled
                                      title={OFFICIAL_LINK_NOT_VERIFIED_LABEL}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold rounded-full cursor-not-allowed"
                                    >
                                      {OFFICIAL_LINK_NOT_VERIFIED_LABEL}
                                    </button>
                                 </div>
                               ))}
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="shrink-0 p-4 text-center bg-white border-t border-border/50">
            <p className="text-[11px] font-medium text-muted-foreground/80">
              {t("credentialsNote")}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
