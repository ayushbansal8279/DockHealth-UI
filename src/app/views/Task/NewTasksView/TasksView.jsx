/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';

import Toolbar from 'components/taskView/Toolbar/NewToolbarContainer';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

import { TaskViewContainer } from './styled';
import OpenedTasksView from './OpenedTasksView/OpenedTasksViewContainer';
import CompletedTasksView from './CompletedTasksView/CompletedTasksViewContainer';

const Priority = {
  High: 'HIGH',
  Low: 'LOW',
};

const TaskView = ({
  currentUser,
  members,
  taskDrawerActions,
  taskActions,
  modalActions,
  routeParams,
  refreshTab,
  listNameVisible = false,
  navigateToTab,
  taskCounters,
  // Only opened
  defaultGroupName,
  dragAndDropDisabled = false,
  createListGroup,
  quickAddTask,
  deleteGroup,
  editGroupName,
  changeGroupsOrder,
  // Only toolbar
  taskList = {},
  showNotificationAction = true,
  handleFilterChange,
}) => {
  const selectedTab = routeParams.tabName || TaskListTabName.OPEN;
  const [searchValue, setSearchValue] = useState('');

  const { openDrawer } = taskDrawerActions;
  const {
    toggleTaskPriority,
    toggleCompleteTask,
    reassignTask,
    updateDueDate,
    updateWorkflowStatus,
    storeAsCurrentTask,
  } = taskActions;

  // TODO: Move to routing logic
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

  // TODO: Move to saga
  const toggleSingleTaskPriority = task => {
    toggleTaskPriority(
      task,
      task.priority === Priority.High ? Priority.Low : Priority.High,
    );
  };

  // TODO: Move to saga
  const invokeToggleCompleteAction = task => {
    toggleCompleteTask(task, selectedTab, currentUser)
      .then(() => refreshTab())
      .catch(() => refreshTab());
  };

  // TODO: Move to saga
  const handleReassignTask = (taskIdentifier, userId) => {
    reassignTask(taskIdentifier, userId)
      .then(() => refreshTab())
      .catch(() => refreshTab());
  };

  // TODO: Move to saga
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

  return (
    <TaskViewContainer>
      <Toolbar
        members={members}
        onSelectTab={navigateToTab}
        selectedTab={selectedTab}
        taskList={taskList}
        openTasksAmount={taskCounters.incomplete}
        completedTasksAmount={taskCounters.complete}
        onSearchChange={setSearchValue}
        showNotifications={showNotificationAction}
        searchValue={searchValue}
        onSelectFilters={handleFilterChange}
      />
      {selectedTab === TaskListTabName.COMPLETE ? (
        <CompletedTasksView
          openDrawer={openDrawer}
          storeAsCurrentTask={storeAsCurrentTask}
          currentUser={currentUser}
          toggleSingleTaskPriority={toggleSingleTaskPriority}
          toggleCompleteTask={toggleTaskCompletedStatus}
          summaryTasksCount={taskCounters.complete}
          reassignTask={handleReassignTask}
          showMoreTasks={() => refreshTab(false, true)}
          updateDueDate={updateDueDate}
          listNameVisible={listNameVisible}
          searchValue={searchValue}
        />
      ) : (
        <OpenedTasksView
          openDrawer={openDrawer}
          createTaskGroupList={createListGroup}
          currentUser={currentUser}
          toggleCompleteTask={toggleTaskCompletedStatus}
          storeAsCurrentTask={storeAsCurrentTask}
          toggleSingleTaskPriority={toggleSingleTaskPriority}
          editGroupName={editGroupName}
          quickAddTask={quickAddTask}
          deleteGroup={deleteGroup}
          changeGroupsOrder={changeGroupsOrder}
          reassignTask={handleReassignTask}
          updateDueDate={updateDueDate}
          updateWorkflowStatus={updateWorkflowStatus}
          defaultGroupName={defaultGroupName}
          dragAndDropDisabled={dragAndDropDisabled}
          listNameVisible={listNameVisible}
          searchValue={searchValue}
        />
      )}
      <NewTaskDrawer modalActions={modalActions} />
    </TaskViewContainer>
  );
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
});

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
  taskCounters: store.taskState.taskCounters,
  selectedTask: store.taskState.selectedTask,
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
