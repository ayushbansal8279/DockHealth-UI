import React, { useCallback, useState } from 'react';
import queryString from 'query-string';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import {
  error as errorNotification,
  success,
} from 'actions/notification-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import * as UserApi from 'api/user-api';
import ConfirmMFACodeForm from 'components/auth/ConfirmMfaCodeForm';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

const ConfirmMFACode = props => {
  const [username, setUsername] = useState('');
  const [customError, setCustomError] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  useMount(() => {
    const { location } = props;
    const queryValues = queryString.parse(location.search);
    if (queryValues.uname !== undefined) {
      setUsername(queryValues.uname);
    }
    setAuthBaseState({
      authBaseState: AUTH_BASE_STATES.REGAIN_CONTROL,
    })(dispatch);
  });

  const onSubmit = useCallback(
    form => {
      return UserApi.sendMFACode({
        username,
        mfaCode: form.mfaCode,
      })
        .then(() => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            CONFIRM_MFACODE_SUCCESS: 'YES',
          });
          UserApi.rememberDevice().then(result => {
            console.log(`added device to be remembered: ${result}`);
          });
          history.push('/core/home/my-tasks');
          success('Logged in.');
          UserApi.captureLocalTimezone();
        })
        .catch(error => {
          setCustomError('Invalid authentication code.');

          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            CONFIRM_MFACODE_SUCCESS: 'NO',
          });

          errorNotification(error.message || 'An error occurred.');
        });
    },
    [history, username],
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
