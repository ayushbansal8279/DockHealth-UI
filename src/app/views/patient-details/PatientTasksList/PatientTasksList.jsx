/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useMemo } from 'react';
import useActions from 'hooks/use-actions';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { createPatientDetailsListPath } from 'routing/helpers/paths';
import TaskListDetailsDropdown from 'views/patient-details/TaskListDetailsDropdown/TaskListDetailsDropdown';
import EmptyTaskListBird from 'img/animals/bird';
import { getPatientTasks } from 'actions/patient-details-actions';
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
import { ListViewType } from '../helpers';
import {
  checkIfSelectedListIsPresent,
  searchTaskInPatientLists,
} from './helpers';
import TaskListToolbar from '../TaskListToolbar/TaskListToolbar';

const PATIENT_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: false,
};

const PATIENT_ALL_TASKS_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.PATIENT]: false,
  [TaskItemColumn.LIST_NAME]: true,
};

const PatientTasksListView = () => {
  const {
    patientIdentifier,
    taskListIdentifier: taskListIdentifierParameter = ListViewType.ALL_TASKS,
  } = useParams();

  const sort = useSelector(patientTasksSortSelector);
  const isFetchingLists = useSelector(isFetchingPatientTaskListsSelector);
  const lists = useSelector(patientTaskListsSelector);
  const completeTasksVisible = useSelector(completeTasksVisibilitySelector);
  const currentUser = useSelector(userProfileSelector);
  const selectedTask = useSelector(selectedTaskSelector);
  const taskSearch = useSelector(patientTaskSearchSelector);
  const areFiltersApplied = useSelector(hasFiltersAppliedSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);

  const dispatch = useDispatch();
  const history = useHistory();
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
  } = useActions(PatientTasksSagaActions);
  const modalActions = useActions(ModalActions);

  useEffect(() => {
    if (patientIdentifier) {
      initializeSavedFilters(patientIdentifier);
      dispatch(getPatientTasks(patientIdentifier));
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

  const handleQuickAddTask = ({ description, taskListIdentifier }) => {
    if (taskListIdentifier) {
      quickAddPatientTask({ description, taskListIdentifier });
    } else {
      modalActions.openModal('ListPicker', {
        fetchMethod: getTaskListForUser,
        confirm: listId =>
          quickAddPatientTask({ description, taskListIdentifier: listId }),
      });
    }
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

  const handleApplyTemplate = useCallback(
    ({ taskListIdentifier, taskTemplateIdentifier }) => {
      if (taskListIdentifier) {
        applyTemplateForPatient({
          taskTemplateIdentifier,
          taskListIdentifier,
        });
      } else {
        modalActions.openModal('ListPicker', {
          fetchMethod: getTaskListForUser,
          confirm: listId =>
            applyTemplateForPatient({
              taskTemplateIdentifier,
              taskListIdentifier: listId,
            }),
        });
      }
    },
    [applyTemplateForPatient, modalActions],
  );

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

  return (
    <>
      {!isFetchingLists ? (
        <>
          {filteredLists?.length > 0 ? (
            <>
              <TaskListToolbar lists={filteredLists} />
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
                    toggleTaskStatus={handleToggleTaskStatus}
                    onTaskUpdate={updatePatientTaskInList}
                    updateDueDate={updatePatientTaskDueDate}
                    updateWorkflowStatus={updatePatientTaskWorkflowStatus}
                    quickAddTask={handleQuickAddTask}
                    refreshView={refreshPatientTasks}
                    hideSubtasks={isListFlattened}
                    sort={sort}
                    onSortChange={sortPatientTasks}
                    taskItemConfig={
                      isAllTasksView
                        ? PATIENT_ALL_TASKS_VIEW_COLUMNS_CONFIG
                        : PATIENT_VIEW_COLUMNS_CONFIG
                    }
                    applyTemplate={handleApplyTemplate}
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

export default PatientTasksListView;
