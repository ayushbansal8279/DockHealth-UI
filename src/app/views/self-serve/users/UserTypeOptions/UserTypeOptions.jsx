/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { openModal as openModalAction } from 'modal/actions';
import {
  userHasViewOnlyFeatureSelector,
  userHasDockGuestFeatureSelector,
} from 'selectors/user-selectors';
import UserTypeLabel from './UserTypeLabel';
import { getUserTypeLabel, USER_TYPES } from '../helpers';
import { useRoleContext } from '@/app/views/workspace/workspace-users/RoleContext';

const UserTypeOptions = ({
  firstName,
  lastName,
  credentials,
  email,
  userStatus,
  orgUserRole,
  userIdentifier,
  eulaAcknowledged,
  isUserSelected,
  toggleSelectedUser,
  openRemoveSubscriptionModal,
  organizationMembers,
  isInvited,
  changeUserRole,
}) => {
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const { roleConfig } = useRoleContext();

  const userType = useMemo(
    () => getUserTypeLabel({ userStatus, eulaAcknowledged, orgUserRole, roleConfig }),
    [eulaAcknowledged, orgUserRole, userStatus, roleConfig],
  );

  const displayName = `${firstName} ${lastName}${
    credentials ? `, ${credentials}` : ''
  }`;
  const viewOnlyRoleAvailable = useSelector(userHasViewOnlyFeatureSelector);
  const guestRoleAvailable = useSelector(userHasDockGuestFeatureSelector);

  const removeSubscription = () => {
    openRemoveSubscriptionModal({
      userIdentifier,
      email,
      orgUserRole,
      confirm: () =>
        toggleSelectedUser({ userIdentifier, email, displayName })({
          target: { checked: false },
        }),
    });
  };

  const removeSubscriptionWithNewOwnerFlow = (openOwnerModal) => {
    openRemoveSubscriptionModal({
      userIdentifier,
      email,
      orgUserRole,
      confirm: () =>
        openOwnerModal({
          confirm: () =>
            toggleSelectedUser({ userIdentifier, email, displayName })({
              target: { checked: false },
            }),
        }),
    });
  };

  const addSubscription = () =>
    toggleSelectedUser({ userIdentifier, email, displayName })({
      target: { checked: true },
    });

  const ownersCount =
    organizationMembers?.filter(
      ({ orgUserRole: memberUserRole }) => memberUserRole === 'OWNER',
    )?.length ?? 0;

  const hasOneUserRemaining = organizationMembers.length === 1;

  const isDisabledRemovingSubscription = hasOneUserRemaining;

  const currentActiveUsers = organizationMembers?.filter(
    (user) =>
      !!user?.subscription &&
      user?.userIdentifier !== sessionStorage.userIdentifier,
  );

  if (!viewOnlyRoleAvailable) {
    delete USER_TYPES.VIEW_ONLY;
  }

  if (!guestRoleAvailable) {
    delete USER_TYPES.GUEST;
  }

  return (
    <UserTypeLabel
      email={email}
      userIdentifier={userIdentifier}
      userType={userType}
      userTypes={roleConfig}
      removeSubscription={removeSubscription}
      removeSubscriptionWithNewOwnerFlow={removeSubscriptionWithNewOwnerFlow}
      addSubscription={addSubscription}
      orgUserRole={orgUserRole}
      isDisabledRemovingSubscription={isDisabledRemovingSubscription}
      userStatus={userStatus}
      isInvited={isInvited}
      changeUserRole={changeUserRole}
      userHasSubscription={
        !!isUserSelected({
          userIdentifier,
          email,
        })
      }
      isPopoverOpen={isPopoverOpen}
      openPopover={openPopover}
      closePopover={closePopover}
      displayName={displayName}
      ownersCount={ownersCount}
      currentActiveUsers={currentActiveUsers}
    />
  );
};

const mapDispatchToProps = {
  openRemoveSubscriptionModal: (props) =>
    openModalAction('RemoveActiveUser', { ...props }),
};

export default connect(null, mapDispatchToProps)(UserTypeOptions);
