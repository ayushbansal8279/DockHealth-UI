import React, { useMemo } from 'react';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/full-view';
import FullViewActiveIcon from 'img/full-view-active';
import SlimViewIcon from 'img/slim-view';
import SlimViewActiveIcon from 'img/slim-view-active';
import Task from 'components/task-item/StandardTaskItem/TaskItem';
import TaskListMembers from 'components/tasklist/TaskListMembers/TaskListMembers';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import listSectionSavedState, {
  FULL_VIEW,
  SLIM_VIEW,
} from 'helpers/list-secition-saved-state';
import { checkIfTasksHaveSubtasksOrCommnets } from 'helpers/tasklist-helpers';

import {
  Arrow,
  Tasks,
  ListDetailsContainer,
  ListDetailsHeader,
  ListNameSection,
  ViewIcon,
  ViewIconBox,
  IconsBox,
  ListNameContainer,
} from 'components/tasklist/DropdownListSection/styled';
import UniversalTooltipContainer from 'components/common/UniversalTooltipContainer';

const TaskListDetailsDropdown = ({
  list,
  tasks,
  currentUser,
  selectedTask,
  openDrawer,
  storeAsCurrentTask,
  isCompleteTab,
  toggleTaskStatus,
  toggleTaskPriority,
  reassignTask,
  updateDueDate,
  updateWorkflowStatus,
  quickAddTask,
  refreshView,
}) => {
  const sessionStorageKey = `${list.taskListIdentifier}-patient`;

  const { viewType, isOpen, switchOpen, setViewType } = listSectionSavedState(
    sessionStorageKey,
  );

  const areViewOptionsVisible = useMemo(() => {
    if (!isOpen) return false;

    return checkIfTasksHaveSubtasksOrCommnets(tasks);
  }, [isOpen, tasks]);

  const isFullView = viewType === FULL_VIEW;

  const { listName, taskListIdentifier, listUsers } = list;

  const listMembers = listUsers;

  return (
    <ListDetailsContainer>
      <ListDetailsHeader>
        <ListNameContainer>
          <Arrow
            alt="arrow"
            isOpen={isOpen}
            onClick={() => switchOpen(!isOpen)}
            src={ArrowIcon}
          />
          <ListNameSection>{listName}</ListNameSection>
        </ListNameContainer>
        {listMembers?.length > 0 && (
          <TaskListMembers
            members={listMembers}
            list={list}
            refreshMembers={refreshView}
          />
        )}
        <IconsBox>
          <ViewIconBox isHidden={!areViewOptionsVisible}>
            <UniversalTooltipContainer
              placement="top-end"
              label="Slim view. Just the task shows"
            >
              <ViewIcon
                alt="slim-view"
                src={isFullView ? SlimViewIcon : SlimViewActiveIcon}
                onClick={() => setViewType(SLIM_VIEW)}
              />
            </UniversalTooltipContainer>
          </ViewIconBox>
          <ViewIconBox isHidden={!areViewOptionsVisible}>
            <UniversalTooltipContainer
              placement="top-end"
              label="Full view. Task and comments show"
            >
              <ViewIcon
                alt="full-view"
                src={isFullView ? FullViewActiveIcon : FullViewIcon}
                onClick={() => setViewType(FULL_VIEW)}
              />
            </UniversalTooltipContainer>
          </ViewIconBox>
        </IconsBox>
      </ListDetailsHeader>
      <Tasks timeout={150} in={isOpen}>
        {!isCompleteTab && (
          <QuickAddTaskInput
            quickAddTask={taskName =>
              quickAddTask(taskName, taskListIdentifier)
            }
          />
        )}
        <div>
          {tasks?.map(task => (
            <Task
              key={task.taskIdentifier}
              currentUser={currentUser}
              isFullView={isFullView}
              openDrawer={openDrawer}
              storeAsCurrentTask={storeAsCurrentTask}
              toggleTaskPriority={toggleTaskPriority}
              task={task}
              groupId={tasks.taskIdentifier}
              draggableProvided={{}}
              isCompletedGroup={isCompleteTab}
              toggleCompleteTask={toggleTaskStatus}
              reassignTask={reassignTask}
              updateDueDate={updateDueDate}
              updateWorkflowStatus={updateWorkflowStatus}
              dragAndDropDisabled
              selectedTask={selectedTask}
              patientVisible={false}
            />
          ))}
        </div>
      </Tasks>
    </ListDetailsContainer>
  );
};

export default TaskListDetailsDropdown;
