import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';
import Input from 'components/common/Input/Input';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import {
  InfoText,
  InfoHeader,
  InfoContainer,
  UserDetailsFormWrapper,
} from './styled';

const UserDetailsStep = ({ closeInviteForm, disabled }) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const firstNameValue = watch('firstName');
  const lastNameInputValue = watch('lastName');
  const emailInputValue = watch('email');

  return (
    <UserDetailsFormWrapper>
      <Grid container direction="column" spacing={2}>
        <Grid
          container
          item
          direction="row"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item xs={6}>
            <Input
              type="text"
              name="firstName"
              label="First name"
              required
              error={errors?.firstName?.message}
              value={firstNameValue}
              onChange={event => setValue('firstName', event.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              type="text"
              name="lastName"
              label="Last name"
              required
              error={errors?.lastName?.message}
              value={lastNameInputValue}
              onChange={event => setValue('lastName', event.target.value)}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Input
            autoFocus
            type="email"
            name="email"
            label="Email address"
            placeholder="Type the email address to invite"
            required
            error={errors?.email?.message}
            value={emailInputValue}
            onChange={event => setValue('email', event.target.value)}
          />
        </Grid>
        <Grid item>
          <InfoContainer>
            <InfoHeader>New User</InfoHeader>
            <Spacing vertical={2} />
            <InfoText>An invitation will be sent to the user.</InfoText>
          </InfoContainer>
          <Spacing vertical={2} />
        </Grid>
        <Grid container item direction="row" justify="center" spacing={2}>
          <Grid item xs={5}>
            <Button
              fullWidth
              variant="secondary"
              type="button"
              onClick={closeInviteForm}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={5}>
            <Button fullWidth disabled={disabled} type="submit">
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </UserDetailsFormWrapper>
  );
};

export default UserDetailsStep;
