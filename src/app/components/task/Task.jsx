import React from 'react';

import Flag from '../common/Flag';
import AddSubtask from './AddSubtask';
import CompleteTaskConfirmationDialog from './CompleteTaskConfirmationDialog';
import initializeTaskHooks from './Task.Hooks';
import {
  TaskAnimationContainer,
  TaskContainer,
  TaskSelectionContainer,
} from './Task.Styled';
import TaskBody from './TaskBody';

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
    hasSubtasks,
    renderedSubtasks,
    isOpen,
    close,
    handleStatusChange,
    confirm,
    isSelfOrSubtaskActive,
  } = initializeTaskHooks({ props });

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
      >
        <TaskContainer isSubtask={isSubtask} hasSubtasks={hasSubtasks}>
          {!isSubtask && (
            <CompleteTaskConfirmationDialog
              isOpen={isOpen}
              close={close}
              confirm={confirm}
            />
          )}
          <TaskSelectionContainer
            isSelected={selectedTaskId === task.taskIdentifier}
          >
            <Flag priority={priority} />
            <TaskBody {...props} handleStatusChange={handleStatusChange} />
          </TaskSelectionContainer>
        </TaskContainer>
      </TaskAnimationContainer>
      <div>
        {(!slimView || (slimView && isSelfOrSubtaskActive)) &&
          renderedSubtasks.map((subtask, index) => (
            <Task
              key={subtask.taskIdentifier}
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
        <AddSubtask
          padded
          taskIdentifier={task.taskIdentifier}
          parentTask={task}
        />
      )}
    </>
  );
};

export default Task;
