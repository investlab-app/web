import { useFieldContext } from '.';
import { SixDigitOTPInput as SixDigitOTPInputComponent } from '@/features/shared/components/ui/six-digit-otp-input';

export const SixDigitOTPInput = () => {
  const field = useFieldContext<string>();
  return (
    <SixDigitOTPInputComponent
      value={field.state.value}
      onChange={(value) => field.handleChange(value.toString())}
    />
  );
};
