import React, { useState } from 'react';
import ArrowIcon from 'img/arrow';
import { Arrow, TasksGroupContainer, TasksGroupLabel, Tasks } from './styled';
import Task from '../TaskItem/TaskItem';

const TasksGroup = ({
  currentUser,
  groupName,
  markComplete,
  openDrawer,
  storeAsCurrentTask,
  tasks,
}) => {
  const [isOpen, switchOpen] = useState(false);

  return (
    <TasksGroupContainer>
      <TasksGroupLabel>
        <Arrow
          alt="arrow"
          isOpen={isOpen}
          onClick={() => switchOpen(!isOpen)}
          src={ArrowIcon}
        />
        {groupName} ({tasks?.length || 0})
      </TasksGroupLabel>

      <Tasks timeout={150} in={isOpen}>
        {tasks?.map(task => (
          <Task
            key={task.taskId}
            currentUser={currentUser}
            markComplete={markComplete}
            openDrawer={openDrawer}
            storeAsCurrentTask={storeAsCurrentTask}
            task={task}
          />
        ))}
      </Tasks>
    </TasksGroupContainer>
  );
};

export default TasksGroup;
