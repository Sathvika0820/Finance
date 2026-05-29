export interface BankDetails {
  BANK: string;
  IFSC: string;
  BRANCH: string;
  ADDRESS: string;
  CONTACT: string;
  CITY: string;
  DISTRICT: string;
  STATE: string;
}

export async function fetchBankDetails(ifsc: string): Promise<BankDetails | null> {
  try {
    const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
