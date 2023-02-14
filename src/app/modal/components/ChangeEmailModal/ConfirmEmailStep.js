import React from 'react';
import { Grid } from '@material-ui/core';
import MobilePhoneIcon from 'img/modals/mobile-phone';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { openModal } from 'modal/actions';
import * as UserAuthApi from 'api/user-auth-api';
import FormInput from 'components/common/Input/FormInput';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import {
  StyledForm,
  HelperText,
  GridMaxHeight,
  LargeHelperText,
} from './styled';
import { REQUIRED_MESSAGE } from './helpers';

const validationSchema = object({
  authorizationCode: string()
    // eslint-disable-next-line func-names
    .test('digits', 'This field should have digits only', value =>
      value.match(/^\d+$/),
    )
    .test(
      'length',
      'Authorization code must be exactly 6 digits',
      value => value.length === 6,
    )
    .required(REQUIRED_MESSAGE),
});

const onSubmit = ({ onUpdateSuccess, setError, dispatch, newEmail }) => ({
  authorizationCode,
}) => {
  UserAuthApi.verifyNewPhoneNumber(authorizationCode)
    .then(() => {
      onUpdateSuccess(newEmail);
      dispatch(
        openModal('Confirmation', {
          description: 'Your mobile number has been verified and updated.',
          icon: MobilePhoneIcon,
          altIcon: 'Mobile phone',
        }),
      );
    })
    .catch(error => {
      setError('authorizationCode', {
        type: 'custom',
        message:
          error?.message || 'Something went wrong. Please try again later.',
      });
    });
};

const ConfirmEmailStep = ({
  onUpdateSuccess,
  goToPreviousStep,
  newEmail = '',
}) => {
  const dispatch = useDispatch();

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, setError } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <StyledForm
        onSubmit={handleSubmit(
          onSubmit({ dispatch, onUpdateSuccess, setError, newEmail }),
        )}
      >
        <GridMaxHeight container direction="column" justify="space-between">
          <Grid item>
            <Spacing vertical={4} />
            <LargeHelperText>
              Please enter the 6-digit code that was sent to {newEmail}
            </LargeHelperText>
            <Spacing vertical={2} />
            <HelperText>
              <button type="button" onClick={goToPreviousStep}>
                Change
              </button>{' '}
              my email
            </HelperText>
            <FormInput
              required
              autoFocus
              label="Authorization code"
              name="authorizationCode"
            />
          </Grid>
          <Grid item>
            <Button fullWidth type="submit">
              Verify my new Email
            </Button>
          </Grid>
        </GridMaxHeight>
      </StyledForm>
    </FormProvider>
  );
};

export default ConfirmEmailStep;
