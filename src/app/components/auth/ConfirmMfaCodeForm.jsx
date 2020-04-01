import React, { useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { MontserratTypography } from '../../theme-montserrat';
import Spacing from '../common/Spacing';
import { UniversalInput } from '../userProfileView/UniversalInput';
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

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={formMethods.handleSubmit(onSubmit)}
    >
      <FormContext {...formMethods}>
        <MontserratTypography variant="h2">
          Authenticate Mobile Phone
        </MontserratTypography>
        <MontserratTypography variant="h4">
          Enter the six digit authentication code that was sent to your mobile
          phone: ***-***-****
        </MontserratTypography>
        <Spacing vertical={4} />
        <UniversalInput name="mfaCode" label="Authentication code" autoFocus />
        <Spacing vertical={5} />
        <NextButton type="submit">Confirm</NextButton>
      </FormContext>
    </form>
  );
};

export default ConfirmMFACodeForm;
