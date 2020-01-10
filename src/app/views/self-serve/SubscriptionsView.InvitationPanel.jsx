import Grid from '@material-ui/core/Grid';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import useForm from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { object, string } from 'yup';

import { invitePersonToOrganization } from '../../actions/people-actions';
import { noop } from '../../helpers/utility-functions';
import useBoolean from '../../hooks/useBoolean';
import {
  AddMoreUsersLabel,
  CloseButtonContainer,
  InputErrorLabel,
  InvitationPanelContainer,
  InvitationPanelHeader,
  PanelButtonContainer,
  StyledButton,
  StyledFormControl,
  StyledInputBase,
  StyledInputLabel,
} from './SubscriptionsView.InvitationPanel.Styled';

const REQUIRED_MESSAGE = 'This field is required';

const animationProperties = {
  variants: {
    hidden: { height: 0, opacity: 0 },
    visible: { height: '8.375rem', opacity: 1 },
  },
  initial: 'hidden',
  exit: 'hidden',
  animate: 'visible',
  transition: { ease: 'backInOut', duration: 0.25 },
};

const onSubmit = ({ closeInvitationPanel, dispatch }) => data => {
  invitePersonToOrganization(data)(dispatch)
    .catch(() => {
      Swal.fire({
        icon: 'success',
        title: 'User added successfully',
        toast: true,
        timerProgressBar: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false,
      });

      // fix z-index for drawer container
      Swal.getContainer().style.zIndex = 10000;

      closeInvitationPanel();
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error?.errorMessage ??
          'User could not be added, please try again later',
      });

      // fix z-index for drawer container
      Swal.getContainer().style.zIndex = 10000;
    });
};

const InvitationPanel = () => {
  const dispatch = useDispatch();

  const [
    isInvitationPanelOpen,
    openInvitationPanel,
    closeInvitationPanel,
  ] = useBoolean(false);

  const { handleSubmit, errors, register } = useForm({
    validationSchema: object().shape({
      firstName: string().required(REQUIRED_MESSAGE),
      lastName: string().required(REQUIRED_MESSAGE),
      email: string()
        .required(REQUIRED_MESSAGE)
        .email('Invalid email format'),
    }),
  });

  const firstNameError = errors?.firstName?.message;
  const lastNameError = errors?.lastName?.message;
  const emailError = errors?.email?.message;

  return (
    <InvitationPanelContainer open={isInvitationPanelOpen}>
      <InvitationPanelHeader>
        <AddMoreUsersLabel onClick={openInvitationPanel}>
          + Add more users to my organization
        </AddMoreUsersLabel>
        <CloseButtonContainer
          open={isInvitationPanelOpen}
          onClick={isInvitationPanelOpen ? closeInvitationPanel : noop}
        >
          &times;
        </CloseButtonContainer>
      </InvitationPanelHeader>
      <AnimatePresence>
        {isInvitationPanelOpen && (
          <motion.form
            {...animationProperties}
            onSubmit={handleSubmit(
              onSubmit({ closeInvitationPanel, dispatch }),
            )}
          >
            <Grid container spacing={16}>
              <Grid item xs={3}>
                <InputErrorLabel>{firstNameError}</InputErrorLabel>
                <StyledFormControl error={firstNameError} fullWidth>
                  <StyledInputLabel required>First Name</StyledInputLabel>
                  <StyledInputBase
                    error={firstNameError}
                    name="firstName"
                    inputRef={register}
                  />
                </StyledFormControl>
              </Grid>
              <Grid item xs={3}>
                <InputErrorLabel>{lastNameError}</InputErrorLabel>
                <StyledFormControl error={lastNameError} fullWidth>
                  <StyledInputLabel required>Last Name</StyledInputLabel>
                  <StyledInputBase
                    error={lastNameError}
                    name="lastName"
                    inputRef={register}
                  />
                </StyledFormControl>
              </Grid>
              <Grid item xs={6}>
                <InputErrorLabel>{emailError}</InputErrorLabel>
                <StyledFormControl error={emailError} fullWidth>
                  <StyledInputLabel required>Email</StyledInputLabel>
                  <StyledInputBase
                    error={emailError}
                    name="email"
                    inputRef={register}
                  />
                </StyledFormControl>
              </Grid>
            </Grid>
            <PanelButtonContainer container justify="flex-end">
              <StyledButton
                type="button"
                variant="text"
                onClick={closeInvitationPanel}
              >
                Cancel
              </StyledButton>
              <StyledButton type="submit" variant="contained">
                Add to organization
              </StyledButton>
            </PanelButtonContainer>
          </motion.form>
        )}
      </AnimatePresence>
    </InvitationPanelContainer>
  );
};

export default InvitationPanel;
