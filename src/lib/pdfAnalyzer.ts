import * as pdfjsLib from 'pdfjs-dist';

// We must set the workerSrc to allow parsing in the browser safely.
// In Vite we can do this via URL import, but since it depends on the build, we can use an unpkg link for the specific version.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedField {
  id: string;
  label: string;
  type: 'text' | 'boxed' | 'date_boxed' | 'checkbox' | 'table' | 'signature';
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  boxCount?: number;
  dateGap?: number;
  boxWidth?: number;
  columns?: string[];
  maxRows?: number;
}

const COMMON_LABELS = [
  { match: /name/i, label: 'Name', defaultType: 'boxed', boxCount: 20 },
  { match: /applicant name/i, label: 'Applicant Name', defaultType: 'boxed', boxCount: 20 },
  { match: /customer name/i, label: 'Customer Name', defaultType: 'boxed', boxCount: 20 },
  { match: /mobile/i, label: 'Mobile Number', defaultType: 'boxed', boxCount: 10 },
  { match: /contact number/i, label: 'Contact Number', defaultType: 'boxed', boxCount: 10 },
  { match: /e-?mail/i, label: 'Email', defaultType: 'text' },
  { match: /date of birth|dob/i, label: 'Date of Birth', defaultType: 'date_boxed', dateGap: 20, boxWidth: 20 },
  { match: /pan/i, label: 'PAN Number', defaultType: 'boxed', boxCount: 10 },
  { match: /aadhaar/i, label: 'Aadhaar Number', defaultType: 'boxed', boxCount: 12 },
  { match: /account number/i, label: 'Account Number', defaultType: 'boxed', boxCount: 15 },
  { match: /signature/i, label: 'Signature', defaultType: 'signature' },
  { match: /nominee/i, label: 'Nominee', defaultType: 'text' },
  { match: /occupation/i, label: 'Occupation', defaultType: 'text' },
  { match: /address/i, label: 'Address', defaultType: 'text' },
  { match: /yes/i, label: 'Yes', defaultType: 'checkbox' },
  { match: /no\b/i, label: 'No', defaultType: 'checkbox' },
  { match: /single/i, label: 'Single', defaultType: 'checkbox' },
  { match: /joint/i, label: 'Joint', defaultType: 'checkbox' },
];

export async function analyzePdf(fileBuffer: ArrayBuffer): Promise<{
  numPages: number;
  fields: ExtractedField[];
}> {
  const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const fields: ExtractedField[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 }); // Keep at 1.0 to match pdf-lib coordinates later, though PDF.js coordinate system (0,0 is bottom-left usually, or top-left depending on transform)
    
    // PDF.js coordinate transform gives us transform[4] and [5] for X, Y.
    // By default pdf.js 0,0 is bottom left. pdf-lib 0,0 is also bottom left!
    // So coordinates should map closely.
    
    textContent.items.forEach((item: any) => {
      const text = item.str.trim();
      if (!text) return;

      const x = item.transform[4];
      const y = item.transform[5];
      const width = item.width;
      const height = item.height;

      // Check against heuristics
      for (const rule of COMMON_LABELS) {
        if (rule.match.test(text)) {
          // Add a field slightly to the right of or below the label
          const fieldType = (rule.defaultType as any);
          
          let estimatedX = x + width + 10;
          let estimatedY = y;
          
          if (fieldType === 'signature') {
            estimatedY = y - 40;
            estimatedX = x;
          }

          fields.push({
            id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            label: rule.label,
            type: fieldType,
            pageIndex: i - 1,
            x: estimatedX,
            y: estimatedY,
            width: 100,
            height: 20,
            boxCount: rule.boxCount,
            boxWidth: rule.boxWidth || 20,
            dateGap: rule.dateGap || 20
          });
          break; // Only match one rule per text item
        }
      }
    });
  }

  // Deduplicate nearby fields with same label
  const dedupedFields: ExtractedField[] = [];
  fields.forEach(f => {
    const exists = dedupedFields.find(df => df.label === f.label && df.pageIndex === f.pageIndex && Math.abs(df.y - f.y) < 50);
    if (!exists) dedupedFields.push(f);
  });

  return { numPages, fields: dedupedFields };
}
