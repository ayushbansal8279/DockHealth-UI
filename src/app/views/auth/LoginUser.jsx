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

const onSubmit = (form, history) => {
  const { username } = form;

  window.sessionStorage.setItem('username', username);
  window.sessionStorage.removeItem('SSO_ACCESSTOKEN');
  window.sessionStorage.removeItem('SSO_REFRESHTOKEN');
  window.sessionStorage.removeItem('SSO_USEREMAIL');
  if (
    username != null &&
    (username.includes('@childrens.harvard.edu') ||
      username.includes('@tch.harvard.edu') ||
      username.includes('@chboston.org') ||
      username.includes('@cardio.chboston.org'))
  ) {
    window.location.href = `${
      import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
    }oidc/authorize`;
  } else {
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
  }
};

const LoginUser = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const confirmStatus = sessionStorage.getItem('confirmStatus');

  const setConfirmationBaseState = useCallback(() => {
    setAuthBaseState({
      authBaseState: confirmStatus
        ? AUTH_BASE_STATES.DAILY_HUB
        : AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
  }, [confirmStatus, dispatch]);

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

  return <LoginFormUsername onSubmit={(form) => onSubmit(form, history)} />;
};

export default LoginUser;
