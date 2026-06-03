import { FormTemplate } from './types';
import { sbiForms } from './sbi';
import { iciciForms } from './icici';

export const allForms: FormTemplate[] = [
  ...sbiForms,
  ...iciciForms
];

export function getFormsByBank(bankId: string): FormTemplate[] {
  return allForms.filter(f => f.bankId === bankId);
}

export function getFormById(formId: string): FormTemplate | undefined {
  return allForms.find(f => f.id === formId);
}

// For UI filtering: We only show forms for these banks initially
export const SUPPORTED_FORM_BANK_IDS = ['sbi', 'icici'];
