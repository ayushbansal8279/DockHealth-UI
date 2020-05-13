import React, { useState, useRef } from 'react';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/full-view';
import XInCircle from 'img/x-in-circle';
import FullViewActiveIcon from 'img/full-view-active';
import SlimViewIcon from 'img/slim-view';
import SlimViewActiveIcon from 'img/slim-view-active';
import Task from '../TaskItem/TaskItem';
import GroupNameSection from '../GroupNameSection/GroupNameSection';

import {
  Arrow,
  TasksGroupContainer,
  TasksGroupHeader,
  TasksGroupLabel,
  Tasks,
  ViewIcon,
  TasksGroupActionButtonsContainer,
  TasksGroupActionButton,
  GroupNameSectionWrapper,
} from './styled';
import { AddTaskInputWrapper } from '../styled';

const FULL_VIEW = 'FULL_VIEW';
const SLIM_VIEW = 'SLIM_VIEW';

const TasksGroup = ({
  currentUser,
  groupName,
  markComplete,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskPriority,
  editGroupName,
  quickAddTask,
  deleteGroup,
  tasks,
}) => {
  const [isOpen, switchOpen] = useState(false);
  const [viewType, setViewType] = useState(FULL_VIEW);
  const isFullView = viewType === FULL_VIEW;

  const switchGroupHeaderEdit = event => {
    event.stopPropagation();
    event.preventDefault();
    switchOpen(!isOpen);
  };

  const addTaskInput = useRef();

  const handleInputEnterDown = taskName => {
    if (taskName) {
      quickAddTask(taskName);
      addTaskInput.current.value = '';
    }
  };

  return (
    <TasksGroupContainer>
      <TasksGroupHeader>
        <Arrow
          alt="arrow"
          isOpen={isOpen}
          onClick={switchGroupHeaderEdit}
          src={ArrowIcon}
        />
        <GroupNameSectionWrapper>
          <GroupNameSection
            initialValue={groupName}
            onEnterClick={newGroupName =>
              editGroupName(newGroupName, groupName)
            }
          >
            <TasksGroupLabel>
              <span className="name">{groupName}</span>
              <span className="counter">({tasks?.length || 0})</span>
            </TasksGroupLabel>
          </GroupNameSection>
        </GroupNameSectionWrapper>
        <TasksGroupActionButtonsContainer className="action-buttons">
          <TasksGroupActionButton onClick={() => deleteGroup(groupName)}>
            <img src={XInCircle} alt="Delete" />
            <p>Delete</p>
          </TasksGroupActionButton>
        </TasksGroupActionButtonsContainer>
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
            ref={addTaskInput}
            placeholder="Add task"
            onKeyDown={event =>
              event.keyCode === 13 && handleInputEnterDown(event.target.value)
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
