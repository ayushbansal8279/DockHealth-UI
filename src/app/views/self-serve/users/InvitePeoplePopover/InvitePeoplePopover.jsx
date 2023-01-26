import { Grid, Popover } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import { invitePersonToOrganization } from 'api/organization-api';
import { showAlert } from 'helpers/utility-functions';
import * as AlertActions from 'alert/actions';
import OrganizationOwnerForm from 'components/user/InviteMemberToListForm/ExternalInviteForm/OrganizationOwnerForm/OrganizationOwnerForm';
import {
  InvitePeoplePopoverContainer,
  InvitePeoplePopoverSection,
  InvitePopoverCloseButton,
  InvitePopoverDivider,
  InvitePopoverHeader,
} from './styled';

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
    resolver: yupResolver(validationSchema),
    reValidateMode: 'onSubmit',
  });
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);

  const isOwnerOrAdmin = checkIfUserIsOrganizationAdmin(currentUser);

  const closePopover = useCallback(
    (event) => {
      // eslint-disable-next-line no-unused-expressions
      event?.preventDefault();
      toggleInvitePopover({ newInvitePopoverState: false });
    },
    [toggleInvitePopover],
  );

  const [isInviting, setIsInviting] = useState(false);

  const onSubmit = (data) => {
    setIsInviting(true);
    invitePersonToOrganization(data)
      .then(() => {
        closePopover();
        dispatch(
          AlertActions.showGlobalAlert(
            'Invitation sent successfully',
            'success',
          ),
        );
        getAllUsers();
        setIsInviting(false);
      })
      .catch((error) => {
        closePopover();
        showAlert({
          status: 'error',
          title: 'Error',
          text:
            error?.response?.data?.errorMessage ??
            error?.message ??
            'Invitation could not be sent, please try again later',
        });
        setIsInviting(false);
      });
  };

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
          <Grid container justifyContent="space-between" alignItems="center">
            <InvitePopoverHeader>Invite User</InvitePopoverHeader>
            <InvitePopoverCloseButton onClick={closePopover} type="button">
              &times;
            </InvitePopoverCloseButton>
          </Grid>
        </InvitePeoplePopoverSection>
        <InvitePopoverDivider />
        {isOwnerOrAdmin && (
          <FormProvider {...formMethods}>
            <OrganizationOwnerForm
              onSubmit={onSubmit}
              closeInviteForm={closePopover}
              disabled={isInviting}
            />
          </FormProvider>
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
