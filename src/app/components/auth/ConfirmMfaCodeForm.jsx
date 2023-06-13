/* eslint-disable unicorn/prefer-string-slice */
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MontserratTypography } from 'styles/theme-montserrat';
import FormInput from 'components/common/Input/FormInput';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import palette from 'styles/palette';

const validationSchema = object().shape({
  mfaCode: string().required('This field is required'),
});

const ConfirmMFACodeForm = (props) => {
  const { onSubmit, customError } = props;

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    if (customError) {
      formMethods.setError('mfaCode', { type: 'custom', message: customError });
    }
  }, [customError, formMethods]);

  const smsPhone = window.sessionStorage.getItem('SMS_PHONE');

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={formMethods.handleSubmit(onSubmit)}
    >
      <FormProvider {...formMethods}>
        <MontserratTypography variant="h2">
          Please enter the 6-digit code that was sent to
        </MontserratTypography>
        <MontserratTypography variant="h2">{smsPhone}</MontserratTypography>
        <Spacing vertical={5} />
        <FormInput name="mfaCode" label="Authorization code" autoFocus />
        <Spacing vertical={5} />
        <Button
          type="submit"
          size="large"
          color={palette.brightOrange}
          secondaryColor={palette.oPlusRed}
        >
          CONTINUE
        </Button>
      </FormProvider>
    </form>
  );
};

export default ConfirmMFACodeForm;
