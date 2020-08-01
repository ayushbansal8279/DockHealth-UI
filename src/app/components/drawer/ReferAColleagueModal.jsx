import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
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

  return (
    <div>
      <Dialog
        open={openReferral}
        onClose={handleReferralClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Refer a colleague</DialogTitle>

        <StyledForm
          onSubmit={formMethods.handleSubmit(
            onSubmit({
              handleReferralClose,
            }),
          )}
        >
          <FormContext {...formMethods}>
            <DialogContent>
              <DialogContentText>
                If you love dock health and want to refer a friend or colleague,
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
            </DialogContent>

            <DialogActions>
              <Button onClick={handleReferralClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Send Invite
              </Button>
            </DialogActions>
          </FormContext>
        </StyledForm>
      </Dialog>
    </div>
  );
}
