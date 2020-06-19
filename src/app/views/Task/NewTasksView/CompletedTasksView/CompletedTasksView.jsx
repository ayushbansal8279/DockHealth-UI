import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from '../TasksGroup/TasksGroup';
import { TaskGroupsContainer } from '../styled';

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
  hasFiltersApplied,
  selectedTask,
}) => {
  const renderEmptyState = () => {
    if (isSearchApplied) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    return <EmptyListView>This list has no tasks</EmptyListView>;
  };
  return (
    <ViewLoader isFetchingData={isFetchingData}>
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
              groupPagination
              showMoreTasks={showMoreTasks}
              hasMoreTasks={tasks.length < summaryTasksCount}
              isFetchingMoreTasks={isFetchingMoreTasks}
              updateDueDate={updateDueDate}
              quickAddTaskVisible={false}
              dragAndDropDisabled={dragAndDropDisabled}
              listNameVisible={listNameVisible}
              reassignTask={reassignTask}
              hasFiltersApplied={hasFiltersApplied}
              isSearchApplied={isSearchApplied}
              selectedTask={selectedTask}
            />
          </DragDropContext>
        </TaskGroupsContainer>
      ) : (
        renderEmptyState()
      )}
    </ViewLoader>
  );
};

export default CompletedTasksView;
