import React from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, ArrowLeft } from 'lucide-react';

interface PDFPreviewProps {
  pdfUrl: string;
  formName: string;
  onBack: () => void;
}

export function PDFPreview({ pdfUrl, formName, onBack }: PDFPreviewProps) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${formName.replace(/\s+/g, '_')}_Completed.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-screen max-h-[800px] bg-background/50 rounded-[22px] overflow-hidden border border-white/10"
    >
      <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Edit Form
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium shadow-lg shadow-primary/20"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
      <div className="flex-1 bg-black/20 p-2 sm:p-4">
        <object
          data={`${pdfUrl}#toolbar=0&navpanes=0`}
          type="application/pdf"
          className="w-full h-full rounded-xl shadow-2xl bg-white"
        >
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <p>Your browser does not support inline PDF viewing.</p>
            <button onClick={handleDownload} className="text-primary underline">Download the PDF instead.</button>
          </div>
        </object>
      </div>
    </motion.div>
  );
}
