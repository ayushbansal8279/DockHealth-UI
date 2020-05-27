/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useRef } from 'react';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/full-view';
import FullViewActiveIcon from 'img/full-view-active';
import SlimViewIcon from 'img/slim-view';
import SlimViewActiveIcon from 'img/slim-view-active';
import CubesLoader from 'components/common/CubesLoader';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';

import GroupNameSection from '../GroupNameSection/GroupNameSection';
import TasksGroupHeaderActionButtons from './TasksGroupHeaderActionButtons';
import DragAndDropGroupList from '../DragAndDropGroupList/DragAndDropGroupList';

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
  PaginationButton,
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
  openDrawer,
  storeAsCurrentTask,
  toggleTaskPriority,
  toggleCompleteTask,
  editGroupName,
  quickAddTask,
  deleteGroup,
  moveGroupUp,
  moveGroupDown,
  reorderSubtasksForTask,
  reassignTask,
  taskListIdentifier,
  tasks,
  isCompletedGroup,
  draggedId,
  groupPagination,
  showMoreTasks,
  isFetchingMoreTasks,
  hasMoreTasks,
  members,
  updateDueDate,
  updateWorkflowStatus,
}) => {
  const [isOpen, switchOpen] = useState(true);
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
            disabled={isDefaultGroup || isCompletedGroup}
          >
            <TasksGroupLabel>
              <TasksGroupLabelName>{groupName}</TasksGroupLabelName>
              <TasksGroupLabelCounter>
                (
                {tasks?.reduce(
                  (counter, task) =>
                    counter +
                    task.subtasks?.filter(x =>
                      isCompletedGroup
                        ? x.status === 'COMPLETE'
                        : x.status === 'INCOMPLETE',
                    ).length +
                    1,
                  0,
                ) || 0}
                )
              </TasksGroupLabelCounter>
            </TasksGroupLabel>
          </GroupNameSection>
        </GroupNameSectionWrapper>
        {!isCompletedGroup && (
          <TasksGroupHeaderActionButtons
            isDefaultGroup={isDefaultGroup}
            isFirstGroup={isFirstGroup}
            isLastGroup={isLastGroup}
            moveGroupUp={moveGroupUp}
            moveGroupDown={moveGroupDown}
            deleteGroup={() => deleteGroup(groupId)}
          />
        )}
        <div>
          <ViewIcon
            alt="slim-view"
            src={isFullView ? SlimViewIcon : SlimViewActiveIcon}
            onClick={() => setViewType(SLIM_VIEW)}
            isHidden={!isOpen || tasks?.length === 0}
          />
          <ViewIcon
            alt="full-view"
            src={isFullView ? FullViewActiveIcon : FullViewIcon}
            onClick={() => setViewType(FULL_VIEW)}
            isHidden={!isOpen || tasks?.length === 0}
          />
        </div>
      </TasksGroupHeader>
      <Tasks timeout={150} in={isOpen}>
        {!isCompletedGroup && (
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
        )}
        <DragAndDropGroupList
          groupId={groupId}
          tasks={tasks}
          currentUser={currentUser}
          isFullView={isFullView}
          toggleCompleteTask={toggleCompleteTask}
          openDrawer={openDrawer}
          storeAsCurrentTask={storeAsCurrentTask}
          toggleTaskPriority={toggleTaskPriority}
          draggedId={draggedId}
          taskListIdentifier={taskListIdentifier}
          reorderSubtasksForTask={reorderSubtasksForTask}
          isCompletedGroup={isCompletedGroup}
          members={members}
          reassignTask={reassignTask}
          updateDueDate={updateDueDate}
          updateWorkflowStatus={updateWorkflowStatus}
        />
        {groupPagination && hasMoreTasks && (
          <PaginationButton
            disabled={isFetchingMoreTasks}
            type="button"
            onClick={showMoreTasks}
          >
            Show more
            {isFetchingMoreTasks && (
              <>
                <Spacing horizontal={4} />
                <CubesLoader size={16} color={palette.brightBlue} />
              </>
            )}
          </PaginationButton>
        )}
      </Tasks>
    </TasksGroupContainer>
  );
};

export default TasksGroup;
