import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TaskListDetailsDropdown from 'components/tasklist/TaskListDetailsDropdown/TaskListDetailsDropdown';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
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
}) => {
  const { openDrawer } = taskDrawerActions;
  const { storeAsCurrentTask } = taskActions;
  const {
    togglePatientTaskStatus,
    togglePatientTaskPriority,
    reassignPatientTask,
    updatePatientTaskDueDate,
    updatePatientTaskWorkflowStatus,
  } = patientTasksActions;

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
      toggleTaskStatus={togglePatientTaskStatus}
      toggleTaskPriority={togglePatientTaskPriority}
      reassignTask={reassignPatientTask}
      updateDueDate={updatePatientTaskDueDate}
      updateWorkflowStatus={updatePatientTaskWorkflowStatus}
    />
  ));
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  patientTasksActions: bindActionCreators(PatientTasksActions, dispatch),
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
