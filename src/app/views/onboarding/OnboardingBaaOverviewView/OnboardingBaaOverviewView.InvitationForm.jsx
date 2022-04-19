import { Grid, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';
import { inviteAuthorizedSigner } from 'api/organization-api';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { showAlert, useSmallScreen } from 'helpers/utility-functions';
import { MontserratTypography } from 'styles/theme-montserrat';
import FormInput from 'components/common/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .required(REQUIRED_MESSAGE)
    .email('Please enter a valid email address'),
  mobilePhoneNumber: string()
    .transform(value => value.replace(/\D/g, ''))
    .required(REQUIRED_MESSAGE)
    .matches(/\d{10}/, 'Please enter a valid phone number'),
});

const goToBaaInvitationSent = history => {
  history.push('/onboarding/baa-invitation-sent');
};

// eslint-disable-next-line unicorn/consistent-function-scoping
const onInvitationSubmit = history => async ({
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
          goToBaaInvitationSent(history);
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
  const history = useHistory();
  const formMethods = useForm({
    validationSchema,
    revalidationMode: 'onChange',
  });

  const isSmallScreen = useSmallScreen();

  return (
    <form
      onSubmit={formMethods.handleSubmit(onInvitationSubmit(history))}
      autoComplete="off"
      autoCorrect="off"
    >
      <FormProvider {...formMethods}>
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
          <Grid item xs={12} md={6}>
            <FormInput
              label="First Name"
              name="firstName"
              required
              autoComplete={uuid()}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormInput
              label="Last Name"
              name="lastName"
              required
              autoComplete={uuid()}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormInput
              label="His/Her Email"
              name="email"
              required
              autoComplete={uuid()}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormPhoneNumberInput
              required
              label="His/Her Mobile Phone Number"
              name="mobilePhoneNumber"
              autoComplete={uuid()}
            />
          </Grid>
          <Spacing vertical={4} />
          <Grid item xs={6}>
            <Button fullWidth variant="secondary" onClick={hideInvitationForm}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="primary" type="submit">
              Send invite
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </form>
  );
};

export default InvitationForm;
