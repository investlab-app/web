import { useFormContext } from '.';
import { Button } from '@/features/shared/components/ui/button';

interface SubmitButtonProps {
  children: React.ReactNode;
}

const Spinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current" />
);

export const SubmitButton = ({ children }: SubmitButtonProps) => {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => state.isSubmitting}
      children={(isSubmitting) => (
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            form.handleSubmit();
          }}
        >
          {form.state.isSubmitting ? <Spinner /> : children}
        </Button>
      )}
    />
  );
};
