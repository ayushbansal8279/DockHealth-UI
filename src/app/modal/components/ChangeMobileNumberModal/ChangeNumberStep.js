import React from 'react';
import { Grid } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import * as UserAuthApi from 'api/user-auth-api';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { StyledForm, HelperText, GridMaxHeight } from './styled';
import { REQUIRED_MESSAGE } from './helpers';

const PHONE_MASK = /^\d{10,15}$/;
const MASK_MESSAGE =
  'Phone number has incorrect format. (NNN) NNN-NNNN or NNN-NNN-NNN is required.';

export const matchEmptyNumber = value =>
  value.replace(/_/g, '').replace(/^-+$/, '');

const validationSchema = object({
  phoneNumber: string()
    // eslint-disable-next-line func-names
    .transform(function(value) {
      if (value.length <= 3) {
        return '';
      }
      return this.isType(value) && matchEmptyNumber(value);
    })
    .matches(PHONE_MASK, MASK_MESSAGE)
    .required(REQUIRED_MESSAGE),
});

const onSubmit = ({
  goToNextStep,
  setNewPhoneNumber,
  setError,
  userProfile,
}) => ({ phoneNumber }) => {
  UserAuthApi.updatePhoneNumber(
    userProfile.email,
    userProfile.accountPhoneNumber,
    `+${phoneNumber.replace(/[\s()-]/g, '')}`,
  )
    .then(() => {
      goToNextStep();
      setNewPhoneNumber(`+${phoneNumber}`);
    })
    .catch(() => {
      setError(
        'phoneNumber',
        'manual',
        'Something went wrong. Please try again later.',
      );
    });
};

const ChangeNumberStep = ({ goToNextStep, setNewPhoneNumber, userProfile }) => {
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, setError } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <StyledForm
        onSubmit={handleSubmit(
          onSubmit({ goToNextStep, setNewPhoneNumber, setError, userProfile }),
        )}
      >
        <GridMaxHeight container direction="column" justify="space-between">
          <Grid item>
            <Spacing vertical={5} />
            <HelperText>
              A valid mobile phone number is required to send an authentication
              code for HIPAA compliance
            </HelperText>
            <FormPhoneNumberInput
              required
              autoFocus
              label="Your Mobile Number"
              name="phoneNumber"
            />
          </Grid>
          <Grid item>
            <Button fullWidth type="submit">
              Update my mobile number
            </Button>
          </Grid>
        </GridMaxHeight>
      </StyledForm>
    </FormProvider>
  );
};

export default ChangeNumberStep;
