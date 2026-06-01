export type FieldType = 'text' | 'boxed' | 'date_boxed' | 'checkbox' | 'table' | 'signature';

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  pageIndex: number;
  
  // Coordinates for the starting point
  x: number;
  y: number;

  required?: boolean;

  // Type: 'text'
  maxLength?: number;
  
  // Type: 'boxed'
  boxWidth?: number; // Distance between each box
  boxCount?: number; // Total number of boxes available
  
  // Type: 'date_boxed'
  // Expects 8 boxes (DD MM YYYY). Coordinates mapping could be grouped, but a standard boxWidth + standard gap is better
  dateGap?: number; // Gap between DD, MM, and YYYY clusters

  // Type: 'checkbox'
  // Renders a simple 'X' or '✓' at the x, y coordinate.

  // Type: 'table'
  columns?: string[];
  rowHeight?: number;
  maxRows?: number;

  // Type: 'signature'
  width?: number; // width of signature box
  height?: number; // height of signature box
}

export interface FormTemplate {
  id: string;
  bankId: string;
  name: string;
  description: string;
  pdfAssetUrl: string; // The URL to the blank PDF in /public/forms/
  fields: FormFieldDefinition[];
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "sbi_internet_banking",
    bankId: "sbi",
    name: "Internet Banking Registration",
    description: "Official form for SBI Internet Banking activation.",
    pdfAssetUrl: "/forms/sbi_internet_banking.pdf",
    fields: [
      {
        id: "applicant_name",
        label: "Applicant Name",
        type: "boxed",
        pageIndex: 0,
        x: 153,
        y: 699,
        boxWidth: 20,
        boxCount: 20,
        required: true
      },
      {
        id: "mobile_number",
        label: "Mobile Number",
        type: "boxed",
        pageIndex: 0,
        x: 153,
        y: 649,
        boxWidth: 20,
        boxCount: 10,
        required: true
      },
      {
        id: "email",
        label: "E-Mail Address",
        type: "text",
        pageIndex: 0,
        x: 150,
        y: 597,
        maxLength: 50
      },
      {
        id: "dob",
        label: "Date of Birth",
        type: "date_boxed",
        pageIndex: 0,
        x: 153,
        y: 549,
        boxWidth: 20,
        dateGap: 20,
        required: true
      },
      {
        id: "rights_view",
        label: "View Only Rights",
        type: "checkbox",
        pageIndex: 0,
        x: 173,
        y: 497
      },
      {
        id: "rights_full",
        label: "Full Transaction Rights",
        type: "checkbox",
        pageIndex: 0,
        x: 273,
        y: 497
      },
      {
        id: "customer_signature",
        label: "Customer Signature",
        type: "signature",
        pageIndex: 0,
        x: 180,
        y: 350,
        width: 200,
        height: 60,
        required: true
      }
    ]
  },
  {
    id: "sbi_nomination",
    bankId: "sbi",
    name: "Nomination Form (DA-1)",
    description: "Official DA-1 form for adding nominees.",
    pdfAssetUrl: "/forms/sbi_nomination.pdf",
    fields: [
      {
        id: "nominee_table",
        label: "Nominee Details",
        type: "table",
        pageIndex: 0,
        x: 55, // starting X for first column
        y: 635, // starting Y for first data row
        columns: ["Name", "Relationship", "Age", "Share %"],
        rowHeight: 30,
        maxRows: 2
      }
    ]
  }
];
