import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { invitePersonToOrganization } from '../actions/people-actions';
import { showAlert, showToast } from '../helpers/utility-functions';
import {
  InvitePeoplePopoverContainer,
  InvitePeoplePopoverSection,
  InvitePopoverCloseButton,
  InvitePopoverDivider,
  PopoverSectionButton,
  PopoverSectionButtonContainer,
  StyledFormControl,
  StyledInputBase,
  StyledInputLabel,
} from './PeopleView.Styled';

const onSubmit = ({ closePopover, dispatch }) => ({
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
      showToast({
        status: 'success',
        title: 'Invitation sent successfully',
      });
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
}) => (
  <form
    onSubmit={event => {
      event.stopPropagation();
      event.preventDefault();
      handleSubmit(onSubmit({ closePopover, dispatch }))(event);
    }}
  >
    <InvitePeoplePopoverSection>
      <StyledFormControl fullWidth>
        <StyledInputLabel required>First Name</StyledInputLabel>
        <StyledInputBase name="first_name" inputRef={register} />
      </StyledFormControl>
      <StyledFormControl fullWidth>
        <StyledInputLabel required>Last Name</StyledInputLabel>
        <StyledInputBase name="last_name" inputRef={register} />
      </StyledFormControl>
      <StyledFormControl fullWidth>
        <StyledInputLabel required>Email</StyledInputLabel>
        <StyledInputBase name="email" inputRef={register} />
      </StyledFormControl>
    </InvitePeoplePopoverSection>
    <InvitePeoplePopoverSection>
      <PopoverSectionButtonContainer>
        <PopoverSectionButton onClick={closePopover}>
          Cancel
        </PopoverSectionButton>
        <PopoverSectionButton bold type="submit">
          Send invite
        </PopoverSectionButton>
      </PopoverSectionButtonContainer>
    </InvitePeoplePopoverSection>
  </form>
);

const InvitePeoplePopover = ({ anchor, open, toggleInvitePopover }) => {
  const { handleSubmit, register } = useForm();
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
