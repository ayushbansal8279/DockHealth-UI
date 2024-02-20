import React, { useCallback } from 'react';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import { success } from 'actions/notification-actions';
import * as UserAuthApi from 'api/user-auth-api';
import ResetPasswordForm from 'components/auth/ResetPasswordForm';
import { showAlert } from 'helpers/utility-functions';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';

const ResetPassword = (props) => {
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

  useMount(() => {
    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
  });

  const onSubmit = useCallback(
    (form) => {
      const { location } = props;
      const queryValues = queryString.parse(location.search);
      const code = queryValues.code ?? form.code;
      const uname =
        queryValues.uname ?? window.sessionStorage.getItem('username');

      return UserAuthApi.resetPassword({
        username: uname,
        verificationCode: code,
        password: form.password,
      })
        .then(() => {
          success('Reset password. Please login');
          history.push('resetPasswordSuccess');
        })
        .catch((error) => {
          const message = error.message || 'An error occurred.';

          showAlert({
            icon: 'error',
            title: 'Error',
            text: message,
          });
        });
    },
    [history, props],
  );

  const { location } = props;
  const queryValues = queryString.parse(location.search);

  const authTokenReceived = Boolean(queryValues.code && queryValues.uname);

  return (
    <Grid container>
      <Grid item xs={12} alignItems="center" alignContent="center">
        <DockLogoImage />
        <Spacing vertical={5} />
      </Grid>
      <Grid item xs={12}>
        <ResetPasswordForm
          type="Confirm"
          onSubmit={onSubmit}
          authTokenReceived={authTokenReceived}
        />
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
