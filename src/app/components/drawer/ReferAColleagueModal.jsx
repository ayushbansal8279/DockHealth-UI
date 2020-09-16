import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Grid } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import styled from 'styled-components';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import { FormContext, useForm } from 'react-hook-form';
import { object, string } from 'yup';
import Spacing from 'components/common/Spacing';
import { UniversalMontserratInput } from 'components/userProfileView/UniversalInput';
import { showAlert } from 'helpers/utility-functions';
import DockHeaderLogo from 'img/dock-header-logo.svg';

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  @media screen and (max-width: ${mdBreakpoint}px) {
    flex-direction: column;
  }
`;

const LeftSideMainContainer = styled.div`
  align-items: center;
  background-color: ${palette.midnightBlue};
  background-image: linear-gradient(
      to bottom,
      ${opacify(palette.midnightBlue, 0.5)},
      ${opacify(palette.midnightBlue, 0.5)}
    ),
    url(${AuthTemplateTopBackgroundTop}),
    url(${AuthTemplateTopBackgroundBottom});
  background-repeat: repeat-x;
  background-position: bottom, top;
  display: flex-root;
  max-width: 642px;
  height: 100%;
  justify-content: center;
  min-height: 100%;
  padding: 14rem 7rem 2rem 7rem;
  width: 50%;

  @media screen and (max-width: ${mdBreakpoint}px) {
    height: min-content;
    max-width: unset;
    min-height: min-content;
    padding: 1.5rem;
    width: 100%;
  }
`;

const LeftSideContentContainer = styled.div`
  color: ${palette.white};
  height: min-content;
  min-height: min-content;
  width: 100%;

  @media screen and (min-width: ${mdBreakpoint}px) {
    max-height: 721px;
    max-width: 525px;
  }
`;

const RightSideMainContainer = styled.div`
  align-items: center;
  background-color: ${palette.white};
  display: flex;
  flex: 1;
  height: min-content;
  justify-content: center;
  min-height: min-content;

  @media screen and (min-width: ${mdBreakpoint}px) {
    height: 100%;
    min-height: 100%;
  }
`;

const RightSideContentContainer = styled.div`
  align-items: flex-start;
  display: flex;
  height: min-content;
  justify-content: center;
  min-height: min-content;
  padding: 1.5rem;
  width: 100%;

  @media screen and (min-width: ${mdBreakpoint}px) {
    align-items: center;
    height: 100%;
    min-height: 100%;
    padding: 2rem;
    max-width: 495px;
  }
`;

const StyledForm = styled.form`
  width: 100%;
`;

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
  // firstName,
  // lastName,
  email,
}) => {
  try {
    /* await sendReferralEmail({
      firstName,
      lastName,
      email,
    }); */
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

  const [maxWidth, setMaxWidth] = React.useState('xl');

  return (
    <div>
      <Dialog
        open={openReferral}
        onClose={handleReferralClose}
        aria-labelledby="form-dialog-title"
        maxWidth={maxWidth}
      >
        <DialogContent>
          <MainContainer>
            <LeftSideMainContainer>
              <LeftSideContentContainer>
                <StyledForm
                  onSubmit={formMethods.handleSubmit(
                    onSubmit({
                      handleReferralClose,
                    }),
                  )}
                >
                  <FormContext {...formMethods}>
                    {/* <DialogContentText>
                      If you love dock health and want to refer a friend or colleague,
                      simply fill in their information below and we&apos;ll send an
                      invite to their inbox.
                    </DialogContentText> */}
                    <Spacing vertical={4} />
                    <MontserratTypography variant="h5">
                      <span style={{ color: palette.error }}>*</span>
                      <span> All fields required</span>
                    </MontserratTypography>
                    {/* <Spacing vertical={3} />
                    <UniversalMontserratInput name="firstName" label="First Name" />
                    <Spacing vertical={3} />
                    <UniversalMontserratInput name="lastName" label="Last Name" />
                    <Spacing vertical={3} />
                    <UniversalMontserratInput name="email" label="Email" />
                    <Spacing vertical={3} /> */}

                    {/* <DialogActions>
                    <Button onClick={handleReferralClose} color="primary">
                      Cancel
                    </Button>
                    <Button type="submit" color="primary">
                      Send Invite
                    </Button>
                  </DialogActions> */}
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
                    variant="h3"
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
