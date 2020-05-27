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
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import { groupTasksSelector } from 'selectors/task-group-list-selectors';
import { arrayMove } from 'helpers/sorting-helper';

import { TaskViewContainer } from './styled';
import OpenedTasksView from './OpenedTasksView';
import CompletedTasksView from './CompletedTasksView';

const Priority = {
  High: 'HIGH',
  Low: 'LOW',
};

const TaskView = ({
  currentUser,
  isSpecialList,
  members,
  membersNotInTaskList,
  showMembers = true,
  taskDrawerActions,
  taskActions,
  taskGroupActions,
  modalActions,
  taskGroupList,
  taskList = {},
  taskListMembers,
  isFetchingTasks,
  isCompletedTasksFetching,
  openedTasks,
  completedTasks,
  groupedTasks,
  routeParams,
  refreshTab,
  listStats,
  isFetchingMoreTasks,
  defaultGroupName,
  canEditGroups = true,
  quickAddTaskVisible = true,
  dragAndDropDisabled = false,
  listNameVisible = false,
  navigateToTab,
}) => {
  const selectedTab = routeParams.tabName || TaskListTabName.OPEN;
  const [searchValue, setSearchValue] = useState('');

  const { openDrawer } = taskDrawerActions;
  const {
    toggleTaskPriority,
    saveTask,
    reorderTasksInGroup,
    reorderSubtasksForTask,
    toggleCompleteTask,
    reassignTasksToAnotherGroup,
    reassignTask,
    updateDueDate,
    updateWorkflowStatus,
    storeAsCurrentTask,
  } = taskActions;
  const {
    createTaskGroupList,
    editTasksGroupName,
    deleteTasksGroup,
  } = taskGroupActions;
  const { taskListIdentifier } = taskList;
  const { groupList } = taskGroupList;

  const handleTabsNavigation = routeParameters => {
    switch (routeParameters.tabName) {
      case TaskListTabName.COMPLETE:
        break;
      case undefined:
      case TaskListTabName.OPEN:
        break;
      default:
        navigateToTab(TaskListTabName.OPEN);
    }
  };

  handleTabsNavigation(routeParams);

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

  const invokeToggleCompleteAction = task => {
    toggleCompleteTask(task, selectedTab, currentUser)
      .then(() => refreshTab())
      .catch(() => refreshTab());
  };

  const toggleTaskCompletedStatus = task => {
    const hasIncompletedSubtasks = task.subtasks.find(
      subtask => subtask.status === 'INCOMPLETE',
    );
    if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
      const modalProps = {
        confirm: () => {
          modalActions.closeModal();
          invokeToggleCompleteAction(task);
        },
      };
      modalActions.openModal('CompleteAllTasks', modalProps);
    } else {
      invokeToggleCompleteAction(task);
    }
  };

  const completedTaskCount = listStats?.find?.(
    ({ metricName, taskListIdentifier: metricTaskListIdentifier }) =>
      metricName === 'Completed_TaskList_Count' &&
      metricTaskListIdentifier === taskListIdentifier,
  )?.metricValue;

  const openTaskCount = listStats?.find?.(
    ({ metricName, taskListIdentifier: metricTaskListIdentifier }) =>
      metricName === 'Incomplete_TaskList_Count' &&
      metricTaskListIdentifier === taskListIdentifier,
  )?.metricValue;

  const filteredGroups = !searchValue
    ? groupedTasks
    : Object.keys(groupedTasks).reduce((groupObject, currentKey) => {
        const filteredTasks = groupedTasks[
          currentKey
        ].filter(({ description }) =>
          description.toLowerCase().includes(searchValue.toLowerCase()),
        );
        return { ...groupObject, [currentKey]: filteredTasks };
      }, {});

  const filteredCompletedTasks = !searchValue
    ? completedTasks
    : completedTasks.filter(({ description }) =>
        description.toLowerCase().includes(searchValue.toLowerCase()),
      );

  return (
    <TaskViewContainer>
      <Toolbar
        isSpecialList={isSpecialList}
        members={members}
        membersNotInTaskList={membersNotInTaskList}
        onSelectTab={tabName => navigateToTab(tabName)}
        printData={{
          openedTasks,
          completedTasks,
          taskListMembers,
        }}
        selectedTab={selectedTab}
        showMembers={showMembers}
        taskList={taskList}
        openTasksAmount={openTaskCount}
        completedTasksAmount={completedTaskCount}
        onSearchChange={setSearchValue}
        searchValue={searchValue}
      />
      {selectedTab === TaskListTabName.COMPLETE ? (
        <CompletedTasksView
          openDrawer={openDrawer}
          storeAsCurrentTask={storeAsCurrentTask}
          currentUser={currentUser}
          toggleSingleTaskPriority={toggleSingleTaskPriority}
          toggleCompleteTask={toggleTaskCompletedStatus}
          tasks={filteredCompletedTasks}
          isFetchingData={isCompletedTasksFetching}
          summaryTasksCount={completedTaskCount}
          showMoreTasks={() => refreshTab(false, true)}
          isFetchingMoreTasks={isFetchingMoreTasks}
          updateDueDate={updateDueDate}
          listNameVisible={listNameVisible}
        />
      ) : (
        <OpenedTasksView
          openDrawer={openDrawer}
          createTaskGroupList={groupName =>
            createTaskGroupList({ groupName, taskListIdentifier })
          }
          currentUser={currentUser}
          toggleCompleteTask={toggleTaskCompletedStatus}
          storeAsCurrentTask={storeAsCurrentTask}
          groupedTasks={filteredGroups}
          toggleSingleTaskPriority={toggleSingleTaskPriority}
          editGroupName={editGroupName}
          quickAddTask={quickAddTask}
          openDeleteConfirmationModal={openDeleteConfirmationModal}
          changeGroupsOrder={changeGroupsOrder}
          groupList={groupList}
          reorderTasksInGroup={reorderTasksInGroup}
          reorderSubtasksForTask={reorderSubtasksForTask}
          reassignTasksToAnotherGroup={reassignTasksToAnotherGroup}
          reassignTask={reassignTask}
          taskListIdentifier={taskListIdentifier}
          tasksCount={openedTasks?.length}
          isFetchingData={
            (taskGroupList.isFetching && !taskGroupList.listInitialized) ||
            (isFetchingTasks && openedTasks?.length === 0)
          }
          members={members}
          updateDueDate={updateDueDate}
          updateWorkflowStatus={updateWorkflowStatus}
          defaultGroupName={defaultGroupName}
          canEditGroups={canEditGroups}
          quickAddTaskVisible={quickAddTaskVisible}
          dragAndDropDisabled={dragAndDropDisabled}
          listNameVisible={listNameVisible}
        />
      )}
      <NewTaskDrawer
        members={members}
        membersNotInTaskList={membersNotInTaskList}
        taskList={taskList}
        modalActions={modalActions}
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
  listStats: store.taskListState?.taskListStats?.stats,
  currentUser: store.userState.userProfile,
  taskGroupList: store.taskGroupList,
  isFetchingTasks: store.taskState.isFetching,
  isCompletedTasksFetching: store.taskState.isCompletedTasksFetching,
  openedTasks: store.taskState.tasks,
  completedTasks: store.taskState.completedTasks,
  groupedTasks: groupTasksSelector(store.taskState.tasks),
  isFetchingMoreTasks: store.taskState.isFetchingMoreTasks,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
