import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskGroupActions from 'actions/task-group-list-actions';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';

import { TaskViewContainer, TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';
import GroupNameSection from './GroupNameSection/GroupNameSection';
import messages from './AddGroupNameButton/messages';
import AddGroupNameButton from './AddGroupNameButton/AddGroupNameButton';
import EmptyTasksView from './EmptyTasksView/EmptyTasksView';
import TasksViewLoader from './TasksViewLoader/TasksViewLoader';

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
  taskGroupActions,
  taskGroupList,
  taskList = {},
  taskListMembers,
  taskState,
  tasks, // to do- remove tasks prop
}) => {
  const { openDrawer } = taskDrawerActions;
  const { toggleTaskPriority } = taskActions;
  const {
    createTaskGroupList,
    editTasksGroupName,
    deleteTasksGroup,
  } = taskGroupActions;
  const { taskListIdentifier } = taskList;
  const [selectedTab, onSelectTab] = useState('OPEN_TASKS');
  const { groupList } = taskGroupList;

  const quickAddTask = taskName => {
    if (taskName) {
      taskActions.saveTask({
        description: taskName,
        taskListIdentifier: taskList.taskListIdentifier,
      });
    }
  };

  const toggleSingleTaskPriority = task => {
    toggleTaskPriority(task, currentUser.userIdentifier, task.priority);
  };

  const deleteGroup = groupId => {
    // TODO: add confirmation modal
    deleteTasksGroup(groupId, taskList.taskListIdentifier);
  };

  const editGroupName = (newGroupName, groupId) => {
    if (newGroupName) {
      editTasksGroupName(taskList.taskListIdentifier, groupId, newGroupName);
    }
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
      <TasksViewLoader
        isFetchingData={taskGroupList.isFetching || taskState.isFetching}
      >
        {tasks.length > 0 ? (
          <TaskGroupsContainer>
            {groupList?.map(({ groupName, taskGroupIdentifier }) => (
              <TasksGroup
                key={taskGroupIdentifier}
                groupId={taskGroupIdentifier}
                currentUser={currentUser}
                groupName={groupName}
                markComplete={markComplete}
                openDrawer={openDrawer}
                storeAsCurrentTask={storeAsCurrentTask}
                toggleTaskPriority={toggleSingleTaskPriority}
                editGroupName={editGroupName}
                quickAddTask={quickAddTask}
                deleteGroup={deleteGroup}
                tasks={[]} // to do - replace by real data
              />
            ))}
            <GroupNameSection
              onEnterClick={groupName =>
                createTaskGroupList({ groupName, taskListIdentifier })
              }
              placeholder={messages.placeholder}
              closeOnEnter
            >
              <AddGroupNameButton />
            </GroupNameSection>
          </TaskGroupsContainer>
        ) : (
          <EmptyTasksView quickAddTask={quickAddTask} />
        )}
      </TasksViewLoader>
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
  taskGroupActions: bindActionCreators(TaskGroupActions, dispatch),
});

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
  taskGroupList: store.taskGroupList,
  taskState: store.taskState,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
