import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MoreVert } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import * as PatientsActions from 'actions/patients-actions';
import pluralize from 'pluralize';
import {
  workspaceSelector,
  workspaceTaskListsSelector,
  workspaceUsersSelector,
} from '@/app/selectors/workspace-selectors';
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
  DrawerMyListsLabel,
  WorkspacesLeftWrapper,
  HomeIconWrapper,
  MenuWrapper,
} from './styled';
import {
  clearWorkspaceState,
  getWorkspaceTaskLists,
  getWorkspaceUsers,
} from '@/app/actions/workspace-actions';
import WorkspaceTile from '@/app/components/workspace/WorkspaceTile/WorkspaceTile';
import { Flex } from '@/app/components/common/Flex/styled';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';
import ListOptionsMenu from '@/app/components/tasklist/ListOptionsMenu/ListOptionsMenu';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import {
  createPatientDetailsPath,
  createTaskListPath,
  WORKSPACE_PATH,
} from '@/app/routing/helpers/paths';
import {
  customPatientsListsSelector,
  defaultPatientsListsSelector,
  isFetchingPatientsListsSelector,
} from '@/app/selectors/patients-selectors';
import NewLabeledCollapse from '@/app/components/common/NewLabeledCollapse/NewLabeledCollapse';
import { openModal } from '@/app/modal/actions';
import InviteUserToWorkspaceForm from '@/app/components/workspace/InviteUserToWorkspaceForm/InviteUserToWorkspaceForm';
import useBoolean from '@/app/hooks/useBoolean';
import CreatePatientDrawer from '@/app/components/patients/CreatePatientDrawer/CreatePatientDrawer';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';
import { DefaultPatientListUrl } from '@/app/helpers/patient-list-helpers';
import AddButton from '@/app/components/common/AddButton/AddButton';
import { hideSubMenu } from '@/app/actions/template-actions';
import { isUserViewOnly } from '@/app/helpers/user-helper';
import HomeIcon from '@/app/img/navigation/HomeIcon';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import move from 'ramda/src/move';
import DraggableDroppableListItem from './DraggableDroppableListItem';
import { reorderWorkspaceTaskLists } from '@/app/actions/workspace-list-actions';

