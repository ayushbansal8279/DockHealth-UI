/* eslint-disable @typescript-eslint/camelcase */
import { Button, Grid, Popover } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';
import { invitePersonToOrganization } from '../actions/people-actions';
import { showAlert } from '../helpers/utility-functions';
import {
  InvitePeoplePopoverContainer,
  InvitePeoplePopoverSection,
  InvitePopoverCloseButton,
  InvitePopoverDivider,
  PopoverErrorCollapse,
  PopoverErrorLabel,
  StyledFormControl,
  StyledInputBase,
  StyledInputLabel,
} from './PeopleView.Styled';

const onSubmit = ({ closePopover, dispatch, getAllUsers }) => ({
  email,
  first_name: firstName,
  last_name: lastName,
}) => {
  invitePersonToOrganization({
    email,
    firstName,
    lastName,
  })(dispatch)
    .then(() => {
      closePopover();
      toggleAlert('Invitation sent successfully', 'success');
      getAllUsers();
    })
    .catch(error => {
      closePopover();
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error.errorMessage ??
          'Invitation could not be sent, please try again later',
      });
    });
};

const InvitePeopleForm = ({
  handleSubmit,
  closePopover,
  dispatch,
  register,
  getAllUsers,
  errors,
}) => {
  // eslint-disable-next-line camelcase
  const firstNameError = errors?.first_name?.message;
  // eslint-disable-next-line camelcase
  const lastNameError = errors?.last_name?.message;
  const emailError = errors?.email?.message;

  const hasFirstNameError = Boolean(firstNameError);
  const hasLastNameError = Boolean(lastNameError);
  const hasEmailError = Boolean(emailError);

  return (
    <form
      onSubmit={event => {
        event.stopPropagation();
        event.preventDefault();
        handleSubmit(onSubmit({ closePopover, dispatch, getAllUsers }))(event);
      }}
      autoComplete="off"
      autoCorrect="off"
    >
      <InvitePeoplePopoverSection>
        <StyledFormControl margin="dense" fullWidth error={hasFirstNameError}>
          <StyledInputLabel required>First Name</StyledInputLabel>
          <StyledInputBase
            error={hasFirstNameError}
            name="first_name"
            inputRef={register}
            autoFocus
            autoComplete={uuid()}
          />
        </StyledFormControl>
        <PopoverErrorCollapse in={hasFirstNameError}>
          <PopoverErrorLabel>{firstNameError}</PopoverErrorLabel>
        </PopoverErrorCollapse>
        <StyledFormControl margin="dense" fullWidth>
          <StyledInputLabel required>Last Name</StyledInputLabel>
          <StyledInputBase
            error={hasLastNameError}
            name="last_name"
            inputRef={register}
            autoComplete={uuid()}
          />
        </StyledFormControl>
        <PopoverErrorCollapse in={hasLastNameError}>
          <PopoverErrorLabel>{lastNameError}</PopoverErrorLabel>
        </PopoverErrorCollapse>
        <StyledFormControl margin="dense" fullWidth>
          <StyledInputLabel required>Email</StyledInputLabel>
          <StyledInputBase
            error={hasEmailError}
            name="email"
            inputRef={register}
            autoComplete={uuid()}
          />
        </StyledFormControl>
        <PopoverErrorCollapse in={hasEmailError}>
          <PopoverErrorLabel>{emailError}</PopoverErrorLabel>
        </PopoverErrorCollapse>
      </InvitePeoplePopoverSection>
      <InvitePeoplePopoverSection>
        <Grid container justify="center">
          <Button
            onClick={closePopover}
            type="button"
            variant="text"
            size="small"
            onKeyUp={event => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            Cancel
          </Button>
          <Button size="small" variant="text" bold type="submit">
            <b>Send invite</b>
          </Button>
        </Grid>
      </InvitePeoplePopoverSection>
    </form>
  );
};

const REQUIRED_MESSAGE = 'This field is required';

const validationSchema = object().shape({
  first_name: string().required(REQUIRED_MESSAGE),
  last_name: string().required(REQUIRED_MESSAGE),
  email: string()
    .required(REQUIRED_MESSAGE)
    .email('This field requires valid email address'),
});

const InvitePeoplePopover = ({
  anchor,
  open,
  toggleInvitePopover,
  getAllUsers = () => {},
}) => {
  const { handleSubmit, register, errors } = useForm({
    validationSchema,
  });
  const dispatch = useDispatch();
  const orgUserRole = useSelector(
    store => store.userState.userProfile?.orgUserRole,
  );

  const isOwnerOrAdmin = orgUserRole === 'OWNER' || orgUserRole === 'ADMIN';

  const closePopover = useCallback(
    event => {
      // eslint-disable-next-line no-unused-expressions
      event?.preventDefault();
      toggleInvitePopover({ newInvitePopoverState: false });
    },
    [toggleInvitePopover],
  );

  return (
    <Popover
      anchorEl={anchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={() => {
        toggleInvitePopover({ newInvitePopoverState: false });
      }}
    >
      <InvitePeoplePopoverContainer>
        <InvitePeoplePopoverSection>
          <Grid container justify="space-between" alignItems="center">
            <span>Invite to list</span>
            <InvitePopoverCloseButton onClick={closePopover} type="button">
              &times;
            </InvitePopoverCloseButton>
          </Grid>
        </InvitePeoplePopoverSection>
        <InvitePopoverDivider />
        {isOwnerOrAdmin && (
          <InvitePeopleForm
            closePopover={closePopover}
            dispatch={dispatch}
            handleSubmit={handleSubmit}
            register={register}
            getAllUsers={getAllUsers}
            errors={errors}
          />
        )}
        {!isOwnerOrAdmin && (
          <InvitePeoplePopoverSection>
            Because you are not an administrator, you are unable to invite a new
            user to your organization. Please contact your administrator to add
            a new user.
          </InvitePeoplePopoverSection>
        )}
      </InvitePeoplePopoverContainer>
    </Popover>
  );
};

InvitePeoplePopover.propTypes = {
  anchor: PropTypes.instanceOf(Element).isRequired,
  open: PropTypes.bool.isRequired,
  toggleInvitePopover: PropTypes.func.isRequired,
};

export default InvitePeoplePopover;
