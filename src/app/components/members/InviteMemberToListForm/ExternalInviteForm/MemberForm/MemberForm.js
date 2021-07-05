import React, { useRef, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { FormContext, useForm } from 'react-hook-form';
import Input from 'components/common/Input/Input';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { object, string } from 'yup';
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
  const emailInputReference = useRef(null);

  const formContext = useForm({
    validationSchema,
    defaultValues: initialValues,
  });

  const { handleSubmit, register, errors } = formContext;

  useEffect(() => {
    if (emailInputReference.current) {
      emailInputReference.current.focus();
    }
  }, [emailInputReference]);

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <FormContext {...formContext}>
        <Grid container direction="column" spacing={2}>
          <Grid
            container
            item
            direction="row"
            alignItems="flex-end"
            spacing={2}
          >
            <Grid item xs={6}>
              <Input
                ref={register}
                required
                name="firstName"
                label="First name"
                error={errors?.firstName?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                ref={register}
                required
                name="lastName"
                label="Last name"
                error={errors?.lastName?.message}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Input
              ref={element => {
                register(element);
                emailInputReference.current = element;
              }}
              required
              name="email"
              label="Email address"
              placeholder="Type the email address to invite"
              error={errors?.email?.message}
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
          <Grid container item direction="row" justify="center" spacing={2}>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="secondary"
                type="button"
                onClick={closeInviteForm}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth type="submit" disabled={disabled}>
                Invite
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </FormContext>
    </FormWrapper>
  );
};

export default MemberForm;
