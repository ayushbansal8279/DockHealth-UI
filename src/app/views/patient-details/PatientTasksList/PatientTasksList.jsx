/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo } from 'react';
import { compose, pluck } from 'ramda';
import useActions from 'hooks/use-actions';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { changeTasksSelectedState, addTask } from 'actions/task-actions';
import { createPatientDetailsListPath } from 'routing/helpers/paths';
import TaskListHeader from 'views/patient-details/TaskListHeader/TaskListHeader';
import EmptyTaskListBird from 'img/animals/bird';
import {
  getPatientFilterOptions,
  getCurrentPatientTasks,
} from 'actions/patient-details-actions';
import { openModal, closeModal } from 'modal/actions';
import { PatientTasksSagaActions } from 'sagas/patient-details-saga';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import {
  currentPatientIdentifierSelector,
  patientTaskListsSelector,
  completeTasksVisibilitySelector,
  patientTaskSearchSelector,
  patientTasksSortSelector,
} from 'selectors/patient-details-selectors';
import { addingNewSubtaskParentIdSelector } from 'selectors/task-drawer-selectors';
import {
  hasFiltersAppliedSelector,
  selectedFiltersInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';
import {
  userProfileSelector,
  userSetupClientViewSelector,
  userProfileDashboardPrefsSelector,
} from 'selectors/user-selectors';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import EmptyListViewWithQuickAddTask from 'components/tasklist/EmptyListView/EmptyListViewWithQuickAddTask';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import { getTaskListForUser } from 'api/task-list-api';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import { TaskItemColumn, TaskItemType } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import { useColumnsConfig } from 'context-api/ColumnsConfigContext';
import { ListDetailsContainer } from 'components/tasklist/DropdownListSection/styled';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import { ListViewType } from '../helpers';
import {
  checkIfSelectedListIsPresent,
  groupTasks,
  searchTaskInPatientLists,
} from './helpers';
import TaskListToolbar from '../TaskListToolbar/TaskListToolbar';
import TaskListGroupCollapse from '../TaskListGroupCollapse/TaskListGroupCollapse';
import TasksToolbar from '../TasksToolbar/TasksToolbar';

const PATIENT_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: false,
};

const PATIENT_ALL_TASKS_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: true,
};

const PATIENT_CONFIGURABLE_COLUMNS_CONFIG = {
  [TaskItemColumn.WORKFLOW_STATUS]: false,
  [TaskItemColumn.ASSIGNED]: false,
  [TaskItemColumn.ACTIVITY]: false,
  [TaskItemColumn.START_DATE]: false,
  [TaskItemColumn.DUE_DATE]: false,
  [TaskItemColumn.PATIENT]: false,
};

