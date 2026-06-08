import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { renderAsync } from "docx-preview";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Bot, Download, FileCheck2, FileText, Landmark, Loader2, Send, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { buildFilledDocx, type DocxAnswers, type DocxImageValue } from "@/lib/docxLocal";
import { useTranslation } from "@/lib/i18n";

const sbiTemplateUrl = new URL("../../forms/sbi/ib_registration_original.docx", import.meta.url).href;
const iciciTemplateUrl = new URL("../../forms/icici/customer_details_updation_form.docx", import.meta.url).href;
const DOCUMENT_PAGE_WIDTH = 794;
const DOCUMENT_PAGE_HEIGHT = 1123;
const DOCUMENT_PAGE_PADDING = 24;

export const Route = createFileRoute("/premium/form-assistant")({
  head: () => ({
    meta: [
      { title: "BankHub Form Assistant" },
      { name: "description", content: "Fill bank forms with guided questions." },
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
  defaultValue?: () => string;
  uploadLabel?: string;
  optional?: boolean;
  accountRow?: number;
  choices?: Array<{ label: string; value: string }>;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type FormId = "sbi" | "icici";

type FormConfig = {
  id: FormId;
  bankName: string;
  cardTitle: string;
  cardSubtitle: string;
  pageTitle: string;
  pageDescription: string;
  metaDescription: string;
  templateUrl: string;
  docxFormType: "sbi-internet-banking" | "icici-customer-details";
  initialChatText: string;
  introText: string;
  completeText: string;
  templateErrorText: string;
  previewDescription: string;
  generateDocxName: string;
  generatePdfName: string;
  defaultDateKey?: string;
  questions: AssistantField[];
  requiredKeys: readonly string[];
  renderRequiredKeys: readonly string[];
  requiredFieldLabels: Record<string, string>;
  requiredQuestionIndex: Record<string, number>;
  fixedFieldMap: readonly (readonly [string, string])[];
  shouldShowPreview: (answers: DocxAnswers) => boolean;
  validateAnswer: (key: string, value: string) => string;
  normalizeAnswer: (field: AssistantField, value: string, answers: DocxAnswers) => DocxAnswers;
  findNextQuestionIndex: (answers: DocxAnswers, startIndex: number) => number;
  correctionQuestionIndex: (message: string) => number;
  assistantResponse: (message: string) => string;
  logRenderValidation: (answers: DocxAnswers, missing: readonly string[]) => void;
};

const SBI_QUESTIONS: AssistantField[] = [
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
    uploadLabel: "Upload Signature",
  },
];

const SBI_REQUIRED_KEYS = [
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

const SBI_FIXED_FIELD_MAP = [
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

const SBI_REQUIRED_FIELD_LABELS: Record<(typeof SBI_REQUIRED_KEYS)[number], string> = {
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

const SBI_REQUIRED_QUESTION_INDEX: Record<(typeof SBI_REQUIRED_KEYS)[number], number> = {
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
  customer_signature: SBI_QUESTIONS.length - 1,
};

const SBI_RENDER_REQUIRED_KEYS = ["email_id", "submission_date", "customer_signature"] as const;

const ICICI_QUESTIONS: AssistantField[] = [
  {
    key: "branch_name",
    label: "Branch Name",
    fieldType: "Text field",
    question: "What is your ICICI Branch Name?",
    kind: "text",
    placeholder: "Example: ICICI Hyderabad Branch",
  },
  {
    key: "request_date",
    label: "Request Date",
    fieldType: "Date field",
    question: "What is the request date?",
    kind: "date",
    placeholder: "DD/MM/YYYY",
    defaultValue: todayDate,
  },
  {
    key: "primary_holder_name",
    label: "Primary Account Holder Name",
    fieldType: "Text field",
    question: "What is the Primary Account Holder Name?",
    kind: "text",
    placeholder: "Example: Ravi Kumar",
  },
  {
    key: "account_number_boxes",
    label: "Account Number",
    fieldType: "Account number box field",
    question: "What is your ICICI Account Number?",
    kind: "text",
    placeholder: "Digits only",
  },
  {
    key: "primary_mobile_number_boxes",
    label: "Mobile Number",
    fieldType: "Mobile number box field",
    question: "What is the Primary Holder Mobile Number?",
    kind: "text",
    placeholder: "10 digits",
  },
  {
    key: "primary_pan_boxes",
    label: "PAN Number",
    fieldType: "PAN box field",
    question: "What is the Primary Holder PAN Number?",
    kind: "text",
    placeholder: "ABCDE1234F",
  },
  {
    key: "primary_gender",
    label: "Gender",
    fieldType: "Selection field",
    question: "Select the Primary Holder Gender.",
    kind: "choice",
    choices: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    key: "primary_occupation",
    label: "Occupation",
    fieldType: "Text field",
    question: "What is the Primary Holder Occupation?",
    kind: "text",
  },
  {
    key: "primary_marital_status",
    label: "Marital Status",
    fieldType: "Text field",
    question: "What is the Primary Holder Marital Status?",
    kind: "text",
  },
  {
    key: "primary_category",
    label: "Category",
    fieldType: "Text field",
    question: "What is the Primary Holder Category?",
    kind: "text",
  },
  {
    key: "primary_nationality",
    label: "Nationality",
    fieldType: "Text field",
    question: "What is the Primary Holder Nationality?",
    kind: "text",
  },
  {
    key: "primary_gross_annual_income",
    label: "Gross Annual Income",
    fieldType: "Text field",
    question: "What is the Primary Holder Gross Annual Income?",
    kind: "text",
  },
  {
    key: "house_building_name",
    label: "House / Building Name",
    fieldType: "Address text field",
    question: "What is the House / Building Name?",
    kind: "text",
  },
  {
    key: "street_name",
    label: "Street",
    fieldType: "Address text field",
    question: "What is the Street?",
    kind: "text",
  },
  {
    key: "locality",
    label: "Locality",
    fieldType: "Address text field",
    question: "What is the Locality?",
    kind: "text",
  },
  {
    key: "city",
    label: "City",
    fieldType: "Address text field",
    question: "What is the City?",
    kind: "text",
  },
  {
    key: "state",
    label: "State",
    fieldType: "Address text field",
    question: "What is the State?",
    kind: "text",
  },
  {
    key: "country",
    label: "Country",
    fieldType: "Address text field",
    question: "What is the Country?",
    kind: "text",
  },
  {
    key: "pin_code_boxes",
    label: "PIN Code",
    fieldType: "PIN code box field",
    question: "What is the PIN Code?",
    kind: "text",
    placeholder: "6 digits",
  },
  {
    key: "primary_holder_photo",
    label: "Photo",
    fieldType: "Photo image field",
    question: "Please upload the Primary Holder Photo.",
    kind: "image",
    uploadLabel: "Upload Photo",
  },
  {
    key: "primary_signature",
    label: "Signature",
    fieldType: "Signature image field",
    question: "Please upload the Primary Holder Signature.",
    kind: "image",
    uploadLabel: "Upload Signature",
  },
];

const ICICI_REQUIRED_KEYS = [
  "branch_name",
  "request_date",
  "primary_holder_name",
  "account_number_boxes",
  "primary_mobile_number_boxes",
  "primary_pan_boxes",
  "primary_gender",
  "primary_occupation",
  "primary_marital_status",
  "primary_category",
  "primary_nationality",
  "primary_gross_annual_income",
  "house_building_name",
  "street_name",
  "locality",
  "city",
  "state",
  "country",
  "pin_code_boxes",
  "primary_holder_photo",
  "primary_signature",
] as const;

const ICICI_REQUIRED_FIELD_LABELS: Record<(typeof ICICI_REQUIRED_KEYS)[number], string> = {
  branch_name: "Branch Name",
  request_date: "Request Date",
  primary_holder_name: "Primary Account Holder Name",
  account_number_boxes: "ICICI Account Number",
  primary_mobile_number_boxes: "Primary Holder Mobile Number",
  primary_pan_boxes: "Primary Holder PAN Number",
  primary_gender: "Gender",
  primary_occupation: "Occupation",
  primary_marital_status: "Marital Status",
  primary_category: "Category",
  primary_nationality: "Nationality",
  primary_gross_annual_income: "Gross Annual Income",
  house_building_name: "House / Building Name",
  street_name: "Street",
  locality: "Locality",
  city: "City",
  state: "State",
  country: "Country",
  pin_code_boxes: "PIN Code",
  primary_holder_photo: "Photo",
  primary_signature: "Signature",
};

const ICICI_REQUIRED_QUESTION_INDEX: Record<(typeof ICICI_REQUIRED_KEYS)[number], number> = Object.fromEntries(
  ICICI_REQUIRED_KEYS.map((key) => [key, ICICI_QUESTIONS.findIndex((question) => question.key === key)]),
) as Record<(typeof ICICI_REQUIRED_KEYS)[number], number>;

const ICICI_RENDER_REQUIRED_KEYS = ["request_date", "primary_holder_photo", "primary_signature"] as const;

const ICICI_FIXED_FIELD_MAP = [
  ["Branch Name", "branch_name"],
  ["Request Date", "request_date"],
  ["Primary Holder Name", "primary_holder_name"],
  ["Account Number", "account_number_boxes"],
  ["Mobile Number", "primary_mobile_number_boxes"],
  ["PAN Number", "primary_pan_boxes"],
  ["Gender", "primary_gender"],
  ["Occupation", "primary_occupation"],
  ["Marital Status", "primary_marital_status"],
  ["Category", "primary_category"],
  ["Nationality", "primary_nationality"],
  ["Gross Annual Income", "primary_gross_annual_income"],
  ["House / Building Name", "house_building_name"],
  ["Street", "street_name"],
  ["Locality", "locality"],
  ["City", "city"],
  ["State", "state"],
  ["Country", "country"],
  ["PIN Code", "pin_code_boxes"],
  ["Photo", "primary_holder_photo"],
  ["Signature", "primary_signature"],
] as const;

const FORM_CONFIGS: Record<FormId, FormConfig> = {
  sbi: {
    id: "sbi",
    bankName: "SBI",
    cardTitle: "SBI",
    cardSubtitle: "Internet Banking Registration Form",
    pageTitle: "SBI Internet Banking Registration",
    pageDescription: "Answer a few questions to automatically fill your SBI form.",
    metaDescription: "Fill the SBI Internet Banking Registration form with guided questions.",
    templateUrl: sbiTemplateUrl,
    docxFormType: "sbi-internet-banking",
    initialChatText: "Select SBI to start the Internet Banking Registration Form.",
    introText: "Welcome. I will help you complete your SBI Internet Banking Registration Form.",
    completeText: "All SBI form details are captured. Review the form and click Generate Form.",
    templateErrorText: "The SBI form could not be loaded. Please try again.",
    previewDescription: "Review the filled SBI form before downloading.",
    generateDocxName: "sbi_internet_banking_registration_filled.docx",
    generatePdfName: "SBI_Internet_Banking_Registration.pdf",
    defaultDateKey: "submission_date",
    questions: SBI_QUESTIONS,
    requiredKeys: SBI_REQUIRED_KEYS,
    renderRequiredKeys: SBI_RENDER_REQUIRED_KEYS,
    requiredFieldLabels: SBI_REQUIRED_FIELD_LABELS,
    requiredQuestionIndex: SBI_REQUIRED_QUESTION_INDEX,
    fixedFieldMap: SBI_FIXED_FIELD_MAP,
    shouldShowPreview: shouldShowSbiPreview,
    validateAnswer: validateSbiAnswer,
    normalizeAnswer: normalizeSbiAnswer,
    findNextQuestionIndex: findNextSbiQuestionIndex,
    correctionQuestionIndex: sbiCorrectionQuestionIndex,
    assistantResponse: sbiAssistantResponse,
    logRenderValidation: logSbiRenderValidation,
  },
  icici: {
    id: "icici",
    bankName: "ICICI",
    cardTitle: "ICICI Bank",
    cardSubtitle: "Customer Details Updation Form",
    pageTitle: "ICICI Customer Details Updation Form",
    pageDescription: "Answer one question at a time to fill your ICICI form.",
    metaDescription: "Fill the ICICI Customer Details Updation Form with guided questions.",
    templateUrl: iciciTemplateUrl,
    docxFormType: "icici-customer-details",
    initialChatText: "Select ICICI Bank to start the Customer Details Updation Form.",
    introText: "Welcome. I will help you complete your ICICI Customer Details Updation Form.",
    completeText: "All ICICI form details are captured. Review the form and click Generate Form.",
    templateErrorText: "The ICICI form could not be loaded. Please try again.",
    previewDescription: "Review the filled ICICI form before downloading.",
    generateDocxName: "icici_customer_details_updation_filled.docx",
    generatePdfName: "ICICI_Customer_Details_Updation_Form.pdf",
    defaultDateKey: "request_date",
    questions: ICICI_QUESTIONS,
    requiredKeys: ICICI_REQUIRED_KEYS,
    renderRequiredKeys: ICICI_RENDER_REQUIRED_KEYS,
    requiredFieldLabels: ICICI_REQUIRED_FIELD_LABELS,
    requiredQuestionIndex: ICICI_REQUIRED_QUESTION_INDEX,
    fixedFieldMap: ICICI_FIXED_FIELD_MAP,
    shouldShowPreview: shouldShowIciciPreview,
    validateAnswer: validateIciciAnswer,
    normalizeAnswer: normalizeIciciAnswer,
    findNextQuestionIndex: findNextLinearQuestionIndex,
    correctionQuestionIndex: iciciCorrectionQuestionIndex,
    assistantResponse: iciciAssistantResponse,
    logRenderValidation: logIciciRenderValidation,
  },
};

function SimpleSbiFormAssistant() {
  const [selectedFormId, setSelectedFormId] = useState<FormId>("sbi");
  const [bankSelected, setBankSelected] = useState(false);
  const [templateReady, setTemplateReady] = useState(false);
  const [templateError, setTemplateError] = useState("");
  const [answers, setAnswers] = useState<DocxAnswers>(() => initialAnswers("sbi"));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: FORM_CONFIGS.sbi.initialChatText },
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
  const { t, lang } = useTranslation();

  const selectedForm = FORM_CONFIGS[selectedFormId];
  const activeField = selectedForm.questions[currentIndex];
  const progress = Math.min(100, Math.round((Math.min(currentIndex, selectedForm.questions.length) / selectedForm.questions.length) * 100));
  const missingFields = useMemo(() => selectedForm.requiredKeys.filter((key) => !answers[key]), [answers, selectedForm]);
  const isComplete = missingFields.length === 0;
  const shouldShowPreview = selectedForm.shouldShowPreview(answers);
  const formBaseKey = `formAssistant.forms.${selectedForm.id}`;
  const translateForm = useCallback((suffix: string, fallback: string, values?: Record<string, string | number>) => {
    const key = `${formBaseKey}.${suffix}`;
    const value = t(key, values);
    return value === key ? fallback : value;
  }, [formBaseKey, t]);
  const translateGlobal = useCallback((key: string, fallback: string, values?: Record<string, string | number>) => {
    const value = t(key, values);
    return value === key ? fallback : value;
  }, [t]);
  const fieldText = useCallback((field: AssistantField, suffix: "label" | "question" | "placeholder" | "uploadLabel") => {
    const key = `${formBaseKey}.fields.${field.key}.${suffix}`;
    const fallback = suffix === "uploadLabel"
      ? field.uploadLabel || field.label
      : String(field[suffix] || "");
    const value = t(key, field.accountRow ? { row: field.accountRow } : undefined);
    return value === key ? fallback : value;
  }, [formBaseKey, t]);
  const choiceText = useCallback((choice: { label: string; value: string }) => {
    const key = `formAssistant.choices.${choice.label.toLowerCase()}`;
    const value = t(key);
    return value === key ? choice.label : value;
  }, [t]);

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

    fetch(selectedForm.templateUrl, { method: "HEAD" })
      .then((response) => {
        if (cancelled) return;
        if (!response.ok) throw new Error(`Template request failed: ${response.status}`);
        setTemplateReady(true);
        setStatus("");
        setChat([
          { id: "intro", role: "assistant", text: translateForm("introText", selectedForm.introText) },
          { id: "q-0", role: "assistant", text: fieldText(selectedForm.questions[0], "question") },
        ]);
        console.info("[BankHub Form Assistant] Template available. Fixed mapping active.", {
          form: selectedForm.id,
          fields: selectedForm.fixedFieldMap.map(([, key]) => key),
        });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[BankHub Form Assistant] Template load failed", error);
        setTemplateError(`${selectedForm.bankName} template could not be loaded.`);
        setStatus("");
      });

    return () => {
      cancelled = true;
    };
  }, [bankSelected, selectedForm, fieldText, translateForm]);

  useEffect(() => {
    if (!bankSelected) {
      setChat([{ id: "welcome", role: "assistant", text: translateForm("initialChatText", selectedForm.initialChatText) }]);
      return;
    }
    if (!templateReady) return;
    setChat((messages) => messages.map((message) => {
      if (message.id === "intro") return { ...message, text: translateForm("introText", selectedForm.introText) };
      if (message.id.startsWith("done-")) return { ...message, text: translateForm("completeText", selectedForm.completeText) };
      const questionMatch = message.id.match(/^q-(\d+)/);
      if (questionMatch) {
        const field = selectedForm.questions[Number(questionMatch[1])];
        if (field) return { ...message, text: fieldText(field, "question") };
      }
      return message;
    }));
  }, [bankSelected, fieldText, lang, selectedForm, templateReady, translateForm]);

  useEffect(() => {
    if (!templateReady || !shouldShowPreview || !previewRef.current) return;
    let cancelled = false;
    setIsRenderingPreview(true);
    setPreviewError("");

    buildFilledDocx(selectedForm.templateUrl, answers, { blankUnanswered: true, formType: selectedForm.docxFormType })
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
        console.info("[BankHub Form Assistant] Live preview render success", { form: selectedForm.id, size: docx.size });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[BankHub Form Assistant] Live preview render failed", error);
        const message = getErrorDetails(error);
        if (message.includes("Signature image could not be loaded.")) {
          setPreviewError(translateGlobal("formAssistant.errors.signatureImageLoad", "Signature image could not be loaded."));
        } else if (message.includes("Photo image could not be loaded.")) {
          setPreviewError(translateGlobal("formAssistant.errors.photoImageLoad", "Photo image could not be loaded."));
        } else {
          setPreviewError(translateGlobal("formAssistant.errors.previewFailed", "Live preview could not be rendered. DOCX/PDF generation may still work."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsRenderingPreview(false);
      });

    return () => {
      cancelled = true;
    };
  }, [answers, fitPreviewToPage, selectedForm, templateReady, shouldShowPreview]);

  function startForm(formId: FormId) {
    const form = FORM_CONFIGS[formId];
    setSelectedFormId(formId);
    setAnswers(initialAnswers(formId));
    setCurrentIndex(0);
    setInput("");
    setValidationError("");
    setDocumentError("");
    setGeneratedDocx(null);
    setTemplateReady(false);
    setTemplateError("");
    setPdfDiagnostics([]);
    setPreviewError("");
    setStatus("");
    const initialChatKey = `formAssistant.forms.${form.id}.initialChatText`;
    const initialChatText = t(initialChatKey);
    setChat([{ id: "welcome", role: "assistant", text: initialChatText === initialChatKey ? form.initialChatText : initialChatText }]);
    setBankSelected(true);
  }

  function askNext(nextAnswers: DocxAnswers, nextIndex: number) {
    setGeneratedDocx(null);
    setDocumentError("");
    if (returnToAssistantAfterAnswer) {
      setReturnToAssistantAfterAnswer(false);
      setCurrentIndex(selectedForm.questions.length);
      setInput("");
      setStatus("Correction saved. Regenerate the document to include the update.");
      setChat((messages) => [
        ...messages,
        { id: `updated-${Date.now()}`, role: "assistant", text: translateGlobal("formAssistant.status.updatedCorrection", "Updated. You can regenerate the document, ask another banking question, or request another correction.") },
      ]);
      console.info("[BankHub Form Assistant] Correction saved", { form: selectedForm.id, nextAnswers });
      return;
    }
    const resolvedNextIndex = selectedForm.findNextQuestionIndex(nextAnswers, nextIndex);
    setCurrentIndex(resolvedNextIndex);
    setInput("");
    if (resolvedNextIndex < selectedForm.questions.length) {
      setChat((messages) => [
        ...messages,
        { id: `q-${resolvedNextIndex}-${Date.now()}`, role: "assistant", text: fieldText(selectedForm.questions[resolvedNextIndex], "question") },
      ]);
      return;
    }
    setStatus(translateGlobal("formAssistant.status.answersCaptured", "Answers captured. Review the summary and generate the document."));
    setChat((messages) => [
      ...messages,
      { id: `done-${Date.now()}`, role: "assistant", text: translateForm("completeText", selectedForm.completeText) },
    ]);
    console.info("[BankHub Form Assistant] All answers captured", { form: selectedForm.id, nextAnswers });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!activeField) {
      handleAssistantMessage();
      return;
    }
    if (!activeField || activeField.kind === "image") return;
    const rawValue = input.trim();
    const resolvedValue = rawValue || activeField.defaultValue?.() || "";
    const validation = selectedForm.validateAnswer(activeField.key, resolvedValue);
    if (validation) {
      setValidationError(localizeValidationMessage(validation, translateGlobal));
      return;
    }

    const nextAnswers = selectedForm.normalizeAnswer(activeField, resolvedValue, answers);
    setAnswers(nextAnswers);
    setValidationError("");
    setChat((messages) => [...messages, { id: `a-${Date.now()}`, role: "user", text: resolvedValue }]);
    console.info("[BankHub Form Assistant] Answer stored", { form: selectedForm.id, field: activeField.key, value: resolvedValue });
    askNext(nextAnswers, currentIndex + 1);
  }

  function handleAssistantMessage() {
    const message = input.trim();
    if (!message) return;
    setInput("");
    setChat((messages) => [...messages, { id: `assistant-user-${Date.now()}`, role: "user", text: message }]);

    const lower = message.toLowerCase();
    const correctionIndex = selectedForm.correctionQuestionIndex(lower);
    if (correctionIndex >= 0) {
      setReturnToAssistantAfterAnswer(true);
      setGeneratedDocx(null);
      setCurrentIndex(correctionIndex);
      setChat((messages) => [
        ...messages,
        { id: `correction-${Date.now()}`, role: "assistant", text: fieldText(selectedForm.questions[correctionIndex], "question") },
      ]);
      return;
    }

    const response = localizedFormAssistantResponse(selectedForm.id, lower, translateGlobal) || selectedForm.assistantResponse(lower);
    setChat((messages) => [...messages, { id: `banking-help-${Date.now()}`, role: "assistant", text: response }]);
  }

  function handleChoice(field: AssistantField, value: string, label: string) {
    const nextAnswers = { ...answers, [field.key]: value };
    setAnswers(nextAnswers);
    setValidationError("");
    setChat((messages) => [...messages, { id: `choice-${field.key}-${Date.now()}`, role: "user", text: label }]);
    console.info("[BankHub Form Assistant] Choice stored", { form: selectedForm.id, field: field.key, value });
    askNext(nextAnswers, currentIndex + 1);
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !activeField || activeField.kind !== "image") return;

    const signatureFile = activeField.key.toLowerCase().includes("signature") ? file : null;
    const photoFile = activeField.key.toLowerCase().includes("photo") ? file : null;
    if (signatureFile) console.log("Uploaded signature:", signatureFile);
    if (photoFile) console.log("Uploaded photo:", photoFile);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const dataUrl = await fileToDataUrl(file);
      const image: DocxImageValue = { name: file.name, dataUrl, mimeType: file.type, bytes };
      const nextAnswers = { ...answers, [activeField.key]: image };
      setAnswers(nextAnswers);
      setValidationError("");
      setChat((messages) => [...messages, { id: `img-${Date.now()}`, role: "user", text: translateGlobal("formAssistant.status.imageUploaded", "{field} uploaded.", { field: fieldText(activeField, "label") }) }]);
      console.info("[BankHub Form Assistant] Image stored", {
        form: selectedForm.id,
        field: activeField.key,
        file: file.name,
        size: file.size,
        arrayBuffer: arrayBuffer.byteLength,
        uint8Array: bytes.length,
      });
      askNext(nextAnswers, currentIndex + 1);
    } catch (error) {
      const message = activeField.key.toLowerCase().includes("signature")
        ? translateGlobal("formAssistant.errors.signatureImageLoad", "Signature image could not be loaded.")
        : translateGlobal("formAssistant.errors.photoImageLoad", "Photo image could not be loaded.");
      console.error("[BankHub Form Assistant] Uploaded image load failed", { form: selectedForm.id, field: activeField.key, file: file.name, error });
      setValidationError(message);
    }
  }

  function askMissingFieldAgain(key: string) {
    const questionIndex = selectedForm.requiredQuestionIndex[key] ?? selectedForm.questions.findIndex((question) => question.key === key);
    const label = selectedForm.requiredFieldLabels[key] || "This field";
    if (questionIndex < 0) {
      setValidationError(translateGlobal("formAssistant.errors.requiredBeforeGenerate", "{field} is required. Please answer this question before generating the document.", { field: label }));
      return;
    }
    setGeneratedDocx(null);
    setCurrentIndex(questionIndex);
    setInput("");
    setValidationError(translateGlobal("formAssistant.errors.requiredBeforeGenerate", "{field} is required. Please answer this question before generating the document.", { field: label }));
    setChat((messages) => [
      ...messages,
      { id: `missing-${key}-${Date.now()}`, role: "assistant", text: fieldText(selectedForm.questions[questionIndex], "question") },
    ]);
    console.warn("[BankHub Form Assistant] Required fixed field missing", { form: selectedForm.id, field: key, label });
  }

  async function generateDocument() {
    const defaultDateKey = selectedForm.defaultDateKey;
    const generationAnswers = defaultDateKey && !textAnswer(answers[defaultDateKey])
      ? { ...answers, [defaultDateKey]: todayDate() }
      : answers;
    if (generationAnswers !== answers) setAnswers(generationAnswers);

    const missing = getMissingRequiredKeys(selectedForm, generationAnswers);
    if (missing.length > 0) {
      askMissingFieldAgain(missing[0]);
      return null;
    }
    const renderMissing = getRenderMissingKeys(selectedForm, generationAnswers);
    selectedForm.logRenderValidation(generationAnswers, renderMissing);
    if (renderMissing.length > 0) {
      const missingKey = renderMissing[0];
      if (selectedForm.requiredQuestionIndex[missingKey] !== undefined) {
        askMissingFieldAgain(missingKey);
      } else {
        setDocumentError(translateGlobal("formAssistant.errors.requiredBeforeGenerate", "{field} is required. Please answer this question before generating the document.", { field: selectedForm.requiredFieldLabels[missingKey] || translateGlobal("formAssistant.labels.requiredField", "A required field") }));
      }
      return null;
    }
    logImageValuesBeforeRender(selectedForm, generationAnswers);
    setIsGeneratingDocx(true);
    setDocumentError("");
    setStatus(translateGlobal("formAssistant.status.generatingDocx", "Generating populated DOCX..."));
    try {
      const docx = await buildFilledDocx(selectedForm.templateUrl, generationAnswers, { blankUnanswered: true, formType: selectedForm.docxFormType });
      setGeneratedDocx(docx);
      setStatus(translateGlobal("formAssistant.status.documentReady", "Document Ready"));
      console.info("[BankHub Form Assistant] Generated DOCX", { form: selectedForm.id, size: docx.size });
      return docx;
    } catch (error) {
      console.error("[BankHub Form Assistant] DOCX generation failed", error);
      const message = getErrorDetails(error);
      if (message.includes("Signature image could not be loaded.")) {
        setDocumentError(translateGlobal("formAssistant.errors.signatureImageLoad", "Signature image could not be loaded."));
      } else if (message.includes("Photo image could not be loaded.")) {
        setDocumentError(translateGlobal("formAssistant.errors.photoImageLoad", "Photo image could not be loaded."));
      } else {
        setDocumentError(translateGlobal("formAssistant.errors.docxGenerationFailed", "DOCX generation failed. Please check the local {bank} template and try again.", { bank: selectedForm.bankName }));
      }
      return null;
    } finally {
      setIsGeneratingDocx(false);
    }
  }

  async function downloadDocx() {
    const docx = generatedDocx || await generateDocument();
    if (!docx) return;
    downloadBlob(docx, selectedForm.generateDocxName);
    setStatus(translateGlobal("formAssistant.status.docxDownloaded", "DOCX downloaded."));
    console.info("[BankHub Form Assistant] DOCX download success", { form: selectedForm.id, size: docx.size });
  }

  async function downloadPdf() {
    if (!isComplete) {
      setValidationError(translateGlobal("formAssistant.errors.completeBeforePdf", "Please complete all required questions before downloading PDF."));
      return;
    }
    const docx = generatedDocx || await generateDocument();
    if (!docx) return;

    setIsGeneratingPdf(true);
    setDocumentError("");
    setPdfDiagnostics([]);
    setStatus(translateGlobal("formAssistant.status.generatingPdf", "Generating PDF..."));
    const diagnostics = [
      `Template Loaded = ${templateReady ? "YES" : "NO"}`,
      `Form Populated = ${docx ? "YES" : "NO"}`,
      `PDF Library Loaded = ${html2canvas && jsPDF ? "YES" : "NO"}`,
      "PDF Render Success = NO",
    ];
    setPdfDiagnostics(diagnostics);
    console.info("[BankHub Form Assistant] PDF Conversion Started", { form: selectedForm.id, diagnostics });
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
      let sourcePageTarget: HTMLElement | null = null;
      const previewSearch = findPdfPageTarget(previewRef.current);
      const visiblePreviewPage = previewSearch.target;
      console.info("[BankHub Form Assistant] PDF Target:", visiblePreviewPage, {
        expectedSelectors: PDF_TARGET_SELECTORS,
        previewSearchDetails: previewSearch.details,
      });

      if (visiblePreviewPage) {
        const previewClone = visiblePreviewPage.cloneNode(true) as HTMLElement;
        applyPdfSafeStyles(visiblePreviewPage, previewClone);
        logUnsupportedColorNodes(visiblePreviewPage);
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
        sourcePageTarget = visiblePreviewPage;
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
        const fallbackSearch = findPdfPageTarget(container);
        pageTarget = fallbackSearch.target;
        if (pageTarget) {
          applyPdfSafeStyles(pageTarget, pageTarget);
          logUnsupportedColorNodes(pageTarget);
          sourcePageTarget = pageTarget;
        }
        console.info("[BankHub Form Assistant] PDF fallback target:", pageTarget, {
          expectedSelectors: PDF_TARGET_SELECTORS,
          fallbackSearchDetails: fallbackSearch.details,
        });
      }

      if (!pageTarget) {
        const actualDom = summarizeDomStructure(container);
        console.error("[BankHub Form Assistant] PDF target lookup failed", {
          expectedSelectors: PDF_TARGET_SELECTORS,
          previewDom: summarizeDomStructure(previewRef.current),
          fallbackDom: actualDom,
        });
        throw new Error(`Unable to locate the fixed form page for PDF rendering. Expected selectors: ${PDF_TARGET_SELECTORS.join(", ")}. Actual DOM: ${actualDom}`);
      }

      const pageDescription = describeElement(pageTarget);
      diagnostics.push(`PDF Target Element = ${pageDescription}`);
      setPdfDiagnostics([...diagnostics]);
      console.info("[BankHub Form Assistant] Element selected for PDF", {
        element: pageTarget,
        description: pageDescription,
      });

      const pdfClone = pageTarget.cloneNode(true) as HTMLElement;
      const pdfCloneHost = document.createElement("div");
      pdfCloneHost.style.position = "fixed";
      pdfCloneHost.style.left = "-10000px";
      pdfCloneHost.style.top = "0";
      pdfCloneHost.style.width = `${DOCUMENT_PAGE_WIDTH}px`;
      pdfCloneHost.style.height = `${DOCUMENT_PAGE_HEIGHT}px`;
      pdfCloneHost.style.overflow = "hidden";
      pdfCloneHost.style.background = "#ffffff";
      pdfCloneHost.style.pointerEvents = "none";
      pdfCloneHost.style.zIndex = "-1";
      pdfCloneHost.setAttribute("data-bankhub-pdf-clone-host", "true");
      container.appendChild(pdfCloneHost);

      if (sourcePageTarget) {
        applyPdfSafeStyles(sourcePageTarget, pdfClone);
      }
      enforcePdfSafeOverrides(pdfClone);
      pdfCloneHost.appendChild(pdfClone);

      const globalOffenders = scanDocumentForUnsupportedColors(document);
      if (globalOffenders.length) {
        console.info("[BankHub Form Assistant] Document-wide OKLCH offenders", globalOffenders);
      }

      if ("fonts" in document) {
        await document.fonts.ready;
      }
      await waitForNextFrame();
      await waitForNextFrame();
      const liveOffenders = collectUnsupportedColorNodes(pdfClone);
      if (liveOffenders.length) {
        console.info("[BankHub Form Assistant] PDF clone OKLCH offenders", liveOffenders);
      }

      diagnostics.push("html2canvas start = YES");
      setPdfDiagnostics([...diagnostics]);
      console.info("[BankHub Form Assistant] html2canvas start", {
        target: pageDescription,
        clone: describeElement(pdfClone),
        width: DOCUMENT_PAGE_WIDTH,
        height: DOCUMENT_PAGE_HEIGHT,
      });
      const canvas = await html2canvas(pdfClone, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        width: DOCUMENT_PAGE_WIDTH,
        height: DOCUMENT_PAGE_HEIGHT,
        windowWidth: DOCUMENT_PAGE_WIDTH,
        windowHeight: DOCUMENT_PAGE_HEIGHT,
        onclone: (clonedDocument) => {
          const clonedHost = clonedDocument.querySelector<HTMLElement>('[data-bankhub-pdf-clone-host="true"]');
          const clonedTarget = clonedHost?.firstElementChild instanceof HTMLElement
            ? clonedHost.firstElementChild
            : findPdfPageTarget(clonedDocument.body).target;
          if (!clonedTarget) {
            console.error("[BankHub Form Assistant] html2canvas clone target missing", summarizeDomStructure(clonedDocument.body));
            return;
          }

          forcePdfSafeDocument(clonedDocument, clonedTarget);
          const cloneOffenders = collectUnsupportedColorNodes(clonedTarget);
          if (cloneOffenders.length) {
            console.info("[BankHub Form Assistant] Clone OKLCH offenders", cloneOffenders);
          }
        },
      });
      diagnostics.push("html2canvas success = YES");
      setPdfDiagnostics([...diagnostics]);
      console.info("[BankHub Form Assistant] html2canvas success", {
        width: canvas.width,
        height: canvas.height,
      });

      diagnostics.push("jsPDF start = YES");
      setPdfDiagnostics([...diagnostics]);
      console.info("[BankHub Form Assistant] jsPDF start");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [DOCUMENT_PAGE_WIDTH, DOCUMENT_PAGE_HEIGHT],
        compress: true,
      });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, DOCUMENT_PAGE_WIDTH, DOCUMENT_PAGE_HEIGHT);
      const pdfBlob = pdf.output("blob");
      diagnostics.push("jsPDF success = YES");
      setPdfDiagnostics([...diagnostics]);
      console.info("[BankHub Form Assistant] jsPDF success", {
        blobSize: pdfBlob.size,
      });
      downloadBlob(pdfBlob, selectedForm.generatePdfName);
      const successDiagnostics = diagnostics.map((line) => line === "PDF Render Success = NO" ? "PDF Render Success = YES" : line);
      setPdfDiagnostics(successDiagnostics);
      setStatus(translateGlobal("formAssistant.status.pdfDownloaded", "PDF downloaded as a single page."));
      console.info("[BankHub Form Assistant] PDF Conversion Success", successDiagnostics, { form: selectedForm.id, width: canvas.width, height: canvas.height });
      console.info("[BankHub Form Assistant] PDF download success", { form: selectedForm.id, pages: 1, width: canvas.width, height: canvas.height });
    } catch (error) {
      const errorDetails = getErrorDetails(error);
      const failureDiagnostics = [
        ...diagnostics,
        `Actual Error Message = ${errorDetails}`,
      ];
      setPdfDiagnostics(failureDiagnostics);
      console.error("[BankHub Form Assistant] PDF Conversion Failure", failureDiagnostics, error);
      console.error("[BankHub Form Assistant] PDF download failed", error);
      setDocumentError(translateGlobal("formAssistant.errors.pdfGenerationFailed", "PDF generation failed: {error}", { error: errorDetails }));
    } finally {
      container.remove();
      setIsGeneratingPdf(false);
    }
  }

  function resetFlow() {
    setSelectedFormId("sbi");
    setBankSelected(false);
    setTemplateReady(false);
    setTemplateError("");
    setAnswers(initialAnswers("sbi"));
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
    setPdfDiagnostics([]);
    setChat([{ id: "welcome", role: "assistant", text: translateGlobal("formAssistant.forms.sbi.initialChatText", FORM_CONFIGS.sbi.initialChatText) }]);
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
            {translateGlobal("back", "Back")}
          </Link>
          <button
            type="button"
            onClick={resetFlow}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
          >
            {translateGlobal("formAssistant.actions.reset", "Reset")}
          </button>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">{translateGlobal("formAssistant.title", "BankHub Form Assistant")}</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{translateForm("pageTitle", selectedForm.pageTitle)}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {translateForm("pageDescription", selectedForm.pageDescription)}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>{translateGlobal("formAssistant.labels.progress", "Progress")}</span>
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
              onClick={() => startForm("sbi")}
              className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Landmark className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-black text-slate-950">{translateGlobal("formAssistant.forms.sbi.cardTitle", FORM_CONFIGS.sbi.cardTitle)}</h2>
              <p className="mt-1 text-sm text-slate-600">{translateGlobal("formAssistant.forms.sbi.cardSubtitle", FORM_CONFIGS.sbi.cardSubtitle)}</p>
            </button>
            <button
              type="button"
              onClick={() => startForm("icici")}
              className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Landmark className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-black text-slate-950">{translateGlobal("formAssistant.forms.icici.cardTitle", FORM_CONFIGS.icici.cardTitle)}</h2>
              <p className="mt-1 text-sm text-slate-600">{translateGlobal("formAssistant.forms.icici.cardSubtitle", FORM_CONFIGS.icici.cardSubtitle)}</p>
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
                    <h2 className="text-base font-black text-slate-950">{translateGlobal("formAssistant.aiTitle", "AI Assistant")}</h2>
                    <p className="text-sm text-slate-500">{translateGlobal("formAssistant.aiSubtitle", "Answer one question at a time.")}</p>
                  </div>
                </div>

                {templateError ? <InlineNotice tone="error" text={translateForm("templateErrorText", selectedForm.templateErrorText)} /> : null}
                {validationError ? <InlineNotice tone="error" text={validationError} /> : null}

                <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                  {chat.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[92%] rounded-3xl px-4 py-3 text-sm leading-6 ${message.role === "assistant" ? "bg-slate-100 text-slate-800" : "ml-auto bg-sky-600 text-white"}`}
                    >
                      <span className="mb-1 block text-[11px] font-black uppercase tracking-[0.12em] opacity-60">
                        {message.role === "assistant" ? translateGlobal("formAssistant.labels.ai", "AI") : translateGlobal("formAssistant.labels.you", "You")}
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
                      {fieldText(activeField, "uploadLabel")}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  ) : activeField.kind === "choice" ? (
                    <div className="grid grid-cols-2 gap-2">
                      {activeField.choices?.map((choice) => (
                        <button
                          key={choice.value}
                          type="button"
                          onClick={() => handleChoice(activeField, choice.value, choiceText(choice))}
                          className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800 transition hover:bg-sky-100"
                        >
                          {choiceText(choice)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                        ref={textInputRef}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder={fieldText(activeField, "placeholder") || translateGlobal("formAssistant.placeholders.answer", "Type your answer...")}
                        className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      />
                      <button
                        type="submit"
                        aria-label={translateGlobal("formAssistant.actions.sendAnswer", "Send answer")}
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
                      placeholder={translateGlobal("formAssistant.placeholders.answer", "Type your answer...")}
                      className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    />
                    <button
                      type="submit"
                      aria-label={translateGlobal("formAssistant.actions.sendAssistantMessage", "Send assistant message")}
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
                    <h2 className="text-base font-black text-slate-950">{translateGlobal("formAssistant.preview.title", "Form Preview")}</h2>
                    <p className="mt-1 text-sm text-slate-500">{translateForm("previewDescription", selectedForm.previewDescription)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setPreviewZoom((zoom) => Math.max(0.5, Number((zoom - 0.1).toFixed(2))))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">{translateGlobal("formAssistant.preview.zoomOut", "Zoom Out")}</button>
                    <button type="button" onClick={() => setPreviewZoom((zoom) => Math.min(1.6, Number((zoom + 0.1).toFixed(2))))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">{translateGlobal("formAssistant.preview.zoomIn", "Zoom In")}</button>
                    <button type="button" onClick={() => { setPreviewFitMode("page"); setPreviewZoom(0.58); }} className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800">{translateGlobal("formAssistant.preview.fitPage", "Fit to Page")}</button>
                  </div>
                </div>
                {previewError ? <InlineNotice tone="error" text={previewError} /> : null}
                {isRenderingPreview ? <p className="mt-3 text-sm font-semibold text-sky-700">{translateGlobal("formAssistant.preview.updating", "Updating preview...")}</p> : null}
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
                    {translateGlobal("formAssistant.actions.generateForm", "Generate Form")}
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
                      {translateGlobal("formAssistant.actions.downloadDocx", "Download DOCX")}
                    </button>
                    <button
                      type="button"
                      onClick={downloadPdf}
                      disabled={isGeneratingDocx || isGeneratingPdf}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                      {translateGlobal("formAssistant.actions.downloadPdf", "Download PDF")}
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

  let pages = Array.from(root.querySelectorAll<HTMLElement>(".docx-wrapper section, .docx"));
  if (!pages.length && root.childNodes.length) {
    const page = document.createElement("div");
    const content = document.createElement("div");
    page.className = "bankhub-fixed-page";
    content.setAttribute("data-bankhub-direct-docx-content", "true");
    while (root.firstChild) {
      content.appendChild(root.firstChild);
    }
    page.appendChild(content);
    root.appendChild(page);
    pages = [page];
  }
  pages.forEach((page) => {
    page.classList.add("bankhub-fixed-page");
    page.setAttribute("data-bankhub-pdf-page", "form-page");
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
    fitDirectDocxContent(page);
  });
}

function fitDirectDocxContent(page: HTMLElement) {
  const content = page.querySelector<HTMLElement>('[data-bankhub-direct-docx-content="true"]');
  if (!content) return;
  content.style.transform = "none";
  content.style.transformOrigin = "top left";
  content.style.width = `${DOCUMENT_PAGE_WIDTH}px`;
  content.style.minWidth = `${DOCUMENT_PAGE_WIDTH}px`;

  window.requestAnimationFrame(() => {
    const scale = Math.min(
      1,
      DOCUMENT_PAGE_WIDTH / Math.max(content.scrollWidth, 1),
      DOCUMENT_PAGE_HEIGHT / Math.max(content.scrollHeight, 1),
    );
    content.style.width = `${DOCUMENT_PAGE_WIDTH / scale}px`;
    content.style.transform = `scale(${scale})`;
  });
}

const PDF_TARGET_SELECTORS = [
  '[data-bankhub-pdf-page="form-page"]',
  '[data-bankhub-pdf-page="sbi-form-page"]',
  ".bankhub-fixed-page",
  ".docx-wrapper section",
  ".docx-wrapper > section",
  ".docx",
];

function findPdfPageTarget(root: ParentNode | null | undefined) {
  if (!root) {
    return {
      target: null as HTMLElement | null,
      details: "root unavailable",
    };
  }

  for (const selector of PDF_TARGET_SELECTORS) {
    const target = root.querySelector<HTMLElement>(selector);
    if (target) {
      return {
        target,
        details: `matched ${selector}`,
      };
    }
  }

  const firstElement = root.querySelector<HTMLElement>("section, .docx-wrapper, .docx, div");
  if (firstElement) {
    return {
      target: firstElement,
      details: `fallback first element ${describeElement(firstElement)}`,
    };
  }

  return {
    target: null as HTMLElement | null,
    details: "no matching element found",
  };
}

function summarizeDomStructure(root: ParentNode | null | undefined) {
  if (!root) return "root unavailable";
  const elements = Array.from(root.querySelectorAll<HTMLElement>("section, div, article")).slice(0, 12);
  if (!elements.length) return "no candidate elements";
  return elements.map(describeElement).join(" | ");
}

function describeElement(element: HTMLElement) {
  const id = element.id ? `#${element.id}` : "";
  const className = typeof element.className === "string" && element.className.trim()
    ? `.${element.className.trim().split(/\s+/).join(".")}`
    : "";
  const marker = element.getAttribute("data-bankhub-pdf-page");
  const dataAttr = marker ? `[data-bankhub-pdf-page="${marker}"]` : "";
  return `${element.tagName.toLowerCase()}${id}${className}${dataAttr}`;
}

function applyPdfSafeStyles(sourceRoot: HTMLElement, targetRoot: HTMLElement) {
  const sourceNodes = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll<HTMLElement>("*"))];
  const targetNodes = [targetRoot, ...Array.from(targetRoot.querySelectorAll<HTMLElement>("*"))];

  for (let index = 0; index < Math.min(sourceNodes.length, targetNodes.length); index += 1) {
    const sourceNode = sourceNodes[index];
    const targetNode = targetNodes[index];
    const computed = getComputedStyle(sourceNode);
    targetNode.removeAttribute("class");

    for (let styleIndex = 0; styleIndex < computed.length; styleIndex += 1) {
      const property = computed.item(styleIndex);
      if (!property) continue;
      const value = computed.getPropertyValue(property);
      if (!value) continue;

      let safeValue = value;
      if (hasUnsupportedCssColorFunction(value)) {
        safeValue = convertCssColorFunctions(value, property);
      }

      targetNode.style.setProperty(property, safeValue, computed.getPropertyPriority(property));
    }

    targetNode.style.setProperty("color-scheme", "light");
    targetNode.style.setProperty("background-color", safeCssColorValue(computed.backgroundColor, "background-color", "#ffffff"));
    targetNode.style.setProperty("border-color", safeCssColorValue(computed.borderColor, "border-color", "#d1d5db"));
  }
}

