import { FormTemplate } from './types';

export const iciciForms: FormTemplate[] = [
  {
    id: 'icici-kyc-update',
    bankId: 'icici',
    name: 'KYC Update Form',
    description: 'Update your KYC details (PAN, Aadhaar) for your ICICI Bank account.',
    pdfAsset: '/forms/icici/kyc-update.pdf',
    sections: [
      {
        id: 'customer-details',
        title: 'Customer Details',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 12, coordinates: { x: 50, y: 720, width: 15, height: 12, page: 1 } },
          { id: 'fullName', label: 'Full Name', type: 'text', required: true, boxed: true, maxLength: 25, coordinates: { x: 50, y: 688, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'kyc-documents',
        title: 'KYC Documents',
        fields: [
          { id: 'pan', label: 'PAN Number', type: 'text', required: true, boxed: true, maxLength: 10, validation: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$', coordinates: { x: 50, y: 620, width: 15, height: 12, page: 1 } },
          { id: 'aadhaar', label: 'Aadhaar Number', type: 'text', required: true, boxed: true, maxLength: 12, validation: '^[2-9]{1}[0-9]{11}$', coordinates: { x: 50, y: 588, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Customer', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  },
  {
    id: 'icici-nomination',
    bankId: 'icici',
    name: 'Nomination Form (DA-1)',
    description: 'Register or update nomination for your account.',
    pdfAsset: '/forms/icici/nomination.pdf',
    sections: [
      {
        id: 'account-info',
        title: 'Account Information',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 12, coordinates: { x: 50, y: 720, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'nominee-info',
        title: 'Nominee Information',
        fields: [
          { id: 'nomineeName', label: 'Nominee Name', type: 'text', required: true, boxed: true, maxLength: 25, coordinates: { x: 50, y: 640, width: 15, height: 12, page: 1 } },
          { id: 'relationship', label: 'Relationship with Applicant', type: 'text', required: true, coordinates: { x: 50, y: 608, width: 150, height: 12, page: 1 } },
          { id: 'age', label: 'Age', type: 'number', required: true, boxed: true, maxLength: 3, coordinates: { x: 50, y: 576, width: 18, height: 12, page: 1 } }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Applicant(s)', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  },
  {
    id: 'icici-debit-card',
    bankId: 'icici',
    name: 'Debit Card Request',
    description: 'Request for issuance or replacement of Debit Card.',
    pdfAsset: '/forms/icici/debit-card.pdf',
    sections: [
      {
        id: 'request-details',
        title: 'Card Request Details',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 12, coordinates: { x: 50, y: 720, width: 15, height: 12, page: 1 } },
          {
            id: 'cardType',
            label: 'Card Type',
            type: 'select',
            options: [
              { label: 'Coral Debit Card', value: 'coral' },
              { label: 'Sapphiro Debit Card', value: 'sapphiro' },
              { label: 'Rubyx Debit Card', value: 'rubyx' }
            ],
            required: true,
            coordinates: { x: 50, y: 660, width: 150, height: 12, page: 1 }
          },
          { id: 'nameOnCard', label: 'Name on Card', type: 'text', required: true, boxed: true, maxLength: 20, validation: '^[a-zA-Z0-9 ]+$', coordinates: { x: 50, y: 628, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Customer', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  },
  {
    id: 'icici-mobile-update',
    bankId: 'icici',
    name: 'Mobile Number Update',
    description: 'Update your registered mobile number.',
    pdfAsset: '/forms/icici/mobile-update.pdf',
    sections: [
      {
        id: 'update-details',
        title: 'Update Details',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 12, coordinates: { x: 50, y: 720, width: 15, height: 12, page: 1 } },
          { id: 'newMobile', label: 'New Mobile Number', type: 'text', required: true, boxed: true, maxLength: 10, validation: '^\\d{10}$', coordinates: { x: 50, y: 660, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Customer', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  },
  {
    id: 'icici-address-change',
    bankId: 'icici',
    name: 'Address Change Request',
    description: 'Update communication and permanent address.',
    pdfAsset: '/forms/icici/address-change.pdf',
    sections: [
      {
        id: 'account',
        title: 'Account Information',
        fields: [
          { id: 'accountNo', label: 'Account Number', type: 'number', required: true, boxed: true, maxLength: 12, coordinates: { x: 50, y: 720, width: 15, height: 12, page: 1 } }
        ]
      },
      {
        id: 'address',
        title: 'New Address',
        fields: [
          { id: 'address1', label: 'Address Line 1', type: 'text', required: true, coordinates: { x: 50, y: 650, width: 200, height: 12, page: 1 } },
          { id: 'city', label: 'City', type: 'text', required: true, coordinates: { x: 50, y: 618, width: 120, height: 12, page: 1 } },
          { id: 'pincode', label: 'Pincode', type: 'number', required: true, boxed: true, maxLength: 6, validation: '^\\d{6}$', coordinates: { x: 220, y: 618, width: 18, height: 12, page: 1 } },
          { id: 'state', label: 'State', type: 'text', required: true, coordinates: { x: 50, y: 586, width: 150, height: 12, page: 1 } }
        ]
      },
      {
        id: 'authorization',
        title: 'Authorization',
        fields: [
          { id: 'signature', label: 'Signature of Customer', type: 'signature', required: true, coordinates: { x: 50, y: 150, width: 150, height: 50, page: 1 } }
        ]
      }
    ]
  }
];