const PatientTasksListView = () => {
  const {
    taskListIdentifier: taskListIdentifierParameter = ListViewType.ALL_TASKS,
  } = useParams();
  const patientIdentifier = useSelector(currentPatientIdentifierSelector);
  const viewSetup = useSelector(userSetupClientViewSelector);
  const sort = useSelector(patientTasksSortSelector);
  const lists = useSelector(patientTaskListsSelector);
  const completeTasksVisible = useSelector(completeTasksVisibilitySelector);
  const currentUser = useSelector(userProfileSelector);
  const taskSearch = useSelector(patientTaskSearchSelector);
  const areFiltersApplied = useSelector(hasFiltersAppliedSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);
  const addingNewSubtaskParentId = useSelector(
    addingNewSubtaskParentIdSelector,
  );
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { columnsConfig, setColumnsConfig } = useColumnsConfig();
  const userPreferColumns = useSelector(userProfileDashboardPrefsSelector);
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    togglePatientTaskStatus,
    updatePatientTaskInList,
    updatePatientTaskWorkflowStatus,
    sortPatientTasks,
    initializeSavedFilters,
  } = useActions(PatientTasksSagaActions);

  const isAllTasksView = taskListIdentifierParameter === ListViewType.ALL_TASKS;

  useEffect(() => {
    const taskItemConfig = isAllTasksView
      ? PATIENT_ALL_TASKS_VIEW_COLUMNS_CONFIG
      : PATIENT_VIEW_COLUMNS_CONFIG;
    const config =
      userPreferColumns?.reduce(
        (accumulator, value) => ({ ...accumulator, [value]: true }),
        PATIENT_CONFIGURABLE_COLUMNS_CONFIG,
      ) || {};
    const customizedDashboardConfig = {
      ...columnsConfig,
      ...config,
      ...taskItemConfig,
    };
    setColumnsConfig(customizedDashboardConfig);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllTasksView, setColumnsConfig, userPreferColumns]);

  useEffect(() => {
    if (patientIdentifier) {
      initializeSavedFilters(patientIdentifier);
      dispatch(getCurrentPatientTasks(patientIdentifier));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientIdentifier]);

  const filteredLists = useMemo(
    () => (taskSearch ? searchTaskInPatientLists(lists, taskSearch) : lists),
    [lists, taskSearch],
  );

  useEffect(() => {
    if (
      filteredLists?.length > 0 &&
      taskListIdentifierParameter !== ListViewType.ALL_TASKS &&
      (!taskListIdentifierParameter ||
        checkIfSelectedListIsPresent(
          filteredLists,
          taskListIdentifierParameter,
        ))
    ) {
      history.replace(
        createPatientDetailsListPath(
          patientIdentifier,
          filteredLists[0].taskListIdentifier,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListIdentifierParameter, filteredLists]);

  const handleTaskUpdate = useCallback(
    updatedTask => {
      dispatch(getPatientFilterOptions(patientIdentifier));
      if (!checkIfTaskMatchesFilters(updatedTask, selectedFilters)) {
        dispatch(getCurrentPatientTasks());
      }
    },
    [dispatch, patientIdentifier, selectedFilters],
  );

  const quickAddTask = useCallback(
    ({ description, taskListIdentifier, taskGroupIdentifier }) => {
      if (taskListIdentifier) {
        dispatch(
          addTask({
            description,
            taskListIdentifier,
            taskGroupIdentifier,
            patientIdentifier,
          }),
        );
      } else {
        dispatch(
          openModal('ListPicker', {
            fetchMethod: getTaskListForUser,
            confirm: listId =>
              dispatch(
                addTask({
                  description,
                  taskListIdentifier: listId,
                  patientIdentifier,
                }),
              ),
          }),
        );
      }
    },
    [dispatch, patientIdentifier],
  );

  const renderEmptyListView = () => {
    if (taskSearch) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    return (
      <EmptyListViewWithQuickAddTask quickAddTask={quickAddTask}>
        <EmptyListView
          title={`This ${customerTypeLabel} has no tasks`}
          description={`Add tasks for this ${customerTypeLabel} above.`}
          image={EmptyTaskListBird}
        />
      </EmptyListViewWithQuickAddTask>
    );
  };

  const handleToggleTaskStatus = useCallback(
    task => {
      const hasIncompletedSubtasks = task.subtasks.find(
        subtask => subtask.status === 'INCOMPLETE',
      );
      if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
        const modalProps = {
          confirm: () => {
            dispatch(closeModal());
            togglePatientTaskStatus(task);
          },
        };
        dispatch(openModal('CompleteAllTasks', modalProps));
      } else {
        togglePatientTaskStatus(task);
      }
    },
    [dispatch, togglePatientTaskStatus],
  );

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
            l => l.taskListIdentifier === taskListIdentifierParameter,
          ),
    [filteredLists, isAllTasksView, taskListIdentifierParameter],
  );

  const groupedTasks = useMemo(() => {
    if (isAllTasksView) return undefined;

    return groupTasks(activeList?.tasks);
  }, [activeList, isAllTasksView]);

  const groupHasMultipleAssignees = useMemo(
    () =>
      activeList?.tasks
        .flatMap(item =>
          item.itemType === TaskItemType.BUNDLE ? item.tasks : [item],
        )
        .some(
          // eslint-disable-next-line no-shadow
          ({ assignedToUsers, subtasks }) =>
            (assignedToUsers && assignedToUsers.length > 1) ||
            (subtasks &&
              subtasks.length > 0 &&
              subtasks.some(
                ({ assignedToUsers: subtaskAssignedToUsers }) =>
                  subtaskAssignedToUsers && subtaskAssignedToUsers.length > 1,
              )),
        ),
    [activeList],
  );

  const isGroupSelected = useCallback(
    tasks => checkIfAllTasksSelected(tasks),
    [],
  );

  const handleGroupSelect = useCallback(
    tasks => {
      const { parentTasks, subtasks } = extractTasksAndSubtasks(tasks);
      const allTasks = [...parentTasks, ...subtasks];
      dispatch(
        dispatch(
          changeTasksSelectedState(
            !isGroupSelected(tasks),
            pluck('identifier', allTasks),
          ),
        ),
      );
    },
    [dispatch, isGroupSelected],
  );

  const renderTasks = useCallback(
    (tasks, { isFullView, taskGroupIdentifier }) => (
      <>
        {!completeTasksVisible && (
          <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={13}>
            <TasksToolbar
              taskListIdentifier={activeList?.taskListIdentifier}
              taskGroupIdentifier={taskGroupIdentifier}
              onQuickAddTask={quickAddTask}
            />
          </StickyContainer>
        )}
        <div className="IN" style={{ width: 'fit-content' }}>
          {tasks && tasks.length > 0 && (
            <TasksHeader
              bulkEditEnabled
              sort={sort}
              onSortChange={sortPatientTasks}
              groupHasMultipleAssignees={groupHasMultipleAssignees}
              isGroupSelected={isGroupSelected(tasks)}
              onGroupSelect={() => handleGroupSelect(tasks)}
            />
          )}
          {tasks?.map(task =>
            task.itemType === TaskItemType.TASK ? (
              <StandardTaskItem
                key={task.identifier}
                isFullView={isFullView}
                task={task}
                isCompletedGroup={completeTasksVisible}
                toggleCompleteTask={handleToggleTaskStatus}
                onTaskUpdate={updatePatientTaskInList}
                updateWorkflowStatus={updatePatientTaskWorkflowStatus}
                dragAndDropDisabled
                addingNewSubtask={addingNewSubtaskParentId === task.identifier}
                multipleAssigneesContext={groupHasMultipleAssignees}
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
              />
            ),
          )}
        </div>
      </>
    ),
    [
      viewSetup,
      activeList,
      sort,
      sortPatientTasks,
      groupHasMultipleAssignees,
      quickAddTask,
      isGroupSelected,
      handleGroupSelect,
      addingNewSubtaskParentId,
      completeTasksVisible,
      handleToggleTaskStatus,
      updatePatientTaskInList,
      updatePatientTaskWorkflowStatus,
    ],
  );

  return (
    <>
      {filteredLists ? (
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
              {activeList ? (
                <ListDetailsContainer>
                  <BulkEditSection
                    allTasks={activeList.tasks}
                    refreshTasks={handleTaskUpdate}
                    searchValue={taskSearch}
                  >
                    <StickyContainer
                      left={24}
                      decreaseWidth={2 * 24}
                      zIndex={13}
                    >
                      <TaskListHeader
                        list={!isAllTasksView ? activeList : null}
                        viewSetup={viewSetup}
                        refreshView={compose(dispatch, getCurrentPatientTasks)}
                      />
                    </StickyContainer>

                    {isAllTasksView ? (
                      renderTasks(activeList.tasks, { isFullView: false })
                    ) : (
                      <>
                        {groupedTasks.map(group => (
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
        onTaskDelete={() => {
          dispatch(getPatientFilterOptions(patientIdentifier));
        }}
        disabledFields={[DrawerFieldEnum.PATIENT]}
      />
    </>
  );
};

export default PatientTasksListView;
