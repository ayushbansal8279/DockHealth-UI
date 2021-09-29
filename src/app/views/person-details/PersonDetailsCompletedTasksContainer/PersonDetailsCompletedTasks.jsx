import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { completedTasksIsFetchingMoreSelector } from 'selectors/list-details-selectors';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import EmptyTaskListBear from 'img/animals/bear.svg';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import { TaskItemType } from 'helpers/task-helpers';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import { TaskGroupsContainer } from '../styled';

const PersonDetailsCompletedTasks = ({
  isFetchingTasks,
  tasks,
  openDrawer,
  storeAsCurrentTask,
  toggleCompleteTask,
  summaryTasksCount,
  updateDueDate,
  searchValue,
  areFiltersApplied,
  onTaskUpdate,
  selectedTask,
  listUniqueKey,
  sort,
  onSortChange,
  taskItemConfig,
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
                listNameVisible
                onTaskUpdate={onTaskUpdate}
                areFiltersApplied={areFiltersApplied}
                isSearchApplied={searchValue}
                selectedTask={selectedTask}
                listUniqueKey={listUniqueKey}
                sort={sort}
                onSortChange={onSortChange}
                taskItemConfig={taskItemConfig}
                disableBulkEdit
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
                          isCompletedGroup={isCompletedGroup}
                          toggleCompleteTask={toggleCompleteTask}
                          onTaskUpdate={onTaskUpdate}
                          updateDueDate={updateDueDate}
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
