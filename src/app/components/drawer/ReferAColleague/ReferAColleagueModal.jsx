import React from 'react';
import { Dialog } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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
const onSubmit = ({ handleReferralClose }) => async ({
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
    handleReferralClose();
    showAlert({
      status: 'success',
      title: 'Email Sent',
      text: `Thanks. We have sent an email to ${email}`,
    });
  } catch (error) {
    showAlert({
      status: 'error',
      title: 'Error',
      text: error?.message ?? 'Could not send an email, please try again later',
    });
  }
};

export default function ReferAColleagueModal({ ...props }) {
  const { openReferral, handleReferralClose } = props;

  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });

  const [maxWidth] = React.useState('xl');

  return (
    <div>
      <Dialog
        open={openReferral}
        onClose={handleReferralClose}
        aria-labelledby="form-dialog-title"
        maxWidth={maxWidth}
      >
        <DialogContent style={{ height: '700px', padding: '0' }}>
          <MainContainer>
            <LeftSideMainContainer>
              <CloseButton size="small" onClick={handleReferralClose}>
                <Close />
              </CloseButton>
              <LeftSideContentContainer>
                <StyledForm
                  onSubmit={formMethods.handleSubmit(
                    onSubmit({
                      handleReferralClose,
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
                      If you love Dock Health and want to refer a friend or
                      colleague, simply fill in their information below and
                      we&apos;ll send an invite to their inbox.
                    </DialogContentText>
                    <Spacing vertical={4} />
                    <MontserratTypography variant="h5">
                      <span style={{ color: palette.error }}>*</span>
                      <span> All fields required</span>
                    </MontserratTypography>
                    <Spacing vertical={3} />
                    <UniversalMontserratInput
                      name="firstName"
                      label="First Name"
                    />
                    <Spacing vertical={3} />
                    <UniversalMontserratInput
                      name="lastName"
                      label="Last Name"
                    />
                    <Spacing vertical={3} />
                    <UniversalMontserratInput name="email" label="Email" />
                    <Spacing vertical={3} />

                    <DialogActions>
                      <ButtonWrapper>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={handleReferralClose}
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
                  <a href="/#/">
                    <DockLogoImage />
                  </a>
                  <Spacing vertical={5} />
                  <MontserratTypography
                    weight="normal"
                    variant="h4"
                    color="inherit"
                  >
                    A simple, HIPAA compliant task management and collaboration
                    platform built specifically for healthcare.
                  </MontserratTypography>
                </StyledGrid>
              </RightSideContentContainer>
            </RightSideMainContainer>
          </MainContainer>
        </DialogContent>
        {/* <DialogTitle id="form-dialog-title" style={{fontSize: '20px'}}>Refer a colleague</DialogTitle> */}
      </Dialog>
    </div>
  );
}
