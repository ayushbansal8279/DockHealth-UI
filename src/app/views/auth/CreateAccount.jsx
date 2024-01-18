import { Grid, Typography } from '@mui/material';
import queryString from 'query-string';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { setAuthBaseState } from 'actions/auth-base-actions';
import * as organizationApi from 'api/organization-api';
import { StyledLink } from 'components/auth/AuthComponents.styled';
import Spacing from 'components/common/Spacing';
import { useBoolean } from 'hooks/useBoolean';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import ConfirmEmailHeaderCheck from 'img/checked-circle.svg';
import Button from 'components/common/v2/Button/Button';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import envelope from 'img/modals/envelope-red.svg';
import { redTheme } from 'modal/themes/red-theme';
import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FixedWidthButtonWrapper,
} from 'modal/components/styled';
import SSOOptions from 'components/auth/SSOOptions';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import FormInput from 'components/common/v2/Input/FormInput';
import { Title, Subtitle } from 'components/auth/Title';
import { OnboardingDialog } from '../onboarding/OnboardingTemplate.Components';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  organization: string().required(REQUIRED_MESSAGE),
});

const externalUserValidationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  organization: string().required(REQUIRED_MESSAGE),
});

const onSubmit =
  ({ history, locationParameters }) =>
  ({ organization, lastName, firstName }) => {
    const referral = locationParameters.referral ?? '';
    sessionStorage.setItem('referral', referral);
    sessionStorage.setItem('firstName', firstName);
    sessionStorage.setItem('lastName', lastName);
    sessionStorage.setItem('organization', organization);
    history.push('/auth/complete-create-account');
  };

const getCustomTitleFromReferralConfig = async (
  referralCode,
  setCustomPageTitle,
) => {
  if (referralCode !== undefined && referralCode !== 'undefined') {
    const referralConfig = await organizationApi.getConfigurationForReferral(
      referralCode,
    );
    if (referralConfig) {
      setCustomPageTitle(referralConfig.messageCreateAccount);
    }
  }
};

const StyledGrid = styled(Grid)`
  && {
    height: 100%;
  }
`;

const StyledForm = styled.form`
  width: 100%;
`;

