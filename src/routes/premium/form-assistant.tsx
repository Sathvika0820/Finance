import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Bot, Download, FileCheck2, FileText, Landmark, Loader2, Send, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { buildFilledDocx, type DocxAnswers, type DocxImageValue } from "@/lib/docxLocal";

const sbiTemplateUrl = new URL("../../forms/sbi/ib_registration_original.docx", import.meta.url).href;

export const Route = createFileRoute("/premium/form-assistant")({
  head: () => ({
    meta: [
      { title: "BankHub Form Assistant" },
      { name: "description", content: "Fill the SBI Internet Banking Registration form with guided questions." },
    ],
  }),
  component: () => (
    <AppShell>
      <SimpleSbiFormAssistant />
    </AppShell>
  ),
});

type FieldKind = "text" | "date" | "image" | "choice";

type AssistantField = {
  key: string;
  label: string;
  fieldType: string;
  question: string;
  kind: FieldKind;
  placeholder?: string;
  optional?: boolean;
  accountRow?: number;
  choices?: Array<{ label: string; value: string }>;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const QUESTIONS: AssistantField[] = [
  {
    key: "branch_name",
    label: "Branch Name",
    fieldType: "Text field",
    question: "What is your SBI Branch Name?",
    kind: "text",
    placeholder: "Example: SBI Kukatpally Branch",
  },
  {
    key: "customer_name_boxes",
    label: "Customer Name",
    fieldType: "Character box field",
    question: "What is your full name as per SBI records?",
    kind: "text",
    placeholder: "Example: Ravi Kumar",
  },
  {
    key: "mobile_number_boxes",
    label: "Mobile Number",
    fieldType: "Mobile number box field",
    question: "What is your registered mobile number?",
    kind: "text",
    placeholder: "Example: 9876543210",
  },
  {
    key: "email_id",
    label: "Email ID",
    fieldType: "Email text field",
    question: "What is your email address?",
    kind: "text",
    placeholder: "Example: ravi@example.com",
  },
  {
    key: "date_of_birth",
    label: "Date of Birth",
    fieldType: "Date field",
    question: "What is your date of birth?",
    kind: "date",
    placeholder: "Example: 20/08/2005",
  },
  {
    key: "account_number_1_boxes",
    label: "Account 1 Number",
    fieldType: "Account number box field",
    question: "What is your SBI Account Number?",
    kind: "text",
    placeholder: "Example: 12345678901",
    accountRow: 1,
  },
  ...Array.from({ length: 7 }, (_, index) => {
    const row = index + 1;
    return [
      ...(row === 1 ? [] : [{
        key: `account_number_${row}_boxes`,
        label: `Account ${row} Number`,
        fieldType: "Account number box field",
        question: `Enter Account ${row} number, or type Skip if there is no Account ${row}.`,
        kind: "text" as const,
        placeholder: "Type Skip or enter account number",
        optional: true,
        accountRow: row,
      }]),
      {
        key: `account_${row}_single_joint`,
        label: `Account ${row} Single / Joint`,
        fieldType: "Selection field",
        question: `Is Account ${row} Single or Joint?`,
        kind: "choice" as const,
        accountRow: row,
        choices: [
          { label: "Single", value: "Single" },
          { label: "Joint", value: "Joint" },
        ],
      },
      {
        key: `account_${row}_transaction_rights`,
        label: `Account ${row} Transaction Rights`,
        fieldType: "Checkbox / Y-N field",
        question: `Enable Transaction Rights for Account ${row}?`,
        kind: "choice" as const,
        accountRow: row,
        choices: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ],
      },
      {
        key: `account_${row}_limited_transaction_rights`,
        label: `Account ${row} Limited Transaction Rights`,
        fieldType: "Checkbox / Y-N field",
        question: `Enable Limited Transaction Rights for Account ${row}?`,
        kind: "choice" as const,
        accountRow: row,
        choices: [
          { label: "Yes", value: "Y" },
          { label: "No", value: "N" },
        ],
      },
    ];
  }).flat(),
  {
    key: "customer_signature",
    label: "Customer Signature",
    fieldType: "Signature image field",
    question: "Please upload your signature.",
    kind: "image",
  },
];

