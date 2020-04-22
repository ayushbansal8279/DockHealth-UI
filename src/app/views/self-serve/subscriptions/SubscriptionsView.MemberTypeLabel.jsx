import { pathEq } from 'ramda';
import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  cancelInviteToOrganization,
  changeUserRoleForOrg,
  findAllUsers,
  resendInviteToOrganization,
} from 'actions/people-actions';
import ListPopover from 'components/common/ListPopover';
import { showAlert, showToast } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import { MontserratTypography } from 'app/theme-montserrat';
import { MemberTypeLabelButton } from './SubscriptionsView.MemberTypeLabel.Components';

const renderUserTypesOptions = ({
  changeUserRole,
  userIdentifier,
  userTypes,
  closePopover,
  reloadUsers,
}) => {
  return Object.entries(userTypes)
    .filter(pathEq(['1', 'selectable'], true))
    .map(([role, { label }]) => ({
      key: role,
      button: true,
      label,
      onClick: () => {
        changeUserRole({ userIdentifier, role })
          .then(() => {
            showToast({
              status: 'success',
              title: `User's role changed successfully`,
            });
            reloadUsers();
            closePopover();
          })
          .catch(error => {
            showAlert({
              status: 'error',
              title: 'Error',
              text:
                error?.errorMessage ??
                `User's role could not be changed, please try again later`,
            });

            closePopover();
          });
      },
    }));
};

const renderInvitations = ({
  email,
  closePopover,
  resendInvite,
  cancelInvite,
}) => {
  return [
    {
      key: 'resend',
      button: true,
      label: 'Resend invitation',
      onClick: () => {
        resendInvite({ email })
          .then(() => {
            showToast({
              status: 'success',
              title: 'Invitation resent successfully',
            });

            closePopover();
          })
          .catch(error => {
            showAlert({
              status: 'error',
              title: 'Error',
              text:
                error?.errorMessage ??
                'Invitation could not be resent, please try again later',
            });

            closePopover();
          });
      },
    },
    {
      key: 'cancel',
      button: true,
      label: 'Cancel invitation',
      onClick: () => {
        cancelInvite({ email })
          .then(() => {
            showToast({
              status: 'success',
              title: 'Invitation cancelled successfully',
            });

            closePopover();
          })
          .catch(error => {
            showAlert({
              status: 'error',
              title: 'Error',
              text:
                error?.errorMessage ??
                'Invitation could not be cancelled, please try again later',
            });

            closePopover();
          });
      },
    },
  ];
};

const MemberTypeLabel = ({
  email,
  userIdentifier,
  userType: { label, changeable, invitationModifiable },
  userTypes,
}) => {
  const labelReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const dispatch = useDispatch();

  const changeUserRole = useCallback(
    ({ userIdentifier: markedUserIdentifier, role }) =>
      changeUserRoleForOrg(markedUserIdentifier, role)(dispatch),
    [dispatch],
  );

  const resendInvite = useCallback(
    ({ email: userEmail }) => resendInviteToOrganization(userEmail)(dispatch),
    [dispatch],
  );

  const cancelInvite = useCallback(
    ({ email: userEmail }) => cancelInviteToOrganization(userEmail)(dispatch),
    [dispatch],
  );

  const reloadUsers = useCallback(() => findAllUsers()(dispatch), [dispatch]);

  const renderOptionsMethod = (() => {
    if (userIdentifier === sessionStorage.userIdentifier) {
      return null;
    }

    if (invitationModifiable) {
      return renderInvitations;
    }

    if (changeable) {
      return renderUserTypesOptions;
    }

    return null;
  })();

  return (
    <>
      <MemberTypeLabelButton
        ref={labelReference}
        invited={invitationModifiable}
        clickable={Boolean(renderOptionsMethod)}
        onClick={renderOptionsMethod ? openPopover : undefined}
      >
        <MontserratTypography variant="h4">{label}</MontserratTypography>
      </MemberTypeLabelButton>
      {renderOptionsMethod && (
        <ListPopover
          anchorEl={labelReference.current}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          onClose={closePopover}
          open={isPopoverOpen}
          items={renderOptionsMethod({
            userIdentifier,
            userTypes,
            closePopover,
            changeUserRole,
            email,
            resendInvite,
            cancelInvite,
            reloadUsers,
          })}
        />
      )}
    </>
  );
};

export default MemberTypeLabel;
