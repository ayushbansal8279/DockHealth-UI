import React, { useRef } from 'react';
import Arrow from 'components/common/Arrow/Arrow';
import { useQuery } from '@tanstack/react-query';
import * as OrganizationApi from 'api/organization-api';
import InvitationPopover from '../SubscriptionUserPopover/InvitationPopover';
import RoleSelectionPopover from '../SubscriptionUserPopover/RoleSelectionPopover';
import PendingApprovalPopover from '../SubscriptionUserPopover/PendingApprovalPopover';
import InactiveRoleSelectionPopover from '../SubscriptionUserPopover/InactiveRoleSelectionPopover';
import { UserTypeButton, CurrentUserLabel, TextLabel } from './styled';

const DropdownIndicator = ({ isOpen, setOpen, label }) => (
  <Arrow
    isOpen={isOpen}
    setOpen={setOpen}
    paddingLeft="0"
    justifyContent="space-between"
  >
    <TextLabel>{label}</TextLabel>
  </Arrow>
);

const UserTypeLabel = ({
  email,
  userIdentifier,
  userType: { label, changeable, invitationModifiable },
  userTypes,
  addSubscription,
  removeSubscription,
  removeSubscriptionWithNewOwnerFlow,
  userHasSubscription,
  isDisabledRemovingSubscription,
  orgUserRole,
  userStatus,
  isInvited,
  isPopoverOpen,
  openPopover,
  closePopover,
  displayName,
  ownersCount,
  currentActiveUsers,
  changeUserRole,
}) => {
  const labelReference = useRef(null);

  const { refetch: reloadUsers } = useQuery({
    queryKey: ['getOrganizationUsers'],
    queryFn: OrganizationApi.findAllUsersForOrganization,
  });

  const PopoverComponent = (() => {
    if (userStatus === 'PENDING') {
      return PendingApprovalPopover;
    }

    if (userStatus === 'INACTIVE') {
      return InactiveRoleSelectionPopover;
    }

    if (invitationModifiable) {
      return InvitationPopover;
    }
    if (changeable) {
      return RoleSelectionPopover;
    }

    return null;
  })();

  return (
    <>
      <UserTypeButton
        ref={labelReference}
        invited={invitationModifiable}
        clickable={!isDisabledRemovingSubscription}
        onClick={isDisabledRemovingSubscription ? () => {} : openPopover}
        isInvited={isInvited}
        isInactive={userStatus === 'INACTIVE'}
      >
        {!isDisabledRemovingSubscription && (
          <DropdownIndicator
            setOpen={() => {}}
            isOpen={isPopoverOpen}
            label={
              label === 'Invited'
                ? `${label} (${orgUserRole.toLowerCase()})`
                : label
            }
          />
        )}
        {isDisabledRemovingSubscription && (
          <CurrentUserLabel>
            {label === 'Invited'
              ? `${label} (${orgUserRole.toLowerCase()})`
              : label}
          </CurrentUserLabel>
        )}
      </UserTypeButton>
      {PopoverComponent && (
        <PopoverComponent
          {...{
            userStatus,
            userIdentifier,
            userTypes,
            closePopover,
            email,
            reloadUsers,
            addSubscription,
            removeSubscription,
            userHasSubscription,
            isDisabledRemovingSubscription,
            orgUserRole,
            changeUserRole,
            labelReference,
            isPopoverOpen,
            displayName,
            ownersCount,
            currentActiveUsers,
            removeSubscriptionWithNewOwnerFlow,
          }}
        />
      )}
    </>
  );
};

export default UserTypeLabel;
