import React from 'react';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import Toolbar from 'components/tasklist/Toolbar/ToolbarContainer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import { useDispatch } from 'react-redux';
import OpenedTasksView from './ListDetailsOpenedTasksContainer/ListDetailsOpenedTasksContainer';
import CompletedTasksView from './ListDetailsCompletedTasksContainer/ListDetailsCompletedTasksContainer';
import InboxHelpPanel from './InboxHelpPanel/InboxHelpPanel';
import initializeListDetailsViewHooks from './hooks';
import { TaskViewContainer } from './styled';

const ListDetailsView = props => {
  const dispatch = useDispatch();
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
    handleUpdateDueDate,
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
    selectedFilters,
    selectedTab,
    sort,
    taskCounters,
    taskListIdentifier,
    toggleTaskCompletedStatus,
    displayListPreferences,
    displayColumnPreferences,
    setDisplayColumnPreferences,
    setDisplayListPreferences,
    mergedColumnsConfig,
  } = initializeListDetailsViewHooks(match, history);

  return (
    <BulkEditSection
      allTasks={bulkEditTasks}
      refreshTasks={refreshTab}
      disabled={bulkEditIsDisabled}
      searchValue={searchValue}
    >
      <div>
        <TaskViewContainer>
          <Toolbar
            columnsOptions={{
              columnsConfig: displayColumnPreferences,
              setColumnsConfig: setDisplayColumnPreferences,
            }}
            members={members}
            showMembers={taskList?.listType !== 'PUBLIC'}
            onSelectTab={navigateToTab}
            selectedTab={selectedTab}
            taskList={taskList || undefined}
            openTasksAmount={taskCounters.incomplete}
            completedTasksAmount={taskCounters.complete}
            onSearchChange={changeSearchValue}
            searchValue={searchValue}
            onSelectFilters={listDetailsActions.filterListDetailsTasks}
            pdfTitle={taskList?.listName}
            tipsContent={taskList?.listType === 'INBOX' ? InboxHelpPanel : null}
            isFetching={isFetching || isCompletedTasksFetching}
            printData={{
              completedTasks,
              openedTasks,
              taskListMembers: members,
            }}
            tasks={openedTasks}
            completedTasks={completedTasks}
            selectedFilters={selectedFilters}
            moreOptions={[
              {
                name: 'Show Workflow Details',
                onClick: () => {
                  dispatch(setDisplayListPreferences('SHOW_WORKFLOW_DETAILS'));
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
                  dispatch(
                    setDisplayListPreferences('SHOW_WORKFLOW_COMPLETED_TASKS'),
                  ),
                key: 'SHOW_COMPLETED_OR_UNCOMPLETED_WORKFLOW_DETAILS',
                checked: displayListPreferences.SHOW_WORKFLOW_COMPLETED_TASKS,
              },
            ]}
          />
          {selectedTab === TaskListTabName.COMPLETE ? (
            <CompletedTasksView
              viewSetup={displayListPreferences}
              toggleCompleteTask={toggleTaskCompletedStatus}
              onTaskUpdate={handleTaskUpdate}
              updateDueDate={handleUpdateDueDate}
              searchValue={searchValue}
              listUniqueKey={taskListIdentifier}
              loadMoreTasksForList={loadMoreTasksForList}
              sort={sort}
              onSortChange={listDetailsActions.sortListDetailsTasks}
              columnsConfig={mergedColumnsConfig}
              displayColumnPreferences={displayColumnPreferences}
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
              updateDueDate={handleUpdateDueDate}
              updateWorkflowStatus={handleUpdateWorkflowStatus}
              searchValue={searchValue}
              sort={sort}
              onSortChange={listDetailsActions.sortListDetailsTasks}
              listUniqueKey={taskListIdentifier}
              taskCounters={taskCounters}
              loadTasksForTaskGroup={loadTasksForTaskGroup}
              resetSort={resetSort}
              columnsConfig={mergedColumnsConfig}
              displayColumnPreferences={displayColumnPreferences}
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
  );
};

export default ListDetailsView;
