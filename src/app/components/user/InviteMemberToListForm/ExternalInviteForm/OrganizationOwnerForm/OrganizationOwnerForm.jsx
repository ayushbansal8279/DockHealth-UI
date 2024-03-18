import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Spacing from 'components/common/Spacing';
import UserDetailsStep from './UserDetailsStep';
import UserRoleStep from './UserRoleStep';
import { FormWrapper, Step } from './styled';

const REQUIRED_FIELD = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_FIELD),
  lastName: string().required(REQUIRED_FIELD),
  email: string()
    .required(REQUIRED_FIELD)
    .email('Please enter a valid email address'),
});

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

  const formContext = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { ...initialValues, userRole: 'MEMBER' },
  });

  const { handleSubmit, register, unregister } = formContext;

  useEffect(() => {
    register('firstName');
    register('lastName');
    register('email');
    register('userRole');

    return () => {
      unregister('firstName');
      unregister('lastName');
      unregister('email');
      unregister('userRole');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ownerFormSubmit = (data) => {
    if (currentFormStep === FormStep.USER_DETAILS) {
      setCurrentFormStep(FormStep.USER_ROLE);
    } else {
      onSubmit(data);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(ownerFormSubmit)}>
      <FormProvider {...formContext}>
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
        <Spacing vertical={4} />
      </FormProvider>
    </FormWrapper>
  );
};

export default OrganizationOwnerForm;
