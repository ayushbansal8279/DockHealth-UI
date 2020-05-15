/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskGroupActions from 'actions/task-group-list-actions';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { groupTasksSelector } from 'selectors/task-group-list-selectors';
import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';

import { TaskViewContainer, TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';
import GroupNameSection from './GroupNameSection/GroupNameSection';
import messages from './AddGroupNameButton/messages';
import AddGroupNameButton from './AddGroupNameButton/AddGroupNameButton';
import EmptyTasksView from './EmptyTasksView/EmptyTasksView';
import TasksViewLoader from './TasksViewLoader/TasksViewLoader';

const Priority = {
  High: 'HIGH',
  Low: 'LOW',
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
  taskGroupActions,
  taskGroupList,
  taskList = {},
  taskListMembers,
  isFetchingTasks,
  groupedTasks,
  tasks, // to do- remove tasks prop
}) => {
  const { openDrawer } = taskDrawerActions;
  const { toggleTaskPriority, saveTask } = taskActions;
  const {
    createTaskGroupList,
    editTasksGroupName,
    deleteTasksGroup,
  } = taskGroupActions;
  const { taskListIdentifier } = taskList;
  const [selectedTab, onSelectTab] = useState('OPEN_TASKS');
  const { groupList } = taskGroupList;

  const quickAddTask = (taskName, reloadGroups = false) => {
    if (taskName) {
      saveTask(
        {
          description: taskName,
          taskListIdentifier,
        },
        reloadGroups,
      );
    }
  };

  const toggleSingleTaskPriority = task => {
    toggleTaskPriority(
      task,
      task.priority === Priority.High ? Priority.Low : Priority.High,
    );
  };

  const deleteGroup = groupId => {
    // TODO: add confirmation modal
    deleteTasksGroup(groupId, taskListIdentifier);
  };

  const editGroupName = (newGroupName, groupId) => {
    if (newGroupName) {
      editTasksGroupName(taskListIdentifier, groupId, newGroupName);
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
        isFetchingData={
          (taskGroupList.isFetching && !taskGroupList.listInitialized) ||
          isFetchingTasks
        }
      >
        {tasks.length > 0 ? (
          <TaskGroupsContainer>
            {groupList?.map(
              ({ groupName, taskGroupIdentifier, groupType }, i) => (
                <TasksGroup
                  key={taskGroupIdentifier}
                  isDefaultGroup={groupType === TASKGROUP_DEFAULT_TYPE}
                  groupId={taskGroupIdentifier}
                  currentUser={currentUser}
                  groupName={
                    groupType !== TASKGROUP_DEFAULT_TYPE
                      ? groupName
                      : 'NEW TASKS'
                  }
                  markComplete={markComplete}
                  openDrawer={openDrawer}
                  storeAsCurrentTask={storeAsCurrentTask}
                  toggleTaskPriority={toggleSingleTaskPriority}
                  editGroupName={editGroupName}
                  quickAddTask={quickAddTask}
                  deleteGroup={deleteGroup}
                  isFirstGroup={i === 0}
                  isLastGroup={i === groupList?.length - 1}
                  tasks={
                    groupedTasks[
                      groupType !== TASKGROUP_DEFAULT_TYPE
                        ? taskListIdentifier
                        : TASKGROUP_DEFAULT_TYPE
                    ] || []
                  }
                />
              ),
            )}
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
          <EmptyTasksView
            quickAddTask={groupName => quickAddTask(groupName, true)}
          />
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
  isFetchingTasks: store.taskState.isFetching,
  groupedTasks: groupTasksSelector(store.taskState.tasks),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
