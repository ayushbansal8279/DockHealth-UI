import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/common/v2/Button/Button';
import FormInput from 'components/common/v2/Input/FormInput';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { OutfitTypography } from 'styles/theme-outfit';
import { Title } from './Title';

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
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit } = formMethods;

  return (
    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        <Title>Let’s set a new password</Title>
        {!authTokenReceived && (
          <>
            <Spacing vertical={4} />
            <OutfitTypography variant="h4">
              First enter the six digit authorization code that was sent to your
              cell phone
            </OutfitTypography>
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
        <OutfitTypography variant="h4">
          In order to protect your account, please make sure your password is 8
          character minimum, includes at least one number and one capital letter
        </OutfitTypography>
        <Spacing vertical={4} />
        <FormInput
          name="password"
          type="password"
          label="Enter a new password"
        />
        <Spacing vertical={3} />
        <OutfitTypography variant="h5">
          * 8 characters • 1 capital • 1 number
        </OutfitTypography>
        <Spacing vertical={5} />
        <Button
          active
          id="loginButton"
          size="large"
          type="submit"
          color={palette.brightOrange}
          secondaryColor={palette.oPlusRed}
        >
          Continue
        </Button>
      </FormProvider>
    </form>
  );
};

export default ResetPasswordForm;
