import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { FormTemplate, FormFieldDefinition } from "@/data/formTemplates";

export async function generateFilledPdf(
  template: FormTemplate,
  formData: Record<string, any>
): Promise<string> {
  // Fetch the blank PDF asset
  const response = await fetch(template.pdfAssetUrl);
  if (!response.ok) throw new Error("Could not load PDF template asset.");
  const arrayBuffer = await response.arrayBuffer();

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  for (const field of template.fields) {
    const page = pages[field.pageIndex];
    if (!page) continue;

    const value = formData[field.id];

    if (field.type === 'text') {
      if (typeof value === 'string' && value.trim()) {
        page.drawText(value, {
          x: field.x,
          y: field.y + 2,
          size: 11,
          font: fontBold,
          color: rgb(0.1, 0.2, 0.6)
        });
      }
    } 
    else if (field.type === 'boxed') {
      if (typeof value === 'string' && value.trim()) {
        // Strip spaces to correctly place in contiguous boxes
        const str = value.replace(/\s/g, '').substring(0, field.boxCount || 99).toUpperCase();
        const boxW = field.boxWidth || 20;
        for (let i = 0; i < str.length; i++) {
          page.drawText(str[i], {
            x: field.x + (i * boxW) + (boxW / 2) - 4, // center slightly
            y: field.y + 6,
            size: 11,
            font: fontBold,
            color: rgb(0.1, 0.2, 0.6)
          });
        }
      }
    }
    else if (field.type === 'date_boxed') {
      // Date format YYYY-MM-DD
      if (typeof value === 'string' && value.trim()) {
        const parts = value.split('-');
        if (parts.length === 3) {
          const [yyyy, mm, dd] = parts;
          const str = `${dd}${mm}${yyyy}`;
          const boxW = field.boxWidth || 20;
          const dateGap = field.dateGap || 20;
          
          for (let i = 0; i < str.length; i++) {
            // DD
            let finalX = field.x + (i * boxW);
            // MM (offset by gap)
            if (i >= 2) finalX += (dateGap - boxW);
            // YYYY (offset by second gap)
            if (i >= 4) finalX += (dateGap - boxW);
            
            page.drawText(str[i], {
              x: finalX + (boxW / 2) - 4,
              y: field.y + 6,
              size: 11,
              font: fontBold,
              color: rgb(0.1, 0.2, 0.6)
            });
          }
        }
      }
    }
    else if (field.type === 'checkbox') {
      if (value === true) {
        page.drawText('X', {
          x: field.x + 4,
          y: field.y + 3,
          size: 14,
          font: fontBold,
          color: rgb(0.1, 0.2, 0.6)
        });
      }
    }
    else if (field.type === 'table') {
      if (Array.isArray(value)) {
        let currentY = field.y;
        const rowH = field.rowHeight || 30;
        
        // Table columns X offsets based on dummy structure
        const columnOffsets = [0, 150, 300, 400]; // Assuming basic structure for Nominee table
        
        for (let r = 0; r < Math.min(value.length, field.maxRows || 99); r++) {
          const row = value[r];
          for (let c = 0; c < (field.columns?.length || 0); c++) {
            const cellValue = row[c] || "";
            if (cellValue.trim()) {
              page.drawText(cellValue, {
                x: field.x + columnOffsets[c] + 5,
                y: currentY + 10,
                size: 10,
                font,
                color: rgb(0.1, 0.2, 0.6)
              });
            }
          }
          currentY -= rowH;
        }
      }
    }
    else if (field.type === 'signature') {
      if (typeof value === 'string' && value.startsWith('data:image')) {
        try {
          const base64Data = value.split(',')[1];
          const imgBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          let pdfImage;
          if (value.includes('image/png')) {
            pdfImage = await pdfDoc.embedPng(imgBytes);
          } else {
            pdfImage = await pdfDoc.embedJpg(imgBytes);
          }
          
          const dims = pdfImage.scaleToFit(field.width || 100, field.height || 50);
          page.drawImage(pdfImage, {
            x: field.x,
            y: field.y,
            width: dims.width,
            height: dims.height
          });
        } catch (err) {
          console.error("Signature embedding failed", err);
        }
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}
