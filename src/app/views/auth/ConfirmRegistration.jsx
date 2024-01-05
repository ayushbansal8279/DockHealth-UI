import React, { useState } from 'react';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { success } from 'actions/notification-actions';
import { useDispatch } from 'react-redux';
import { confirmRegistration, resendConfirmationCode } from 'api/user-auth-api';
import { StyledAnchorDiv } from 'components/auth/AuthComponents.styled';
import Spacing from 'components/common/Spacing';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { useBoolean } from 'hooks/useBoolean';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import styled from 'styled-components';
import { Title, Subtitle } from 'components/auth/Title';
import palette from 'styles/palette';
import Button from 'components/common/v2/Button/Button';

const resendEmail = async (email, dispatch) => {
  try {
    await resendConfirmationCode({
      username: email,
    });
    dispatch(showGlobalAlert('Account confirmation email resent'));
  } catch (error) {
    dispatch(
      showGlobalErrorAlert(
        error?.message ?? 'Could not resend email, please try again later',
      ),
    );
  }
};

const ConfirmRegistration = (props) => {
  const dispatch = useDispatch();
  const [isDialogShown, showDialog, hideDialog] = useBoolean(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const history = useHistory();

  useMount(() => {
    const { location } = props;
    const queryValues = queryString.parse(location.search);
    const { uname, code } = queryValues;

    if (uname && code) {
      setUserEmail(uname);
      return confirmRegistration({
        username: uname,
        confirmationCode: code,
      })
        .then(() => {
          success('Registration confirmed. Please Login');
          window.sessionStorage.setItem('confirmStatus', true);
          history.push(`login?uname=${encodeURIComponent(uname)}`);
          // window.location.href = import.meta.env.VITE_BRANCH_IO_APP_LINK;
        })
        .catch((error) => {
          const message = error.message || 'An error occurred.';
          if (
            message ===
            'User cannot confirm because user status is not UNCONFIRMED.'
          ) {
            history.push('login');
            // window.location.href = import.meta.env.VITE_BRANCH_IO_APP_LINK;
            return;
          }
          setDialogTitle(`Email confirmation`);
          setDialogMessage(`You may have already confirmed your email.`);
          showDialog();
        });
    }
    history.push('login');
  });

  const confirmRegistrationContainer = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const onboardingLinkStyle = {
    paddingLeft: '10px',
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
    <div style={confirmRegistrationContainer}>
      <div>
        <DockLogoImage />
      </div>
      <Spacing vertical={6} />
      <div>
        <Title>{dialogTitle}</Title>
        <Spacing vertical={2} />
        <Subtitle>{dialogMessage}</Subtitle>
        <Spacing vertical={5} />
        <div>
          <Button
            id="loginButton"
            size="large"
            color={palette.brightOrange}
            secondaryColor={palette.oPlusRed}
            onClick={() => {
              hideDialog();
              history.push(`/auth/login`);
            }}
          >
            Login To My Account
          </Button>
        </div>
      </div>
      <Spacing vertical={8} />
      <div>
        <Subtitle>
          I didn&apos;t get the confirmation email.
          <StyledAnchorDiv
            style={onboardingLinkStyle}
            onClick={() => resendEmail(userEmail, dispatch)}
          >
            Resend email
          </StyledAnchorDiv>
        </Subtitle>
      </div>
    </div>
  );
};

export default ConfirmRegistration;
