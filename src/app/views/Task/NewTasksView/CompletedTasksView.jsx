import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import { TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';
import TasksViewLoader from './TasksViewLoader/TasksViewLoader';

const CompletedTasksView = ({
  tasks,
  openDrawer,
  currentUser,
  markComplete,
  storeAsCurrentTask,
  toggleSingleTaskPriority,
  toggleCompleteTask,
  isFetchingData,
}) => {
  return (
    <TasksViewLoader isFetchingData={isFetchingData}>
      {tasks?.length > 0 && (
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
            />
          </DragDropContext>
        </TaskGroupsContainer>
      )}
    </TasksViewLoader>
  );
};

export default CompletedTasksView;
