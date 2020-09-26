import { Grid, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { hashHistory } from 'react-router';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';
import { inviteAuthorizedSigner } from 'api/organization-api';
import Spacing from 'components/common/Spacing';
import {
  UniversalMobileInputComponent,
  UniversalMontserratInput,
} from 'components/common/UniversalInput/UniversalInput';
import { showAlert, useSmallScreen } from 'helpers/utility-functions';
import { MontserratTypography } from 'styles/theme-montserrat';
import { OnboardingButton } from '../OnboardingTemplate.Components';

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
        <Grid container alignItems="center" justify="space-between">
          <MontserratTypography variant="h3">
            Invite the authorized signer of your organization
          </MontserratTypography>
          {!isSmallScreen && (
            <IconButton
              size="small"
              color="inherit"
              onClick={hideInvitationForm}
            >
              <Close color="inherit" />
            </IconButton>
          )}
        </Grid>
        <Spacing vertical={4} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <UniversalMontserratInput
              label="First Name"
              name="firstName"
              required
              autoComplete={uuid()}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <UniversalMontserratInput
              label="Last Name"
              name="lastName"
              required
              autoComplete={uuid()}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <UniversalMontserratInput
              label="His/Her Email"
              name="email"
              required
              autoComplete={uuid()}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <UniversalMontserratInput
              label="His/Her Mobile Phone Number"
              name="mobilePhoneNumber"
              CustomComponent={UniversalMobileInputComponent}
              required
              autoComplete={uuid()}
            />
          </Grid>
          {!isSmallScreen && <Spacing vertical={4} />}
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
              style={{
                order: isSmallScreen ? 3 : 1,
              }}
            >
              Cancel
            </OnboardingButton>
            <div style={{ order: 2 }}>
              {isSmallScreen ? (
                <Spacing vertical={4} style={{ order: 2 }} />
              ) : (
                <Spacing horizontal={4} style={{ order: 2 }} />
              )}
            </div>
            <OnboardingButton
              variant={isSmallScreen ? 'containedAutoWidth' : 'contained'}
              type="submit"
              style={{ order: isSmallScreen ? 1 : 3 }}
            >
              Send invite
            </OnboardingButton>
          </Grid>
        </Grid>
      </FormContext>
    </form>
  );
};

export default InvitationForm;
