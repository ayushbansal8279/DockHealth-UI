import React from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import DrawerTask from '../DrawerTask/DrawerTask';
import DrawerTaskLoader from '../DrawerTaskLoader/DrawerTaskLoader';
import { Container, Title } from './styled';

const SubtasksSection = ({ tasks, tasksCount, input }) => {
  const currentUser = useSelector(userProfileSelector);

  return (
    <Container>
      <Title>Subtasks</Title>
      {tasksCount > 0 && (!tasks || tasks.length === 0) ? (
        <DrawerTaskLoader rows={tasksCount || 4} />
      ) : (
        <>
          {tasks?.map(task => (
            <DrawerTask
              key={task.taskIdentifier}
              subtask={task}
              currentUser={currentUser}
            />
          ))}
        </>
      )}
      {input}
    </Container>
  );
};

export default SubtasksSection;
