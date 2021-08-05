import React, { useEffect, useRef } from 'react';
import { Grid } from '@material-ui/core';
import FormInput from 'components/common/Input/FormInput';
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
            <FormInput
              type="text"
              name="firstName"
              label="First name"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput type="text" name="lastName" label="Last name" required />
          </Grid>
        </Grid>
        <Grid item>
          <FormInput
            ref={emailInputReference}
            type="email"
            name="email"
            label="Email address"
            placeholder="Type the email address to invite"
            required
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
              variant="secondary"
              type="button"
              onClick={closeInviteForm}
            >
              No, cancel
            </Button>
          </Grid>
          <Grid item xs={5}>
            <Button fullWidth disabled={disabled} type="submit">
              Yes, approve
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </UserDetailsFormWrapper>
  );
};

export default UserDetailsStep;
