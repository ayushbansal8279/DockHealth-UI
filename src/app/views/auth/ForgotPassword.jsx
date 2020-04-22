import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setAuthBaseState } from 'actions/auth-base-actions';
import { success } from 'actions/notification-actions';
import { mobileAnalyticsClient } from 'api/analytics-api';
import * as userApi from 'api/user-api';
import ForgotPasswordForm from 'components/auth/ForgotPasswordForm';
import { showAlert, showToast } from 'helpers/utility-functions';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

const ForgotPassword = () => {
  const [unconfirmedUserFlag, setUnconfirmedUserFlag] = useState(false);

  const dispatch = useDispatch();

  const setLoginAuthBaseState = useCallback(() => {
    setAuthBaseState({
      authBaseState: unconfirmedUserFlag
        ? AUTH_BASE_STATES.DAILY_HUB
        : AUTH_BASE_STATES.DEFAULT,
    })(dispatch);
  }, [dispatch, unconfirmedUserFlag]);

  useMount(() => {
    setLoginAuthBaseState();
  });

  useEffect(() => {
    setLoginAuthBaseState();
  }, [setLoginAuthBaseState]);

  const onSubmit = useCallback(
    ({ setError }) => form => {
      userApi
        .forgotPassword({
          username: form.username,
        })
        .then(resp => {
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            FORGOT_PASSWORD_SUCCESS: 'YES',
          });
          success(
            `Sent verification code to: ${resp.CodeDeliveryDetails.Destination}`,
          );
          window.sessionStorage.setItem('username', form.username);
          if (resp.CodeDeliveryDetails) {
            const deliveryMedium = resp.CodeDeliveryDetails.DeliveryMedium;
            if (deliveryMedium === 'EMAIL') {
              hashHistory.push('resetPasswordEmailSent');
            } else {
              hashHistory.push('resetPassword');
            }
          }
        })
        .catch(error => {
          let message = error?.message;
          const errorCode = error?.code;
          if (errorCode === 'InvalidParameterException') {
            message =
              'Email is not confirmed. Please check your email or click below to resend.'; // User is not confirmed.
            setUnconfirmedUserFlag(true);
          }
          mobileAnalyticsClient.recordEvent('AUTH_EVENTS', {
            FORGOT_PASSWORD_SUCCESS: 'NO',
          });

          setError(
            'username',
            'invalid',
            message ?? 'Unknown Error. Please try again.',
          );
        });
    },
    [],
  );

  const onResendCode = useCallback(
    // eslint-disable-next-line unicorn/consistent-function-scoping
    () => form => {
      try {
        userApi
          .resendConfirmationCode({
            username: form.username,
          })
          .then(() => {
            showToast({
              status: 'success',
              title: 'Account confirmation email resent',
            });
            setUnconfirmedUserFlag(false);
            // eslint-disable-next-line no-param-reassign
            form.password = ''; // Erroring.
          });
      } catch (error) {
        showAlert({
          icon: 'error',
          title: 'Error',
          text:
            error?.message ?? 'Could not resend email, please try again later',
        });
      }
    },
    [],
  );

  const onChange = () => {
    setUnconfirmedUserFlag(false);
  };

  return (
    <ForgotPasswordForm
      type="Confirm"
      onSubmit={onSubmit}
      onResendCode={onResendCode}
      onChange={onChange}
      unconfirmedUserFlag={unconfirmedUserFlag}
    />
  );
};

export default ForgotPassword;
