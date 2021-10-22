/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { useBoolean } from 'hooks/useBoolean';
import { openModal as openModalAction } from 'modal/actions';
import MemberTypeLabel from './SubscriptionsView.MemberTypeLabel';

import {
  getUserTypeLabel,
  USER_TYPES,
} from './SubscriptionsView.MembersTable.helpers';

const MemberTypeOptions = ({
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

  const removeSubscriptionWithNewOwnerFlow = openOwnerModal => {
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
    user =>
      !!user?.subscription &&
      user?.userIdentifier !== sessionStorage.userIdentifier,
  );

  return (
    <MemberTypeLabel
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
  openRemoveSubscriptionModal: props =>
    openModalAction('RemoveActiveUser', { ...props }),
};

export default connect(null, mapDispatchToProps)(MemberTypeOptions);
