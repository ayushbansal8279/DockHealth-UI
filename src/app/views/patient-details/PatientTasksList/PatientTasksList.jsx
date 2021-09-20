/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  IconButton,
  Popper,
  ClickAwayListener,
  Paper,
  Box,
} from '@material-ui/core';
import useBoolean from 'hooks/useBoolean';
import zIndex from 'styles/z-index';
import { MoreVert } from '@material-ui/icons';
import { useParams, useHistory } from 'react-router-dom';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { createPatientDetailsListPath } from 'routing/helpers/paths';
import Spacing from 'components/common/Spacing';
import TaskListDetailsDropdown from 'views/patient-details/TaskListDetailsDropdown/TaskListDetailsDropdown';
import EmptyTaskListBird from 'img/animals/bird';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import { PatientTasksSagaActions } from 'sagas/patient-details-saga';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import {
  patientTaskListsSelector,
  completeTasksVisibilitySelector,
  patientTaskSearchSelector,
  patientTasksSortSelector,
  isFetchingPatientTaskListsSelector,
} from 'selectors/patient-details-selectors';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import {
  hasFiltersAppliedSelector,
  selectedFiltersInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import OutlinedSelect from 'components/common/OutlinedSelect/OutlinedSelect';
import Checkbox from 'components/common/Checkbox/Checkbox';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import EmptyListViewWithQuickAddTask from 'components/tasklist/EmptyListView/EmptyListViewWithQuickAddTask';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import { getTaskListForUser } from 'api/task-list-api';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import { TaskItemColumn } from 'helpers/task-helpers';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { ListsTabsContainer, ListsToolbarContainer, MenuText } from './styled';
import {
  LIST_TYPE_OPTIONS,
  ListViewType,
  checkIfSelectedListIsPresent,
  searchTaskInPatientLists,
} from './helpers';

const PATIENT_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: false,
};

const PATIENT_ALL_TASKS_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: true,
};

