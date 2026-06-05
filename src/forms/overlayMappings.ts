import type { DocxAnswers } from "@/lib/docxLocal";

export type OverlayFieldType = "text" | "boxes" | "checkbox" | "signature";

export type OverlayFieldMapping = {
  key: string;
  type: OverlayFieldType;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  boxes?: number;
};

export const OVERLAY_FORM_FIELDS: Record<string, string[]> = {
  "sbi-internet-banking-registration": [
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
    "account_number_2_boxes",
    "account_2_single_joint",
    "account_2_transaction_rights",
    "account_2_limited_transaction_rights",
    "account_number_3_boxes",
    "account_3_single_joint",
    "account_3_transaction_rights",
    "account_3_limited_transaction_rights",
    "account_number_4_boxes",
    "account_4_single_joint",
    "account_4_transaction_rights",
    "account_4_limited_transaction_rights",
    "account_number_5_boxes",
    "account_5_single_joint",
    "account_5_transaction_rights",
    "account_5_limited_transaction_rights",
    "account_number_6_boxes",
    "account_6_single_joint",
    "account_6_transaction_rights",
    "account_6_limited_transaction_rights",
    "account_number_7_boxes",
    "account_7_single_joint",
    "account_7_transaction_rights",
    "account_7_limited_transaction_rights",
    "submission_date",
    "customer_signature",
  ],
};

export const OVERLAY_MAPPINGS: Record<string, OverlayFieldMapping[]> = {
  "sbi-internet-banking-registration": [
    { key: "customer_name_boxes", type: "boxes", page: 0, x: 10.8, y: 27.2, width: 79.4, height: 2.2, boxes: 25 },
    { key: "mobile_number_boxes", type: "boxes", page: 0, x: 35.7, y: 34.0, width: 36.1, height: 2.2, boxes: 10 },
    { key: "email_id", type: "text", page: 0, x: 22.4, y: 40.5, width: 56.0, height: 2.3 },
    { key: "dob_dd_boxes", type: "boxes", page: 0, x: 33.0, y: 47.7, width: 9.0, height: 3.3, boxes: 2 },
    { key: "dob_mm_boxes", type: "boxes", page: 0, x: 46.0, y: 47.7, width: 9.0, height: 3.3, boxes: 2 },
    { key: "dob_yy_boxes", type: "boxes", page: 0, x: 59.0, y: 47.7, width: 9.0, height: 3.3, boxes: 2 },
    ...Array.from({ length: 7 }, (_, index) => {
      const row = index + 1;
      const y = 61.9 + index * 2.55;
      return [
        { key: `account_number_${row}_boxes`, type: "boxes" as const, page: 0, x: 4.7, y, width: 42.9, height: 2.2, boxes: 13 },
        { key: `account_${row}_single_joint`, type: "text" as const, page: 0, x: 48.6, y, width: 15.2, height: 2.2 },
        { key: `account_${row}_transaction_rights`, type: "checkbox" as const, page: 0, x: 68.2, y, width: 5.0, height: 2.2 },
        { key: `account_${row}_limited_transaction_rights`, type: "checkbox" as const, page: 0, x: 84.6, y, width: 5.0, height: 2.2 },
      ];
    }).flat(),
    { key: "submission_date", type: "text", page: 0, x: 74.5, y: 93.6, width: 16.0, height: 2.2 },
    { key: "customer_signature", type: "signature", page: 0, x: 9.0, y: 90.4, width: 26.0, height: 5.4 },
  ],
};

export function overlayValue(answers: DocxAnswers, key: string) {
  const value = answers[key];
  return typeof value === "string" ? value : "";
}
