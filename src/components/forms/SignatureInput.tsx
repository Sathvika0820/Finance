import React, { useRef, useState, useEffect } from 'react';
import { Pen, Upload, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SignatureInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function SignatureInput({ value, onChange }: SignatureInputProps) {
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && mode === 'draw') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Reset context to draw clean
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [mode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        onChange(canvas.toDataURL('image/png'));
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex bg-white/5 rounded-xl p-1 shrink-0 w-fit">
        <button
          type="button"
          onClick={() => setMode('draw')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            mode === 'draw' ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
          )}
        >
          <Pen className="w-4 h-4" />
          Draw
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            mode === 'upload' ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
          )}
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      <div className="relative border border-white/10 rounded-xl overflow-hidden bg-white/95">
        <AnimatePresence mode="wait">
          {mode === 'draw' ? (
            <motion.div
              key="draw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-40"
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={160}
                className="w-full h-full touch-none cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!value && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <span className="text-black/20 font-medium select-none text-sm">Draw signature here</span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-40 flex flex-col items-center justify-center p-4"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="signature-upload"
              />
              
              {value ? (
                <img src={value} alt="Signature Preview" className="max-h-full max-w-full object-contain mix-blend-multiply" />
              ) : (
                <label 
                  htmlFor="signature-upload"
                  className="flex flex-col items-center gap-2 cursor-pointer text-black/40 hover:text-black/60 transition-colors"
                >
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">Click to browse or drag image here</span>
                </label>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {value && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={clearSignature}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Signature
          </button>
        </div>
      )}
    </div>
  );
}
