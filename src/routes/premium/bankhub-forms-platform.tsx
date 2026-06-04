import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import {
  ArrowLeft,
  Bot,
  Building2,
  CheckCircle2,
  Database,
  Download,
  FileSearch,
  FileSignature,
  Filter,
  MessageSquareText,
  Save,
  Search,
  Send,
  Upload,
} from "lucide-react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type BankId = "SBI" | "ICICI";
type FormCategory =
  | "Account Opening"
  | "KYC Update"
  | "Debit Card Request"
  | "Cheque Book Request"
  | "Nomination Form"
  | "Internet Banking"
  | "Mobile Banking"
  | "Address Change"
  | "PAN Update"
  | "Signature Update";
type FieldKind = "text" | "date" | "dropdown" | "checkbox" | "radio" | "signature" | "photo" | "multiline";
type ActivePanel = "fill" | "assistant" | "admin";

type PlatformField = {
  id: string;
  label: string;
  question: string;
  kind: FieldKind;
  x: number;
  y: number;
  width: number;
  height: number;
  required?: boolean;
  options?: string[];
  validator?: "pan" | "aadhaar" | "mobile" | "email";
};

type PlatformForm = {
  id: string;
  bank: BankId;
  category: FormCategory;
  title: string;
  description: string;
  source: "Official PDF Clone";
  fields: PlatformField[];
  updatedAt: string;
};

type FormValues = Record<string, string>;
type ChatMessage = { id: string; role: "assistant" | "user"; text: string };

const PAGE = { width: 595, height: 842 };
const FORMS_STORAGE_KEY = "bankhub:forms-platform:mapping-overrides:v1";
const categories: Array<"All" | FormCategory> = [
  "All",
  "Account Opening",
  "KYC Update",
  "Debit Card Request",
  "Cheque Book Request",
  "Nomination Form",
  "Internet Banking",
  "Mobile Banking",
  "Address Change",
  "PAN Update",
  "Signature Update",
];

const baseFields: PlatformField[] = [
  { id: "fullName", label: "Full Name", question: "What is your full name?", kind: "text", x: 68, y: 178, width: 250, height: 24, required: true },
  { id: "dob", label: "Date of Birth", question: "What is your date of birth?", kind: "date", x: 360, y: 178, width: 128, height: 24, required: true },
  { id: "mobile", label: "Mobile Number", question: "What is your mobile number?", kind: "text", x: 68, y: 242, width: 178, height: 24, required: true, validator: "mobile" },
  { id: "pan", label: "PAN", question: "What is your PAN number?", kind: "text", x: 305, y: 242, width: 152, height: 24, required: true, validator: "pan" },
  { id: "email", label: "Email", question: "What is your email address?", kind: "text", x: 68, y: 306, width: 420, height: 24, validator: "email" },
  { id: "address", label: "Address", question: "What is your address?", kind: "multiline", x: 68, y: 370, width: 420, height: 60, required: true },
  { id: "signature", label: "Signature", question: "Please upload your signature.", kind: "signature", x: 368, y: 662, width: 150, height: 52, required: true },
];

