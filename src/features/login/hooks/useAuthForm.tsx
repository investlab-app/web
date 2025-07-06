import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm: useAuthForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});
