import { motion, AnimatePresence } from "framer-motion";
import { X, Check, VolumeX } from "lucide-react";
import { useVoiceAssistant } from "@/lib/voice";
import { useTranslation, AppLanguage } from "@/lib/i18n";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: Props) {
  const { t, lang: appLang, setLang: setAppLang } = useTranslation();
  const { isMuted, toggleMute } = useVoiceAssistant();

  const appLanguages: { id: AppLanguage; label: string }[] = [
    { id: "english", label: "English" },
    { id: "hindi", label: "हिन्दी" },
    { id: "telugu", label: "తెలుగు" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl overflow-y-auto flex flex-col"
          >
            <div className="flex items-center justify-between p-6 pb-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("settings")}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              {/* App Language */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">Language</h3>
                  <p className="text-[13px] text-muted-foreground mt-0.5 font-medium">Choose your preferred app and voice language.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {appLanguages.map((langItem) => (
                    <button
                      key={langItem.id}
                      onClick={() => setAppLang(langItem.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                        appLang === langItem.id
                          ? "border-blue-100 bg-blue-50 text-foreground"
                          : "border-border bg-transparent text-foreground hover:bg-muted/30"
                      }`}
                    >
                      <span className="text-sm font-semibold">{langItem.label}</span>
                      {appLang === langItem.id && <Check className="w-4 h-4 ml-1 text-blue-500" />}
                    </button>
                  ))}
                </div>
              </section>

              <hr className="bg-border/60 border-0 h-px" />

              {/* Mute */}
              <section>
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
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${isMuted ? "bg-blue-500 border-blue-500" : "border-border"}`}>
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
