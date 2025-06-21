// src/components/six-digit-otp-input.tsx
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/features/shared/components/ui/input-otp';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SixDigitOTPInput({ value, onChange }: Props) {
  return (
    <InputOTP maxLength={6} value={value} onChange={onChange}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
