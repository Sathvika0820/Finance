import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, FileSignature, ShieldCheck, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { FormAssistantEngine } from "@/components/FormAssistantEngine";

export const Route = createFileRoute("/premium/form-assistant")({
  head: () => ({
    meta: [
      { title: "AI Form Assistant Pro | BankHub" },
      {
        name: "description",
        content: "Upload official forms, fill them easily, get AI guidance, and download completed PDFs.",
      },
    ],
  }),
  component: FormAssistantRoute,
});

function FormAssistantRoute() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.history.back()}
              className="tap-target p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-[10px] bg-amber-100 flex items-center justify-center">
                <FileSignature className="w-4 h-4 text-amber-600" />
              </div>
              <h1 className="font-bold text-[17px] text-slate-900 leading-none">
                {t("formAssistantPro")}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-2xl mx-auto space-y-6">
        {/* Intro Card */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[24px] p-6 border border-amber-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileSignature className="w-24 h-24 text-amber-500" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-bold text-amber-700 tracking-wide uppercase">Local Processing</span>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-1">{t("formAssistantPro")}</h2>
              <p className="text-sm font-medium text-amber-700/80 leading-relaxed max-w-md">
                {t("formAssistantDesc")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-white/60 px-3 py-1.5 rounded-lg border border-amber-200/50">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                Smart Autofill
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-white/60 px-3 py-1.5 rounded-lg border border-amber-200/50">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Private & Secure
              </div>
            </div>
          </div>
        </section>

        {/* AI Engine Component */}
        <FormAssistantEngine />

        {/* Security Notice */}
        <div className="bg-slate-100/50 rounded-2xl p-5 border border-slate-200/60">
          <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-700">100% Private Processing</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Your PDF files never leave your device. All form detection and data filling happens locally inside your browser ensuring maximum privacy for your personal information.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
