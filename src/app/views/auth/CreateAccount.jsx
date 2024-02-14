import { Grid, Typography } from '@mui/material';
import queryString from 'query-string';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
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
import { OutfitTypography } from 'styles/theme-outfit';
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

const onSubmit =
  ({ history, locationParameters, isUserInvited, organizationName }) =>
  ({ organization, lastName, firstName }) => {
    const referral = locationParameters.referral ?? '';
    sessionStorage.setItem('referral', referral);
    sessionStorage.setItem('firstName', firstName);
    sessionStorage.setItem('lastName', lastName);
    {
      isUserInvited
        ? sessionStorage.setItem('isUserInvited', isUserInvited)
        : sessionStorage.setItem('organization', !isUserInvited);
    }
    {
      isUserInvited
        ? sessionStorage.setItem('organization', organizationName)
        : sessionStorage.setItem('organization', organization);
    }
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
  const [organizationName, setOrganizationName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isDialogShown, showDialog] = useBoolean(false);
  const [isUserExistsDialogShown, showUserExistsDialog, hideUserExistsDialog] =
    useBoolean(false);
  const [externalUserMode, setExternalUserMode] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(
    'This Email is Already in Use',
  );
  const [dialogMessage, setDialogMessage] = useState('');
  const [customPageTitle, setCustomPageTitle] = useState('');
  const [isUserInvited, setIsUserInvited] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const validationSchema = object().shape({
    firstName: string().required(REQUIRED_MESSAGE),
    lastName: string().required(REQUIRED_MESSAGE),
    ...(isUserInvited
      ? {}
      : { organization: string().required(REQUIRED_MESSAGE) }),
  });

  const externalUserValidationSchema = object().shape({
    firstName: string().required(REQUIRED_MESSAGE),
    lastName: string().required(REQUIRED_MESSAGE),
    ...(isUserInvited
      ? {}
      : { organization: string().required(REQUIRED_MESSAGE) }),
  });

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
      uname,
      external,
      firstName: fname,
      lastName: lname,
      senderFirstName: sfname,
      senderLastName: slname,
      organization: oname,
    } = queryValues;

    if (oname && sfname) setIsUserInvited(true);
    if (oname) setOrganizationName(oname);
    if (sfname && slname) setSenderName(sfname + ' ' + slname);

    if (fname) setValue('firstName', fname);
    if (lname) setValue('lastName', lname);
    if (oname) setValue('organization', oname);
    if (uname) sessionStorage.setItem('userName', uname);
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
              organizationName,
              isUserInvited,
            }),
            (error) => {
              console.log(`error: ${JSON.stringify(error)}`);
            },
          )}
        >
          <FormProvider {...formMethods}>
            {(hasTrialReferral || hasCustomPageTitle) && (
              <>
                <OutfitTypography variant="h2">
                  {hasCustomPageTitle
                    ? customPageTitle
                    : 'Start your free 15 day trial'}
                </OutfitTypography>
                <Spacing vertical={4} />
              </>
            )}
            {isUserInvited ? (
              <Title>You’ve been invited to {organizationName}.</Title>
            ) : (
              <Title>Please create an account</Title>
            )}

            <Spacing vertical={3} />
            <div style={{ textAlign: 'center' }}>
              {isUserInvited ? (
                <Subtitle
                  style={{ margin: '200px', textAlign: 'center' }}
                  align="center"
                  variant="p"
                >
                  Create an account and start collaborating with your team on Dock Health today
                </Subtitle>
              ) : (
                <Subtitle variant="p">
                  Sign up here for full trial access to Dock’s time-saving
                  templates for online task management.
                </Subtitle>
              )}
            </div>

            <Spacing vertical={4} />
            <FormInput name="firstName" label="First Name" />
            <Spacing vertical={5} />
            <FormInput name="lastName" label="Last Name" />
            <Spacing vertical={5} />
            {isUserInvited ? (
              ''
            ) : (
              <FormInput name="organization" label="Organization" />
            )}

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
            {isUserInvited ? '' : <SSOOptions />}

            <Spacing vertical={5} />
            <OutfitTypography variant="h4" align="center">
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
            </OutfitTypography>
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
                <OutfitTypography variant="h4">
                  <span style={onboardingMessageStyle}> {dialogMessage} </span>
                </OutfitTypography>

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
                <OutfitTypography variant="h4">
                  <span style={onboardingMessageStyle}> {dialogMessage} </span>
                </OutfitTypography>

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
