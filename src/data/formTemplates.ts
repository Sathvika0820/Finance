export type FieldType = 'text' | 'boxed' | 'date' | 'table';

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  autocomplete?: string;
  pageIndex: number;
  x: number;
  y: number;
  
  // For boxed types
  boxWidth?: number;
  maxLength?: number;
  
  // For tables
  columns?: string[];
  maxRows?: number;
  rowHeight?: number;
}

export interface FormTemplate {
  id: string;
  bankId: string;
  name: string;
  description: string;
  pdfAssetUrl: string;
  fields: FormFieldDefinition[];
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'sbi_internet_banking',
    bankId: 'sbi',
    name: 'Internet Banking Registration',
    description: 'Apply for retail internet banking services.',
    pdfAssetUrl: '/forms/sbi_internet_banking.pdf',
    fields: [
      { id: 'customerName', label: 'Customer Name', type: 'text', autocomplete: 'name', pageIndex: 0, x: 205, y: 702 },
      { id: 'mobile', label: 'Mobile Number', type: 'boxed', autocomplete: 'tel', pageIndex: 0, x: 205, y: 660, boxWidth: 20, maxLength: 10 },
      { id: 'email', label: 'Email Address', type: 'text', autocomplete: 'email', pageIndex: 0, x: 205, y: 622 },
      { id: 'dob', label: 'Date of Birth (DD/MM/YYYY)', type: 'date', autocomplete: 'bday', pageIndex: 0, x: 205, y: 582 },
      { id: 'accountNo', label: 'Account Number', type: 'boxed', pageIndex: 0, x: 205, y: 540, boxWidth: 20, maxLength: 11 },
      { id: 'branchName', label: 'Branch Name', type: 'text', pageIndex: 0, x: 205, y: 502 },
    ]
  },
  {
    id: 'sbi_kyc_update',
    bankId: 'sbi',
    name: 'KYC Update Form',
    description: 'Update your PAN, Aadhaar, and Address details.',
    pdfAssetUrl: '/forms/sbi_kyc_update.pdf',
    fields: [
      { id: 'fullName', label: 'Full Name', type: 'text', autocomplete: 'name', pageIndex: 0, x: 205, y: 702 },
      { id: 'pan', label: 'PAN Number', type: 'boxed', pageIndex: 0, x: 205, y: 660, boxWidth: 20, maxLength: 10 },
      { id: 'aadhaar', label: 'Aadhaar Number', type: 'boxed', pageIndex: 0, x: 205, y: 620, boxWidth: 20, maxLength: 12 },
      { id: 'address', label: 'Current Address', type: 'text', autocomplete: 'street-address', pageIndex: 0, x: 205, y: 582 },
      { id: 'occupation', label: 'Occupation', type: 'text', pageIndex: 0, x: 205, y: 542 },
      { id: 'income', label: 'Annual Income', type: 'text', pageIndex: 0, x: 205, y: 502 },
    ]
  },
  {
    id: 'sbi_nomination',
    bankId: 'sbi',
    name: 'Nomination Form (DA-1)',
    description: 'Add or update nominee details for your account.',
    pdfAssetUrl: '/forms/sbi_nomination.pdf',
    fields: [
      { id: 'accName', label: 'Account Holder Name', type: 'text', autocomplete: 'name', pageIndex: 0, x: 225, y: 702 },
      { id: 'accNo', label: 'Account Number', type: 'boxed', pageIndex: 0, x: 225, y: 660, boxWidth: 20, maxLength: 11 },
      { id: 'nomName', label: 'Nominee Name', type: 'text', pageIndex: 0, x: 225, y: 622 },
      { id: 'nomRel', label: 'Nominee Relationship', type: 'text', pageIndex: 0, x: 225, y: 582 },
      { id: 'nomAge', label: 'Nominee Age', type: 'text', pageIndex: 0, x: 225, y: 542 },
      { 
        id: 'nomDetails', 
        label: 'Nominee Details (Table)', 
        type: 'table', 
        pageIndex: 0, 
        x: 55, 
        y: 460, 
        rowHeight: 30,
        maxRows: 1,
        columns: ['Name', 'Relationship', 'Age', 'Share %']
      }
    ]
  }
];
