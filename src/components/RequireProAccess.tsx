import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useProSubscription } from "@/lib/proSubscription";
import { ProSubscriptionCard } from "@/components/ProSubscriptionCard";

export function RequireProAccess({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  const { t } = useTranslation();
  const { isPro, isReady } = useProSubscription();

  if (!isReady) {
    return (
      <div className="rounded-[22px] border border-slate-200 bg-white p-6 text-center shadow-soft">
        <p className="text-[13px] font-semibold text-slate-600">
          {t("subscription.loading", "Checking your Pro subscription...")}
        </p>
      </div>
    );
  }

  if (isPro) return <>{children}</>;

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-slate-100 text-slate-700">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-slate-950 leading-tight">
              {t("subscription.lockedTitle", "BankHub Pro Required")}
            </h1>
            <p className="mt-2 text-[14px] font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-[13px] font-medium leading-6 text-slate-600">{description}</p>
          </div>
        </div>
      </div>

      <ProSubscriptionCard compact />
    </div>
  );
}
