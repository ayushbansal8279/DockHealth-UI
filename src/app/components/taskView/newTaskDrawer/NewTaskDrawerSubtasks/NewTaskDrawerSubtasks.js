import React from 'react';
import NewTaskDrawerSubtask from '../NewTaskDrawerSubtask/NewTaskDrawerSubtask';
import NewTaskDrawerSubtasksLoader from '../NewTaskDrawerSubtasksLoader/NewTaskDrawerSubtasksLoader';
import NewTaskDrawerQuickAddSubtask from './NewTaskDrawerQuickAddSubtask';
import { Container, Title } from './styled';

const NewTaskDrawerSubtasks = ({
  subtasks,
  subTasksCount,
  currentUser,
  taskListIdentifier,
  onQuickAddTask,
}) => {
  return (
    <Container>
      <Title>Subtasks</Title>
      {subTasksCount > 0 && (!subtasks || subtasks.length === 0) ? (
        <NewTaskDrawerSubtasksLoader rows={subTasksCount || 4} />
      ) : (
        <>
          {subtasks?.map(subtask => (
            <NewTaskDrawerSubtask
              key={subtask.taskIdentifier}
              subtask={subtask}
              currentUser={currentUser}
            />
          ))}
        </>
      )}
      <NewTaskDrawerQuickAddSubtask
        taskListIdentifier={taskListIdentifier}
        validator={value => {
          if ([...value]?.filter(char => char !== ' ').length < 2)
            return 'The task description is too short (min. 2 characters)';

          return null;
        }}
        onQuickAddTask={onQuickAddTask}
      />
    </Container>
  );
};

export default NewTaskDrawerSubtasks;
