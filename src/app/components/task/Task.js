import pick from 'ramda/es/pick';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import useBoolean from '../../hooks/useBoolean';
import useConfirmation from '../../hooks/useConfirmation';
import Flag from '../common/Flag';
import AddSubtask from './AddSubtask';
import ConfirmationDialog from './ConfirmationDialog';
import {
  TaskAnimationContainer,
  TaskBodyContainer,
  TaskContainer,
  TaskGrid,
  TaskSelectionContainer,
} from './Task.styled';
import TaskBody from './TaskBody';

const usePrevious = value => {
  const ref = useRef();
  useEffect(
    () => {
      ref.current = value;
    },
    [value],
  );
  return ref.current;
};

const Task = props => {
  const {
    task,
    isSubtask,
    markComplete,
    hideDate,
    hidePriority,
    selectedTaskId,
    disabled,
    hideCheckbox,
    storeAsCurrentTask,
    slimView,
    markAsUnread,
  } = props;
  const { subtasks, priority, taskList, isNewSubtask } = task;

  const [isCollapsed, setIsCollapsed, , toggleIsCollapsed] = useBoolean(true);
  const previousSelectedTaskId = usePrevious(selectedTaskId);
  const { addingNewSubtask, addingNewSubtaskParentId } = useSelector(state =>
    pick(['addingNewSubtask', 'addingNewSubtaskParentId'])(state.taskState),
  );
  const animationContainer = useRef(null);

  const hasSubtasks = subtasks.length > 0;

  const isSelfOrSubtaskActive =
    selectedTaskId === task.taskId ||
    Boolean(
      !isSubtask && subtasks.find(({ taskId }) => taskId === selectedTaskId),
    );

  useEffect(
    () => {
      if (isSubtask) {
        return;
      }

      if (
        selectedTaskId !== previousSelectedTaskId &&
        isCollapsed &&
        subtasks.find(subtask => subtask.taskId === selectedTaskId)
      ) {
        setIsCollapsed(false);
      }
    },
    [
      isCollapsed,
      isSubtask,
      previousSelectedTaskId,
      selectedTaskId,
      setIsCollapsed,
      subtasks,
    ],
  );

  useEffect(
    () => {
      if (isNewSubtask) {
        animationContainer.current.style.height =
          animationContainer.current.scrollHeight;
      }
    },
    [isNewSubtask],
  );

  useEffect(
    () => {
      if (
        slimView &&
        subtasks.find(({ taskId }) => taskId === selectedTaskId) &&
        !isSelfOrSubtaskActive
      ) {
        storeAsCurrentTask(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slimView],
  );

  // Check all subtasks confirmation dialog
  const { isOpen, close, handleStatusChange, confirm } = useConfirmation(
    task,
    markComplete,
  );

  const isNewSubtaskForCurrentTask =
    addingNewSubtask &&
    !isNewSubtask &&
    addingNewSubtaskParentId === task.taskId;

  const renderedSubtasks = isNewSubtaskForCurrentTask
    ? subtasks.concat({
        subtasks: [],
        isNewSubtask: true,
        taskId: 'new-subtask',
      })
    : subtasks;

  return (
    <>
      <TaskAnimationContainer
        isNewSubtask={isNewSubtask}
        isSubtask={isSubtask}
        ref={animationContainer}
      >
        <TaskContainer
          isCollapsed={isCollapsed}
          isSubtask={isSubtask}
          hasSubtasks={hasSubtasks}
        >
          {!isSubtask && (
            <ConfirmationDialog
              isOpen={isOpen}
              close={close}
              confirm={confirm}
            />
          )}
          <TaskSelectionContainer isSelected={selectedTaskId === task.taskId}>
            <TaskGrid container wrap="nowrap">
              <TaskBodyContainer isSubtask={isSubtask} item xs={12}>
                <Flag absolute priority={priority} />
                <TaskBody {...props} handleStatusChange={handleStatusChange} />
              </TaskBodyContainer>
            </TaskGrid>
          </TaskSelectionContainer>
        </TaskContainer>
      </TaskAnimationContainer>
      {(!slimView || (slimView && isSelfOrSubtaskActive)) &&
        renderedSubtasks.map((subtask, index) => (
          <Task
            key={subtask.taskId}
            task={{
              ...subtask,
              taskList,
            }}
            isSubtask
            isParentComplete={task.status === 'COMPLETE'}
            selectedTaskId={selectedTaskId}
            markComplete={markComplete}
            hideDate={hideDate}
            hidePriority={hidePriority}
            hideCheckbox={hideCheckbox}
            disabled={disabled}
            storeAsCurrentTask={storeAsCurrentTask}
            markAsUnread={markAsUnread}
            subtaskIndex={index + 1}
            isNewSubtask={subtask.isNewSubtask}
            slimView={slimView}
          />
        ))}
      {isSelfOrSubtaskActive && !isSubtask && task.status !== 'COMPLETE' && (
        <AddSubtask padded taskId={task.taskId} />
      )}
    </>
  );
};

export default Task;
