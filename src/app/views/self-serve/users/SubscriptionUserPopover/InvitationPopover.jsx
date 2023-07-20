import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import SelectorPopover from 'components/common/SelectorPopover/SelectorPopover';
import Button from 'components/common/Button/Button';
import {
  resendInviteToOrganization,
  cancelInviteToOrganization,
} from 'api/organization-api';
import {
  InvitationItem,
  InvitationItemLabel,
  InvitationItemDescription,
} from './styled';

const renderInvitations = ({
  userIdentifier,
  closePopover,
  resendInvite,
  cancelInvite,
  reloadUsers,
  userStatus,
  dispatch,
}) => {
  return [
    {
      key: 'resend',
      button: true,
      label: 'Resend invitation',
      description:
        'Resend the email invite to this user and remind them to create an account.',
      onSave: () => {
        resendInvite({ userIdentifier })
          .then(() => {
            dispatch(showGlobalAlert('Invitation resent successfully'));
            reloadUsers();
            closePopover();
          })
          .catch((error) => {
            dispatch(
              showGlobalErrorAlert(
                error?.message ??
                  'Invitation could not be resent, please try again later',
              ),
            );

            closePopover();
          });
      },
    },
    {
      key: 'cancel',
      button: true,
      label: 'Cancel invitation',
      isDisabled: userStatus === 'CANCELLED',
      description:
        'Cancel this invitation and remove this person from the user list.',
      onSave: () => {
        cancelInvite({ userIdentifier })
          .then(() => {
            dispatch(showGlobalAlert('Invitation cancelled successfully'));
            reloadUsers();
            closePopover();
          })
          .catch((error) => {
            dispatch(
              showGlobalErrorAlert(
                error?.message ??
                  'Invitation could not be cancelled, please try again later',
              ),
            );
            closePopover();
          });
      },
    },
  ];
};

const renderInvitationItem = ({
  key,
  label,
  description,
  isDisabled,
  onSave,
}) => (
  <InvitationItem key={key}>
    <div>
      <InvitationItemLabel>{label}</InvitationItemLabel>
      <InvitationItemDescription>{description}</InvitationItemDescription>
      <Button
        onClick={onSave}
        disabled={isDisabled}
        variant={key === 'cancel' ? 'secondary' : 'primary'}
      >
        {label}
      </Button>
    </div>
  </InvitationItem>
);

const InvitationPopover = ({
  labelReference,
  isPopoverOpen,
  changeable,
  closePopover,
  email,
  userIdentifier,
  orgUserRole,
  userStatus,
  reloadUsers,
}) => {
  const dispatch = useDispatch();

  const resendInvite = useCallback(
    ({ userIdentifier: id }) => resendInviteToOrganization(id),
    [],
  );

  const cancelInvite = useCallback(
    ({ userIdentifier: id }) => cancelInviteToOrganization(id),
    [],
  );

  return (
    <SelectorPopover
      anchorEl={labelReference?.current}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      renderItem={renderInvitationItem}
      onClose={closePopover}
      open={isPopoverOpen}
      withPadding={changeable}
      items={renderInvitations({
        userStatus,
        userIdentifier,
        closePopover,
        email,
        reloadUsers,
        orgUserRole,
        resendInvite,
        cancelInvite,
        dispatch,
      })}
    />
  );
};

export default InvitationPopover;
