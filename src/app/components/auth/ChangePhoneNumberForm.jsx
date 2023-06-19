import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSmallScreen } from 'helpers/utility-functions';
import { useBoolean } from 'hooks/useBoolean';
import Spacing from 'components/common/Spacing';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
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
import palette from 'styles/palette';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  mobilePhoneNumber: string()
    .transform((value) => value.replace(/\D/g, ''))
    .required(REQUIRED_MESSAGE)
    .matches(/\d{10}/, 'This field should have a valid phone number'),
});

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit =
  ({ showDialog, setDialogTitle, setDialogMessage }) =>
  async ({ mobilePhoneNumber }) => {
    setDialogTitle(`Phone number changed`);
    setDialogMessage(
      `We have sent an authentication code to your mobile phone ${mobilePhoneNumber}.`,
    );
    showDialog();
  };

const ChangePhoneNumberForm = () => {
  const isSmallScreen = useSmallScreen();

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
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
      <MontserratTypography variant="h2" weight="bold" align="center">
        Change Phone Number
      </MontserratTypography>
      <Spacing vertical={4} />
      <MontserratTypography variant="h4" align="center">
        Please enter your correct mobile phone number.
      </MontserratTypography>
      <Spacing vertical={4} />
      <FormProvider {...formMethods}>
        <FormPhoneNumberInput
          label="Your Mobile Phone Number"
          customShrinkCondition
          name="mobilePhoneNumber"
          autoComplete="none"
        />
      </FormProvider>
      <Spacing vertical={5} />
      <Button
        type="submit"
        size="large"
        color={palette.brightOrange}
        secondaryColor={palette.oPlusRed}
      >
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
          justifyContent="space-between"
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
