import isNil from 'ramda/es/isNil';
import pathEq from 'ramda/es/pathEq';
import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  cancelInviteToOrganization,
  changeUserRoleForOrg,
  resendInviteToOrganization,
} from '../../../actions/people-actions';
import { showAlert, showToast } from '../../../helpers/utility-functions';
import useBoolean from '../../../hooks/useBoolean';
import {
  MemberTypeLabelButton,
  StyledListItem,
  StyledPopover,
} from './SubscriptionsView.MemberTypeLabel.Components';
import { H4 } from './SubscriptionsView.Styled';

const renderUserTypesOptions = ({
  changeUserRole,
  userId,
  userTypes,
  closePopover,
}) => {
  return Object.entries(userTypes)
    .filter(pathEq(['1', 'selectable'], true))
    .map(([role, { label }]) => (
      <StyledListItem
        key={role}
        button
        onClick={() => {
          changeUserRole({ userId, role })
            .then(() => {
              showToast({
                status: 'success',
                title: `User's role changed successfully`,
              });

              closePopover();
            })
            .catch(error => {
              showAlert({
                status: 'error',
                title: 'Error',
                text:
                  error.errorMessage ??
                  `User's role could not be changed, please try again later`,
              });

              closePopover();
            });
        }}
      >
        <H4>{label}</H4>
      </StyledListItem>
    ));
};

const renderInvitations = ({
  email,
  closePopover,
  resendInvite,
  cancelInvite,
}) => {
  return (
    <>
      <StyledListItem
        button
        onClick={() => {
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
                  error.errorMessage ??
                  'Invitation could not be resent, please try again later',
              });

              closePopover();
            });
        }}
      >
        <H4>Resend invitation</H4>
      </StyledListItem>
      <StyledListItem
        button
        onClick={() => {
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
                  error.errorMessage ??
                  'Invitation could not be cancelled, please try again later',
              });

              closePopover();
            });
        }}
      >
        <H4>Cancel invitation</H4>
      </StyledListItem>
    </>
  );
};

const MemberTypeLabel = ({
  email,
  userId,
  userType: { label, changeable, invitationModifiable },
  userTypes,
}) => {
  const labelReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const dispatch = useDispatch();

  const changeUserRole = useCallback(
    ({ userId: markedUserId, role }) =>
      changeUserRoleForOrg(markedUserId, role)(dispatch),
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

  const renderOptionsMethod = (() => {
    if (userId === Number(sessionStorage.userId)) {
      return null;
    }

    if (changeable) {
      return renderUserTypesOptions;
    }

    if (invitationModifiable && isNil(userId)) {
      return renderInvitations;
    }

    return null;
  })();

  return (
    <>
      <MemberTypeLabelButton
        ref={labelReference}
        clickable={Boolean(renderOptionsMethod)}
        onClick={renderOptionsMethod ? openPopover : undefined}
      >
        {label}
      </MemberTypeLabelButton>
      {renderOptionsMethod && (
        <StyledPopover
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
        >
          {renderOptionsMethod({
            userId,
            userTypes,
            closePopover,
            changeUserRole,
            email,
            resendInvite,
            cancelInvite,
          })}
        </StyledPopover>
      )}
    </>
  );
};

export default MemberTypeLabel;
