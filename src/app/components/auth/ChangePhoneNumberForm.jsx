import { Typography } from '@mui/material';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBoolean } from 'hooks/useBoolean';
import Spacing from 'components/common/Spacing';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import Button from 'components/common/Button/Button';
import { redTheme } from 'modal/themes/red-theme';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { OnboardingDialog } from 'views/onboarding/OnboardingTemplate.Components';
import palette from 'styles/palette';
import {
  ModalWrapper,
  FixedWidthButtonWrapper,
  ModalDescriptionContainer,
  ModalIconContainer,
  ButtonsContainer,
} from 'modal/components/styled';
import { OutfitTypography } from 'styles/theme-outfit';
import { Title, Subtitle } from './Title';

const REQUIRED_MESSAGE = 'This field is required';

const fontFamily = 'Outfit';

const onboardingMessageStyle = {
  fontFamily,
  fontWeight: 300,
  fontSize: '18px',
  padding: '0rem 1rem',
  display: 'block',
};

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
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const [isDialogShown, showDialog, hideDialog] = useBoolean(true);
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
      <Title>Change Phone Number</Title>
      <Spacing vertical={4} />
      <Subtitle>Please enter your correct mobile phone number.</Subtitle>
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
      <OnboardingDialog open={isDialogShown} fullWidth maxWidth="sm">
        <MuiThemeProvider theme={redTheme}>
          <ModalWrapper style={{ width: '500px' }}>
            <ModalIconContainer>
              {/* <ModalMainIcson src={envelope} alt="envelope" /> */}
              <Typography color="textPrimary" variant="h2" align="center">
                {dialogTitle}
              </Typography>
            </ModalIconContainer>
            <ModalDescriptionContainer>
              <OutfitTypography variant="h4">
                <span style={onboardingMessageStyle}>{dialogMessage}</span>
              </OutfitTypography>
            </ModalDescriptionContainer>
            <ButtonsContainer>
              <FixedWidthButtonWrapper width={300}>
                <Button
                  fullWidth
                  variant="primary-red"
                  type="button"
                  onClick={() => {
                    hideDialog();
                  }}
                >
                  Close
                </Button>
              </FixedWidthButtonWrapper>
            </ButtonsContainer>
          </ModalWrapper>
        </MuiThemeProvider>
      </OnboardingDialog>
    </form>
  );
};

export default ChangePhoneNumberForm;
