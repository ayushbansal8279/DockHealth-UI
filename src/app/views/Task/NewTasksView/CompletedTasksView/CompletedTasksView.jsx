import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import EmptyListImage from 'img/empty-list';

import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import TasksGroup from '../TasksGroup/TasksGroup';
import EmptyListResult from '../EmptyListResult/EmptyListResult';
import { getRandomEmptySearchResultImage } from '../EmptyListResult/helpers';
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
  reassignTask,
  hasFiltersApplied,
  selectedTask,
}) => {
  const [emptySearchResultImage] = useState(getRandomEmptySearchResultImage());

  const renderEmptyState = () => {
    if (isSearchApplied)
      return (
        <EmptyListResult
          imageSrc={emptySearchResultImage}
          text="No results were found for your search"
        />
      );

    return (
      <EmptyListResult
        imageSrc={EmptyListImage}
        text="This list has no tasks"
      />
    );
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
