import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import pathEq from 'ramda/src/pathEq';
import { Popover } from '@mui/material';
import Button from 'components/common/Button/Button';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { approvePendingUser, denyPendingUser } from 'api/organization-api';
import { renderRoleItem } from './RoleSelectionPopover';
import {
  PendingApprovalContainer,
  RoleSelectionList,
  RoleSelectionFooter,
  RoleSelectionDescriptionOne,
  RoleSelectionDescriptionTwo,
  RoleSelectionButtonsContainer,
  DenyButtonContainer,
  ApprovalButtonContainer,
  Header,
  RoleSelectorCancelRemoveUserButton,
} from './styled';

const USER_TYPES = new Proxy(
  {
    OWNER: {
      label: 'Owner/Admin',
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
      selectable: true,
      changeable: true,
      isLimitedAccess: true,
      description:
        'An outside collaborator you can invite into selected lists, who will only have access to the tasks, patients/clients and people who are part of those lists.',
    },
    DOCK_LITE: {
      label: 'Dock Lite',
      selectable: true,
      changeable: true,
      isLimitedAccess: true,
      description:
        'A limited use member of your organization or an outside collaborator you can invite into a single list, who will only have access to the tasks, patients/clients and people who are part of that list.',
    },
    DOCK_PRO: {
      label: 'Dock Crew',
      selectable: true,
      changeable: true,
      isLimitedAccess: true,
      description:
        'Dock Crew user will help configure your account and with building out Workflows and Smartflows for your team.',
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
  userStatus,
  selectedRoleKey,
  dispatch,
}) => {
  let renderedArray = [];

  if (userStatus === 'PENDING' || userStatus === 'DENIED') {
    renderedArray = Object.entries(userTypes)
      .filter(pathEq(['1', 'selectable'], true))
      .map(([role, { label, description, isLimitedAccess }]) => ({
        key: role,
        button: true,
        isSelected: selectedRoleKey === role,
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
            .catch((error) => {
              dispatch(
                showGlobalErrorAlert(
                  error?.message ??
                    `User's role could not be changed, please try again later`,
                ),
              );

              closePopover();
            });
        },
      }));
  }

  return renderedArray;
};

// makeStyles({
//   root: {
//     maxHeight: ({ maxItems }) => (maxItems ? `${maxItems * 2}rem` : undefined),
//     minHeight: '2rem',
//     overflowY: ({ maxItems }) => (maxItems ? 'auto' : undefined),
//   },
// });

const PendingApprovalSelectionPopover = (props) => {
  const {
    labelReference,
    isPopoverOpen,
    closePopover,
    email,
    userIdentifier,
    reloadUsers,
    addSubscription,
    removeSubscription,
    userStatus,
    changeUserRole,
  } = props;
  const [selectedStep, setSelectedStep] = useState('first');
  const [selectedRole, setSelectedRole] = useState({});
  const dispatch = useDispatch();

  const FirsStepComponent = () => (
    <>
      <Header>Approve or deny a new user request</Header>
      <div>
        <RoleSelectionDescriptionOne>
          As the Organization Owner, you have the authority to approve or deny
          new member requests.
        </RoleSelectionDescriptionOne>
        <RoleSelectionDescriptionTwo>
          If denied, the person who requested the invite will be notified via
          email. If approved, this person will become part of your subscription
          once they create an account on Dock.
        </RoleSelectionDescriptionTwo>
      </div>
      <RoleSelectionButtonsContainer>
        <DenyButtonContainer>
          <Button
            onClick={() =>
              denyPendingUser({ userIdentifier })
                .then(() => {
                  dispatch(
                    showGlobalAlert(
                      `User's pending invitation denied successfully`,
                    ),
                  );
                  reloadUsers();
                  closePopover();
                })
                .catch((error) => {
                  dispatch(
                    showGlobalErrorAlert(
                      error?.message ??
                        `User's pending invitation could not be denied, please try again later`,
                    ),
                  );

                  closePopover();
                })
            }
            variant="secondary"
            fullWidth
          >
            DENY
          </Button>
        </DenyButtonContainer>
        <ApprovalButtonContainer>
          <Button onClick={() => setSelectedStep('second')} fullWidth>
            APPROVE
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
          selectedRoleKey: selectedRole?.key,
          dispatch,
        })?.map((item) =>
          renderRoleItem({
            ...item,
            onSelect: setSelectedRole,
          }),
        )}
      </RoleSelectionList>
      <RoleSelectionFooter>
        <RoleSelectorCancelRemoveUserButton
          multipleButtons
          onClick={() => closePopover()}
        >
          Cancel
        </RoleSelectorCancelRemoveUserButton>
        <Button
          onClick={() =>
            approvePendingUser({ userIdentifier, role: selectedRole?.key })
              .then(() => {
                dispatch(
                  showGlobalAlert(
                    `User's pending invitation approved successfully`,
                  ),
                );
                reloadUsers();
                closePopover();
              })
              .catch((error) => {
                dispatch(
                  showGlobalErrorAlert(
                    error?.message ??
                      `User's pending invitation could not be approved, please try again later`,
                  ),
                );

                closePopover();
              })
          }
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
        // className: clsx(popoverClasses.root),
        elevation: 0,
        square: true,
      }}
      onClose={() => {
        closePopover();
        setSelectedStep('first');
        setSelectedRole({});
      }}
      open={isPopoverOpen}
    >
      <PendingApprovalContainer>
        {selectedStep === 'first' && <FirsStepComponent />}
        {selectedStep === 'second' && <SecondStepComponent />}
      </PendingApprovalContainer>
    </Popover>
  );
};

export default PendingApprovalSelectionPopover;
