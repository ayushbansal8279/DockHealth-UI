import React from 'react';
import EmptyTaskListBear from 'img/animals/bear';
import { DragDropContext } from 'react-beautiful-dnd';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from '../TasksGroup/TasksGroup';
import { TaskGroupsContainer } from '../styled';
import ListSkeletonLoader from '../ListSkeletonLoader/ListSkeletonLoader';

const CompletedTasksView = ({
  tasks,
  openDrawer,
  currentUser,
  markComplete,
  storeAsCurrentTask,
  toggleSingleTaskPriority,
  toggleCompleteTask,
  summaryTasksCount,
  showMoreTasks,
  isFetchingMoreTasks,
  isFetchingData,
  updateDueDate,
  dragAndDropDisabled,
  listNameVisible,
  isSearchApplied,
  areFiltersApplied,
  reassignTask,
  selectedTask,
  listUniqueKey,
  groupPagination,
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
                  openDrawer={openDrawer}
                  storeAsCurrentTask={storeAsCurrentTask}
                  toggleTaskPriority={toggleSingleTaskPriority}
                  toggleCompleteTask={toggleCompleteTask}
                  tasks={tasks}
                  isCompletedGroup
                  groupPagination={groupPagination}
                  showMoreTasks={showMoreTasks}
                  hasMoreTasks={tasksAndSubTasks < summaryTasksCount}
                  isFetchingMoreTasks={isFetchingMoreTasks}
                  updateDueDate={updateDueDate}
                  quickAddTaskVisible={false}
                  dragAndDropDisabled={dragAndDropDisabled}
                  listNameVisible={listNameVisible}
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

export default CompletedTasksView;
