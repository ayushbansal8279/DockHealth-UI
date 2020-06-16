import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TaskListDetailsDropdown from 'components/tasklist/TaskListDetailsDropdown/TaskListDetailsDropdown';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import { PatientTasksSagaActions } from 'sagas/patient-tasks';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import {
  patientTaskListsSelector,
  patientTaskListsActiveTabSelector,
  patientTaskSearchSelector,
} from 'selectors/patient-tasks-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import PatientEmptyList from './PatientEmptyList/PatientEmptyList';

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
  } = patientTasksSagaActions;

  const renderEmptyListView = () => {
    if (taskSearch)
      return (
        <PatientEmptyList>
          No results were found for your search
        </PatientEmptyList>
      );

    return <PatientEmptyList>This patient has no tasks</PatientEmptyList>;
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientTasksListView);
