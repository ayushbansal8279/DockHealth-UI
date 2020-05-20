import React from 'react';

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
      {tasks?.length > 0 ? (
        <TaskGroupsContainer>
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
        </TaskGroupsContainer>
      ) : (
        <div>List is empty</div>
      )}
    </TasksViewLoader>
  );
};

export default CompletedTasksView;