const seededForms: PlatformForm[] = [
  makeForm("sbi-account-opening", "SBI", "Account Opening", "Savings Account Opening Form", "Open a savings bank account with identity and contact details.", [
    { id: "aadhaar", label: "Aadhaar", question: "What is your Aadhaar number?", kind: "text", x: 68, y: 492, width: 188, height: 24, validator: "aadhaar" },
    { id: "occupation", label: "Occupation", question: "What is your occupation?", kind: "text", x: 305, y: 492, width: 170, height: 24 },
  ]),
  makeForm("sbi-kyc-update", "SBI", "KYC Update", "KYC Update Form", "Update identity, contact, PAN, Aadhaar and address details.", [
    { id: "aadhaar", label: "Aadhaar", question: "What is your Aadhaar number?", kind: "text", x: 68, y: 492, width: 188, height: 24, validator: "aadhaar" },
    { id: "accountNumber", label: "Account Number", question: "What is your account number?", kind: "text", x: 305, y: 492, width: 190, height: 24, required: true },
  ]),
  makeForm("sbi-debit-card", "SBI", "Debit Card Request", "Debit Card Request Form", "Request a new or replacement debit card.", [
    { id: "accountNumber", label: "Account Number", question: "What is your account number?", kind: "text", x: 68, y: 492, width: 210, height: 24, required: true },
    { id: "cardType", label: "Card Type", question: "Which card type do you want?", kind: "dropdown", x: 318, y: 492, width: 160, height: 24, options: ["Classic", "Global", "Platinum"] },
  ]),
  makeForm("sbi-cheque-book", "SBI", "Cheque Book Request", "Cheque Book Request Form", "Request a cheque book for an eligible account.", [
    { id: "accountNumber", label: "Account Number", question: "What is your account number?", kind: "text", x: 68, y: 492, width: 210, height: 24, required: true },
    { id: "leaves", label: "Leaves", question: "How many cheque leaves do you need?", kind: "dropdown", x: 318, y: 492, width: 130, height: 24, options: ["25", "50", "100"] },
  ]),
  makeForm("sbi-nomination", "SBI", "Nomination Form", "Nomination Form", "Add or update a nominee for an account.", [
    { id: "accountNumber", label: "Account Number", question: "What is your account number?", kind: "text", x: 68, y: 492, width: 188, height: 24, required: true },
    { id: "nomineeName", label: "Nominee Name", question: "What is the nominee's full name?", kind: "text", x: 305, y: 492, width: 190, height: 24, required: true },
  ]),
  makeForm("sbi-internet-banking", "SBI", "Internet Banking", "Internet Banking Registration", "Activate internet banking access.", [
    { id: "accountNumber", label: "Account Number", question: "What is your account number?", kind: "text", x: 68, y: 492, width: 210, height: 24, required: true },
    { id: "rights", label: "Access Type", question: "Do you need view or transaction rights?", kind: "radio", x: 318, y: 492, width: 150, height: 24, options: ["View", "Transaction"] },
  ]),
  makeForm("sbi-mobile-banking", "SBI", "Mobile Banking", "Mobile Banking Registration", "Register mobile banking for a linked mobile number.", [
    { id: "accountNumber", label: "Account Number", question: "What is your account number?", kind: "text", x: 68, y: 492, width: 210, height: 24, required: true },
  ]),
  makeForm("sbi-address-change", "SBI", "Address Change", "Address Change Request", "Update communication address.", [
    { id: "accountNumber", label: "Account Number", question: "What is your account number?", kind: "text", x: 68, y: 492, width: 210, height: 24, required: true },
  ]),
  makeForm("sbi-pan-update", "SBI", "PAN Update", "PAN Update Request", "Update PAN in bank records.", [
    { id: "accountNumber", label: "Account Number", question: "What is your account number?", kind: "text", x: 68, y: 492, width: 210, height: 24, required: true },
  ]),
  makeForm("sbi-signature-update", "SBI", "Signature Update", "Signature Update Form", "Update specimen signature for an account.", [
    { id: "accountNumber", label: "Account Number", question: "What is your account number?", kind: "text", x: 68, y: 492, width: 210, height: 24, required: true },
  ]),
  ...(["KYC Update", "Nomination Form", "Internet Banking", "Mobile Banking", "Address Change", "PAN Update", "Signature Update"] as FormCategory[]).map((category) =>
    makeForm(`icici-${category.toLowerCase().replace(/\s+/g, "-")}`, "ICICI", category, `${category} Form`, `ICICI ${category.toLowerCase()} digital completion.`, [
      { id: "accountNumber", label: "Account Number", question: "What is your ICICI account number?", kind: "text", x: 68, y: 492, width: 210, height: 24, required: true },
      ...(category === "Nomination Form"
        ? [{ id: "nomineeName", label: "Nominee Name", question: "What is the nominee's full name?", kind: "text" as const, x: 318, y: 492, width: 165, height: 24, required: true }]
        : []),
    ]),
  ),
];

