import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Bot, Download, Landmark, Loader2, RefreshCw, Send, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BANK_FORM_GROUPS, buildConfigQuestionKeys, getConditionalInsertFields, getFormConfig, type BankHubFormConfig } from "@/forms/formConfigs";
import { LOCAL_FORM_TEMPLATES, type LocalFormTemplate } from "@/forms/registry";
import { OVERLAY_FORM_FIELDS, OVERLAY_MAPPINGS, overlayValue, type OverlayFieldMapping } from "@/forms/overlayMappings";
import { buildAssistantFields, getFieldLabel, normalizeAnswer, validateFieldValue, type AssistantField } from "@/lib/formAssistant";
import { useTranslation } from "@/lib/i18n";
import { buildFilledDocx, loadDocxTemplate, type DocxAnswers, type DocxImageValue } from "@/lib/docxLocal";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type LoadedTemplate = Awaited<ReturnType<typeof loadDocxTemplate>>;

const FLOW_STEPS = ["Bank", "Form", "Form Config", "AI Questions", "Answers", "Template Renderer", "PDF"];

export const Route = createFileRoute("/premium/form-assistant")({
  head: () => ({
    meta: [
      { title: "BankHub Form Assistant" },
      {
        name: "description",
        content: "Complete banking service forms through guided bank and service selection.",
      },
    ],
  }),
  component: () => (
    <AppShell>
      <FormAssistantPage />
    </AppShell>
  ),
});

