import Grid from '@material-ui/core/Grid';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { hashHistory } from 'react-router';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';
import { inviteAuthorizedSigner } from '../../../api/organization-api';
import { showAlert, useSmallScreen } from '../../../helpers/utility-functions';
import {
  MobileInputComponent,
  OnboardingButton,
  OnboardingDivider,
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

const goToBaaInvitationSent = () => {
  hashHistory.push('/onboarding/baa-invitation-sent');
};

// eslint-disable-next-line unicorn/consistent-function-scoping
const onInvitationSubmit = () => async ({
  firstName,
  lastName,
  mobilePhoneNumber,
  email,
}) => {
  const errorMessage = 'Error sending invitation, please try again later';
  try {
    inviteAuthorizedSigner({ email, firstName, lastName, mobilePhoneNumber })
      .then(data => {
        if (data.statusCode === 'SUCCESS') {
          goToBaaInvitationSent();
        } else {
          showAlert({
            status: 'error',
            title: 'Error',
            text: errorMessage,
          });
        }
      })
      .catch(error => {
        showAlert({
          status: 'error',
          title: 'Error',
          text: error?.message ?? errorMessage,
        });
      });
  } catch (error) {
    showAlert({
      icon: 'error',
      title: 'Error',
      text: error?.message ?? errorMessage,
    });
  }
};

const InvitationForm = ({ hideInvitationForm }) => {
  const formMethods = useForm({
    validationSchema,
    revalidationMode: 'onChange',
  });

  const isSmallScreen = useSmallScreen();

  return (
    <form
      onSubmit={formMethods.handleSubmit(onInvitationSubmit())}
      autoComplete="off"
      autoCorrect="off"
    >
      <FormContext {...formMethods}>
        {!isSmallScreen && <OnboardingDivider />}
        <Grid container alignItems="center" justify="space-between">
          <OnboardingH2>
            Invite the authorized signer of your organization
          </OnboardingH2>
          {!isSmallScreen && (
            <OnboardingButton variant="outlined" onClick={hideInvitationForm}>
              <OnboardingH2>&times;</OnboardingH2>
            </OnboardingButton>
          )}
        </Grid>
        <OnboardingSpacing3 />
        <Grid container spacing={16}>
          <Grid item xs={12} sm={12} md={6}>
            <OnboardingInput
              label="First Name"
              name="firstName"
              placeholder="Enter invited person's first name here"
              required
              InputBaseProps={{
                autoComplete: uuid(),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <OnboardingInput
              label="Last Name"
              name="lastName"
              placeholder="Enter invited person's last name here"
              required
              InputBaseProps={{
                autoComplete: uuid(),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <OnboardingInput
              label="His/Her Email"
              name="email"
              placeholder="Enter invited person's email here"
              required
              InputBaseProps={{
                autoComplete: uuid(),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <OnboardingInput
              label="His/Her Mobile Phone Number"
              name="mobilePhoneNumber"
              placeholder="Enter invited person's mobile phone number"
              CustomComponent={MobileInputComponent}
              required
              InputBaseProps={{
                autoComplete: uuid(),
              }}
            />
          </Grid>
          {!isSmallScreen && <OnboardingSpacing3 />}
          <Grid
            item
            xs={12}
            sm={12}
            container
            justify="flex-end"
            direction={isSmallScreen ? 'column' : 'row'}
          >
            <OnboardingButton
              variant="outlinedSkip"
              onClick={hideInvitationForm}
              style={{ order: isSmallScreen ? 3 : 1 }}
            >
              <OnboardingH2>Cancel</OnboardingH2>
            </OnboardingButton>
            {isSmallScreen ? (
              <OnboardingSpacing3 style={{ order: 2 }} />
            ) : (
              <OnboardingHorizontalSpacing3 style={{ order: 2 }} />
            )}
            <OnboardingButton
              variant={isSmallScreen ? 'containedAutoWidth' : 'contained'}
              type="submit"
              style={{ order: isSmallScreen ? 1 : 3 }}
            >
              <OnboardingH2Bold>Send invite</OnboardingH2Bold>
            </OnboardingButton>
          </Grid>
        </Grid>
      </FormContext>
    </form>
  );
};

export default InvitationForm;
