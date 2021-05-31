/* eslint-disable unicorn/prefer-string-slice */
import React, { useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from '../common/Spacing';
import { UniversalMontserratInput } from '../common/UniversalInput/UniversalInput';
import { NextButton } from './AuthComponents.styled';

const validationSchema = object().shape({
  mfaCode: string().required('This field is required'),
});

const ConfirmMFACodeForm = props => {
  const { onSubmit, customError } = props;

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    if (customError) {
      formMethods.setError('mfaCode', customError);
    }
  }, [customError, formMethods]);

  const smsPhone = window.sessionStorage.getItem('SMS_PHONE');

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={formMethods.handleSubmit(onSubmit)}
    >
      <FormContext {...formMethods}>
        <MontserratTypography variant="h2">
          Please enter the 6-digit code that was sent to
        </MontserratTypography>
        <MontserratTypography variant="h2">{smsPhone}</MontserratTypography>
        <Spacing vertical={4} />
        {/* <MontserratTypography variant="h4">
          <StyledLink to="/onboarding/create-account">Change</StyledLink>
          &nbsp;my cell phone number
        </MontserratTypography> */}
        <Spacing vertical={4} />
        <UniversalMontserratInput
          name="mfaCode"
          label="Authorization code"
          autoFocus
        />
        <Spacing vertical={5} />
        <NextButton type="submit">CONTINUE</NextButton>
      </FormContext>
    </form>
  );
};

export default ConfirmMFACodeForm;
