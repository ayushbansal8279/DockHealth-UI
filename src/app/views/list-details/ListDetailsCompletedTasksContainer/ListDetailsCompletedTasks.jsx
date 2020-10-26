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
  currentUser,
  markComplete,
  toggleSingleTaskPriority,
  toggleCompleteTask,
  summaryTasksCount,
  showMoreTasks,
  isFetchingMoreTasks,
  isFetchingData,
  updateDueDate,
  dragAndDropDisabled,
  isSearchApplied,
  areFiltersApplied,
  reassignTask,
  selectedTask,
  listUniqueKey,
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
                  toggleTaskPriority={toggleSingleTaskPriority}
                  toggleCompleteTask={toggleCompleteTask}
                  tasks={tasks}
                  isCompletedGroup
                  groupPagination
                  showMoreTasks={showMoreTasks}
                  hasMoreTasks={tasksAndSubTasks < summaryTasksCount}
                  isFetchingMoreTasks={isFetchingMoreTasks}
                  updateDueDate={updateDueDate}
                  quickAddTaskVisible={false}
                  dragAndDropDisabled={dragAndDropDisabled}
                  reassignTask={reassignTask}
                  areFiltersApplied={areFiltersApplied}
                  isSearchApplied={isSearchApplied}
                  selectedTask={selectedTask}
                  listUniqueKey={listUniqueKey}
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
