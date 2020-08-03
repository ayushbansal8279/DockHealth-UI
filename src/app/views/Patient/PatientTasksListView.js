import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TaskListDetailsDropdown from 'views/Patient/TaskListDetailsDropdown/TaskListDetailsDropdown';
import EmptyTaskListBird from 'img/animals/bird';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import { PatientTasksSagaActions } from 'sagas/patient-tasks-saga';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import {
  patientTaskListsSelector,
  patientTaskListsActiveTabSelector,
  patientTaskSearchSelector,
} from 'selectors/patient-tasks-selectors';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import EmptyListViewWithQuickAddTask from 'components/tasklist/EmptyListView/EmptyListViewWithQuickAddTask';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import { getTaskListForUser } from 'api/tasklist-api';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';

const searchTaskInPatientLists = (patientLists, searchValue) =>
  patientLists.reduce((accumulator, currentValue) => {
    const filteredTasks = currentValue.tasks.filter(({ description }) =>
      description.toLowerCase().includes(searchValue.toLowerCase()),
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
}) => {
  const { openDrawer } = taskDrawerActions;
  const { storeAsCurrentTask } = taskActions;
  const {
    togglePatientTaskStatus,
    togglePatientTaskPriority,
    reassignPatientTask,
    updatePatientTaskDueDate,
    updatePatientTaskWorkflowStatus,
    quickAddPatientTask,
    inviteUserToTaskList,
    removeUserFromTaskList,
    cancelUserInviteToTaskList,
    changeMemberRole,
  } = patientTasksSagaActions;

  const handleQuickAddTask = taskName => {
    modalActions.openModal('ListPicker', {
      fetchMethod: getTaskListForUser,
      confirm: taskListIdentifier =>
        quickAddPatientTask(taskName, taskListIdentifier),
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
          toggleTaskPriority={togglePatientTaskPriority}
          reassignTask={reassignPatientTask}
          updateDueDate={updatePatientTaskDueDate}
          updateWorkflowStatus={updatePatientTaskWorkflowStatus}
          quickAddTask={quickAddPatientTask}
          cancelInviteToTaskList={cancelUserInviteToTaskList}
          removeUserFromTaskList={removeUserFromTaskList}
          inviteUserToTaskList={inviteUserToTaskList}
          changeUserRoleForList={changeMemberRole}
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
