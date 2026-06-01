import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';

const banks = [
  { id: "sbi", name: "State Bank of India" },
  { id: "pnb", name: "Punjab National Bank" },
  { id: "bob", name: "Bank of Baroda" },
  { id: "canara", name: "Canara Bank" },
  { id: "union", name: "Union Bank of India" },
  { id: "boi", name: "Bank of India" },
  { id: "indian", name: "Indian Bank" },
  { id: "cbi", name: "Central Bank of India" },
  { id: "iob", name: "Indian Overseas Bank" },
  { id: "uco", name: "UCO Bank" },
  { id: "bom", name: "Bank of Maharashtra" },
  { id: "psb", name: "Punjab & Sind Bank" },
  { id: "hdfc", name: "HDFC Bank" },
  { id: "icici", name: "ICICI Bank" },
  { id: "axis", name: "Axis Bank" },
  { id: "kotak", name: "Kotak Mahindra Bank" },
  { id: "indusind", name: "IndusInd Bank" },
  { id: "yes", name: "Yes Bank" },
  { id: "federal", name: "Federal Bank" },
  { id: "idfc", name: "IDFC FIRST Bank" },
  { id: "southindian", name: "South Indian Bank" },
  { id: "karurvysya", name: "Karur Vysya Bank" },
  { id: "cityunion", name: "City Union Bank" },
  { id: "rbl", name: "RBL Bank" },
  { id: "bandhan", name: "Bandhan Bank" },
  { id: "csb", name: "CSB Bank" },
  { id: "dcb", name: "DCB Bank" },
  { id: "dhanlaxmi", name: "Dhanlaxmi Bank" },
  { id: "jk", name: "Jammu & Kashmir Bank" },
  { id: "karnataka", name: "Karnataka Bank" },
  { id: "nainital", name: "Nainital Bank" },
  { id: "tamilnadmercantile", name: "Tamilnad Mercantile Bank" },
  { id: "aubank", name: "AU Small Finance Bank" },
  { id: "capitalbank", name: "Capital Small Finance Bank" },
  { id: "equitas", name: "Equitas Small Finance Bank" },
  { id: "esaf", name: "ESAF Small Finance Bank" },
  { id: "fincare", name: "Fincare Small Finance Bank" },
  { id: "jana", name: "Jana Small Finance Bank" },
  { id: "nesfb", name: "North East Small Finance Bank" },
  { id: "shivalik", name: "Shivalik Small Finance Bank" },
  { id: "suryoday", name: "Suryoday Small Finance Bank" },
  { id: "ujjivan", name: "Ujjivan Small Finance Bank" },
  { id: "unity", name: "Unity Small Finance Bank" },
  { id: "utkarsh", name: "Utkarsh Small Finance Bank" },
  { id: "airtel", name: "Airtel Payments Bank" },
  { id: "ippb", name: "India Post Payments Bank" },
  { id: "fino", name: "Fino Payments Bank" },
  { id: "jio", name: "Jio Payments Bank" },
  { id: "nsdl", name: "NSDL Payments Bank" },
  { id: "paytm", name: "Paytm Payments Bank" },
  { id: "apgvb", name: "Andhra Pradesh Grameena Vikas Bank" },
  { id: "karnataka-gramin", name: "Karnataka Gramin Bank" },
  { id: "kerala-gramin", name: "Kerala Gramin Bank" },
  { id: "prathama-up", name: "Prathama UP Gramin Bank" },
  { id: "punjab-gramin", name: "Punjab Gramin Bank" },
  { id: "tgb", name: "Telangana Grameena Bank" },
  { id: "saraswat", name: "Saraswat Bank" },
  { id: "cosmos", name: "Cosmos Bank" },
  { id: "svc", name: "Shamrao Vithal Co-operative Bank" },
  { id: "abhyudaya", name: "Abhyudaya Co-operative Bank" }
];

const langs = ['hi', 'te', 'ta', 'kn', 'mr', 'bn', 'gu', 'pa', 'ur', 'or'];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const translations = {};
  
  for (const lang of langs) {
    translations[lang] = {};
    console.log(`Translating banks to ${lang}...`);
    for (const bank of banks) {
      try {
        const res = await translate(bank.name, { to: lang });
        translations[lang][bank.id] = res.text;
        await delay(300); // prevent rate limits
      } catch (e) {
        console.log(`Error translating ${bank.name} to ${lang}`);
        translations[lang][bank.id] = bank.name;
      }
    }
  }

  const output = `export const bankTranslations: Record<string, Record<string, string>> = ${JSON.stringify(translations, null, 2)};

export function getLocalizedBankName(bankId: string, lang: string, fallbackEn: string) {
  return bankTranslations[lang]?.[bankId] || fallbackEn;
}
`;

  fs.writeFileSync('src/lib/bankTranslations.ts', output);
  console.log("Wrote src/lib/bankTranslations.ts");

  // Now fix JSON strings
  for (const lang of langs) {
    const jsonPath = path.join('src/translations', `${lang}.json`);
    let data = {};
    if (fs.existsSync(jsonPath)) {
      data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
    
    // Add missing strings
    try {
      const selectedRes = await translate("Selected Banks", { to: lang });
      data.selectedBanks = selectedRes.text;
      
      const addRes = await translate("Add your banks", { to: lang });
      data.addYourBanks = addRes.text;
    } catch (e) {}

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
}

run();
