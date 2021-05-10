import React from 'react';
import EmptyTaskListBear from 'img/animals/bear';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import GroupedListSkeletonLoader from 'components/tasklist/GroupedListSkeletonLoader/GroupedListSkeletonLoader';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import LoadMoreButton, {
  LoadMoreSection,
} from 'components/common/LoadMoreButton/LoadMoreButton';
import { TaskItemType } from 'helpers/task-helpers';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import TasksSkeletonLoader from 'components/task/TasksSkeletonLoader/TasksSkeletonLoader';
import { TaskGroupsContainer } from '../styled';

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
  // eslint-disable-next-line sonarjs/cognitive-complexity
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
              >
                {({
                  isLoadingGroup,
                  isCompletedGroup,
                  isFullView,
                  isTaskDrawerOpen,
                  addingNewSubtask,
                  addingNewSubtaskParentId,
                  subtaskShape,
                  groupHasMultipleAssignees,
                  isListFlattened,
                  highlightedTasksParentIdentifier,
                  highlightTasksOfTheSameParent,
                  groupPagination,
                  showMoreTasks,
                }) => (
                  <>
                    {tasks?.map(task =>
                      task?.itemType === TaskItemType.TASK ? (
                        <StandardTaskItem
                          isFullView={isFullView}
                          task={task}
                          isCompletedGroup={isCompletedGroup}
                          toggleCompleteTask={toggleCompleteTask}
                          onTaskUpdate={onTaskUpdate}
                          updateDueDate={updateDueDate}
                          dragAndDropDisabled={
                            isCompletedGroup || dragAndDropDisabled
                          }
                          selectedTask={selectedTask}
                          isDraggable={!isTaskDrawerOpen}
                          addingNewSubtask={addingNewSubtask}
                          addingNewSubtaskParentId={addingNewSubtaskParentId}
                          subtaskShape={subtaskShape}
                          subtasksDisabled={isListFlattened}
                          areFiltersApplied={areFiltersApplied}
                          isSearchApplied={isSearchApplied}
                          multipleAssigneesContext={groupHasMultipleAssignees}
                          highlightedTasksParentIdentifier={
                            highlightedTasksParentIdentifier
                          }
                          highlightTasksOfTheSameParent={
                            highlightTasksOfTheSameParent
                          }
                        />
                      ) : (
                        <TaskTemplateGroup
                          templateGroup={task}
                          groupHasMultipleAssignees={groupHasMultipleAssignees}
                          isFullView={isFullView}
                          dragAndDropDisabled={
                            isCompletedGroup || dragAndDropDisabled
                          }
                        />
                      ),
                    )}
                    {(isLoadingGroup || isFetchingMoreTasks) && (
                      <TasksSkeletonLoader rows={4} />
                    )}
                    {groupPagination && hasMoreTasks && !areFiltersApplied && (
                      <LoadMoreSection>
                        {!isLoadingGroup && (
                          <LoadMoreButton onClick={showMoreTasks} />
                        )}
                      </LoadMoreSection>
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

export default ListDetailsCompletedTasks;
