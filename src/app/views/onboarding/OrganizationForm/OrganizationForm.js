import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import OnboardingIndicator from 'components/common/OnboardingIndicator/OnboardingIndicator';
import Spacing from 'components/common/Spacing';
import Input from 'components/common/Input/Input';
import Button from 'components/common/Button/Button';

import {
  Title,
  FormWrapper,
  Description,
  ButtonWrapper,
  InitialsError,
  ButtonsContainer,
} from './styled';

const OrganizationForm = ({ onSubmit, onCancel }) => {
  const { orgUserRole } = useSelector(userProfileSelector);
  const firstTimeUser = localStorage.getItem('STORAGE_NEW_USER_FIRST_TIME');

  const formContext = useForm({
    revalidationMode: 'onChange',
  });

  const { register, errors, unregister, handleSubmit, watch } = formContext;

  const organizationNameValue = watch('organizationName');

  useEffect(() => {
    register(
      {
        name: 'organizationName',
      },
      {
        validate: value => {
          if (![...value]?.filter(char => char !== ' ').length > 0) {
            return 'This field is required';
          }

          return true;
        },
      },
    );

    return () => {
      unregister('organizationName');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {firstTimeUser && (
        <>
          <OnboardingIndicator
            steps={orgUserRole === 'OWNER' ? 4 : 3}
            completedSteps={orgUserRole === 'OWNER' ? 4 : 3}
          />
          <Spacing vertical={5} />
        </>
      )}
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <Title>Name your organization</Title>
        <Spacing vertical={5} />
        <Description>
          What would you like to call your organization?
          <br />
          Be creative, or just use your organization&apos;s official name.
        </Description>
        <Spacing vertical={4} />
        <Input
          ref={register}
          error={errors?.organizationName?.message}
          fullWidth
          label="What is the name of your organization?"
          name="organizationName"
          required
          showError
          centerizedLabelOnStart
          value={organizationNameValue}
        />

        {errors?.organizationInitials && (
          <InitialsError>{errors?.organizationInitials?.message}</InitialsError>
        )}
        <Spacing vertical={4} />

        <ButtonsContainer>
          {typeof onCancel === 'function' && (
            <Button onClick={onCancel} type="button" variant="text">
              Cancel
            </Button>
          )}
          <ButtonWrapper>
            <Button fullWidth type="submit">
              Continue
            </Button>
          </ButtonWrapper>
        </ButtonsContainer>
      </FormWrapper>
    </>
  );
};

export default OrganizationForm;
