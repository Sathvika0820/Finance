export type FormFieldType = 'text' | 'date' | 'number' | 'email' | 'checkbox' | 'select' | 'radio' | 'textarea' | 'signature';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  options?: FormFieldOption[]; // for select/radio
  required?: boolean;
  placeholder?: string;
  validation?: string; // e.g. regex pattern or predefined rule name
  description?: string;
  boxed?: boolean; // If true, renders one character per box
  maxLength?: number; // Maximum characters for boxed input or text input
  // coordinate mapping (x, y, width, height in mm or percentages, page number)
  // This could be used later for rendering onto a PDF
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  };
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormTemplate {
  id: string;
  bankId: string;
  name: string;
  description: string;
  pdfAsset: string; // URL to the original PDF asset (can be a local path or external link)
  sections: FormSection[];
}
