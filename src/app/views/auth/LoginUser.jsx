import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import queryString from 'query-string';
import { setAuthBaseState } from 'actions/auth-base-actions';
import LoginFormUsername from 'components/auth/LoginFormUsername';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import * as UserAuthApi from 'api/user-auth-api';
import { log } from 'helpers/log';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';
import SSOOptions from 'components/auth/SSOOptions';
import { OutfitTypography } from 'styles/theme-outfit';

const onSubmit = (form, history) => {
  const { username } = form;

  window.sessionStorage.setItem('username', username);
  window.sessionStorage.removeItem('SSO_ACCESSTOKEN');
  window.sessionStorage.removeItem('SSO_REFRESHTOKEN');
  window.sessionStorage.removeItem('SSO_USEREMAIL');
  UserAuthApi.checkSSO(username)
    .then((issuer) => {
      if (issuer) {
        window.location.href = `${
          import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
        }oidc/authorize?iss=${issuer}`;
      } else {
        history.push('loginUser');
      }
    })
    .catch((error) => {
      log(error);
      history.push('loginUser');
    });
};

const LoginUser = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const DockLogoImage = styled.img.attrs({
    src: DockHeaderLogo,
    alt: 'Dock Health logo',
  })`
    align: center;
    width: 100%;
    object-fit: contain;
    height: 69px;
  `;

  const confirmStatus = sessionStorage.getItem('confirmStatus');

  const setConfirmationBaseState = useCallback(() => {
    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.LOGIN,
    })(dispatch);
  }, [dispatch]);

  useMount(() => {
    setConfirmationBaseState();
    const { location } = props;
    const queryValues = queryString.parse(location.search);
    const { uname } = queryValues;

    if (uname !== undefined) {
      onSubmit({ username: uname }, history);
    }
  });

  useEffect(() => {
    setConfirmationBaseState();
  }, [confirmStatus, setConfirmationBaseState]);

  return (
    <Grid container>
      <Grid item xs={12} alignItems="center" alignContent="center">
        <DockLogoImage />
        <Spacing vertical={5} />
      </Grid>
      <Grid item xs={12} alignItems="center" alignContent="center">
        <LoginFormUsername onSubmit={(form) => onSubmit(form, history)} />
      </Grid>
      <Grid item xs={12} alignItems="center">
        <Spacing vertical={2} />
        <SSOOptions />
        <Spacing vertical={5} />
        <OutfitTypography
          variant="p"
          align="center"
          alignContent="center"
          alignItems="center"
        >
          Dock can save you 20 hours a month{' '}
          <a
            style={{ color: '#6D757C', fontWeight: 800, paddingLeft: '5px' }}
            href="https://dock.health/"
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            Learn More
          </a>
        </OutfitTypography>
      </Grid>
    </Grid>
  );
};

export default LoginUser;
