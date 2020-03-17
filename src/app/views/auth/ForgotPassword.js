import React, { useCallback, useState } from 'react';
import { hashHistory } from 'react-router';

import { error, success } from '../../actions/notification-actions';
import { mobileAnalyticsClient } from '../../api/analytics-api';
import * as userApi from '../../api/user-api';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import { showAlert, showToast } from '../../helpers/utility-functions';

const ForgotPassword = () => {
  const [unconfirmedUserFlag, setUnconfirmedUserFlag] = useState(false);

  const onSubmit = useCallback(({ setError }) => form => {
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
      .catch(error_ => {
        let message = error_?.message;
        const errorCode = error_?.code;
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

          // (error?.message!='User is not confirmed.') ?? 'Incorrect email or password. Please try again.',
        );
      });
  });

  const onResendCode = useCallback(
    ({ setError }) => form => {
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
            form.password = ''; // Erroring.
          });
      } catch (error_) {
        showAlert({
          icon: 'error',
          title: 'Error',
          text:
            error_?.message ?? 'Could not resend email, please try again later',
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
