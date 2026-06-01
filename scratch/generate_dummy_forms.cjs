const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createDummyForm(filename, title, fields) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 800]); // standard-ish A4 scale
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);

  // Title
  page.drawText(title, { x: 50, y: 750, size: 20, font, color: rgb(0, 0, 0) });
  page.drawLine({ start: { x: 50, y: 740 }, end: { x: 550, y: 740 }, thickness: 2, color: rgb(0,0,0) });

  let yCursor = 700;
  
  for (const field of fields) {
    page.drawText(field.label, { x: 50, y: yCursor, size: 12, font: regularFont, color: rgb(0,0,0) });
    
    if (field.type === 'boxed') {
      // Draw boxes
      const boxWidth = 20;
      const boxHeight = 25;
      for (let i = 0; i < field.length; i++) {
        page.drawRectangle({
          x: field.x + (i * boxWidth),
          y: yCursor - 5,
          width: boxWidth,
          height: boxHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
          color: rgb(1, 1, 1),
        });
      }
    } else if (field.type === 'text' || field.type === 'date') {
      // Draw underline
      page.drawLine({
        start: { x: field.x, y: yCursor },
        end: { x: 550, y: yCursor },
        thickness: 1,
        color: rgb(0,0,0)
      });
    } else if (field.type === 'table') {
      // Draw a simple table structure
      page.drawText(field.label, { x: 50, y: yCursor, size: 12, font: regularFont });
      yCursor -= 20;
      
      const cols = field.columns;
      const startX = 50;
      const rowHeight = 30;
      
      // Draw header
      for (let c = 0; c < cols.length; c++) {
        page.drawRectangle({ x: startX + (c * 120), y: yCursor, width: 120, height: rowHeight, borderWidth: 1, borderColor: rgb(0,0,0) });
        page.drawText(cols[c], { x: startX + (c * 120) + 5, y: yCursor + 10, size: 10, font: regularFont });
      }
      yCursor -= rowHeight;
      
      // Draw empty rows
      for (let r = 0; r < field.rows; r++) {
        for (let c = 0; c < cols.length; c++) {
          page.drawRectangle({ x: startX + (c * 120), y: yCursor, width: 120, height: rowHeight, borderWidth: 1, borderColor: rgb(0,0,0) });
        }
        yCursor -= rowHeight;
      }
    }

    yCursor -= 40;
  }

  const pdfBytes = await doc.save();
  const formsDir = path.join(__dirname, '..', 'public', 'forms');
  if (!fs.existsSync(formsDir)) fs.mkdirSync(formsDir, { recursive: true });
  fs.writeFileSync(path.join(formsDir, filename), pdfBytes);
  console.log(`Created ${filename}`);
}

async function run() {
  await createDummyForm('sbi_internet_banking.pdf', 'SBI INTERNET BANKING REGISTRATION FORM', [
    { label: 'Customer Name:', x: 200, type: 'text' },
    { label: 'Mobile Number:', x: 200, type: 'boxed', length: 10 },
    { label: 'Email Address:', x: 200, type: 'text' },
    { label: 'Date of Birth:', x: 200, type: 'date' },
    { label: 'Account Number:', x: 200, type: 'boxed', length: 11 },
    { label: 'Branch Name:', x: 200, type: 'text' }
  ]);

  await createDummyForm('sbi_kyc_update.pdf', 'SBI KYC UPDATE FORM', [
    { label: 'Full Name:', x: 200, type: 'text' },
    { label: 'PAN Number:', x: 200, type: 'boxed', length: 10 },
    { label: 'Aadhaar Number:', x: 200, type: 'boxed', length: 12 },
    { label: 'Current Address:', x: 200, type: 'text' },
    { label: 'Occupation:', x: 200, type: 'text' },
    { label: 'Annual Income:', x: 200, type: 'text' }
  ]);

  await createDummyForm('sbi_nomination.pdf', 'SBI NOMINATION FORM (DA-1)', [
    { label: 'Account Holder Name:', x: 220, type: 'text' },
    { label: 'Account Number:', x: 220, type: 'boxed', length: 11 },
    { label: 'Nominee Name:', x: 220, type: 'text' },
    { label: 'Nominee Relationship:', x: 220, type: 'text' },
    { label: 'Nominee Age:', x: 220, type: 'text' },
    { label: 'Nominee Details:', x: 50, type: 'table', columns: ['Name', 'Relationship', 'Age', 'Share %'], rows: 1 }
  ]);
}

run().catch(console.error);
