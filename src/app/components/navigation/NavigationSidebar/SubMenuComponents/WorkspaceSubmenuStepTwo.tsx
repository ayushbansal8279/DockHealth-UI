import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { workspaceSelector, workspaceTaskListsSelector } from '@/app/selectors/workspace-selectors';
import {
  ArrowBackIcon,
  WorkspacesTitleWrapper,
  WorkspacesTitle,
  WorkspacesSubWrapper,
  ColorIndicator,
  ListNameText,
  ListNameLabel,
  DrawerListsItemLoader,
  DrawerListsItem,
  DrawerItemOptions,
  WorkspaceItemWrapper,
  WorkspaceContainer,
  WorkspaceListWrapper,
  WorkspaceListItems,
  WorkspaceUserItems,
} from './styled';
import { clearWorkspaceState, getWorkspaceTaskLists } from '@/app/actions/workspace-actions';
import WorkspaceTile from '@/app/components/workspace/WorkspaceTile/WorkspaceTile';
import { Flex } from '@/app/components/common/Flex/styled';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';
import ListOptionsMenu from '@/app/components/tasklist/ListOptionsMenu/ListOptionsMenu';
import { MoreVert } from '@mui/icons-material';
import { Box } from '@mui/material';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import {
  createPatientDetailsPath,
  createTaskListPath,
} from '@/app/routing/helpers/paths';
import { useHistory } from 'react-router-dom';
import {
  defaultPatientsListsSelector,
  isFetchingPatientsListsSelector,
} from '@/app/selectors/patients-selectors';
import { locationParametersSelector } from '@/app/location/selectors';
import * as PatientsActions from 'actions/patients-actions';
import NewLabeledCollapse from '@/app/components/common/NewLabeledCollapse/NewLabeledCollapse';
import { openModal } from '@/app/modal/actions';
import InviteUserToWorkspaceForm from '@/app/components/workspace/InviteUserToWorkspaceForm/InviteUserToWorkspaceForm';
import useBoolean from '@/app/hooks/useBoolean';
import CreatePatientDrawer from '@/app/components/patients/CreatePatientDrawer/CreatePatientDrawer';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';

