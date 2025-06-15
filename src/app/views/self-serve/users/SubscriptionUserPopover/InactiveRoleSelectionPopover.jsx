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
import { CancelButton, ConfirmButton } from '@/app/modal/components/ModalButton/ModalButtons';
import { useRoleContext } from '@/app/views/workspace/workspace-users/RoleContext';
import { inviteUserToWorkspace } from '@/app/actions/workspace-actions';
import { useWorkspace } from '@/app/views/workspace/workspace-users/WorkspaceContext';

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
  const { contextType, roleConfig } = useRoleContext();
  const { workspaceIdentifier } = useWorkspace();
  
  const [selectedStep, setSelectedStep] = useState('first');
  const [selectedRole, setSelectedRole] = useState({});
  const dispatch = useDispatch();

  const FirsStepComponent = () => {
    const isWorkspace = contextType === 'workspace';

    return (
      <>
        <Header>Inactive User</Header>
        <RoleSelectionDescriptionOne>
          {isWorkspace
            ? 'You can reactivate this user to give them access to the workspace.'
            : 'You can reactivate or archive this user. Which would you like to do?'
          }
        </RoleSelectionDescriptionOne>
        <RoleSelectionButtonsContainer>
          {!isWorkspace && (
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
          )}
          <ApprovalButtonContainer>
            <Button 
              onClick={() => {
                if (isWorkspace) {
                  dispatch(inviteUserToWorkspace({
                    userIdentifier,
                    workspaceIdentifier
                  }));
                  closePopover();
                } else {
                  setSelectedStep('second');
                }
              }}
              fullWidth
            >
              REACTIVATE
            </Button>
          </ApprovalButtonContainer>
        </RoleSelectionButtonsContainer>
      </>
    )
  };

  const SecondStepComponent = () => (
    <>
      <Header>Select their role in your {contextType === 'workspace' ? 'Workspace' : 'Organization'}</Header>
      <RoleSelectionList>
        {renderUserTypesOptions({
          userTypes: roleConfig,
          selectedRoleKey: selectedRole?.key,
        })?.map((item) =>
          renderRoleItem({
            ...item,
            onSelect: setSelectedRole,
          }),
        )}
      </RoleSelectionList>
      <RoleSelectionFooter>
        <CancelButton
          onClick={() => {
            closePopover();
          }}
        >
          Cancel
        </CancelButton>
        <ConfirmButton
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
        </ConfirmButton>
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
