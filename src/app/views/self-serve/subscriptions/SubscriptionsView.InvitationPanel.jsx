import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';
import { invitePersonToOrganization } from '../../../actions/people-actions';
import { noop, showAlert } from '../../../helpers/utility-functions';
import useBoolean from '../../../hooks/useBoolean';
import {
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

const onSubmit = ({ closeInvitationPanel, dispatch, getAllUsers }) => data => {
  invitePersonToOrganization(data)(dispatch)
    .then(() => {
      toggleAlert('User added successfully', 'success');
      getAllUsers();
      closeInvitationPanel();
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.errorMessage ??
          'User could not be added, please try again later',
      });
    });
};

const InvitationPanel = ({ getAllUsers = () => {} }) => {
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
        <Button variant="contained" onClick={openInvitationPanel}>
          + Add more users to my organization
        </Button>
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
            onSubmit={event => {
              event.preventDefault();
              event.stopPropagation();
              handleSubmit(
                onSubmit({ closeInvitationPanel, dispatch, getAllUsers }),
              )(event);
            }}
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
                    autoComplete="none"
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
                    autoComplete="none"
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
                    autoComplete="none"
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
