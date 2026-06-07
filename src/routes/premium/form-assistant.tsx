import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Bot, Download, FileCheck2, FileText, Landmark, Loader2, Send, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { buildFilledDocx, type DocxAnswers, type DocxImageValue } from "@/lib/docxLocal";

const sbiTemplateUrl = new URL("../../forms/sbi/ib_registration_original.docx", import.meta.url).href;
const DOCUMENT_PAGE_WIDTH = 794;
const DOCUMENT_PAGE_HEIGHT = 1123;
const DOCUMENT_PAGE_PADDING = 24;

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
  const [pdfDiagnostics, setPdfDiagnostics] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [generatedDocx, setGeneratedDocx] = useState<Blob | null>(null);
  const [returnToAssistantAfterAnswer, setReturnToAssistantAfterAnswer] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewZoom, setPreviewZoom] = useState(0.58);
  const [previewFitMode, setPreviewFitMode] = useState<"width" | "page">("page");
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);

  const activeField = QUESTIONS[currentIndex];
  const progress = Math.min(100, Math.round((Math.min(currentIndex, QUESTIONS.length) / QUESTIONS.length) * 100));
  const missingFields = useMemo(() => REQUIRED_KEYS.filter((key) => !answers[key]), [answers]);
  const isComplete = missingFields.length === 0;
  const shouldShowPreview = Boolean(
    answers.branch_name
      && answers.customer_name_boxes
      && answers.mobile_number_boxes
      && answers.email_id
      && answers.dob
      && answers.account_number_1_boxes,
  );

  const fitPreviewToPage = useCallback(() => {
    if (previewFitMode !== "page" || !previewRef.current || !previewViewportRef.current) return;
    const page = previewRef.current.querySelector<HTMLElement>(".bankhub-fixed-page, .docx-wrapper section, .docx-wrapper > section, .docx");
    if (!page) return;
    const pageWidth = DOCUMENT_PAGE_WIDTH;
    const pageHeight = DOCUMENT_PAGE_HEIGHT;
    if (!pageWidth || !pageHeight) return;

    const availableWidth = Math.max(previewViewportRef.current.clientWidth - DOCUMENT_PAGE_PADDING, 280);
    const availableHeight = Math.max(Math.min(window.innerHeight * 0.72, 820) - DOCUMENT_PAGE_PADDING, 420);
    const nextZoom = Math.max(0.3, Math.min(1, availableWidth / pageWidth, availableHeight / pageHeight));
    setPreviewZoom(Number(nextZoom.toFixed(2)));
  }, [previewFitMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    if (templateReady && activeField?.kind !== "choice" && activeField?.kind !== "image") {
      window.setTimeout(() => textInputRef.current?.focus(), 80);
    }
  }, [chat, templateReady, activeField?.kind, activeField?.key]);

  useEffect(() => {
    if (!shouldShowPreview) return;
    window.addEventListener("resize", fitPreviewToPage);
    return () => window.removeEventListener("resize", fitPreviewToPage);
  }, [fitPreviewToPage, shouldShowPreview]);

  useEffect(() => {
    if (!bankSelected) return;
    let cancelled = false;
    setTemplateReady(false);
    setTemplateError("");
    setStatus("");

    fetch(sbiTemplateUrl, { method: "HEAD" })
      .then((response) => {
        if (cancelled) return;
        if (!response.ok) throw new Error(`Template request failed: ${response.status}`);
        setTemplateReady(true);
        setStatus("");
        setChat([
          { id: "intro", role: "assistant", text: "Welcome. I will help you complete your SBI Internet Banking Registration Form." },
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
    if (!templateReady || !shouldShowPreview || !previewRef.current) return;
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
        applyFixedDocumentLayout(previewRef.current);
        requestAnimationFrame(fitPreviewToPage);
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
  }, [answers, fitPreviewToPage, templateReady, shouldShowPreview]);

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
    setPdfDiagnostics([]);
    setStatus("Generating PDF...");
    const diagnostics = [
      `Template Loaded = ${templateReady ? "YES" : "NO"}`,
      `Form Populated = ${docx ? "YES" : "NO"}`,
      `PDF Library Loaded = ${html2canvas && jsPDF ? "YES" : "NO"}`,
      "PDF Render Success = NO",
    ];
    setPdfDiagnostics(diagnostics);
    console.info("[BankHub SBI Form Assistant] PDF Conversion Started", diagnostics);
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "-1";
    container.style.width = `${DOCUMENT_PAGE_WIDTH}px`;
    container.style.height = `${DOCUMENT_PAGE_HEIGHT}px`;
    container.style.overflow = "hidden";
    container.style.background = "#ffffff";
    document.body.appendChild(container);

    try {
      let pageTarget: HTMLElement | null = null;
      const visiblePreviewPage = previewRef.current?.querySelector<HTMLElement>(".bankhub-fixed-page, .docx-wrapper section, .docx");

      if (visiblePreviewPage) {
        const previewClone = visiblePreviewPage.cloneNode(true) as HTMLElement;
        previewClone.style.transform = "none";
        previewClone.style.margin = "0";
        previewClone.style.width = `${DOCUMENT_PAGE_WIDTH}px`;
        previewClone.style.minWidth = `${DOCUMENT_PAGE_WIDTH}px`;
        previewClone.style.maxWidth = `${DOCUMENT_PAGE_WIDTH}px`;
        previewClone.style.height = `${DOCUMENT_PAGE_HEIGHT}px`;
        previewClone.style.minHeight = `${DOCUMENT_PAGE_HEIGHT}px`;
        previewClone.style.maxHeight = `${DOCUMENT_PAGE_HEIGHT}px`;
        previewClone.style.overflow = "hidden";
        container.appendChild(previewClone);
        pageTarget = previewClone;
      } else {
        await renderAsync(await docx.arrayBuffer(), container, undefined, {
          className: "bankhub-sbi-pdf-page",
          inWrapper: true,
          ignoreFonts: false,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: false,
        });
        applyFixedDocumentLayout(container);
        pageTarget = container.querySelector<HTMLElement>(".bankhub-fixed-page, .docx-wrapper section, .docx");
      }

      if (!pageTarget) {
        throw new Error("Unable to locate the fixed SBI page for PDF rendering.");
      }

      if ("fonts" in document) {
        await document.fonts.ready;
      }
      await waitForNextFrame();
      await waitForNextFrame();

      const canvas = await html2canvas(pageTarget, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        width: DOCUMENT_PAGE_WIDTH,
        height: DOCUMENT_PAGE_HEIGHT,
        windowWidth: DOCUMENT_PAGE_WIDTH,
        windowHeight: DOCUMENT_PAGE_HEIGHT,
      });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [DOCUMENT_PAGE_WIDTH, DOCUMENT_PAGE_HEIGHT],
        compress: true,
      });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, DOCUMENT_PAGE_WIDTH, DOCUMENT_PAGE_HEIGHT);
      const pdfBlob = pdf.output("blob");
      downloadBlob(pdfBlob, "SBI_Internet_Banking_Registration.pdf");
      const successDiagnostics = diagnostics.map((line) => line === "PDF Render Success = NO" ? "PDF Render Success = YES" : line);
      setPdfDiagnostics(successDiagnostics);
      setStatus("PDF downloaded as a single page.");
      console.info("[BankHub SBI Form Assistant] PDF Conversion Success", successDiagnostics, { width: canvas.width, height: canvas.height });
      console.info("[BankHub SBI Form Assistant] PDF download success", { pages: 1, width: canvas.width, height: canvas.height });
    } catch (error) {
      const errorDetails = getErrorDetails(error);
      const failureDiagnostics = [
        ...diagnostics,
        `Actual Error Message = ${errorDetails}`,
      ];
      setPdfDiagnostics(failureDiagnostics);
      console.error("[BankHub SBI Form Assistant] PDF Conversion Failure", failureDiagnostics, error);
      console.error("[BankHub SBI Form Assistant] PDF download failed", error);
      setDocumentError(`PDF generation failed: ${errorDetails}`);
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
    setPreviewZoom(0.58);
    setPreviewFitMode("page");
    setChat([{ id: "welcome", role: "assistant", text: "Select SBI to start the Internet Banking Registration Form." }]);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <style>{`
        .bankhub-docx-preview,
        .bankhub-sbi-pdf-page {
          width: ${DOCUMENT_PAGE_WIDTH}px;
          min-width: ${DOCUMENT_PAGE_WIDTH}px;
          max-width: ${DOCUMENT_PAGE_WIDTH}px;
        }

        .bankhub-docx-preview .docx-wrapper,
        .bankhub-sbi-pdf-page .docx-wrapper {
          width: ${DOCUMENT_PAGE_WIDTH}px !important;
          min-width: ${DOCUMENT_PAGE_WIDTH}px !important;
          max-width: ${DOCUMENT_PAGE_WIDTH}px !important;
          margin: 0 auto !important;
          padding: 0 !important;
          background: transparent !important;
        }

        .bankhub-docx-preview .bankhub-fixed-page,
        .bankhub-sbi-pdf-page .bankhub-fixed-page,
        .bankhub-docx-preview .docx-wrapper section,
        .bankhub-sbi-pdf-page .docx-wrapper section {
          width: ${DOCUMENT_PAGE_WIDTH}px !important;
          min-width: ${DOCUMENT_PAGE_WIDTH}px !important;
          max-width: ${DOCUMENT_PAGE_WIDTH}px !important;
          height: ${DOCUMENT_PAGE_HEIGHT}px !important;
          min-height: ${DOCUMENT_PAGE_HEIGHT}px !important;
          max-height: ${DOCUMENT_PAGE_HEIGHT}px !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          margin: 0 auto !important;
          padding: 0 !important;
          background: white !important;
          page-break-after: avoid !important;
          break-after: avoid-page !important;
        }
      `}</style>
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <button
            type="button"
            onClick={resetFlow}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            Reset
          </button>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">BankHub Form Assistant</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">SBI Internet Banking Registration</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Answer a few questions to automatically fill your SBI form.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-sky-600 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </section>

        {!bankSelected ? (
          <section className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={startSbi}
              className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Landmark className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-black text-slate-950">SBI</h2>
              <p className="mt-1 text-sm text-slate-600">Internet Banking Registration Form</p>
            </button>
          </section>
        ) : (
          <>
            <section className="flex min-w-0 flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-950">AI Assistant</h2>
                    <p className="text-sm text-slate-500">Answer one question at a time.</p>
                  </div>
                </div>

                {templateError ? <InlineNotice tone="error" text="The SBI form could not be loaded. Please try again." /> : null}
                {validationError ? <InlineNotice tone="error" text={validationError} /> : null}

                <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                  {chat.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-6 ${message.role === "assistant" ? "bg-slate-100 text-slate-800" : "ml-auto bg-sky-600 text-white"}`}
                    >
                      <span className="mb-1 block text-[11px] font-black uppercase tracking-[0.12em] opacity-60">
                        {message.role === "assistant" ? "AI" : "You"}
                      </span>
                      {message.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {templateReady && activeField ? (
                  activeField.kind === "image" ? (
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-300 bg-sky-50 px-4 py-4 text-sm font-bold text-sky-800 transition hover:bg-sky-100">
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
                          className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800 transition hover:bg-sky-100"
                        >
                          {choice.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                        ref={textInputRef}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Type your answer..."
                        className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      />
                      <button
                        type="submit"
                        aria-label="Send answer"
                        className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  )
                ) : templateReady && !activeField ? (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      ref={textInputRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder="Type your answer..."
                      className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                    <button
                      type="submit"
                      aria-label="Send assistant message"
                      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                ) : null}
            </section>

            {shouldShowPreview ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-950">Form Preview</h2>
                    <p className="mt-1 text-sm text-slate-500">Review the filled SBI form before downloading.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setPreviewZoom((zoom) => Math.max(0.5, Number((zoom - 0.1).toFixed(2))))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">Zoom Out</button>
                    <button type="button" onClick={() => setPreviewZoom((zoom) => Math.min(1.6, Number((zoom + 0.1).toFixed(2))))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">Zoom In</button>
                    <button type="button" onClick={() => { setPreviewFitMode("page"); setPreviewZoom(0.58); }} className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800">Fit to Page</button>
                  </div>
                </div>
                {previewError ? <InlineNotice tone="error" text="Preview could not be shown. You can still generate the document." /> : null}
                {isRenderingPreview ? <p className="mt-3 text-sm font-semibold text-sky-700">Updating preview...</p> : null}
                <div ref={previewViewportRef} className={`mt-4 max-h-[820px] overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4 ${previewFitMode === "page" ? "flex justify-center" : ""}`} style={{ touchAction: "pan-x pan-y" }}>
                  <div
                    ref={previewRef}
                    className="bankhub-docx-preview bg-white shadow-sm"
                    style={{
                      transform: `scale(${previewZoom})`,
                      transformOrigin: "top center",
                      width: previewFitMode === "width" ? `${100 / previewZoom}%` : undefined,
                      minHeight: 620,
                      margin: "0 auto",
                    }}
                  />
                </div>
              </section>
            ) : null}

            {documentError ? <InlineNotice tone="error" text={documentError} /> : null}
            {pdfDiagnostics.length ? <InlineNotice tone="info" text={pdfDiagnostics.join(" | ")} /> : null}

            {isComplete ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                {!generatedDocx ? (
                  <button
                    type="button"
                    onClick={generateDocument}
                    disabled={isGeneratingDocx}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isGeneratingDocx ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileCheck2 className="h-5 w-5" />}
                    Generate Form
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={downloadDocx}
                      disabled={isGeneratingDocx}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-sky-200 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Download className="h-4 w-4" />
                      Download DOCX
                    </button>
                    <button
                      type="button"
                      onClick={downloadPdf}
                      disabled={isGeneratingDocx || isGeneratingPdf}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                      Download PDF
                    </button>
                  </div>
                )}
              </section>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}

function InlineNotice({ text, tone }: { text: string; tone: "error" | "info" }) {
  return (
    <div className={`rounded-2xl px-4 py-3 text-sm font-semibold ${tone === "error" ? "border border-rose-200 bg-rose-50 text-rose-700" : "border border-sky-200 bg-sky-50 text-sky-700"}`}>
      {text}
    </div>
  );
}

function applyFixedDocumentLayout(root: HTMLElement) {
  const wrappers = root.querySelectorAll<HTMLElement>(".docx-wrapper");
  wrappers.forEach((wrapper) => {
    wrapper.style.width = `${DOCUMENT_PAGE_WIDTH}px`;
    wrapper.style.minWidth = `${DOCUMENT_PAGE_WIDTH}px`;
    wrapper.style.maxWidth = `${DOCUMENT_PAGE_WIDTH}px`;
    wrapper.style.margin = "0 auto";
    wrapper.style.padding = "0";
    wrapper.style.background = "transparent";
  });

  const pages = root.querySelectorAll<HTMLElement>(".docx-wrapper section, .docx");
  pages.forEach((page) => {
    page.classList.add("bankhub-fixed-page");
    page.style.width = `${DOCUMENT_PAGE_WIDTH}px`;
    page.style.minWidth = `${DOCUMENT_PAGE_WIDTH}px`;
    page.style.maxWidth = `${DOCUMENT_PAGE_WIDTH}px`;
    page.style.height = `${DOCUMENT_PAGE_HEIGHT}px`;
    page.style.minHeight = `${DOCUMENT_PAGE_HEIGHT}px`;
    page.style.maxHeight = `${DOCUMENT_PAGE_HEIGHT}px`;
    page.style.boxSizing = "border-box";
    page.style.overflow = "hidden";
    page.style.margin = "0 auto";
    page.style.padding = "0";
    page.style.background = "#ffffff";
  });
}

function waitForNextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) return error.stack || error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown PDF error";
  }
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
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
