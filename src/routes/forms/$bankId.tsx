import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, ChevronRight } from 'lucide-react';
import { getBankById, getBankDisplayName } from '@/data/banks';
import { getFormsByBank, SUPPORTED_FORM_BANK_IDS } from '@/data/forms';
import { BankLogo } from '@/components/BankLogo';
import { useTranslation } from '@/lib/i18n';

export const Route = createFileRoute('/forms/$bankId')({
  loader: ({ params }) => {
    if (!SUPPORTED_FORM_BANK_IDS.includes(params.bankId)) {
      throw notFound();
    }
    const bank = getBankById(params.bankId);
    if (!bank) throw notFound();
    const forms = getFormsByBank(params.bankId);
    return { bank, forms };
  },
  component: BankFormsList,
});

function BankFormsList() {
  const { bank, forms } = Route.useLoaderData();
  const { t, lang } = useTranslation();

  return (
    <div className="pt-6 px-5 space-y-6">
      <header className="flex items-center gap-4">
        <Link to="/forms" className="p-2 -ml-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-3">
          <BankLogo bank={bank} size="sm" />
          <h1 className="text-xl font-bold">{getBankDisplayName(bank, lang)}</h1>
        </div>
      </header>

      <div>
        <h2 className="text-sm font-semibold mb-3 text-foreground/80 uppercase tracking-wider">
          {t('availableForms')}
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {forms.map((form, i) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to="/forms/$bankId/$formId"
                params={{ bankId: bank.id, formId: form.id }}
                className="fintech-card rounded-[22px] p-4 flex items-center gap-4 transition-transform active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight mb-1">{form.name}</h3>
                  <p className="text-[11px] text-foreground/60 line-clamp-1">{form.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
        {forms.length === 0 && (
          <p className="text-sm text-foreground/60 mt-4">{t('noFormsAvailable')}</p>
        )}
      </div>
    </div>
  );
}
