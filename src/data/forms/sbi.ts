import { FormTemplate } from './types';

export const sbiForms: FormTemplate[] = [
  {
    id: 'sbi-internet-banking',
    bankId: 'sbi',
    name: 'Internet Banking Registration',
    description: 'Register for SBI Internet Banking facility for individual customers.',
    pdfAsset: '/forms/sbi/internet-banking.pdf',
    sections: [
      {
        id: 'personal-details',
        title: 'Personal Details',
        fields: [
          { id: 'fullName', label: 'Full Name', type: 'text', required: true, boxed: true, maxLength: 25, coordinates: { x: 50, y: 700, width: 15, height: 12, page: 1 } },
          { id: 'dob', label: 'Date of Birth', type: 'date', required: true, coordinates: { x: 50, y: 670, width: 100, height: 12, page: 1 } },
          { id: 'mobile', label: 'Registered Mobile Number', type: 'text', required: true, boxed: true, maxLength: 10, validation: '^\\d{10}$', coordinates: { x: 50, y: 640, width: 15, height: 12, page: 1 } },
          { id: 'email', label: 'Email ID', type: 'email', required: false, validation: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', coordinates: { x: 50, y: 610, width: 200, height: 12, page: 1 } }
        ]
      },
      {
        id: 'account-details',
        title: 'Account Information',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 11, coordinates: { x: 50, y: 550, width: 15, height: 12, page: 1 } },
          { id: 'branchName', label: 'Branch Name', type: 'text', required: true, coordinates: { x: 50, y: 520, width: 150, height: 12, page: 1 } },
          { id: 'cifNo', label: 'CIF Number (optional)', type: 'number', required: false, boxed: true, maxLength: 11, coordinates: { x: 50, y: 490, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'facility-type',
        title: 'Facility Type',
        fields: [
          {
            id: 'rights',
            label: 'Required Rights',
            type: 'radio',
            required: true,
            options: [
              { label: 'Viewing Rights Only', value: 'view' },
              { label: 'Full Transaction Rights', value: 'transaction' }
            ],
            coordinates: { x: 50, y: 430, width: 12, height: 12, page: 1 }
          }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Applicant', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  },
  {
    id: 'sbi-kyc-update',
    bankId: 'sbi',
    name: 'KYC Update Form',
    description: 'Update Know Your Customer (KYC) details such as PAN, Aadhaar, and address.',
    pdfAsset: '/forms/sbi/kyc-update.pdf',
    sections: [
      {
        id: 'customer-info',
        title: 'Customer Information',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 11, coordinates: { x: 50, y: 720, width: 15, height: 12, page: 1 } },
          { id: 'name', label: 'Name of the Customer', type: 'text', required: true, boxed: true, maxLength: 25, coordinates: { x: 50, y: 688, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'documents',
        title: 'Documents Enclosed',
        fields: [
          { id: 'pan', label: 'PAN Card Number', type: 'text', required: false, boxed: true, maxLength: 10, validation: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$', coordinates: { x: 50, y: 620, width: 15, height: 12, page: 1 } },
          { id: 'aadhaar', label: 'Aadhaar Number', type: 'text', required: false, boxed: true, maxLength: 12, validation: '^[2-9]{1}[0-9]{11}$', coordinates: { x: 50, y: 588, width: 15, height: 12, page: 1 } },
          {
            id: 'addressProof',
            label: 'Address Proof Submitted',
            type: 'select',
            options: [
              { label: 'Passport', value: 'passport' },
              { label: 'Voter ID', value: 'voterid' },
              { label: 'Driving License', value: 'dl' },
              { label: 'Utility Bill', value: 'utility' }
            ],
            coordinates: { x: 50, y: 556, width: 150, height: 12, page: 1 }
          }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Applicant', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  },
  {
    id: 'sbi-nomination',
    bankId: 'sbi',
    name: 'Nomination Form (DA-1)',
    description: 'Add or update nominee for your bank account.',
    pdfAsset: '/forms/sbi/nomination-da1.pdf',
    sections: [
      {
        id: 'account-info',
        title: 'Account Information',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 11, coordinates: { x: 50, y: 720, width: 15, height: 12, page: 1 } },
          { id: 'branchName', label: 'Branch Name', type: 'text', required: true, coordinates: { x: 50, y: 688, width: 150, height: 12, page: 1 } }
        ]
      },
      {
        id: 'nominee-details',
        title: 'Nominee Details',
        fields: [
          { id: 'nomineeName', label: 'Name of Nominee', type: 'text', required: true, boxed: true, maxLength: 25, coordinates: { x: 50, y: 620, width: 15, height: 12, page: 1 } },
          { id: 'relationship', label: 'Relationship with Depositor', type: 'text', required: true, coordinates: { x: 50, y: 588, width: 150, height: 12, page: 1 } },
          { id: 'nomineeAge', label: 'Age', type: 'number', required: true, boxed: true, maxLength: 3, coordinates: { x: 50, y: 556, width: 18, height: 12, page: 1 } },
          { id: 'nomineeDob', label: 'Date of Birth (if minor)', type: 'date', required: false, coordinates: { x: 50, y: 524, width: 100, height: 12, page: 1 } }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Depositor(s)', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  },
  {
    id: 'sbi-debit-card',
    bankId: 'sbi',
    name: 'ATM/Debit Card Request',
    description: 'Apply for a new ATM/Debit card or replace an existing one.',
    pdfAsset: '/forms/sbi/debit-card.pdf',
    sections: [
      {
        id: 'request-type',
        title: 'Request Details',
        fields: [
          {
            id: 'reqType',
            label: 'Type of Request',
            type: 'radio',
            required: true,
            options: [
              { label: 'New Card', value: 'new' },
              { label: 'Replacement', value: 'replacement' }
            ],
            coordinates: { x: 50, y: 720, width: 12, height: 12, page: 1 }
          },
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 11, coordinates: { x: 50, y: 660, width: 15, height: 12, page: 1 } },
          { id: 'nameOnCard', label: 'Name to be printed on Card', type: 'text', required: true, boxed: true, maxLength: 25, validation: '^[a-zA-Z0-9 ]+$', coordinates: { x: 50, y: 628, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Applicant', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  },
  {
    id: 'sbi-mobile-update',
    bankId: 'sbi',
    name: 'Mobile Number Update',
    description: 'Change or link a new mobile number to your account.',
    pdfAsset: '/forms/sbi/mobile-update.pdf',
    sections: [
      {
        id: 'details',
        title: 'Update Details',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 11, coordinates: { x: 50, y: 720, width: 15, height: 12, page: 1 } },
          { id: 'oldMobile', label: 'Existing Mobile Number (if any)', type: 'text', boxed: true, maxLength: 10, validation: '^\\d{10}$', coordinates: { x: 50, y: 660, width: 15, height: 12, page: 1 } },
          { id: 'newMobile', label: 'New Mobile Number', type: 'text', required: true, boxed: true, maxLength: 10, validation: '^\\d{10}$', coordinates: { x: 50, y: 600, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Applicant', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  },
  {
    id: 'sbi-address-change',
    bankId: 'sbi',
    name: 'Address Change Request',
    description: 'Update your communication or permanent address.',
    pdfAsset: '/forms/sbi/address-change.pdf',
    sections: [
      {
        id: 'details',
        title: 'Account Details',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 11, coordinates: { x: 50, y: 720, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'new-address',
        title: 'New Address',
        fields: [
          { id: 'addressLine1', label: 'Address Line 1', type: 'text', required: true, coordinates: { x: 50, y: 650, width: 200, height: 12, page: 1 } },
          { id: 'addressLine2', label: 'Address Line 2', type: 'text', coordinates: { x: 50, y: 620, width: 200, height: 12, page: 1 } },
          { id: 'city', label: 'City', type: 'text', required: true, coordinates: { x: 50, y: 590, width: 120, height: 12, page: 1 } },
          { id: 'state', label: 'State', type: 'text', required: true, coordinates: { x: 220, y: 590, width: 120, height: 12, page: 1 } },
          { id: 'pincode', label: 'Pincode', type: 'number', required: true, boxed: true, maxLength: 6, validation: '^\\d{6}$', coordinates: { x: 50, y: 560, width: 18, height: 12, page: 1 } }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Applicant', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  }
];
