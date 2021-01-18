import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/full-view';
import FullViewActiveIcon from 'img/full-view-active';
import SlimViewIcon from 'img/slim-view';
import SlimViewActiveIcon from 'img/slim-view-active';
import StandardTaskItem from 'components/task-item/StandardTaskItem/StandardTaskItem';
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
  const quickAddTaskInputReference = useRef(null);

  const {
    addingNewSubtask,
    addingNewSubtaskParentId,
    subtaskShape,
  } = useSelector(state => ({
    addingNewSubtask: state.taskState.addingNewSubtask,
    addingNewSubtaskParentId: state.taskState.addingNewSubtaskParentId,
    subtaskShape: state.taskState.subtaskShape,
  }));

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
            ref={quickAddTaskInputReference}
            taskListIdentifier={list?.taskListIdentifier}
            quickAddTask={task => {
              quickAddTask({ ...task, taskListIdentifier });
              setTimeout(() => {
                quickAddTaskInputReference.current.focus();
              }, 0);
            }}
          />
        )}
        <div>
          {tasks?.map(task => (
            <StandardTaskItem
              key={task.taskIdentifier}
              currentUser={currentUser}
              isFullView={isFullView}
              openDrawer={openDrawer}
              storeAsCurrentTask={storeAsCurrentTask}
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
              addingNewSubtask={addingNewSubtask}
              addingNewSubtaskParentId={addingNewSubtaskParentId}
              subtaskShape={subtaskShape}
            />
          ))}
        </div>
      </Tasks>
    </ListDetailsContainer>
  );
};

export default TaskListDetailsDropdown;
