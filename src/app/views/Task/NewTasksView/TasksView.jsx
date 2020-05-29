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
  isFetchingMoreTasks,
  defaultGroupName,
  dragAndDropDisabled = false,
  listNameVisible = false,
  navigateToTab,
  taskCounters,
  createListGroup,
  quickAddTask,
  deleteGroup,
}) => {
  const selectedTab = routeParams.tabName || TaskListTabName.OPEN;
  const [searchValue, setSearchValue] = useState('');

  const { openDrawer } = taskDrawerActions;
  const {
    toggleTaskPriority,
    reorderTasksInGroup,
    reorderSubtasksForTask,
    toggleCompleteTask,
    reassignTasksToAnotherGroup,
    reassignTask,
    updateDueDate,
    updateWorkflowStatus,
    storeAsCurrentTask,
  } = taskActions;
  const { editTasksGroupName } = taskGroupActions;
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

  const toggleSingleTaskPriority = task => {
    toggleTaskPriority(
      task,
      task.priority === Priority.High ? Priority.Low : Priority.High,
    );
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

  const handleReassignTask = (taskIdentifier, userId) => {
    reassignTask(taskIdentifier, userId)
      .then(() => refreshTab())
      .catch(() => refreshTab());
  };

  const handleReassignTasksToAnotherGroup = (
    taskIdentifiers,
    taskGroupIdentifier,
  ) => {
    reassignTasksToAnotherGroup(taskIdentifiers, taskGroupIdentifier)
      .then(() => refreshTab())
      .catch(() => refreshTab());
  };

  const handleReorderSubtasksForTask = (
    orderedSubtaskIds,
    taskGroupIdentifier,
    parentTaskIdentifier,
  ) => {
    reorderSubtasksForTask(
      orderedSubtaskIds,
      taskGroupIdentifier,
      parentTaskIdentifier,
    )
      .then(() => refreshTab())
      .catch(() => refreshTab());
  };

  const handleReorderTasksInGroup = (
    newSourceTasksOrder,
    taskGroupIdentifier,
  ) => {
    reorderTasksInGroup(newSourceTasksOrder, taskGroupIdentifier)
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

  const filteredGroupsWithTasks = !searchValue
    ? groupedTasks
    : Object.keys(groupedTasks).reduce((groupObject, currentKey) => {
        const filteredTasks = groupedTasks[
          currentKey
        ].filter(({ description }) =>
          description.toLowerCase().includes(searchValue.toLowerCase()),
        );

        if (filteredTasks.length === 0) return groupObject;

        return { ...groupObject, [currentKey]: filteredTasks };
      }, {});

  const filteredGroupsList = !searchValue
    ? groupList
    : groupList.filter(
        ({ taskGroupIdentifier, groupType }) =>
          Object.keys(filteredGroupsWithTasks).includes(taskGroupIdentifier) ||
          Object.keys(filteredGroupsWithTasks).includes(groupType),
      );

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
        onSelectTab={navigateToTab}
        printData={{
          openedTasks,
          completedTasks,
          taskListMembers,
        }}
        selectedTab={selectedTab}
        showMembers={showMembers}
        taskList={taskList}
        openTasksAmount={taskCounters.incomplete}
        completedTasksAmount={taskCounters.complete}
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
          summaryTasksCount={taskCounters.complete}
          showMoreTasks={() => refreshTab(false, true)}
          isFetchingMoreTasks={isFetchingMoreTasks}
          updateDueDate={updateDueDate}
          listNameVisible={listNameVisible}
          isSearchApplied={!!searchValue}
        />
      ) : (
        <OpenedTasksView
          openDrawer={openDrawer}
          createTaskGroupList={createListGroup}
          currentUser={currentUser}
          toggleCompleteTask={toggleTaskCompletedStatus}
          storeAsCurrentTask={storeAsCurrentTask}
          groupedTasks={filteredGroupsWithTasks}
          toggleSingleTaskPriority={toggleSingleTaskPriority}
          editGroupName={editGroupName}
          quickAddTask={quickAddTask}
          deleteGroup={deleteGroup}
          changeGroupsOrder={changeGroupsOrder}
          groupList={filteredGroupsList}
          reorderTasksInGroup={handleReorderTasksInGroup}
          reorderSubtasksForTask={handleReorderSubtasksForTask}
          reassignTasksToAnotherGroup={handleReassignTasksToAnotherGroup}
          reassignTask={handleReassignTask}
          isFetchingData={
            (taskGroupList.isFetching && !taskGroupList.listInitialized) ||
            (isFetchingTasks && openedTasks?.length === 0)
          }
          members={members}
          updateDueDate={updateDueDate}
          updateWorkflowStatus={updateWorkflowStatus}
          defaultGroupName={defaultGroupName}
          dragAndDropDisabled={dragAndDropDisabled}
          listNameVisible={listNameVisible}
          isSearchApplied={!!searchValue}
        />
      )}
      <NewTaskDrawer modalActions={modalActions} />
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
  isCompletedTasksFetching: store.taskState.isCompletedTasksFetching,
  openedTasks: store.taskState.tasks,
  completedTasks: store.taskState.completedTasks,
  groupedTasks: groupTasksSelector(store.taskState.tasks),
  isFetchingMoreTasks: store.taskState.isFetchingMoreTasks,
  taskCounters: store.taskState.taskCounters,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
