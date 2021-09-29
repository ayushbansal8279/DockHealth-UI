/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo } from 'react';
import { isEmpty } from 'ramda';
import EmptyTaskListFox from 'img/animals/fox.png';
import EmptyTaskListBear from 'img/animals/bear.svg';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListViewWithQuickAddTask from 'components/tasklist/EmptyListView/EmptyListViewWithQuickAddTask';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import { TaskItemType } from 'helpers/task-helpers';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
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
  taskItemConfig,
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
              isSearchApplied={searchValue}
              selectedTask={selectedTask}
              areFiltersApplied={areFiltersApplied}
              listUniqueKey={listUniqueKey}
              quickAddTask={quickAddTask}
              sort={sort}
              onSortChange={onSortChange}
              taskItemConfig={taskItemConfig}
              listNameVisible
            >
              {({
                isCompletedGroup,
                isFullView,
                addingNewSubtaskParentId,
                groupHasMultipleAssignees,
                isListFlattened,
                highlightedTasksParentIdentifier,
                highlightTasksOfTheSameParent,
              }) => (
                <>
                  {tasks.map(task =>
                    task?.itemType === TaskItemType.TASK ? (
                      <StandardTaskItem
                        key={task.identifier}
                        isFullView={isFullView}
                        task={task}
                        taskGroupIdentifier={TASKGROUP_DEFAULT_TYPE}
                        isCompletedGroup={isCompletedGroup}
                        toggleCompleteTask={toggleCompleteTask}
                        onTaskUpdate={onTaskUpdate}
                        updateDueDate={updateDueDate}
                        updateWorkflowStatus={updateWorkflowStatus}
                        selectedTask={selectedTask}
                        addingNewSubtask={
                          addingNewSubtaskParentId === task.identifier
                        }
                        subtasksDisabled={isListFlattened}
                        areFiltersApplied={areFiltersApplied}
                        isSearchApplied={searchValue}
                        multipleAssigneesContext={groupHasMultipleAssignees}
                        highlightedTasksParentIdentifier={
                          highlightedTasksParentIdentifier
                        }
                        highlightTasksOfTheSameParent={
                          highlightTasksOfTheSameParent
                        }
                        taskItemConfig={taskItemConfig}
                        dragAndDropDisabled
                      />
                    ) : (
                      <TaskTemplateGroup
                        templateGroup={task}
                        groupHasMultipleAssignees={groupHasMultipleAssignees}
                        isFullView={isFullView}
                        dragAndDropDisabled
                      />
                    ),
                  )}
                </>
              )}
            </TasksGroup>
          ) : (
            renderEmptyState()
          )}
        </TaskGroupsContainer>
      )}
    </>
  );
};

export default PersonDetailsOpenedTasks;
