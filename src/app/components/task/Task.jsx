import React from 'react';

import Flag from '../common/Flag';
import AddSubtask from './AddSubtask';
import CompleteTaskConfirmationDialog from './CompleteTaskConfirmationDialog';
import initializeTaskHooks from './Task.Hooks';
import {
  TaskAnimationContainer,
  TaskContainer,
  TaskSelectionContainer,
} from './Task.styled';
import TaskBody from './TaskBody';

const DRAGGABLE_ITEM_CLASS = 'draggable-item';

const Task = props => {
  const {
    task,
    isSubtask,
    selectedTaskId,
    slimView,
    subtaskIndex,
    taskDrawerOpen,
    priority,
    taskList,
    isNewSubtask,
    animationContainer,
    sortableContainer,
    hasSubtasks,
    renderedSubtasks,
    isOpen,
    close,
    handleStatusChange,
    confirm,
    isSelfOrSubtaskActive,
  } = initializeTaskHooks({ props, DRAGGABLE_ITEM_CLASS });

  if (isSubtask && subtaskIndex == null) {
    return null;
  }

  return (
    <>
      <TaskAnimationContainer
        isNewSubtask={isNewSubtask}
        isSubtask={isSubtask}
        drawerOpen={taskDrawerOpen}
        ref={animationContainer}
        className={DRAGGABLE_ITEM_CLASS}
      >
        <TaskContainer isSubtask={isSubtask} hasSubtasks={hasSubtasks}>
          {!isSubtask && (
            <CompleteTaskConfirmationDialog
              isOpen={isOpen}
              close={close}
              confirm={confirm}
            />
          )}
          <TaskSelectionContainer isSelected={selectedTaskId === task.taskId}>
            <Flag priority={priority} />
            <TaskBody {...props} handleStatusChange={handleStatusChange} />
          </TaskSelectionContainer>
        </TaskContainer>
      </TaskAnimationContainer>
      <div ref={sortableContainer}>
        {(!slimView || (slimView && isSelfOrSubtaskActive)) &&
          renderedSubtasks.map((subtask, index) => (
            <Task
              key={subtask.taskId}
              {...props}
              task={{
                ...subtask,
                taskList,
              }}
              isSubtask
              isParentComplete={task.status === 'COMPLETE'}
              subtaskIndex={index + 1}
              isNewSubtask={subtask.isNewSubtask}
            />
          ))}
      </div>
      {!isSubtask && isSelfOrSubtaskActive && task.status !== 'COMPLETE' && (
        <AddSubtask padded taskId={task.taskId} />
      )}
    </>
  );
};

export default Task;
