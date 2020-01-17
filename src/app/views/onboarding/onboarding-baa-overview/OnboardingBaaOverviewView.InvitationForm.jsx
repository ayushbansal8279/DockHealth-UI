import Grid from '@material-ui/core/Grid';
import React from 'react';
import useForm from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { object, string } from 'yup';

import { invitePersonToOrganization } from '../../../actions/people-actions';
import {
  MobileInputComponent,
  OnboardingButton,
  OnboardingFormControl,
  OnboardingH1,
  OnboardingH4Error,
  OnboardingHorizontalSpacing3,
  OnboardingInputBase,
  OnboardingInputLabel,
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

    Swal.fire({
      icon: 'success',
      title: 'User invited successfully',
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      position: 'top-end',
    });
    // fix z-index for drawer container
    Swal.getContainer().style.zIndex = 10000;
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

const InvitationForm = ({ hideInvitationForm }) => {
  const { errors, handleSubmit, register } = useForm({
    validationSchema,
    revalidationMode: 'onChange',
  });
  const dispatch = useDispatch();

  return (
    <form onSubmit={handleSubmit(onInvitationSubmit({ dispatch }))}>
      <OnboardingH1>
        Invite the authorized signer of your organization
      </OnboardingH1>
      <OnboardingSpacing3 />
      <Grid container spacing={16}>
        <Grid item sm={12} md={6}>
          <OnboardingFormControl fullWidth>
            <OnboardingInputLabel>First Name</OnboardingInputLabel>
            <OnboardingInputBase
              name="firstName"
              placeholder="Enter invited person's first name here"
              inputRef={register}
              error={Boolean(errors.firstName?.message)}
            />
          </OnboardingFormControl>
          <OnboardingH4Error>{errors.firstName?.message}</OnboardingH4Error>
        </Grid>
        <Grid item sm={12} md={6}>
          <OnboardingFormControl fullWidth>
            <OnboardingInputLabel>Last Name</OnboardingInputLabel>
            <OnboardingInputBase
              name="lastName"
              placeholder="Enter invited person's last name here"
              inputRef={register}
              error={Boolean(errors.lastName?.message)}
            />
          </OnboardingFormControl>
          <OnboardingH4Error>{errors.lastName?.message}</OnboardingH4Error>
        </Grid>
        <Grid item sm={12} md={6}>
          <OnboardingFormControl fullWidth>
            <OnboardingInputLabel>Email</OnboardingInputLabel>
            <OnboardingInputBase
              name="email"
              placeholder="Enter invited person's email here"
              inputRef={register}
              error={Boolean(errors.email?.message)}
            />
          </OnboardingFormControl>
          <OnboardingH4Error>{errors.email?.message}</OnboardingH4Error>
        </Grid>
        <Grid item sm={12} md={6}>
          <OnboardingFormControl fullWidth>
            <OnboardingInputLabel>
              Their Mobile Phone Number
            </OnboardingInputLabel>
            <OnboardingInputBase
              name="mobilePhoneNumber"
              placeholder="Enter invited person's mobile phone number"
              inputRef={register}
              error={Boolean(errors.mobilePhoneNumber?.message)}
              inputComponent={MobileInputComponent}
            />
          </OnboardingFormControl>
          <OnboardingH4Error>
            {errors.mobilePhoneNumber?.message}
          </OnboardingH4Error>
        </Grid>
        <Grid item sm={12}>
          <OnboardingSpacing3 />
        </Grid>
        <Grid item sm={12} container justify="flex-end">
          <OnboardingButton variant="outlined" onClick={hideInvitationForm}>
            Cancel
          </OnboardingButton>
          <OnboardingHorizontalSpacing3 />
          <OnboardingButton variant="contained" type="submit">
            Send invite
          </OnboardingButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default InvitationForm;
