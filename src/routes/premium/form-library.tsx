import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { AppShell } from '@/components/AppShell';
import { useTranslation } from '@/lib/i18n';
import { BANKS, BankId, FORMS_BY_BANK, getFormById } from '@/data/bankingFormLibrary';

export const Route = createFileRoute('/premium/form-library')({
  head: () => ({
    meta: [
      { title: 'Official Banking Form Library | BankHub' },
      { name: 'description', content: 'Select SBI or ICICI official forms and open editable PDF versions instantly.' },
    ],
  }),
  component: () => (
    <AppShell>
      <OfficialBankFormLibrary />
    </AppShell>
  ),
});

function OfficialBankFormLibrary() {
  const { t } = useTranslation();
  const [selectedBank, setSelectedBank] = useState<BankId>('sbi');
  const forms = useMemo(() => FORMS_BY_BANK[selectedBank], [selectedBank]);
  const [selectedFormId, setSelectedFormId] = useState(forms[0]?.id ?? '');

  const selectedForm = useMemo(
    () => getFormById(selectedBank, selectedFormId) ?? forms[0],
    [selectedBank, selectedFormId, forms],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('officialFormLibrary')}</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              {t('officialFormLibraryDesc')}
            </p>
          </div>
          <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {t('openEditableForms')}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{t('selectBank')}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {BANKS.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => {
                    setSelectedBank(bank.id);
                    setSelectedFormId(FORMS_BY_BANK[bank.id][0]?.id ?? '');
                  }}
                  className={`w-full rounded-[14px] border px-4 py-3 text-left font-medium transition ${
                    bank.id === selectedBank
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {bank.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{t('selectedForm')}</h2>
            <p className="mt-2 text-sm text-slate-600">{selectedForm?.description}</p>
            <div className="mt-4 space-y-2">
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">{t('bankName')}</div>
                <div>{selectedForm?.bankName}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">{t('fieldCount')}</div>
                <div>{selectedForm?.fields.length}</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {forms.map((form) => (
              <button
                key={form.id}
                type="button"
                onClick={() => setSelectedFormId(form.id)}
                className={`rounded-[22px] border p-4 text-left transition ${
                  form.id === selectedForm?.id
                    ? 'border-emerald-300 bg-emerald-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{form.name}</h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{form.description}</p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                    {form.bankId.toUpperCase()}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{selectedForm?.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedForm?.description}</p>
              </div>
              <a
                href={selectedForm?.pdfUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded-[14px] bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {t('openEditableVersion')}
              </a>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{t('validationRules')}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {selectedForm?.fields
                    .filter((field) => field.validation)
                    .map((field) => (
                      <li key={field.id}>
                        <span className="font-semibold">{field.label}:</span> {field.validation?.message}
                      </li>
                    ))}
                </ul>
                {selectedForm?.fields.filter((field) => field.validation).length === 0 && (
                  <p className="mt-2 text-sm text-slate-500">{t('noValidationRules')}</p>
                )}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{t('coordinateMap')}</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  {selectedForm?.fields.slice(0, 4).map((field) => (
                    <div key={field.id} className="rounded-xl bg-white p-3 shadow-sm">
                      <div className="font-semibold text-slate-900">{field.label}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        Page {field.coordinates.page} · x: {field.coordinates.x}, y: {field.coordinates.y}, w: {field.coordinates.width}, h: {field.coordinates.height}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
