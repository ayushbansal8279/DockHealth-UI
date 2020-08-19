/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { updateOrganizationName } from 'actions/organization-actions';
import Spacing from 'components/common/Spacing';
import Input from 'components/common/Input/Input';
import Button from 'components/common/Button/Button';
import { ORGANIZATION_TILE_COLORS } from 'styles/organization-tile-colors';
import {
  Title,
  FormWrapper,
  Description,
  BottomSection,
  ButtonWrapper,
  ColorPickerWrapper,
  TileSettingsHeader,
  TileSettingsDescription,
  ColorPickerLabel,
  ColorPickerHeader,
  InitialsInput,
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
  const organizationThemeColor = watch('oraganizationThemeColor');

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
      name: 'oraganizationThemeColor',
    });

    return () => {
      unregister('organizationName');
      unregister('organizationInitials');
      unregister('oraganizationThemeColor');
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
      <InitialsInput
        ref={register}
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
        backgroundColor={organizationThemeColor}
      />
      {errors?.organizationInitials && (
        <InitialsError>{errors?.organizationInitials?.message}</InitialsError>
      )}
      <Spacing vertical={4} />
      <BottomSection>
        <ColorPickerWrapper>
          <ColorPickerHeader>Choose your theme color</ColorPickerHeader>
          <Spacing vertical={3} />
          {ORGANIZATION_TILE_COLORS.map(({ uniqueName, hex }) => (
            <>
              <input
                ref={register}
                type="radio"
                name="oraganizationThemeColor"
                id={uniqueName}
                value={hex}
              />
              <ColorPickerLabel color={hex} htmlFor={uniqueName} />
            </>
          ))}
          {errors?.oraganizationThemeColor && (
            <InitialsError>
              {errors?.oraganizationThemeColor?.message}
            </InitialsError>
          )}
        </ColorPickerWrapper>
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
