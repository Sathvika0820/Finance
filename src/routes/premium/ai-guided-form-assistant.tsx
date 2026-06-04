import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Download,
  FileSignature,
  MessageSquareText,
  Send,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type BankId = "SBI" | "ICICI";
type FieldKey = "fullName" | "dob" | "mobile" | "pan" | "aadhaar" | "email" | "address" | "accountNumber" | "nomineeName" | "branchName";
type FieldType = "text" | "date" | "mobile" | "pan" | "aadhaar" | "email" | "multiline";

type GuidedField = {
  key: FieldKey;
  label: string;
  question: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type GuidedForm = {
  id: string;
  bank: BankId;
  title: string;
  description: string;
  fields: GuidedField[];
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type FormValues = Partial<Record<FieldKey, string>>;

const PAGE = { width: 595, height: 842 };
const SIGNATURE_BOX = { x: 370, y: 658, width: 150, height: 50 };

const commonFields: GuidedField[] = [
  {
    key: "fullName",
    label: "Full Name",
    question: "What is your full name?",
    type: "text",
    required: true,
    placeholder: "Example: Ravi Kumar",
    x: 70,
    y: 182,
    width: 250,
    height: 24,
  },
  {
    key: "dob",
    label: "Date of Birth",
    question: "What is your date of birth?",
    type: "date",
    required: true,
    x: 365,
    y: 182,
    width: 130,
    height: 24,
  },
  {
    key: "mobile",
    label: "Mobile Number",
    question: "What is your 10-digit mobile number?",
    type: "mobile",
    required: true,
    placeholder: "10 digits",
    x: 70,
    y: 246,
    width: 190,
    height: 24,
  },
  {
    key: "pan",
    label: "PAN Number",
    question: "What is your PAN number?",
    type: "pan",
    required: true,
    placeholder: "ABCDE1234F",
    x: 305,
    y: 246,
    width: 160,
    height: 24,
  },
  {
    key: "email",
    label: "Email",
    question: "What is your email address?",
    type: "email",
    placeholder: "name@example.com",
    x: 70,
    y: 310,
    width: 425,
    height: 24,
  },
  {
    key: "address",
    label: "Address",
    question: "What is your current address?",
    type: "multiline",
    required: true,
    x: 70,
    y: 374,
    width: 425,
    height: 62,
  },
];

const guidedForms: GuidedForm[] = [
  {
    id: "sbi-kyc-update",
    bank: "SBI",
    title: "KYC Update Form",
    description: "Guided KYC update with PAN, Aadhaar, mobile, email, address, and signature.",
    fields: [
      ...commonFields,
      {
        key: "aadhaar",
        label: "Aadhaar Number",
        question: "What is your 12-digit Aadhaar number?",
        type: "aadhaar",
        x: 70,
        y: 492,
        width: 200,
        height: 24,
      },
      {
        key: "accountNumber",
        label: "Account Number",
        question: "What is your SBI account number?",
        type: "text",
        required: true,
        x: 305,
        y: 492,
        width: 190,
        height: 24,
      },
    ],
  },
  {
    id: "sbi-internet-banking",
    bank: "SBI",
    title: "Internet Banking Registration",
    description: "Guided internet banking request with branch and account details.",
    fields: [
      ...commonFields,
      {
        key: "accountNumber",
        label: "Account Number",
        question: "What is your SBI account number?",
        type: "text",
        required: true,
        x: 70,
        y: 492,
        width: 220,
        height: 24,
      },
      {
        key: "branchName",
        label: "Branch Name",
        question: "Which branch should process this request?",
        type: "text",
        x: 325,
        y: 492,
        width: 170,
        height: 24,
      },
    ],
  },
  {
    id: "icici-kyc-update",
    bank: "ICICI",
    title: "KYC Update Form",
    description: "Guided ICICI KYC update with validated identity and contact details.",
    fields: [
      ...commonFields,
      {
        key: "aadhaar",
        label: "Aadhaar Number",
        question: "What is your 12-digit Aadhaar number?",
        type: "aadhaar",
        x: 70,
        y: 492,
        width: 200,
        height: 24,
      },
      {
        key: "accountNumber",
        label: "Account Number",
        question: "What is your ICICI account number?",
        type: "text",
        required: true,
        x: 305,
        y: 492,
        width: 190,
        height: 24,
      },
    ],
  },
  {
    id: "icici-nomination",
    bank: "ICICI",
    title: "Nomination Form",
    description: "Guided nomination form with applicant and nominee information.",
    fields: [
      ...commonFields,
      {
        key: "accountNumber",
        label: "Account Number",
        question: "What is your ICICI account number?",
        type: "text",
        required: true,
        x: 70,
        y: 492,
        width: 210,
        height: 24,
      },
      {
        key: "nomineeName",
        label: "Nominee Name",
        question: "What is the nominee's full name?",
        type: "text",
        required: true,
        x: 315,
        y: 492,
        width: 180,
        height: 24,
      },
    ],
  },
];

export const Route = createFileRoute("/premium/ai-guided-form-assistant")({
  component: () => (
    <AppShell>
      <AiGuidedFormAssistant />
    </AppShell>
  ),
});

function AiGuidedFormAssistant() {
  const [selectedFormId, setSelectedFormId] = useState(guidedForms[0].id);
  const [values, setValues] = useState<FormValues>({});
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [answer, setAnswer] = useState("");
  const [signatureData, setSignatureData] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("Select a form and answer the assistant's questions.");
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const selectedForm = guidedForms.find((form) => form.id === selectedFormId) || guidedForms[0];
  const requiredFields = selectedForm.fields.filter((field) => field.required);
  const completedRequired = requiredFields.filter((field) => values[field.key]?.trim()).length + (signatureData ? 1 : 0);
  const totalRequired = requiredFields.length + 1;
  const progress = Math.round((completedRequired / totalRequired) * 100);
  const currentField = selectedForm.fields.find((field) => !values[field.key]?.trim()) || null;
  const isReadyForSignature = !currentField;

  useEffect(() => {
    setValues({});
    setSignatureData("");
    setPreviewUrl("");
    setError("");
    setChat([
      {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        text: `I analyzed the ${selectedForm.bank} ${selectedForm.title}. I found ${selectedForm.fields.length} fields to complete. ${selectedForm.fields[0].question}`,
      },
    ]);
    setStatus(`${selectedForm.bank} ${selectedForm.title} loaded.`);
  }, [selectedFormId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    void renderPreview();
  }, [values, signatureData, selectedFormId]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const submitAnswer = (event: FormEvent) => {
    event.preventDefault();
    if (!currentField) return;
    const normalized = normalizeAnswer(currentField, answer);
    const validation = validateField(currentField, normalized);
    if (validation) {
      setChat((messages) => [
        ...messages,
        { id: `user_${Date.now()}`, role: "user", text: answer },
        { id: `assistant_${Date.now()}_error`, role: "assistant", text: validation },
      ]);
      setError(validation);
      return;
    }

    const nextValues = { ...values, [currentField.key]: normalized };
    const nextField = selectedForm.fields.find((field) => field.key !== currentField.key && !nextValues[field.key]?.trim());
    setValues(nextValues);
    setAnswer("");
    setError("");
    setChat((messages) => [
      ...messages,
      { id: `user_${Date.now()}`, role: "user", text: normalized },
      {
        id: `assistant_${Date.now()}_next`,
        role: "assistant",
        text: nextField
          ? `Saved ${currentField.label}. ${nextField.question}`
          : `All form fields are complete. Please upload your signature so I can place it on the official-looking PDF.`,
      },
    ]);
  };

  const onSignatureUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a PNG or JPG signature image.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignatureData(String(reader.result || ""));
      setChat((messages) => [
        ...messages,
        { id: `assistant_${Date.now()}_signature`, role: "assistant", text: "Signature uploaded. The PDF preview has been updated and is ready for final download." },
      ]);
      setStatus("Signature placed in the PDF preview.");
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const renderPreview = async () => {
    try {
      const bytes = await buildOfficialLookingPdf(selectedForm, values, signatureData);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })));
    } catch {
      setError("Unable to update PDF preview.");
    }
  };

  const downloadPdf = () => {
    if (!previewUrl) return;
    const anchor = document.createElement("a");
    anchor.href = previewUrl;
    anchor.download = `BankHub_${selectedForm.bank}_${selectedForm.title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] pb-24 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-[#d8e0ec] bg-[#071b3a] px-4 py-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-base font-black leading-tight">AI Guided Banking Form Assistant</h1>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#f1c86b]">BankHub guided form completion</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#f1c86b]/40 bg-white/10 px-3 py-1.5 text-xs font-black text-[#f1c86b] sm:flex">
            <ShieldCheck className="h-4 w-4" />
            Validated answers. Live PDF preview.
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 xl:grid-cols-[320px_1fr_420px]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-black">Select Bank Form</h2>
            <div className="space-y-2">
              {guidedForms.map((form) => (
                <button
                  key={form.id}
                  onClick={() => setSelectedFormId(form.id)}
                  className={`w-full rounded-md border p-3 text-left transition ${
                    selectedFormId === form.id ? "border-[#c7a14d] bg-[#fff8e6]" : "border-slate-200 bg-white hover:border-[#c7a14d]"
                  }`}
                >
                  <span className="block text-xs font-black text-[#071b3a]">{form.bank}</span>
                  <span className="mt-1 block text-sm font-black text-slate-950">{form.title}</span>
                  <span className="mt-1 block text-[11px] font-semibold leading-relaxed text-slate-500">{form.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-black">Progress Tracker</h2>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#c7a14d] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-black text-slate-600">
              <span>{completedRequired}/{totalRequired} required steps</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-3 space-y-2">
              {requiredFields.map((field) => (
                <div key={field.key} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <CheckCircle2 className={`h-4 w-4 ${values[field.key] ? "text-emerald-600" : "text-slate-300"}`} />
                  {field.label}
                </div>
              ))}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <CheckCircle2 className={`h-4 w-4 ${signatureData ? "text-emerald-600" : "text-slate-300"}`} />
                Signature
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-black">Signature Upload</h2>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#071b3a] px-3 py-2.5 text-sm font-black text-white">
              <Upload className="h-4 w-4" />
              Upload Signature
              <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={onSignatureUpload} />
            </label>
            {signatureData && <img src={signatureData} alt="Uploaded signature" className="mt-3 max-h-20 rounded border border-slate-200 bg-white object-contain p-2" />}
          </section>
        </aside>

        <section className="flex min-h-[680px] flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071b3a] text-[#f1c86b]">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-950">BankHub Assistant</h2>
                <p className="text-[11px] font-semibold text-slate-500">One question at a time with banking validations.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-auto bg-slate-50 p-4">
            {chat.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm font-semibold leading-relaxed ${
                  message.role === "user" ? "bg-[#071b3a] text-white" : "border border-slate-200 bg-white text-slate-800"
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={submitAnswer} className="border-t border-slate-100 bg-white p-4">
            {currentField ? (
              <div className="flex gap-2">
                <input
                  type={currentField.type === "date" ? "date" : "text"}
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder={currentField.placeholder || currentField.label}
                  className="min-w-0 flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-[#c7a14d]"
                />
                <button type="submit" className="flex items-center gap-2 rounded-md bg-[#c7a14d] px-4 py-2 text-sm font-black text-[#071b3a]">
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-bold text-emerald-800">
                <MessageSquareText className="h-4 w-4" />
                {isReadyForSignature ? "All questions are complete. Upload signature and review the PDF preview." : status}
              </div>
            )}
            {error && <p className="mt-2 text-xs font-bold text-rose-700">{error}</p>}
          </form>
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-950">Live PDF Preview</h2>
                <p className="text-[11px] font-semibold text-slate-500">Updates as answers are validated.</p>
              </div>
              <FileSignature className="h-5 w-5 text-[#c7a14d]" />
            </div>
            {previewUrl ? (
              <iframe title="AI guided filled PDF preview" src={previewUrl} className="h-[560px] w-full rounded-md border border-slate-200 bg-white" />
            ) : (
              <div className="flex h-[560px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-center text-xs font-bold text-slate-500">
                PDF preview will appear here.
              </div>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <button
              onClick={downloadPdf}
              disabled={!previewUrl || progress < 100}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#071b3a] px-3 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Download className="h-4 w-4" />
              Download Final PDF
            </button>
            <p className="mt-3 text-[11px] font-semibold leading-relaxed text-slate-500">
              The generated PDF uses fixed official-style coordinates and places validated values plus signature into the final document.
            </p>
          </section>
        </aside>
      </main>
    </div>
  );
}

function normalizeAnswer(field: GuidedField, value: string) {
  const trimmed = value.trim();
  if (field.type === "pan") return trimmed.toUpperCase();
  if (field.type === "mobile" || field.type === "aadhaar") return trimmed.replace(/\D/g, "");
  return trimmed;
}

function validateField(field: GuidedField, value: string) {
  if (field.required && !value) return `${field.label} is required.`;
  if (!value) return "";
  if (field.type === "pan" && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) return "PAN must follow the format ABCDE1234F.";
  if (field.type === "aadhaar" && !/^[0-9]{12}$/.test(value)) return "Aadhaar must be exactly 12 digits.";
  if (field.type === "mobile" && !/^[6-9][0-9]{9}$/.test(value)) return "Mobile number must be 10 digits and start with 6, 7, 8, or 9.";
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
  return "";
}

async function buildOfficialLookingPdf(form: GuidedForm, values: FormValues, signatureData: string) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE.width, PAGE.height]);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const bankColor = form.bank === "SBI" ? rgb(0.02, 0.19, 0.44) : rgb(0.64, 0.17, 0.06);
  const gold = rgb(0.78, 0.62, 0.3);
  const ink = rgb(0.03, 0.14, 0.32);
  const line = rgb(0.68, 0.73, 0.82);

  page.drawRectangle({ x: 0, y: PAGE.height - 90, width: PAGE.width, height: 90, color: bankColor });
  page.drawText("BankHub Forms", { x: 42, y: PAGE.height - 44, size: 20, font: bold, color: rgb(1, 1, 1) });
  page.drawText(`${form.bank} - ${form.title}`, { x: 42, y: PAGE.height - 68, size: 12, font: regular, color: rgb(0.95, 0.95, 0.95) });
  page.drawText("AI Guided Banking Form Assistant", { x: 365, y: PAGE.height - 48, size: 9, font: bold, color: gold });
  page.drawText("Validated digital completion", { x: 365, y: PAGE.height - 64, size: 8, font: regular, color: rgb(0.92, 0.92, 0.92) });

  page.drawRectangle({ x: 42, y: 100, width: PAGE.width - 84, height: PAGE.height - 220, borderColor: line, borderWidth: 1 });
  page.drawRectangle({ x: 54, y: PAGE.height - 142, width: PAGE.width - 108, height: 24, color: rgb(0.94, 0.97, 1) });
  page.drawText("Applicant and Form Details", { x: 66, y: PAGE.height - 135, size: 10, font: bold, color: ink });

  for (const field of form.fields) {
    const y = PAGE.height - field.y - field.height;
    page.drawText(field.label, { x: field.x, y: PAGE.height - field.y + 7, size: 8, font: bold, color: rgb(0.28, 0.33, 0.42) });
    page.drawRectangle({ x: field.x, y, width: field.width, height: field.height, borderColor: line, borderWidth: 1 });
    const value = values[field.key] || "";
    if (field.type === "multiline") {
      value.split("\n").slice(0, 4).forEach((row, index) => {
        page.drawText(row.slice(0, 72), { x: field.x + 6, y: y + field.height - 14 - index * 12, size: 9, font: regular, color: ink });
      });
    } else {
      page.drawText(value.slice(0, 50), { x: field.x + 6, y: y + 7, size: 10, font: regular, color: ink });
    }
  }

  page.drawText("Applicant Signature", { x: SIGNATURE_BOX.x, y: PAGE.height - SIGNATURE_BOX.y + 7, size: 8, font: bold, color: rgb(0.28, 0.33, 0.42) });
  page.drawRectangle({
    x: SIGNATURE_BOX.x,
    y: PAGE.height - SIGNATURE_BOX.y - SIGNATURE_BOX.height,
    width: SIGNATURE_BOX.width,
    height: SIGNATURE_BOX.height,
    borderColor: line,
    borderWidth: 1,
  });

  if (signatureData.startsWith("data:image")) {
    const bytes = Uint8Array.from(atob(signatureData.split(",")[1]), (char) => char.charCodeAt(0));
    const image = signatureData.includes("image/png") ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const fit = image.scaleToFit(SIGNATURE_BOX.width - 10, SIGNATURE_BOX.height - 10);
    page.drawImage(image, {
      x: SIGNATURE_BOX.x + 5,
      y: PAGE.height - SIGNATURE_BOX.y - SIGNATURE_BOX.height + 5,
      width: fit.width,
      height: fit.height,
    });
  }

  page.drawText("Declaration: I confirm the information entered above is accurate for bank processing.", {
    x: 54,
    y: 72,
    size: 8,
    font: regular,
    color: rgb(0.36, 0.42, 0.5),
  });
  page.drawText(`Generated ${new Date().toLocaleDateString("en-IN")} by BankHub`, {
    x: 54,
    y: 52,
    size: 8,
    font: regular,
    color: rgb(0.36, 0.42, 0.5),
  });

  return doc.save();
}
