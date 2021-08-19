import React from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import Subtask from '../Subtask/Subtask';
import SubtasksLoader from '../SubtasksLoader/SubtasksLoader';
import { Container, Title } from './styled';

const TasksList = ({ title, tasks, tasksCount, input }) => {
  const currentUser = useSelector(userProfileSelector);

  return (
    <Container>
      <Title>{title}</Title>
      {tasksCount > 0 && (!tasks || tasks.length === 0) ? (
        <SubtasksLoader rows={tasksCount || 4} />
      ) : (
        <>
          {tasks?.map(subtask => (
            <Subtask
              key={subtask.taskIdentifier}
              subtask={subtask}
              currentUser={currentUser}
            />
          ))}
        </>
      )}
      {input}
    </Container>
  );
};

export default TasksList;
