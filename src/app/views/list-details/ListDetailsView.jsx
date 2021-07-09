import React from 'react';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import Toolbar from 'components/tasklist/Toolbar/ToolbarContainer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import OpenedTasksView from './ListDetailsOpenedTasksContainer/ListDetailsOpenedTasksContainer';
import CompletedTasksView from './ListDetailsCompletedTasksContainer/ListDetailsCompletedTasksContainer';
import InboxHelpPanel from './InboxHelpPanel/InboxHelpPanel';
import initializeListDetailsViewHooks from './hooks';
import { TaskViewContainer } from './styled';

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
    handleUpdateDueDate,
    handleUpdateWorkflowStatus,
    isCompletedTasksFetching,
    isFetching,
    isTourOpen,
    listDetailsActions,
    loadedTasklist,
    loadMoreTasksForList,
    loadTasksForTaskGroup,
    members,
    modalActions,
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
            members={members}
            showMembers={loadedTasklist?.listType !== 'PUBLIC'}
            onSelectTab={navigateToTab}
            selectedTab={selectedTab}
            taskList={loadedTasklist || undefined}
            openTasksAmount={taskCounters.incomplete}
            completedTasksAmount={taskCounters.complete}
            onSearchChange={changeSearchValue}
            searchValue={searchValue}
            onSelectFilters={listDetailsActions.filterListDetailsTasks}
            pdfTitle={loadedTasklist?.listName}
            tipsContent={
              loadedTasklist?.listType === 'INBOX' ? InboxHelpPanel : null
            }
            isFetching={isFetching || isCompletedTasksFetching}
            printData={{
              completedTasks,
              openedTasks,
              taskListMembers: members,
            }}
            tasks={openedTasks}
            completedTasks={completedTasks}
            selectedFilters={selectedFilters}
          />
          {selectedTab === TaskListTabName.COMPLETE ? (
            <CompletedTasksView
              toggleCompleteTask={toggleTaskCompletedStatus}
              onTaskUpdate={handleTaskUpdate}
              updateDueDate={handleUpdateDueDate}
              searchValue={searchValue}
              listUniqueKey={taskListIdentifier}
              loadMoreTasksForList={loadMoreTasksForList}
              sort={sort}
              onSortChange={listDetailsActions.sortListDetailsTasks}
            />
          ) : (
            <OpenedTasksView
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
            />
          )}
        </TaskViewContainer>
        <TaskDrawer
          modalActions={modalActions}
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
