import Grid from '@material-ui/core/Grid';
import React from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';
import { invitePersonToOrganization } from '../../../actions/people-actions';
import { showAlert, showToast } from '../../../helpers/utility-functions';
import {
  MobileInputComponent,
  OnboardingButton,
  OnboardingH1,
  OnboardingH2,
  OnboardingH2Bold,
  OnboardingHorizontalSpacing3,
  OnboardingInput,
  OnboardingSpacing3,
} from '../OnboardingTemplate.Components';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .required(REQUIRED_MESSAGE)
    .email('This field should have a valid email address'),
  mobilePhoneNumber: string()
    .transform(value => value.replace(/\D/g, ''))
    .required(REQUIRED_MESSAGE)
    .matches(/\d{10}/, 'This field should have a valid phone number'),
});

// eslint-disable-next-line unicorn/consistent-function-scoping
const onInvitationSubmit = ({ dispatch }) => async ({
  firstName,
  lastName,
  mobilePhoneNumber,
  email,
}) => {
  try {
    await invitePersonToOrganization({
      email,
      firstName,
      lastName,
      mobilePhoneNumber: `+1${mobilePhoneNumber.replace(/\D/g, '')}`,
    })(dispatch);

    showToast({
      icon: 'success',
      title: 'User invited successfully',
    });
  } catch (error) {
    showAlert({
      icon: 'error',
      title: 'Error',
      text:
        error?.message ?? 'Could not create account, please try again later',
    });
  }
};

const InvitationForm = ({ hideInvitationForm }) => {
  const formMethods = useForm({
    validationSchema,
    revalidationMode: 'onChange',
  });
  const dispatch = useDispatch();

  return (
    <form onSubmit={formMethods.handleSubmit(onInvitationSubmit({ dispatch }))}>
      <FormContext {...formMethods}>
        <OnboardingH1>
          Invite the authorized signer of your organization
        </OnboardingH1>
        <OnboardingSpacing3 />
        <Grid container spacing={16}>
          <Grid item sm={12} md={6}>
            <OnboardingInput
              label="First Name"
              name="firstName"
              placeholder="Enter invited person's first name here"
              required
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <OnboardingInput
              label="Last Name"
              name="lastName"
              placeholder="Enter invited person's last name here"
              required
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <OnboardingInput
              label="Email"
              name="email"
              placeholder="Enter invited person's email here"
              required
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <OnboardingInput
              label="Their Mobile Phone Number"
              name="mobilePhoneNumber"
              placeholder="Enter invited person's mobile phone number"
              CustomComponent={MobileInputComponent}
              required
            />
          </Grid>
          <Grid item sm={12}>
            <OnboardingSpacing3 />
          </Grid>
          <Grid item sm={12} container justify="flex-end">
            <OnboardingButton
              variant="outlinedLink"
              onClick={hideInvitationForm}
            >
              <OnboardingH2>Cancel</OnboardingH2>
            </OnboardingButton>
            <OnboardingHorizontalSpacing3 />
            <OnboardingButton variant="contained" type="submit">
              <OnboardingH2Bold>Send invite</OnboardingH2Bold>
            </OnboardingButton>
          </Grid>
        </Grid>
      </FormContext>
    </form>
  );
};

export default InvitationForm;
