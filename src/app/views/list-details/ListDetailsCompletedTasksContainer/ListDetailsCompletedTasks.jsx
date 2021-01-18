import React from 'react';
import EmptyTaskListBear from 'img/animals/bear';
import { DragDropContext } from 'react-beautiful-dnd';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import ListSkeletonLoader from 'components/tasklist/ListSkeletonLoader/ListSkeletonLoader';
import TasksGroup from 'components/tasklist/TasksGroup/TasksGroup';
import { TaskGroupsContainer } from '../styled';

const ListDetailsCompletedTasks = ({
  tasks,
  completedTasksGroup,
  currentUser,
  markComplete,
  toggleCompleteTask,
  hasMoreTasks,
  isFetchingMoreTasks,
  isFetchingData,
  updateDueDate,
  dragAndDropDisabled,
  isSearchApplied,
  areFiltersApplied,
  reassignTask,
  selectedTask,
  listUniqueKey,
  loadMoreTasksForList,
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
        <ListSkeletonLoader />
      ) : (
        <>
          {tasks?.length > 0 ? (
            <TaskGroupsContainer>
              <DragDropContext onDragEnd={() => {}}>
                <TasksGroup
                  groupName="Completed"
                  currentUser={currentUser}
                  markComplete={markComplete}
                  toggleCompleteTask={toggleCompleteTask}
                  tasks={tasks}
                  isCompletedGroup
                  groupPagination
                  hasMoreTasks={hasMoreTasks}
                  isFetchingMoreTasks={isFetchingMoreTasks}
                  updateDueDate={updateDueDate}
                  quickAddTaskVisible={false}
                  dragAndDropDisabled={dragAndDropDisabled}
                  reassignTask={reassignTask}
                  areFiltersApplied={areFiltersApplied}
                  isSearchApplied={isSearchApplied}
                  selectedTask={selectedTask}
                  listUniqueKey={listUniqueKey}
                  showMoreTasks={() => {
                    loadMoreTasksForList({
                      status: 'COMPLETE',
                      startPosition: completedTasksGroup?.tasks?.length || 0,
                    });
                  }}
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
