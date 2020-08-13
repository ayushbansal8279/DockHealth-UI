import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import LoginFormUsername from 'components/auth/LoginFormUsername';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

const onSubmit = form => {
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
    hashHistory.push('loginUser');
  }
};

const LoginUser = props => {
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState('');

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
    if (props.location?.query?.uname !== undefined) {
      setUserEmail(props.location?.query?.uname);
    }
  });

  useEffect(() => {
    setConfirmationBaseState();
  }, [confirmStatus, setConfirmationBaseState]);

  return <LoginFormUsername onSubmit={onSubmit} userEmail={userEmail} />;
};

export default LoginUser;
