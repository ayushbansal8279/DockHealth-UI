import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { FormContext, useForm } from 'react-hook-form';
// import { object, string } from 'yup';
import Spacing from 'components/common/Spacing';
import UserDetailsStep from './UserDetailsStep';
import UserRoleStep from './UserRoleStep';
import { FormWrapper, Step } from './styled';

// const REQUIRED_FIELD = 'This field is required';

// const validationSchema = object().shape({
//   firstName: string().required(REQUIRED_FIELD),
//   lastName: string().required(REQUIRED_FIELD),
//   email: string()
//     .required(REQUIRED_FIELD)
//     .email('Please enter a valid email address'),
// });

const FormStep = {
  USER_DETAILS: 'USER_DETAILS',
  USER_ROLE: 'USER_ROLE',
};

const OrganizationOwnerForm = ({
  initialValues,
  disabled,
  onSubmit,
  closeInviteForm,
}) => {
  const [currentFormStep, setCurrentFormStep] = useState(FormStep.USER_DETAILS);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);

  const formContext = useForm({
    // validationSchema,
    defaultValues: { ...initialValues, userRole: 'GUEST' },
  });

  const { handleSubmit, register, unregister } = formContext;

  useEffect(() => {
    if (currentFormStep === FormStep.USER_DETAILS) {
      register({ name: 'firstName' });
      register({ name: 'lastName' });
      register({ name: 'email' });
    } else {
      register({ name: 'userRole' });
    }

    return () => {
      if (currentFormStep === FormStep.USER_DETAILS) {
        unregister('firstName');
        unregister('lastName');
        unregister('email');
      } else {
        unregister('userRole');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormStep]);

  const ownerFormSubmit = data => {
    if (currentFormStep === FormStep.USER_DETAILS) {
      setCurrentFormStep(FormStep.USER_ROLE);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      formContext.defaultValues = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      };
    } else {
      const inviteData = data;
      inviteData.firstName = firstName;
      inviteData.lastName = lastName;
      inviteData.email = email;
      onSubmit(inviteData);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(ownerFormSubmit)}>
      <FormContext {...formContext}>
        {currentFormStep === FormStep.USER_DETAILS ? (
          <UserDetailsStep
            closeInviteForm={closeInviteForm}
            disabled={disabled}
          />
        ) : (
          <UserRoleStep
            navigateToPreviousStep={() =>
              setCurrentFormStep(FormStep.USER_DETAILS)
            }
            disabled={disabled}
          />
        )}
        <Grid container direction="row" justify="center">
          {Object.values(FormStep).map(value => (
            <Step
              key={value}
              isCurrent={currentFormStep >= value}
              isDisabled
              type="button"
            />
          ))}
        </Grid>
        <Spacing vertical={4} />
      </FormContext>
    </FormWrapper>
  );
};

export default OrganizationOwnerForm;