function convertCssColorFunctions(value: string, property: string) {
  if (property === "background-image" || property === "mask-image" || property === "filter" || property === "backdrop-filter") {
    return "none";
  }

  const fallback = fallbackCssColor(property);
  const converted = value.replace(/(?:oklch|color-mix)\([^()]+\)/g, (match) => normalizeCssColor(match, fallback));
  return hasUnsupportedCssColorFunction(converted) ? fallback : converted;
}

function hasUnsupportedCssColorFunction(value: string) {
  return /(?:oklch|color-mix)\(/.test(value);
}

function safeCssColorValue(value: string, property: string, fallback: string) {
  if (!value) return fallback;
  if (hasUnsupportedCssColorFunction(value)) {
    return convertCssColorFunctions(value, property);
  }
  return value;
}

function fallbackCssColor(property: string) {
  const normalizedProperty = property.toLowerCase();
  if (normalizedProperty.includes("shadow") || normalizedProperty === "background-image" || normalizedProperty === "mask-image") {
    return "none";
  }
  if (normalizedProperty.includes("background")) return "transparent";
  if (normalizedProperty.includes("border") || normalizedProperty.includes("outline") || normalizedProperty.includes("rule")) {
    return "#d1d5db";
  }
  return "#000000";
}

function normalizeCssColor(colorValue: string, fallback = "#000000") {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  if (!context) return fallback;

  try {
    context.fillStyle = fallback;
    context.fillStyle = colorValue.trim();
    const normalized = context.fillStyle;
    return typeof normalized === "string" && normalized && !hasUnsupportedCssColorFunction(normalized) ? normalized : fallback;
  } catch {
    return fallback;
  }
}

function logUnsupportedColorNodes(root: HTMLElement) {
  const matches = collectUnsupportedColorNodes(root);
  if (matches.length) {
    console.info("[BankHub Form Assistant] OKLCH computed style matches", matches);
  }
}

function collectUnsupportedColorNodes(root: HTMLElement) {
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  return nodes.flatMap((node) => {
    const computed = getComputedStyle(node);
    const offenders: Array<{ property: string; value: string }> = [];

    for (let styleIndex = 0; styleIndex < computed.length; styleIndex += 1) {
      const property = computed.item(styleIndex);
      if (!property) continue;
      const value = computed.getPropertyValue(property);
      if (value && hasUnsupportedCssColorFunction(value)) {
        offenders.push({ property, value });
      }
    }

    if (!offenders.length) return [];

    return [{
      tag: node.tagName.toLowerCase(),
      className: node.className,
      id: node.id,
      offenders,
    }];
  });
}

function scanDocumentForUnsupportedColors(doc: Document) {
  const nodes = Array.from(doc.querySelectorAll<HTMLElement>("*"));
  const propertiesToCheck = [
    "backgroundColor",
    "color",
    "borderColor",
    "outlineColor",
    "boxShadow",
  ] as const;

  return nodes.flatMap((node) => {
    const computed = getComputedStyle(node);
    const offenders = propertiesToCheck.flatMap((property) => {
      const value = computed[property];
      if (typeof value === "string" && hasUnsupportedCssColorFunction(value)) {
        return [{ property, value }];
      }
      return [];
    });

    if (!offenders.length) return [];

    return [{
      tag: node.tagName.toLowerCase(),
      className: node.className,
      id: node.id,
      offenders,
    }];
  });
}

function forcePdfSafeDocument(clonedDocument: Document, clonedTarget: HTMLElement) {
  const resetStyle = clonedDocument.createElement("style");
  resetStyle.textContent = `
    html, body {
      background: #ffffff !important;
      color: #000000 !important;
    }
    * {
      color-scheme: light !important;
      box-shadow: none !important;
      text-shadow: none !important;
      caret-color: #000000 !important;
      outline-color: #d1d5db !important;
    }
  `;
  clonedDocument.head.appendChild(resetStyle);

  const nodes = [clonedTarget, ...Array.from(clonedTarget.querySelectorAll<HTMLElement>("*"))];
  nodes.forEach((node) => {
    const computed = clonedDocument.defaultView?.getComputedStyle(node);
    if (!computed) return;

    for (let styleIndex = 0; styleIndex < computed.length; styleIndex += 1) {
      const property = computed.item(styleIndex);
      if (!property) continue;
      const value = computed.getPropertyValue(property);
      if (!value) continue;

      let safeValue = value;
      if (hasUnsupportedCssColorFunction(value)) {
        safeValue = convertCssColorFunctions(value, property);
      }
      if (property === "background-image" || property === "mask-image" || property === "filter" || property === "backdrop-filter") {
        safeValue = "none";
      }
      node.style.setProperty(property, safeValue, "important");
    }

    if (node !== clonedTarget) {
      node.style.setProperty("background-color", safeCssColorValue(computed.backgroundColor, "background-color", "transparent"), "important");
    } else {
      node.style.setProperty("background-color", "#ffffff", "important");
    }
    node.style.setProperty("color", safeCssColorValue(computed.color, "color", "#000000"), "important");
    node.style.setProperty("border-color", safeCssColorValue(computed.borderColor, "border-color", "#d1d5db"), "important");
    node.style.setProperty("outline-color", safeCssColorValue(computed.outlineColor, "outline-color", "#d1d5db"), "important");
  });
}

function enforcePdfSafeOverrides(root: HTMLElement) {
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  nodes.forEach((node, index) => {
    if (index === 0) {
      node.style.setProperty("background-color", "#ffffff", "important");
    }
    node.style.setProperty("color-scheme", "light", "important");
    node.style.setProperty("box-shadow", "none", "important");
    node.style.setProperty("text-shadow", "none", "important");
    node.style.setProperty("filter", "none", "important");
    node.style.setProperty("backdrop-filter", "none", "important");
    node.style.setProperty("outline-color", "#d1d5db", "important");
    node.style.setProperty("border-color", "#d1d5db", "important");
    if (!node.style.backgroundColor || hasUnsupportedCssColorFunction(node.style.backgroundColor)) {
      node.style.setProperty("background-color", index === 0 ? "#ffffff" : "transparent", "important");
    }
    if (!node.style.color || hasUnsupportedCssColorFunction(node.style.color)) {
      node.style.setProperty("color", "#000000", "important");
    }
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

function validateSbiAnswer(key: string, value: string) {
  if (!value) return "This answer is required.";
  if (key === "branch_name" && value.length < 2) return "Please enter a valid SBI branch name.";
  if (key === "customer_name_boxes" && !/^[A-Za-z ]{2,}$/.test(value)) return "Customer name must contain alphabets and spaces only.";
  if (key === "mobile_number_boxes" && !/^\d{10}$/.test(value)) return "Mobile number must be exactly 10 digits.";
  if (key === "email_id" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
  if (key === "date_of_birth" && !parseDob(value)) return "Please enter DOB in DD/MM/YYYY format, for example 20/08/2005.";
  if (/^account_number_\d+_boxes$/.test(key) && value.toLowerCase() !== "skip" && !/^\d{9,18}$/.test(value)) return "Account number must contain 9 to 18 digits only, or type Skip for optional account rows.";
  return "";
}

function validateIciciAnswer(key: string, value: string) {
  if (!value) return "This answer is required.";
  if (key === "branch_name" && value.length < 2) return "Please enter a valid ICICI branch name.";
  if (key === "request_date" && !parseDate(value)) return "Please enter the request date in DD/MM/YYYY format.";
  if (key === "primary_holder_name" && !/^[A-Za-z .'-]{2,}$/.test(value)) return "Primary holder name must contain alphabets and spaces only.";
  if (key === "account_number_boxes" && !/^\d+$/.test(value)) return "Account number must contain digits only.";
  if (key === "primary_mobile_number_boxes" && !/^\d{10}$/.test(value)) return "Mobile number must be exactly 10 digits.";
  if (key === "primary_pan_boxes" && !/^[A-Z]{5}\d{4}[A-Z]$/.test(value.toUpperCase())) return "PAN number must be in ABCDE1234F format.";
  if (key === "pin_code_boxes" && !/^\d{6}$/.test(value)) return "PIN Code must be exactly 6 digits.";
  return "";
}

function normalizeSbiAnswer(field: AssistantField, value: string, answers: DocxAnswers): DocxAnswers {
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

function normalizeIciciAnswer(field: AssistantField, value: string, answers: DocxAnswers): DocxAnswers {
  const key = field.key;
  if (key === "primary_pan_boxes") return { ...answers, [key]: value.toUpperCase() };
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

function findNextSbiQuestionIndex(answers: DocxAnswers, startIndex: number) {
  let index = startIndex;
  while (index < SBI_QUESTIONS.length) {
    const field = SBI_QUESTIONS[index];
    if (!field.accountRow || field.key.startsWith("account_number_")) return index;
    if (answers[`account_number_${field.accountRow}_boxes`]) return index;
    index += 1;
  }
  return index;
}

function findNextLinearQuestionIndex(_answers: DocxAnswers, startIndex: number) {
  return startIndex;
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

function parseDate(value: string) {
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

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Image file could not be read."));
    reader.readAsDataURL(file);
  });
}

function initialAnswers(formId: FormId): DocxAnswers {
  return formId === "icici" ? { request_date: todayDate() } : { submission_date: todayDate() };
}

function shouldShowSbiPreview(answers: DocxAnswers) {
  return Boolean(
    answers.branch_name
      && answers.customer_name_boxes
      && answers.mobile_number_boxes
      && answers.email_id
      && answers.dob
      && answers.account_number_1_boxes,
  );
}

function shouldShowIciciPreview(answers: DocxAnswers) {
  return Boolean(answers.branch_name || answers.primary_holder_name || answers.account_number_boxes || answers.primary_mobile_number_boxes);
}

function getMissingRequiredKeys(config: FormConfig, answers: DocxAnswers) {
  return config.requiredKeys.filter((key) => !answers[key]);
}

function getRenderMissingKeys(config: FormConfig, answers: DocxAnswers) {
  return config.renderRequiredKeys.filter((key) => !answers[key]);
}

function logSbiRenderValidation(answers: DocxAnswers, missing: readonly string[]) {
  console.info("[BankHub Form Assistant] SBI render validation", {
    email_id: textAnswer(answers.email_id) || "MISSING",
    submission_date: textAnswer(answers.submission_date) || "MISSING",
    customer_signature: answers.customer_signature ? "uploaded" : "MISSING",
    "Render Status": missing.length ? "FAILED" : "SUCCESS",
  });
}

function logIciciRenderValidation(answers: DocxAnswers, missing: readonly string[]) {
  console.info("[BankHub Form Assistant] ICICI render validation", {
    request_date: textAnswer(answers.request_date) || "MISSING",
    primary_holder_photo: answers.primary_holder_photo ? "uploaded" : "MISSING",
    primary_signature: answers.primary_signature ? "uploaded" : "MISSING",
    "Render Status": missing.length ? "FAILED" : "SUCCESS",
  });
}

function sbiCorrectionQuestionIndex(message: string) {
  const accountMatch = message.match(/account(?:\s+number)?\s+([1-7])/);
  if (accountMatch) {
    const key = `account_number_${accountMatch[1]}_boxes`;
    return SBI_QUESTIONS.findIndex((question) => question.key === key);
  }
  if (message.includes("branch")) return 0;
  if (message.includes("name")) return 1;
  if (message.includes("mobile") || message.includes("phone")) return 2;
  if (message.includes("email")) return 3;
  if (message.includes("dob") || message.includes("birth")) return 4;
  if (message.includes("signature")) return SBI_QUESTIONS.findIndex((question) => question.key === "customer_signature");
  if (message.includes("single") || message.includes("joint")) return SBI_QUESTIONS.findIndex((question) => question.key === "account_1_single_joint");
  if (message.includes("transaction right")) return SBI_QUESTIONS.findIndex((question) => question.key === "account_1_transaction_rights");
  if (message.includes("limited")) return SBI_QUESTIONS.findIndex((question) => question.key === "account_1_limited_transaction_rights");
  return -1;
}

function iciciCorrectionQuestionIndex(message: string) {
  const entries: Array<[string[], string]> = [
    [["branch"], "branch_name"],
    [["date"], "request_date"],
    [["name", "holder"], "primary_holder_name"],
    [["account"], "account_number_boxes"],
    [["mobile", "phone"], "primary_mobile_number_boxes"],
    [["pan"], "primary_pan_boxes"],
    [["gender"], "primary_gender"],
    [["occupation"], "primary_occupation"],
    [["marital"], "primary_marital_status"],
    [["category"], "primary_category"],
    [["nationality"], "primary_nationality"],
    [["income"], "primary_gross_annual_income"],
    [["house", "building"], "house_building_name"],
    [["street"], "street_name"],
    [["locality"], "locality"],
    [["city"], "city"],
    [["state"], "state"],
    [["country"], "country"],
    [["pin"], "pin_code_boxes"],
    [["photo"], "primary_holder_photo"],
    [["signature"], "primary_signature"],
  ];
  const match = entries.find(([terms]) => terms.some((term) => message.includes(term)));
  return match ? ICICI_QUESTIONS.findIndex((question) => question.key === match[1]) : -1;
}

function sbiAssistantResponse(message: string) {
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

function iciciAssistantResponse(message: string) {
  if (message.includes("submit") || message.includes("submission")) {
    return "Submit the generated ICICI Customer Details Updation Form at your ICICI branch with the required supporting documents.";
  }
  if (message.includes("document") || message.includes("required") || message.includes("attach")) {
    return "Carry the filled form with identity proof, PAN copy if applicable, address proof for communication address updates, photo, and signature as requested by the branch.";
  }
  if (message.includes("download") || message.includes("pdf") || message.includes("docx")) {
    return "Use Generate Form first, then Download DOCX or Download PDF. If you changed any answer, regenerate before downloading.";
  }
  return "I can help with ICICI form doubts, submission guidance, required documents, or corrections. For example, type 'change PAN number' or 'update mobile number'.";
}

function localizedFormAssistantResponse(
  formId: FormId,
  message: string,
  translateText: (key: string, fallback: string, values?: Record<string, string | number>) => string,
) {
  const baseKey = `formAssistant.forms.${formId}.help`;
  if (message.includes("submit") || message.includes("submission")) {
    return translateText(`${baseKey}.submission`, "");
  }
  if (message.includes("document") || message.includes("required") || message.includes("attach")) {
    return translateText(`${baseKey}.documents`, "");
  }
  if (message.includes("download") || message.includes("pdf") || message.includes("docx")) {
    return translateText(`${baseKey}.download`, "");
  }
  return translateText(`${baseKey}.fallback`, "");
}

function textAnswer(value: DocxAnswers[string]) {
  return typeof value === "string" ? value : "";
}

function localizeValidationMessage(
  message: string,
  translateText: (key: string, fallback: string, values?: Record<string, string | number>) => string,
) {
  const entries: Array<[string, string]> = [
    ["This answer is required.", "formAssistant.errors.answerRequired"],
    ["Please enter a valid SBI branch name.", "formAssistant.errors.validSbiBranch"],
    ["Customer name must contain alphabets and spaces only.", "formAssistant.errors.customerNameAlpha"],
    ["Mobile number must be exactly 10 digits.", "formAssistant.errors.mobile10"],
    ["Please enter a valid email address.", "formAssistant.errors.validEmail"],
    ["Please enter DOB in DD/MM/YYYY format, for example 20/08/2005.", "formAssistant.errors.dobFormat"],
    ["Account number must contain 9 to 18 digits only, or type Skip for optional account rows.", "formAssistant.errors.sbiAccountDigits"],
    ["Please enter a valid ICICI branch name.", "formAssistant.errors.validIciciBranch"],
    ["Please enter the request date in DD/MM/YYYY format.", "formAssistant.errors.requestDateFormat"],
    ["Primary holder name must contain alphabets and spaces only.", "formAssistant.errors.primaryNameAlpha"],
    ["Account number must contain digits only.", "formAssistant.errors.accountDigits"],
    ["PAN number must be in ABCDE1234F format.", "formAssistant.errors.panFormat"],
    ["PIN Code must be exactly 6 digits.", "formAssistant.errors.pin6"],
  ];
  const match = entries.find(([source]) => source === message);
  return match ? translateText(match[1], message) : message;
}

function logImageValuesBeforeRender(config: FormConfig, answers: DocxAnswers) {
  const signatureField = config.questions.find((question) => question.kind === "image" && question.key.toLowerCase().includes("signature"));
  const photoField = config.questions.find((question) => question.kind === "image" && question.key.toLowerCase().includes("photo"));
  const signatureValue = signatureField ? answers[signatureField.key] : undefined;
  const photoValue = photoField ? answers[photoField.key] : undefined;

  console.log("Signature passed to renderer:", signatureValue);
  if (photoField) console.log("Photo passed to renderer:", photoValue);
  console.info("[BankHub Form Assistant] Image field IDs verified", {
    form: config.id,
    signatureField: signatureField?.key || "missing",
    photoField: photoField?.key || "not-applicable",
    signatureState: Boolean(signatureValue),
    photoState: photoField ? Boolean(photoValue) : "not-applicable",
  });
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
