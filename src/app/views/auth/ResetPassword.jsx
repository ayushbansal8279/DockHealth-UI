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

const ResetPassword = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useMount(() => {
    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.REGAIN_CONTROL,
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
    <ResetPasswordForm
      type="Confirm"
      onSubmit={onSubmit}
      authTokenReceived={authTokenReceived}
    />
  );
};

export default ResetPassword;
