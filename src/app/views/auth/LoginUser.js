import React from 'react';
import { hashHistory } from 'react-router';

import LoginFormUsername from '../../components/auth/LoginFormUsername';

const onSubmit = form => {
  const { username } = form;

  window.sessionStorage.setItem('username', username);
  window.sessionStorage.removeItem('SSO_ACCESSTOKEN');
  window.sessionStorage.removeItem('SSO_REFRESHTOKEN');
  window.sessionStorage.removeItem('SSO_USEREMAIL');
  if (
    username != null &&
    (username.indexOf('@childrens.harvard.edu') !== -1 ||
      username.indexOf('@tch.harvard.edu') !== -1 ||
      username.indexOf('@chboston.org') !== -1 ||
      username.indexOf('@cardio.chboston.org') !== -1)
  ) {
    window.location.href = `${
      process.env.HEYDOC_SERVICES_BASE_URL
    }oidc/authorize`;
  } else {
    hashHistory.push('loginUser');
  }
};

const LoginUser = () => <LoginFormUsername onSubmit={onSubmit} />;

export default LoginUser;
