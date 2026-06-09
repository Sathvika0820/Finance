import { createFileRoute } from '@tanstack/react-router';
import { LetterGeneratorEngine } from '@/components/LetterGeneratorEngine';
import { AppShell } from '@/components/AppShell';
import { RequireProAccess } from '@/components/RequireProAccess';
import { useTranslation } from '@/lib/i18n';

export const Route = createFileRoute('/premium/letter-generator')({
  head: () => ({
    meta: [
      { title: "AI Banking Letter Generator Pro | BankHub" },
      { name: "description", content: "Generate professional banking request letters instantly." },
    ],
  }),
  component: PremiumLetterGeneratorPage,
});

function PremiumLetterGeneratorPage() {
  const { t } = useTranslation();

  return (
    <AppShell>
      <RequireProAccess
        title={t("letterGenerator", "Letter Generator")}
        description={t("generateLettersInstantly", "Generate professional banking request letters instantly.")}
      >
        <LetterGeneratorEngine />
      </RequireProAccess>
    </AppShell>
  );
}
