import React from 'react';
import { Grid } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import FormInput from 'components/common/Input/FormInput';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormWrapper, InfoContainer, InfoHeader, InfoText } from './styled';

const REQUIRED_FIELD = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_FIELD),
  lastName: string().required(REQUIRED_FIELD),
  email: string()
    .required(REQUIRED_FIELD)
    .email('Please enter a valid email address'),
});

const MemberForm = ({ initialValues, closeInviteForm, onSubmit, disabled }) => {
  const formContext = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const { handleSubmit } = formContext;

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...formContext}>
        <Grid container direction="column" spacing={2}>
          <Grid
            container
            item
            direction="row"
            alignItems="flex-end"
            spacing={2}
          >
            <Grid item size={6}>
              <FormInput
                autoFocus={!initialValues.firstName}
                required
                name="firstName"
                label="First name"
              />
            </Grid>
            <Grid item size={6}>
              <FormInput
                autoFocus={initialValues.firstName && !initialValues.lastName}
                required
                name="lastName"
                label="Last name"
              />
            </Grid>
          </Grid>
          <Grid item>
            <FormInput
              autoFocus={
                initialValues.firstName &&
                initialValues.lastName &&
                !initialValues.email
              }
              required
              name="email"
              label="Email address"
              placeholder="Type the email address to invite"
            />
          </Grid>
          <Grid item>
            <InfoContainer>
              <InfoHeader>Approval Required</InfoHeader>
              <Spacing vertical={2} />
              <InfoText>
                The owner of your organization is required to approve new users.
                When you click invite an email will be sent to the group
                owner(s).
              </InfoText>
            </InfoContainer>
            <Spacing vertical={2} />
          </Grid>
          <Grid
            container
            item
            direction="row"
            justifyContent="center"
            spacing={2}
          >
            <Grid item size={4}>
              <Button
                fullWidth
                variant="secondary"
                type="button"
                onClick={closeInviteForm}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item size={4}>
              <Button fullWidth type="submit" disabled={disabled}>
                Invite
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </FormProvider>
    </FormWrapper>
  );
};

export default MemberForm;
