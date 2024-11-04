import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import pathEq from 'ramda/src/pathEq';
import SelectorPopover from 'components/common/SelectorPopover/SelectorPopover';
import Circle from 'img/circle.svg';
import CircleCompleted from 'img/circle-completed.svg';
import { openModal } from 'modal/actions';
import {
  LimitedAccessLabel,
  RoleItem,
  RoleItemLabel,
  RoleItemDescription,
  RoleSelectorFooter,
  Header,
} from './styled';
import { CancelButton, ConfirmButton } from '@/app/modal/components/ModalButton/ModalButtons';

export const renderUserTypesOptions = ({
  changeUserRole,
  userIdentifier,
  userTypes,
  closePopover,
  addSubscription,
  orgUserRole,
  userStatus,
  selectedRoleKey,
}) => {
  let renderedArray = [];

  if (userStatus === 'ACTIVE') {
    renderedArray = Object.entries(userTypes)
      .filter(pathEq(['1', 'selectable'], true))
      .map(([role, { label, description, isLimitedAccess }]) => ({
        key: role,
        button: true,
        isSelected:
          selectedRoleKey === role ||
          (!selectedRoleKey && orgUserRole === role),
        isLimitedAccess,
        label,
        description,
        onSave: () => {
          changeUserRole({ userIdentifier, role });
        },
      }));
  }

  if (userStatus === 'INACTIVE') {
    renderedArray = [
      ...renderedArray,
      {
        key: 'reactivate_user',
        label: 'Reactivate user',
        selectable: true,
        changeable: true,
        isSelected: selectedRoleKey === 'reactivate_user',
        onSave: () => {
          closePopover();
          addSubscription();
        },
      },
    ];
  }

  return renderedArray;
};

export const renderRoleItem = ({
  key,
  label,
  description,
  disabled = false,
  onSelect,
  isSelected,
  isDisabled,
  isLimitedAccess,
  onSave,
}) => (
  <>
    {!disabled && (
      <RoleItem
        key={key}
        onClick={() => {
          if (!isDisabled && !isSelected)
            onSelect({ key, label, description, onSave });
        }}
        isDisabled={isDisabled}
        isSelected={isSelected}
      >
        <img src={isSelected ? CircleCompleted : Circle} alt="circle" />
        <div>
          <RoleItemLabel isSelected={isSelected}>
            {label}
            {isLimitedAccess && (
              <LimitedAccessLabel>*Limited Access</LimitedAccessLabel>
            )}
          </RoleItemLabel>
          <RoleItemDescription>{description}</RoleItemDescription>
        </div>
      </RoleItem>
    )}
  </>
);

const RoleSelectionPopover = ({
  labelReference,
  isPopoverOpen,
  closePopover,
  email,
  userIdentifier,
  userTypes,
  addSubscription,
  removeSubscription,
  removeSubscriptionWithNewOwnerFlow,
  userHasSubscription,
  orgUserRole,
  changeUserRole,
  userStatus,
  ownersCount,
  currentActiveUsers,
}) => {
  const [selectedRole, setSelectedRole] = useState({});
  const dispatch = useDispatch();

  const isInactive = userStatus === 'INACTIVE';

  const isCurrrentUser = userIdentifier === sessionStorage.userIdentifier;

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
      renderItem={(item) =>
        renderRoleItem({ ...item, onSelect: setSelectedRole })
      }
      onClose={() => {
        closePopover();
        setSelectedRole({});
      }}
      open={isPopoverOpen}
      withPadding
      renderHeader={() => (
        <Header>Select their role in your Organization</Header>
      )}
      renderFooter={() => (
        <RoleSelectorFooter multipleButtons={!isInactive}>
          {!isInactive && (
            <CancelButton
              disabled={!userHasSubscription}
              onClick={() => {
                closePopover();
                if (
                  ownersCount < 2 &&
                  isCurrrentUser &&
                  orgUserRole === 'OWNER'
                ) {
                  removeSubscriptionWithNewOwnerFlow((modalProps) =>
                    dispatch(
                      openModal('SelectOwner', {
                        currentActiveUsers,
                        isRemovingFlow: true,
                        ...modalProps,
                      }),
                    ),
                  );
                } else {
                  removeSubscription();
                }
              }}
            >
              Remove user
            </CancelButton>
          )}
          <ConfirmButton
            onClick={() => {
              closePopover();
              if (
                ownersCount < 2 &&
                isCurrrentUser &&
                orgUserRole === 'OWNER'
              ) {
                dispatch(
                  openModal('SelectOwner', {
                    currentActiveUsers,
                    confirm: selectedRole?.onSave,
                  }),
                );
              } else {
                // eslint-disable-next-line no-unused-expressions
                selectedRole?.onSave();
              }
            }}
            disabled={!selectedRole?.key}
          >
            Save
          </ConfirmButton>
        </RoleSelectorFooter>
      )}
      items={renderUserTypesOptions({
        userStatus,
        userIdentifier,
        userTypes,
        closePopover,
        changeUserRole,
        email,
        addSubscription,
        removeSubscription,
        orgUserRole,
        selectedRoleKey: selectedRole?.key,
      })}
    />
  );
};

export default RoleSelectionPopover;