const REQUIRED_KEYS = [
  "branch_name",
  "customer_name_boxes",
  "mobile_number_boxes",
  "email_id",
  "dob_dd_boxes",
  "dob_mm_boxes",
  "dob_yy_boxes",
  "account_number_1_boxes",
  "account_1_single_joint",
  "account_1_transaction_rights",
  "account_1_limited_transaction_rights",
  "customer_signature",
] as const;

const FIXED_FIELD_MAP = [
  ["Branch Name", "branch_name"],
  ["Full Name", "customer_name_boxes"],
  ["Mobile Number", "mobile_number_boxes"],
  ["Email", "email_id"],
  ["DOB Day", "dob_dd_boxes"],
  ["DOB Month", "dob_mm_boxes"],
  ["DOB Year", "dob_yy_boxes"],
  ["Account Number", "account_number_1_boxes"],
  ["Account 1 Type", "account_1_single_joint"],
  ["Account 1 Transaction Rights", "account_1_transaction_rights"],
  ["Account 1 Limited Transaction Rights", "account_1_limited_transaction_rights"],
  ["Signature", "customer_signature"],
  ["Current Date", "submission_date"],
] as const;

const REQUIRED_FIELD_LABELS: Record<(typeof REQUIRED_KEYS)[number], string> = {
  branch_name: "Branch Name",
  customer_name_boxes: "Full Name",
  mobile_number_boxes: "Mobile Number",
  email_id: "Email Address",
  dob_dd_boxes: "Date of Birth",
  dob_mm_boxes: "Date of Birth",
  dob_yy_boxes: "Date of Birth",
  account_number_1_boxes: "SBI Account Number",
  account_1_single_joint: "Account 1 Single / Joint",
  account_1_transaction_rights: "Account 1 Transaction Rights",
  account_1_limited_transaction_rights: "Account 1 Limited Transaction Rights",
  customer_signature: "Signature",
};

const REQUIRED_QUESTION_INDEX: Record<(typeof REQUIRED_KEYS)[number], number> = {
  branch_name: 0,
  customer_name_boxes: 1,
  mobile_number_boxes: 2,
  email_id: 3,
  dob_dd_boxes: 4,
  dob_mm_boxes: 4,
  dob_yy_boxes: 4,
  account_number_1_boxes: 5,
  account_1_single_joint: 6,
  account_1_transaction_rights: 7,
  account_1_limited_transaction_rights: 8,
  customer_signature: QUESTIONS.length - 1,
};

const RENDER_REQUIRED_KEYS = ["email_id", "submission_date", "customer_signature"] as const;

