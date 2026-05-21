import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ExternalLink, Leaf } from "lucide-react";
import { useState } from "react";
import { RURAL_BANKING_DATA } from "@/data/smartServices";

interface RuralBankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  speakVoice: (eventKey: string, payload?: any) => void;
}

export function RuralBankingModal({ isOpen, onClose, t, speakVoice }: RuralBankingModalProps) {
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
          className="relative w-full sm:max-w-[420px] max-h-[90vh] bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 p-5 pb-3 border-b border-border/50 flex items-center justify-between bg-white relative z-10">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600 fill-emerald-600/20" />
                {t("ruralBankingSupport")}
              </h2>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {t("ruralBankingGuidance")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 bg-muted/50 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
            {RURAL_BANKING_DATA.map((option) => {
              const isExpanded = expandedId === option.id;
              
              const handleExpand = () => {
                if (!isExpanded) {
                  speakVoice("showingTopic", { serviceName: t(option.nameKey) });
                  setExpandedId(option.id);
                } else {
                  setExpandedId(null);
                }
              };

              return (
                <div key={option.id} className="bg-white border border-border/50 rounded-[20px] overflow-hidden shadow-sm">
                  <button
                    onClick={handleExpand}
                    className="w-full text-left p-4 flex items-center justify-between active:bg-muted/50 transition-colors"
                  >
                    <div className="pr-2">
                      <h3 className="font-bold text-[15px] text-foreground">{t(option.nameKey)}</h3>
                      <p className="text-[12px] font-medium text-muted-foreground mt-0.5 line-clamp-1">
                        {t(option.descriptionKey)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
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
                          <p className="text-[13px] font-medium text-foreground">{t(option.descriptionKey)}</p>
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(`https://www.google.com/search?q=${encodeURIComponent(t(option.nameKey) + " official website")}`, "_blank", "noopener,noreferrer");
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-[12px] font-bold rounded-full active:scale-95 transition-transform"
                            >
                              {option.id === "csp-help" ? t("locationServicesFuture") : t("openOfficialLink")}
                              {option.id !== "csp-help" && <ExternalLink className="w-3.5 h-3.5" />}
                            </button>
                          </div>
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
