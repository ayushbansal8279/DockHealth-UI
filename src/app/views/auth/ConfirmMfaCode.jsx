import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import {
  error as errorNotification,
  success,
} from 'actions/notification-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import * as userApi from 'api/user-api';
import ConfirmMFACodeForm from 'components/auth/ConfirmMfaCodeForm';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

const ConfirmMFACode = props => {
  const [username, setUsername] = useState('');
  const [customError, setCustomError] = useState('');

  const dispatch = useDispatch();

  useMount(() => {
    const { location } = props;
    setUsername(location.query.uname);

    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
  });

  const onSubmit = useCallback(
    form => {
      return userApi
        .sendMFACode({
          username,
          mfaCode: form.mfaCode,
        })
        .then(() => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            CONFIRM_MFACODE_SUCCESS: 'YES',
          });
          userApi.rememberDevice().then(result => {
            console.log(`added device to be remembered: ${result}`);
          });
          hashHistory.push('/');
          success('Logged in.');
        })
        .catch(error => {
          setCustomError('Invalid authentication code.');

          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            CONFIRM_MFACODE_SUCCESS: 'NO',
          });

          errorNotification(error.message || 'An error occurred.');
        });
    },
    [username],
  );

  return (
    <ConfirmMFACodeForm
      type="Confirm"
      onSubmit={onSubmit}
      customError={customError}
    />
  );
};

export default ConfirmMFACode;
