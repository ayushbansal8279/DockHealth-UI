import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import LoginFormUsername from 'components/auth/LoginFormUsername';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

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
    window.location.href = `${process.env.HEYDOC_SERVICES_BASE_URL}oidc/authorize`;
  } else {
    history.push('loginUser');
  }
};

const LoginUser = props => {
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
    const { match } = props;
    const { params } = match;
    const { uname } = params;

    if (uname !== undefined) {
      onSubmit({ username: uname });
    }
  });

  useEffect(() => {
    setConfirmationBaseState();
  }, [confirmStatus, setConfirmationBaseState]);

  return <LoginFormUsername onSubmit={form => onSubmit(form, history)} />;
};

export default LoginUser;
