import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Popover } from '@mui/material';
import clsx from 'clsx';
import { showGlobalAlert } from 'alert/actions';
import Button from 'components/common/Button/Button';
import { reactivateUser, archiveUser } from 'api/organization-api';
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
        'Part of your Organization. Can add and invite members who are already part of your organization. Can access all patients/clients and people in the group/practice.',
    },
    GUEST: {
      label: 'Guest',
      selectable: false,
      changeable: true,
      isLimitedAccess: true,
      description:
        'An outside collaborator you can invite into selected lists, who will only have access to the tasks, patients/clients and people who are part of those lists.',
    },
    DOCK_PRO: {
      label: 'Dock Pro',
      selectable: true,
      changeable: true,
      isLimitedAccess: true,
      description:
        'A Dock Pro user will have admin access to setup the configurations and workflows for your team.',
    },
  },
  {
    get: (object, path) => object[path?.toUpperCase()] || object.DEFAULT,
  },
);

const renderUserTypesOptions = ({ userTypes, selectedRoleKey }) => {
  return Object.entries(userTypes).map(
    ([role, { label, description, isLimitedAccess }]) => ({
      key: role,
      button: true,
      isSelected: selectedRoleKey === role,
      isLimitedAccess,
      label,
      description,
    }),
  );
};

const popoverClasses = ({ maxItems }) => ({
  maxHeight: () => (maxItems ? `${maxItems * 2}rem` : undefined),
  minHeight: '2rem',
  overflowY: () => (maxItems ? 'auto' : undefined),
});

const InactiveRoleSelectionPopover = (props) => {
  const {
    labelReference,
    isPopoverOpen,
    closePopover,
    userIdentifier,
    reloadUsers,
    displayName,
  } = props;
  const [selectedStep, setSelectedStep] = useState('first');
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
                      dispatch(showGlobalAlert(`${displayName} is archived`));
                      reloadUsers();
                    });
                  },
                }),
              );
              closePopover();
            }}
            variant="secondary"
            fullWidth
          >
            ARCHIVE
          </Button>
        </DenyButtonContainer>
        <ApprovalButtonContainer>
          <Button onClick={() => setSelectedStep('second')} fullWidth>
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
        })?.map((item) =>
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
              dispatch(showGlobalAlert(`${displayName} is reactivated`));
              reloadUsers();
            });
          }}
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
        className: clsx(popoverClasses(props)),
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
