/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskGroupActions from 'actions/task-group-list-actions';
import * as ModalActions from 'modal/actions';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { groupTasksSelector } from 'selectors/task-group-list-selectors';
import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
import { arrayMove } from 'helpers/sorting-helper';

import TasksGroup from './TasksGroup/TasksGroup';
import GroupNameSection from './GroupNameSection/GroupNameSection';
import messages from './AddGroupNameButton/messages';
import AddGroupNameButton from './AddGroupNameButton/AddGroupNameButton';
import EmptyTasksView from './EmptyTasksView/EmptyTasksView';
import TasksViewLoader from './TasksViewLoader/TasksViewLoader';
import { TaskViewContainer, TaskGroupsContainer } from './styled';

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
  modalActions,
  taskGroupList,
  taskList = {},
  taskListMembers,
  isFetchingTasks,
  groupedTasks,
  tasks, // to do- remove tasks prop
}) => {
  const { openDrawer } = taskDrawerActions;
  const { toggleTaskPriority, saveTask, reorderTasksInGroup } = taskActions;
  const {
    createTaskGroupList,
    editTasksGroupName,
    deleteTasksGroup,
  } = taskGroupActions;
  const { taskListIdentifier } = taskList;
  const [selectedTab, onSelectTab] = useState('OPEN_TASKS');
  const { groupList } = taskGroupList;

  const quickAddTask = (
    taskName,
    taskGroupIdentifier,
    reloadGroups = false,
  ) => {
    if (taskName) {
      const payload = {
        description: taskName,
        taskListIdentifier,
        taskGroupIdentifier,
      };

      saveTask(payload, reloadGroups);
    }
  };

  const toggleSingleTaskPriority = task => {
    toggleTaskPriority(
      task,
      task.priority === Priority.High ? Priority.Low : Priority.High,
    );
  };

  const deleteGroup = groupId => {
    modalActions.closeModal();
    deleteTasksGroup(groupId, taskListIdentifier);
  };

  const openDeleteConfirmationModal = groupId => {
    const modalProps = {
      confirm: () => deleteGroup(groupId),
    };
    modalActions.openModal('DeleteGroup', modalProps);
  };

  const editGroupName = (newGroupName, groupId) => {
    if (newGroupName) {
      editTasksGroupName(taskListIdentifier, groupId, newGroupName);
    }
  };

  const changeTaskOrder = (oldTaskIndex, newTaskIndex) => {
    if (newTaskIndex < 0 || newTaskIndex >= groupList.length) {
      return;
    }
    const groupIdsList = groupList.map(group => group.taskGroupIdentifier);
    const newGroupList = arrayMove(groupIdsList, oldTaskIndex, newTaskIndex);
    taskGroupActions.sortTaskGroups(newGroupList, taskListIdentifier);
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
                  reorderTasksInGroup={reorderTasksInGroup}
                  taskListIdentifier={taskListIdentifier}
                  markComplete={markComplete}
                  openDrawer={openDrawer}
                  storeAsCurrentTask={storeAsCurrentTask}
                  toggleTaskPriority={toggleSingleTaskPriority}
                  editGroupName={editGroupName}
                  quickAddTask={quickAddTask}
                  deleteGroup={openDeleteConfirmationModal}
                  moveGroupUp={() => changeTaskOrder(i, i - 1)}
                  moveGroupDown={() => changeTaskOrder(i, i + 1)}
                  isFirstGroup={i === 0}
                  isLastGroup={i === groupList?.length - 1}
                  tasks={
                    groupedTasks[
                      groupType !== TASKGROUP_DEFAULT_TYPE
                        ? taskGroupIdentifier
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
            quickAddTask={groupName => quickAddTask(groupName, null, true)}
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
  modalActions: bindActionCreators(ModalActions, dispatch),
});

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
  taskGroupList: store.taskGroupList,
  isFetchingTasks: store.taskState.isFetching,
  groupedTasks: groupTasksSelector(store.taskState.tasks),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
