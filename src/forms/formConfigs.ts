import { REQUEST_FIELD_MAP, type LocalBankId } from "./registry";

export type RendererMode = "docx-template" | "template-overlay";

export interface BankFormOption {
  label: string;
  templateId: string;
}

export interface BankFormGroup {
  bank: LocalBankId;
  bankName: string;
  forms: BankFormOption[];
}

export interface ConditionalFieldRule {
  field: string;
  when: string;
  equals: string;
  insertFields: string[];
}

export interface BankHubFormConfig {
  templateId: string;
  bank: LocalBankId;
  formName: string;
  renderer: RendererMode;
  questionKeys: string[];
  requiredFields?: string[];
  introKeys?: string[];
  excludeKeys?: string[];
  conditionalRules?: ConditionalFieldRule[];
}

export const ICICI_JOINT_FIELDS = [
  "joint_holder_name",
  "joint_mobile_number_boxes",
  "joint_pan_boxes",
  "joint_gender",
  "joint_occupation",
  "joint_marital_status",
  "joint_category",
  "joint_nationality",
  "joint_gross_annual_income",
  "joint_holder_photo",
  "joint_signature",
];

const ICICI_CUSTOMER_DETAILS_INTRO_KEYS = [
  "branch_name",
  "request_date",
  "primary_holder_name",
  "account_number_boxes",
];

export const BANK_FORM_GROUPS: BankFormGroup[] = [
  {
    bank: "sbi",
    bankName: "SBI",
    forms: [
      { label: "KYC Update", templateId: "sbi-customer-request" },
      { label: "Mobile Number Update", templateId: "sbi-customer-request" },
      { label: "Cheque Book Request", templateId: "sbi-customer-request" },
      { label: "Debit Card Request", templateId: "sbi-customer-request" },
      { label: "Nomination Update", templateId: "sbi-customer-request" },
      { label: "Internet Banking Registration", templateId: "sbi-internet-banking-registration" },
    ],
  },
  {
    bank: "icici",
    bankName: "ICICI Bank",
    forms: [
      { label: "Customer Details Updation Form", templateId: "icici-customer-details-updation" },
      { label: "Customer Request Form", templateId: "" },
      { label: "Debit Card Request Form", templateId: "" },
      { label: "Cheque Book Request Form", templateId: "" },
      { label: "Internet Banking Form", templateId: "" },
      { label: "Nomination Form", templateId: "" },
    ],
  },
];

export const FORM_CONFIGS: BankHubFormConfig[] = [
  {
    templateId: "sbi-customer-request",
    bank: "sbi",
    formName: "SBI Customer Request Services",
    renderer: "docx-template",
    questionKeys: [],
  },
  {
    templateId: "sbi-internet-banking-registration",
    bank: "sbi",
    formName: "SBI Internet Banking Registration",
    renderer: "template-overlay",
    questionKeys: REQUEST_FIELD_MAP["Internet Banking Registration"] || [],
  },
  {
    templateId: "icici-customer-details-updation",
    bank: "icici",
    formName: "ICICI Customer Details Updation Form",
    renderer: "docx-template",
    requiredFields: [
      "branch_name",
      "request_date",
      "primary_holder_name",
      "account_number_boxes",
      "primary_mobile_number_boxes",
    ],
    introKeys: ICICI_CUSTOMER_DETAILS_INTRO_KEYS,
    questionKeys: [
      ...ICICI_CUSTOMER_DETAILS_INTRO_KEYS,
      "has_joint_holder",
      ...((REQUEST_FIELD_MAP["Customer Details Updation Form"] || []).filter(
        (key) => !ICICI_CUSTOMER_DETAILS_INTRO_KEYS.includes(key) && !ICICI_JOINT_FIELDS.includes(key),
      )),
    ],
    excludeKeys: ICICI_JOINT_FIELDS,
    conditionalRules: [
      {
        field: "has_joint_holder",
        when: "has_joint_holder",
        equals: "Y",
        insertFields: ICICI_JOINT_FIELDS,
      },
    ],
  },
];

export function getFormConfig(templateId: string) {
  return FORM_CONFIGS.find((config) => config.templateId === templateId);
}

export function buildConfigQuestionKeys(config: BankHubFormConfig | undefined, service: string, availableKeys: Set<string>) {
  const requestedKeys = config?.questionKeys?.length ? config.questionKeys : REQUEST_FIELD_MAP[service] || [];
  return requestedKeys.filter((key) => availableKeys.has(key) || key === "signature" || key === "passport_photo" || key === "has_joint_holder");
}

export function getConditionalInsertFields(config: BankHubFormConfig | undefined, field: string, answer: string, availableKeys: Set<string>, existingKeys: Set<string>) {
  const rule = config?.conditionalRules?.find((item) => item.when === field && item.equals === answer);
  if (!rule) return [];
  return rule.insertFields.filter((key) => availableKeys.has(key) && !existingKeys.has(key));
}
