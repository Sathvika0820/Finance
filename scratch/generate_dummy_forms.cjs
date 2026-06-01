const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createSbiInternetBanking() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  // Title
  page.drawText('SBI INTERNET BANKING FORM', { x: 50, y: 750, size: 20 });
  
  // Name (Boxed)
  page.drawText('Applicant Name:', { x: 50, y: 700, size: 12 });
  // Draw 20 boxes for Name
  for (let i = 0; i < 20; i++) {
    page.drawRectangle({ x: 150 + (i * 20), y: 695, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });
  }

  // Mobile (Boxed)
  page.drawText('Mobile Number:', { x: 50, y: 650, size: 12 });
  for (let i = 0; i < 10; i++) {
    page.drawRectangle({ x: 150 + (i * 20), y: 645, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });
  }

  // Email (Text)
  page.drawText('E-Mail:', { x: 50, y: 600, size: 12 });
  page.drawLine({ start: { x: 150, y: 595 }, end: { x: 500, y: 595 }, thickness: 1, color: rgb(0,0,0) });

  // DOB (Date Boxed)
  page.drawText('Date of Birth:', { x: 50, y: 550, size: 12 });
  // DD
  page.drawRectangle({ x: 150, y: 545, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 170, y: 545, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });
  // MM
  page.drawRectangle({ x: 210, y: 545, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 230, y: 545, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });
  // YYYY
  page.drawRectangle({ x: 270, y: 545, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 290, y: 545, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 310, y: 545, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 330, y: 545, width: 20, height: 20, borderColor: rgb(0,0,0), borderWidth: 1 });

  // Checkbox (Rights)
  page.drawText('Transaction Rights:', { x: 50, y: 500, size: 12 });
  page.drawRectangle({ x: 170, y: 495, width: 15, height: 15, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawText('View Only', { x: 190, y: 500, size: 12 });
  page.drawRectangle({ x: 270, y: 495, width: 15, height: 15, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawText('Full Transaction Rights', { x: 290, y: 500, size: 12 });

  // Signature
  page.drawText('Customer Signature:', { x: 50, y: 400, size: 12 });
  page.drawRectangle({ x: 180, y: 350, width: 200, height: 60, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawText('(Sign inside the box)', { x: 220, y: 330, size: 10, color: rgb(0.5,0.5,0.5) });

  const pdfBytes = await pdfDoc.save();
  const dir = path.join(__dirname, '..', 'public', 'forms');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'sbi_internet_banking.pdf'), pdfBytes);
}

async function createSbiNomination() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  // Title
  page.drawText('FORM DA-1 (NOMINATION)', { x: 50, y: 750, size: 20 });
  
  // Table
  page.drawText('Nominee Details:', { x: 50, y: 700, size: 12 });
  
  // Header Row
  page.drawRectangle({ x: 50, y: 660, width: 150, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawText('Name', { x: 60, y: 670, size: 12 });

  page.drawRectangle({ x: 200, y: 660, width: 150, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawText('Relationship', { x: 210, y: 670, size: 12 });

  page.drawRectangle({ x: 350, y: 660, width: 100, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawText('Age', { x: 360, y: 670, size: 12 });

  page.drawRectangle({ x: 450, y: 660, width: 100, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawText('Share %', { x: 460, y: 670, size: 12 });

  // Data Row 1
  page.drawRectangle({ x: 50, y: 630, width: 150, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 200, y: 630, width: 150, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 350, y: 630, width: 100, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 450, y: 630, width: 100, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });

  // Data Row 2
  page.drawRectangle({ x: 50, y: 600, width: 150, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 200, y: 600, width: 150, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 350, y: 600, width: 100, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });
  page.drawRectangle({ x: 450, y: 600, width: 100, height: 30, borderColor: rgb(0,0,0), borderWidth: 1 });


  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'forms', 'sbi_nomination.pdf'), pdfBytes);
}

async function run() {
  await createSbiInternetBanking();
  await createSbiNomination();
  console.log("PDFs created successfully.");
}

run();
