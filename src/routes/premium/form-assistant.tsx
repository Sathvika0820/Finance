import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/premium/form-assistant")({
  head: () => ({
    meta: [
      { title: "BankHub Form Assistant" },
      { name: "description", content: "BankHub Form Assistant is coming soon." },
    ],
  }),
  component: () => (
    <AppShell>
      <FormAssistantComingSoon />
    </AppShell>
  ),
});

function FormAssistantComingSoon() {
  return (
    <main className="min-h-screen bg-[#f8fbff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Link
          to="/dashboard"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <section className="rounded-[2rem] border border-sky-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <FileText className="h-8 w-8" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">BankHub</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Form Assistant</h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600">
            Coming Soon. The previous form workflows, renderers, templates, and PDF generation tools have been reset so this feature can be rebuilt cleanly.
          </p>
          <div className="mt-8 inline-flex rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-sm font-black text-amber-800">
            Status: Coming Soon
          </div>
        </section>
      </div>
    </main>
  );
}
