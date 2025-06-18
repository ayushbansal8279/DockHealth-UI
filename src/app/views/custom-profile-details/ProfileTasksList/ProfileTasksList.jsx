/* eslint-disable import/no-cycle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import {
  changeTasksSelectedState,
  addTask,
  getTasksForProfile,
} from 'actions/task-actions';
import TaskListHeader from 'views/patient-details/TaskListHeader/TaskListHeader';
import { openModal } from 'modal/actions';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import { addingNewSubtaskParentIdSelector } from 'selectors/task-drawer-selectors';
import {
  hasFiltersAppliedSelector,
  selectedFiltersInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';
import {
  userSetupClientViewSelector,
  selectedUserOrganizationSelector,
} from 'selectors/user-selectors';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import { getTaskListForUser } from 'api/task-list-api';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import {
  TaskItemColumn,
  TaskItemType,
  TASK_ITEM_BASE_COLUMN_CONFIG,
  TaskOrigin,
  TaskStatus,
} from 'helpers/task-helpers';
import {
  isTaskItemsSelectedSelector,
  selectedTaskIdentifiersSelector,
} from 'selectors/task-items-selectors';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import { ListDetailsContainer } from 'components/tasklist/DropdownListSection/styled';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import {
  profileAllTasksSelector,
  profileTaskListsSelector,
} from 'selectors/custom-profile-details-selectors';
import { ListViewType } from '../helpers';
import { groupTasks } from './helpers';
import TaskListToolbar from '../TaskListToolbar/TaskListToolbar';
import TaskListGroupCollapse from '../TaskListGroupCollapse/TaskListGroupCollapse';
import TasksToolbar from '../TasksToolbar/TasksToolbar';
import useActions from '@/app/hooks/use-actions';
import { CustomProfileDetailsActions } from '@/app/actions/custom-profile-details-action';

const SPECIFIC_LIST_VIEW_COLUMNS_CONFIG = {
  ...TASK_ITEM_BASE_COLUMN_CONFIG,
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: false,
};

const ALL_JOINED_LISTS_VIEW_COLUMNS_CONFIG = {
  ...TASK_ITEM_BASE_COLUMN_CONFIG,
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: true,
};

const ProfileTasksListView = ({ profileIdentifier }) => {
  const { updateProfileTaskInList } = useActions(CustomProfileDetailsActions);
  const {
    taskListIdentifier: taskListIdentifierParameter = ListViewType.ALL_TASKS,
  } = useParams();
  const viewSetup = useSelector(userSetupClientViewSelector);
  const lists = useSelector(profileTaskListsSelector);
  const areFiltersApplied = useSelector(hasFiltersAppliedSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);
  const addingNewSubtaskParentId = useSelector(
    addingNewSubtaskParentIdSelector,
  );
  const tasksStatus = TaskStatus.INCOMPLETE;

  const { setCurrentList, currentList, setViewSpecificConfig } =
    useTaskListColumnsConfig();
  const dispatch = useDispatch();
  const profileTasks = useSelector(profileAllTasksSelector);

  useEffect(() => {
    if (profileIdentifier) {
      dispatch(getTasksForProfile(profileIdentifier));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileIdentifier]);

  useEffect(() => {}, [profileTasks]);

  const refreshTasks = useCallback(() => {
    if (profileIdentifier) {
      dispatch(getTasksForProfile(profileIdentifier));
    }
  }, [dispatch, profileIdentifier]);

  const isAllTasksView = taskListIdentifierParameter === ListViewType.ALL_TASKS;

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};

  const filteredLists = lists;

  const activeList = useMemo(
    () =>
      isAllTasksView
        ? filteredLists?.reduce(
            (accumulator, { tasks }) => ({
              ...accumulator,
              tasks: [...accumulator.tasks, ...tasks],
            }),
            { tasks: [] },
          )
        : filteredLists?.find(
            (l) => l.taskListIdentifier === taskListIdentifierParameter,
          ),
    [filteredLists, isAllTasksView, taskListIdentifierParameter],
  );
  useEffect(() => {
    if (isAllTasksView) {
      setViewSpecificConfig(ALL_JOINED_LISTS_VIEW_COLUMNS_CONFIG);
    } else {
      setViewSpecificConfig(SPECIFIC_LIST_VIEW_COLUMNS_CONFIG);
    }
  }, [isAllTasksView, setViewSpecificConfig]);
  useEffect(() => {
    if (isAllTasksView && currentList) {
      setCurrentList(null);
    }
    if (
      !isAllTasksView &&
      activeList &&
      currentList?.taskListIdentifier !== activeList?.taskListIdentifier
    ) {
      setCurrentList(activeList);
    }
  }, [activeList, currentList, isAllTasksView, setCurrentList]);

  const handleTaskUpdate = useCallback(
    (updatedTask) => {
      if (!checkIfTaskMatchesFilters(updatedTask, selectedFilters)) {
        dispatch(getTasksForProfile(profileIdentifier));
      }
    },
    [dispatch, selectedFilters, profileIdentifier],
  );

  const quickAddTask = useCallback(
    async ({ description, taskListIdentifier, taskGroupIdentifier }) => {
      if (taskListIdentifier) {
        dispatch(
          addTask({
            description,
            taskListIdentifier,
            taskGroupIdentifier,
            profileIdentifier,
          }),
        );
      } else {
        dispatch(
          openModal('ListPicker', {
            enableSelectingGroupStep: true,
            fetchMethod: getTaskListForUser,
            confirm: async (listId, taskGroupId) => {
              dispatch(
                addTask({
                  description,
                  taskListIdentifier: listId,
                  profileIdentifier,
                  taskGroupIdentifier: taskGroupId,
                }),
              );
            },
          }),
        );
      }
    },
    [dispatch, profileIdentifier],
  );
  const renderEmptyListView = () => {
    if (areFiltersApplied) return <NoFilterResultsView />;
    return (
      <>
        <TasksToolbar
          onQuickAddTask={quickAddTask}
          iconColorActive={iconColorActiveItem?.value}
        />
        <EmptyListView title="No tasks" description="Add tasks above." />
      </>
    );
  };

  const groupedTasks = useMemo(() => {
    if (isAllTasksView) return;
    return groupTasks(activeList?.tasks);
  }, [activeList, isAllTasksView]);

  const groupHasMultipleAssignees = false;

  const isTaskGroupSelected = useSelector(
    isTaskItemsSelectedSelector(activeList?.tasks),
  );

  const selectedTaskIdentifiers = useSelector(selectedTaskIdentifiersSelector);

  const handleGroupSelect = useCallback(() => {
    const taskIdentifiers = activeList?.tasks;
    dispatch(changeTasksSelectedState(!isTaskGroupSelected, taskIdentifiers));
  }, [activeList?.tasks, dispatch, isTaskGroupSelected]);

  window.disabledVirtualTaskList = true;

  const renderTasks = useCallback(
    (tasks, { isFullView, taskGroupIdentifier }) => {
      const taskIdentifiers = tasks;
      const isGroupSelected =
        taskIdentifiers?.length > 0 &&
        taskIdentifiers?.every((taskId) =>
          selectedTaskIdentifiers?.includes(taskId),
        );

      return (
        <>
          <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={13}>
            <TasksToolbar
              taskListIdentifier={activeList?.taskListIdentifier}
              taskGroupIdentifier={taskGroupIdentifier}
              onQuickAddTask={quickAddTask}
              iconColorActive={iconColorActiveItem?.value}
            />
          </StickyContainer>
          {/* )} */}
          <div
            className="IN"
            style={{ width: 'fit-content', minWidth: '100%' }}
          >
            {tasks && tasks.length > 0 && (
              <TasksHeader
                bulkEditEnabled
                groupHasMultipleAssignees={groupHasMultipleAssignees}
                isGroupSelected={isGroupSelected}
                onGroupSelect={() => handleGroupSelect(tasks)}
              />
            )}
            {tasks?.map((task) => {
              return task.itemType === TaskItemType.TASK ? (
                <StandardTaskItem
                  key={task.identifier}
                  isFullView={isFullView}
                  taskIdentifier={task.identifier}
                  taskGroupIdentifier={taskGroupIdentifier}
                  onTaskUpdate={updateProfileTaskInList}
                  dragAndDropDisabled
                  addingNewSubtask={
                    addingNewSubtaskParentId === task.identifier
                  }
                  multipleAssigneesContext={groupHasMultipleAssignees}
                  iconColorActive={iconColorActiveItem?.value}
                  origin={TaskOrigin.CUSTOM_PROFILE}
                  isTopLevelTaskOrWorkflowHeader
                  taskItemDragAndDropDisabled
                />
              ) : (
                <TaskTemplateGroup
                  viewSetup={viewSetup}
                  key={task.identifier}
                  templateGroup={task}
                  groupHasMultipleAssignees={groupHasMultipleAssignees}
                  isFullView={isFullView}
                  groupDragAndDropDisabled
                  disablePatientAssignment
                  iconColorActive={iconColorActiveItem?.value}
                  isCompletedTab={tasksStatus !== TaskStatus.INCOMPLETE}
                  origin={TaskOrigin.CUSTOM_PROFILE}
                />
              );
            })}
          </div>
        </>
      );
    },
    [
      // completeTasksVisible,
      activeList?.taskListIdentifier,
      quickAddTask,
      iconColorActiveItem?.value,
      groupHasMultipleAssignees,
      selectedTaskIdentifiers,
      handleGroupSelect,
      addingNewSubtaskParentId,
      viewSetup,
      tasksStatus,
    ],
  );

  return (
    <>
      {!!filteredLists ? (
        <>
          {filteredLists?.length > 0 ? (
            <>
              <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={13}>
                <TaskListToolbar
                  lists={filteredLists}
                  currentList={activeList}
                />
              </StickyContainer>
              <Box py={0.5} />
              {profileTasks.length > 0 ? (
                <ListDetailsContainer>
                  <BulkEditSection refreshTasks={handleTaskUpdate}>
                    <StickyContainer
                      left={24}
                      decreaseWidth={2 * 24}
                      zIndex={13}
                    >
                      <TaskListHeader
                        list={isAllTasksView ? null : activeList}
                        viewSetup={viewSetup}
                        refreshView={refreshTasks}
                      />
                    </StickyContainer>
                    {isAllTasksView ? (
                      renderTasks(activeList.tasks, {
                        isFullView: false,
                        profileIdentifier,
                      })
                    ) : (
                      <>
                        {groupedTasks.map((group) => (
                          <TaskListGroupCollapse group={group} stickyHeader>
                            {({ isFullView }) =>
                              renderTasks(group.tasks, {
                                isFullView,
                                taskGroupIdentifier: group.taskGroupIdentifier,
                              })
                            }
                          </TaskListGroupCollapse>
                        ))}
                      </>
                    )}
                  </BulkEditSection>
                </ListDetailsContainer>
              ) : (
                renderEmptyListView()
              )}
            </>
          ) : (
            renderEmptyListView()
          )}
        </>
      ) : (
        <GroupedListSkeletonLoader />
      )}
      <TaskDrawer
        onTaskUpdate={handleTaskUpdate}
        onTaskCreation={handleTaskUpdate}
        onTaskDelete={() => {}}
        disabledFields={[DrawerFieldEnum.PATIENT]}
      />
    </>
  );
};

export default ProfileTasksListView;
