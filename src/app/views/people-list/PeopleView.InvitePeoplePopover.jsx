/* eslint-disable @typescript-eslint/camelcase */
import { Grid, Popover } from '@material-ui/core';
import React, { useCallback } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { object, string } from 'yup';
import { invitePersonToOrganization } from 'actions/people-actions';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import FormInput from 'components/common/Input/FormInput';
import { showAlert } from 'helpers/utility-functions';
import palette from 'styles/palette';
import { MontserratTypography } from 'styles/theme-montserrat';
import * as AlertActions from 'alert/actions';
import {
  InvitePeoplePopoverContainer,
  InvitePeoplePopoverSection,
  InvitePopoverCloseButton,
  InvitePopoverDivider,
  InvitePopoverHeader,
} from './styled';

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
      dispatch(
        AlertActions.showGlobalAlert('Invitation sent successfully', 'success'),
      );
      getAllUsers();
    })
    .catch(error => {
      closePopover();
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          error?.message ??
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
        <MontserratTypography variant="h5">
          <span style={{ color: palette.error }}>*</span>
          <span> All fields required</span>
        </MontserratTypography>
        <Spacing vertical={3} />
        <FormInput
          label="First Name"
          name="first_name"
          autoFocus
          autoComplete={uuid()}
        />
        <Spacing vertical={3} />
        <FormInput label="Last Name" name="last_name" autoComplete={uuid()} />
        <Spacing vertical={3} />
        <FormInput label="Email" name="email" autoComplete={uuid()} />
      </InvitePeoplePopoverSection>
      <InvitePeoplePopoverSection>
        <Grid container justify="center" spacing={2}>
          <Grid item xs={6}>
            <Button onClick={closePopover} variant="text">
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button type="submit">Send invite</Button>
          </Grid>
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
    .email('Please enter a valid email address'),
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
            <InvitePopoverHeader>Invite User</InvitePopoverHeader>
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

export default InvitePeoplePopover;
