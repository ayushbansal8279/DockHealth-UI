/* eslint-disable unicorn/prefer-string-slice */
import React, { useEffect, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from 'components/common/v2/Input/FormInput';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/v2/Button/Button';
import { Grid } from '@mui/material';
import palette from 'styles/palette';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { OutfitTypography } from 'styles/theme-outfit';

const validationSchema = object().shape({
  mfaCode: string().required('This field is required'),
});

const ConfirmMFACodeForm = (props) => {
  const { onSubmit, customError } = props;

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    if (customError) {
      formMethods.setError('mfaCode', { type: 'custom', message: customError });
    }
  }, [customError, formMethods]);

  const smsPhone = window.sessionStorage.getItem('SMS_PHONE');

  const DockLogoImage = styled.img.attrs({
    src: DockHeaderLogo,
    alt: 'Dock Health logo',
  })`
    align: center;
    width: 100%;
    object-fit: contain;
    height: 69px;
  `;

  const history = useHistory();

  const handleChangeCell = useCallback(() => {
    history.push('/changePhoneNumber');
  }, [history]);

  const handleResend = useCallback(() => {
    history.push('/resendCode');
  }, [history]);

  return (
    <>
      <Grid container>
        <Grid item xs={12} alignItems="center" alignContent="center">
          <DockLogoImage />
          <Spacing vertical={6} />
        </Grid>
        <Grid item xs={12}>
          <form
            style={{ width: '100%' }}
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            <FormProvider {...formMethods}>
              <OutfitTypography align="center" weight="700" variant="h3">
                Two-factor authentication{' '}
              </OutfitTypography>
              <Spacing vertical={4} />
              <OutfitTypography align="center" variant="h5">
                We’ve sent a code to your mobile number
              </OutfitTypography>
              <Spacing vertical={5} />
              <FormInput
                name="mfaCode"
                label="Authorization code"
                placeHolder="000000"
                autoFocus
              />
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px',
                }}
              >
                <OutfitTypography variant="h6" weight="600" align="center">
                  <div style={{ cursor: 'pointer' }} onClick={handleChangeCell}>
                    Change my cell number
                  </div>
                </OutfitTypography>
                <OutfitTypography variant="h6" weight="600" align="center">
                  <div style={{ cursor: 'pointer' }} onClick={handleResend}>
                    Resend
                  </div>
                </OutfitTypography>
              </div>

              <Spacing vertical={4} />
              <Button
                type="submit"
                size="large"
                color={palette.brightOrange}
                secondaryColor={palette.oPlusRed}
              >
                Verify
              </Button>
              <Spacing vertical={8} />
              <OutfitTypography variant="h6" align="center">
                If you’ve lost your device or can’t use your app please contact
                Support@dock.health
              </OutfitTypography>
            </FormProvider>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default ConfirmMFACodeForm;
