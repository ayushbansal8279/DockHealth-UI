import Grid from '@material-ui/core/Grid';
import React, { useRef, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useMount, useToggle } from 'react-use';
// import { hashHistory } from 'react-router';
import { object, string } from 'yup';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  register as registerAction,
  resendConfirmationCode,
} from '../../../api/user-api';
import { showAlert, showToast } from '../../../helpers/utility-functions';
import useBoolean from '../../../hooks/useBoolean';
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
} from '../OnboardingTemplate.Components';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .required(REQUIRED_MESSAGE)
    .email('This field should have a valid email address'),
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
    .matches(/\d{10}/, 'This field should have a valid phone number'),
});

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit = ({ showDialog, setDialogTitle, setDialogMessage }) => async ({
  email,
  password,
  mobilePhoneNumber,
  lastName,
  firstName,
}) => {
  try {
    await registerAction({
      username: email,
      password,
      email,
      phone_number: `+1${mobilePhoneNumber.replace(/\D/g, '')}`,
      family_name: lastName,
      given_name: firstName,
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
      icon: 'error',
      title: 'Error',
      text:
        error?.message ?? 'Could not create account, please try again later',
    });
  }
};

const resendEmail = async email => {
  try {
    await resendConfirmationCode({
      username: email,
    });
    showToast({
      status: 'success',
      title: `Account confirmation email resent`,
    });
  } catch (error) {
    showAlert({
      icon: 'error',
      title: 'Error',
      text: error?.message ?? 'Could not resend email, please try again later',
    });
  }
  // hashHistory.replace('/login');
};

const OnboardingCreateAccountView = () => {
  const dispatch = useDispatch();
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onChange',
  });

  const emailInputReference = useRef(null);

  const { handleSubmit, watch } = formMethods;

  const email = watch('email');

  const [isPasswordShown, togglePasswordShown] = useToggle(false);
  const [isDialogShown, showDialog, hideDialog] = useBoolean(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 1 })(dispatch);
  });

  return (
    <div>
      <OnboardingH1>Start your free 30 day trial </OnboardingH1>
      <OnboardingSpacing3 />
      <OnboardingH2>Please create an account</OnboardingH2>
      <OnboardingSpacing3 />
      <OnboardingFieldsRequiredLabel>
        All fields required
      </OnboardingFieldsRequiredLabel>
      <OnboardingSpacing2 />
      <form
        onSubmit={handleSubmit(
          onSubmit({ showDialog, setDialogTitle, setDialogMessage }),
        )}
      >
        <FormContext {...formMethods}>
          <Grid container spacing={8}>
            <Grid item sm={12} md={6}>
              <OnboardingInput
                label="First Name"
                name="firstName"
                placeholder="Enter your first name here"
                InputBaseProps={{
                  autoComplete: 'off',
                }}
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <OnboardingInput
                label="Last Name"
                name="lastName"
                placeholder="Enter your last name here"
                InputBaseProps={{
                  autoComplete: 'off',
                }}
              />
            </Grid>
            <Grid item sm={12}>
              <OnboardingInput
                label="Email"
                name="email"
                placeholder="Enter your email here"
                InputBaseProps={{
                  autoComplete: 'off',
                }}
                inputContainerReference={emailInputReference}
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <OnboardingInput
                label="Password"
                name="password"
                placeholder="Enter your password here"
                InputBaseProps={{
                  type: isPasswordShown ? 'text' : 'password',
                  endAdornment: (
                    <OnboardingH4Toggle onClick={togglePasswordShown}>
                      {isPasswordShown ? 'Hide' : 'Show'}
                    </OnboardingH4Toggle>
                  ),
                  autoComplete: 'off',
                }}
              />
              <OnboardingAdditionalFormControlText>
                <OnboardingH3>
                  <b>Secure password requirements</b>
                </OnboardingH3>
                <OnboardingH3>- 8 characters minimum</OnboardingH3>
                <OnboardingH3>- include at least one number</OnboardingH3>
                <OnboardingH3>
                  - include at least one uppercase letter
                </OnboardingH3>
                <OnboardingH3>
                  - include at least one lowercase letter
                </OnboardingH3>
              </OnboardingAdditionalFormControlText>
            </Grid>
            <Grid item sm={12} md={6}>
              <OnboardingInput
                label="Your Mobile Phone Number"
                name="mobilePhoneNumber"
                placeholder="Enter your mobile phone number here"
                CustomComponent={MobileInputComponent}
                InputBaseProps={{
                  autoComplete: 'off',
                }}
              />
              <OnboardingAdditionalFormControlText>
                <OnboardingH3>
                  This must be a mobile phone number as we are required to send
                  a secondary authentication code for HIPAA compliance
                </OnboardingH3>
              </OnboardingAdditionalFormControlText>
            </Grid>
            <Grid item sm={12} container justify="flex-end">
              <OnboardingSpacing4 />
              <OnboardingButton type="submit" variant="contained">
                <OnboardingH2Bold>Continue</OnboardingH2Bold>
              </OnboardingButton>
              <OnboardingSpacing4 />
              <OnboardingH2>
                <span>I already have an account. </span>
                <OnboardingLink to="/login">Sign in</OnboardingLink>
              </OnboardingH2>
            </Grid>
          </Grid>
          <OnboardingDialog open={isDialogShown} fullWidth maxWidth="sm">
            <OnboardingH2>{dialogTitle}</OnboardingH2>
            <OnboardingSpacing2 />
            <OnboardingDivider />
            <OnboardingSpacing2 />
            <OnboardingH2>{dialogMessage}</OnboardingH2>
            <OnboardingSpacing4 />
            <Grid container justify="space-between" wrap="nowrap">
              <OnboardingButton
                onClick={() => resendEmail(email)}
                variant="containedAutoWidth"
              >
                <OnboardingH2Bold>Resend email</OnboardingH2Bold>
              </OnboardingButton>
              <OnboardingButton
                onClick={() => {
                  hideDialog();
                  setImmediate(() => {
                    // eslint-disable-next-line no-unused-expressions
                    emailInputReference.current
                      ?.querySelector('input')
                      .select();
                  });
                }}
                variant="contained"
              >
                <OnboardingH2Bold>Change email address</OnboardingH2Bold>
              </OnboardingButton>
            </Grid>
          </OnboardingDialog>
        </FormContext>
      </form>
    </div>
  );
};

export default OnboardingCreateAccountView;
