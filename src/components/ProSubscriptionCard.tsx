import { AlertCircle, Award, Bug, CheckCircle2, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import {
  PRO_PLAN_NAME,
  PRO_PLAN_PRICE_RUPEES,
  PRO_PLAN_VALIDITY_DAYS,
  useProSubscription,
} from "@/lib/proSubscription";

type ProSubscriptionCardProps = {
  compact?: boolean;
};

export function ProSubscriptionCard({ compact = false }: ProSubscriptionCardProps) {
  const { t } = useTranslation();
  const {
    clearNotice,
    daysRemaining,
    expiryDateLabel,
    isPro,
    notice,
    openCheckout,
    paymentStatus,
    startDateLabel,
    status,
    subscription,
    validUntilLabel,
  } = useProSubscription();

  const ctaLabel = isPro
    ? ""
    : status === "expired"
      ? t("subscription.actions.renew", "Renew Now - ₹10")
      : t("subscription.actions.unlock", "Unlock Pro - ₹10");
  const isPaymentBusy = paymentStatus === "creating_order" || paymentStatus === "opening" || paymentStatus === "verifying";

  const statusLabel = isPro
    ? t("subscription.status.active", "Pro Active")
    : status === "expired"
      ? t("subscription.status.expired", "Subscription Expired")
      : t("subscription.status.locked", "Pro Locked");

  return (
    <div className="rounded-[20px] border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-amber-100 text-amber-700 shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[15px] font-bold text-slate-950 leading-tight">
              {t("subscription.planName", PRO_PLAN_NAME)}
            </h4>
            <p className="mt-1 text-[12px] font-medium text-slate-600">
              {t("subscription.planSummary", "Unlock premium banking tools for ₹10 with 30 days of access.")}
            </p>
          </div>
        </div>
        <div className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-bold text-white shrink-0">
          ₹{PRO_PLAN_PRICE_RUPEES}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold">
        <span className={`rounded-full px-3 py-1 ${isPro ? "bg-emerald-100 text-emerald-700" : status === "expired" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"}`}>
          {statusLabel}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-slate-700 border border-slate-200">
          {t("subscription.validity", "Validity")}: {PRO_PLAN_VALIDITY_DAYS} {t("subscription.days", "Days")}
        </span>
        {isPro ? (
          <span className="rounded-full bg-white px-3 py-1 text-slate-700 border border-slate-200">
            {t("subscription.validUntil", "Valid Until")}: {validUntilLabel}
          </span>
        ) : null}
      </div>

      {notice ? (
        <div className={`mt-4 rounded-[16px] border px-3 py-3 text-[12px] ${
          notice.kind === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : notice.kind === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-sky-200 bg-sky-50 text-sky-800"
        }`}>
          <div className="flex items-start gap-2">
            {notice.kind === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
            <div className="min-w-0 flex-1">
              <p className="font-bold">{notice.title}</p>
              <p className="mt-1 font-medium">{notice.description}</p>
            </div>
            <button
              type="button"
              onClick={clearNotice}
              className="rounded-full p-1 text-current/70 hover:bg-white/60"
              aria-label={t("close", "Close")}
            >
              <span className="block h-3 w-3 text-[10px] leading-none">x</span>
            </button>
          </div>
        </div>
      ) : null}

      <div className={`mt-4 ${compact ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 gap-2.5"}`}>
        <FeaturePill label={t("subscription.features.formAssistant", "Form Assistant")} />
        <FeaturePill label={t("subscription.features.sbiAutomation", "SBI Form Automation")} />
        <FeaturePill label={t("subscription.features.iciciAutomation", "ICICI Form Automation")} />
        <FeaturePill label={t("subscription.features.premiumAi", "Premium AI Features")} />
        <FeaturePill label={t("subscription.features.advancedShield", "Advanced Banking Shield")} />
        <FeaturePill label={t("subscription.features.letterGenerator", "Premium Letter Generator")} />
      </div>

      {!isPro ? (
        <button
          type="button"
          onClick={() => void openCheckout("pro-subscription-card")}
          disabled={isPaymentBusy}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#004958] px-4 py-3 text-[13px] font-bold text-white transition-all hover:bg-[#003947] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CreditCard className="h-4 w-4" />
          {isPaymentBusy ? t("subscription.actions.processing", "Opening Razorpay...") : ctaLabel}
        </button>
      ) : null}

      {isPro ? (
        <div className="mt-4 rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] font-medium text-emerald-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>{t("subscription.activeMessage", "BankHub Pro is active on this device.")}</span>
          </div>
        </div>
      ) : null}

      {import.meta.env.DEV ? (
        <div className="mt-4 rounded-[16px] border border-slate-200 bg-white/85 p-3 text-[11px] text-slate-700">
          <div className="mb-2 flex items-center gap-2 font-bold text-slate-900">
            <Bug className="h-4 w-4" />
            <span>{t("subscription.debug.title", "Development Debug Panel")}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <DebugItem label={t("subscription.debug.paymentStatus", "Payment Status")} value={paymentStatus} />
            <DebugItem label={t("subscription.debug.proStatus", "Pro Status")} value={status} />
            <DebugItem label={t("subscription.debug.paymentId", "Payment ID")} value={subscription?.paymentId || "-"} />
            <DebugItem label={t("subscription.debug.startDate", "Start Date")} value={startDateLabel} />
            <DebugItem label={t("subscription.debug.expiryDate", "Expiry Date")} value={expiryDateLabel} />
            <DebugItem label={t("subscription.debug.daysRemaining", "Days Remaining")} value={String(daysRemaining)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FeaturePill({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[14px] border border-white/80 bg-white/80 px-3 py-2 text-[12px] font-semibold text-slate-700">
      <Lock className="h-4 w-4 text-amber-600 shrink-0" />
      <span>{label}</span>
    </div>
  );
}

function DebugItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</div>
      <div className="mt-1 break-all font-semibold text-slate-900">{value}</div>
    </div>
  );
}