const PatientTasksListView = ({
  completeTasksVisible,
  selectedFilters,
  lists,
  isFetchingLists,
  currentUser,
  selectedTask,
  taskDrawerActions,
  taskActions,
  patientTasksSagaActions,
  modalActions,
  taskSearch,
  areFiltersApplied,
  sort,
}) => {
  const menuReference = useRef();
  const { 0: menuOpen, 2: unsetMenuOpen, 3: toggleMenuOpen } = useBoolean(
    false,
  );
  const {
    patientIdentifier,
    taskListIdentifier: taskListIdentifierValue,
  } = useParams();
  const taskListIdentifierParameter =
    taskListIdentifierValue ?? ListViewType.ALL_TASKS;
  const history = useHistory();
  const { openDrawer } = taskDrawerActions;
  const { storeAsCurrentTask } = taskActions;
  const {
    togglePatientTaskStatus,
    updatePatientTaskInList,
    updatePatientTaskDueDate,
    updatePatientTaskWorkflowStatus,
    quickAddPatientTask,
    refreshPatientTasks,
    sortPatientTasks,
    applyTemplateForPatient,
    fetchPatientFilters,
    initializeSavedFilters,
    fetchPatientTasks,
    toggleCompleteTasksVisible,
  } = patientTasksSagaActions;

  useEffect(() => {
    if (patientIdentifier) {
      initializeSavedFilters(patientIdentifier);
      fetchPatientTasks(patientIdentifier);
      fetchPatientFilters(patientIdentifier);
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

  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const isListFlattened =
    areFiltersApplied ||
    !!taskSearch ||
    (!!sort?.key && !['PATIENT', 'SUBTASK_COUNT'].includes(sort.key));

  const handleTaskUpdate = useCallback(
    updatedTask => {
      fetchPatientFilters();
      if (!checkIfTaskMatchesFilters(updatedTask, selectedFilters)) {
        refreshPatientTasks({ withLoader: false });
      }
    },
    [selectedFilters, refreshPatientTasks, fetchPatientFilters],
  );

  const handleQuickAddTask = ({ description }) => {
    modalActions.openModal('ListPicker', {
      fetchMethod: getTaskListForUser,
      confirm: taskListIdentifier =>
        quickAddPatientTask({ description, taskListIdentifier }),
    });
  };

  const renderEmptyListView = () => {
    if (taskSearch) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    return (
      <EmptyListViewWithQuickAddTask quickAddTask={handleQuickAddTask}>
        <EmptyListView
          title={`This ${customerTypeLabel} has no tasks`}
          description={`Add tasks for this ${customerTypeLabel} above.`}
          image={EmptyTaskListBird}
        />
      </EmptyListViewWithQuickAddTask>
    );
  };

  const handleToggleTaskStatus = task => {
    const hasIncompletedSubtasks = task.subtasks.find(
      subtask => subtask.status === 'INCOMPLETE',
    );
    if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
      const modalProps = {
        confirm: () => {
          modalActions.closeModal();
          togglePatientTaskStatus(task);
        },
      };
      modalActions.openModal('CompleteAllTasks', modalProps);
    } else {
      togglePatientTaskStatus(task);
    }
  };

  const applyTemplate = useCallback(
    ({ taskListIdentifier, taskTemplateIdentifier }) => {
      applyTemplateForPatient({
        taskTemplateIdentifier,
        taskListIdentifier,
      });
    },
    [applyTemplateForPatient],
  );

  const handleListChange = event => {
    history.push(
      createPatientDetailsListPath(
        patientIdentifier,
        event.target?.value || filteredLists[0].taskListIdentifier,
      ),
    );
  };

  const handleListViewTypeChange = event => {
    history.push(
      createPatientDetailsListPath(
        patientIdentifier,
        event.target?.value === ListViewType.ALL_TASKS
          ? ListViewType.ALL_TASKS
          : filteredLists[0].taskListIdentifier,
      ),
    );
  };

  const isAllTasksView = taskListIdentifierParameter === ListViewType.ALL_TASKS;

  const activeList = useMemo(
    () =>
      isAllTasksView
        ? filteredLists.reduce(
            (accumulator, { tasks }) => ({
              ...accumulator,
              tasks: [...accumulator.tasks, ...tasks],
            }),
            { tasks: [] },
          )
        : filteredLists.find(
            l => l.taskListIdentifier === taskListIdentifierParameter,
          ),
    [filteredLists, isAllTasksView, taskListIdentifierParameter],
  );

  const filteredListsWithCounts = filteredLists?.map(
    ({ taskListIdentifier, listName, tasks = [] }) => {
      return {
        tasksCount:
          (tasks.length > 0 &&
            tasks?.reduce((counter, task) => {
              if (task?.itemType === 'BUNDLE') {
                const bundledTaskCount = task?.tasks?.reduce(
                  (bundleTaskCounter, bundleTask) => {
                    return (
                      bundleTaskCounter + (bundleTask?.subTasksCount || 0) + 1
                    );
                  },
                  0,
                );
                return counter + bundledTaskCount;
              }
              return counter + (task?.subTasksCount || 0) + 1;
            }, 0)) ||
          0,
        taskListIdentifier,
        listName,
        tasks,
      };
    },
  );

  return (
    <>
      {!isFetchingLists ? (
        <>
          {filteredLists?.length > 0 ? (
            <>
              <ListsToolbarContainer>
                <ListsTabsContainer>
                  <OutlinedSelect
                    width={170}
                    name="listType"
                    value={
                      isAllTasksView
                        ? ListViewType.ALL_TASKS
                        : ListViewType.LIST_VIEW
                    }
                    onChange={handleListViewTypeChange}
                    options={LIST_TYPE_OPTIONS}
                  />
                  <Box px={2} />
                  {taskListIdentifierParameter !== ListViewType.ALL_TASKS && (
                    <OutlinedSelect
                      name="currentList"
                      value={taskListIdentifierParameter}
                      onChange={handleListChange}
                      options={filteredListsWithCounts?.map(
                        ({ taskListIdentifier, listName, tasksCount }) => ({
                          label: `${listName}`,
                          secondaryLabel: `(${tasksCount})`,
                          value: taskListIdentifier,
                        }),
                      )}
                    />
                  )}
                </ListsTabsContainer>
                <IconButton ref={menuReference} onClick={toggleMenuOpen}>
                  <MoreVert />
                </IconButton>
                <Popper
                  anchorEl={menuReference?.current}
                  placement="bottom-end"
                  disablePortal
                  open={menuOpen}
                  style={{
                    zIndex: zIndex.optionsMenu,
                  }}
                >
                  {menuOpen && (
                    <ClickAwayListener onClickAway={unsetMenuOpen}>
                      <Paper>
                        <Box display="flex" alignItems="center" p={3}>
                          <Checkbox
                            isChecked={completeTasksVisible}
                            onClick={() => {
                              unsetMenuOpen();
                              toggleCompleteTasksVisible();
                            }}
                          />
                          <Spacing horizontal={3} />
                          <MenuText>Show completed tasks</MenuText>
                        </Box>
                      </Paper>
                    </ClickAwayListener>
                  )}
                </Popper>
              </ListsToolbarContainer>
              <Box py={0.5} />
              {activeList ? (
                <BulkEditSection
                  allTasks={activeList.tasks}
                  refreshTasks={handleTaskUpdate}
                  searchValue={taskSearch}
                >
                  <TaskListDetailsDropdown
                    list={activeList}
                    tasks={activeList.tasks}
                    currentUser={currentUser}
                    selectedTask={selectedTask}
                    isCompleteTab={completeTasksVisible}
                    openDrawer={openDrawer}
                    storeAsCurrentTask={storeAsCurrentTask}
                    toggleTaskStatus={handleToggleTaskStatus}
                    onTaskUpdate={updatePatientTaskInList}
                    updateDueDate={updatePatientTaskDueDate}
                    updateWorkflowStatus={updatePatientTaskWorkflowStatus}
                    quickAddTask={quickAddPatientTask}
                    refreshView={refreshPatientTasks}
                    hideSubtasks={isListFlattened}
                    sort={sort}
                    onSortChange={sortPatientTasks}
                    taskItemConfig={
                      isAllTasksView
                        ? PATIENT_ALL_TASKS_VIEW_COLUMNS_CONFIG
                        : PATIENT_VIEW_COLUMNS_CONFIG
                    }
                    applyTemplate={applyTemplate}
                  />
                </BulkEditSection>
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
        onTaskDelete={fetchPatientFilters}
        disabledFields={[DrawerFieldEnum.PATIENT]}
      />
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  patientTasksSagaActions: bindActionCreators(
    PatientTasksSagaActions,
    dispatch,
  ),
  modalActions: bindActionCreators(ModalActions, dispatch),
});

const mapStateToProps = state => ({
  sort: patientTasksSortSelector(state),
  isFetchingLists: isFetchingPatientTaskListsSelector(state),
  lists: patientTaskListsSelector(state),
  completeTasksVisible: completeTasksVisibilitySelector(state),
  currentUser: userProfileSelector(state),
  selectedTask: selectedTaskSelector(state),
  taskSearch: patientTaskSearchSelector(state),
  areFiltersApplied: hasFiltersAppliedSelector(state),
  selectedFilters: selectedFiltersInMegaFilterSelector(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientTasksListView);
