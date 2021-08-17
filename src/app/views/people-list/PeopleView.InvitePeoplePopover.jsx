/* eslint-disable @typescript-eslint/camelcase */
import { Grid, Popover } from '@material-ui/core';
import React, { useCallback } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { object, string } from 'yup';
import { invitePersonToOrganization } from 'actions/people-actions';
import { showAlert } from 'helpers/utility-functions';
import * as AlertActions from 'alert/actions';
import OrganizationOwnerForm from 'components/members/InviteMemberToListForm/ExternalInviteForm/OrganizationOwnerForm/OrganizationOwnerForm';
import {
  InvitePeoplePopoverContainer,
  InvitePeoplePopoverSection,
  InvitePopoverCloseButton,
  InvitePopoverDivider,
  InvitePopoverHeader,
} from './styled';

const onSubmit = ({ closePopover, dispatch, getAllUsers }) => data => {
  invitePersonToOrganization(data, { userRole: data.userRole })(dispatch)
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
            <OrganizationOwnerForm
              onSubmit={onSubmit({ closePopover, dispatch, getAllUsers })}
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
