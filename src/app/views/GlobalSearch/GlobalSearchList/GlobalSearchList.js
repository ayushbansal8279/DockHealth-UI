import React, { useState } from 'react';
import ArrowIcon from 'img/arrow';
import Task from 'components/task-item/StandardTaskItem/TaskItem';

import {
  Arrow,
  Tasks,
  ListDetailsContainer,
  ListDetailsHeader,
  ListNameSection,
} from 'components/tasklist/TaskListDetailsDropdown/styled';

const GlobalSearchList = ({
  list,
  tasks,
  currentUser,
  selectedTask,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskStatus,
  toggleTaskPriority,
  reassignTask,
  updateDueDate,
  updateWorkflowStatus,
}) => {
  const { listName, taskListIdentifier } = list;

  const [isOpen, switchOpen] = useState(true);

  return (
    <ListDetailsContainer>
      <ListDetailsHeader>
        <Arrow
          alt="arrow"
          isOpen={isOpen}
          onClick={() => switchOpen(!isOpen)}
          src={ArrowIcon}
        />
        <ListNameSection>
          {listName} ({tasks?.length || 0})
        </ListNameSection>
      </ListDetailsHeader>
      <Tasks timeout={150} in={isOpen}>
        {tasks?.map(task => (
          <Task
            key={task.taskIdentifier}
            currentUser={currentUser}
            openDrawer={openDrawer}
            storeAsCurrentTask={storeAsCurrentTask}
            toggleTaskPriority={toggleTaskPriority}
            task={task}
            groupId={tasks.taskIdentifier}
            draggableProvided={{}}
            isCompletedGroup={false}
            toggleCompleteTask={toggleTaskStatus}
            reassignTask={reassignTask}
            updateDueDate={updateDueDate}
            updateWorkflowStatus={updateWorkflowStatus}
            dragAndDropDisabled
            selectedTask={selectedTask}
            taskContext="search"
          />
        ))}
      </Tasks>
    </ListDetailsContainer>
  );
};

export default GlobalSearchList;
