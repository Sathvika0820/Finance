import { FormTemplate, FormField } from '@/data/forms/types';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Download, FileCheck2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { BoxedInput } from './BoxedInput';
import { SignatureInput } from './SignatureInput';
import { PDFPreview } from './PDFPreview';
import { generatePDF } from '@/services/pdfGenerator';

interface EditableFormProps {
  template: FormTemplate;
}

export function EditableForm({ template }: EditableFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    setIsGenerating(true);
    try {
      const url = await generatePDF(template, data);
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderField = (field: FormField) => {
    const rules: any = { required: field.required ? 'This field is required' : false };
    if (field.validation) {
      rules.pattern = {
        value: new RegExp(field.validation),
        message: 'Invalid format'
      };
    }

    return (
      <div key={field.id} className="flex flex-col gap-1.5 mb-4">
        <label htmlFor={field.id} className="text-sm font-medium text-foreground/80">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <Controller
          name={field.id}
          control={control}
          rules={rules}
          render={({ field: { onChange, onBlur, value, ref } }) => {
            if (field.type === 'signature') {
              return <SignatureInput value={value || ''} onChange={onChange} />;
            }
            if (field.boxed) {
              return (
                <BoxedInput 
                  value={value || ''} 
                  onChange={onChange} 
                  maxLength={field.maxLength || 25} 
                  pattern={field.validation}
                />
              );
            }
            if (field.type === 'select' && field.options) {
              return (
                <select
                  id={field.id}
                  className="fintech-input bg-background/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ''}
                  ref={ref}
                >
                  <option value="">Select an option...</option>
                  {field.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              );
            }
            if (field.type === 'radio' && field.options) {
              return (
                <div className="flex flex-col gap-2 mt-1">
                  {field.options.map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 text-sm cursor-pointer">
                      <input
                        type="radio"
                        value={opt.value}
                        onChange={onChange}
                        checked={value === opt.value}
                        className="w-4 h-4 text-primary focus:ring-primary/50 border-white/20 bg-background/50"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              );
            }
            
            return (
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="fintech-input bg-background/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm w-full"
                onChange={onChange}
                onBlur={onBlur}
                value={value || ''}
                ref={ref}
              />
            );
          }}
        />
        {errors[field.id] && (
          <span className="text-xs text-red-400 mt-1">
            {errors[field.id]?.message as string}
          </span>
        )}
      </div>
    );
  };

  if (pdfUrl) {
    return (
      <PDFPreview 
        pdfUrl={pdfUrl} 
        formName={template.name} 
        onBack={() => setPdfUrl(null)} 
      />
    );
  }

  if (isGenerating) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fintech-card rounded-[22px] p-12 text-center flex flex-col items-center gap-4"
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-2" />
        <h2 className="text-xl font-bold">Generating Professional PDF</h2>
        <p className="text-sm text-foreground/70">
          Please wait while we align your details onto the official <strong>{template.name}</strong>.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="fintech-card rounded-[22px] overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold leading-tight mb-1">{template.name}</h2>
            <p className="text-xs text-foreground/60">{template.description}</p>
          </div>
          <button className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 hover:bg-primary/20 transition-colors" title="Download Original PDF">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-6">
        {template.sections.map(section => (
          <div key={section.id} className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary/80 border-b border-white/5 pb-2">
              {section.title}
            </h3>
            {section.description && (
              <p className="text-xs text-foreground/60 mb-2">{section.description}</p>
            )}
            <div className="grid grid-cols-1 gap-2 pt-2">
              {section.fields.map(renderField)}
            </div>
          </div>
        ))}

        <div className="pt-4 mt-2 border-t border-white/5">
          <button
            type="submit"
            className="w-full fintech-button gradient-primary text-white font-semibold py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <FileCheck2 className="w-4 h-4" />
            Complete Form
          </button>
        </div>
      </form>
    </div>
  );
}
