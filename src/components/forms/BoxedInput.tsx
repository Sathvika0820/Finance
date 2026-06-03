import React from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

interface BoxedInputProps {
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
  pattern?: string;
}

export function BoxedInput({ value, onChange, maxLength = 25, pattern }: BoxedInputProps) {
  // We use a custom pattern that allows spaces as well as alphanumeric characters
  const customPattern = pattern ? pattern : "^[a-zA-Z0-9 ]+$";

  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < maxLength; i++) {
      slots.push(
        <InputOTPSlot 
          key={i} 
          index={i} 
          className="border-y border-x border-white/20 first:rounded-l-md last:rounded-r-md first:border-l-white/20 last:border-r-white/20"
        />
      );
    }
    return slots;
  };

  return (
    <div className="w-full max-w-full overflow-x-auto pb-2 custom-scrollbar">
      <InputOTP
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        pattern={customPattern}
        containerClassName="flex items-center gap-1"
      >
        {renderSlots()}
      </InputOTP>
    </div>
  );
}
