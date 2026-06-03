import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FormTemplate } from '@/data/forms/types';

export async function generatePDF(template: FormTemplate, data: Record<string, any>): Promise<string> {
  let pdfDoc: PDFDocument;

  try {
    // Attempt to fetch the original PDF asset
    const existingPdfBytes = await fetch(template.pdfAsset).then(res => {
      if (!res.ok) throw new Error('Failed to load PDF');
      return res.arrayBuffer();
    });
    pdfDoc = await PDFDocument.load(existingPdfBytes);
  } catch (error) {
    console.warn('Original PDF asset not found. Generating a blank placeholder PDF for demonstration.', error);
    // Create a new blank PDF
    pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([595.28, 841.89]); // A4 size
  }

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Iterate through form sections and fields to draw coordinates
  for (const section of template.sections) {
    for (const field of section.fields) {
      const value = data[field.id];
      if (!value || !field.coordinates) continue;

      const page = pdfDoc.getPages()[field.coordinates.page - 1];
      if (!page) continue; // Safety check

      const { x, y, width, height } = field.coordinates;

      if (field.type === 'signature') {
        // value is a base64 string
        if (typeof value === 'string' && value.startsWith('data:image')) {
          try {
            let image;
            if (value.startsWith('data:image/png')) {
              image = await pdfDoc.embedPng(value);
            } else if (value.startsWith('data:image/jpeg')) {
              image = await pdfDoc.embedJpg(value);
            }
            
            if (image) {
              page.drawImage(image, {
                x,
                y,
                width,
                height,
              });
            }
          } catch (e) {
            console.error('Failed to embed signature image', e);
          }
        }
      } else if (field.boxed) {
        // Draw one character per box
        const text = String(value).toUpperCase();
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (char !== ' ') {
            page.drawText(char, {
              x: x + (i * width), // Shift by width per character
              y: y,
              size: height * 0.8, // Adjust size relative to box height
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
          }
        }
      } else {
        // Standard text rendering
        // Need to handle checkboxes and dropdowns too?
        // Usually dropdown is rendered as text. Checkbox might be an "X" or tick.
        let textToDraw = String(value);
        if (field.type === 'checkbox') {
          textToDraw = value ? 'X' : '';
        }
        
        page.drawText(textToDraw, {
          x,
          y,
          size: height,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  // Use .slice() to produce a Uint8Array<ArrayBuffer> (not SharedArrayBuffer) for Blob compatibility
  const blob = new Blob([pdfBytes.slice(0)], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}
