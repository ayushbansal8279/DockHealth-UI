import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import { success } from 'actions/notification-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import * as userApi from 'api/user-api';
import ResetPasswordForm from 'components/auth/ResetPasswordForm';
import { showAlert } from 'helpers/utility-functions';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

const ResetPassword = props => {
  const dispatch = useDispatch();
  const history = useHistory();

  useMount(() => {
    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.REGAIN_CONTROL,
    })(dispatch);
  });

  const onSubmit = useCallback(
    form => {
      let {
        location: {
          query: { uname, code },
        },
      } = props;

      code = code ?? form.code;
      uname = uname ?? window.sessionStorage.getItem('username');

      return userApi
        .resetPassword({
          username: uname,
          verificationCode: code,
          password: form.password,
        })
        .then(() => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            RESET_PASSWORD_SUCCESS: 'YES',
          });
          success('Reset password. Please login');
          history.push('resetPasswordSuccess');
        })
        .catch(error => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            RESET_PASSWORD_SUCCESS: 'NO',
          });
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

  const {
    location: {
      query: { code, uname },
    },
  } = props;

  const authTokenReceived = Boolean(code && uname);

  return (
    <ResetPasswordForm
      type="Confirm"
      onSubmit={onSubmit}
      authTokenReceived={authTokenReceived}
    />
  );
};

export default ResetPassword;
