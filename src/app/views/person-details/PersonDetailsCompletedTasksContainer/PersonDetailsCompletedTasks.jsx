import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { completedTasksIsFetchingMoreSelector } from 'selectors/list-details-selectors';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import EmptyTaskListBear from 'img/animals/bear';
import { DragDropContext } from 'react-beautiful-dnd';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import {
  TASK_ITEM_MEMBERS_COLUMN,
  TASK_ITEM_PATIENT_COLUMN,
  TASK_ITEM_WORFKLOW_STATUS_COLUMN,
  TASK_ITEM_ICONS_COLUMN,
  TASK_ITEM_LIST_COLUMN,
} from 'components/task/StandardTaskItem/helpers';
import { TaskGroupsContainer } from '../styled';

const PersonDetailsCompletedTasks = ({
  isFetchingTasks,
  tasks,
  openDrawer,
  storeAsCurrentTask,
  toggleCompleteTask,
  summaryTasksCount,
  updateDueDate,
  dragAndDropDisabled,
  searchValue,
  areFiltersApplied,
  onTaskUpdate,
  selectedTask,
  listUniqueKey,
  sort,
  onSortChange,
}) => {
  const isFetchingMoreTasks = useSelector(completedTasksIsFetchingMoreSelector);

  const filteredTasks = useMemo(
    () => (!searchValue ? tasks : filterTasksBySearchValue(tasks, searchValue)),
    [searchValue, tasks],
  );

  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    return (
      <EmptyListView
        title="This list has no tasks"
        description="Be the first to add a task to this list!"
        image={EmptyTaskListBear}
      />
    );
  };

  const tasksAndSubTasks =
    tasks?.reduce(
      (counter, task) =>
        counter +
        task.subtasks?.filter(x => x.status === 'COMPLETE').length +
        1,
      0,
    ) || 0;

  return (
    <>
      {isFetchingTasks ? (
        <GroupedListSkeletonLoader numberOfGroups={1} />
      ) : (
        <>
          {filteredTasks?.length > 0 ? (
            <TaskGroupsContainer>
              <DragDropContext onDragEnd={() => {}}>
                <TasksGroup
                  groupName="Completed"
                  openDrawer={openDrawer}
                  storeAsCurrentTask={storeAsCurrentTask}
                  toggleCompleteTask={toggleCompleteTask}
                  tasks={filteredTasks}
                  isCompletedGroup
                  hasMoreTasks={tasksAndSubTasks < summaryTasksCount}
                  isFetchingMoreTasks={isFetchingMoreTasks}
                  updateDueDate={updateDueDate}
                  quickAddTaskVisible={false}
                  dragAndDropDisabled={dragAndDropDisabled}
                  listNameVisible
                  onTaskUpdate={onTaskUpdate}
                  areFiltersApplied={areFiltersApplied}
                  isSearchApplied={searchValue}
                  selectedTask={selectedTask}
                  listUniqueKey={listUniqueKey}
                  sort={sort}
                  onSortChange={onSortChange}
                  taskItemConfig={[
                    TASK_ITEM_PATIENT_COLUMN,
                    TASK_ITEM_WORFKLOW_STATUS_COLUMN,
                    TASK_ITEM_MEMBERS_COLUMN,
                    TASK_ITEM_ICONS_COLUMN,
                    TASK_ITEM_LIST_COLUMN,
                  ]}
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

export default PersonDetailsCompletedTasks;
