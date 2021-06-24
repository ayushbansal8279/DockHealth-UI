import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { pathEq } from 'ramda';
import SelectorPopover from 'components/common/SelectorPopover/SelectorPopover';
import Button from 'components/common/Button/Button';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { changeUserRoleForOrg } from 'actions/people-actions';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import { openModal } from 'modal/actions';
import {
  LimitedAccessLabel,
  RoleItem,
  RoleItemLabel,
  RoleItemDescription,
  RoleSelectorFooter,
  Header,
} from './styled';

export const renderUserTypesOptions = ({
  changeUserRole,
  userIdentifier,
  userTypes,
  closePopover,
  reloadUsers,
  addSubscription,
  orgUserRole,
  userStatus,
  selectedRoleKey,
  dispatch,
}) => {
  let renderedArray = [];

  if (userStatus === 'ACTIVE') {
    renderedArray = [
      ...Object.entries(userTypes)
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
            changeUserRole({ userIdentifier, role })
              .then(() => {
                dispatch(showGlobalAlert(`User's role changed successfully`));
                reloadUsers();
                closePopover();
              })
              .catch(error => {
                dispatch(
                  showGlobalErrorAlert(
                    error?.message ??
                      `User's role could not be changed, please try again later`,
                  ),
                );

                closePopover();
              });
          },
        })),
    ];
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
  onSelect,
  isSelected,
  isDisabled,
  isLimitedAccess,
  onSave,
}) => (
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
  userStatus,
  reloadUsers,
  ownersCount,
  currentActiveUsers,
}) => {
  const [selectedRole, setSelectedRole] = useState({});
  const dispatch = useDispatch();

  const changeUserRole = useCallback(
    ({ userIdentifier: markedUserIdentifier, role: userRole }) =>
      changeUserRoleForOrg(markedUserIdentifier, userRole)(dispatch),
    [dispatch],
  );

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
      renderItem={item =>
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
            <Button
              variant="secondary"
              width="200px"
              disabled={!userHasSubscription}
              onClick={() => {
                closePopover();
                if (
                  ownersCount < 2 &&
                  isCurrrentUser &&
                  orgUserRole === 'OWNER'
                ) {
                  removeSubscriptionWithNewOwnerFlow(modalProps =>
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
            </Button>
          )}
          <Button
            width="200px"
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
          </Button>
        </RoleSelectorFooter>
      )}
      items={renderUserTypesOptions({
        userStatus,
        userIdentifier,
        userTypes,
        closePopover,
        changeUserRole,
        email,
        reloadUsers,
        addSubscription,
        removeSubscription,
        orgUserRole,
        selectedRoleKey: selectedRole?.key,
        dispatch,
      })}
    />
  );
};

export default RoleSelectionPopover;
