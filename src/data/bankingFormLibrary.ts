export type BankId = 'sbi' | 'icici';

export type FieldType = 'text' | 'date' | 'phone' | 'address' | 'checkbox' | 'select';

export interface FieldValidationRule {
  pattern?: string;
  message: string;
}

export interface FieldCoordinates {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BankFormFieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  page: number;
  coordinates: FieldCoordinates;
  validation?: FieldValidationRule;
}

export interface BankFormTemplate {
  id: string;
  bankId: BankId;
  bankName: string;
  name: string;
  slug: string;
  pdfUrl: string;
  description: string;
  fields: BankFormFieldDefinition[];
}

export interface BankInfo {
  id: BankId;
  name: string;
}

export const BANKS: BankInfo[] = [
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'icici', name: 'ICICI Bank' },
];

const sharedFieldCoordinates: FieldCoordinates[] = [
  { page: 1, x: 96, y: 640, width: 420, height: 28 },
  { page: 1, x: 96, y: 602, width: 420, height: 28 },
  { page: 1, x: 96, y: 564, width: 420, height: 28 },
  { page: 1, x: 96, y: 526, width: 420, height: 28 },
  { page: 1, x: 96, y: 488, width: 420, height: 28 },
  { page: 1, x: 96, y: 450, width: 420, height: 28 },
];

