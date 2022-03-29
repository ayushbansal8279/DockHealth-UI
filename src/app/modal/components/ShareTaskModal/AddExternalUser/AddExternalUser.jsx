import React, { useMemo } from 'react';
import { Box, Grid } from '@material-ui/core';
import { FormContext, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';

const REQUIRED_FIELD = 'This field is required';

const AddExternalUser = props => {
  const { initialValues, selectedUsers, onAdd, onCancel } = props;

  const validationSchema = useMemo(
    () =>
      object().shape({
        firstName: string().required(REQUIRED_FIELD),
        lastName: string().required(REQUIRED_FIELD),
        email: string()
          .required(REQUIRED_FIELD)
          .email('Please enter a valid email address')
          .test(
            'uniqueEmail',
            'Email already exists',
            function validateUniqueEmail(value) {
              return !selectedUsers?.find(({ email }) => email === value);
            },
          ),
      }),
    [selectedUsers],
  );

  const formContext = useForm({
    validationSchema,
    defaultValues: initialValues,
  });

  const { handleSubmit } = formContext;

  return (
    <form onSubmit={handleSubmit(onAdd)}>
      <FormContext {...formContext}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormInput
              required
              label="First"
              name="firstName"
              autoFocus={!initialValues.firstName}
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              required
              label="Last"
              name="lastName"
              autoFocus={!initialValues.lastName && initialValues.firstName}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInput
              required
              label="Email Address"
              name="email"
              autoFocus={
                !initialValues.email &&
                initialValues.firstName &&
                initialValues.lastName
              }
            />
          </Grid>
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            mt="16px"
          >
            <Button width="auto" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button width="auto" type="submit">
              Invite
            </Button>
          </Box>
        </Grid>
      </FormContext>
    </form>
  );
};

export default AddExternalUser;
