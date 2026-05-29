import { createFileRoute } from '@tanstack/react-router';
import { LetterGeneratorEngine } from '@/components/LetterGeneratorEngine';
import { AppShell } from '@/components/AppShell';

export const Route = createFileRoute('/premium/letter-generator')({
  head: () => ({
    meta: [
      { title: "AI Banking Letter Generator Pro | BankHub" },
      { name: "description", content: "Generate professional banking request letters instantly." },
    ],
  }),
  component: () => (
    <AppShell>
      <LetterGeneratorEngine />
    </AppShell>
  ),
});
