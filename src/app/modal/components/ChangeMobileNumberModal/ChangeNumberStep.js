import React from 'react';
import { Grid } from '@material-ui/core';
import { FormContext, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import * as UserApi from 'api/user-api';
import {
  UniversalInput,
  UniversalMobileInputComponent,
} from 'components/common/UniversalInput/UniversalInput';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { StyledForm, HelperText, GridMaxHeight } from './styled';
import { REQUIRED_MESSAGE } from './helpers';

const PHONE_MASK = /\([1-9]\d{2}\) \d{3}-\d{4}|^$/;
const MASK_MESSAGE =
  'Phone number has incorrect format (NNN) NNN-NNNN is required)';

export const matchEmptyNumber = value =>
  value.replace(/_/g, '').replace(/^-+$/, '');

const validationSchema = object({
  phoneNumber: string()
    // eslint-disable-next-line func-names
    .transform(function(value) {
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
  UserApi.updatePhoneNumber(
    userProfile.email,
    userProfile.accountPhoneNumber,
    phoneNumber.replace(/[\s()-]/g, ''),
  )
    .then(() => {
      goToNextStep();
      setNewPhoneNumber(phoneNumber);
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
    <FormContext {...formMethods}>
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
            <UniversalInput
              autoFocus
              label="Your Mobile Number"
              name="phoneNumber"
              CustomComponent={UniversalMobileInputComponent}
              required
            />
          </Grid>
          <Grid item>
            <Button fullWidth type="submit">
              Update my mobile number
            </Button>
          </Grid>
        </GridMaxHeight>
      </StyledForm>
    </FormContext>
  );
};

export default ChangeNumberStep;
