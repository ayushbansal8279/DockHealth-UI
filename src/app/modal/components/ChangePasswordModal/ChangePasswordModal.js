import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string, ref } from 'yup';
import { Grid } from '@material-ui/core';
import * as UserApi from 'api/user-api';
import { showGlobalAlert } from 'alert/actions';
import { UniversalInput } from 'components/common/UniversalInput/UniversalInput';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { validPasswordSchema } from 'helpers/validation-helper';
import {
  ChangePasswordModalContainer,
  Title,
  StyledForm,
  HelperText,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object({
  currentPassword: string().required(REQUIRED_MESSAGE),
  newPassword: string()
    .required(REQUIRED_MESSAGE)
    .concat(validPasswordSchema),
  confirmPassword: string().oneOf(
    [ref('newPassword'), null],
    'Passwords must match',
  ),
});

const onSubmit = ({ setError, closeModal, dispatch }) => ({
  currentPassword,
  newPassword,
}) => {
  UserApi.changePassword(currentPassword, newPassword)
    .then(() => {
      dispatch(showGlobalAlert('Password changed'));
      closeModal();
    })
    .catch(error => {
      if (error.code === 'NotAuthorizedException') {
        setError('currentPassword', 'manual', 'Incorrect password');
      } else {
        setError('currentPassword', 'manual', error.message);
      }
    });
};

const ChangePasswordModal = ({ closeModal }) => {
  const dispatch = useDispatch();

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, setError } = formMethods;

  return (
    <ChangePasswordModalContainer>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>Change your password</Title>
      <FormContext {...formMethods}>
        <StyledForm
          onSubmit={handleSubmit(onSubmit({ setError, closeModal, dispatch }))}
        >
          <UniversalInput
            autoFocus
            type="password"
            label="Current Password"
            name="currentPassword"
          />
          <Spacing vertical={4} />
          <HelperText>
            Eight characters • One capital letter • One number
          </HelperText>
          <UniversalInput
            type="password"
            label="New Password"
            name="newPassword"
            show
          />
          <Spacing vertical={4} />
          <UniversalInput
            type="password"
            label="Confirm Password"
            name="confirmPassword"
          />
          <Spacing vertical={5} />
          <Grid container justify="flex-end">
            <Grid item xs={7}>
              <Button fullWidth type="submit">
                Change password
              </Button>
            </Grid>
          </Grid>
        </StyledForm>
      </FormContext>
    </ChangePasswordModalContainer>
  );
};

export default ChangePasswordModal;