export const Route = createFileRoute("/premium/bankhub-forms-platform")({
  component: () => (
    <AppShell>
      <BankHubFormsPlatform />
    </AppShell>
  ),
});

function BankHubFormsPlatform() {
  const [forms, setForms] = useState<PlatformForm[]>(seededForms);
  const [activeFormId, setActiveFormId] = useState(seededForms[0].id);
  const [bankFilter, setBankFilter] = useState<"All" | BankId>("All");
  const [categoryFilter, setCategoryFilter] = useState<"All" | FormCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePanel, setActivePanel] = useState<ActivePanel>("fill");
  const [values, setValues] = useState<FormValues>({});
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [answer, setAnswer] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [status, setStatus] = useState("BankHub Forms Platform loaded.");
  const [error, setError] = useState("");

  const activeForm = forms.find((form) => form.id === activeFormId) || forms[0];
  const currentQuestion = activeForm.fields.find((field) => field.kind !== "signature" && !values[field.id]?.trim()) || null;
  const requiredFields = activeForm.fields.filter((field) => field.required);
  const completedRequired = requiredFields.filter((field) => values[field.id]?.trim()).length;
  const progress = requiredFields.length ? Math.round((completedRequired / requiredFields.length) * 100) : 100;

  const filteredForms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return forms.filter((form) => {
      const matchesBank = bankFilter === "All" || form.bank === bankFilter;
      const matchesCategory = categoryFilter === "All" || form.category === categoryFilter;
      const matchesQuery = !query || `${form.bank} ${form.title} ${form.category}`.toLowerCase().includes(query);
      return matchesBank && matchesCategory && matchesQuery;
    });
  }, [bankFilter, categoryFilter, forms, searchQuery]);

  useEffect(() => {
    const merged = applyStoredMappings(seededForms);
    setForms(merged);
  }, []);

  useEffect(() => {
    setValues({});
    setGeneratedUrl("");
    setChat([
      {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        text: `I analyzed ${activeForm.bank} ${activeForm.title}. I found ${activeForm.fields.length} editable fields. ${activeForm.fields[0]?.question || "You can start filling now."}`,
      },
    ]);
    setStatus(`${activeForm.bank} ${activeForm.title} selected.`);
  }, [activeFormId]);

  useEffect(() => {
    void refreshGeneratedPdf();
  }, [activeFormId, values]);

  useEffect(() => {
    return () => {
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [generatedUrl]);

  const selectForm = (form: PlatformForm) => {
    setActiveFormId(form.id);
    setActivePanel("fill");
  };

  const updateValue = (field: PlatformField, value: string) => {
    const normalized = normalizeValue(field, value);
    const validation = validateValue(field, normalized);
    setValues((current) => ({ ...current, [field.id]: normalized }));
    setError(validation);
  };

  const uploadImage = (field: PlatformField, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValues((current) => ({ ...current, [field.id]: String(reader.result || "") }));
      setStatus(`${field.label} uploaded and placed in the PDF clone.`);
    };
    reader.readAsDataURL(file);
  };

  const askSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!currentQuestion) return;
    const normalized = normalizeValue(currentQuestion, answer);
    const validation = validateValue(currentQuestion, normalized);
    if (validation) {
      setChat((messages) => [
        ...messages,
        { id: `user_${Date.now()}`, role: "user", text: answer },
        { id: `assistant_error_${Date.now()}`, role: "assistant", text: validation },
      ]);
      return;
    }
    const nextValues = { ...values, [currentQuestion.id]: normalized };
    const nextQuestion = activeForm.fields.find((field) => field.kind !== "signature" && field.id !== currentQuestion.id && !nextValues[field.id]?.trim());
    setValues(nextValues);
    setAnswer("");
    setChat((messages) => [
      ...messages,
      { id: `user_${Date.now()}`, role: "user", text: normalized },
      {
        id: `assistant_next_${Date.now()}`,
        role: "assistant",
        text: nextQuestion ? `Saved ${currentQuestion.label}. ${nextQuestion.question}` : "All questions are complete. Upload signature if required, then download the filled PDF.",
      },
    ]);
  };

  const refreshGeneratedPdf = async () => {
    const bytes = await buildFilledPdf(activeForm, values);
    if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    setGeneratedUrl(URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })));
  };

  const downloadPdf = () => {
    if (!generatedUrl) return;
    const anchor = document.createElement("a");
    anchor.href = generatedUrl;
    anchor.download = `BankHub_${activeForm.bank}_${activeForm.title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const saveAdminMapping = () => {
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
    void syncSupabaseForm(activeForm);
    setStatus("Admin mapping saved locally and queued for Supabase when credentials are configured.");
  };

  const updateMapping = (fieldId: string, patch: Partial<PlatformField>) => {
    setForms((current) =>
      current.map((form) =>
        form.id === activeForm.id
          ? { ...form, fields: form.fields.map((field) => (field.id === fieldId ? { ...field, ...patch } : field)), updatedAt: new Date().toISOString() }
          : form,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#f2f5fa] pb-24 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-[#d6deea] bg-[#071b3a] px-4 py-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-base font-black leading-tight">BankHub Forms Platform</h1>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#f1c86b]">Official bank form library, AI guidance, and PDF population</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#f1c86b]/40 bg-white/10 px-3 py-1.5 text-xs font-black text-[#f1c86b] sm:flex">
            <Database className="h-4 w-4" />
            Supabase-ready form management
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 xl:grid-cols-[330px_1fr_380px]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#c7a14d]" />
              <h2 className="text-sm font-black">Official Forms Library</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search SBI or ICICI forms" className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm font-bold outline-none focus:border-[#c7a14d]" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <select value={bankFilter} onChange={(event) => setBankFilter(event.target.value as "All" | BankId)} className="rounded-md border border-slate-200 px-2 py-2 text-xs font-black">
                <option>All</option>
                <option>SBI</option>
                <option>ICICI</option>
              </select>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as "All" | FormCategory)} className="rounded-md border border-slate-200 px-2 py-2 text-xs font-black">
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-black">Forms</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">{filteredForms.length}</span>
            </div>
            <div className="max-h-[560px] space-y-2 overflow-auto pr-1">
              {filteredForms.map((form) => (
                <button key={form.id} onClick={() => selectForm(form)} className={`w-full rounded-md border p-3 text-left transition ${activeForm.id === form.id ? "border-[#c7a14d] bg-[#fff8e6]" : "border-slate-200 hover:border-[#c7a14d]"}`}>
                  <span className="block text-[11px] font-black text-[#071b3a]">{form.bank} | {form.category}</span>
                  <span className="mt-1 block text-sm font-black text-slate-950">{form.title}</span>
                  <span className="mt-1 block text-[11px] font-semibold leading-relaxed text-slate-500">{form.description}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-[#c7a14d]">{activeForm.bank} Official PDF Clone</p>
                <h2 className="text-xl font-black text-[#071b3a]">{activeForm.title}</h2>
              </div>
              <div className="flex gap-2">
                {(["fill", "assistant", "admin"] as ActivePanel[]).map((panel) => (
                  <button key={panel} onClick={() => setActivePanel(panel)} className={`rounded-md px-3 py-2 text-xs font-black capitalize ${activePanel === panel ? "bg-[#071b3a] text-white" : "bg-slate-100 text-slate-700"}`}>
                    {panel}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-[#c7a14d]" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-[#c7a14d]" />
              <h3 className="text-sm font-black">PDF Clone Viewer with Editable Overlays</h3>
            </div>
            <div className="overflow-auto rounded-md bg-slate-100 p-3">
              <div className="relative mx-auto bg-white shadow-md" style={{ width: PAGE.width, height: PAGE.height }}>
                <PdfClone form={activeForm} />
                {activeForm.fields.map((field) => (
                  <OverlayField key={field.id} field={field} value={values[field.id] || ""} onChange={(value) => updateValue(field, value)} onImageUpload={(event) => uploadImage(field, event)} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          {activePanel === "fill" && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-black">Editable Fields</h2>
              <div className="max-h-[520px] space-y-3 overflow-auto pr-1">
                {activeForm.fields.map((field) => (
                  <FieldEditor key={field.id} field={field} value={values[field.id] || ""} onChange={(value) => updateValue(field, value)} onImageUpload={(event) => uploadImage(field, event)} />
                ))}
              </div>
            </section>
          )}

          {activePanel === "assistant" && (
            <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-4">
                <div className="flex items-center gap-2 text-sm font-black text-[#071b3a]">
                  <Bot className="h-4 w-4 text-[#c7a14d]" />
                  AI Guided Form Filling Assistant
                </div>
              </div>
              <div className="max-h-[420px] space-y-3 overflow-auto bg-slate-50 p-4">
                {chat.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm font-semibold ${message.role === "user" ? "bg-[#071b3a] text-white" : "border bg-white text-slate-800"}`}>{message.text}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={askSubmit} className="border-t border-slate-100 p-4">
                {currentQuestion ? (
                  <div className="flex gap-2">
                    <input value={answer} onChange={(event) => setAnswer(event.target.value)} className="min-w-0 flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold" placeholder={currentQuestion.label} />
                    <button className="rounded-md bg-[#c7a14d] px-3 py-2 text-[#071b3a]"><Send className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-xs font-bold text-emerald-800">
                    <MessageSquareText className="h-4 w-4" />
                    Assistant questions complete. Review and download.
                  </div>
                )}
              </form>
            </section>
          )}

          {activePanel === "admin" && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-black">Admin Form Management Dashboard</h2>
              <div className="max-h-[460px] space-y-3 overflow-auto pr-1">
                {activeForm.fields.map((field) => (
                  <div key={field.id} className="rounded-md border border-slate-200 p-3">
                    <div className="text-xs font-black text-slate-900">{field.label}</div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <CoordinateInput label="X" value={field.x} onChange={(value) => updateMapping(field.id, { x: value })} />
                      <CoordinateInput label="Y" value={field.y} onChange={(value) => updateMapping(field.id, { y: value })} />
                      <CoordinateInput label="W" value={field.width} onChange={(value) => updateMapping(field.id, { width: value })} />
                      <CoordinateInput label="H" value={field.height} onChange={(value) => updateMapping(field.id, { height: value })} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={saveAdminMapping} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#071b3a] px-3 py-2.5 text-sm font-black text-white">
                <Save className="h-4 w-4" />
                Save Mapping Configuration
              </button>
              <p className="mt-2 text-[11px] font-semibold text-slate-500">Supabase table target: bankhub_form_mappings. Local fallback is enabled.</p>
            </section>
          )}

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-[#c7a14d]" />
              <h2 className="text-sm font-black">Generated PDF Preview</h2>
            </div>
            {generatedUrl && <iframe title="Filled PDF preview" src={generatedUrl} className="h-[380px] w-full rounded-md border border-slate-200 bg-white" />}
            <button onClick={downloadPdf} className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-[#c7a14d] px-3 py-2.5 text-sm font-black text-[#071b3a]">
              <Download className="h-4 w-4" />
              Download Filled PDF
            </button>
            {error && <p className="mt-2 text-xs font-bold text-rose-700">{error}</p>}
            <p className="mt-2 text-[11px] font-semibold text-slate-500">{status}</p>
          </section>
        </aside>
      </main>
    </div>
  );
}

function makeForm(id: string, bank: BankId, category: FormCategory, title: string, description: string, extraFields: PlatformField[]): PlatformForm {
  return {
    id,
    bank,
    category,
    title,
    description,
    source: "Official PDF Clone",
    fields: [...baseFields, ...extraFields],
    updatedAt: "2026-06-04T00:00:00.000Z",
  };
}

function PdfClone({ form }: { form: PlatformForm }) {
  const bankColor = form.bank === "SBI" ? "#072a62" : "#9b2d13";
  return (
    <div className="absolute inset-0 bg-white text-slate-900">
      <div className="h-[90px] px-10 py-6 text-white" style={{ backgroundColor: bankColor }}>
        <div className="text-2xl font-black">{form.bank}</div>
        <div className="text-sm font-semibold opacity-90">{form.title}</div>
      </div>
      <div className="absolute left-[42px] top-[116px] h-[620px] w-[511px] border border-slate-300" />
      <div className="absolute left-[54px] top-[124px] h-7 w-[487px] bg-slate-100 px-3 py-1.5 text-xs font-black text-[#071b3a]">Official Form Clone Preview</div>
      <div className="absolute bottom-12 left-[54px] text-[11px] font-semibold text-slate-500">Generated by BankHub Forms Platform. Values are inserted at predefined PDF coordinates.</div>
    </div>
  );
}

function OverlayField({ field, value, onChange, onImageUpload }: { field: PlatformField; value: string; onChange: (value: string) => void; onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="absolute block" style={{ left: field.x, top: field.y, width: field.width, minHeight: field.height }}>
      <span className="absolute -top-4 left-0 text-[9px] font-black uppercase text-slate-500">{field.label}</span>
      {field.kind === "signature" || field.kind === "photo" ? (
        <span className="flex h-full min-h-[44px] cursor-pointer items-center justify-center rounded border border-dashed border-[#c7a14d] bg-[#fff8e6]/80 text-[10px] font-black text-[#7a5a12]">
          {value ? <img src={value} alt={field.label} className="max-h-full max-w-full object-contain" /> : "Upload"}
          <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onImageUpload} />
        </span>
      ) : field.kind === "multiline" ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} className="h-full w-full resize-none rounded border border-[#c7a14d] bg-white/90 px-2 py-1 text-xs font-bold outline-none" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className="h-full w-full rounded border border-[#c7a14d] bg-white/90 px-2 text-xs font-bold outline-none" />
      )}
    </label>
  );
}

