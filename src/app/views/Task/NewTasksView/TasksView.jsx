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
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';

import {
  tasksIsFetchingSelector,
  completedTasksIsFetchingSelector,
} from 'selectors/task-selectors';
import { TaskViewContainer } from './styled';
import OpenedTasksView from './OpenedTasksView/OpenedTasksViewContainer';
import CompletedTasksView from './CompletedTasksView/CompletedTasksViewContainer';
import { InboxHelpPanel } from '../TaskView.InboxElements';

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
  selectedTask,
  isMainListView = false,
  listUniqueKey,
  pdfTitle,
  groupPagination = false,
  drawerAutoOpenEnabled = false,
  isFetching,
  isCompletedTasksFetching,
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
      .then(() => {
        setTimeout(refreshTab, TASK_DISAPPEAR_DELAY);
      })
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

  const getTipsContent = () => {
    if (taskList?.listType === 'INBOX') {
      return InboxHelpPanel;
    }

    return null;
  };

  return (
    <>
      <TaskViewContainer>
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
          tipsContent={getTipsContent()}
          isFetching={isFetching || isCompletedTasksFetching}
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
            taskCounters={taskCounters}
          />
        )}
      </TaskViewContainer>
      <NewTaskDrawer
        modalActions={modalActions}
        refreshList={refreshTab}
        fromFirstAddTask={drawerAutoOpenEnabled}
      />
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  taskDrawerActions: bindActionCreators(TaskDrawerActions, dispatch),
  taskActions: bindActionCreators(TaskActions, dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
});

const mapStateToProps = store => ({
  currentUser: store.userState.userProfile,
  taskCounters: store.listTasks.taskCounters,
  selectedTask: store.taskState.selectedTask,
  isFetching: tasksIsFetchingSelector(store),
  isCompletedTasksFetching: completedTasksIsFetchingSelector(store),
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
