import React from 'react';
import { useMount } from 'react-use';
import FormInput from 'components/common/v2/Input/FormInput';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import styled from 'styled-components';
import palette from 'styles/palette';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme-outfit';
import Button from '../common/v2/Button/Button';
import { StyledLink } from './AuthComponents.styled';
import { Title } from './Title';

const validationSchema = object().shape({
  username: string()
    .required('Please enter an email address')
    .email('Please enter a valid email address'),
});

const ResendCodeForm = (props) => {
  const { onSubmit, invalid, pristine, submitting } = props;

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit, setValue, setError } = formMethods;

  useMount(() => {
    setValue('username', '');
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
      <Grid item xs={12} alignItems="center" alignContent="center">
        <form
          onSubmit={handleSubmit(onSubmit({ setError }))}
          style={{
            width: '100%',
          }}
        >
          <FormProvider {...formMethods}>
            <Title>Resend confirmation code</Title>
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
              disabled={invalid || pristine || submitting}
            >
              Resend Code
            </Button>
            <Spacing vertical={4} />
            <OutfitTypography variant="h4" weight="600" align="center">
              <StyledLink to="/auth/confirmRegistration">
                Confirm registration
              </StyledLink>
            </OutfitTypography>
          </FormProvider>
        </form>
      </Grid>
    </Grid>
  );
};

export default ResendCodeForm;