function FieldEditor({ field, value, onChange, onImageUpload }: { field: PlatformField; value: string; onChange: (value: string) => void; onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
      <span className="mb-1 block text-xs font-black text-slate-700">{field.label}</span>
      {field.kind === "signature" || field.kind === "photo" ? (
        <span className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#071b3a] px-3 py-2 text-xs font-black text-white">
          <Upload className="h-4 w-4" />
          Upload {field.label}
          <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onImageUpload} />
        </span>
      ) : field.kind === "dropdown" || field.kind === "radio" ? (
        <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold">
          <option value="">Select</option>
          {(field.options || []).map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : field.kind === "multiline" ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-20 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold" />
      ) : (
        <input type={field.kind === "date" ? "date" : "text"} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-bold" />
      )}
      {value && (field.kind === "signature" || field.kind === "photo") && <img src={value} alt={field.label} className="mt-2 max-h-20 rounded border bg-white object-contain p-2" />}
    </label>
  );
}

function CoordinateInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-[10px] font-black text-slate-500">
      {label}
      <input value={Math.round(value)} type="number" onChange={(event) => onChange(Number(event.target.value) || 0)} className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-xs font-bold" />
    </label>
  );
}

function normalizeValue(field: PlatformField, value: string) {
  const trimmed = value.trim();
  if (field.validator === "pan") return trimmed.toUpperCase();
  if (field.validator === "aadhaar" || field.validator === "mobile") return trimmed.replace(/\D/g, "");
  return trimmed;
}

