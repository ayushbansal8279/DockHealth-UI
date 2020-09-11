/* eslint-disable sonarjs/no-identical-functions */
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { pathEq } from 'ramda';
import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from 'components/common/Button/Button';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { changeUserRoleForOrg } from 'actions/people-actions';
import { openModal } from 'modal/actions';
import { renderRoleItem } from './RoleSelectionPopover';
import {
  InactiveRoleSelectionContainer,
  RoleSelectionList,
  RoleSelectionFooter,
  RoleSelectionDescriptionOne,
  RoleSelectionButtonsContainer,
  DenyButtonContainer,
  ApprovalButtonContainer,
  Header,
} from './styled';

const USER_TYPES = new Proxy(
  {
    OWNER: {
      label: 'Owner',
      selectable: true,
      changeable: true,
      description:
        'Full access to everything including billing and payments and approving new members.',
    },
    MEMBER: {
      label: 'Member',
      selectable: true,
      changeable: true,
      description:
        'Part of your Organization. Can add and invite members who are already part of your organization. Can access all patients and people in the group/practice.',
    },
    GUEST: {
      label: 'Guest',
      selectable: true,
      changeable: true,
      isLimitedAccess: true,
      description:
        'Not part of your Organization.  Only have access to this list asks on this list and the patients and people on this list.',
    },
  },
  {
    get: (object, path) => object[path?.toUpperCase()] || object.DEFAULT,
  },
);

const renderUserTypesOptions = ({
  changeUserRole,
  userIdentifier,
  userTypes,
  closePopover,
  reloadUsers,
  orgUserRole,
  selectedRoleKey,
  dispatch,
}) => {
  return [
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
};

const usePopoverClasses = makeStyles({
  root: {
    maxHeight: ({ maxItems }) => (maxItems ? `${maxItems * 2}rem` : undefined),
    minHeight: '2rem',
    overflowY: ({ maxItems }) => (maxItems ? 'auto' : undefined),
  },
});

const InactiveRoleSelectionPopover = props => {
  const {
    labelReference,
    isPopoverOpen,
    closePopover,
    email,
    userIdentifier,
    reloadUsers,
    addSubscription,
    removeSubscription,
    orgUserRole,
    userStatus,
  } = props;
  const [selectedStep, setSelectedStep] = useState('first');
  const popoverClasses = usePopoverClasses(props);
  const [selectedRole, setSelectedRole] = useState({});
  const dispatch = useDispatch();

  const changeUserRole = useCallback(
    ({ userIdentifier: markedUserIdentifier, role: userRole }) =>
      changeUserRoleForOrg(markedUserIdentifier, userRole)(dispatch),
    [dispatch],
  );

  const FirsStepComponent = () => (
    <>
      <Header>Inactive User</Header>
      <RoleSelectionDescriptionOne>
        You can reactive or archive this user. Which would you like to do?
      </RoleSelectionDescriptionOne>
      <RoleSelectionButtonsContainer>
        <DenyButtonContainer>
          <Button
            onClick={() => {
              dispatch(openModal('ArchiveUser'));
              closePopover();
            }}
            size="small"
            variant="outlined"
            fullWidth
          >
            ARCHIVE
          </Button>
        </DenyButtonContainer>
        <ApprovalButtonContainer>
          <Button
            onClick={() => setSelectedStep('second')}
            size="small"
            fullWidth
          >
            REACTIVATE
          </Button>
        </ApprovalButtonContainer>
      </RoleSelectionButtonsContainer>
    </>
  );

  const SecondStepComponent = () => (
    <>
      <Header>Select their role in your Organization</Header>
      <RoleSelectionList>
        {renderUserTypesOptions({
          userStatus,
          userIdentifier,
          userTypes: USER_TYPES,
          closePopover,
          changeUserRole,
          email,
          reloadUsers,
          addSubscription,
          removeSubscription,
          orgUserRole,
          selectedRoleKey: selectedRole?.key,
          dispatch,
        })?.map(item =>
          renderRoleItem({
            ...item,
            onSelect: setSelectedRole,
          }),
        )}
      </RoleSelectionList>
      <RoleSelectionFooter>
        <Button
          onClick={() => {
            closePopover();
          }}
          size="small"
          disabled={!selectedRole?.key}
        >
          Save
        </Button>
      </RoleSelectionFooter>
    </>
  );

  return (
    <Popover
      anchorEl={labelReference?.current}
      PaperProps={{
        className: clsx(popoverClasses.root),
        elevation: 0,
        square: true,
      }}
      onClose={() => {
        closePopover();
        setSelectedStep('first');
      }}
      open={isPopoverOpen}
    >
      <InactiveRoleSelectionContainer>
        {selectedStep === 'first' && <FirsStepComponent />}
        {selectedStep === 'second' && <SecondStepComponent />}
      </InactiveRoleSelectionContainer>
    </Popover>
  );
};

export default InactiveRoleSelectionPopover;
