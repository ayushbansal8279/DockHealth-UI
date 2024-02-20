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
import * as UserAuthApi from 'api/user-auth-api';
import ConfirmMFACodeForm from 'components/auth/ConfirmMfaCodeForm';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import { log } from 'helpers/log';

const ConfirmMFACode = (props) => {
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
      authBaseState: AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
  });

  const onSubmit = useCallback(
    (form) => {
      return UserAuthApi.sendMFACode({
        username,
        mfaCode: form.mfaCode,
      })
        .then(() => {
          UserAuthApi.rememberDevice().then((result) => {
            log(`added device to be remembered: ${result}`);
          });
          history.push('/core/home/my-tasks');
          success('Logged in.');
        })
        .catch((error) => {
          setCustomError('Invalid authentication code.');
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
