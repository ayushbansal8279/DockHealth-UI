import React, { useEffect, useRef } from 'react';
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
  const emailInputReference = useRef(null);

  useEffect(() => {
    if (emailInputReference.current) {
      emailInputReference.current.focus();
    }
  }, [emailInputReference]);

  const { errors, watch, setValue } = useFormContext();

  const firstNameValue = watch('firstName');
  const lastNameInputValue = watch('lastName');
  const emailInputValue = watch('email');

  return (
    <UserDetailsFormWrapper>
      <Grid container direction="column" spacing={2}>
        <Grid container item direction="row" alignItems="flex-end" spacing={2}>
          <Grid item xs={6}>
            <Input
              type="text"
              name="firstName"
              label="First name"
              styling="secondary"
              showError
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
              styling="secondary"
              showError
              required
              error={errors?.lastName?.message}
              value={lastNameInputValue}
              onChange={event => setValue('lastName', event.target.value)}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Input
            ref={emailInputReference}
            type="email"
            name="email"
            label="Email address"
            styling="secondary"
            placeholder="Type the email address to invite"
            fullWidth
            showError
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
            <InfoText>
              Once an account is created, this person will be part of your
              subscription. Do you approve adding this person to your
              subscription?
            </InfoText>
          </InfoContainer>
          <Spacing vertical={2} />
        </Grid>
        <Grid container item direction="row" justify="center" spacing={2}>
          <Grid item xs={5}>
            <Button
              fullWidth
              variant="outlined"
              type="button"
              size="small"
              onClick={closeInviteForm}
            >
              No, cancel
            </Button>
          </Grid>
          <Grid item xs={5}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              disabled={disabled}
              type="submit"
            >
              Yes, approve
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </UserDetailsFormWrapper>
  );
};

export default UserDetailsStep;
