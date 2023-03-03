import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// import * as UserAuthApi from 'api/user-auth-api';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { StyledForm, HelperText, GridMaxHeight } from './styled';
import { REQUIRED_MESSAGE } from './helpers';

const EMAIL_MASK = !/^[\w%+-.]+@[\d-.a-z]+\.[a-z]{2,10}$/i;
const MASK_MESSAGE = 'Invalid Email Entered';

export const matchEmptyField = value =>
  value.replace(/_/g, '').replace(/^-+$/, '');

const validationSchema = object({
  email: string()
    // eslint-disable-next-line func-names
    .transform(function(value) {
      if (value.length <= 3) {
        return '';
      }
      return this.isType(value) && matchEmptyField(value);
    })
    .matches(EMAIL_MASK, MASK_MESSAGE),
  // .required(REQUIRED_MESSAGE),
});

// const validate = values => {
//   const errors = {};
//   if (!values.username) {
//     errors.username = 'Required';
//   } else if (!/^[\w%+-.]+@[\d-.a-z]+\.[a-z]{2,10}$/i.test(values.username)) {
//     errors.username = 'Please enter a valid email address';
//   }

//   if (!values.confirmationCode) {
//     errors.confirmationCode = 'Required';
//   }

//   return errors;
// };

const onSubmit = ({ goToNextStep, setNewEmail, setError, userProfile }) => ({
  email,
}) => {
  console.log(`submit button hit`);
  goToNextStep();
  setNewEmail(email);
  //   UserAuthApi.updatePhoneNumber(
  //     userProfile.email,
  //     userProfile.accountPhoneNumber,
  //     `+${phoneNumber.replace(/[\s()-]/g, '')}`,
  //   )
  //     .then(() => {
  //       goToNextStep();
  //       setNewPhoneNumber(`+${phoneNumber}`);
  //     })
  //     .catch(() => {
  //       setError('phoneNumber', {
  //         type: 'custom',
  //         message: 'Something went wrong. Please try again later.',
  //       });
  //     });
};

const ChangeEmailStep = ({ goToNextStep, setNewEmail, userProfile }) => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, setError } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <StyledForm
        onSubmit={handleSubmit(
          onSubmit({ goToNextStep, setNewEmail, setError, userProfile }),
        )}
      >
        <GridMaxHeight container direction="column" justify="space-between">
          <Grid item>
            <Spacing vertical={5} />
            <HelperText>
              A valid Email is required to send an authentication code for HIPAA
              compliance
            </HelperText>
            <TextField label="Email" required />
          </Grid>
          <Grid item>
            <Button fullWidth type="submit">
              Update my Email
            </Button>
          </Grid>
        </GridMaxHeight>
      </StyledForm>
    </FormProvider>
  );
};

export default ChangeEmailStep;
