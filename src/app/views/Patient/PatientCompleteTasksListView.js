import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TaskListDetailsDropdown from 'components/tasklist/TaskListDetailsDropdown/TaskListDetailsDropdown';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import { PatientTasksActions } from 'sagas/patient-tasks';

const PatientCompleteTasksListView = ({
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
    toggleTaskStatus,
    toggleTaskPriority,
    reassignTask,
  } = patientTasksActions;

  return patientLists.map(list => (
    <TaskListDetailsDropdown
      key={list.taskListIdentifier}
      list={list}
      tasks={list.tasks}
      currentUser={currentUser}
      isCompleteTab
      selectedTask={selectedTask}
      openDrawer={openDrawer}
      storeAsCurrentTask={storeAsCurrentTask}
      toggleTaskStatus={toggleTaskStatus}
      toggleTaskPriority={toggleTaskPriority}
      reassignTask={reassignTask}
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
  currentUser: store.userState.userProfile,
  selectedTask: store.taskState.selectedTask,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientCompleteTasksListView);
