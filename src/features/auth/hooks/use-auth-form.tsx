import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from '../components/form';
import { FormInput } from '../components/form/form-input';
import { SixDigitOTPInput } from '../components/form/six-digit-otp-input';
import { SubmitButton } from '../components/form/submit-button';
import { Error } from '../components/form/error';
import { FormContent } from '../components/form/form-content';
import { BackButton } from '../components/form/back-button';
import { Content } from '../components/form/content';
import { Footer } from '../components/form/footer';
import { Header } from '../components/form/header';
import { Root } from '../components/form/root';
import { ClerkCaptcha } from '../components/form/clerk-captcha';
import { Divider } from '../components/form/divider';

export const { useAppForm: useAuthForm } = createFormHook({
  fieldComponents: {
    FormInput,
    SixDigitOTPInput,
  },
  formComponents: {
    BackButton,
    ClerkCaptcha,
    Content,
    Divider,
    Error,
    Footer,
    FormContent,
    Header,
    Root,
    SubmitButton,
  },
  fieldContext,
  formContext,
});
