import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { TaskViewContainer, TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';

const quickAddTask = taskName => {
  // TODO: connect to backend endpoint
  console.log('task name:', taskName);
};

const TaskView = ({
  completedTasks,
  currentUser,
  isSpecialList,
  markComplete,
  members,
  membersNotInTaskList,
  showMembers = true,
  storeAsCurrentTask,
  taskDrawerActions,
  taskActions,
  taskList = {},
  taskListMembers,
  tasks,
}) => {
  const { listName } = taskList;
  const { openDrawer } = taskDrawerActions;
  const { toggleTaskPriority } = taskActions;
  const [selectedTab, onSelectTab] = useState('OPEN_TASKS');

  const toggleSingleTaskPriority = task => {
    toggleTaskPriority(task, currentUser.userIdentifier, task.priority);
  };

  return (
    <TaskViewContainer>
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
      <TaskGroupsContainer>
        <TasksGroup
          currentUser={currentUser}
          groupName={listName}
          markComplete={markComplete}
          openDrawer={openDrawer}
          storeAsCurrentTask={storeAsCurrentTask}
          toggleTaskPriority={toggleSingleTaskPriority}
          quickAddTask={quickAddTask}
          tasks={tasks}
        />
      </TaskGroupsContainer>
      <NewTaskDrawer
        members={members}
        membersNotInTaskList={membersNotInTaskList}
        taskList={taskList}
      />
    </TaskViewContainer>
  );
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
});

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
