import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { MontserratTypography } from 'styles/theme-montserrat';
import Button from '../common/Button/Button';
import Spacing from '../common/Spacing';
import { UniversalMontserratInput } from '../common/UniversalInput/UniversalInput';

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
    reValidateMode: 'onSubmit',
    validationSchema,
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
      <FormContext {...formMethods}>
        <MontserratTypography variant="h2">
          Forgot your password?
        </MontserratTypography>
        <Spacing vertical={4} />
        <MontserratTypography variant="h4">
          Don’t worry, it happens to the best of us. Enter the email associated
          with your account.
        </MontserratTypography>
        <Spacing vertical={5} />
        <UniversalMontserratInput
          name="username"
          type="text"
          label="Email"
          autoFocus
        />
        <Spacing vertical={5} />
        <Button type="submit" fullWidth>
          {unconfirmedUserFlag
            ? 'Resend confirmation Email'
            : 'Send me a recovery code'}
        </Button>
        <Spacing vertical={6} />
      </FormContext>
    </form>
  );
};

export default ForgotPasswordForm;
