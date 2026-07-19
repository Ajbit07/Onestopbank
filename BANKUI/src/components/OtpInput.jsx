import { useRef } from 'react';

/** 6-digit OTP input (replacement for ng-otp-input). */
export default function OtpInput({ length = 6, onChange }) {
  const inputsRef = useRef([]);

  const emit = () => {
    const otp = inputsRef.current.map((el) => el?.value || '').join('');
    onChange(otp);
  };

  const handleInput = (index, event) => {
    const value = event.target.value.replace(/\D/g, '').slice(-1);
    event.target.value = value;
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    emit();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length);
    digits.split('').forEach((d, i) => {
      if (inputsRef.current[i]) inputsRef.current[i].value = d;
    });
    inputsRef.current[Math.min(digits.length, length - 1)]?.focus();
    emit();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          aria-label={`OTP digit ${i + 1}`}
          className="w-[46px] h-[54px] text-center text-xl font-semibold tnum bg-white border border-hairline rounded-md outline-none transition-shadow focus:border-pine focus:shadow-[0_0_0_3px_rgba(30,77,59,0.14)]"
          onInput={(e) => handleInput(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  );
}