// eslint-disable-next-line sonarjs/cognitive-complexity
const CreateAccount = (props) => {
  const [isDialogShown, showDialog] = useBoolean(true);
  const [isUserExistsDialogShown, showUserExistsDialog, hideUserExistsDialog] =
    useBoolean(false);
  const [externalUserMode, setExternalUserMode] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('This Email is Already in Use');
  const [dialogMessage, setDialogMessage] = useState('');
  const [customPageTitle, setCustomPageTitle] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const formMethods = useForm({
    resolver: externalUserMode
      ? yupResolver(externalUserValidationSchema)
      : yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { setValue } = formMethods;

  const locationParameters = queryString.parse(history?.location?.search);
  const hasTrialReferral = Boolean(locationParameters.trial);

  useMount(() => {
    const { location } = props;
    const queryValues = queryString.parse(location.search);
    const {
      external,
      firstName: fname,
      lastName: lname,
      organization: oname,
    } = queryValues;

    if (fname) setValue('firstName', fname);
    if (lname) setValue('lastName', lname);
    if (oname) setValue('organization', oname);
    if (external === 'true') setExternalUserMode(true);

    if (sessionStorage.getItem('firstName'))
      setValue('firstName', sessionStorage.getItem('firstName'));
    if (sessionStorage.getItem('lastName'))
      setValue('lastName', sessionStorage.getItem('lastName'));
    if (sessionStorage.getItem('organization'))
      setValue('organization', sessionStorage.getItem('organization'));

    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
    if (locationParameters && locationParameters?.referral) {
      getCustomTitleFromReferralConfig(
        String(locationParameters?.referral),
        setCustomPageTitle,
      );
    }
  });

  const hasCustomPageTitle = customPageTitle !== '';
  const fontFamily = 'roboto condensed';

  const DockLogoImage = styled.img.attrs({
    src: DockHeaderLogo,
    alt: 'Dock Health logo',
  })`
    align: center;
    width: 100%;
    object-fit: contain;
    height: 69px;
  `;

  const onboardingMessageStyle = {
    fontFamily,
    fontWeight: 300,
    fontSize: '18px',
    padding: '0rem 1rem',
    display: 'block',
  };

  return (
    <StyledGrid container alignItems="center" justifyContent="center">
      <Grid item>
        <DockLogoImage />
        <Spacing vertical={5} />
      </Grid>
      <Grid item>
        <StyledForm
          onSubmit={formMethods.handleSubmit(
            onSubmit({
              history,
              setDialogMessage,
              setDialogTitle,
              showDialog,
              showUserExistsDialog,
              locationParameters,
            }),
            (error) => {
              console.log(`error: ${JSON.stringify(error)}`);
            },
          )}
        >
          <FormProvider {...formMethods}>
            {(hasTrialReferral || hasCustomPageTitle) && (
              <>
                <MontserratTypography variant="h2">
                  {hasCustomPageTitle
                    ? customPageTitle
                    : 'Start your free 15 day trial'}
                </MontserratTypography>
                <Spacing vertical={4} />
              </>
            )}
            <Title>Please create an account</Title>
            <Spacing vertical={3} />
            <Subtitle variant="p">
              Sign up here for full trial access to Dock’s time-saving templates
              for online task management.
            </Subtitle>
            <Spacing vertical={4} />
            <FormInput name="firstName" label="First Name" />
            <Spacing vertical={5} />
            <FormInput name="lastName" label="Last Name" />
            <Spacing vertical={5} />
            <FormInput name="organization" label="Organization" />
            <Spacing vertical={5} />
            <Button
              type="submit"
              fullWidth
              size="large"
              color={palette.brightOrange}
              secondaryColor={palette.oPlusRed}
            >
              Continue
            </Button>
            <Spacing vertical={5} />
            <SSOOptions />
            <Spacing vertical={5} />
            <MontserratTypography variant="h4" align="center">
              Already have an account?
              <StyledLink
                style={{
                  display: 'inline',
                  paddingLeft: '5px',
                  fontWeight: 600,
                }}
                to="/auth/login"
              >
                Log In
              </StyledLink>
            </MontserratTypography>
          </FormProvider>
        </StyledForm>
        <OnboardingDialog open={isDialogShown} fullWidth maxWidth="sm">
          <MuiThemeProvider theme={redTheme}>
            <ModalWrapper style={{ width: '500px' }}>
              <ModalIconContainer>
                <ModalMainIcon src={ConfirmEmailHeaderCheck} alt="envelope" />
                <Typography color="textPrimary" variant="h2" align="center">
                  {dialogTitle}{' '}
                </Typography>
              </ModalIconContainer>
              <ModalDescriptionContainer>
                <MontserratTypography variant="h4">
                  <span style={onboardingMessageStyle}> {dialogMessage} </span>
                </MontserratTypography>

                <Spacing vertical={2} />
              </ModalDescriptionContainer>
              <ButtonsContainer>
                <FixedWidthButtonWrapper width={300}>
                  <Button
                    fullWidth
                    variant="primary-red"
                    type="button"
                    onClick={() => {
                      hideUserExistsDialog();
                      history.push(`/auth/login`);
                    }}
                  >
                    Login To My Account
                  </Button>
                </FixedWidthButtonWrapper>
              </ButtonsContainer>
            </ModalWrapper>
          </MuiThemeProvider>
        </OnboardingDialog>
        <OnboardingDialog
          open={isUserExistsDialogShown}
          fullWidth
          maxWidth="sm"
        >
          <MuiThemeProvider theme={redTheme}>
            <ModalWrapper style={{ width: '500px' }}>
              <ModalIconContainer>
                <ModalMainIcon src={envelope} alt="envelope" />
                <Typography color="textPrimary" variant="h2" align="center">
                  {dialogTitle}{' '}
                </Typography>
              </ModalIconContainer>
              <ModalDescriptionContainer>
                <MontserratTypography variant="h4">
                  <span style={onboardingMessageStyle}> {dialogMessage} </span>
                </MontserratTypography>

                <Spacing vertical={2} />
              </ModalDescriptionContainer>
              <ButtonsContainer>
                <FixedWidthButtonWrapper width={300}>
                  <Button
                    fullWidth
                    variant="primary-red"
                    type="button"
                    onClick={() => {
                      hideUserExistsDialog();
                      history.push(`/auth/login`);
                    }}
                  >
                    Login To My Account
                  </Button>
                </FixedWidthButtonWrapper>
              </ButtonsContainer>
            </ModalWrapper>
          </MuiThemeProvider>
        </OnboardingDialog>
      </Grid>
    </StyledGrid>
  );
};

export default CreateAccount;
