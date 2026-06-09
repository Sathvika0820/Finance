import { createFileRoute } from '@tanstack/react-router';
import { EmiPlannerEngine } from '@/components/EmiPlannerEngine';
import { AppShell } from '@/components/AppShell';
import { RequireProAccess } from '@/components/RequireProAccess';
import { useTranslation } from '@/lib/i18n';

export const Route = createFileRoute('/premium/emi-planner')({
  head: () => ({
    meta: [
      { title: "EMI Planner & Loan Simulator Pro | BankHub" },
      { name: "description", content: "Simulate loan costs and compare across banks." },
    ],
  }),
  component: PremiumEmiPlannerPage,
});

function PremiumEmiPlannerPage() {
  const { t } = useTranslation();

  return (
    <AppShell>
      <RequireProAccess
        title={t("emiPlanner", "EMI Planner")}
        description={t("simulateLoanCosts", "Simulate loan costs and compare across banks.")}
      >
        <EmiPlannerEngine />
      </RequireProAccess>
    </AppShell>
  );
}
