/* eslint-disable @typescript-eslint/camelcase */
import { Button, Grid, Popover } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';
import { invitePersonToOrganization } from '../actions/people-actions';
import { UniversalInput } from '../components/userProfileView/UniversalInput';
import { showAlert } from '../helpers/utility-functions';
import {
  InvitePeoplePopoverContainer,
  InvitePeoplePopoverSection,
  InvitePopoverCloseButton,
  InvitePopoverDivider,
} from './PeopleView.Styled';
import Spacing from '../components/common/Spacing';

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
  getAllUsers,
}) => {
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
        <UniversalInput
          label="First Name"
          name="first_name"
          autoFocus
          autoComplete={uuid()}
          whiteBackground
        />
        <Spacing vertical={3} />
        <UniversalInput
          label="Last Name"
          name="last_name"
          autoComplete={uuid()}
          whiteBackground
        />
        <Spacing vertical={3} />
        <UniversalInput
          label="Email"
          name="email"
          autoComplete={uuid()}
          whiteBackground
        />
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
  const formMethods = useForm({
    validationSchema,
    reValidateMode: 'onSubmit',
  });
  const { handleSubmit } = formMethods;
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
          <FormContext {...formMethods}>
            <InvitePeopleForm
              closePopover={closePopover}
              dispatch={dispatch}
              handleSubmit={handleSubmit}
              getAllUsers={getAllUsers}
            />
          </FormContext>
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
