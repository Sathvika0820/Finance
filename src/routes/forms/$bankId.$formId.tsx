import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { getBankById, getBankDisplayName } from '@/data/banks';
import { getFormById } from '@/data/forms';
import { EditableForm } from '@/components/forms/EditableForm';
import { useTranslation } from '@/lib/i18n';

export const Route = createFileRoute('/forms/$bankId/$formId')({
  loader: ({ params }) => {
    const bank = getBankById(params.bankId);
    const form = getFormById(params.formId);
    if (!bank || !form || form.bankId !== params.bankId) {
      throw notFound();
    }
    return { bank, form };
  },
  component: EditableFormRoute,
});

function EditableFormRoute() {
  const { bank, form } = Route.useLoaderData();
  const { lang } = useTranslation();

  return (
    <div className="pt-6 px-5 space-y-6 pb-12">
      <header className="flex items-center gap-4">
        <Link 
          to="/forms/$bankId"
          params={{ bankId: bank.id }}
          className="p-2 -ml-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            {getBankDisplayName(bank, lang)}
          </h1>
          <p className="font-bold text-lg leading-tight truncate">{form.name}</p>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <EditableForm template={form} />
      </motion.div>
    </div>
  );
}
