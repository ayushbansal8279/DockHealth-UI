import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { findAllUsers } from 'actions/people-actions';
import Arrow from 'components/common/Arrow/Arrow';
import {
  MemberTypeButton,
  CurrentUserLabel,
} from './SubscriptionsView.MembersTable.Styled';
import InvitationPopover from './SubscriptionUserPopover/InvitationPopover';
import RoleSelectionPopover from './SubscriptionUserPopover/RoleSelectionPopover';
import PendingApprovalPopover from './SubscriptionUserPopover/PendingApprovalPopover';
import InactiveRoleSelectionPopover from './SubscriptionUserPopover/InactiveRoleSelectionPopover';

const DropdownIndicator = ({ isOpen, setOpen, label }) => (
  <Arrow
    isOpen={isOpen}
    setOpen={setOpen}
    paddingLeft="0"
    justifyContent="space-between"
  >
    <div>{label}</div>
  </Arrow>
);

const MemberTypeLabel = ({
  email,
  userIdentifier,
  userType: { label, changeable, invitationModifiable },
  userTypes,
  addSubscription,
  removeSubscription,
  userHasSubscription,
  isDisabledRemovingSubscription,
  orgUserRole,
  userStatus,
  isInvited,
  isPopoverOpen,
  openPopover,
  closePopover,
  displayName,
}) => {
  const labelReference = useRef(null);
  const dispatch = useDispatch();
  const reloadUsers = useCallback(() => findAllUsers()(dispatch), [dispatch]);

  const PopoverComponent = (() => {
    if (userIdentifier === sessionStorage.userIdentifier) {
      return null;
    }

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
      <MemberTypeButton
        ref={labelReference}
        invited={invitationModifiable}
        clickable={!isDisabledRemovingSubscription}
        onClick={isDisabledRemovingSubscription ? () => {} : openPopover}
        isInvited={isInvited}
      >
        {!isDisabledRemovingSubscription && (
          <DropdownIndicator
            setOpen={() => {}}
            isOpen={isPopoverOpen}
            label={label}
          />
        )}
        {isDisabledRemovingSubscription && (
          <CurrentUserLabel>{label}</CurrentUserLabel>
        )}
      </MemberTypeButton>
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
            labelReference,
            isPopoverOpen,
            displayName,
          }}
        />
      )}
    </>
  );
};

export default MemberTypeLabel;
