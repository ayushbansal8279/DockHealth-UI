/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { openModal as openModalAction } from 'modal/actions';
import {
  userHasViewOnlyFeatureSelector,
  userHasDockGuestFeatureSelector,
  userHasDockLiteFeatureSelector,
} from 'selectors/user-selectors';
import UserTypeLabel from './UserTypeLabel';
import { getUserTypeLabel, USER_TYPES } from '../helpers';

const UserTypeOptions = ({
  firstName,
  lastName,
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
}) => {
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const userType = useMemo(
    () => getUserTypeLabel({ userStatus, eulaAcknowledged, orgUserRole }),
    [eulaAcknowledged, orgUserRole, userStatus],
  );

  const displayName = `${firstName} ${lastName}`;
  const viewOnlyRoleAvailable = useSelector(userHasViewOnlyFeatureSelector);
  const guestRoleAvailable = useSelector(userHasDockGuestFeatureSelector);
  const dockLiteAvailable = useSelector(userHasDockLiteFeatureSelector);

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
  if (!dockLiteAvailable) {
    delete USER_TYPES.DOCK_LITE;
  }

  return (
    <UserTypeLabel
      email={email}
      userIdentifier={userIdentifier}
      userType={userType}
      userTypes={USER_TYPES}
      removeSubscription={removeSubscription}
      removeSubscriptionWithNewOwnerFlow={removeSubscriptionWithNewOwnerFlow}
      addSubscription={addSubscription}
      orgUserRole={orgUserRole}
      isDisabledRemovingSubscription={isDisabledRemovingSubscription}
      userStatus={userStatus}
      isInvited={isInvited}
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
