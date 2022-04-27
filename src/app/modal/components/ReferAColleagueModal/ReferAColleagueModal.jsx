import React, { useCallback } from 'react';
import { Close } from '@material-ui/icons';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import { RobotoTypography } from 'styles/theme';
import { FormProvider, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import Spacing from 'components/common/Spacing.tsx';
import { showAlert } from 'helpers/utility-functions';
import { referAColleague } from 'api/organization-api';
import Button from 'components/common/Button/Button';
import FormInput from 'components/common/Input/FormInput';
import {
  MainContainer,
  LeftSideMainContainer,
  LeftSideContentContainer,
  RightSideMainContainer,
  RightSideContentContainer,
  StyledGrid,
  DockCoinReferralRewardsImage,
  DockFooterMessageImage,
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
    .email('Please enter a valid email address'),
});

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit = ({ handleReferralSuccess }) => async ({
  firstName,
  lastName,
  email,
  comments,
}) => {
  try {
    await referAColleague({
      firstName,
      lastName,
      email,
      comments,
    });
    handleReferralSuccess(firstName, lastName);
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
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });

  const openSuccessModal = useCallback(
    (firstName, lastName) =>
      openModal('SendingInvite', {
        firstName,
        lastName,
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
            <FormProvider {...formMethods}>
              <Title>
                <RobotoTypography
                  weight="normal"
                  variant="h3"
                  color={palette.mediumGrey}
                >
                  REFER A COLLEAGUE
                </RobotoTypography>
              </Title>
              <Spacing vertical={3} />
              <DialogContentText>
                Welcome to Dockcoin - the Dock Health Referral Rewards program.
                If you love Dock and want to refer a friend or colleague, simply
                fill in their information below and we&apos;ll send an invite to
                their inbox. If they join Dock, you’ll then earn a Dockcoin
                credit once they subscribe.
              </DialogContentText>
              <Spacing vertical={4} />
              <Spacing vertical={3} />
              <FormInput name="firstName" label="First Name" isRequired />
              <Spacing vertical={3} />
              <FormInput name="lastName" label="Last Name" isRequired />
              <Spacing vertical={3} />
              <FormInput name="email" label="Email" isRequired />

              <Spacing vertical={3} />
              <FormInput
                name="comments"
                label="Comments for Dock Team"
                multiline
                rows={3}
              />
              <Spacing vertical={4} />
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
            </FormProvider>
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
              {/* <DockLogoImage /> */}
              <DockCoinReferralRewardsImage />
            </a>
            <Spacing vertical={2} />
            <div style={{ textAlign: 'center' }}>
              <MontserratTypography weight="bold" variant="h3" color="inherit">
                REFERRAL REWARDS
              </MontserratTypography>
            </div>
            <Spacing vertical={7} />
            <DockFooterMessageImage />
            {/* <MontserratTypography weight="normal" variant="h4" color="inherit">
              A simple, HIPAA-compliant task management and collaboration
              platform built specifically for healthcare.
            </MontserratTypography> */}
          </StyledGrid>
        </RightSideContentContainer>
      </RightSideMainContainer>
    </MainContainer>
  );
}
