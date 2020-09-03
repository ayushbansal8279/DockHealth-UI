import React, { useMemo } from 'react';
import { Grid } from '@material-ui/core';
import MobilePhoneIcon from 'img/modals/mobile-phone';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';
import { openModal } from 'modal/actions';
import * as UserApi from 'api/user-api';
import { UniversalInput } from 'components/common/UniversalInput/UniversalInput';
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

const onSubmit = ({ onUpdateSuccess, setError, dispatch }) => ({
  authorizationCode,
}) => {
  UserApi.verifyNewPhoneNumber(authorizationCode)
    .then(() => {
      onUpdateSuccess();
      dispatch(
        openModal('Confirmation', {
          description: 'Your mobile number has been verified and updated.',
          icon: MobilePhoneIcon,
          altIcon: 'Mobile phone',
        }),
      );
    })
    .catch(error => {
      setError(
        'authorizationCode',
        'manual',
        error?.message || 'Something went wrong. Please try again later.',
      );
    });
};

const ConfirmNumberStep = ({
  onUpdateSuccess,
  goToPreviousStep,
  newPhoneNumber = '',
}) => {
  const dispatch = useDispatch();

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, setError } = formMethods;

  const formattedPhoneNumber = useMemo(
    () =>
      newPhoneNumber.replace(
        /\(([1-9]\d{2}\)) (\d{3})-(\d{4})$/g,
        '***-***-$3',
      ),
    [newPhoneNumber],
  );

  return (
    <FormContext {...formMethods}>
      <StyledForm
        onSubmit={handleSubmit(
          onSubmit({ dispatch, onUpdateSuccess, setError }),
        )}
      >
        <GridMaxHeight container direction="column" justify="space-between">
          <Grid item>
            <Spacing vertical={4} />
            <LargeHelperText>
              Please enter the 6-digit code that was sent to{' '}
              {formattedPhoneNumber}
            </LargeHelperText>
            <Spacing vertical={2} />
            <HelperText>
              <button type="button" onClick={goToPreviousStep}>
                Change
              </button>{' '}
              my mobile phone number
            </HelperText>
            <UniversalInput
              autoFocus
              label="Authorization code"
              name="authorizationCode"
              required
            />
          </Grid>
          <Grid item>
            <Button fullWidth type="submit">
              Verify my new mobile number
            </Button>
          </Grid>
        </GridMaxHeight>
      </StyledForm>
    </FormContext>
  );
};

export default ConfirmNumberStep;
