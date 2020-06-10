import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TaskListDetailsDropdown from 'components/tasklist/TaskListDetailsDropdown/TaskListDetailsDropdown';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import { PatientTasksActions } from 'sagas/patient-tasks';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

const PatientTasksListView = ({
  activeTab,
  patientLists,
  currentUser,
  selectedTask,
  taskDrawerActions,
  taskActions,
  patientTasksActions,
  modalActions,
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
  } = patientTasksActions;

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

  return patientLists.map(list => (
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
  ));
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  patientTasksActions: bindActionCreators(PatientTasksActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
});

const mapStateToProps = store => ({
  patientLists: store.patientTasks.lists,
  activeTab: store.patientTasks.activeTab,
  currentUser: store.userState.userProfile,
  selectedTask: store.taskState.selectedTask,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientTasksListView);
