import { useFormContext } from '.';

export const Error = () => {
  const form = useFormContext();

  return (
    <>
      <form.Subscribe
        selector={(state) => state.errorMap}
        children={(errorMap) => {
          return (
            <>
              {errorMap.onChange}
              {/* {errorMap.onSubmit && (
                <ul className="text-red-600 text-sm list-disc list-inside">
                  {Object.keys(errorMap.onSubmit).map((key) => (
                    <li key={key}>{errorMap.onSubmit[key]}</li>
                  ))}
                </ul>
              )} */}
            </>
          );
        }}
      />
    </>
  );
};
