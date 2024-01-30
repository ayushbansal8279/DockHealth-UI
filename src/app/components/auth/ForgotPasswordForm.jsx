import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMount } from 'react-use';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Spacing from 'components/common/Spacing';
import FormInput from 'components/common/v2/Input/FormInput';
import { Grid } from '@mui/material';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import styled from 'styled-components';
import palette from 'styles/palette';

import Button from '../common/v2/Button/Button';
import { Title, Subtitle } from './Title';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

const ForgotPasswordForm = ({
  onSubmit,
  onResendCode,
  unconfirmedUserFlag,
}) => {
  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, setValue, setError } = formMethods;

  useMount(() => {
    setValue('username', sessionStorage.getItem('username') ?? '');
  });

  const DockLogoImage = styled.img.attrs({
    src: DockHeaderLogo,
    alt: 'Dock Health logo',
  })`
    align: center;
    width: 100%;
    object-fit: contain;
    height: 69px;
  `;

  return (
    <Grid container>
      <Grid item xs={12} alignItems="center" alignContent="center">
        <DockLogoImage />
        <Spacing vertical={5} />
      </Grid>
      <Grid item>
        <form
          onSubmit={handleSubmit(
            unconfirmedUserFlag
              ? onResendCode({ setError })
              : onSubmit({ setError }),
          )}
          style={{
            width: '100%',
          }}
        >
          <FormProvider {...formMethods}>
            <Title>Forgot your password?</Title>
            <Spacing vertical={4} />
            <Subtitle>
              Don’t worry, it happens to the best of us. Enter the email
              associated with your account.
            </Subtitle>
            <Spacing vertical={5} />
            <FormInput name="username" type="text" label="Email" autoFocus />
            <Spacing vertical={5} />
            <Button
              uppercase={false}
              type="submit"
              fullWidth
              size="large"
              color={palette.brightOrange}
              secondaryColor={palette.oPlusRed}
            >
              {unconfirmedUserFlag
                ? 'Resend confirmation Email'
                : 'Send me a recovery code'}
            </Button>
            <Spacing vertical={6} />
          </FormProvider>
        </form>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordForm;
