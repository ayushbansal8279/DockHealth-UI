/* eslint-disable sonarjs/no-identical-functions */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { showGlobalAlert } from 'alert/actions';
import Button from 'components/common/Button/Button';
import { reactivateUser, archiveUser } from 'api/people-api';
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
  RoleSelectorCancelRemoveUserButton,
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

const renderUserTypesOptions = ({ userTypes, selectedRoleKey }) => {
  return [
    ...Object.entries(userTypes).map(
      ([role, { label, description, isLimitedAccess }]) => ({
        key: role,
        button: true,
        isSelected: selectedRoleKey === role,
        isLimitedAccess,
        label,
        description,
      }),
    ),
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
    userIdentifier,
    reloadUsers,
  } = props;
  const [selectedStep, setSelectedStep] = useState('first');
  const popoverClasses = usePopoverClasses(props);
  const [selectedRole, setSelectedRole] = useState({});
  const dispatch = useDispatch();

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
              dispatch(
                openModal('ArchiveUser', {
                  confirm: () => {
                    archiveUser(userIdentifier).then(() => {
                      dispatch(
                        showGlobalAlert(`User has been archived successfully`),
                      );
                      reloadUsers();
                    });
                  },
                }),
              );
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
          userTypes: USER_TYPES,
          selectedRoleKey: selectedRole?.key,
        })?.map(item =>
          renderRoleItem({
            ...item,
            onSelect: setSelectedRole,
          }),
        )}
      </RoleSelectionList>
      <RoleSelectionFooter>
        <RoleSelectorCancelRemoveUserButton
          onClick={() => {
            closePopover();
          }}
        >
          Cancel
        </RoleSelectorCancelRemoveUserButton>
        <Button
          onClick={() => {
            closePopover();
            reactivateUser(userIdentifier, selectedRole?.key).then(() => {
              dispatch(showGlobalAlert(`User has been reactived successfully`));
              reloadUsers();
            });
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