function FormAssistantPage() {
  const { lang } = useTranslation();
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedForm, setSelectedForm] = useState<LocalFormTemplate | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<BankHubFormConfig | null>(null);
  const [loadedTemplate, setLoadedTemplate] = useState<LoadedTemplate | null>(null);
  const [loadError, setLoadError] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [pendingService, setPendingService] = useState("");
  const [fields, setFields] = useState<AssistantField[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<DocxAnswers>({});
  const [chat, setChat] = useState<ChatMessage[]>([{ id: "welcome", role: "assistant", text: "Select a bank to begin." }]);
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewRendering, setIsPreviewRendering] = useState(false);
  const [finalReady, setFinalReady] = useState(false);
  const [generatedDocx, setGeneratedDocx] = useState<Blob | null>(null);
  const [generationStatus, setGenerationStatus] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [missingRequiredFields, setMissingRequiredFields] = useState<string[]>([]);
  const previewShellRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const textFields = fields.filter((field) => field.type !== "image");
  const imageFields = fields.filter((field) => field.type === "image");
  const overlayMappings = selectedForm ? OVERLAY_MAPPINGS[selectedForm.id] || [] : [];
  const isOverlayForm = overlayMappings.length > 0;
  const activeField = textFields[currentIndex];
  const answeredTextCount = Object.keys(answers).filter((key) => textFields.some((field) => field.key === key)).length;
  const progress = textFields.length ? Math.round((answeredTextCount / textFields.length) * 100) : 0;

  useEffect(() => {
    if (!selectedForm) return;
    let cancelled = false;
    setLoadedTemplate(null);
    setLoadError("");
    setSelectedService("");
    setFields([]);
    setAnswers({});
    setGeneratedDocx(null);
    setPreviewError("");
    setMissingRequiredFields([]);
    setGenerationStatus("");
    setFinalReady(false);
    setCurrentIndex(0);
    if (previewRef.current) previewRef.current.innerHTML = "";
    setChat([{ id: "loading", role: "assistant", text: `Loading ${pendingService || selectedForm.title} securely in the background...` }]);

    loadDocxTemplate(selectedForm.templateUrl)
      .then((template) => {
        if (cancelled) return;
        setLoadedTemplate(template);
        if (pendingService) {
          beginServiceFlow(pendingService, template);
          setPendingService("");
        } else {
          setChat([{ id: "service-question", role: "assistant", text: "Choose a service to continue." }]);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Unable to load DOCX template.";
        console.error("[BankHub Form Assistant] Template load failed", error);
        setLoadError(message);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedForm]);

  useEffect(() => {
    if (!fields.length) return;
    const updatedFields = buildAssistantFields(fields.map((field) => field.key), lang);
    const updatedTextFields = updatedFields.filter((field) => field.type !== "image");
    const updatedActiveField = updatedTextFields[currentIndex];
    setFields(updatedFields);
    if (updatedActiveField) {
      setChat((current) => [
        ...current.filter((message) => !message.id.startsWith("language-question-")),
        { id: `language-question-${Date.now()}`, role: "assistant", text: updatedActiveField.question },
      ]);
    }
  }, [lang]);

  useEffect(() => {
    if (!selectedForm || !loadedTemplate) return;
    let cancelled = false;

    async function renderGeneratedDocx() {
      setIsPreviewRendering(true);
      setPreviewError("");
      setMissingRequiredFields([]);
      try {
        const missing = getMissingRequiredFields(selectedConfig, loadedTemplate, answers);
        if (missing.length) {
          if (previewRef.current) previewRef.current.innerHTML = "";
          setGeneratedDocx(null);
          setMissingRequiredFields(missing);
          return;
        }
        const requiredValidationError = getRequiredValidationError(selectedConfig, answers);
        if (requiredValidationError) {
          if (previewRef.current) previewRef.current.innerHTML = "";
          setGeneratedDocx(null);
          setPreviewError(requiredValidationError);
          return;
        }
        const blob = isOverlayForm
          ? new Blob([loadedTemplate.bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
          : await buildFilledDocx(selectedForm.templateUrl, answers, { blankUnanswered: true, requireRenderedBoxKeys: requiredBoxKeys(selectedConfig) });
        if (cancelled) return;
        setGeneratedDocx(blob);
        if (!previewRef.current) return;
        previewRef.current.innerHTML = "";
        await renderAsync(blob, previewRef.current, undefined, {
          breakPages: true,
          className: "bankhub-docx-preview",
          ignoreFonts: false,
          ignoreHeight: false,
          ignoreLastRenderedPageBreak: false,
          ignoreWidth: false,
          inWrapper: false,
          renderFooters: true,
          renderHeaders: true,
        });
        if (cancelled) return;
        console.info("[BankHub Form Assistant] Preview render success", { size: blob.size });
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Preview generation failed.";
        console.error("[BankHub Form Assistant] Preview generation failed", error);
        setPreviewError(message);
      } finally {
        if (!cancelled) setIsPreviewRendering(false);
      }
    }

    renderGeneratedDocx();

    return () => {
      cancelled = true;
    };
  }, [selectedForm, loadedTemplate, answers, isOverlayForm, selectedConfig]);

  const beginServiceFlow = (service: string, template: LoadedTemplate) => {
    const available = new Set(template.placeholders);
    const config = selectedForm ? getFormConfig(selectedForm.id) : undefined;
    const overlayKeys = selectedForm ? OVERLAY_FORM_FIELDS[selectedForm.id] || [] : [];
    const configKeys = buildConfigQuestionKeys(config, service, available);
    const selectedKeys = overlayKeys.length
      ? overlayKeys
      : configKeys.length
        ? configKeys
        : template.placeholders;
    const nextFields = buildAssistantFields(selectedKeys.length ? selectedKeys : template.placeholders, lang);
    const nextTextFields = nextFields.filter((field) => field.type !== "image");

    setSelectedService(service);
    setSelectedConfig(config || null);
    setFields(nextFields);
    setCurrentIndex(0);
    setFinalReady(false);
    setGenerationStatus("");
    setChat([
      { id: `service-user-${Date.now()}`, role: "user", text: service },
      {
        id: `service-assistant-${Date.now()}`,
        role: "assistant",
        text: nextTextFields[0]?.question || "This form only needs uploads. Please add the required files and review the preview.",
      },
    ]);
  };

  const startServiceFlow = (service: string, templateId: string) => {
    if (!templateId) {
      setLoadError(`${service} is coming soon for ICICI Bank.`);
      setChat((current) => [
        ...current,
        { id: `service-unavailable-${Date.now()}`, role: "assistant", text: `${service} is coming soon. Please choose Customer Details Updation Form for now.` },
      ]);
      return;
    }
    const form = LOCAL_FORM_TEMPLATES.find((item) => item.id === templateId);
    if (!form) {
      setLoadError("This service is not configured yet.");
      return;
    }
    setPendingService(service);
    setSelectedConfig(getFormConfig(form.id) || null);
    if (selectedForm?.id === form.id && loadedTemplate) {
      beginServiceFlow(service, loadedTemplate);
      setPendingService("");
      return;
    }
    setSelectedForm(form);
  };

  const answerPostCompletionQuestion = (question: string) => {
    const lower = question.toLowerCase();
    const mobileMatch = question.match(/\b[6-9]\d{9}\b/);
    if (lower.includes("mobile") && mobileMatch) {
      setAnswers((current) => ({ ...current, mobile_number_boxes: mobileMatch[0] }));
      return `Updated the mobile number to ${mobileMatch[0]}. The preview is regenerating now.`;
    }
    const accountUpdateMatch = question.match(/account(?:\s+number)?\s*(\d)\D+(\d{6,18})/i);
    if (accountUpdateMatch) {
      const row = accountUpdateMatch[1];
      const accountNumber = accountUpdateMatch[2];
      setAnswers((current) => ({ ...current, [`account_number_${row}_boxes`]: accountNumber }));
      return `Updated account number ${row} to ${accountNumber}. The preview is regenerating now.`;
    }
    const rightsMatch = question.match(/account\s*(\d).*(transaction rights|limited transaction rights).*\b(yes|no|y|n)\b/i);
    if (rightsMatch) {
      const row = rightsMatch[1];
      const key = rightsMatch[2].toLowerCase().startsWith("limited")
        ? `account_${row}_limited_transaction_rights`
        : `account_${row}_transaction_rights`;
      const value = /^(yes|y)$/i.test(rightsMatch[3]) ? "Y" : "N";
      setAnswers((current) => ({ ...current, [key]: value }));
      return `Updated ${rightsMatch[2]} for account ${row} to ${value}. The preview is regenerating now.`;
    }
    if (lower.includes("document") || lower.includes("required") || lower.includes("submit")) {
      return "For SBI Internet Banking registration, usually carry the completed form, passbook/account proof, PAN/Aadhaar or accepted KYC ID, and visit the home branch if branch verification is required. Please confirm the latest requirement with the branch before submission.";
    }
    if (lower.includes("signature")) {
      return "The signature should match the bank account records. If it looks misplaced, upload a clearer cropped signature image and the preview will update without resetting your filled form.";
    }
    if (lower.includes("correct") || lower.includes("change") || lower.includes("edit")) {
      return "You can edit any answer in the review fields on the right. The DOCX preview will regenerate automatically and your completed form will remain active.";
    }
    if (lower.includes("transaction") || lower.includes("rights")) {
      return "Transaction Rights usually allow online fund-transfer or transaction features. Limited Transaction Rights restrict what can be done online. Choose Yes only if you want that right enabled for this registration.";
    }
    return "I can help with banking doubts, form corrections, required documents, and submission guidance. Your completed form is still preserved on this screen, so you can keep asking without resetting it.";
  };

  const submitAnswer = (event: FormEvent) => {
    event.preventDefault();
    if (!activeField) {
      if (!finalReady || !input.trim()) return;
      const question = input.trim();
      setInput("");
      setValidationError("");
      setChat((current) => [
        ...current,
        { id: `post-user-${Date.now()}`, role: "user", text: question },
        { id: `post-assistant-${Date.now()}`, role: "assistant", text: answerPostCompletionQuestion(question) },
      ]);
      return;
    }
    const error = validateFieldValue(activeField.type, input, activeField.key);
    if (error) {
      setValidationError(error);
      return;
    }

    const clean = normalizeAnswer(activeField.type, input);
    const nextAnswers = { ...answers, [activeField.key]: clean };
    let nextAllFields = fields;
    const conditionalKeys = getConditionalInsertFields(
      selectedConfig || (selectedForm ? getFormConfig(selectedForm.id) : undefined),
      activeField.key,
      clean,
      new Set(loadedTemplate?.placeholders || []),
      new Set(fields.map((field) => field.key)),
    );
    if (conditionalKeys.length) {
      const jointFields = buildAssistantFields(conditionalKeys, lang);
      nextAllFields = [
        ...fields.slice(0, currentIndex + 1),
        ...jointFields,
        ...fields.slice(currentIndex + 1),
      ];
      setFields(nextAllFields);
    }
    const nextIndex = currentIndex + 1;
    const nextTextFields = nextAllFields.filter((field) => field.type !== "image");
    const nextField = nextTextFields[nextIndex];

    console.info("[BankHub Form Assistant] Answer captured", { key: activeField.key, value: clean });
    setAnswers(nextAnswers);
    setInput("");
    setValidationError("");
    setGenerationStatus("");
    setCurrentIndex(nextIndex);
    setChat((current) => [
      ...current,
      { id: `answer-${activeField.key}-${Date.now()}`, role: "user", text: clean },
      {
        id: `question-${nextField?.key || "final"}-${Date.now()}`,
        role: "assistant",
        text: nextField
          ? nextField.question
          : imageFields.length
            ? "Text fields are complete. Upload signature/photo if needed, then download the completed DOCX. You can still ask me banking or submission questions here."
            : "All questions are complete. Review the document preview and download the completed DOCX. You can still ask me banking or submission questions here.",
      },
    ]);
    if (!nextField) setFinalReady(true);
  };

  const editAnswer = (key: string, value: string) => {
    const field = fields.find((item) => item.key === key);
    const clean = field ? normalizeAnswer(field.type, value) : value;
    console.info("[BankHub Form Assistant] Answer edited", { key, value: clean });
    setAnswers((current) => ({ ...current, [key]: clean }));
  };

  const handleImageUpload = (field: AssistantField, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value: DocxImageValue = { name: file.name, dataUrl: String(reader.result || "") };
      console.info("[BankHub Form Assistant] Image upload captured", { key: field.key, fileName: file.name });
      setAnswers((current) => ({ ...current, [field.key]: value }));
      setChat((current) => [...current, { id: `upload-${field.key}-${Date.now()}`, role: "user", text: `${field.label} uploaded: ${file.name}` }]);
    };
    reader.readAsDataURL(file);
  };

  const downloadDocx = async () => {
    if (!selectedForm) return;
    const missing = getMissingRequiredFields(selectedConfig, loadedTemplate, answers);
    if (missing.length) {
      setMissingRequiredFields(missing);
      setGenerationStatus("");
      return;
    }
    const requiredValidationError = getRequiredValidationError(selectedConfig, answers);
    if (requiredValidationError) {
      setPreviewError(requiredValidationError);
      setGenerationStatus("");
      return;
    }
    setIsGenerating(true);
    setGenerationStatus("Generating filled DOCX...");
    try {
      const blob = generatedDocx || (await buildFilledDocx(selectedForm.templateUrl, answers, { blankUnanswered: true, requireRenderedBoxKeys: requiredBoxKeys(selectedConfig) }));
      const fileName = completedName(selectedForm);
      downloadBlob(blob, fileName);
      console.info("[BankHub Form Assistant] Download success", { fileName, size: blob.size });
      setGenerationStatus("DOCX downloaded successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "DOCX generation failed.";
      console.error("[BankHub Form Assistant] DOCX generation failed", error);
      setGenerationStatus(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPdf = async () => {
    if (!selectedForm || !previewRef.current) return;
    const missing = getMissingRequiredFields(selectedConfig, loadedTemplate, answers);
    if (missing.length) {
      setMissingRequiredFields(missing);
      setGenerationStatus("");
      return;
    }
    const requiredValidationError = getRequiredValidationError(selectedConfig, answers);
    if (requiredValidationError) {
      setPreviewError(requiredValidationError);
      setGenerationStatus("");
      return;
    }
    const pages = isOverlayForm && previewShellRef.current
      ? [previewShellRef.current]
      : Array.from(previewRef.current.querySelectorAll<HTMLElement>("section.bankhub-docx-preview"));
    if (!pages.length) {
      setGenerationStatus("PDF generation failed: preview is not ready yet.");
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("Generating PDF from rendered DOCX preview...");
    try {
      const firstCanvas = await html2canvas(pages[0], { backgroundColor: "#ffffff", scale: 2, useCORS: true });
      const pdf = new jsPDF({
        orientation: firstCanvas.width > firstCanvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [firstCanvas.width, firstCanvas.height],
      });

      const addCanvasPage = (canvas: HTMLCanvasElement, pageIndex: number) => {
        if (pageIndex > 0) {
          pdf.addPage([canvas.width, canvas.height], canvas.width > canvas.height ? "landscape" : "portrait");
        }
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
      };

      addCanvasPage(firstCanvas, 0);
      for (let index = 1; index < pages.length; index += 1) {
        const canvas = await html2canvas(pages[index], { backgroundColor: "#ffffff", scale: 2, useCORS: true });
        addCanvasPage(canvas, index);
      }

      const fileName = completedName(selectedForm).replace(/\.docx$/i, ".pdf");
      pdf.save(fileName);
      console.info("[BankHub Form Assistant] PDF download success", { fileName, pages: pages.length });
      setGenerationStatus("PDF downloaded successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "PDF generation failed.";
      console.error("[BankHub Form Assistant] PDF generation failed", error);
      setGenerationStatus(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetSession = () => {
    setSelectedBank("");
    setSelectedForm(null);
    setSelectedConfig(null);
    setLoadedTemplate(null);
    setPendingService("");
    setLoadError("");
    setSelectedService("");
    setFields([]);
    setAnswers({});
    setGeneratedDocx(null);
    setPreviewError("");
    setMissingRequiredFields([]);
    setGenerationStatus("");
    setCurrentIndex(0);
    setInput("");
    setValidationError("");
    setFinalReady(false);
    if (previewRef.current) previewRef.current.innerHTML = "";
    setChat([{ id: "welcome-reset", role: "assistant", text: "Select a bank to begin." }]);
  };

  return (
    <div className="min-h-screen bg-[#eef4fb] pb-28 text-slate-950">
      <div className="bg-gradient-to-br from-[#071b3a] via-[#0a2b57] to-[#102f5f] px-5 pb-20 pt-6 text-white">
        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-bold">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <div className="mt-8 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">BankHub Form Assistant</p>
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">AI-guided banking service forms</h1>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-blue-100">
            Select a bank, choose the service you need, and let BankHub load the correct form securely in the background.
          </p>
        </div>
      </div>

      <main className="-mt-12 grid gap-5 px-4 lg:grid-cols-[390px_1fr] lg:px-6">
        <section className="rounded-[28px] border border-white/80 bg-white p-4 shadow-2xl shadow-slate-300/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Select Bank</h2>
              <p className="text-xs font-semibold text-slate-500">Choose a bank, then select a service</p>
            </div>
            <button onClick={resetSession} className="rounded-full bg-slate-100 p-2 text-slate-600" aria-label="Reset form assistant">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-2">
            {BANK_FORM_GROUPS.map((bank) => (
              <button
                key={bank.bank}
                onClick={() => {
                  setSelectedBank(bank.bank);
                  setSelectedForm(null);
                  setSelectedConfig(null);
                  setLoadedTemplate(null);
                  setLoadError("");
                  setPendingService("");
                  setSelectedService("");
                  setFields([]);
                  setAnswers({});
                  setGeneratedDocx(null);
                  setMissingRequiredFields([]);
                  setFinalReady(false);
                  setCurrentIndex(0);
                  setChat([{ id: `bank-${Date.now()}`, role: "assistant", text: `You selected ${bank.bankName}. Choose the service you want to complete.` }]);
                  if (previewRef.current) previewRef.current.innerHTML = "";
                }}
                className={`rounded-2xl border p-4 text-left transition-all ${selectedBank === bank.bank ? "border-amber-400 bg-amber-50 shadow-lg" : "border-slate-200 bg-slate-50 hover:bg-white"}`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#071b3a] text-white">
                    <Landmark className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-black">{bank.bankName}</span>
                    <span className="mt-1 block text-xs font-semibold leading-relaxed text-slate-500">Banking forms and service requests</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

          {loadError && <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{loadError}</p>}

          {selectedBank && !selectedService && (
            <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-black">{selectedBank === "icici" ? "Available Forms" : "Choose Service"}</p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {BANK_FORM_GROUPS.find((bank) => bank.bank === selectedBank)?.forms.map((service) => (
                  <button key={service.label} onClick={() => startServiceFlow(service.label, service.templateId)} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-bold shadow-sm">
                    {service.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Progress</p>
              <p className="text-xs font-black text-slate-700">{progress}%</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-blue-700" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-amber-100 bg-amber-50 p-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-900">Form Pipeline</p>
            <div className="mt-3 grid gap-2">
              {FLOW_STEPS.map((step, index) => (
                <div key={step} className="flex items-center gap-2 text-xs font-black text-slate-700">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${pipelineStepActive(index, selectedBank, selectedForm, selectedConfig, fields.length, answers, generatedDocx) ? "bg-blue-950 text-amber-300" : "bg-white text-slate-400"}`}>
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(360px,0.9fr)_minmax(420px,1.1fr)]">
          <div className="rounded-[28px] border border-white/80 bg-white p-4 shadow-2xl shadow-slate-300/50">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-950 text-amber-300">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-black">AI Chat Assistant</h2>
                <p className="text-xs font-semibold text-slate-500">{selectedService || "Waiting for request selection"}</p>
              </div>
            </div>

            <div className="mt-4 h-[420px] overflow-y-auto rounded-3xl bg-slate-50 p-3">
              {chat.map((message) => (
                <div key={message.id} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm font-semibold leading-relaxed ${message.role === "user" ? "bg-blue-950 text-white" : "bg-white text-slate-800 shadow-sm"}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={submitAnswer} className="mt-4">
              <div className="rounded-3xl border border-slate-200 p-3">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  {activeField ? activeField.label : finalReady ? "Final review ready" : "Select service"}
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    disabled={!activeField && !finalReady}
                    placeholder={activeField?.question || (finalReady ? "Ask a banking, form, submission, or correction question" : "No active question")}
                    className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!activeField && !finalReady}
                    aria-label="Submit answer"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-blue-950 disabled:opacity-40"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                {validationError && <p className="mt-2 text-xs font-bold text-rose-600">{validationError}</p>}
              </div>
            </form>

            {imageFields.length > 0 && (
              <div className="mt-4 grid gap-2">
                {imageFields.map((field) => (
                  <label key={field.key} className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3">
                    <span>
                      <span className="block text-sm font-black">{field.label}</span>
                      <span className="block text-xs font-semibold text-slate-500">{answers[field.key] ? "Uploaded" : "Upload image"}</span>
                    </span>
                    <Upload className="h-5 w-5 text-blue-900" />
                    <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={(event) => handleImageUpload(field, event)} />
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white p-4 shadow-2xl shadow-slate-300/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">Official Form Preview</h2>
                <p className="text-xs font-semibold text-slate-500">Rendered from the original form with mapped answers overlaid</p>
              </div>
              <div className="flex gap-2">
                <button data-testid="download-docx" onClick={downloadDocx} disabled={!selectedForm || isGenerating || isPreviewRendering} className="inline-flex items-center gap-2 rounded-2xl bg-blue-950 px-3 py-2 text-xs font-black text-white disabled:opacity-40">
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  DOCX
                </button>
                <button data-testid="download-pdf" onClick={downloadPdf} disabled={!selectedForm || isGenerating || isPreviewRendering || !generatedDocx} className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-3 py-2 text-xs font-black text-blue-950 disabled:opacity-40">
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  PDF
                </button>
              </div>
            </div>

            {generationStatus && <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">{generationStatus}</div>}
            {missingRequiredFields.length > 0 && (
              <div className="mt-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                <p>The following required fields are missing:</p>
                <ul className="mt-2 list-disc pl-5">
                  {missingRequiredFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            )}
            {previewError && <div className="mt-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{previewError}</div>}
            {isOverlayForm && (
              <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900">
                Overlay mode active: the original bank form is preserved and values are placed on top using invisible mappings.
              </div>
            )}

            {fields.length > 0 && (
              <div className="mt-4 grid gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                {fields.filter((field) => field.type !== "image").map((field) => (
                  <label key={field.key} className="block">
                    <span className="text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">{field.label}</span>
                    <input
                      value={typeof answers[field.key] === "string" ? String(answers[field.key]) : ""}
                      onChange={(event) => editAnswer(field.key, event.target.value)}
                      className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500"
                    />
                  </label>
                ))}
              </div>
            )}

            <div className="mt-4 overflow-auto rounded-[24px] border border-slate-200 bg-slate-200/70 p-3 shadow-inner sm:p-6">
              {!loadedTemplate && (
                <div className="flex min-h-[620px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center text-sm font-bold text-slate-500">
                  Choose a bank and service to render the official form preview.
                </div>
              )}
              {loadedTemplate && (
                <div className="relative min-h-[620px]">
                  {isPreviewRendering && (
                    <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-blue-950 px-3 py-2 text-xs font-black text-white shadow-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Rendering DOCX
                    </div>
                  )}
                  <div ref={previewShellRef} className="bankhub-overlay-page relative mx-auto max-w-full bg-white">
                    <div ref={previewRef} className="bankhub-docx-render mx-auto max-w-full [&_.docx-wrapper]:!bg-transparent [&_.docx]:!m-0 [&_.docx]:!shadow-2xl" />
                    {isOverlayForm && <OverlayLayer mappings={overlayMappings} answers={answers} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function pipelineStepActive(
  index: number,
  selectedBank: string,
  selectedForm: LocalFormTemplate | null,
  selectedConfig: BankHubFormConfig | null,
  fieldCount: number,
  answers: DocxAnswers,
  generatedDocx: Blob | null,
) {
  if (index === 0) return Boolean(selectedBank);
  if (index === 1) return Boolean(selectedForm);
  if (index === 2) return Boolean(selectedConfig);
  if (index === 3) return fieldCount > 0;
  if (index === 4) return Object.keys(answers).length > 0;
  if (index === 5) return Boolean(generatedDocx);
  return Boolean(generatedDocx);
}

function getMissingRequiredFields(config: BankHubFormConfig | null, template: LoadedTemplate | null, answers: DocxAnswers) {
  if (!config?.requiredFields?.length) return [];
  const placeholders = new Set(template?.placeholders || []);
  return config.requiredFields.flatMap((key) => {
    const value = answers[key];
    const hasAnswer = typeof value === "string" ? value.trim().length > 0 : Boolean(value);
    if (!placeholders.has(key)) return [`${getFieldLabel(key)} (placeholder not found)`];
    if (!hasAnswer) return [getFieldLabel(key)];
    return [];
  });
}

function requiredBoxKeys(config: BankHubFormConfig | null) {
  return (config?.requiredFields || []).filter((key) => key.endsWith("_boxes"));
}

function getRequiredValidationError(config: BankHubFormConfig | null, answers: DocxAnswers) {
  if (!config?.requiredFields?.includes("account_number_boxes")) return "";
  const value = answers.account_number_boxes;
  if (typeof value !== "string" || !value.trim()) return "";
  return /^\d{9,18}$/.test(value.replace(/\s/g, ""))
    ? ""
    : "Account Number must contain digits only and be 9 to 18 digits long.";
}

function OverlayLayer({ mappings, answers }: { mappings: OverlayFieldMapping[]; answers: DocxAnswers }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 text-[10px] font-semibold text-black">
      {mappings.map((mapping) => (
        <OverlayField key={mapping.key} mapping={mapping} answers={answers} />
      ))}
    </div>
  );
}

function OverlayField({ mapping, answers }: { mapping: OverlayFieldMapping; answers: DocxAnswers }) {
  const raw = answers[mapping.key];
  const value = overlayValue(answers, mapping.key);
  const style = {
    left: `${mapping.x}%`,
    top: `${mapping.y}%`,
    width: `${mapping.width}%`,
    height: `${mapping.height}%`,
  };

  if (mapping.type === "signature" && raw && typeof raw === "object" && "dataUrl" in raw) {
    return (
      <div className="absolute flex items-center justify-center overflow-hidden" style={style}>
        <img src={raw.dataUrl} alt="" className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  if (!value) return null;

  if (mapping.type === "boxes") {
    const chars = value.replace(/\s+/g, "").split("").slice(0, mapping.boxes || value.length);
    return (
      <div className="absolute grid items-center" style={{ ...style, gridTemplateColumns: `repeat(${mapping.boxes || chars.length}, minmax(0, 1fr))` }}>
        {Array.from({ length: mapping.boxes || chars.length }).map((_, index) => (
          <span key={`${mapping.key}-${index}`} className="flex h-full items-center justify-center leading-none">
            {chars[index] || ""}
          </span>
        ))}
      </div>
    );
  }

  if (mapping.type === "checkbox") {
    const mark = /^(y|yes)$/i.test(value) ? "Y" : value.toUpperCase() === "N" ? "N" : value;
    return (
      <div className="absolute flex items-center justify-center leading-none" style={style}>
        {mark}
      </div>
    );
  }

  return (
    <div className="absolute flex items-center overflow-hidden whitespace-nowrap leading-none" style={style}>
      {value}
    </div>
  );
}

function completedName(form: LocalFormTemplate) {
  return `BankHub_${form.bankName}_${form.title.replace(/[^a-z0-9]+/gi, "_")}.docx`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
