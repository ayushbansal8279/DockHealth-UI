import React, { useState } from 'react';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/full-view';
import FullViewActiveIcon from 'img/full-view-active';
import SlimViewIcon from 'img/slim-view';
import SlimViewActiveIcon from 'img/slim-view-active';
import Task from '../TaskItem/TaskItem';

import {
  Arrow,
  TasksGroupContainer,
  TasksGroupHeader,
  TasksGroupLabel,
  Tasks,
  ViewIcon,
  AddTaskInputWrapper,
} from './styled';

const FULL_VIEW = 'FULL_VIEW';
const SLIM_VIEW = 'SLIM_VIEW';

const TasksGroup = ({
  currentUser,
  groupName,
  markComplete,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskPriority,
  quickAddTask,
  tasks,
}) => {
  const [isOpen, switchOpen] = useState(false);
  const [viewType, setViewType] = useState(FULL_VIEW);
  const isFullView = viewType === FULL_VIEW;

  return (
    <TasksGroupContainer>
      <TasksGroupHeader>
        <TasksGroupLabel>
          <Arrow
            alt="arrow"
            isOpen={isOpen}
            onClick={() => switchOpen(!isOpen)}
            src={ArrowIcon}
          />
          {groupName} ({tasks?.length || 0})
        </TasksGroupLabel>
        <div>
          <ViewIcon
            alt="slim-view"
            src={isFullView ? SlimViewIcon : SlimViewActiveIcon}
            onClick={() => setViewType(SLIM_VIEW)}
          />
          <ViewIcon
            alt="full-view"
            src={isFullView ? FullViewActiveIcon : FullViewIcon}
            onClick={() => setViewType(FULL_VIEW)}
          />
        </div>
      </TasksGroupHeader>
      <Tasks timeout={150} in={isOpen}>
        <AddTaskInputWrapper>
          <input
            name="newTask"
            type="text"
            placeholder="Add task"
            onKeyDown={event =>
              event.keyCode === 13 && quickAddTask(event.target.value)
            }
          />
        </AddTaskInputWrapper>
        {tasks?.map(task => (
          <Task
            key={task.taskId}
            currentUser={currentUser}
            isFullView={isFullView}
            markComplete={markComplete}
            openDrawer={openDrawer}
            storeAsCurrentTask={storeAsCurrentTask}
            toggleTaskPriority={toggleTaskPriority}
            task={task}
          />
        ))}
      </Tasks>
    </TasksGroupContainer>
  );
};

export default TasksGroup;
