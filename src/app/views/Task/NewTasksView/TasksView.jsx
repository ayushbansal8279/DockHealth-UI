/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect, useCallback } from 'react';
import { useMount } from 'react-use';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TaskDrawerActions from 'actions/task-drawer-actions';
import * as TaskActions from 'actions/task-actions';
import { setHeader } from 'actions/header-actions';
import * as ModalActions from 'modal/actions';

import Toolbar from 'components/taskView/Toolbar/NewToolbarContainer';
import NewTaskDrawer from 'components/taskView/newTaskDrawer/NewTaskDrawer';
import Header from 'components/taskView/Header';
import GenericHeader from 'components/common/GenericHeader';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

import {
  tasksIsFetchingSelector,
  completedTasksIsFetchingSelector,
} from 'selectors/task-selectors';
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
  showMembers = true,
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
  hasTitle = true,
  title,
  isSpecialList,
  dispatchedSetHeader,
  selectedTask,
  isMainListView = false,
  listUniqueKey,
  pdfTitle,
  groupPagination = false,
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

  const resetHeader = useCallback(() => {
    const headerComponent = isSpecialList ? (
      <GenericHeader>{title}</GenericHeader>
    ) : (
      <Header
        isFetching={false}
        title={title}
        taskList={taskList}
        resetHeader={resetHeader}
        hasTitle={hasTitle}
      />
    );

    if (title) {
      dispatchedSetHeader({
        layout: [
          {
            key: 'header',
            component: headerComponent,
            xs: 12,
          },
        ],
      });
    }
  }, [taskList, hasTitle, title, isSpecialList, dispatchedSetHeader]);

  useMount(() => {
    resetHeader();
  });

  useEffect(() => {
    if (taskList?.taskListIdentifier) {
      resetHeader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskList]);

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
  const handleReassignTask = (task, assignee) => {
    reassignTask(task.taskIdentifier, assignee?.userIdentifier)
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
      {(taskCounters?.incomplete > 0 || taskCounters?.complete > 0) && (
        <Toolbar
          members={members}
          showMembers={showMembers}
          onSelectTab={navigateToTab}
          selectedTab={selectedTab}
          taskList={taskList}
          openTasksAmount={taskCounters.incomplete}
          completedTasksAmount={taskCounters.complete}
          onSearchChange={setSearchValue}
          showNotifications={showNotificationAction}
          searchValue={searchValue}
          onSelectFilters={handleFilterChange}
          listNameColumnVisible={listNameVisible}
          pdfTitle={pdfTitle}
        />
      )}
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
          selectedTask={selectedTask}
          listUniqueKey={listUniqueKey}
          groupPagination={groupPagination}
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
          selectedTask={selectedTask}
          isMainListView={isMainListView}
          listUniqueKey={listUniqueKey}
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
  dispatchedSetHeader: setHeader(dispatch),
});

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
  taskCounters: store.listTasks.taskCounters,
  selectedTask: store.taskState.selectedTask,
  isFetching: tasksIsFetchingSelector(store),
  isCompletedTasksFetching: completedTasksIsFetchingSelector(store),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
