import React from 'react';
import EmptyTaskListBear from 'img/animals/bear';
import { DragDropContext } from 'react-beautiful-dnd';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import {
  TASK_ITEM_MEMBERS_COLUMN,
  TASK_ITEM_PATIENT_COLUMN,
  TASK_ITEM_WORFKLOW_STATUS_COLUMN,
  TASK_ITEM_ICONS_COLUMN,
} from 'components/task/StandardTaskItem/helpers';
import { TaskGroupsContainer } from '../styled';

const LIST_DETAILS_COLUMNS_CONFIG = [
  TASK_ITEM_PATIENT_COLUMN,
  TASK_ITEM_WORFKLOW_STATUS_COLUMN,
  TASK_ITEM_MEMBERS_COLUMN,
  TASK_ITEM_ICONS_COLUMN,
  TASK_ITEM_MEMBERS_COLUMN,
];

const ListDetailsCompletedTasks = ({
  tasks,
  completedTasksGroup,
  toggleCompleteTask,
  hasMoreTasks,
  isFetchingMoreTasks,
  isFetchingData,
  updateDueDate,
  dragAndDropDisabled,
  isSearchApplied,
  areFiltersApplied,
  onTaskUpdate,
  selectedTask,
  listUniqueKey,
  loadMoreTasksForList,
  sort,
  onSortChange,
}) => {
  const renderEmptyState = () => {
    if (isSearchApplied) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    return (
      <EmptyListView
        title="This list has no tasks"
        description="Be the first to add a task to this list!"
        image={EmptyTaskListBear}
      />
    );
  };

  return (
    <>
      {isFetchingData ? (
        <GroupedListSkeletonLoader numberOfGroups={1} />
      ) : (
        <>
          {tasks?.length > 0 ? (
            <TaskGroupsContainer>
              <DragDropContext onDragEnd={() => {}}>
                <TasksGroup
                  groupName="Completed"
                  toggleCompleteTask={toggleCompleteTask}
                  tasks={tasks}
                  isCompletedGroup
                  groupPagination
                  hasMoreTasks={hasMoreTasks}
                  isFetchingMoreTasks={isFetchingMoreTasks}
                  updateDueDate={updateDueDate}
                  quickAddTaskVisible={false}
                  dragAndDropDisabled={dragAndDropDisabled}
                  onTaskUpdate={onTaskUpdate}
                  areFiltersApplied={areFiltersApplied}
                  isSearchApplied={isSearchApplied}
                  selectedTask={selectedTask}
                  listUniqueKey={listUniqueKey}
                  showMoreTasks={() => {
                    loadMoreTasksForList({
                      status: 'COMPLETE',
                      startPosition: completedTasksGroup?.tasks?.length || 0,
                      sort,
                    });
                  }}
                  onTaskGroupViewModeChange={viewMode => {
                    loadMoreTasksForList({
                      status: 'COMPLETE',
                      startPosition: 0,
                      sort,
                      viewMode,
                    });
                  }}
                  sort={sort}
                  onSortChange={onSortChange}
                  taskItemConfig={LIST_DETAILS_COLUMNS_CONFIG}
                  disableBulkEdit
                />
              </DragDropContext>
            </TaskGroupsContainer>
          ) : (
            renderEmptyState()
          )}
        </>
      )}
    </>
  );
};

export default ListDetailsCompletedTasks;
