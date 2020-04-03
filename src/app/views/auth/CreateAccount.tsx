/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid } from '@material-ui/core';
import { parse } from 'query-string';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { object, string } from 'yup';
import { setAuthBaseState } from '../../actions/auth-base-actions';
import * as organizationApi from '../../api/organization-api';
import {
  register as registerAction,
  resendConfirmationCode,
} from '../../api/user-api';
import {
  NextButton,
  StyledAnchorDiv,
  StyledLink,
} from '../../components/auth/AuthComponents.styled';
import Spacing from '../../components/common/Spacing';
import {
  UniversalMobileInputComponent,
  UniversalMontserratInput,
} from '../../components/userProfileView/UniversalInput';
import { showAlert, showToast } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import palette from '../../palette';
import { AUTH_BASE_STATES } from '../../reducers/auth-base-reducer';
import { MontserratTypography } from '../../theme-montserrat';
import {
  OnboardingDialog,
  OnboardingDivider,
} from '../onboarding/OnboardingTemplate.Components';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .required(REQUIRED_MESSAGE)
    .email('This field should contain a valid email address'),
  password: string()
    .required(REQUIRED_MESSAGE)
    .min(8, 'At least 8 characters are required in the password')
    .matches(/\d/, 'At least one number is required in the password')
    .matches(
      /[A-Z]/,
      'At least one uppercase letter is required in the password',
    )
    .matches(
      /[a-z]/,
      'At least one lowercase letter is required in the password',
    ),
  mobilePhoneNumber: string()
    .transform(value => value.replace(/\D/g, ''))
    .required(REQUIRED_MESSAGE)
    .matches(/\d{10}/, 'This field should contain a valid phone number'),
});

interface OnSubmitProps {
  showDialog: Function;
  setDialogTitle: (title: string) => void;
  setDialogMessage: (message: string) => void;
  locationParameters: any;
}

interface FormProps {
  [key: string]: string;
}

const onSubmit = ({
  showDialog,
  setDialogTitle,
  setDialogMessage,
  locationParameters,
}: // eslint-disable-next-line unicorn/consistent-function-scoping
OnSubmitProps) => async ({
  email,
  password,
  mobilePhoneNumber,
  lastName,
  firstName,
}: FormProps) => {
  try {
    await registerAction({
      username: email,
      password,
      email,
      phone_number: `+1${mobilePhoneNumber.replace(/\D/g, '')}`,
      family_name: lastName,
      given_name: firstName,
      'custom:referral': locationParameters.referral,
    });
    setDialogTitle(`Confirm your email`);
    setDialogMessage(
      `We just sent an email to ${email}. Please go to your email and click on the link so that we can confirm your email address.`,
    );
    showDialog();
  } catch (error) {
    if (error?.code === 'UsernameExistsException') {
      setDialogTitle(`User Exists`);
      setDialogMessage(
        `User with ${email} already exists. Please go to your email and click on the link so that we can confirm your email address.`,
      );
      showDialog();
      return;
    }
    showAlert({
      status: 'error',
      title: 'Error',
      text:
        error?.message ?? 'Could not create account, please try again later',
    });
  }
};

const resendEmail = async (email: string) => {
  try {
    await resendConfirmationCode({
      username: email,
    });
    showToast({
      status: 'success',
      title: 'Account confirmation email resent',
    });
  } catch (error) {
    showAlert({
      status: 'error',
      title: 'Error',
      text: error?.message ?? 'Could not resend email, please try again later',
    });
  }
};

const getCustomTitleFromReferralConfig = async (
  referralCode: any,
  setCustomPageTitle: any,
) => {
  if (referralCode !== undefined && referralCode !== 'undefined') {
    const referralConfig = await organizationApi.getConfigurationForReferral(
      referralCode,
    );
    if (referralConfig) {
      setCustomPageTitle(referralConfig.messageCreateAccount);
    }
  }
};

const StyledGrid = styled(Grid)`
  && {
    height: 100%;
  }
`;

const StyledForm = styled.form`
  width: 100%;
`;

