import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useVoiceAssistant } from "@/lib/voice";
import { LANGUAGE_OPTIONS, useTranslation } from "@/lib/i18n";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: Props) {
  const { t, lang: appLang, setLang: setAppLang } = useTranslation();
  const { isMuted, toggleMute } = useVoiceAssistant();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white/95 z-[101] shadow-2xl overflow-y-auto flex flex-col border-l border-border/70 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between p-6 pb-3 border-b border-border/50">
              <h2 className="text-2xl font-bold text-foreground">{t("settings")}</h2>
              <button
                onClick={onClose}
                className="tap-target p-2 rounded-full hover:bg-muted transition-colors"
                aria-label={t("closeSettings")}
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              {/* App Language */}
              <section className="space-y-4 rounded-[18px] border border-border/60 bg-white/90 p-4 shadow-soft">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">{t("language")}</h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5 font-medium">{t("chooseAppLanguage")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((langItem) => (
                    <button
                      key={langItem.id}
                      onClick={() => setAppLang(langItem.id)}
                      dir={langItem.dir || "ltr"}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                        appLang === langItem.id
                          ? "border-slate-300 bg-slate-100 text-foreground shadow-sm"
                          : "border-border bg-white text-foreground hover:bg-muted/30"
                      }`}
                    >
                      <span className="text-sm font-semibold">{langItem.nativeLabel}</span>
                      {appLang === langItem.id && <Check className="w-4 h-4 ml-1 text-slate-700" />}
                    </button>
                  ))}
                </div>
              </section>

              <hr className="bg-border/60 border-0 h-px" />

              {/* Mute */}
              <section className="rounded-[18px] border border-border/60 bg-white/90 p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-foreground">{isMuted ? t("voiceAssistantMuted") : t("mute")}</h3>
                    <p className="text-[13px] text-muted-foreground mt-0.5 font-medium">
                      {isMuted ? t("voiceAssistantMuted") : t("voiceAssistantActive")}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={toggleMute}
                      className="p-1.5 focus:outline-none"
                    >
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${isMuted ? "bg-slate-900 border-slate-900" : "border-border"}`}>
                        {isMuted && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  </div>
                </div>
              </section>
              
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
