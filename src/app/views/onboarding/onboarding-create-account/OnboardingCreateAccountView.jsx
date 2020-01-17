import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { useMount, useToggle } from 'react-use';
import Swal from 'sweetalert2';
import { object, string } from 'yup';

import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import { register as registerAction } from '../../../api/user-api';
import useBoolean from '../../../hooks/useBoolean';
import {
  MobileInputComponent,
  OnboardingAdditionalFormControlText,
  OnboardingButton,
  OnboardingFieldsRequiredLabel,
  OnboardingH1Bold,
  OnboardingH2,
  OnboardingH3,
  OnboardingH4Toggle,
  OnboardingInput,
  OnboardingSpacing2,
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
const onSubmit = ({ showDialog }) => async ({
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

    showDialog();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text:
        error?.message ?? 'Could not create account, please try again later',
    });
    // fix z-index for drawer container
    Swal.getContainer().style.zIndex = 10000;
  }
};

const OnboardingCreateAccountView = () => {
  const dispatch = useDispatch();
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onChange',
  });

  const { handleSubmit, watch } = formMethods;

  const email = watch('email');

  const [isPasswordShown, togglePasswordShown] = useToggle(false);
  const [isDialogShown, showDialog, hideDialog] = useBoolean(false);

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 1 })(dispatch);
  });

  return (
    <div>
      <OnboardingH1Bold>Welcome, to your free 30 day trial</OnboardingH1Bold>
      <OnboardingH2>
        Dock Health is a simple, HIPAA compliant platform for managing clinical
        tasks as a team. Our mission is to offer a better way <b>to-do</b>{' '}
        healthcare.
      </OnboardingH2>
      <OnboardingSpacing4 />
      <OnboardingH2>Please create an account</OnboardingH2>
      <OnboardingSpacing2 />
      <OnboardingFieldsRequiredLabel>
        All fields required
      </OnboardingFieldsRequiredLabel>
      <OnboardingSpacing2 />
      <form onSubmit={handleSubmit(onSubmit({ showDialog }))}>
        <FormContext {...formMethods}>
          <Grid container spacing={8}>
            <Grid item sm={12} md={6}>
              <OnboardingInput
                label="First Name"
                name="firstName"
                placeholder="Enter your first name here"
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <OnboardingInput
                label="Last Name"
                name="lastName"
                placeholder="Enter your last name here"
              />
            </Grid>
            <Grid item sm={12}>
              <OnboardingInput
                label="Email"
                name="email"
                placeholder="Enter your email here"
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
                <OnboardingH2>Continue</OnboardingH2>
              </OnboardingButton>
              <OnboardingSpacing4 />
              <OnboardingH2>
                <span>I already have an account. </span>
                <Link to="/login">Sign in</Link>
              </OnboardingH2>
            </Grid>
          </Grid>
          <Dialog open={isDialogShown}>
            <DialogContent>
              <OnboardingH2>
                We just sent an email to {email} please go to your email and
                click on the link so that we can confirm your email address.
              </OnboardingH2>
              <Grid container justify="space-around">
                <OnboardingButton variant="outlinedLink">
                  Resend email
                </OnboardingButton>
                <OnboardingButton onClick={hideDialog} variant="outlinedLink">
                  Change email address
                </OnboardingButton>
              </Grid>
            </DialogContent>
          </Dialog>
        </FormContext>
      </form>
    </div>
  );
};

export default OnboardingCreateAccountView;
