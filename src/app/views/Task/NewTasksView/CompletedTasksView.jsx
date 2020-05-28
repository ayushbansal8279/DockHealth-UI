import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';
import TasksViewLoader from './TasksViewLoader/TasksViewLoader';
import EmptySearchResult from './EmptySearchResult/EmptySearchResult';

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
}) => {
  const renderEmptyState = () => {
    if (isSearchApplied) return <EmptySearchResult />;

    return <>Empty list</>;
  };
  return (
    <TasksViewLoader isFetchingData={isFetchingData}>
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
            />
          </DragDropContext>
        </TaskGroupsContainer>
      ) : (
        renderEmptyState()
      )}
    </TasksViewLoader>
  );
};

export default CompletedTasksView;
