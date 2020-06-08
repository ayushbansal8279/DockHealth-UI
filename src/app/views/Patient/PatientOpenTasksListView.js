import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TaskListDetailsDropdown from 'components/tasklist/TaskListDetailsDropdown/TaskListDetailsDropdown';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';

const PatientOpenTasksListView = ({
  patientLists,
  currentUser,
  selectedTask,
  taskDrawerActions,
  taskActions,
}) => {
  const { openDrawer } = taskDrawerActions;
  const { storeAsCurrentTask } = taskActions;

  console.log('lists', patientLists);
  return patientLists.map(list => (
    <TaskListDetailsDropdown
      key={list.taskListIdentifier}
      listName={list.listName}
      tasks={list.tasks}
      currentUser={currentUser}
      selectedTask={selectedTask}
      openDrawer={openDrawer}
      storeAsCurrentTask={storeAsCurrentTask}
    />
  ));
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
});

const mapStateToProps = store => ({
  patientLists: store.patientTasks.lists,
  currentUser: store.userState.userProfile,
  selectedTask: store.taskState.selectedTask,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientOpenTasksListView);
