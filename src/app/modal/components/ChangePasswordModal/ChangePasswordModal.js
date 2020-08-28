import React from 'react';
import { useForm, FormContext } from 'react-hook-form';
import { object, string, ref } from 'yup';
import { Grid } from '@material-ui/core';
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

const ChangePasswordModal = ({ closeModal }) => {
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const onSubmit = data => {
    console.log('data', data);
    debugger;
  };

  const { handleSubmit } = formMethods;

  return (
    <ChangePasswordModalContainer>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>Change your password</Title>
      <FormContext {...formMethods}>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <UniversalInput
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
