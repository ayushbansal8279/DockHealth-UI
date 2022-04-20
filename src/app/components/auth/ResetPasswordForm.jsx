import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { MontserratTypography } from 'styles/theme-montserrat';
import Button from 'components/common/Button/Button';
import FormInput from 'components/common/Input/FormInput';
import Spacing from 'components/common/Spacing';

const MIN_PASSWORD_LENGTH = 8;

const validationSchema = object().shape({
  // code: string().required('Authorization code is required'),
  password: string()
    .required('Password is required')
    .min(
      MIN_PASSWORD_LENGTH,
      `Password needs to be at least ${MIN_PASSWORD_LENGTH} characters long`,
    )
    .matches(/\d/, 'Password needs at least 1 number')
    .matches(/[A-Z]/, 'Password needs at least 1 capital letter'),
});

const ResetPasswordForm = ({ authTokenReceived, onSubmit }) => {
  const formMethods = useForm({
    reValidateMode: 'onSubmit',
    validationSchema,
  });

  const { handleSubmit } = formMethods;

  return (
    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        <MontserratTypography variant="h2">
          Let’s set a new password
        </MontserratTypography>
        {!authTokenReceived && (
          <>
            <Spacing vertical={4} />
            <MontserratTypography variant="h4">
              First enter the six digit authorization code that was sent to your
              cell phone
            </MontserratTypography>
            <Spacing vertical={4} />
            <FormInput
              name="code"
              type="text"
              label="Authorization code"
              autoFocus
            />
          </>
        )}
        <Spacing vertical={4} />
        <MontserratTypography variant="h4">
          In order to protect your account, please make sure your password is 8
          character minimum, includes at least one number and one capital letter
        </MontserratTypography>
        <Spacing vertical={4} />
        <FormInput
          name="password"
          type="password"
          label="Enter a new password"
        />
        <Spacing vertical={5} />
        <Button active id="loginButton" size="large" type="submit">
          Continue
        </Button>
      </FormProvider>
    </form>
  );
};

export default ResetPasswordForm;
