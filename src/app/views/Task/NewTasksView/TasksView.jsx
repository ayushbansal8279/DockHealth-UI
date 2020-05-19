/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskGroupActions from 'actions/task-group-list-actions';
import * as ModalActions from 'modal/actions';
import Toolbar from 'components/taskView/Toolbar/NewToolbar';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { TasksStatus } from 'components/taskView/Toolbar/config';
import { groupTasksSelector } from 'selectors/task-group-list-selectors';
import { arrayMove } from 'helpers/sorting-helper';

import { TaskViewContainer } from './styled';
import TasksViewLoader from './TasksViewLoader/TasksViewLoader';
import OpenedTasksView from './OpenedTasksView';
import CompletedTasksView from './CompletedTasksView';

const Priority = {
  High: 'HIGH',
  Low: 'LOW',
};

const navigateToTab = ({ tabName, taskListIdentifier }) => {
  hashHistory.push(
    `/tasks/${taskListIdentifier}${
      tabName === TasksStatus.OPEN ? '' : `/${TasksStatus.COMPLETE}`
    }`,
  );
};

const handleTabsNavigation = routeParameters => {
  switch (routeParameters.tabName) {
    case TasksStatus.COMPLETE:
      break;
    case undefined:
    case TasksStatus.OPEN:
      break;
    default:
      navigateToTab({ ...routeParameters, tabName: TasksStatus.OPEN });
  }
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
  taskState,
  routeParams,
}) => {
  handleTabsNavigation(routeParams);
  const selectedTab = routeParams.tabName || TasksStatus.OPEN;

  const { openDrawer } = taskDrawerActions;
  const {
    toggleTaskPriority,
    saveTask,
    reorderTasksInGroup,
    reorderSubtasksForTask,
  } = taskActions;
  const {
    createTaskGroupList,
    editTasksGroupName,
    deleteTasksGroup,
  } = taskGroupActions;
  const { taskListIdentifier } = taskList;
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

  const changeGroupsOrder = (oldTaskIndex, newTaskIndex) => {
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
        onSelectTab={tabName => navigateToTab({ ...routeParams, tabName })}
        printData={{
          tasks,
          completedTasks,
          taskListMembers,
        }}
        selectedTab={selectedTab}
        showMembers={showMembers}
        taskList={taskList}
        openTasksAmount={tasks?.length}
        completedTasksAmount={taskState.taskCountStats?.length}
      />
      <TasksViewLoader
        isFetchingData={
          (taskGroupList.isFetching && !taskGroupList.listInitialized) ||
          isFetchingTasks
        }
      >
        {selectedTab === TasksStatus.COMPLETE ? (
          <CompletedTasksView
            openDrawer={openDrawer}
            storeAsCurrentTask={storeAsCurrentTask}
            currentUser={currentUser}
            tasks={tasks}
            toggleSingleTaskPriority={toggleSingleTaskPriority}
          />
        ) : (
          <OpenedTasksView
            openDrawer={openDrawer}
            createTaskGroupList={groupName =>
              createTaskGroupList({ groupName, taskListIdentifier })
            }
            currentUser={currentUser}
            markComplete={markComplete}
            storeAsCurrentTask={storeAsCurrentTask}
            groupedTasks={groupedTasks}
            toggleSingleTaskPriority={toggleSingleTaskPriority}
            editGroupName={editGroupName}
            quickAddTask={quickAddTask}
            openDeleteConfirmationModal={openDeleteConfirmationModal}
            changeGroupsOrder={changeGroupsOrder}
            tasks={tasks}
            groupList={groupList}
            reorderTasksInGroup={reorderTasksInGroup}
            reorderSubtasksForTask={reorderSubtasksForTask}
            taskListIdentifier={taskListIdentifier}
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
  taskState: store.taskState,
  groupedTasks: groupTasksSelector(store.taskState.tasks),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
