import React from 'react';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import ListDetailsToolbarContainer from 'views/list-details/ListDetailsToolbarContainer/ListDetailsToolbarContainer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import { ViewType } from 'helpers/view-type-helper';
import Calendar from 'components/common/Calendar/Calendar';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import OpenedTasksView from './ListDetailsOpenedTasksContainer/ListDetailsOpenedTasksContainer';
import CompletedTasksView from './ListDetailsCompletedTasksContainer/ListDetailsCompletedTasksContainer';
import InboxHelpPanel from './InboxHelpPanel/InboxHelpPanel';
import initializeListDetailsViewHooks from './hooks';
import { TaskViewContainer } from './styled';
import ListDetailsHeader from './ListDetailsHeader/ListDetailsHeader';
import ListDetailsToolbar from './ListDetailsToolbar/ListDetailsToolbar';

const ListDetailsView = props => {
  const { match, history } = props;
  const {
    bulkEditIsDisabled,
    bulkEditTasks,
    changeGroupsOrder,
    changeSearchValue,
    completedTasks,
    deleteGroup,
    editGroupName,
    handleCreateGroup,
    handleTaskDelete,
    handleTaskUpdate,
    handleUpdateWorkflowStatus,
    isCompletedTasksFetching,
    isFetching,
    isTourOpen,
    listDetailsActions,
    taskList,
    loadMoreTasksForList,
    loadTasksForTaskGroup,
    members,
    navigateToTab,
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
    viewType,
  } = initializeListDetailsViewHooks(match, history);

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
      disabled: !displayListPreferences.SHOW_WORKFLOW_DETAILS,
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
    <ViewLayout
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
            {/* <ListDetailsToolbarContainer
              onColumnSetupChange={setDisplayColumnPreferences}
              members={members}
              showMembers={taskList?.listType !== 'PUBLIC'}
              onSelectTab={navigateToTab}
              selectedTab={selectedTab}
              taskList={taskList || undefined}
              openTasksAmount={taskCounters.incomplete}
              completedTasksAmount={taskCounters.complete}
              searchValue={searchValue}
              onSearchChange={changeSearchValue}
              pdfTitle={taskList?.listName}
              tipsContent={
                taskList?.listType === 'INBOX' ? InboxHelpPanel : null
              }
              tasks={openedTasks}
              completedTasks={completedTasks}
              moreOptions={[
                {
                  name: 'Show Workflow Details',
                  onClick: () => {
                    setDisplayListPreferences('SHOW_WORKFLOW_DETAILS');
                  },
                  key: 'SHOW_WORKFLOW_DETAILS',
                  checked: displayListPreferences.SHOW_WORKFLOW_DETAILS,
                },
                {
                  disabled: !displayListPreferences.SHOW_WORKFLOW_DETAILS,
                  name:
                    selectedTab === TaskListTabName.COMPLETE
                      ? 'Show Workflow Uncompleted Tasks'
                      : 'Show Workflow Completed Tasks',
                  onClick: () =>
                    setDisplayListPreferences('SHOW_WORKFLOW_COMPLETED_TASKS'),
                  key: 'SHOW_COMPLETED_OR_UNCOMPLETED_WORKFLOW_DETAILS',
                  checked: displayListPreferences.SHOW_WORKFLOW_COMPLETED_TASKS,
                },
              ]}
            /> */}
            <ListDetailsToolbar
              onColumnSetupChange={setDisplayColumnPreferences}
              onSelectTab={navigateToTab}
              selectedTab={selectedTab}
              additionalOptions={additionalToolbarOptions}
            />
            {viewType === ViewType.CALENDAR_VIEW && (
              <Calendar
                taskList={[...openedTasks, ...completedTasks]}
                taskListIdentifier={taskListIdentifier}
                showInCompleteTasksOnly={selectedTab === TaskListTabName.OPEN}
              />
            )}
            {viewType === ViewType.LIST_VIEW &&
              (selectedTab === TaskListTabName.COMPLETE ? (
                <CompletedTasksView
                  viewSetup={displayListPreferences}
                  toggleCompleteTask={toggleTaskCompletedStatus}
                  onTaskUpdate={handleTaskUpdate}
                  searchValue={searchValue}
                  listUniqueKey={taskListIdentifier}
                  loadMoreTasksForList={loadMoreTasksForList}
                  sort={sort}
                  onSortChange={listDetailsActions.sortListDetailsTasks}
                />
              ) : (
                <OpenedTasksView
                  viewSetup={displayListPreferences}
                  taskListIdentifier={taskListIdentifier}
                  quickAddTask={quickAddTask}
                  createTaskGroupList={handleCreateGroup}
                  editGroupName={editGroupName}
                  toggleCompleteTask={toggleTaskCompletedStatus}
                  deleteGroup={deleteGroup}
                  changeGroupsOrder={changeGroupsOrder}
                  onTaskUpdate={handleTaskUpdate}
                  updateWorkflowStatus={handleUpdateWorkflowStatus}
                  searchValue={searchValue}
                  sort={sort}
                  onSortChange={listDetailsActions.sortListDetailsTasks}
                  listUniqueKey={taskListIdentifier}
                  taskCounters={taskCounters}
                  loadTasksForTaskGroup={loadTasksForTaskGroup}
                  resetSort={resetSort}
                />
              ))}
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
    </ViewLayout>
  );
};

export default ListDetailsView;
