import { Grid, Typography } from '@mui/material';
import queryString from 'query-string';
import React, { useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import styled from 'styled-components';
import { object, string, ref } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { validPasswordSchema } from 'helpers/validation-helper';
import { setAuthBaseState } from 'actions/auth-base-actions';
import * as organizationApi from 'api/organization-api';
import {
  register as registerAction,
  resendConfirmationCode,
} from 'api/user-auth-api';
import {
  StyledAnchorDiv,
  StyledLink,
} from 'components/auth/AuthComponents.styled';
import Spacing from 'components/common/Spacing';
import FormInput from 'components/common/v2/Input/FormInput';
import FormPhoneNumberInput from 'components/common/PhoneNumberInput/FormPhoneNumberInput';
import { showAlert, showToast } from 'helpers/utility-functions';
import { useBoolean } from 'hooks/useBoolean';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import palette from 'styles/palette';
import { OutfitTypography } from 'styles/theme-outfit';
import ConfirmEmailHeaderCheck from 'img/checked-circle.svg';
import AlertEmailCircle from 'img/alert-circle.svg';
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
import DockHeaderLogo from 'img/dock-header-logo.svg';
import { Title, Subtitle } from 'components/auth/Title';
import { OnboardingDialog } from '../onboarding/OnboardingTemplate.Components';

const REQUIRED_MESSAGE = 'This field is required';

const resendEmail = async (email) => {
  try {
    await resendConfirmationCode({
      username: email,
    });
    showToast({
      status: 'success',
      title: 'Account confirmation email resent',
    });
  } catch (error) {
    showAlert({
      status: 'error',
      title: 'Error',
      text: error?.message ?? 'Could not resend email, please try again later',
    });
  }
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
const CompleteCreateAccount = (props) => {
  const [isDialogShown, showDialog, hideDialog] = useBoolean(false);
  const [isUserExistsDialogShown, showUserExistsDialog, hideUserExistsDialog] =
    useBoolean(false);
  const [externalUserMode, setExternalUserMode] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(
    'This Email is Already in Use',
  );
  const [dialogMessage, setDialogMessage] = useState('');
  const [customPageTitle, setCustomPageTitle] = useState('');
  const [isUserInvited, setIsUserInvited] = useState(false);
  const [userName, setUserName] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const validationSchema = object().shape({
    ...(isUserInvited
      ? {}
      : {
          email: string()
            .required(REQUIRED_MESSAGE)
            .email('Please enter a valid email address'),
        }),
    password: string().required(REQUIRED_MESSAGE).concat(validPasswordSchema),
    confirmPassword: string()
      .required(REQUIRED_MESSAGE)
      .oneOf([ref('password')], 'Your passwords do not match.'),
    mobilePhoneNumber: string()
      .transform((value) => value.replace(/\D/g, ''))
      .required(REQUIRED_MESSAGE)
      .matches(/\d{10}/, 'Please enter a valid phone number'),
  });

  const externalUserValidationSchema = object().shape({
    ...(isUserInvited
      ? {}
      : {
          email: string()
            .required(REQUIRED_MESSAGE)
            .email('Please enter a valid email address'),
        }),
    password: string().required(REQUIRED_MESSAGE).concat(validPasswordSchema),
    confirmPassword: string()
      .required(REQUIRED_MESSAGE)
      .oneOf([ref('password')], 'Your passwords do not match.'),
    mobilePhoneNumber: string()
      .transform((value) => value?.replace(/\D/g, ''))
      .matches(/\d{10}/, 'Please enter a valid phone number'),
  });

  const formMethods = useForm({
    resolver: externalUserMode
      ? yupResolver(externalUserValidationSchema)
      : yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const onSubmit = useCallback(
    ({ locationParameters }) =>
      async ({ email, password, mobilePhoneNumber }) => {
        const referral = locationParameters.referral ?? '';
        try {
          const firstName = sessionStorage.getItem('firstName');
          const lastName = sessionStorage.getItem('lastName');
          sessionStorage.setItem('email', email);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const organizationName = sessionStorage.getItem('organization');
          const userEmail =
            sessionStorage.getItem('isUserInvited') === 'true'
              ? sessionStorage.getItem('userName')
              : email;
          await registerAction({
            username: userEmail,
            password,
            email: userEmail,
            phone_number: mobilePhoneNumber
              ? `+${mobilePhoneNumber.replace(/\D/g, '')}`
              : null,
            family_name: lastName,
            given_name: firstName,
            // organization,
            'custom:referral': referral,
            'custom:app_environment': import.meta.env.VITE_APP_ENV,
            'custom:organization_name': organizationName,
          });
          history.push('/signupEmailSent');
        } catch (error) {
          if (error?.code === 'UsernameExistsException') {
            setDialogTitle(`User Already Exists`);
            showUserExistsDialog();
            return;
          }
          showAlert({
            status: 'error',
            title: 'Error',
            text:
              error?.message ??
              'Could not create account, please try again later',
          });
        }
      },
    [history, showUserExistsDialog],
  );

  const email = formMethods.watch('email');
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
      organization: oname,
    } = queryValues;

    if (uname && !isUserInvited) setValue('email', uname);
    if (fname) setValue('firstName', fname);
    if (lname) setValue('lastName', lname);
    if (oname) setValue('organization', oname);
    if (external === 'true') setExternalUserMode(true);

    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
    if (locationParameters && locationParameters?.referral) {
      getCustomTitleFromReferralConfig(
        String(locationParameters?.referral),
        setCustomPageTitle,
      );
    }

    if (sessionStorage.getItem('isUserInvited')) setIsUserInvited(true);

    if (sessionStorage.getItem('userName'))
      setUserName(sessionStorage.getItem('userName'));
  });

  const hasCustomPageTitle = customPageTitle !== '';
  const fontFamily = 'Outfit';

  const onboardingDialogStyle = {
    fontFamily,
    fontWeight: 300,
    fontSize: '18px',
    padding: '0rem 1rem',
  };

  const onboardingMessageStyle = {
    fontFamily,
    fontWeight: 300,
    fontSize: '18px',
    padding: '0rem 1rem',
    display: 'block',
  };

  const onboardingMessageTitle = {
    fontFamily: 'Outfit',
    fontWeight: 600,
    fontSize: '28px',
    padding: '0rem 1rem',
    display: 'block',
  };

  const onboardingLinkStyle = {
    fontFamily,
    fontWeight: 300,
    fontSize: '18px',
  };

  const DockLogoImage = styled.img.attrs({
    src: DockHeaderLogo,
    alt: 'Dock Health logo',
  })`
    align: center;
    width: 100%;
    object-fit: contain;
    height: 69px;
  `;

  return (
    <StyledGrid container alignItems="center" justifyContent="center">
      <DockLogoImage />
      <Spacing vertical={5} />
      <StyledForm
        onSubmit={formMethods.handleSubmit(
          onSubmit({
            setDialogMessage,
            setDialogTitle,
            showDialog,
            showUserExistsDialog,
            locationParameters,
          }),
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
          <Title variant={hasTrialReferral || hasCustomPageTitle ? 'h4' : 'h2'}>
            Almost done...
          </Title>
          <Spacing vertical={3} />
          <Subtitle align="center" variant="p">
            <p style={{ textAlign: 'center' }}>
              Sign up here for full trial access to Dock’s time-saving templates
              for online task management.
            </p>
          </Subtitle>
          <Spacing vertical={3} />
          {isUserInvited ? (
            <FormInput
              disabled={isUserInvited}
              name="email"
              label="Email"
              value={userName}
            />
          ) : (
            <FormInput disabled={externalUserMode} name="email" label="Email" />
          )}
          <Spacing vertical={5} />
          <FormPhoneNumberInput variant='outlined'
            name="mobilePhoneNumber"
            label="Your Mobile Phone Number"
            style={{ borderRadius: '50px' }}
            // customShrinkCondition
          />
          <Spacing vertical={3} />
          <OutfitTypography variant="h5">
            This must be a mobile phone number as we are required to send a
            secondary authentication code
          </OutfitTypography>
          <Spacing vertical={5} />
          <FormInput name="password" label="Password" type="password" />
          <Spacing vertical={3} />
          <OutfitTypography variant="h5">
            * 8 characters • 1 capital • 1 number
          </OutfitTypography>
          <Spacing vertical={4} />
          <FormInput 
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />
          
          <Spacing vertical={5} />
          <Button
            uppercase={false}
            type="submit"
            fullWidth
            size="large"
            color={palette.brightOrange}
            secondaryColor={palette.oPlusRed}
          >
            Create Account
          </Button>
          <Spacing vertical={5} />
          <OutfitTypography variant="h4" align="center">
            <StyledLink
              style={{ display: 'block', fontWeight: 500 }}
              to="/auth/create-account"
            >
              Back
            </StyledLink>
          </OutfitTypography>
          <Spacing vertical={5} />
          <OutfitTypography variant="h4" align="center">
            Already have an account?
            <StyledLink
              style={{ display: 'inline', paddingLeft: '5px', fontWeight: 600 }}
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
              <Spacing vertical={5} />
              <OutfitTypography variant="h4">
                <span style={onboardingDialogStyle}>
                  I didn&apos;t get the email.{' '}
                </span>
                <StyledAnchorDiv
                  style={onboardingLinkStyle}
                  onClick={() => resendEmail(email)}
                >
                  Resend email
                </StyledAnchorDiv>
              </OutfitTypography>

              <Spacing vertical={5} />

              <OutfitTypography variant="h4">
                <span style={onboardingDialogStyle}>
                  {' '}
                  The email address is wrong.{' '}
                </span>
                <StyledAnchorDiv
                  onClick={hideUserExistsDialog}
                  style={onboardingLinkStyle}
                >
                  Change email address
                </StyledAnchorDiv>
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
                    hideDialog();
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
      <OnboardingDialog open={isUserExistsDialogShown} fullWidth maxWidth="sm">
        <MuiThemeProvider theme={redTheme}>
          <ModalWrapper style={{ width: '500px' }}>
            <ModalIconContainer>
              <ModalMainIcon src={AlertEmailCircle} alt="envelope" />
              <span style={onboardingMessageTitle}> {dialogTitle} </span>
            </ModalIconContainer>
            <ModalDescriptionContainer>
              <OutfitTypography variant="h4">
                <StyledAnchorDiv
                  style={onboardingLinkStyle}
                  onClick={() => resendEmail(email)}
                >
                  Resend confirmation email
                </StyledAnchorDiv>
              </OutfitTypography>

              <Spacing vertical={5} />

              <OutfitTypography variant="h4">
                <StyledAnchorDiv
                  onClick={hideUserExistsDialog}
                  style={onboardingLinkStyle}
                >
                  Change my email address
                </StyledAnchorDiv>
              </OutfitTypography>
              <Spacing vertical={2} />
            </ModalDescriptionContainer>
            <ButtonsContainer>
              <FixedWidthButtonWrapper width={200}>
                <Button
                  uppercase={false}
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
    </StyledGrid>
  );
};

export default CompleteCreateAccount;
