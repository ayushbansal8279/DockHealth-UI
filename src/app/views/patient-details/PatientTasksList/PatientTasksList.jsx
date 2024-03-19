/* eslint-disable import/no-cycle */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo } from 'react';
import compose from 'ramda/src/compose';
import useActions from 'hooks/use-actions';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { changeTasksSelectedState, addTask } from 'actions/task-actions';
import { createPatientDetailsListPath } from 'routing/helpers/paths';
import TaskListHeader from 'views/patient-details/TaskListHeader/TaskListHeader';
import {
  getPatientFilterOptions,
  getCurrentPatientTasks,
} from 'actions/patient-details-actions';
import { openModal } from 'modal/actions';
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
  patientSelector,
  currentListTasksStatusSelector,
  selectedTasksSelector,
} from 'selectors/patient-details-selectors';
import { addingNewSubtaskParentIdSelector } from 'selectors/task-drawer-selectors';
// import { organizationCustomFieldsSelector } from 'selectors/organization-selectors';
import {
  hasFiltersAppliedSelector,
  selectedFiltersInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';
import {
  userProfileSelector,
  userSetupClientViewSelector,
  selectedUserOrganizationSelector,
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
import {
  TaskItemColumn,
  TaskItemType,
  TASK_ITEM_BASE_COLUMN_CONFIG,
  TaskOrigin,
  TaskStatus,
} from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import {
  isTaskItemsSelectedSelector,
  selectedTaskIdentifiersSelector,
} from 'selectors/task-items-selectors';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
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

const PATIENT_SPECIFIC_LIST_VIEW_COLUMNS_CONFIG = {
  ...TASK_ITEM_BASE_COLUMN_CONFIG,
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: false,
};

const PATIENT_ALL_JOINED_LISTS_VIEW_COLUMNS_CONFIG = {
  ...TASK_ITEM_BASE_COLUMN_CONFIG,
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: true,
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
  const tasksStatus =
    useSelector(currentListTasksStatusSelector) || TaskStatus.INCOMPLETE;
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { setCurrentList, currentList, setViewSpecificConfig } =
    useTaskListColumnsConfig();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    // togglePatientTaskStatus,
    updatePatientTaskInList,
    updatePatientTaskWorkflowStatus,
    sortPatientTasks,
    initializeSavedFilters,
  } = useActions(PatientTasksSagaActions);
  const patient = useSelector(patientSelector);
  const isAllTasksView = taskListIdentifierParameter === ListViewType.ALL_TASKS;

  // const organizationCustomFields = useSelector(
  //   organizationCustomFieldsSelector,
  // );
  // const taskCustomFields = organizationCustomFields;

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const iconColorActiveItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'icon.active.color',
    ) || {};
  const enrichedWithPatientMetaDataLists = useMemo(() => {
    if (patient?.patientMetaData) {
      const { patientMetaData } = patient;
      return lists?.map((l) => ({
        ...l,
        tasks: l.tasks?.map((t) => ({
          ...t,
          patient: { ...t.patient, patientMetaData },
        })),
      }));
    }
    return lists;
  }, [lists, patient]);
  const filteredLists = useMemo(
    () =>
      taskSearch
        ? searchTaskInPatientLists(enrichedWithPatientMetaDataLists, taskSearch)
        : enrichedWithPatientMetaDataLists,
    [enrichedWithPatientMetaDataLists, taskSearch],
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
            (l) => l.taskListIdentifier === taskListIdentifierParameter,
          ),
    [filteredLists, isAllTasksView, taskListIdentifierParameter],
  );
  window.disabledVirtualTaskList = true;
  useEffect(() => {
    if (isAllTasksView) {
      setViewSpecificConfig(PATIENT_ALL_JOINED_LISTS_VIEW_COLUMNS_CONFIG);
    } else {
      setViewSpecificConfig(PATIENT_SPECIFIC_LIST_VIEW_COLUMNS_CONFIG);
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
  useEffect(() => {
    if (patientIdentifier) {
      initializeSavedFilters(patientIdentifier);
      dispatch(getCurrentPatientTasks());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientIdentifier]);
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
    (updatedTask) => {
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
        setTimeout(() => dispatch(getCurrentPatientTasks()), 1500);
      } else {
        dispatch(
          openModal('ListPicker', {
            enableSelectingGroupStep: true,
            fetchMethod: getTaskListForUser,
            confirm: (listId, taskGroupId) => {
              dispatch(
                addTask({
                  description,
                  taskListIdentifier: listId,
                  patientIdentifier,
                  taskGroupIdentifier: taskGroupId,
                }),
              );
              setTimeout(() => dispatch(getCurrentPatientTasks()), 1500);
            },
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
      <EmptyListViewWithQuickAddTask
        quickAddTask={quickAddTask}
        iconColorActive={iconColorActiveItem?.value}
      >
        <EmptyListView
          title={`This ${customerTypeLabel} has no tasks`}
          description={`Add tasks for this ${customerTypeLabel} above.`}
        />
      </EmptyListViewWithQuickAddTask>
    );
  };

  // const handleToggleTaskStatus = useCallback(
  //   task => {
  //     const incompleteRequiredFields = findIncompleteRequiredFields(
  //       taskCustomFields,
  //       task,
  //     );
  //     const isRequiredFieldsAreIncomplete =
  //       incompleteRequiredFields?.length > 0;

  //     if (isRequiredFieldsAreIncomplete) {
  //       const modalProps = {
  //         incompleteFields: incompleteRequiredFields,
  //       };
  //       dispatch(openModal('CompleteAllFields', modalProps));
  //       return;
  //     }

  //     const hasIncompletedSubtasks = task.subtasks.find(
  //       subtask => subtask.status === 'INCOMPLETE',
  //     );
  //     if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
  //       const modalProps = {
  //         confirm: () => {
  //           dispatch(closeModal());
  //           togglePatientTaskStatus(task);
  //         },
  //       };
  //       dispatch(openModal('CompleteAllTasks', modalProps));
  //     } else {
  //       togglePatientTaskStatus(task);
  //     }
  //   },
  //   [dispatch, taskCustomFields, togglePatientTaskStatus],
  // );

  const groupedTasks = useMemo(() => {
    if (isAllTasksView) return;
    return groupTasks(activeList?.tasks);
  }, [activeList, isAllTasksView]);

  const groupHasMultipleAssignees = false;

  const isTaskGroupSelected = useSelector(
    isTaskItemsSelectedSelector(
      activeList?.tasks.map((task) => task.identifier),
    ),
  );

  const selectedTaskIdentifiers = useSelector(selectedTaskIdentifiersSelector);

  const handleGroupSelect = useCallback(() => {
    const taskIdentifiers = activeList?.tasks.map((task) => task.identifier);
    dispatch(changeTasksSelectedState(!isTaskGroupSelected, taskIdentifiers));
  }, [activeList?.tasks, dispatch, isTaskGroupSelected]);

  const renderTasks = useCallback(
    (tasks, { isFullView, taskGroupIdentifier }) => {
      const taskIdentifiers = tasks.map((task) => task.identifier);
      const isGroupSelected =
        taskIdentifiers?.length > 0 &&
        taskIdentifiers?.every((taskId) =>
          selectedTaskIdentifiers?.includes(taskId),
        );

      return (
        <>
          {!completeTasksVisible && (
            <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={13}>
              <TasksToolbar
                taskListIdentifier={activeList?.taskListIdentifier}
                taskGroupIdentifier={taskGroupIdentifier}
                onQuickAddTask={quickAddTask}
                iconColorActive={iconColorActiveItem?.value}
              />
            </StickyContainer>
          )}
          <div
            className="IN"
            style={{ width: 'fit-content', minWidth: '100%' }}
          >
            {tasks && tasks.length > 0 && (
              <TasksHeader
                bulkEditEnabled
                sort={sort}
                onSortChange={sortPatientTasks}
                groupHasMultipleAssignees={groupHasMultipleAssignees}
                isGroupSelected={isGroupSelected}
                onGroupSelect={handleGroupSelect}
              />
            )}
            {tasks?.map((task) => {
              return task.itemType === TaskItemType.TASK ? (
                <StandardTaskItem
                  key={task.identifier}
                  isFullView={isFullView}
                  taskIdentifier={task.identifier}
                  taskGroupIdentifier={taskGroupIdentifier}
                  patient={patient}
                  isCompletedGroup={completeTasksVisible}
                  onTaskUpdate={updatePatientTaskInList}
                  updateWorkflowStatus={updatePatientTaskWorkflowStatus}
                  dragAndDropDisabled
                  addingNewSubtask={
                    addingNewSubtaskParentId === task.identifier
                  }
                  multipleAssigneesContext={groupHasMultipleAssignees}
                  iconColorActive={iconColorActiveItem?.value}
                  origin={TaskOrigin.PATIENT}
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
                  origin={TaskOrigin.PATIENT}
                />
              );
            })}
          </div>
        </>
      );
    },
    [
      completeTasksVisible,
      activeList?.taskListIdentifier,
      quickAddTask,
      iconColorActiveItem?.value,
      sort,
      sortPatientTasks,
      groupHasMultipleAssignees,
      selectedTaskIdentifiers,
      handleGroupSelect,
      updatePatientTaskInList,
      updatePatientTaskWorkflowStatus,
      addingNewSubtaskParentId,
      viewSetup,
      tasksStatus,
      patient,
    ],
  );

  const bulkEditTasks = useSelector(selectedTasksSelector);

  const bulkEditIsDisabled = completeTasksVisible;

  return (
    <>
      {filteredLists ? (
        <>
          {filteredLists?.length >= 0 ? (
            <>
              <StickyContainer left={24} decreaseWidth={2 * 24} zIndex={13}>
                <TaskListToolbar
                  lists={filteredLists}
                  currentList={activeList}
                  isPatientView
                />
              </StickyContainer>
              <Box py={0.5} />
              {activeList ? (
                <ListDetailsContainer>
                  <BulkEditSection
                    allTasks={bulkEditTasks}
                    refreshTasks={handleTaskUpdate}
                    disabled={bulkEditIsDisabled}
                    searchValue={taskSearch}
                  >
                    <StickyContainer
                      left={24}
                      decreaseWidth={2 * 24}
                      zIndex={13}
                    >
                      <TaskListHeader
                        list={isAllTasksView ? null : activeList}
                        viewSetup={viewSetup}
                        refreshView={compose(dispatch, getCurrentPatientTasks)}
                      />
                    </StickyContainer>
                    {isAllTasksView ? (
                      renderTasks(activeList.tasks, { isFullView: false })
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
        onTaskDelete={() => {
          dispatch(getPatientFilterOptions(patientIdentifier));
        }}
        disabledFields={[DrawerFieldEnum.PATIENT]}
        origin={TaskOrigin.PATIENT}
      />
    </>
  );
};

export default PatientTasksListView;
