import { createFileRoute } from '@tanstack/react-router';
import { EmiPlannerEngine } from '@/components/EmiPlannerEngine';
import { AppShell } from '@/components/AppShell';

export const Route = createFileRoute('/premium/emi-planner')({
  head: () => ({
    meta: [
      { title: "EMI Planner & Loan Simulator Pro | BankHub" },
      { name: "description", content: "Simulate loan costs and compare across banks." },
    ],
  }),
  component: () => (
    <AppShell>
      <EmiPlannerEngine />
    </AppShell>
  ),
});
