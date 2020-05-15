import React, { useState, useRef } from 'react';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/full-view';
import FullViewActiveIcon from 'img/full-view-active';
import SlimViewIcon from 'img/slim-view';
import SlimViewActiveIcon from 'img/slim-view-active';
import Task from '../TaskItem/TaskItem';
import GroupNameSection from '../GroupNameSection/GroupNameSection';
import TasksGroupHeaderActionButtons from './TasksGroupHeaderActionButtons';

import {
  Arrow,
  TasksGroupContainer,
  TasksGroupHeader,
  TasksGroupLabel,
  Tasks,
  ViewIcon,
  GroupNameSectionWrapper,
  TasksGroupLabelName,
  TasksGroupLabelCounter,
} from './styled';
import { AddTaskInputWrapper } from '../styled';

const FULL_VIEW = 'FULL_VIEW';
const SLIM_VIEW = 'SLIM_VIEW';

const TasksGroup = ({
  isDefaultGroup,
  isFirstGroup,
  isLastGroup,
  groupId,
  currentUser,
  groupName,
  markComplete,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskPriority,
  editGroupName,
  quickAddTask,
  deleteGroup,
  moveGroupUp,
  moveGroupDown,
  tasks,
}) => {
  const [isOpen, switchOpen] = useState(false);
  const [viewType, setViewType] = useState(FULL_VIEW);
  const isFullView = viewType === FULL_VIEW;

  const addTaskInput = useRef();

  const handleInputEnterDown = taskName => {
    if (taskName) {
      quickAddTask(taskName, groupId);
      addTaskInput.current.value = '';
    }
  };

  return (
    <TasksGroupContainer>
      <TasksGroupHeader>
        <Arrow
          alt="arrow"
          isOpen={isOpen}
          onClick={() => switchOpen(!isOpen)}
          src={ArrowIcon}
        />
        <GroupNameSectionWrapper>
          <GroupNameSection
            initialValue={groupName}
            onEnterClick={newGroupName => editGroupName(newGroupName, groupId)}
            closeOnEnter
            disabled={isDefaultGroup}
          >
            <TasksGroupLabel>
              <TasksGroupLabelName>{groupName}</TasksGroupLabelName>
              <TasksGroupLabelCounter>
                ({tasks?.length || 0})
              </TasksGroupLabelCounter>
            </TasksGroupLabel>
          </GroupNameSection>
        </GroupNameSectionWrapper>
        <TasksGroupHeaderActionButtons
          isDefaultGroup={isDefaultGroup}
          isFirstGroup={isFirstGroup}
          isLastGroup={isLastGroup}
          moveGroupUp={moveGroupUp}
          deleteGroup={() => deleteGroup(groupId)}
          moveGroupDown={moveGroupDown}
        />
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