const WorkspaceSubmenuStepTwo = ({
  setShowStepTwo,
}: WorkspaceSubmenuStepTwoProps) => {
  const dispatch = useDispatch();
  const workspace = useSelector(workspaceSelector);
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);
  const workspaceIdentifier = workspace.workspaceIdentifier;
  const history = useHistory();
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const isViewOnly = isUserViewOnly(currentUser);
  const location = useLocation();
  const parts = location.pathname.split('/');
  const activeTaskListIdentifier = parts[3];

  const taskLists = useSelector(workspaceTaskListsSelector);
  const defaultPatientsLists = useSelector(defaultPatientsListsSelector);
  const customPatientsLists = useSelector(customPatientsListsSelector);
  const users = useSelector(workspaceUsersSelector);
  const isFetching = useSelector(isFetchingPatientsListsSelector);
  const isInitialListFetching = isFetching && !defaultPatientsLists;
  const userGroups = users?.filter((user: any) => user?.itemType === 'GROUP');

  const [activeCollapse, setActiveCollapse] = useState('list');
  const [isSidebarOpen, setIsSidebarOpen, unsetIsSidebarOpen] =
    useBoolean(false);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);
  const [localTaskLists, setLocalTaskLists] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor),
  );

  const handleCollapse = (section: string) => {
    setActiveCollapse((current) => (current === section ? '' : section));
  };

  const handleBackClick = () => {
    setShowStepTwo(false);
  };

  const handleClose = () => {
    setShowStepTwo(false);
    dispatch(clearWorkspaceState());
    history.push(WORKSPACE_PATH);
  };

  useEffect(() => {
    dispatch(getWorkspaceTaskLists(workspaceIdentifier));
    dispatch(PatientsActions.getPatientsLists(workspaceIdentifier) as any);
    dispatch(getWorkspaceUsers(workspaceIdentifier));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalTaskLists(taskLists ?? []);
  }, [taskLists]);

  const handleDragEnd = useCallback(
    ({ active, over }: any) => {
      if (!over || active?.data?.current?.index === over?.data?.current?.index)
        return;

      const reorderedLists = move(
        active?.data?.current?.index,
        over?.data?.current?.index,
        localTaskLists,
      );
      
      setLocalTaskLists(reorderedLists);
      dispatch(reorderWorkspaceTaskLists(reorderedLists, workspaceIdentifier) as any);
     
    },
    [localTaskLists, dispatch],
  );

  const openAddListModal = () => {
    dispatch(
      openModal('ListForm', {
        showPrivacyOptions: true,
        workspaceIdentifier,
      }),
    );
  };

  const openAddUserModal = () => {
    dispatch(
      openModal('InviteToList', {
        list: [],
        title: `Add User to the ${workspaceLabel}`,
        CustomForm: InviteUserToWorkspaceForm,
        identifier: workspaceIdentifier,
      }),
    );
  };

  const handleAddCustomListClick = () => {
    dispatch(openModal('EditPatientList', { workspaceIdentifier }));
    dispatch(hideSubMenu());
  };

  return (
    <>
      <WorkspaceContainer>
        <WorkspacesTitleWrapper>
          <WorkspacesSubWrapper $fullWidth>
            <WorkspacesLeftWrapper>
              <ArrowBackIcon onClick={handleBackClick} />
              <WorkspacesTitle>{pluralize(workspaceLabel)}</WorkspacesTitle>
            </WorkspacesLeftWrapper>
            <HomeIconWrapper onClick={handleClose}>
              <HomeIcon />
            </HomeIconWrapper>
          </WorkspacesSubWrapper>
        </WorkspacesTitleWrapper>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => history.push(`/core/workspace/${workspaceIdentifier}`)}
        >
          <Flex j={'start'} gap={10} pl={10} pt={10}>
            <WorkspaceTile
              workspaceProfileColor={workspace.workspaceProfileColor}
              workspaceInitials={workspace.workspaceInitials}
            />
            <div>{workspace.workspaceName}</div>
          </Flex>
        </div>
        <WorkspaceListWrapper>
          <NewLabeledCollapse
            name="Lists"
            isOpened={activeCollapse === 'list'}
            onClick={() => handleCollapse('list')}
            addButtonClick={openAddListModal}
          >
            <WorkspaceListItems>
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                modifiers={[
                  restrictToVerticalAxis,
                  restrictToFirstScrollableAncestor,
                ]}
              >
                <SortableContext
                  items={(localTaskLists ?? [])?.map(
                    (list: any) => list?.taskListIdentifier,
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  {localTaskLists?.map((list: any, index: number) => (
                    <DraggableDroppableListItem
                      list={list}
                      index={index}
                      key={list.taskListIdentifier}
                      setDragActiveId={setDragActiveId}
                      searchValue={''}
                    >
                      <DrawerListsItem
                        key={list.taskListIdentifier}
                        style={{ paddingBottom: '10px' }}
                        {...({
                          $isDraggable: true,
                          $isDragging:
                            dragActiveId === list?.taskListIdentifier,
                        } as any)}
                      >
                        <MenuWrapper>
                          <ListOptionsMenu list={list}>
                            <MoreVert
                              color="primary"
                              style={{
                                cursor:
                                  dragActiveId === list?.taskListIdentifier
                                    ? 'grabbing'
                                    : 'pointer',
                              }}
                            />
                          </ListOptionsMenu>
                        </MenuWrapper>
                        {list.color && (
                          <Box mr={1}>
                            <ColorIndicator color={list.color} />
                          </Box>
                        )}
                        <Tooltip placement="top" title={list?.listName || ''}>
                          <ListNameText
                            {...({
                              isActive:
                                activeTaskListIdentifier ===
                                list?.taskListIdentifier,
                              $isDragging:
                                dragActiveId === list?.taskListIdentifier,
                            } as any)}
                            onClick={() => {
                              history.push(
                                createTaskListPath(list.taskListIdentifier),
                              );
                            }}
                          >
                            <ListNameLabel
                              {...({
                                isNewList:
                                  list.hasUpdatesForMember ||
                                  list?.status === 'PENDING',
                              } as any)}
                            >
                              {list?.listName}
                            </ListNameLabel>
                          </ListNameText>
                        </Tooltip>
                      </DrawerListsItem>
                    </DraggableDroppableListItem>
                  ))}
                </SortableContext>
              </DndContext>
            </WorkspaceListItems>
          </NewLabeledCollapse>
        </WorkspaceListWrapper>
        <WorkspaceItemWrapper>
          <NewLabeledCollapse
            name="User Groups"
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
                  {userGroups?.map(({ identifier, name, usersCount }: any) => (
                    <DrawerListsItem key={identifier}>
                      <ListNameText
                        onClick={() => {
                          history.push(
                            `/core/workspace/${workspaceIdentifier}/users`,
                          );
                        }}
                      >
                        {name}
                      </ListNameText>
                      <DrawerItemOptions>
                        <div>{usersCount}</div>
                        <Box m={1.5} />
                      </DrawerItemOptions>
                    </DrawerListsItem>
                  ))}
                  <div>
                    {userGroups?.length === 0 && (
                      <div>No user groups found</div>
                    )}
                  </div>
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
                            `/core/workspace/${workspaceIdentifier}/patients/list/${
                              DefaultPatientListUrl[
                                patientType.patientListIdentifier
                              ]
                            }`,
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
            <DrawerMyListsLabel>
              <div>Custom Lists</div>
              {!isViewOnly && (
                <AddButton buttonRef={null} onClick={handleAddCustomListClick}>
                  Add
                </AddButton>
              )}
            </DrawerMyListsLabel>
            <WorkspaceUserItems>
              {isInitialListFetching ? (
                Array.from({ length: 2 }, () => null).map((_, index) => (
                  <DrawerListsItemLoader key={index} />
                ))
              ) : (
                <>
                  {customPatientsLists?.map((patientType: any) => (
                    <DrawerListsItem key={patientType.patientListIdentifier}>
                      <ListNameText
                        onClick={() => {
                          history.push(
                            `/core/workspace/${workspaceIdentifier}/patients/list/${patientType.patientListIdentifier}`,
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