export const FORM_LIBRARY: BankFormTemplate[] = [
  {
    id: 'sbi_internet_banking',
    bankId: 'sbi',
    bankName: 'State Bank of India',
    name: 'Internet Banking Registration',
    slug: 'internet-banking-registration',
    pdfUrl: '/forms/sbi_internet_banking.pdf',
    description: 'Official SBI form for internet banking enrollment and user ID creation.',
    fields: [
      {
        id: 'accountNumber',
        label: 'Account Number',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
        validation: {
          pattern: '^\\d{9,18}$',
          message: 'Account number must contain 9 to 18 digits.',
        },
      },
      {
        id: 'customerName',
        label: 'Customer Name',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
        validation: {
          message: 'Enter the full name as printed on your account.',
        },
      },
      {
        id: 'branchName',
        label: 'Branch Name',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
      {
        id: 'mobileNumber',
        label: 'Mobile Number',
        type: 'phone',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[3],
        validation: {
          pattern: '^\\d{10}$',
          message: 'Mobile number must be 10 digits.',
        },
      },
      {
        id: 'emailAddress',
        label: 'Email Address',
        type: 'text',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[4],
      },
      {
        id: 'preferredUsername',
        label: 'Preferred Username',
        type: 'text',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[5],
      },
    ],
  },
  {
    id: 'sbi_kyc_update',
    bankId: 'sbi',
    bankName: 'State Bank of India',
    name: 'KYC Update Form',
    slug: 'kyc-update-form',
    pdfUrl: '/forms/sbi_kyc_update.pdf',
    description: 'Official SBI KYC update form for address, phone, or identity details.',
    fields: [
      {
        id: 'accountNumber',
        label: 'Account Number',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'customerName',
        label: 'Customer Name',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'updateType',
        label: 'Update Type',
        type: 'select',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
      {
        id: 'newAddress',
        label: 'New Address',
        type: 'address',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[3],
      },
      {
        id: 'mobileNumber',
        label: 'Mobile Number',
        type: 'phone',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[4],
      },
    ],
  },
  {
    id: 'sbi_nomination',
    bankId: 'sbi',
    bankName: 'State Bank of India',
    name: 'Nomination Form',
    slug: 'nomination-form',
    pdfUrl: '/forms/sbi_nomination.pdf',
    description: 'Official SBI nomination form for account or deposit nomination details.',
    fields: [
      {
        id: 'accountNumber',
        label: 'Account Number',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'nomineeName',
        label: 'Nominee Name',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'relationship',
        label: 'Relationship to Nominee',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
      {
        id: 'nomineeDob',
        label: 'Nominee Date of Birth',
        type: 'date',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[3],
      },
      {
        id: 'nomineeShare',
        label: 'Nominee Share (%)',
        type: 'text',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[4],
      },
    ],
  },
  {
    id: 'sbi_debit_card_request',
    bankId: 'sbi',
    bankName: 'State Bank of India',
    name: 'ATM/Debit Card Request',
    slug: 'debit-card-request',
    pdfUrl: '/forms/sbi_debit_card_request.pdf',
    description: 'Official SBI form to request a new ATM or debit card.',
    fields: [
      {
        id: 'accountNumber',
        label: 'Account Number',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'customerName',
        label: 'Customer Name',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'cardType',
        label: 'Card Type Requested',
        type: 'select',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
      {
        id: 'deliveryAddress',
        label: 'Delivery Address',
        type: 'address',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[3],
      },
    ],
  },
  {
    id: 'sbi_mobile_number_update',
    bankId: 'sbi',
    bankName: 'State Bank of India',
    name: 'Mobile Number Update',
    slug: 'mobile-number-update',
    pdfUrl: '/forms/sbi_mobile_number_update.pdf',
    description: 'Official SBI form for updating mobile number linked to your account.',
    fields: [
      {
        id: 'accountNumber',
        label: 'Account Number',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'mobileNumber',
        label: 'New Mobile Number',
        type: 'phone',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'emailAddress',
        label: 'Email Address',
        type: 'text',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
    ],
  },
  {
    id: 'sbi_address_change',
    bankId: 'sbi',
    bankName: 'State Bank of India',
    name: 'Address Change Request',
    slug: 'address-change-request',
    pdfUrl: '/forms/sbi_address_change_request.pdf',
    description: 'Official SBI address update form for account and branch records.',
    fields: [
      {
        id: 'accountNumber',
        label: 'Account Number',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'currentAddress',
        label: 'Current Address',
        type: 'address',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'newAddress',
        label: 'New Address',
        type: 'address',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
      {
        id: 'city',
        label: 'City',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[3],
      },
    ],
  },
  {
    id: 'icici_kyc_update',
    bankId: 'icici',
    bankName: 'ICICI Bank',
    name: 'KYC Update Form',
    slug: 'kyc-update-form',
    pdfUrl: '/forms/icici_kyc_update.pdf',
    description: 'Official ICICI KYC update form for customer identity and contact details.',
    fields: [
      {
        id: 'customerId',
        label: 'Customer ID',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'customerName',
        label: 'Customer Name',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'updateType',
        label: 'Update Type',
        type: 'select',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
      {
        id: 'newAddress',
        label: 'New Address',
        type: 'address',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[3],
      },
      {
        id: 'mobileNumber',
        label: 'Mobile Number',
        type: 'phone',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[4],
      },
    ],
  },
  {
    id: 'icici_nomination',
    bankId: 'icici',
    bankName: 'ICICI Bank',
    name: 'Nomination Form',
    slug: 'nomination-form',
    pdfUrl: '/forms/icici_nomination.pdf',
    description: 'Official ICICI nomination form for beneficiary and nomination instructions.',
    fields: [
      {
        id: 'customerId',
        label: 'Customer ID',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'nomineeName',
        label: 'Nominee Name',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'relationship',
        label: 'Relationship',
        type: 'text',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
      {
        id: 'nomineeDob',
        label: 'Nominee DOB',
        type: 'date',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[3],
      },
    ],
  },
  {
    id: 'icici_debit_card_request',
    bankId: 'icici',
    bankName: 'ICICI Bank',
    name: 'Debit Card Request',
    slug: 'debit-card-request',
    pdfUrl: '/forms/icici_debit_card_request.pdf',
    description: 'Official ICICI debit card request form for new or replacement cards.',
    fields: [
      {
        id: 'customerId',
        label: 'Customer ID',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'customerName',
        label: 'Customer Name',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'cardType',
        label: 'Card Type',
        type: 'select',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
      {
        id: 'deliveryAddress',
        label: 'Delivery Address',
        type: 'address',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[3],
      },
    ],
  },
  {
    id: 'icici_mobile_number_update',
    bankId: 'icici',
    bankName: 'ICICI Bank',
    name: 'Mobile Number Update',
    slug: 'mobile-number-update',
    pdfUrl: '/forms/icici_mobile_number_update.pdf',
    description: 'Official ICICI mobile number update form for account contact details.',
    fields: [
      {
        id: 'customerId',
        label: 'Customer ID',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'mobileNumber',
        label: 'New Mobile Number',
        type: 'phone',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'emailAddress',
        label: 'Email Address',
        type: 'text',
        required: false,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
    ],
  },
  {
    id: 'icici_address_change',
    bankId: 'icici',
    bankName: 'ICICI Bank',
    name: 'Address Change Request',
    slug: 'address-change-request',
    pdfUrl: '/forms/icici_address_change_request.pdf',
    description: 'Official ICICI address change form for account records.',
    fields: [
      {
        id: 'customerId',
        label: 'Customer ID',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[0],
      },
      {
        id: 'currentAddress',
        label: 'Current Address',
        type: 'address',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[1],
      },
      {
        id: 'newAddress',
        label: 'New Address',
        type: 'address',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[2],
      },
      {
        id: 'city',
        label: 'City',
        type: 'text',
        required: true,
        page: 1,
        coordinates: sharedFieldCoordinates[3],
      },
    ],
  },
];

export const FORMS_BY_BANK: Record<BankId, BankFormTemplate[]> = {
  sbi: FORM_LIBRARY.filter((form) => form.bankId === 'sbi'),
  icici: FORM_LIBRARY.filter((form) => form.bankId === 'icici'),
};

export const getFormById = (bankId: BankId, formId: string) =>
  FORM_LIBRARY.find((form) => form.bankId === bankId && form.id === formId);
