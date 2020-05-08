import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { TaskViewContainer, TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';

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
  taskList = {},
  taskListMembers,
  tasks,
}) => {
  const { listName } = taskList;
  const { openDrawer } = taskDrawerActions;
  const [selectedTab, onSelectTab] = useState('OPEN_TASKS');
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
});

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
