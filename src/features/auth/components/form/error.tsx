import { ArkErrors } from 'arktype';
import { useFormContext } from '.';

export const Error = () => {
  const form = useFormContext();
  return (
    <>
      {form.state.isSubmitted && (
        <p className="text-red-600 text-sm">
          {(() => {
            const error = form.state.errors;
            if (error instanceof ArkErrors) {
              return error.summary;
            } else {
              return String(error);
            }
          })()}
        </p>
      )}
    </>
  );
};
