interface FormProps {
  children: React.ReactNode;
}

export const FormContent = ({ children }: FormProps) => {
  return <div className="flex flex-col gap-4">{children}</div>;
};
