import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import OnboardingIndicator from 'components/common/OnboardingIndicator/OnboardingIndicator';
import Spacing from 'components/common/Spacing';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';
import palette from 'styles/palette';
import {
  Title,
  FormWrapper,
  Description,
  ButtonWrapper,
  ButtonsContainer,
} from './styled';

const validateOrganizationName = (value) => {
  if (![...value]?.filter((char) => char !== ' ').length > 0) {
    return 'This field is required';
  }

  return true;
};

const OrganizationForm = ({ onSubmit, onCancel }) => {
  const { orgUserRole } = useSelector(userProfileSelector);
  const firstTimeUser = localStorage.getItem('STORAGE_NEW_USER_FIRST_TIME');

  const formMethods = useForm({
    revalidationMode: 'onChange',
  });

  const { handleSubmit } = formMethods;

  return (
    <>
      {firstTimeUser && (
        <>
          <OnboardingIndicator
            steps={orgUserRole === 'OWNER' ? 5 : 3}
            // eslint-disable-next-line sonarjs/no-all-duplicated-branches
            completedSteps={orgUserRole === 'OWNER' ? 3 : 3}
          />
          <Spacing vertical={5} />
        </>
      )}
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...formMethods}>
          <Title>Name your organization</Title>
          <Spacing vertical={5} />
          <Description>
            What would you like to call your organization?
            <br />
            Be creative, or just use your organization&apos;s official name.
          </Description>
          <Spacing vertical={4} />
          <FormInput
            required
            label="Organization name"
            name="organizationName"
            placeholder="What is the name of your organization?"
            validate={validateOrganizationName}
          />
          <Spacing vertical={4} />
          <ButtonsContainer>
            {typeof onCancel === 'function' && (
              <Button onClick={onCancel} type="button" variant="text">
                Cancel
              </Button>
            )}
            <ButtonWrapper>
              <Button
                fullWidth
                type="submit"
                color={palette.brightOrange}
                secondaryColor={palette.oPlusRed}
              >
                Continue
              </Button>
            </ButtonWrapper>
          </ButtonsContainer>
        </FormProvider>
      </FormWrapper>
    </>
  );
};

export default OrganizationForm;
