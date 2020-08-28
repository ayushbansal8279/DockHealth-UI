import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { pathEq } from 'ramda';
import SelectorPopover from 'components/common/SelectorPopover/SelectorPopover';
import Button from 'components/common/Button/Button';
import { showAlert, showToast } from 'helpers/utility-functions';
import { changeUserRoleForOrg } from 'actions/people-actions';
import Circle from 'img/circle';
import CircleCompleted from 'img/circle-completed';
import {
  LimitedAccessLabel,
  RoleItem,
  RoleItemLabel,
  RoleItemDescription,
  RoleSelectorFooter,
  RoleSelectorRemoveUserButton,
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
  userHasSubscription,
  orgUserRole,
  userStatus,
  reloadUsers,
}) => {
  const [selectedRole, setSelectedRole] = useState({});
  const dispatch = useDispatch();

  const changeUserRole = useCallback(
    ({ userIdentifier: markedUserIdentifier, role: userRole }) =>
      changeUserRoleForOrg(markedUserIdentifier, userRole)(dispatch),
    [dispatch],
  );

  const isInactive = userStatus === 'INACTIVE';

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
      HeaderComponent={() => (
        <Header>Select their role in your Organization</Header>
      )}
      FooterComponent={() => (
        <RoleSelectorFooter multipleButtons={!isInactive}>
          {!isInactive && (
            <RoleSelectorRemoveUserButton
              disabled={!userHasSubscription}
              onClick={() => {
                closePopover();
                removeSubscription();
              }}
            >
              Remove user
            </RoleSelectorRemoveUserButton>
          )}
          <Button
            onClick={() => {
              // eslint-disable-next-line no-unused-expressions
              selectedRole?.onSave();
            }}
            size="small"
            withoutMinWidth
            padding="0 30px"
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
      })}
    />
  );
};

export default RoleSelectionPopover;