function SimpleSbiFormAssistant() {
  const [bankSelected, setBankSelected] = useState(false);
  const [templateReady, setTemplateReady] = useState(false);
  const [templateError, setTemplateError] = useState("");
  const [answers, setAnswers] = useState<DocxAnswers>(() => ({ submission_date: todayDate() }));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: "Select SBI to start the Internet Banking Registration Form." },
  ]);
  const [validationError, setValidationError] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [status, setStatus] = useState("");
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [generatedDocx, setGeneratedDocx] = useState<Blob | null>(null);
  const [returnToAssistantAfterAnswer, setReturnToAssistantAfterAnswer] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewZoom, setPreviewZoom] = useState(0.8);
  const [previewFitMode, setPreviewFitMode] = useState<"width" | "page">("width");
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const activeField = QUESTIONS[currentIndex];
  const progress = Math.min(100, Math.round((Math.min(currentIndex, QUESTIONS.length) / QUESTIONS.length) * 100));
  const missingFields = useMemo(() => REQUIRED_KEYS.filter((key) => !answers[key]), [answers]);
  const isComplete = missingFields.length === 0;
  const summary = buildSummary(answers);
  const accountSummary = buildAccountSummary(answers);

  useEffect(() => {
    if (!bankSelected) return;
    let cancelled = false;
    setTemplateReady(false);
    setTemplateError("");
    setStatus("Loading SBI template...");

    fetch(sbiTemplateUrl, { method: "HEAD" })
      .then((response) => {
        if (cancelled) return;
        if (!response.ok) throw new Error(`Template request failed: ${response.status}`);
        setTemplateReady(true);
        setStatus("SBI template loaded.");
        setChat([
          { id: "intro", role: "assistant", text: "SBI Internet Banking Registration Form loaded." },
          { id: "fixed-map", role: "assistant", text: "Using fixed SBI field mapping only." },
          { id: "q-0", role: "assistant", text: QUESTIONS[0].question },
        ]);
        console.info("[BankHub SBI Form Assistant] SBI template available. Fixed mapping active.", {
          fields: FIXED_FIELD_MAP.map(([, key]) => key),
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[BankHub SBI Form Assistant] Template load failed", error);
        setTemplateError("SBI template could not be loaded.");
        setStatus("");
      });

    return () => {
      cancelled = true;
    };
  }, [bankSelected]);

  useEffect(() => {
    if (!templateReady || !previewRef.current) return;
    let cancelled = false;
    setIsRenderingPreview(true);
    setPreviewError("");

    buildFilledDocx(sbiTemplateUrl, answers, { blankUnanswered: true })
      .then(async (docx) => {
        if (cancelled || !previewRef.current) return;
        previewRef.current.innerHTML = "";
        await renderAsync(await docx.arrayBuffer(), previewRef.current, undefined, {
          className: "bankhub-live-docx-page",
          inWrapper: true,
          ignoreFonts: false,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: false,
        });
        if (cancelled) return;
        console.info("[BankHub SBI Form Assistant] Live preview render success", { size: docx.size });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[BankHub SBI Form Assistant] Live preview render failed", error);
        setPreviewError("Live preview could not be rendered. DOCX/PDF generation may still work.");
      })
      .finally(() => {
        if (!cancelled) setIsRenderingPreview(false);
      });

    return () => {
      cancelled = true;
    };
  }, [answers, templateReady]);

  function startSbi() {
    setBankSelected(true);
  }

  function askNext(nextAnswers: DocxAnswers, nextIndex: number) {
    setGeneratedDocx(null);
    setDocumentError("");
    if (returnToAssistantAfterAnswer) {
      setReturnToAssistantAfterAnswer(false);
      setCurrentIndex(QUESTIONS.length);
      setInput("");
      setStatus("Correction saved. Regenerate the document to include the update.");
      setChat((messages) => [
        ...messages,
        { id: `updated-${Date.now()}`, role: "assistant", text: "Updated. You can regenerate the document, ask another banking question, or request another correction." },
      ]);
      console.info("[BankHub SBI Form Assistant] Correction saved", nextAnswers);
      return;
    }
    const resolvedNextIndex = findNextQuestionIndex(nextAnswers, nextIndex);
    setCurrentIndex(resolvedNextIndex);
    setInput("");
    if (resolvedNextIndex < QUESTIONS.length) {
      setChat((messages) => [
        ...messages,
        { id: `q-${resolvedNextIndex}-${Date.now()}`, role: "assistant", text: QUESTIONS[resolvedNextIndex].question },
      ]);
      return;
    }
    setStatus("Answers captured. Review the summary and generate the document.");
    setChat((messages) => [
      ...messages,
      { id: `done-${Date.now()}`, role: "assistant", text: "All SBI form details are captured. Review the summary and click Generate Document." },
    ]);
    console.info("[BankHub SBI Form Assistant] All answers captured", nextAnswers);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!activeField) {
      handleAssistantMessage();
      return;
    }
    if (!activeField || activeField.kind === "image") return;
    const rawValue = input.trim();
    const validation = validateAnswer(activeField.key, rawValue);
    if (validation) {
      setValidationError(validation);
      return;
    }

    const nextAnswers = normalizeAnswer(activeField, rawValue, answers);
    setAnswers(nextAnswers);
    setValidationError("");
    setChat((messages) => [...messages, { id: `a-${Date.now()}`, role: "user", text: rawValue }]);
    console.info("[BankHub SBI Form Assistant] Answer stored", { field: activeField.key, value: rawValue });
    askNext(nextAnswers, currentIndex + 1);
  }

  function handleAssistantMessage() {
    const message = input.trim();
    if (!message) return;
    setInput("");
    setChat((messages) => [...messages, { id: `assistant-user-${Date.now()}`, role: "user", text: message }]);

    const lower = message.toLowerCase();
    const correctionIndex = correctionQuestionIndex(lower);
    if (correctionIndex >= 0) {
      setReturnToAssistantAfterAnswer(true);
      setGeneratedDocx(null);
      setCurrentIndex(correctionIndex);
      setChat((messages) => [
        ...messages,
        { id: `correction-${Date.now()}`, role: "assistant", text: QUESTIONS[correctionIndex].question },
      ]);
      return;
    }

    const response = bankingAssistantResponse(lower);
    setChat((messages) => [...messages, { id: `banking-help-${Date.now()}`, role: "assistant", text: response }]);
  }

  function handleChoice(field: AssistantField, value: string, label: string) {
    const nextAnswers = { ...answers, [field.key]: value };
    setAnswers(nextAnswers);
    setValidationError("");
    setChat((messages) => [...messages, { id: `choice-${field.key}-${Date.now()}`, role: "user", text: label }]);
    console.info("[BankHub SBI Form Assistant] Choice stored", { field: field.key, value });
    askNext(nextAnswers, currentIndex + 1);
  }

  function handleSignatureUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !activeField || activeField.kind !== "image") return;
    const reader = new FileReader();
    reader.onload = () => {
      const image: DocxImageValue = { name: file.name, dataUrl: String(reader.result || "") };
      const nextAnswers = { ...answers, customer_signature: image };
      setAnswers(nextAnswers);
      setValidationError("");
      setChat((messages) => [...messages, { id: `sig-${Date.now()}`, role: "user", text: "Signature uploaded." }]);
      console.info("[BankHub SBI Form Assistant] Signature stored", { file: file.name, size: file.size });
      askNext(nextAnswers, currentIndex + 1);
    };
    reader.readAsDataURL(file);
  }

  function askMissingFieldAgain(key: (typeof REQUIRED_KEYS)[number]) {
    const questionIndex = REQUIRED_QUESTION_INDEX[key];
    const label = REQUIRED_FIELD_LABELS[key];
    setGeneratedDocx(null);
    setCurrentIndex(questionIndex);
    setInput("");
    setValidationError(`${label} is required. Please answer this question before generating the document.`);
    setChat((messages) => [
      ...messages,
      { id: `missing-${key}-${Date.now()}`, role: "assistant", text: QUESTIONS[questionIndex].question },
    ]);
    console.warn("[BankHub SBI Form Assistant] Required fixed field missing", { field: key, label });
  }

  async function generateDocument() {
    const generationAnswers = textAnswer(answers.submission_date) ? answers : { ...answers, submission_date: todayDate() };
    if (generationAnswers !== answers) setAnswers(generationAnswers);

    const missing = getMissingRequiredKeys(generationAnswers);
    if (missing.length > 0) {
      askMissingFieldAgain(missing[0]);
      return null;
    }
    const renderMissing = getRenderMissingKeys(generationAnswers);
    logRenderValidation(generationAnswers, renderMissing);
    if (renderMissing.length > 0) {
      const missingKey = renderMissing[0];
      if (missingKey === "email_id" || missingKey === "customer_signature") {
        askMissingFieldAgain(missingKey);
      } else {
        setDocumentError("Submission Date is required before generating the document.");
      }
      return null;
    }
    setIsGeneratingDocx(true);
    setDocumentError("");
    setStatus("Generating populated DOCX...");
    try {
      const docx = await buildFilledDocx(sbiTemplateUrl, generationAnswers, { blankUnanswered: true });
      setGeneratedDocx(docx);
      setStatus("Document Ready");
      console.info("[BankHub SBI Form Assistant] Generated DOCX", { size: docx.size });
      return docx;
    } catch (error) {
      console.error("[BankHub SBI Form Assistant] DOCX generation failed", error);
      setDocumentError("DOCX generation failed. Please check the local SBI template and try again.");
      return null;
    } finally {
      setIsGeneratingDocx(false);
    }
  }

  async function downloadDocx() {
    const docx = generatedDocx || await generateDocument();
    if (!docx) return;
    downloadBlob(docx, "sbi_internet_banking_registration_filled.docx");
    setStatus("DOCX downloaded.");
    console.info("[BankHub SBI Form Assistant] DOCX download success", { size: docx.size });
  }

  async function downloadPdf() {
    if (!isComplete) {
      setValidationError("Please complete all required questions before downloading PDF.");
      return;
    }
    const docx = generatedDocx || await generateDocument();
    if (!docx) return;

    setIsGeneratingPdf(true);
    setDocumentError("");
    setStatus("Generating PDF...");
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.width = "900px";
    container.style.background = "#ffffff";
    document.body.appendChild(container);

    try {
      await renderAsync(await docx.arrayBuffer(), container, undefined, {
        className: "bankhub-sbi-pdf-page",
        inWrapper: true,
        ignoreFonts: false,
        ignoreWidth: false,
        ignoreHeight: false,
        breakPages: false,
      });
      const pageTarget = container.querySelector<HTMLElement>(".docx-wrapper") || container;
      const canvas = await html2canvas(pageTarget, { backgroundColor: "#ffffff", scale: 2, useCORS: true });
      const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? "landscape" : "portrait", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
      pdf?.save("sbi_internet_banking_registration_filled.pdf");
      setStatus("PDF downloaded as a single page.");
      console.info("[BankHub SBI Form Assistant] PDF download success", { pages: 1, width: canvas.width, height: canvas.height });
    } catch (error) {
      console.error("[BankHub SBI Form Assistant] PDF download failed", error);
      setDocumentError("PDF generation failed. Please try downloading DOCX first or generate again.");
    } finally {
      container.remove();
      setIsGeneratingPdf(false);
    }
  }

  function resetFlow() {
    setBankSelected(false);
    setTemplateReady(false);
    setTemplateError("");
    setAnswers({ submission_date: todayDate() });
    setCurrentIndex(0);
    setInput("");
    setValidationError("");
    setDocumentError("");
    setGeneratedDocx(null);
    setStatus("");
    setReturnToAssistantAfterAnswer(false);
    setPreviewError("");
    setPreviewZoom(0.8);
    setPreviewFitMode("width");
    setChat([{ id: "welcome", role: "assistant", text: "Select SBI to start the Internet Banking Registration Form." }]);
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/dashboard"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <button
            type="button"
            onClick={resetFlow}
            className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            Reset
          </button>
        </div>

        <section className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">BankHub Form Assistant</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">SBI Internet Banking Registration</h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                Uses the uploaded SBI form as the master template. Detected fields are filled into the original document and shown in a live full-form preview.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
              Progress: {progress}%
            </div>
          </div>
        </section>

        {!bankSelected ? (
          <section className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={startSbi}
              className="rounded-[2rem] border border-emerald-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Landmark className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-950">SBI</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">Internet Banking Registration Form</p>
            </button>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
            <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-950">AI Questions</h2>
                  <p className="text-xs font-bold text-slate-500">Fixed SBI question flow</p>
                </div>
              </div>

              {templateError ? <Alert tone="error" text={templateError} /> : null}
              {validationError ? <Alert tone="error" text={validationError} /> : null}
              {status ? <Alert tone="info" text={status} /> : null}

              <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                {chat.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold leading-6 ${message.role === "assistant" ? "bg-slate-50 text-slate-700" : "bg-sky-600 text-white"}`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>

              {templateReady && activeField ? (
                activeField.kind === "image" ? (
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-300 bg-sky-50 px-4 py-4 text-sm font-black text-sky-800 transition hover:bg-sky-100">
                    <Upload className="h-5 w-5" />
                    Upload Signature
                    <input type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload} />
                  </label>
                ) : activeField.kind === "choice" ? (
                  <div className="grid grid-cols-2 gap-2">
                    {activeField.choices?.map((choice) => (
                      <button
                        key={choice.value}
                        type="button"
                        onClick={() => handleChoice(activeField, choice.value, choice.label)}
                        className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-black text-sky-800 transition hover:bg-sky-100"
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder={activeField.placeholder}
                      className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                    <button
                      type="submit"
                      aria-label="Send answer"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                )
              ) : templateReady && !activeField ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask a banking doubt or type Change mobile number"
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                  <button
                    type="submit"
                    aria-label="Send assistant message"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              ) : null}

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold leading-5 text-slate-500">
                <p>Detected fields: {QUESTIONS.length + 1}</p>
                <p>Submission date: {String(answers.submission_date || "")}</p>
                {isComplete ? <p className="mt-1 text-emerald-700">All required fields completed.</p> : <p className="mt-1 text-amber-700">Missing: {missingFields.length}</p>}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Detected SBI Fields</h3>
                <div className="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1">
                  {QUESTIONS.map((field) => (
                    <div key={field.key} className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                      {field.label} <span className="text-slate-400">- {field.fieldType}</span>
                    </div>
                  ))}
                  <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                    Submission Date <span className="text-slate-400">- Auto-filled date field</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-950">Live SBI Form Preview</h2>
                  <p className="text-xs font-bold text-slate-500">Actual DOCX layout. Scroll to inspect the complete form.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setPreviewZoom((zoom) => Math.max(0.5, Number((zoom - 0.1).toFixed(2))))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">Zoom Out</button>
                  <button type="button" onClick={() => setPreviewZoom((zoom) => Math.min(1.6, Number((zoom + 0.1).toFixed(2))))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">Zoom In</button>
                  <button type="button" onClick={() => { setPreviewFitMode("width"); setPreviewZoom(0.8); }} className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-black text-sky-800 shadow-sm">Fit Width</button>
                  <button type="button" onClick={() => { setPreviewFitMode("page"); setPreviewZoom(0.58); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">Fit to Page</button>
                </div>
              </div>

              {documentError ? <Alert tone="error" text={documentError} /> : null}
              {previewError ? <Alert tone="error" text={previewError} /> : null}
              {isRenderingPreview ? <Alert tone="info" text="Updating live preview..." /> : null}

              <div className={`max-h-[760px] overflow-auto rounded-3xl border border-slate-200 bg-slate-100 p-4 ${previewFitMode === "page" ? "flex justify-center" : ""}`}>
                <div
                  ref={previewRef}
                  className="bankhub-docx-preview origin-top-left bg-white shadow-sm"
                  style={{
                    transform: `scale(${previewZoom})`,
                    transformOrigin: "top left",
                    width: previewFitMode === "width" ? `${100 / previewZoom}%` : undefined,
                    minHeight: 680,
                  }}
                />
              </div>

              <div>
                <h2 className="text-base font-black text-slate-950">Answer Summary</h2>
                <p className="text-xs font-bold text-slate-500">Generate downloads after all required answers are complete.</p>
              </div>

              <div className="grid gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 sm:grid-cols-2">
                <SummaryItem label="Branch" value={summary.branch} />
                <SummaryItem label="Name" value={summary.name} />
                <SummaryItem label="Mobile" value={summary.mobile} />
                <SummaryItem label="Email" value={summary.email} />
                <SummaryItem label="DOB" value={summary.dob} />
                <SummaryItem label="Account Number" value={summary.accountNumber} />
                <SummaryItem label="Signature" value={summary.signature} />
              </div>

              {accountSummary.length ? (
                <div className="rounded-3xl border border-slate-100 bg-white p-4">
                  <h3 className="text-sm font-black text-slate-950">Account Table</h3>
                  <div className="mt-3 grid gap-2 text-xs font-bold text-slate-600">
                    {accountSummary.map((account) => (
                      <div key={account.row} className="rounded-2xl bg-slate-50 p-3">
                        Account {account.row}: {account.number} | {account.type || "Type pending"} | Transaction {account.transactionRights || "pending"} | Limited {account.limitedTransactionRights || "pending"}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {!isComplete ? (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold leading-6 text-amber-800">
                  Complete the remaining questions. The document will be generated only after all required SBI details are captured.
                </div>
              ) : generatedDocx ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                    <FileCheck2 className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-xl font-black text-emerald-950">Document Ready</h3>
                  <p className="mt-2 text-sm font-bold text-emerald-700">Download the populated SBI form as DOCX or PDF.</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={generateDocument}
                  disabled={isGeneratingDocx}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGeneratingDocx ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileCheck2 className="h-5 w-5" />}
                  Generate Document
                </button>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadDocx}
                  disabled={!isComplete || isGeneratingDocx}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="h-4 w-4" />
                  Download DOCX
                </button>
                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={!isComplete || isGeneratingDocx || isGeneratingPdf}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  Download PDF
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Alert({ text, tone }: { text: string; tone: "error" | "info" }) {
  return (
    <div className={`rounded-2xl px-4 py-3 text-sm font-bold ${tone === "error" ? "border border-rose-200 bg-rose-50 text-rose-700" : "border border-sky-200 bg-sky-50 text-sky-700"}`}>
      {text}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-slate-900">{value || "Pending"}</p>
    </div>
  );
}

function validateAnswer(key: string, value: string) {
  if (!value) return "This answer is required.";
  if (key === "branch_name" && value.length < 2) return "Please enter a valid SBI branch name.";
  if (key === "customer_name_boxes" && !/^[A-Za-z ]{2,}$/.test(value)) return "Customer name must contain alphabets and spaces only.";
  if (key === "mobile_number_boxes" && !/^\d{10}$/.test(value)) return "Mobile number must be exactly 10 digits.";
  if (key === "email_id" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
  if (key === "date_of_birth" && !parseDob(value)) return "Please enter DOB in DD/MM/YYYY format, for example 20/08/2005.";
  if (/^account_number_\d+_boxes$/.test(key) && value.toLowerCase() !== "skip" && !/^\d{9,18}$/.test(value)) return "Account number must contain 9 to 18 digits only, or type Skip for optional account rows.";
  return "";
}

function normalizeAnswer(field: AssistantField, value: string, answers: DocxAnswers): DocxAnswers {
  const key = field.key;
  if (key === "date_of_birth") {
    const parsed = parseDob(value);
    if (!parsed) return answers;
    return {
      ...answers,
      dob_dd_boxes: parsed.day,
      dob_mm_boxes: parsed.month,
      dob_yy_boxes: parsed.year.slice(-2),
      dob: `${parsed.day}/${parsed.month}/${parsed.year}`,
    };
  }
  if (field.optional && /^account_number_\d+_boxes$/.test(key) && value.toLowerCase() === "skip") {
    return clearAccountRowAnswers(answers, field.accountRow || 0);
  }
  return { ...answers, [key]: value };
}

function clearAccountRowAnswers(answers: DocxAnswers, row: number): DocxAnswers {
  if (!row) return answers;
  const nextAnswers = { ...answers };
  delete nextAnswers[`account_number_${row}_boxes`];
  delete nextAnswers[`account_${row}_single_joint`];
  delete nextAnswers[`account_${row}_transaction_rights`];
  delete nextAnswers[`account_${row}_limited_transaction_rights`];
  return nextAnswers;
}

function findNextQuestionIndex(answers: DocxAnswers, startIndex: number) {
  let index = startIndex;
  while (index < QUESTIONS.length) {
    const field = QUESTIONS[index];
    if (!field.accountRow || field.key.startsWith("account_number_")) return index;
    if (answers[`account_number_${field.accountRow}_boxes`]) return index;
    index += 1;
  }
  return index;
}

function parseDob(value: string) {
  const match = value.trim().replace(/[.-]/g, "/").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const dayNumber = Number(match[1]);
  const monthNumber = Number(match[2]);
  if (dayNumber < 1 || dayNumber > 31 || monthNumber < 1 || monthNumber > 12) return null;
  return {
    day: match[1].padStart(2, "0"),
    month: match[2].padStart(2, "0"),
    year: match[3],
  };
}

function todayDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

function getMissingRequiredKeys(answers: DocxAnswers) {
  return REQUIRED_KEYS.filter((key) => !answers[key]);
}

function getRenderMissingKeys(answers: DocxAnswers) {
  return RENDER_REQUIRED_KEYS.filter((key) => !answers[key]);
}

function logRenderValidation(answers: DocxAnswers, missing: readonly string[]) {
  console.info("[BankHub SBI Form Assistant] Render validation", {
    email_id: textAnswer(answers.email_id) || "MISSING",
    submission_date: textAnswer(answers.submission_date) || "MISSING",
    customer_signature: answers.customer_signature ? "uploaded" : "MISSING",
    "Render Status": missing.length ? "FAILED" : "SUCCESS",
  });
}

function buildSummary(answers: DocxAnswers) {
  return {
    branch: textAnswer(answers.branch_name),
    name: textAnswer(answers.customer_name_boxes),
    mobile: textAnswer(answers.mobile_number_boxes),
    email: textAnswer(answers.email_id),
    dob: textAnswer(answers.dob),
    accountNumber: textAnswer(answers.account_number_1_boxes),
    signature: answers.customer_signature ? "Uploaded" : "Pending",
  };
}

function buildAccountSummary(answers: DocxAnswers) {
  return Array.from({ length: 7 }, (_, index) => {
    const row = index + 1;
    const number = textAnswer(answers[`account_number_${row}_boxes`]);
    if (!number) return null;
    return {
      row,
      number,
      type: textAnswer(answers[`account_${row}_single_joint`]),
      transactionRights: yesNoLabel(textAnswer(answers[`account_${row}_transaction_rights`])),
      limitedTransactionRights: yesNoLabel(textAnswer(answers[`account_${row}_limited_transaction_rights`])),
    };
  }).filter(Boolean) as Array<{ row: number; number: string; type: string; transactionRights: string; limitedTransactionRights: string }>;
}

function yesNoLabel(value: string) {
  if (value === "Y") return "Yes";
  if (value === "N") return "No";
  return value;
}

function correctionQuestionIndex(message: string) {
  const accountMatch = message.match(/account(?:\s+number)?\s+([1-7])/);
  if (accountMatch) {
    const key = `account_number_${accountMatch[1]}_boxes`;
    return QUESTIONS.findIndex((question) => question.key === key);
  }
  if (message.includes("branch")) return 0;
  if (message.includes("name")) return 1;
  if (message.includes("mobile") || message.includes("phone")) return 2;
  if (message.includes("email")) return 3;
  if (message.includes("dob") || message.includes("birth")) return 4;
  if (message.includes("signature")) return QUESTIONS.findIndex((question) => question.key === "customer_signature");
  if (message.includes("single") || message.includes("joint")) return QUESTIONS.findIndex((question) => question.key === "account_1_single_joint");
  if (message.includes("transaction right")) return QUESTIONS.findIndex((question) => question.key === "account_1_transaction_rights");
  if (message.includes("limited")) return QUESTIONS.findIndex((question) => question.key === "account_1_limited_transaction_rights");
  return -1;
}

function bankingAssistantResponse(message: string) {
  if (message.includes("submit") || message.includes("submission")) {
    return "Submit the generated SBI Internet Banking Registration form at your home branch or follow the branch's official instruction. Carry original ID proof and account proof for verification.";
  }
  if (message.includes("document") || message.includes("required") || message.includes("attach")) {
    return "Usually you should carry the filled form, passbook or account proof, PAN/Aadhaar or another valid ID proof, and any branch-requested documents. Please confirm with SBI because branch requirements can vary.";
  }
  if (message.includes("download") || message.includes("pdf") || message.includes("docx")) {
    return "Use Generate Document first, then Download DOCX or Download PDF. If you changed any answer, regenerate before downloading.";
  }
  return "I can help with SBI form doubts, submission guidance, required documents, or corrections. For example, type 'change mobile number' or 'update account number 2'.";
}

function textAnswer(value: DocxAnswers[string]) {
  return typeof value === "string" ? value : "";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
