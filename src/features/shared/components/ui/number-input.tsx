import { ChevronDown, ChevronUp } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { cn } from '../../utils/styles';
import { Button } from './button';
import { Input } from './input';
import type { NumericFormatProps } from 'react-number-format';

export interface NumberInputProps
  extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
  stepper?: number;
  thousandSeparator?: string;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number; // Controlled value
  suffix?: string;
  prefix?: string;
  onValueChange?: (value: number | undefined) => void;
  fixedDecimalScale?: boolean;
  decimalScale?: number;
  className?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      stepper = 1,
      thousandSeparator,
      placeholder,
      defaultValue,
      min = 0,
      max = Infinity,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 2,
      suffix,
      prefix,
      value: controlledValue,
      className,
      ...props
    },
    ref
  ) => {
    // Use controlled value if provided, otherwise use internal state
    const [internalValue, setInternalValue] = useState<number | undefined>(
      defaultValue
    );
    const isControlled = controlledValue !== undefined;
    const displayValue = isControlled ? controlledValue : internalValue;

    const handleValueChange = useCallback(
      (newValue: number | undefined) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        if (onValueChange) {
          onValueChange(newValue);
        }
      },
      [isControlled, onValueChange]
    );

    const handleIncrement = useCallback(() => {
      const current = displayValue ?? 0;
      const newValue = Math.min(current + stepper, max);
      handleValueChange(newValue);
    }, [displayValue, stepper, max, handleValueChange]);

    const handleDecrement = useCallback(() => {
      const current = displayValue ?? 0;
      const newValue = Math.max(current - stepper, min);
      handleValueChange(newValue);
    }, [displayValue, stepper, min, handleValueChange]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          document.activeElement ===
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          (ref as React.RefObject<HTMLInputElement>)?.current
        ) {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            handleIncrement();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleDecrement();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleIncrement, handleDecrement, ref]);

    const handleNumericChange = useCallback(
      (values: { value: string; floatValue: number | undefined }) => {
        handleValueChange(values.floatValue);
      },
      [handleValueChange]
    );

    const handleBlur = useCallback(() => {
      if (displayValue !== undefined) {
        let validatedValue = displayValue;
        if (displayValue < min) validatedValue = min;
        if (displayValue > max) validatedValue = max;

        if (validatedValue !== displayValue) {
          handleValueChange(validatedValue);
        }
      }
    }, [displayValue, min, max, handleValueChange]);

    return (
      <div className={cn('flex items-center', className)}>
        <NumericFormat
          value={displayValue}
          onValueChange={handleNumericChange}
          thousandSeparator={thousandSeparator}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          allowNegative={min < 0}
          valueIsNumericString
          onBlur={handleBlur}
          max={max}
          min={min}
          suffix={suffix}
          prefix={prefix}
          customInput={Input}
          placeholder={placeholder}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-r-none relative"
          getInputRef={ref}
          {...props}
        />

        <div className="flex flex-col h-9">
          <Button
            aria-label="Increase value"
            className="px-2 h-1/2 rounded-l-none rounded-br-none border-input border-l-0 focus-visible:relative"
            variant="ghost"
            onClick={handleIncrement}
            disabled={displayValue !== undefined && displayValue >= max}
          >
            <ChevronUp size={15} />
          </Button>
          <Button
            aria-label="Decrease value"
            className="px-2 h-1/2 rounded-l-none rounded-tr-none border-input border-l-0 focus-visible:relative "
            variant="ghost"
            onClick={handleDecrement}
            disabled={displayValue !== undefined && displayValue <= min}
          >
            <ChevronDown size={15} />
          </Button>
        </div>
      </div>
    );
  }
);