function validateValue(field: PlatformField, value: string) {
  if (!value) return "";
  if (field.validator === "pan" && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) return "PAN must follow ABCDE1234F format.";
  if (field.validator === "aadhaar" && !/^[0-9]{12}$/.test(value)) return "Aadhaar must be exactly 12 digits.";
  if (field.validator === "mobile" && !/^[6-9][0-9]{9}$/.test(value)) return "Mobile must be 10 digits starting with 6, 7, 8, or 9.";
  if (field.validator === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  return "";
}

async function buildFilledPdf(form: PlatformForm, values: FormValues) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE.width, PAGE.height]);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const bankColor = form.bank === "SBI" ? rgb(0.02, 0.16, 0.38) : rgb(0.62, 0.18, 0.07);
  const ink = rgb(0.03, 0.14, 0.32);
  const line = rgb(0.68, 0.73, 0.82);

  page.drawRectangle({ x: 0, y: PAGE.height - 90, width: PAGE.width, height: 90, color: bankColor });
  page.drawText(form.bank, { x: 42, y: PAGE.height - 44, size: 22, font: bold, color: rgb(1, 1, 1) });
  page.drawText(form.title, { x: 42, y: PAGE.height - 68, size: 12, font: regular, color: rgb(1, 1, 1) });
  page.drawText("BankHub Forms Platform", { x: 365, y: PAGE.height - 50, size: 9, font: bold, color: rgb(0.86, 0.69, 0.34) });
  page.drawRectangle({ x: 42, y: 100, width: PAGE.width - 84, height: PAGE.height - 220, borderColor: line, borderWidth: 1 });
  page.drawRectangle({ x: 54, y: PAGE.height - 146, width: PAGE.width - 108, height: 26, color: rgb(0.94, 0.97, 1) });
  page.drawText("Official PDF Clone - Filled Values", { x: 66, y: PAGE.height - 138, size: 10, font: bold, color: ink });

  for (const field of form.fields) {
    const y = PAGE.height - field.y - field.height;
    page.drawText(field.label, { x: field.x, y: PAGE.height - field.y + 7, size: 8, font: bold, color: rgb(0.25, 0.3, 0.38) });
    page.drawRectangle({ x: field.x, y, width: field.width, height: field.height, borderColor: line, borderWidth: 1 });
    const value = values[field.id] || "";
    if (!value) continue;
    if (field.kind === "signature" || field.kind === "photo") {
      if (value.startsWith("data:image")) {
        const imageBytes = Uint8Array.from(atob(value.split(",")[1]), (char) => char.charCodeAt(0));
        const image = value.includes("image/png") ? await doc.embedPng(imageBytes) : await doc.embedJpg(imageBytes);
        const fit = image.scaleToFit(field.width - 8, field.height - 8);
        page.drawImage(image, { x: field.x + 4, y: y + 4, width: fit.width, height: fit.height });
      }
      continue;
    }
    if (field.kind === "multiline") {
      value.split("\n").slice(0, 4).forEach((row, index) => {
        page.drawText(row.slice(0, 70), { x: field.x + 5, y: y + field.height - 14 - index * 12, size: 9, font: regular, color: ink });
      });
    } else {
      page.drawText(value.slice(0, 55), { x: field.x + 5, y: y + 7, size: 10, font: regular, color: ink });
    }
  }

  page.drawText(`Generated by BankHub on ${new Date().toLocaleDateString("en-IN")}`, { x: 54, y: 54, size: 8, font: regular, color: rgb(0.36, 0.42, 0.5) });
  return doc.save();
}

function applyStoredMappings(forms: PlatformForm[]) {
  try {
    const raw = localStorage.getItem(FORMS_STORAGE_KEY);
    if (!raw) return forms;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return forms;
    return parsed;
  } catch {
    return forms;
  }
}

function getSupabaseClient(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

async function syncSupabaseForm(form: PlatformForm) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  await supabase.from("bankhub_form_mappings").upsert({
    id: form.id,
    bank: form.bank,
    category: form.category,
    title: form.title,
    fields: form.fields,
    updated_at: new Date().toISOString(),
  });
}
