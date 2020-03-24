import { Grid } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import {
  MobileInputComponent,
  OnboardingAdditionalFormControlText,
  OnboardingButton,
  OnboardingDialog,
  OnboardingDivider,
  OnboardingFieldsRequiredLabel,
  OnboardingH1,
  OnboardingH2,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingH4Toggle,
  OnboardingInput,
  OnboardingLink,
  OnboardingSpacing2,
  OnboardingSpacing3,
  OnboardingSpacing4,
} from '../../views/onboarding/OnboardingTemplate.Components';
import { TitleTypography } from './AuthComponents.styled';
import { useSmallScreen } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';

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
  try {
    setDialogTitle(`Phone number changed`);
    setDialogMessage(
      `We have sent an authentication code to your mobile phone ${mobilePhoneNumber}.`,
    );
    showDialog();
  } catch (error) {}
};

const ChangePhoneNumberForm = props => {
  // const { handleSubmit, invalid, customError, setCustomError } = props;

  const isSmallScreen = useSmallScreen();

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onChange',
  });

  const [isDialogShown, showDialog, hideDialog] = useBoolean(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const { handleSubmit, setValue, watch } = formMethods;

  return (
    <form
      className="inline-label top-buffer"
      onSubmit={handleSubmit(
        onSubmit({ showDialog, setDialogTitle, setDialogMessage }),
      )}
    >
      <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
        Change Phone Number
      </TitleTypography>
      <Grid item sm={12} md={9}>
        <TitleTypography variant="h4">
          Please enter your correct mobile phone number.
        </TitleTypography>
      </Grid>

      <OnboardingSpacing3 />

      <Grid item sm={12} md={9}>
        <FormContext {...formMethods}>
          <OnboardingInput // Onboarding enter phone number box. Register component
            label="Your Mobile Phone Number"
            name="mobilePhoneNumber"
            placeholder="Enter your mobile phone number here"
            CustomComponent={MobileInputComponent}
            InputBaseProps={{
              autoComplete: 'none',
            }}
            shrink={useSmallScreen || undefined}
          />
        </FormContext>
      </Grid>

      {useSmallScreen ? <OnboardingSpacing3 /> : <OnboardingSpacing4 />}

      <Grid
        item
        xs={5} // Replaced original Button with button from onboarding page
      >
        <OnboardingButton
          type="submit"
          height="2rem"
          variant={useSmallScreen ? 'containedAutoWidth' : 'contained'}
          fullWidth={useSmallScreen}
        >
          Continue
        </OnboardingButton>
      </Grid>

      {/*
      {useSmallScreen ? <OnboardingSpacing2 /> : <OnboardingSpacing4 />}
      <Grid item xs={12} container justify="flex-end">
        <OnboardingButton
          type="submit"
          variant={useSmallScreen ? 'containedAutoWidth' : 'contained'}
          fullWidth={useSmallScreen}
        >
          <OnboardingH2Bold>Continue</OnboardingH2Bold>
        </OnboardingButton>
      </Grid>
      {useSmallScreen ? <OnboardingSpacing2 /> : <OnboardingSpacing4 />}
      */}

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
          <OnboardingButton variant="containedAutoWidth">
            <OnboardingH2Bold>Ok</OnboardingH2Bold>
          </OnboardingButton>
        </Grid>
      </OnboardingDialog>
    </form>
  );
};

export default ChangePhoneNumberForm;
