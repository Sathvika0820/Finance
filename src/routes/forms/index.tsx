import { createFileRoute, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { SUPPORTED_FORM_BANK_IDS } from '@/data/forms';
import { getBankById, getBankDisplayName } from '@/data/banks';
import { BankLogo } from '@/components/BankLogo';
import { FileText, ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/forms/')({
  component: FormsIndex,
});

function FormsIndex() {
  const { t, lang } = useTranslation();

  const supportedBanks = SUPPORTED_FORM_BANK_IDS
    .map(id => getBankById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getBankById>>[];

  return (
    <div className="pt-6 px-5 space-y-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">{t('forms')}</h1>
        </div>
        <p className="text-sm text-foreground/70">
          {t('selectBankForForms')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 mt-4">
        {supportedBanks.map((bank, i) => (
          <motion.div
            key={bank.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to="/forms/$bankId"
              params={{ bankId: bank.id }}
              className="fintech-card rounded-[22px] p-4 flex items-center gap-4 transition-transform active:scale-[0.98]"
            >
              <BankLogo bank={bank} size="md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">
                  {getBankDisplayName(bank, lang)}
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
