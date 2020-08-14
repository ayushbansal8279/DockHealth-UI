/* eslint-disable jsx-a11y/label-has-associated-control */
import { Grid } from '@material-ui/core';
import React, { useCallback, useRef, useEffect } from 'react';
import { FormContext, useForm, useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { setOnboardingCurrentStep } from 'actions/onboarding-progress-actions';
import { updateOrganizationName } from 'actions/organization-actions';
import { findAllUsers, loading } from 'actions/people-actions';
import * as userApi from 'api/user-api';
import Spacing from 'components/common/Spacing';
import Input from 'components/common/Input/Input';
import Button from 'components/common/Button/Button';
import { UniversalMontserratInput } from 'components/userProfileView/UniversalInput';
import { MontserratTypography } from 'styles/theme-montserrat';
import { OnboardingButton } from '../OnboardingTemplate.Components';
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
} from './styled';

const goToMainPage = () => {
  hashHistory.push('/');
};

const onSubmit = ({ dispatch }) => ({ organizationName }) => {
  updateOrganizationName({ organizationName })(dispatch).then(() => {
    goToMainPage();
  });
};

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  organizationName: string().required(REQUIRED_MESSAGE),
});

const ORGANIZATION_TILE_COLORS = [
  {
    uniqueName: 'yellow',
    hex: '#fdcd38',
  },
  {
    uniqueName: 'orange',
    hex: '#ee8b31',
  },
  {
    uniqueName: 'lightBlue',
    hex: '#1ba5e3',
  },
  {
    uniqueName: 'blue',
    hex: '#094a85',
  },
  {
    uniqueName: 'purple',
    hex: '#553ebd',
  },
  {
    uniqueName: 'red',
    hex: '#e7473d',
  },
  {
    uniqueName: 'green',
    hex: '#bcd44c',
  },
];

const OnboardingTeamOrgSetupViewDesktop = () => {
  const formContext = useForm({
    // validationSchema,
    revalidationMode: 'onChange',
  });

  const {
    register,
    errors,
    unregister,
    handleSubmit,
    setValue,
    watch,
  } = formContext;

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

    // register({ name: 'listDescription' });
    // register({ name: 'owner' });
    // register({ name: 'adminIdentifiers' });
    // register({ name: 'memberIdentifiers' });

    // setDefaultFormValues();

    return () => {
      unregister('organizationName');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outerContainerReference = useRef(null);
  const dispatch = useDispatch();

  const getAllUsers = useCallback(() => {
    userApi.isAuthenticated({
      isLoggedIn: (loggedIn, user) => {
        if (loggedIn) {
          userApi.getUserByEmail(user.username, user).then(data => {
            if (data.profileThumbnailPictureHash) {
              userApi.getUserProfilePic(data.userIdentifier, 'PROFILE');
            }
            userApi.getUserNotoficationPrefs();

            loading()(dispatch);
            findAllUsers()(dispatch);
          });
        }
      },
    });
  }, [dispatch]);

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 4 })(dispatch);
    getAllUsers();
  });

  return (
    <FormWrapper
      onSubmit={handleSubmit(onSubmit({ dispatch }))}
      ref={outerContainerReference}
    >
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
        // value={listNameValue}
      />

      <Spacing vertical={4} />
      <TileSettingsHeader>Create your organization tile</TileSettingsHeader>
      <TileSettingsDescription>
        2-3 initials to represent your organization
      </TileSettingsDescription>
      <Spacing vertical={4} />
      <InitialsInput
        ref={register({ required: true, maxLength: 3, minLength: 2 })}
        placeholder="abc"
      />
      <Spacing vertical={4} />
      <BottomSection>
        <ColorPickerWrapper>
          <ColorPickerHeader>Choose your theme color</ColorPickerHeader>
          <Spacing vertical={3} />
          {ORGANIZATION_TILE_COLORS.map(({ uniqueName, hex }) => (
            <>
              <input type="radio" name="color" id={uniqueName} value={hex} />
              <ColorPickerLabel color={hex} htmlFor={uniqueName}>
                {/* <span className="red" /> */}
              </ColorPickerLabel>
            </>
          ))}
        </ColorPickerWrapper>
        <ButtonWrapper>
          <Button fullWidth>Continue</Button>
        </ButtonWrapper>
      </BottomSection>
      {/* <Spacing vertical={6} />
        <MontserratTypography variant="h1" weight="600">
          TIME TO CHOOSE A NAME
        </MontserratTypography>
        <Spacing vertical={5} />
        <MontserratTypography variant="h3">
          What would you like to call your group or practice?
        </MontserratTypography>
        <MontserratTypography variant="h3">
          You&apos;re Welcome to be creative, or just use your
          organization&apos;s official name.
        </MontserratTypography>
        <Spacing vertical={5} />
        <UniversalMontserratInput
          autoFocus
          label="What is the name of your group or practice?"
          name="organizationName"
          required
        />
        <Spacing vertical={4} />
        <Grid container justify="flex-end">
          <Spacing horizontal={4} />
          <OnboardingButton variant="contained" type="submit" size="small">
            Continue
          </OnboardingButton> 
        </Grid>
          */}
    </FormWrapper>
  );
};

export default OnboardingTeamOrgSetupViewDesktop;
