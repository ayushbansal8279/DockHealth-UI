import React from 'react';
import NewTaskDrawerSubtask from '../NewTaskDrawerSubtask/NewTaskDrawerSubtask';
import NewTaskDrawerSubtasksLoader from '../NewTaskDrawerSubtasksLoader/NewTaskDrawerSubtasksLoader';
import { Container, Title, AddSubtaskButton } from './styled';

const NewTaskDrawerSubtasks = ({
  subtasks,
  subTasksCount,
  currentUser,
  onAddSubTask,
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
          <AddSubtaskButton onClick={onAddSubTask}>
            <span>+</span> Add subtask
          </AddSubtaskButton>
        </>
      )}
    </Container>
  );
};

export default NewTaskDrawerSubtasks;
