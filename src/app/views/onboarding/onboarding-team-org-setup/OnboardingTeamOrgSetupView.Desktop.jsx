/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { updateOrganizationName } from 'actions/organization-actions';
import Spacing from 'components/common/Spacing';
import Input from 'components/common/Input/Input';
import Button from 'components/common/Button/Button';
import OrganizationAvatarInput from 'components/Organization/OrganizationAvatarInput/OrganizationAvatarInput';
import OrganizationColorPicker from 'components/Organization/OrganizationColorPicker/OrganizationColorPicker';
import {
  Title,
  FormWrapper,
  Description,
  BottomSection,
  ButtonWrapper,
  TileSettingsHeader,
  TileSettingsDescription,
  ColorPickerHeader,
  InitialsError,
} from './styled';

const onSubmit = ({ dispatch }) => ({
  organizationName,
  organizationInitials,
  organizationThemeColor,
}) => {
  updateOrganizationName({
    organizationName,
    organizationInitials,
    organizationProfileColor: organizationThemeColor,
  })(dispatch).then(() => {
    hashHistory.push('/');
  });
};

const OnboardingTeamOrgSetupViewDesktop = () => {
  const formContext = useForm({
    revalidationMode: 'onChange',
  });

  const dispatch = useDispatch();

  const {
    register,
    errors,
    unregister,
    handleSubmit,
    setValue,
    watch,
  } = formContext;

  const organizationNameValue = watch('organizationName');
  const organizationInitialsValue = watch('organizationInitials');
  const organizationThemeColorValue = watch('organizationThemeColor');

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
    register(
      { name: 'organizationInitials' },
      {
        minLength: {
          value: 2,
          message: 'Your initials must contain at least 2 letters',
        },
      },
    );
    register({
      name: 'organizationThemeColor',
    });

    return () => {
      unregister('organizationName');
      unregister('organizationInitials');
      unregister('organizationThemeColor');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit({ dispatch }))}>
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

      <Spacing vertical={4} />
      <TileSettingsHeader>Create your organization tile</TileSettingsHeader>
      <TileSettingsDescription>
        2-3 initials to represent your organization
      </TileSettingsDescription>
      <Spacing vertical={4} />
      <OrganizationAvatarInput
        name="organizationInitials"
        placeholder="abc"
        onChange={event => {
          const newValue = event.target.value.trim().toUpperCase();

          if (newValue.length > 3) {
            setValue('organizationInitials', newValue.slice(0, 3));
          } else {
            setValue('organizationInitials', newValue);
          }
        }}
        value={organizationInitialsValue}
        backgroundColor={organizationThemeColorValue}
      />
      {errors?.organizationInitials && (
        <InitialsError>{errors?.organizationInitials?.message}</InitialsError>
      )}
      <Spacing vertical={4} />
      <BottomSection>
        <div>
          <ColorPickerHeader>Choose your theme color</ColorPickerHeader>
          <Spacing vertical={3} />
          <OrganizationColorPicker
            name="organizationThemeColor"
            value={organizationThemeColorValue}
            onChange={event => {
              const { name, value } = event.target;
              setValue(name, value);
            }}
          />
          {errors?.oraganizationThemeColor && (
            <InitialsError>
              {errors?.oraganizationThemeColor?.message}
            </InitialsError>
          )}
        </div>
        <ButtonWrapper>
          <Button fullWidth type="submit">
            Continue
          </Button>
        </ButtonWrapper>
      </BottomSection>
    </FormWrapper>
  );
};

export default OnboardingTeamOrgSetupViewDesktop;