const CreateAccount = () => {
  const [isDialogShown, showDialog, hideDialog] = useBoolean(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [customPageTitle, setCustomPageTitle] = useState('');

  const dispatch = useDispatch();

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const email = formMethods.watch('email');

  const locationParameters = parse(hashHistory.getCurrentLocation()?.search);
  const hasTrialReferral = Boolean(locationParameters.trial);

  useMount(() => {
    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
    if (locationParameters && locationParameters?.referral) {
      getCustomTitleFromReferralConfig(
        String(locationParameters?.referral),
        setCustomPageTitle,
      );
    }
  });

  const hasCustomPageTitle = customPageTitle !== '';

  return (
    <StyledGrid container alignItems="center" justify="center">
      <StyledForm
        onSubmit={formMethods.handleSubmit(
          onSubmit({
            setDialogMessage,
            setDialogTitle,
            showDialog,
            locationParameters,
          }),
        )}
      >
        <FormContext {...formMethods}>
          {(hasTrialReferral || hasCustomPageTitle) && (
            <>
              <MontserratTypography variant="h2">
                {hasCustomPageTitle
                  ? customPageTitle
                  : 'Start your free 30 day trial'}
              </MontserratTypography>
              <Spacing vertical={4} />
            </>
          )}
          <MontserratTypography
            variant={hasTrialReferral || hasCustomPageTitle ? 'h4' : 'h2'}
          >
            Please create an account
          </MontserratTypography>
          <Spacing vertical={4} />
          <MontserratTypography variant="h5">
            <span style={{ color: palette.error }}>*</span>
            <span> All fields required</span>
          </MontserratTypography>
          <Spacing vertical={3} />
          <UniversalMontserratInput name="firstName" label="First Name" />
          <Spacing vertical={3} />
          <UniversalMontserratInput name="lastName" label="Last Name" />
          <Spacing vertical={3} />
          <UniversalMontserratInput name="email" label="Email" />
          <Spacing vertical={3} />
          <UniversalMontserratInput
            name="password"
            label="Password"
            type="password"
          />
          <Spacing vertical={3} />
          <MontserratTypography variant="h5">
            Eight characters • One capital letter • One number
          </MontserratTypography>
          <Spacing vertical={3} />
          <UniversalMontserratInput
            name="mobilePhoneNumber"
            label="Your Mobile Phone Number"
            CustomComponent={UniversalMobileInputComponent}
          />
          <Spacing vertical={3} />
          <MontserratTypography variant="h5">
            This must be a mobile phone number as we are required to send a
            secondary authentication code for HIPPA compliance
          </MontserratTypography>
          <Spacing vertical={5} />
          <NextButton type="submit">Continue</NextButton>
          <Spacing vertical={5} />
          <MontserratTypography variant="h4">
            <span>I already have an account </span>
            <StyledLink to="/login">SIGN IN</StyledLink>
          </MontserratTypography>
        </FormContext>
      </StyledForm>
      <OnboardingDialog open={isDialogShown} fullWidth maxWidth="sm">
        <MontserratTypography variant="h3">{dialogTitle}</MontserratTypography>
        <Spacing vertical={3} />
        <OnboardingDivider />
        <Spacing vertical={3} />
        <MontserratTypography variant="h4">
          {dialogMessage}
        </MontserratTypography>
        <Spacing vertical={5} />
        <MontserratTypography variant="h4">
          I didn&apos;t get the email
        </MontserratTypography>
        <MontserratTypography variant="h4">
          <StyledAnchorDiv onClick={() => resendEmail(email)}>
            Resend email
          </StyledAnchorDiv>
        </MontserratTypography>
        <Spacing vertical={5} />
        <MontserratTypography variant="h4">
          The email address is wrong
        </MontserratTypography>
        <MontserratTypography variant="h4">
          <StyledAnchorDiv onClick={hideDialog}>
            Change email address
          </StyledAnchorDiv>
        </MontserratTypography>
      </OnboardingDialog>
    </StyledGrid>
  );
};

export default CreateAccount;
