import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Volume2, Shield, ExternalLink } from "lucide-react";

interface SeniorCitizenModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  speakVoice: (eventKey: string, payload?: any) => void;
}

const SENIOR_FEATURES = [
  { key: "largerText", icon: Eye, color: "text-slate-700", bg: "bg-slate-100" },
  { key: "voiceHelp", icon: Volume2, color: "text-emerald-700", bg: "bg-emerald-50" },
  { key: "safeBankingTips", icon: Shield, color: "text-amber-700", bg: "bg-amber-50" },
];

export function SeniorCitizenModal({ isOpen, onClose, t, speakVoice }: SeniorCitizenModalProps) {
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
          <div className="shrink-0 p-5 pb-3 border-b border-border/50 flex items-center justify-between bg-white/90 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-slate-700" />
                {t("seniorCitizenMode")}
              </h2>
              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {t("largerTextAndEasierNavigation")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="tap-target p-2 -mr-2 bg-muted/50 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            {SENIOR_FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.key}
                  className="bg-white/95 border border-border/50 rounded-[18px] p-4 flex items-start gap-3 shadow-sm"
                >
                  <div
                    className={`w-10 h-10 rounded-[12px] ${feature.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[15px] text-foreground">{t(feature.key)}</h3>
                    <p className="text-[12px] font-medium text-muted-foreground mt-0.5">
                      {t(`${feature.key}Desc`)}
                    </p>
                  </div>
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
