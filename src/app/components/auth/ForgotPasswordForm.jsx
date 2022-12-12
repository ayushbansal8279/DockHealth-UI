import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Spacing from 'components/common/Spacing';
import FormInput from 'components/common/Input/FormInput';
import { MontserratTypography } from 'styles/theme-montserrat';
import Button from '../common/Button/Button';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

const ForgotPasswordForm = ({
  onSubmit,
  onResendCode,
  unconfirmedUserFlag,
}) => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, setValue, setError } = formMethods;

  useMount(() => {
    setValue('username', sessionStorage.getItem('username') ?? '');
  });

  return (
    <form
      onSubmit={handleSubmit(
        unconfirmedUserFlag
          ? onResendCode({ setError })
          : onSubmit({ setError }),
      )}
      style={{
        width: '100%',
      }}
    >
      <FormProvider {...formMethods}>
        <MontserratTypography variant="h2">
          Forgot your password?
        </MontserratTypography>
        <Spacing vertical={4} />
        <MontserratTypography variant="h4">
          Don’t worry, it happens to the best of us. Enter the email associated
          with your account.
        </MontserratTypography>
        <Spacing vertical={5} />
        <FormInput name="username" type="text" label="Email" autoFocus />
        <Spacing vertical={5} />
        <Button type="submit" fullWidth size="large">
          {unconfirmedUserFlag
            ? 'Resend confirmation Email'
            : 'Send me a recovery code'}
        </Button>
        <Spacing vertical={6} />
      </FormProvider>
    </form>
  );
};

export default ForgotPasswordForm;