const WorkspaceSubmenuStepTwo = () => {
  const dispatch = useDispatch();
  const workspace = useSelector(workspaceSelector);
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);
  const workspaceIdentifier = workspace.workspaceIdentifier;
  const history = useHistory();
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  // TODO: get task lists, Users and Patients from workspace
  const taskLists = useSelector(workspaceTaskListsSelector);
  const defaultPatientsLists = useSelector(defaultPatientsListsSelector);
  const isFetching = useSelector(isFetchingPatientsListsSelector);
  const isInitialListFetching = isFetching && !defaultPatientsLists;

  const [activeCollapse, setActiveCollapse] = useState('list');
  const [isSidebarOpen, setIsSidebarOpen, unsetIsSidebarOpen] =
    useBoolean(false);

  const handleCollapse = (section: string) => {
    setActiveCollapse((current) => (current === section ? '' : section));
  };

  const handleBackClick = () => {
    dispatch(clearWorkspaceState());
  };

  useEffect(() => {
    dispatch(getWorkspaceTaskLists(workspaceIdentifier));
    dispatch(PatientsActions.getPatientsLists() as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddListModal = () => {
    dispatch(
      openModal('ListForm', {
        showPrivacyOptions: true,
        workspaceIdentifier
      }),
    );
  };

  const openAddUserModal = () => {
    dispatch(
      openModal('InviteToList', {
        list: [],
        title: 'Add User to the Workspace',
        CustomForm: InviteUserToWorkspaceForm,
        identifier: workspaceIdentifier,
      }),
    );
  };

  const dummyUsersList = [
    {
      patientListIdentifier: 'ALL_USERS',
      listName: 'All Active Users',
      listDescription:
        'This is a list of all active users from your organization',
      users: [],
      listType: 'DEFAULT',
      usersCount: 9,
    },
  ];

  return (
    <>
      <WorkspaceContainer>
        <WorkspacesTitleWrapper>
          <WorkspacesSubWrapper>
            <ArrowBackIcon onClick={handleBackClick} />
            <WorkspacesTitle>{workspaceLabel}s</WorkspacesTitle>
          </WorkspacesSubWrapper>
        </WorkspacesTitleWrapper>
        <Flex j={'start'} gap={10} pl={10} pt={10}>
          <WorkspaceTile
            workspaceProfileColor={workspace.workspaceProfileColor}
            workspaceInitials={workspace.workspaceInitials}
          />
          <div>{workspace.workspaceName}</div>
        </Flex>
        <WorkspaceListWrapper>
          <NewLabeledCollapse
            name="Lists"
            isOpened={activeCollapse === 'list'}
            onClick={() => handleCollapse('list')}
            addButtonClick={openAddListModal}
          >
            <WorkspaceListItems>
              {taskLists?.map((list: any) => (
                <Flex key={list.taskListIdentifier} gap={10} pb={10}>
                  <ListOptionsMenu list={list}>
                    <MoreVert color="primary" />
                  </ListOptionsMenu>
                  {list.color && (
                    <Box mr={1}>
                      <ColorIndicator color={list.color} />
                    </Box>
                  )}
                  {/* @ts-ignore */}
                  <Tooltip placement="top" title={list?.listName || ''}>
                    <ListNameText
                      onClick={() => {
                        history.push(
                          createTaskListPath(list.taskListIdentifier),
                        );
                      }}
                    >
                      {/* @ts-ignore */}
                      <ListNameLabel
                        isNewList={
                          list.hasUpdatesForMember || list?.status === 'PENDING'
                        }
                      >
                        {list?.listName}
                      </ListNameLabel>
                    </ListNameText>
                  </Tooltip>
                </Flex>
              ))}
            </WorkspaceListItems>
          </NewLabeledCollapse>
        </WorkspaceListWrapper>
        <WorkspaceItemWrapper>
          <NewLabeledCollapse
            name="Users and User Groups"
            isOpened={activeCollapse === 'users'}
            onClick={() => handleCollapse('users')}
            addButtonClick={openAddUserModal}
          >
            <WorkspaceUserItems>
              {isInitialListFetching ? (
                Array.from({ length: 2 }, () => null).map((_, index) => (
                  <DrawerListsItemLoader key={index} />
                ))
              ) : (
                <>
                  {dummyUsersList?.map(
                    ({ patientListIdentifier, listName, usersCount }) => (
                      <DrawerListsItem key={patientListIdentifier}>
                        <ListNameText
                          onClick={() => {
                            history.push(
                              `/core/workspace/${workspaceIdentifier}/users`,
                            );
                          }}
                        >
                          {listName}
                        </ListNameText>
                        <DrawerItemOptions>
                          <div>{usersCount}</div>
                          <Box m={1.5} />
                        </DrawerItemOptions>
                      </DrawerListsItem>
                    ),
                  )}
                </>
              )}
            </WorkspaceUserItems>
          </NewLabeledCollapse>
        </WorkspaceItemWrapper>
        <WorkspaceItemWrapper>
          <NewLabeledCollapse
            name={`${customerTypeLabel
              .charAt(0)
              .toUpperCase()}${customerTypeLabel.slice(1).toLowerCase()}s`}
            isOpened={activeCollapse === 'patients'}
            onClick={() => handleCollapse('patients')}
            addButtonClick={() => setIsSidebarOpen()}
          >
            <WorkspaceUserItems>
              {isInitialListFetching ? (
                Array.from({ length: 2 }, () => null).map((_, index) => (
                  <DrawerListsItemLoader key={index} />
                ))
              ) : (
                <>
                  {defaultPatientsLists?.map((patientType: any) => (
                    <DrawerListsItem key={patientType.patientListIdentifier}>
                      <ListNameText
                        onClick={() => {
                          history.push(
                            `/core/workspace/${workspaceIdentifier}/patients`,
                          );
                        }}
                      >
                        {patientType.listName}
                      </ListNameText>
                      <DrawerItemOptions>
                        <div>{patientType.patientsCount}</div>
                        <Box m={1.5} />
                      </DrawerItemOptions>
                    </DrawerListsItem>
                  ))}
                </>
              )}
            </WorkspaceUserItems>
          </NewLabeledCollapse>
        </WorkspaceItemWrapper>
      </WorkspaceContainer>
      <CreatePatientDrawer
        onPatientCreated={({
          patientIdentifier,
        }: {
          patientIdentifier: string;
        }) => history.push(createPatientDetailsPath(patientIdentifier))}
        onClose={unsetIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
    </>
  );
};

export default WorkspaceSubmenuStepTwo;
