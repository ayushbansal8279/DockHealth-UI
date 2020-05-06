import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setHeader } from 'actions/header-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskDrawerActions from 'actions/task-drawer-actions';

import Toolbar from 'components/taskView/Toolbar/NewToolbar';

const TaskView = ({
  // taskCountStats,
  taskList,
  tasks,
  completedTasks,
  taskListMembers,
  members,
  membersNotInTaskList,
  isSpecialList,
  showMembers = true,
}) => {
  const [selectedTab, onSelectTab] = useState(null);
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
      }}
    >
      <Toolbar
        isSpecialList={isSpecialList}
        members={members}
        membersNotInTaskList={membersNotInTaskList}
        onSelectTab={onSelectTab}
        printData={{
          tasks,
          completedTasks,
          taskListMembers,
        }}
        selectedTab={selectedTab}
        showMembers={showMembers}
        taskList={taskList}
      />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  dispatchedSetHeader: setHeader(dispatch),
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
});

const mapStateToProps = store => ({
  selectedTask: store.taskState.selectedTask,
  currentUser: store.userState.userProfile,
  currentPatientId: store.patient?.details?.patientIdentifier,
  taskDrawerOpen: store.taskDrawerState?.open,
  addingNewTask: store.taskState.addingNewTask,
  addingNewSubtask: store.taskState.addingNewSubtask,
  subscription: store.organizationState?.organization?.subscriptionDetails,
  taskCountStats: store.taskState?.taskCountStats,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
