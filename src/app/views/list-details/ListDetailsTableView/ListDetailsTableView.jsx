import React from 'react';
import { compose } from 'ramda';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import * as ListDetailsActions from 'actions/list-details-actions';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import HorizontallyScrolledViewLayout from 'components/template/HorizontallyScrolledViewLayout/HorizontallyScrolledViewLayout';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import OpenedTasksView from '../ListDetailsOpenedTasksContainer/ListDetailsOpenedTasksContainer';
import CompletedTasksView from '../ListDetailsCompletedTasksContainer/ListDetailsCompletedTasksContainer';
import ListDetailsHeader from '../ListDetailsHeader/ListDetailsHeader';
import ListDetailsToolbar from '../ListDetailsToolbar/ListDetailsToolbar';
import initializeListDetailsViewHooks from './hooks';
import { TaskViewContainer } from './styled';

const ListDetailsTableView = () => {
  const {
    bulkEditIsDisabled,
    bulkEditTasks,
    changeSearchValue,
    completedTasks,
    handleCreateGroup,
    handleTaskDelete,
    handleTaskUpdate,
    handleUpdateWorkflowStatus,
    isCompletedTasksFetching,
    isFetching,
    isTourOpen,
    loadMoreTasksForList,
    loadTasksForTaskGroup,
    openedTasks,
    quickAddTask,
    refreshTab,
    refreshTabAfterTaskUpdate,
    resetSort,
    searchValue,
    selectedTab,
    sort,
    taskCounters,
    taskListIdentifier,
    toggleTaskCompletedStatus,
    displayListPreferences,
    setDisplayListPreferences,
    setDisplayColumnPreferences,
    dispatch,
  } = initializeListDetailsViewHooks();

  const additionalToolbarOptions = [
    {
      name: 'Show Workflow Details',
      onClick: () => {
        setDisplayListPreferences('SHOW_WORKFLOW_DETAILS');
      },
      key: 'SHOW_WORKFLOW_DETAILS',
      checked: displayListPreferences.SHOW_WORKFLOW_DETAILS,
    },
    {
      name:
        selectedTab === TaskListTabName.COMPLETE
          ? 'Show Workflow Uncompleted Tasks'
          : 'Show Workflow Completed Tasks',
      onClick: () => setDisplayListPreferences('SHOW_WORKFLOW_COMPLETED_TASKS'),
      key: 'SHOW_COMPLETED_OR_UNCOMPLETED_WORKFLOW_DETAILS',
      checked: displayListPreferences.SHOW_WORKFLOW_COMPLETED_TASKS,
    },
  ];

  return (
    <HorizontallyScrolledViewLayout
      header={
        <ListDetailsHeader
          isFetchingTasks={isFetching || isCompletedTasksFetching}
          searchValue={searchValue}
          onSearchChange={changeSearchValue}
          tasks={
            selectedTab === TaskListTabName.OPEN ? openedTasks : completedTasks
          }
          totalTasksAmount={
            selectedTab === TaskListTabName.OPEN
              ? taskCounters.incomplete
              : taskCounters.complete
          }
        />
      }
    >
      <BulkEditSection
        allTasks={bulkEditTasks}
        refreshTasks={refreshTab}
        disabled={bulkEditIsDisabled}
        searchValue={searchValue}
      >
        <div>
          <TaskViewContainer>
            <StickyContainer>
              <ListDetailsToolbar
                onColumnSetupChange={setDisplayColumnPreferences}
                additionalOptions={additionalToolbarOptions}
              />
            </StickyContainer>
            {selectedTab === TaskListTabName.COMPLETE ? (
              <CompletedTasksView
                viewSetup={displayListPreferences}
                toggleCompleteTask={toggleTaskCompletedStatus}
                onTaskUpdate={handleTaskUpdate}
                searchValue={searchValue}
                listUniqueKey={taskListIdentifier}
                loadMoreTasksForList={loadMoreTasksForList}
                sort={sort}
                onSortChange={compose(
                  dispatch,
                  ListDetailsActions.sortListDetailsTasks,
                )}
              />
            ) : (
              <OpenedTasksView
                viewSetup={displayListPreferences}
                taskListIdentifier={taskListIdentifier}
                quickAddTask={quickAddTask}
                createTaskGroupList={handleCreateGroup}
                toggleCompleteTask={toggleTaskCompletedStatus}
                onTaskUpdate={handleTaskUpdate}
                updateWorkflowStatus={handleUpdateWorkflowStatus}
                searchValue={searchValue}
                sort={sort}
                onSortChange={compose(
                  dispatch,
                  ListDetailsActions.sortListDetailsTasks,
                )}
                listUniqueKey={taskListIdentifier}
                taskCounters={taskCounters}
                loadTasksForTaskGroup={loadTasksForTaskGroup}
                resetSort={resetSort}
              />
            )}
          </TaskViewContainer>
          <TaskDrawer
            fromFirstAddTask={taskCounters?.incomplete === 0}
            hideTour={isTourOpen}
            onTaskUpdate={refreshTabAfterTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskCreation={refreshTabAfterTaskUpdate}
          />
        </div>
      </BulkEditSection>
    </HorizontallyScrolledViewLayout>
  );
};

export default ListDetailsTableView;
