import React, { useCallback } from 'react';
import { Close } from '@material-ui/icons';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';
import { FormContext, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import Spacing from 'components/common/Spacing';
import { showAlert } from 'helpers/utility-functions';
import { referAColleague } from 'api/organization-api';
import { UniversalMontserratInput } from 'components/common/UniversalInput/UniversalInput';
import Button from 'components/common/Button/Button';

import {
  MainContainer,
  LeftSideMainContainer,
  LeftSideContentContainer,
  RightSideMainContainer,
  RightSideContentContainer,
  StyledGrid,
  DockLogoImage,
  StyledForm,
  Title,
  CloseButton,
  ButtonWrapper,
} from './styled';

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  firstName: string().required(REQUIRED_MESSAGE),
  lastName: string().required(REQUIRED_MESSAGE),
  email: string()
    .required(REQUIRED_MESSAGE)
    .email('This field should contain a valid email address'),
});

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit = ({ handleReferralSuccess }) => async ({
  firstName,
  lastName,
  email,
}) => {
  try {
    await referAColleague({
      firstName,
      lastName,
      email,
    });
    handleReferralSuccess(email);
  } catch (error) {
    showAlert({
      status: 'error',
      title: 'Error',
      text: error?.message ?? 'Could not send an email, please try again later',
    });
  }
};

export default function ReferAColleagueModal({ closeModal, openModal }) {
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const openSuccessModal = useCallback(
    email =>
      openModal('SendingInvite', {
        email,
      }),
    [openModal],
  );

  return (
    <MainContainer>
      <LeftSideMainContainer>
        <CloseButton size="small" onClick={closeModal}>
          <Close />
        </CloseButton>
        <LeftSideContentContainer>
          <StyledForm
            onSubmit={formMethods.handleSubmit(
              onSubmit({
                handleReferralSuccess: openSuccessModal,
              }),
            )}
          >
            <FormContext {...formMethods}>
              <Title>
                <RobotoTypography
                  weight="normal"
                  variant="h4"
                  color={palette.mediumGrey}
                >
                  REFER A COLLEAGUE
                </RobotoTypography>
              </Title>
              <DialogContentText>
                If you love Dock Health and want to refer a friend or colleague,
                simply fill in their information below and we&apos;ll send an
                invite to their inbox.
              </DialogContentText>
              <Spacing vertical={4} />
              <MontserratTypography variant="h5">
                <span style={{ color: palette.error }}>*</span>
                <span> All fields required</span>
              </MontserratTypography>
              <Spacing vertical={3} />
              <UniversalMontserratInput name="firstName" label="First Name" />
              <Spacing vertical={3} />
              <UniversalMontserratInput name="lastName" label="Last Name" />
              <Spacing vertical={3} />
              <UniversalMontserratInput name="email" label="Email" />
              <Spacing vertical={3} />

              <DialogActions>
                <ButtonWrapper>
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={closeModal}
                    size="small"
                  >
                    Cancel
                  </Button>
                </ButtonWrapper>
                <Spacing horizontal={3} />
                <ButtonWrapper>
                  <Button fullWidth type="submit" size="small">
                    Send Invite
                  </Button>
                </ButtonWrapper>
              </DialogActions>
            </FormContext>
          </StyledForm>
        </LeftSideContentContainer>
      </LeftSideMainContainer>
      <RightSideMainContainer>
        <RightSideContentContainer>
          <StyledGrid
            container
            justify="center"
            alignItems="left"
            direction="column"
          >
            <a href="/#/core/home/my-tasks">
              <DockLogoImage />
            </a>
            <Spacing vertical={5} />
            <MontserratTypography weight="normal" variant="h4" color="inherit">
              A simple, HIPAA compliant task management and collaboration
              platform built specifically for healthcare.
            </MontserratTypography>
          </StyledGrid>
        </RightSideContentContainer>
      </RightSideMainContainer>
    </MainContainer>
  );
}
