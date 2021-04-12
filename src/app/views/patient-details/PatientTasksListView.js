import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TaskListDetailsDropdown from 'views/patient-details/TaskListDetailsDropdown/TaskListDetailsDropdown';
import EmptyTaskListBird from 'img/animals/bird';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import { PatientTasksSagaActions } from 'sagas/patient-tasks-saga';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import {
  patientTaskListsSelector,
  patientTaskListsActiveTabSelector,
  patientTaskSearchSelector,
  patientTasksSortSelector,
} from 'selectors/patient-tasks-selectors';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import EmptyListViewWithQuickAddTask from 'components/tasklist/EmptyListView/EmptyListViewWithQuickAddTask';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import { getTaskListForUser } from 'api/task-list-api';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import { TaskItemColumn } from 'helpers/task-helpers';

const PATIENT_VIEW_COLUMNS_CONFIG = {
  [TaskItemColumn.PATIENT]: false,
};

const searchTaskInPatientLists = (patientLists, searchValue) =>
  patientLists.reduce((accumulator, currentValue) => {
    const filteredTasks = filterTasksBySearchValue(
      currentValue.tasks,
      searchValue,
    );

    if (filteredTasks.length === 0) return accumulator;

    return [...accumulator, { ...currentValue, tasks: filteredTasks }];
  }, []);

const PatientTasksListView = ({
  activeTab,
  patientLists,
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
  } = patientTasksSagaActions;

  const isListFlattened =
    areFiltersApplied ||
    !!taskSearch ||
    (!!sort?.key && !['PATIENT', 'SUBTASK_COUNT'].includes(sort.key));

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
          title="This patient has no tasks"
          description="Add tasks for this patient above."
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

  const filteredLists = taskSearch
    ? searchTaskInPatientLists(patientLists, taskSearch)
    : patientLists;

  return filteredLists?.length > 0
    ? filteredLists.map(list => (
        <TaskListDetailsDropdown
          key={list.taskListIdentifier}
          list={list}
          tasks={list.tasks}
          currentUser={currentUser}
          selectedTask={selectedTask}
          isCompleteTab={activeTab === TaskListTabName.COMPLETE}
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
          taskItemConfig={PATIENT_VIEW_COLUMNS_CONFIG}
        />
      ))
    : renderEmptyListView();
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
  patientLists: patientTaskListsSelector(state),
  activeTab: patientTaskListsActiveTabSelector(state),
  currentUser: userProfileSelector(state),
  selectedTask: state.taskState.selectedTask,
  taskSearch: patientTaskSearchSelector(state),
  areFiltersApplied: hasFiltersAppliedSelector(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientTasksListView);
