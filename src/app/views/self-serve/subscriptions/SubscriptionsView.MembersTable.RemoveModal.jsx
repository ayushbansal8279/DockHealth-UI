import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { changeUserRoleForOrg } from '../../../actions/people-actions';
import { showAlert } from '../../../helpers/utility-functions';
import { MemberAvatar } from './SubscriptionsView.OrganizationMemberRow';

const GrayDialog = withStyles({
  paper: {
    backgroundColor: '#F3F5F6',
    padding: '1.5rem',
  },
})(Dialog);

const RemoveModalDivider = withStyles({
  root: {
    margin: '1rem 0',
  },
})(Divider);

const PeopleContainer = styled.div`
  background-color: #fff;
  min-height: 2rem;
  margin: 0.5rem 0;
  max-height: 20rem;
  overflow: auto;
`;

const PersonRow = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 4rem;
  max-height: 4rem;
  padding: 0 0.75rem;
  margin: 0.375rem 0;
  transition: all 0.25s ease-out;

  ${props => props.selected && 'background-color: #d4f3ff;'}
`;

const MemberAvatarContainer = styled.div`
  align-items: center;
  display: flex;
  height: 3.5rem;
  justify-content: center;
  margin-right: 0.5rem;
  width: 3.5rem;
`;

const toggleAndClose = ({
  toggleSelectedUser,
  closeDialog,
  userIdentifier,
  email,
}) => () => {
  toggleSelectedUser({ userIdentifier, email })({
    target: { checked: false },
  });
  closeDialog();
};

const RemoveNormalUserContent = ({
  closeDialog,
  userIdentifier,
  email,
  toggleSelectedUser,
}) => (
  <>
    <div>You are about to remove this user from your subscription.</div>
    <div>- This user will no longer have access to Dock Health</div>
    <div>
      - If this user currently has any assigned tasks, those tasks will become
      unassigned
    </div>
    <Grid container justify="center">
      <Button size="small" variant="text" onClick={closeDialog}>
        No, cancel
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={toggleAndClose({
          toggleSelectedUser,
          closeDialog,
          userIdentifier,
          email,
        })}
      >
        Yes, remove
      </Button>
    </Grid>
  </>
);

const RemoveAdminUserContent = ({
  closeDialog,
  toggleSelectedUser,
  email,
  organizationMembers,
  userIdentifier,
  newAdmin,
  setNewAdmin,
  changeAdmin,
}) => {
  const filteredOrganizationMembers =
    organizationMembers?.filter(
      ({ userIdentifier: memberId, orgUserRole }) =>
        memberId !== userIdentifier &&
        memberId &&
        orgUserRole !== 'ADMIN' &&
        orgUserRole !== 'OWNER',
    ) ?? [];

  return (
    <>
      <div>
        You are removing an organizational admin and you must have one admin at
        a minimum. Please assign another administrator for your organization.
      </div>
      <PeopleContainer>
        {filteredOrganizationMembers.map(member => {
          const memberKey = member.userIdentifier ?? member.email;

          return (
            <PersonRow
              key={memberKey}
              onClick={() => setNewAdmin(member)}
              selected={
                member.userIdentifier === newAdmin?.userIdentifier ||
                member.email === newAdmin?.email
              }
            >
              <MemberAvatarContainer>
                <MemberAvatar {...member} />
              </MemberAvatarContainer>
              <div>{`${member.firstName} ${member.lastName}`.trim()}</div>
            </PersonRow>
          );
        })}
      </PeopleContainer>
      <Grid container justify="flex-end">
        <Button size="small" variant="text" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={!newAdmin}
          onClick={() => {
            changeAdmin()
              .then(
                toggleAndClose({
                  toggleSelectedUser,
                  closeDialog,
                  userIdentifier,
                  email,
                }),
              )
              .catch(error => {
                showAlert({
                  status: 'error',
                  title: 'Error',
                  text:
                    error?.message ??
                    error?.errorMessage ??
                    `User's role could not be changed, please try again later`,
                });
                closeDialog();
              });
          }}
        >
          Assign admin
        </Button>
      </Grid>
    </>
  );
};

const RemoveUnavailableContent = ({ closeDialog }) => (
  <>
    <div>Cannot remove the only remaining user from subscription</div>
    <Grid container justify="center">
      <Button size="small" variant="contained" onClick={closeDialog}>
        OK
      </Button>
    </Grid>
  </>
);

const getDialogContentComponent = ({
  adminCount,
  orgUserRole,
  hasOneUserRemaining,
}) => {
  if (hasOneUserRemaining) {
    return RemoveUnavailableContent;
  }

  if (
    adminCount === 1 &&
    (orgUserRole === 'ADMIN' || orgUserRole === 'OWNER')
  ) {
    return RemoveAdminUserContent;
  }

  return RemoveNormalUserContent;
};

const RemoveModal = ({
  closeDialog,
  open,
  userIdentifier,
  email,
  toggleSelectedUser,
  organizationMembers,
  orgUserRole,
}) => {
  const [newAdmin, setNewAdmin] = useState(null);
  const dispatch = useDispatch();

  const newAdminUserId = newAdmin?.userIdentifier;

  const changeAdmin = useCallback(
    () => changeUserRoleForOrg(newAdminUserId, 'ADMIN')(dispatch),
    [dispatch, newAdminUserId],
  );

  useEffect(() => {
    if (open) {
      setNewAdmin(null);
    }
  }, [open]);

  const adminCount =
    organizationMembers?.filter(
      ({ orgUserRole: memberUserRole }) =>
        memberUserRole === 'ADMIN' || memberUserRole === 'OWNER',
    )?.length ?? 0;

  const hasOneUserRemaining = organizationMembers.length === 1;

  const DialogContentComponent = getDialogContentComponent({
    adminCount,
    orgUserRole,
    hasOneUserRemaining,
  });

  return (
    <GrayDialog open={open} fullWidth maxWidth="sm">
      {!hasOneUserRemaining && (
        <>
          <div>Remove user from subscription</div>
          <RemoveModalDivider />
        </>
      )}
      <DialogContentComponent
        closeDialog={closeDialog}
        userIdentifier={userIdentifier}
        email={email}
        toggleSelectedUser={toggleSelectedUser}
        organizationMembers={organizationMembers}
        newAdmin={newAdmin}
        setNewAdmin={setNewAdmin}
        changeAdmin={changeAdmin}
      />
    </GrayDialog>
  );
};

export default RemoveModal;
