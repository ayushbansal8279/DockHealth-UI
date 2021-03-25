/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { isEmpty } from 'ramda';
import EmptyTaskListFox from 'img/animals/fox';
import EmptyTaskListBear from 'img/animals/bear';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';

import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListViewWithQuickAddTask from 'components/tasklist/EmptyListView/EmptyListViewWithQuickAddTask';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import { TaskGroupsContainer } from '../styled';

const PersonDetailsOpenedTasks = ({
  isFetchingTasks,
  tasks,
  toggleCompleteTask,
  quickAddTask,
  onTaskUpdate,
  updateDueDate,
  updateWorkflowStatus,
  searchValue,
  areFiltersApplied,
  selectedTask,
  listUniqueKey,
  sort,
  onSortChange,
}) => {
  const filteredTasks = useMemo(
    () => (!searchValue ? tasks : filterTasksBySearchValue(tasks, searchValue)),
    [searchValue, tasks],
  );

  const renderEmptyState = () => {
    if (searchValue) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    if (quickAddTask) {
      return (
        <EmptyListViewWithQuickAddTask quickAddTask={quickAddTask}>
          <EmptyListView
            title="This person has no tasks"
            description="Add and automatically assign a task to this person above."
            image={EmptyTaskListFox}
          />
        </EmptyListViewWithQuickAddTask>
      );
    }

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
      {isFetchingTasks ? (
        <GroupedListSkeletonLoader numberOfGroups={1} />
      ) : (
        <TaskGroupsContainer>
          {!isEmpty(tasks) ? (
            <DragDropContext onDragEnd={() => {}}>
              <TasksGroup
                isDefaultGroup
                isFirstGroup
                isLastGroup
                groupName="All tasks"
                changingGroupOrderDisabled
                tasks={filteredTasks || []}
                taskGroupIdentifier={TASKGROUP_DEFAULT_TYPE}
                onTaskUpdate={onTaskUpdate}
                toggleCompleteTask={toggleCompleteTask}
                updateDueDate={updateDueDate}
                updateWorkflowStatus={updateWorkflowStatus}
                dragAndDropDisabled
                listNameVisible
                isSearchApplied={searchValue}
                selectedTask={selectedTask}
                areFiltersApplied={areFiltersApplied}
                listUniqueKey={listUniqueKey}
                quickAddTask={quickAddTask}
                sort={sort}
                onSortChange={onSortChange}
              />
            </DragDropContext>
          ) : (
            renderEmptyState()
          )}
        </TaskGroupsContainer>
      )}
    </>
  );
};

export default PersonDetailsOpenedTasks;
