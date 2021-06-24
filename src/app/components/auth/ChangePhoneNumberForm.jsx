import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { useSmallScreen } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import { MontserratTypography } from 'styles/theme-montserrat';
import Button from 'components/common/Button/Button';
import {
  OnboardingDialog,
  OnboardingDivider,
  OnboardingH2,
  OnboardingH2Bold,
  OnboardingSpacing2,
  OnboardingSpacing4,
} from 'views/onboarding/OnboardingTemplate.Components';
import Spacing from '../common/Spacing';
import {
  UniversalMobileInputComponent,
  UniversalMontserratInput,
} from '../common/UniversalInput/UniversalInput';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  mobilePhoneNumber: string()
    .transform(value => value.replace(/\D/g, ''))
    .required(REQUIRED_MESSAGE)
    .matches(/\d{10}/, 'This field should have a valid phone number'),
});

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit = ({ showDialog, setDialogTitle, setDialogMessage }) => async ({
  mobilePhoneNumber,
}) => {
  setDialogTitle(`Phone number changed`);
  setDialogMessage(
    `We have sent an authentication code to your mobile phone ${mobilePhoneNumber}.`,
  );
  showDialog();
};

const ChangePhoneNumberForm = () => {
  const isSmallScreen = useSmallScreen();

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const [isDialogShown, showDialog, hideDialog] = useBoolean(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const { handleSubmit } = formMethods;

  return (
    <form
      style={{ width: '100%' }}
      onSubmit={handleSubmit(
        onSubmit({ showDialog, setDialogTitle, setDialogMessage }),
      )}
    >
      <MontserratTypography variant="h2">
        Change Phone Number
      </MontserratTypography>
      <Spacing vertical={4} />
      <MontserratTypography variant="h4">
        Please enter your correct mobile phone number.
      </MontserratTypography>
      <Spacing vertical={4} />
      <FormContext {...formMethods}>
        <UniversalMontserratInput
          label="Your Mobile Phone Number"
          customShrinkCondition
          name="mobilePhoneNumber"
          CustomComponent={UniversalMobileInputComponent}
          autoComplete="none"
        />
      </FormContext>
      <Spacing vertical={5} />
      <Button type="submit" size="large">
        Continue
      </Button>
      <OnboardingDialog
        isSmallScreen={isSmallScreen}
        open={isDialogShown}
        fullWidth
        maxWidth="sm"
      >
        {!isSmallScreen && (
          <>
            <OnboardingH2>{dialogTitle}</OnboardingH2>
            <OnboardingSpacing2 />
            <OnboardingDivider />
            <OnboardingSpacing2 />
          </>
        )}
        <OnboardingH2>{dialogMessage}</OnboardingH2>
        <OnboardingSpacing4 />
        <Grid
          container
          direction={isSmallScreen ? 'column' : 'row'}
          justify="space-between"
          wrap="nowrap"
        >
          <Button onClick={hideDialog}>
            <OnboardingH2Bold>Ok</OnboardingH2Bold>
          </Button>
        </Grid>
      </OnboardingDialog>
    </form>
  );
};

export default ChangePhoneNumberForm;
